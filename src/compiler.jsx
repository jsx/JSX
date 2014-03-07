/*
 * Copyright (c) 2012,2013 DeNA Co., Ltd. et al.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to
 * deal in the Software without restriction, including without limitation the
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 * sell copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 * IN THE SOFTWARE.
 */

import "./analysis.jsx";
import "./parser.jsx";
import "./classdef.jsx";
import "./type.jsx";
import "./emitter.jsx";
import "./platform.jsx";
import "./util.jsx";
import "./optimizer.jsx";
import "./completion.jsx";
import "./instruments.jsx";
import "./statement.jsx";
import "./transformer.jsx";


class Compiler {

	static const MODE_COMPILE = 0;
	static const MODE_PARSE = 1;
	static const MODE_COMPLETE = 2;
	static const MODE_DOC = 3;

	var _platform : Platform;
	var _mode : number;
	var _transformCommands : TransformCommand[];
	var _optimizer : Optimizer;
	var _warningFilters : Array.<function(:CompileWarning):Nullable.<boolean>>;
	var _warningAsError : boolean;
	var _parsers : Parser[];
	var _fileCache : Map.<string>;
	var _searchPaths : string[];
	var _builtinParsers : Parser[];
	var _userEnvironment : Map.<string>;
	var _emitter : Emitter;

	function constructor (platform : Platform) {
		this._platform = platform;
		this._mode = Compiler.MODE_COMPILE;
		this._transformCommands = [] : Array.<TransformCommand>;
		this._optimizer = null;
		this._warningFilters = [] : Array.<function(:CompileWarning):Nullable.<boolean>>;
		this._warningAsError = false;
		this._parsers = new Parser[];
		this._fileCache = new Map.<string>;
		this._searchPaths = [ this._platform.getRoot() + "/lib/common" ];
		// load the built-in classes
		this.addSourceFile(null, this._platform.getRoot() + "/lib/built-in.jsx");
		this._builtinParsers = this._parsers.concat(new Parser[]); // shallow clone
		this._userEnvironment = new Map.<string>;
	}

	function addSearchPath (path : string) : void {
		this._searchPaths.unshift(path);
	}

	function getPlatform () : Platform {
		return this._platform;
	}

	function getMode () : number {
		return this._mode;
	}

	function setMode (mode : number) : Compiler {
		this._mode = mode;
		return this;
	}

	function getEmitter () : Emitter {
		return this._emitter;
	}

	function setEmitter (emitter : Emitter) : void {
		this._emitter = emitter;
	}

	function setTransformCommands(cmds : string[]) : Nullable.<string> {
		for (var i = 0; i < cmds.length; ++i) {
			var cmd = cmds[i];
			switch (cmd) {
			case "generator":
				this._transformCommands.push(new GeneratorTransformCommand(this)); break;
			case "cps":
				this._transformCommands.push(new CPSTransformCommand(this)); break;
			default:
				return "unknown transformation command: " + cmd;
			}
		}
		return null;
	}

	function setOptimizer (optimizer : Optimizer) : void {
		this._optimizer = optimizer;
	}

	function getWarningFilters () : Array.<function(:CompileWarning):Nullable.<boolean>> {
		return this._warningFilters;
	}

	function setWarningAsError(f : boolean) : void {
		this._warningAsError = f;
	}

	function getParsers () : Parser[] {
		return this._parsers;
	}

	function getBuiltinParsers () : Parser[] {
		return this._builtinParsers;
	}

	function getUserEnvironment() : Map.<string> {
		return this._userEnvironment;
	}

	function addSourceFile (token : Token, path : string) : Parser {
		return this.addSourceFile(token, path, null);
	}

	function addSourceFile (token : Token, path : string, completionRequest : CompletionRequest) : Parser {
		var parser;
		if ((parser = this.findParser(path)) == null) {
			parser = new Parser(token, path, completionRequest);
			this._parsers.push(parser);
		}
		return parser;
	}

	function findParser (path : string) : Parser {
		for (var i = 0; i < this._parsers.length; ++i)
			if (this._parsers[i].getPath() == path)
				return this._parsers[i];
		return null;
	}

	function compile () : boolean {
		var errors = new CompileError[];
		// parse all files
		for (var i = 0; i < this._parsers.length; ++i) {
			if (! this._parseFile(errors, i)) {
				if (! this._handleErrors(errors))
					return false;
			}
		}
		switch (this._mode) {
		case Compiler.MODE_PARSE:
			return true;
		}
		// fix-up classdefs to start semantic analysis
		this.normalizeClassDefs(errors);
		if (! this._handleErrors(errors))
			return false;
		// resolve imports
		this._resolveImports(errors);
		if (! this._handleErrors(errors))
			return false;
		// register backing class for primitives
		var builtins = this._builtinParsers[0];
		BooleanType._classDef = builtins.lookup(errors, null, "Boolean");
		NumberType._classDef = builtins.lookup(errors, null, "Number");
		StringType._classDef = builtins.lookup(errors, null, "String");
		FunctionType._classDef = builtins.lookup(errors, null, "Function");
		if (! this._handleErrors(errors))
			return false;
		// semantic analysis
		this._resolveTypes(errors);
		if (! this._handleErrors(errors))
			return false;
		this._exportEntryPoints();
		this._analyze(errors);
		if (! this._handleErrors(errors))
			return false;
		switch (this._mode) {
		case Compiler.MODE_COMPLETE:
			return true;
		case Compiler.MODE_DOC:
			return true;
		}
		// transformation
		this._transform(errors);
		if (! this._handleErrors(errors))
			return false;
		// optimization
		this._optimize();
		// TODO peep-hole and dead store optimizations, etc.
		this._generateCode(errors);
		if (! this._handleErrors(errors))
			return false;
		return true;
	}

	/**
	 * Returns a JSON data structure of parsed class definitions
	 */
	function getAST () : variant {
		var classDefs = new ClassDefinition[];
		for (var i = 0; i < this._parsers.length; ++i) {
			classDefs = classDefs.concat(this._parsers[i].getClassDefs());
			classDefs = classDefs.concat(this._parsers[i].getTemplateClassDefs().map.<ClassDefinition>((classDef) -> classDef));
		}
		return ClassDefinition.serialize(classDefs);
	}

	function getFileContent (errors : CompileError[], sourceToken : Token, path : string) : Nullable.<string> {
		assert path != "";
		if(this._fileCache[path] == null) {
			try {
				this._fileCache[path] = this._platform.load(path);
			} catch (e : Error) {
				errors.push(new CompileError(sourceToken, "could not open file: " + path + ", " + e.toString()));
				this._fileCache[path] = null;
			}
		}
		return this._fileCache[path];
	}

	function _parseFile (errors : CompileError[], parserIndex : number) : boolean {
		var parser = this._parsers[parserIndex];
		// read file
		var content = this.getFileContent(errors, parser.getSourceToken(), parser.getPath());
		if (content == null) {
			// call parse() to initialize parser's state
			// because some compilation mode continues to run after errors.
			parser.parse("", new CompileError[]);
			return false;
		}
		// check conflicts
		var conflictWarning = this._checkConflictOfNpmModulesParsed(parserIndex) ?: this._checkConflictOfIdenticalFiles(parserIndex, content);
		if (conflictWarning != null) {
			errors.push(conflictWarning);
		}
		// parse
		parser.parse(content, errors);
		// register imported files
		if (this._mode != Compiler.MODE_PARSE) {
			var imports = parser.getImports();
			for (var i = 0; i < imports.length; ++i) {
				if (! this._handleImport(errors, parser, imports[i]))
					return false;
			}
		}
		return true;
	}

	var _npmModulesParsed = new Map.<number>; // map of module_name => parser index

	function _checkConflictOfNpmModulesParsed(parserIndex : number) : CompileWarning {
		function getModuleNameAndPath(path : string) : string[] {
			var match = path.match(/^(?:.*\/|)node_modules\/([^\/]+)\//);
			if (match == null) {
				return null;
			}
			return [
				match[1],
				match[0].substring(0, match[0].length - 1), // strip trailing "/"
			];
		}
		var parser = this._parsers[parserIndex];
		var moduleNameAndPath = getModuleNameAndPath(parser.getPath());
		// return if the source file is not part of a npm module
		if (moduleNameAndPath == null) {
			return null;
		}
		// register and return if the source file is a npm module that is loaded for the first time
		if (! this._npmModulesParsed.hasOwnProperty(moduleNameAndPath[0])) {
			this._npmModulesParsed[moduleNameAndPath[0]] = parserIndex;
			return null;
		}
		// check conflict
		var offendingParser = this._parsers[this._npmModulesParsed[moduleNameAndPath[0]]];
		var offendingModulePath = getModuleNameAndPath(offendingParser.getPath())[1];
		if (offendingModulePath == moduleNameAndPath[1]) {
			return null;
		}
		// found conflict
		return new CompileWarning(parser.getSourceToken(), "please consider running \"npm dedupe\"; the NPM module has already been read from a different location:")
			.addCompileNote(new CompileNote(offendingParser.getSourceToken(), "at first from here as: " + offendingParser.getPath()))
			.addCompileNote(new CompileNote(parser.getSourceToken(), "and now from here as: " + parser.getPath()))
			as CompileWarning;
	}

	function _checkConflictOfIdenticalFiles(parserIndex : number, content : string) : CompileWarning {
		var parser = this._parsers[parserIndex];
		for (var i = 0; i != parserIndex; ++i) {
			if (this._parsers[i].getContent() == content
				&& Util.basename(this._parsers[i].getPath()) == Util.basename(parser.getPath())) {
				return new CompileWarning(parser.getSourceToken(), "the file (with identical content) has been read from different locations:")
					.addCompileNote(new CompileNote(parser.getSourceToken(), "from here as: " + parser.getPath()))
					.addCompileNote(new CompileNote(this._parsers[i].getSourceToken(), "from here as: " + this._parsers[i].getPath()))
					as CompileWarning;
			}
		}
		return null;
	}

	function _handleImport (errors : CompileError[], parser : Parser, imprt : Import) : boolean {
		if (imprt instanceof WildcardImport) {
			var wildImprt = imprt as WildcardImport;
			// read the files from a directory
			var resolvedDir = this._resolvePath(wildImprt.getFilenameToken().getFilename(), wildImprt.getDirectory(), true);
			var files = new string[];
			try {
				files = this._platform.getFilesInDirectory(resolvedDir);
			} catch (e : Error) {
				errors.push(new CompileError(wildImprt.getFilenameToken(), "could not read files in directory: " + resolvedDir + ", " + e.toString()));
				return false;
			}
			var found = false;
			for (var i = 0; i < files.length; ++i) {
				if (files[i].length >= wildImprt.getSuffix().length
					&& files[i].charAt(0) != "."
					&& files[i].substring(files[i].length - wildImprt.getSuffix().length) == wildImprt.getSuffix()) {
					var path = resolvedDir + "/" + files[i];
					if (path != parser.getPath()) {
						var newParser = this.addSourceFile(wildImprt.getFilenameToken(), resolvedDir + "/" + files[i], null);
						wildImprt.addSource(newParser);
						found = true;
					}
				}
			}
			if (! found) {
				errors.push(new CompileError(wildImprt.getFilenameToken(), "no matching files found in directory: " + resolvedDir));
				return false;
			}
		} else {
			// read one file
			var path = this._resolvePath(imprt.getFilenameToken().getFilename(), Util.decodeStringLiteral(imprt.getFilenameToken().getValue()), false);
			if (path == parser.getPath()) {
				errors.push(new CompileError(imprt.getFilenameToken(), "cannot import itself"));
				return false;
			}
			var newParser = this.addSourceFile(imprt.getFilenameToken(), path, null);
			imprt.addSource(newParser);
		}
		return true;
	}

	function forEachClassDef (f : function(:Parser, :ClassDefinition):boolean) : boolean {
		function onClassDef (parser : Parser, classDef : ClassDefinition) : boolean {
			if (! f(parser, classDef))
				return false;
			var inners = classDef.getInnerClasses();
			for (var i = 0; i < inners.length; ++i) {
				if (! onClassDef(parser, inners[i]))
					return false;
			}
			return true;
		}

		for (var i = 0; i < this._parsers.length; ++i) {
			var parser = this._parsers[i];
			var classDefs = parser.getClassDefs();
			for (var j = 0; j < classDefs.length; ++j) {
				if (! onClassDef(parser, classDefs[j]))
					return false;
			}
		}
		return true;
	}

	function normalizeClassDefs (errors : CompileError[]) : void {
		this.forEachClassDef((parser, classDef) -> {
			classDef.normalizeClassDefs(errors);
			return true;
		});
	}

	function _resolveImports (errors : CompileError[]) : void {
		for (var i = 0; i < this._parsers.length; ++i) {
			// built-in classes become implicit imports
			this._parsers[i].registerBuiltinImports(this._builtinParsers);
			// set source of every import
			var imports = this._parsers[i].getImports();
			for (var j = 0; j < imports.length; ++j) {
				imports[j].assertExistenceOfNamedClasses(errors);
			}
		}
	}

	function _resolveTypes (errors : CompileError[]) : void {
		this.forEachClassDef(function (parser : Parser, classDef : ClassDefinition) : boolean {
			classDef.resolveTypes(new AnalysisContext(errors, parser, null));
			return true;
		});
	}

	function _analyze (errors : CompileError[]) : void {
		var createContext = function (parser : Parser) : AnalysisContext {
			return new AnalysisContext(
				errors,
				parser,
				function (parser : Parser, classDef : ClassDefinition) : ClassDefinition {
					classDef.setAnalysisContextOfVariables(createContext(parser));
					classDef.analyze(createContext(parser));
					return classDef;
				});
		};
		// set analyzation context of every member variable
		this.forEachClassDef(function (parser : Parser, classDef : ClassDefinition) {
			classDef.setAnalysisContextOfVariables(createContext(parser));
			return true;
		});
		// analyze every classdef
		this.forEachClassDef(function (parser : Parser, classDef : ClassDefinition) {
			classDef.analyze(createContext(parser));
			return true;
		});
		// NOTE: template inner classes might not be analyzed in first time,
		//       so the second time we analyze such a class
		// see t/run/322
		this.forEachClassDef(function (parser : Parser, classDef : ClassDefinition) {
			classDef.analyze(createContext(parser));
			return true;
		});
		// analyze unused member variables in every classdef
		this.forEachClassDef(function (parser : Parser, classDef : ClassDefinition) {
			classDef.analyzeUnusedVariables();
			return true;
		});
	}

	function _transform (errors : CompileError[]) : void {
		function doit(cmd : TransformCommand) : boolean {
			cmd.setup(errors);
			cmd.performTransformation();
			return errors.length == 0;
		}
		// apply the registered transformations
		for (var i = 0; i < this._transformCommands.length; ++i) {
			if (! doit(this._transformCommands[i]))
				return;
		}
		// apply the fixed transformations
		if (! doit(new FixedExpressionTransformCommand(this)))
			return;
	}

	function _optimize () : void {
		if (this._optimizer != null)
			this._optimizer.setCompiler(this).performOptimization();
	}

	function _generateCode (errors : CompileError[]) : void {
		// build list of all classDefs
		var classDefs = new ClassDefinition[];
		for (var i = 0; i < this._parsers.length; ++i) {
			classDefs = classDefs.concat(this._parsers[i].getClassDefs());

			// to emit native classes with in-line native definitions
			this._parsers[i].getTemplateClassDefs().forEach((templateClassDef) -> {
				if ((templateClassDef.flags() & ClassDefinition.IS_NATIVE) != 0 && templateClassDef.getNativeSource() != null) {
					classDefs.push(templateClassDef);
				}
			});
		}
		for (var i = 0; i < classDefs.length; ++i) {
			if (classDefs[i].getInnerClasses().length != 0)
				classDefs = classDefs.concat(classDefs[i].getInnerClasses());
		}
		// check that there are no conflict of names bet. native classes
		var nativeClassNames = new Map.<ClassDefinition>;
		var foundConflict = false;
		classDefs.forEach(function (classDef) {
			if ((classDef.flags() & ClassDefinition.IS_NATIVE) == 0) {
				return;
			}
			if (nativeClassNames.hasOwnProperty(classDef.className())
				&& ! (classDef instanceof InstantiatedClassDefinition
					&& nativeClassNames[classDef.className()] instanceof InstantiatedClassDefinition
					&& (classDef as InstantiatedClassDefinition).getTemplateClass() == (nativeClassNames[classDef.className()] as InstantiatedClassDefinition).getTemplateClass())
				&& classDef.getNativeSource() == null
				&& classDef.getOuterClassDef() == null
			) {
				errors.push(
					new CompileError(classDef.getToken(), "native class with same name is already defined")
					.addCompileNote(new CompileNote(nativeClassNames[classDef.className()].getToken(), "here")));
				foundConflict = true;
				return;
			}
			nativeClassNames[classDef.className()] = classDef;
		});
		if (foundConflict) {
			return;
		}
		// reorder the classDefs so that base classes would come before their children
		var getMaxIndexOfClasses = function (deps : ClassDefinition[]) : number {
			deps = deps.concat([]); // clone the array
			if (deps.length == 0)
				return -1;
			for (var i = 0; i < classDefs.length; ++i) {
				for (var j = 0; j < deps.length; ++j) {
					if (classDefs[i] == deps[j]) {
						deps.splice(j, 1);
						if (deps.length == 0)
							return i;
					}
				}
			}
			throw new Error("logic flaw, could not find class definition of '" + deps[0].className() + "'");
		};
		for (var i = 0; i < classDefs.length;) {
			if ((classDefs[i].flags() & ClassDefinition.IS_NATIVE) != 0) {
				var maxIndexOfClasses = -1;
			} else {
				var deps = classDefs[i].implementTypes().map.<ClassDefinition>(function (t) { return t.getClassDef(); }).concat([]);
				if (classDefs[i].extendType() != null)
					deps.unshift(classDefs[i].extendType().getClassDef());
				if (classDefs[i].getOuterClassDef() != null && deps.indexOf(classDefs[i].getOuterClassDef()) == -1)
					deps.unshift(classDefs[i].getOuterClassDef());
				maxIndexOfClasses = getMaxIndexOfClasses(deps);
			}
			if (maxIndexOfClasses > i) {
				classDefs.splice(maxIndexOfClasses + 1, 0, classDefs[i]);
				classDefs.splice(i, 1);
			} else {
				++i;
			}
		}
		// emit
		this._emitter.emit(classDefs);
	}

	function _exportEntryPoints() : void {
		this.forEachClassDef(function (parser, classDef) {
			switch (classDef.classFullName()) {
			case "_Main":
				classDef.setFlags(classDef.flags() | ClassDefinition.IS_EXPORT);
				classDef.forEachMemberFunction(function (funcDef) {
					if ((funcDef.flags() & ClassDefinition.IS_STATIC) != 0
						&& funcDef.name() == "main"
						&& funcDef.getArguments().length == 1
						&& Util.isArrayOf(funcDef.getArgumentTypes()[0].getClassDef(), Type.stringType)) {
						funcDef.setFlags(funcDef.flags() | ClassDefinition.IS_EXPORT);
					}
					return true;
				});
				break;
			case "_Test":
				classDef.setFlags(classDef.flags() | ClassDefinition.IS_EXPORT);
				classDef.forEachMemberFunction(function (funcDef) {
					if ((funcDef.flags() & ClassDefinition.IS_STATIC) == 0
						&& (funcDef.name().match(/^test/) || funcDef.name() == "constructor")
						&& funcDef.getArguments().length == 0) {
						funcDef.setFlags(funcDef.flags() | ClassDefinition.IS_EXPORT);
					}
					return true;
				});
				break;
			}
			return true;
		});
	}

	function _handleErrors (errors : CompileError[]) : boolean {
		// ignore all messages on completion mode
		if (this._mode == Compiler.MODE_COMPLETE) {
			errors.splice(0, errors.length);
			return true;
		}
		// print issues
		var isFatal = false;
		errors.forEach(function (error) {
			if (error instanceof CompileWarning) {
				var warning = error as CompileWarning;
				var doWarn;
				for (var i = 0; i < this._warningFilters.length; ++i) {
					if ((doWarn = this._warningFilters[i](warning)) != null)
						break;
				}
				if (doWarn != false) {
					this._platform.warn(warning.format(this.getPlatform()));
					warning.getCompileNotes().forEach(function (note) {
						this._platform.warn(note.format(this.getPlatform()));
					});
					if (this._warningAsError) {
						isFatal = true;
					}
				}
			} else {
				this._platform.error(error.format(this.getPlatform()));
				error.getCompileNotes().forEach(function (note) {
					this._platform.error(note.format(this.getPlatform()));
				});
				isFatal = true;
			}
		});
		// clear all errors
		errors.splice(0, errors.length);
		return ! isFatal;
	}

	var _packageJsonCache = new Map.<Map.<variant>>;

	function _readPackageJson(moduleDir : string) : Map.<variant> {
		if (this._packageJsonCache.hasOwnProperty(moduleDir)) {
			return this._packageJsonCache[moduleDir];
		}
		var json = null : Map.<variant>;
		if (this._platform.fileExists(moduleDir + "/package.json")) {
			try {
				var contents = this._platform.load(moduleDir + "/package.json");
				json = JSON.parse(contents) as Map.<variant>;
			} catch (e : variant) {
				this._platform.warn("could not parse file:" + moduleDir + "/package.json");
			}
		}
		this._packageJsonCache[moduleDir] = json;
		return json;
	}

	function _resolvePathFromNodeModules (srcDir : string, givenPath : string, isWildcard : boolean) : string {

		var firstSlashAtGivenPath = givenPath.indexOf("/");
		var moduleName = firstSlashAtGivenPath != -1 ? givenPath.substring(0, firstSlashAtGivenPath) : givenPath;

		// search for givenPath in given "node_modules" dir
		function lookupInNodeModules(nodeModulesDir : string) : string {
			var moduleDir = nodeModulesDir + "/" + moduleName;

			// return if module does not exist
			if (! this._platform.fileExists(moduleDir)) {
				return "";
			}

			// found the package, read package.json
			var packageJson = this._readPackageJson(moduleDir);
			if (packageJson == null) {
				packageJson = {};
			}

			if (isWildcard || firstSlashAtGivenPath != -1) {
				// if given path is package/filename, then return a filename relative to package.json/[directories]/[lib] (or default to "lib")
				var libDir = packageJson["directories"] && packageJson["directories"]["lib"]
					? packageJson["directories"]["lib"] as string
					: "lib";
				var subPathWithLeadingSlash = firstSlashAtGivenPath != -1 ? givenPath.substring(firstSlashAtGivenPath): "";
				return Util.resolvePath(moduleDir + "/" + libDir + subPathWithLeadingSlash);
			} else {
				// given path did not contain "/", so return package.json/[main] or "index.jsx"
				var main = packageJson["main"] ? packageJson["main"] as string : "index.jsx";
				return Util.resolvePath(moduleDir + "/" + main);
			}
		}

		// lookup dependencies (from "srcDir/node_modules", "srcDir/../../node_modules", ...)
		while (true) {
			var path = lookupInNodeModules(srcDir + "/node_modules");
			if (path != "") {
				return path;
			}
			// lookup parent dependencies
			var match = srcDir.match(/^(.*)\/node_modules\/[^\/]+$/);
			if (match == null) {
				break;
			}
			srcDir = match[1];
		}

		return "";
	}

	function _resolvePath (srcPath : string, givenPath : string, isWildcard : boolean) : string {
		/*
		the search order is: 1) --add-search-path, 2) node_modules/, 3) relative to src file

		This is defined as such to provide freedom to users:

		- users may use ```import "./foo.jsx"``` to explicitly specify 3
		- users may use --add-search-path explicitly to avoid diamond dependency problem of NPM
		*/
		if (givenPath.match(/^\.{1,2}\//) == null) {
			// search the file from [one-of-the-search-paths]/givenPath
			var searchPaths = this._searchPaths.concat(this._emitter.getSearchPaths());
			for (var i = 0; i < searchPaths.length; ++i) {
				var path = Util.resolvePath(searchPaths[i] + "/" + givenPath);
				// check the existence of the file, at the same time filling the cache
				if (this._platform.fileExists(path))
					return path;
			}
			// search srcDir/node_modules
			var srcDir = Util.dirname(srcPath);
			var path = this._resolvePathFromNodeModules(srcDir, givenPath, isWildcard);
			if (path != "")
				return path;
			// search from [cwd]/node_modules
			if (srcDir != ".") {
				path = this._resolvePathFromNodeModules(".", givenPath, isWildcard);
				if (path != "")
					return path;
			}
		}
		// return path relative to srcPath
		var lastSlashAt = srcPath.lastIndexOf("/");
		path = Util.resolvePath((lastSlashAt != -1 ? srcPath.substring(0, lastSlashAt + 1) : "") + givenPath);
		return path;
	}

}

// vim: set noexpandtab:
