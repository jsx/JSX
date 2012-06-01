/*
 * Copyright (c) 2012 DeNA Co., Ltd.
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

var Class = require("./Class");
eval(Class.$import("./parser"));
eval(Class.$import("./classdef"));
eval(Class.$import("./type"));
eval(Class.$import("./emitter"));
eval(Class.$import("./platform"));
eval(Class.$import("./util"));

"use strict";

var Compiler = exports.Compiler = Class.extend({

	$MODE_COMPILE: 0,
	$MODE_PARSE: 1,

	constructor: function (platform) {
		this._platform = platform;
		this._mode = Compiler.MODE_COMPILE;
		this._optimizer = null;
		this._parsers = [];
		this._fileCache = {};
		this._searchPaths = [ this._platform.getRoot() + "/lib/common" ];
		// load the built-in classes
		this.addSourceFile(null, this._platform.getRoot() + "/lib/built-in.jsx");
		this._builtinParsers = this._parsers.concat([]); // shallow clone
	},

	addSearchPath: function(path) {
		this._searchPaths.unshift(path);
	},

	getPlatform: function () {
		return this._platform;
	},

	getMode: function () {
		return this._mode;
	},

	setMode: function (mode) {
		this._mode = mode;
		return this;
	},

	setEmitter: function (emitter) {
		this._emitter = emitter;
	},

	setOptimizer: function (optimizer) {
		this._optimizer = optimizer;
	},

	setEnableInlining: function (mode) {
		this._enableInlining = mode;
	},

	addSourceFile: function (token, path) {
		var parser;
		if ((parser = this.findParser(path)) == null) {
			parser = new Parser(token, path);
			this._parsers.push(parser);
		}
		return parser;
	},

	findParser: function (path) {
		for (var i = 0; i < this._parsers.length; ++i)
			if (this._parsers[i].getPath() == path)
				return this._parsers[i];
		return null;
	},

	compile: function () {
		var errors = []; // new CompileError[]()
		// parse all files
		for (var i = 0; i < this._parsers.length; ++i) {
			if (! this.parseFile(errors, this._parsers[i])) {
				this._printErrors(errors);
				return false;
			}
		}
		switch (this._mode) {
		case Compiler.MODE_PARSE:
			return true;
		}
		// resolve imports
		this._resolveImports(errors);
		if (errors.length != 0) {
			this._printErrors(errors);
			return false;
		}
		// register backing class for primitives
		var builtins = this.findParser(this._platform.getRoot() + "/lib/built-in.jsx");
		BooleanType._classDef = builtins.lookup(errors, null, "Boolean");
		NumberType._classDef = builtins.lookup(errors, null, "Number");
		StringType._classDef = builtins.lookup(errors, null, "String");
		FunctionType._classDef = builtins.lookup(errors, null, "Function");
		if (errors.length != 0) {
			this._printErrors(errors);
			return false;
		}
		// template instantiation
		this._instantiateTemplates(errors);
		if (errors.length != 0) {
			this._printErrors(errors);
			return false;
		}
		// semantic analysis
		this._resolveTypes(errors);
		if (errors.length != 0) {
			this._printErrors(errors);
			return false;
		}
		this._analyze(errors);
		if (errors.length != 0) {
			this._printErrors(errors);
			return false;
		}
		// optimization
		this._optimize();
		// TODO peep-hole and dead store optimizations, etc.
		this._generateCode();
		return true;
	},

	getAST: function() {
		var classDefs = [];
		for (var i = 0; i < this._parsers.length; ++i) {
			classDefs = classDefs.concat(this._parsers[i].getClassDefs());
		}
		return ClassDefinition.serialize(classDefs);
	},

	getFileContent: function (errors, sourceToken, path) {
		if(this._fileCache[path] == null) {
			try {
				this._fileCache[path] = this._platform.load(path);
			} catch (e) {
				errors.push(new CompileError(sourceToken, "could not open file: " + path + ", " + e.toString()));
				this._fileCache[path] = null;
			}
		}
		return this._fileCache[path];
	},

	parseFile: function (errors, parser) {
		// read file
		var content = this.getFileContent(errors, parser.getSourceToken(), parser.getPath());
		if (content == null)
			return false;
		// parse
		parser.parse(content, errors);
		if (errors.length != 0)
			return false;
		// register imported files
		if (this._mode != Compiler.MODE_PARSE) {
			var imports = parser.getImports();
			for (var i = 0; i < imports.length; ++i) {
				if (! this._handleImport(errors, parser, imports[i]))
					return false;
			}
		}
		return true;
	},

	_handleImport: function (errors, parser, imprt) {
		if (imprt instanceof WildcardImport) {
			// read the files from a directory
			var resolvedDir = this._resolvePath(imprt.getFilenameToken().getFilename(), imprt.getDirectory());
			try {
				var files = this._platform.getFilesInDirectory(resolvedDir);
			} catch (e) {
				errors.push(new CompileError(imprt.getFilenameToken(), "could not read files in directory: " + resolvedDir + ", " + e.toString()));
				return false;
			}
			var found = false;
			for (var i = 0; i < files.length; ++i) {
				if (files[i].length >= imprt.getSuffix().length
					&& files[i].charAt(0) != "."
					&& files[i].substring(files[i].length - imprt.getSuffix().length) == imprt.getSuffix()) {
					var path = resolvedDir + "/" + files[i];
					if (path != parser.getPath()) {
						var parser = this.addSourceFile(imprt.getFilenameToken(), resolvedDir + "/" + files[i]);
						imprt.addSource(parser);
						found = true;
					}
				}
			}
			if (! found) {
				errors.push(new CompileError(imprt.getFilenameToken(), "no matching files found in directory: " + resolvedDir));
				return false;
			}
		} else {
			// read one file
			var path = this._resolvePath(imprt.getFilenameToken().getFilename(), Util.decodeStringLiteral(imprt.getFilenameToken().getValue()));
			if (path == parser.getPath()) {
				errors.push(new CompileError(imprt.getFilenameToken(), "cannot import itself"));
				return false;
			}
			var parser = this.addSourceFile(imprt.getFilenameToken(), path);
			imprt.addSource(parser);
		}
		return true;
	},

	forEachClassDef: function (f) {
		for (var i = 0; i < this._parsers.length; ++i) {
			var parser = this._parsers[i];
			var classDefs = parser.getClassDefs();
			for (var j = 0; j < classDefs.length; ++j) {
				if (! f(parser, classDefs[j]))
					return false;
			}
		}
		return true;
	},

	_resolveImports: function (errors) {
		for (var i = 0; i < this._parsers.length; ++i) {
			// built-in classes become implicit imports
			this._parsers[i].registerBuiltinImports(this._builtinParsers);
			// set source of every import
			var imports = this._parsers[i].getImports();
			for (var j = 0; j < imports.length; ++j) {
				imports[j].assertExistenceOfNamedClasses(errors);
			}
		}
	},

	_instantiateTemplates: function (errors) {
		for (var i = 0; i < this._parsers.length; ++i) {
			var templateInstantiationRequests = this._parsers[i].getTemplateInstantiationRequests();
			for (var j = 0; j < templateInstantiationRequests.length; ++j)
				this._instantiateTemplate(errors, this._parsers[i], templateInstantiationRequests[j], false);
		}
	},

	_instantiateTemplate: function (errors, parser, request, resolveImmmediately) {
		var concreteClassName = Type.templateTypeToString(request.getClassName(), request.getTypeArguments());
		// return immediately if instantiated already
		var classDefs = parser.lookup(errors, request.getToken(), concreteClassName);
		if (classDefs != null)
			return classDefs;
		// instantiate
		var templateClass = parser.lookupTemplate(errors, request.getToken(), request.getClassName());
		if (templateClass == null) {
			errors.push(new CompileError(request.getToken(), "could not find template class definition for '" + request.getClassName() + "'"));
			return null;
		}
		var classDef = templateClass.instantiate(errors, request);
		if (classDef == null)
			return null;
		// register
		parser.registerInstantiatedClass(classDef);
		// resolve immediately if requested to
		if (resolveImmmediately) {
			classDef.resolveTypes(
				new AnalysisContext(
					errors,
					parser,
					(function (errors, request) {
						return this._instantiateTemplate(errors, request, true);
					}).bind(this)));
		}
		// return
		return classDef;
	},

	_resolveTypes: function (errors) {
		this.forEachClassDef(function (parser, classDef) {
			classDef.resolveTypes(
				new AnalysisContext(
					errors,
					parser,
					(function (errors, request) {
						return this._instantiateTemplate(errors, parser, request, false);
					}).bind(this)));
			return true;
		}.bind(this));
	},

	_analyze: function (errors) {
		var createContext = function (parser) {
			return new AnalysisContext(
				errors,
				parser,
				function (errors, request) {
					return this._instantiateTemplate(errors, parser, request, true);
				}.bind(this));
		}.bind(this);
		// set analyzation context of every variable
		this.forEachClassDef(function (parser, classDef) {
			classDef.setAnalysisContextOfVariables(createContext(parser));
			return true;
		}.bind(this));
		// analyze every classdef
		this.forEachClassDef(function (parser, classDef) {
			classDef.analyze(createContext(parser));
			return true;
		}.bind(this));
		// analyze unused variables in every classdef
		this.forEachClassDef(function (parser, classDef) {
			classDef.analyzeUnusedVariables();
			return true;
		}.bind(this));
	},

	_optimize: function () {
		if (this._optimizer != null)
			this._optimizer.setCompiler(this).performOptimization();
	},

	_generateCode: function () {
		// build list of all classDefs
		var classDefs = [];
		for (var i = 0; i < this._parsers.length; ++i)
			classDefs = classDefs.concat(this._parsers[i].getClassDefs());
		// reorder the classDefs so that base classes would come before their children
		var getMaxIndexOfClasses = function (deps) {
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
			throw new Error("logic error, could not find class definition of '" + deps[0].className() + "'");
		};
		for (var i = 0; i < classDefs.length;) {
			var deps = classDefs[i].implementClassDefs().concat([]);
			if (classDefs[i].extendClassDef() != null)
				deps.unshift(classDefs[i].extendClassDef());
			var maxIndexOfClasses = getMaxIndexOfClasses(deps);
			if (maxIndexOfClasses > i) {
				classDefs.splice(maxIndexOfClasses + 1, 0, classDefs[i]);
				classDefs.splice(i, 1);
			} else {
				++i;
			}
		}
		// rename the classes with conflicting names
		for (var i = 0; i < classDefs.length; ++i) {
			if (classDefs[i].getOutputClassName() == null) {
				var className = classDefs[i].className();
				var suffix = 0;
				for (var j = i + 1; j < classDefs.length; ++j)
					if (classDefs[j].className() == className)
						classDefs[j].setOutputClassName(className + "$" + suffix++);
				classDefs[i].setOutputClassName(className);
			}
		}
		// emit
		this._emitter.emit(classDefs);
		this._output = this._emitter.getOutput();
	},

	_printErrors: function (errors) {
		for (var i = 0; i < errors.length; ++i) {
			this._platform.error(errors[i].format(this));
		}
	},

	_resolvePath: function (srcPath, givenPath) {
		if (givenPath.match(/^\.{1,2}\//) == null) {
			var searchPaths = this._searchPaths.concat(this._emitter.getSearchPaths());
			for (var i = 0; i < searchPaths.length; ++i) {
				var path = Util.resolvePath(searchPaths[i] + "/" + givenPath);
				// check the existence of the file, at the same time filling the cache
				if (this._platform.fileExists(path))
					return path;
			}
		}
		var lastSlashAt = srcPath.lastIndexOf("/");
		path = Util.resolvePath((lastSlashAt != -1 ? srcPath.substring(0, lastSlashAt + 1) : "") + givenPath);
		return path;
	},

});

// vim: set noexpandtab:
