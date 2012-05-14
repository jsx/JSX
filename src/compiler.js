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

	addSourceFile: function (token, path) {
		// return immediately if the file is already in list
		if (this.findParser(path) != null)
			return;
		// add the file
		this._parsers.push(new Parser(token, path));
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
		// determine callees (for optimization and code generation)
		this._determineCallees();
		// optimization
		if (this._enableInlining)
			this._inlineFunctions();
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
				var path = this._resolvePath(imports[i].getFilenameToken());
				if (path == parser.getPath()) {
					errors.push(new CompileError(imports[i].getFilenameToken(), "cannot import itself"));
					return false;
				}
				this.addSourceFile(imports[i].getFilenameToken(), this._resolvePath(imports[i].getFilenameToken()));
			}
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
				// find parser instance for every import, and set source
				var filenameToken = imports[j].getFilenameToken();
				if (filenameToken != null) {
					var path = this._resolvePath(filenameToken);
					for (var k = 0; k < this._parsers.length; ++k)
						if (this._parsers[k].getPath() == path)
							break;
					if (k == this._parsers.length)
						throw new Error("could not find parsed data for file: " + path);
					imports[j].setupSource(errors, this._parsers[k]);
				}
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

	_determineCallees: function () {
		this.forEachClassDef(function (parser, classDef) {
			classDef.determineCallees();
			return true;
		}.bind(this));
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

	_resolvePath: function (token) {
		var tokenPath = Util.decodeStringLiteral(token.getValue());
		if (tokenPath.match(/^\.{1,2}\//) == null) {
			var searchPaths = this._searchPaths.concat(this._emitter.getSearchPaths());
			for (var i = 0; i < searchPaths.length; ++i) {
				var path = Util.resolvePath(searchPaths[i] + "/" + tokenPath);
				// check the existence of the file, at the same time filling the cache
				if (this.getFileContent([], null, path) != null)
					return path;
			}
		}
		var lastSlashAt = token.getFilename().lastIndexOf("/");
		path = Util.resolvePath((lastSlashAt != -1 ? token.getFilename().substring(0, lastSlashAt + 1) : "") + tokenPath);
		return path;
	},

});

// vim: set noexpandtab:
