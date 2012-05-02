var Class = require("./Class");
eval(Class.$import("./parser"));
eval(Class.$import("./classdef"));
eval(Class.$import("./type"));
eval(Class.$import("./jsemitter"));
eval(Class.$import("./platform"));
eval(Class.$import("./util"));

"use strict";

// for front-end driver
exports.Platform = Platform;

var Compiler = exports.Compiler = Class.extend({

	$MODE_COMPILE: 0,
	$MODE_PARSE: 1,

	initialize: function (platform) {
		this._platform = platform;
		this._mode = Compiler.MODE_COMPILE;
		this._emitter = new JavaScriptEmitter(platform);
		this._output = "";
		this._parsers = [];
		this._fileCache = {};
		// load the built-in classes
		this.addSourceFile(null, "lib/built-in/Object.jsx");
		this.addSourceFile(null, "lib/built-in/Boolean.jsx");
		this.addSourceFile(null, "lib/built-in/Number.jsx");
		this.addSourceFile(null, "lib/built-in/String.jsx");
		this.addSourceFile(null, "lib/built-in/RegExp.jsx");
		this.addSourceFile(null, "lib/built-in/Date.jsx");
		this.addSourceFile(null, "lib/built-in/Array.jsx");
		this.addSourceFile(null, "lib/built-in/Hash.jsx");
		this._builtinParsers = this._parsers.concat([]); // shallow clone
	},

	getPlatform: function () {
		return this._platform;
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
			this._output = ClassDefinition.serialize(this._classDefs);
			return true;
		}
		// resolve imports
		this._resolveImports(errors);
		if (errors.length != 0) {
			this._printErrors(errors);
			return false;
		}
		// register backing class for primitives
		BooleanType._classDef = this.findParser("lib/built-in/Boolean.jsx").lookup(errors, null, "Boolean");
		NumberType._classDef = this.findParser("lib/built-in/Number.jsx").lookup(errors, null, "Number");
		StringType._classDef = this.findParser("lib/built-in/String.jsx").lookup(errors, null, "String");
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
		// TODO control flow analysis
		// TODO optimize
		this._generateCode();
		return true;
	},

	getOutput: function() {
		return this._output;
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
		var imports = parser.getImports();
		for (var i = 0; i < imports.length; ++i) {
			var path = Compiler._resolvePath(imports[i].getFilenameToken());
			if (path == parser.getPath()) {
				errors.push(new CompileError(imports[i].getFilenameToken(), "cannot import itself"));
				return false;
			}
			this.addSourceFile(imports[i].getFilenameToken(), Compiler._resolvePath(imports[i].getFilenameToken()));
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
					var path = Compiler._resolvePath(filenameToken);
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
		for (var i = 0; i < this._parsers.length; ++i) {
			var parser = this._parsers[i];
			var classDefs = parser.getClassDefs();
			for (var j = 0; j < classDefs.length; ++j) {
				classDefs[j].resolveTypes(
					new AnalysisContext(
						errors,
						parser,
						(function (errors, request) {
							return this._instantiateTemplate(errors, parser, request, false);
						}).bind(this)));
			}
		}
	},

	_analyze: function (errors) {
		for (var i = 0; i < this._parsers.length; ++i) {
			var parser = this._parsers[i];
			var classDefs = parser.getClassDefs();
			for (var j = 0; j < classDefs.length; ++j) {
				classDefs[j].analyze(
					new AnalysisContext(
						errors,
						parser,
						(function (errors, request) {
							return this._instantiateTemplate(errors, parser, request, true);
						}).bind(this)));
			}
		}
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
			var className = classDefs[i].className();
			var suffix = 0;
			for (var j = i + 1; j < classDefs.length; ++j)
				if (classDefs[j].className() == className)
					classDefs[j].alterClassName(className + "$" + suffix++);
		}
		// emit
		for (var i = 0; i < classDefs.length; ++i) {
			if ((classDefs[i].flags() & ClassDefinition.IS_NATIVE) == 0)
				this._emitter.emitClassDefinition(classDefs[i]);
		}
		for (var i = 0; i < classDefs.length; ++i)
			this._emitter.emitStaticInitializationCode(classDefs[i]);
		this._output = this._emitter.getOutput();
	},

	_printErrors: function (errors) {
		for (var i = 0; i < errors.length; ++i) {
			this._platform.error(errors[i].format(this));
		}
	},

	$_resolvePath: function (token) {
		var lastSlashAt = token.filename.lastIndexOf("/");
		var path = Util.resolvePath((lastSlashAt != -1 ? token.filename.substring(0, lastSlashAt + 1) : "") + Util.decodeStringLiteral(token.getValue()));
		return path;
	},

});

// vim: set noexpandtab:
