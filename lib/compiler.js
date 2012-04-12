var Class = require("./Class");
eval(Class.$import("./parser"));
eval(Class.$import("./classdef"));
eval(Class.$import("./type"));
eval(Class.$import("./jsemitter"));
eval(Class.$import("./os"));

"use strict";

var Compiler = exports.Compiler = Class.extend({

	$MODE_COMPILE: 0,
	$MODE_PARSE: 1,

	initialize: function () {
		this._mode = Compiler.MODE_COMPILE;
		this._emitter = new JavaScriptEmitter();
		this._classDefs = [];
		this._output = "";
		// load the built-in classes
		this._sourceFiles = [
			"lib/built-in/Boolean.jsx",
			"lib/built-in/Number.jsx",
			"lib/built-in/String.jsx"
		];
		if (! this._precompile())
			throw new Error("logic flaw");
		Type._initializeBuiltin(this._classDefs);
		// reset source file list
		this._sourceFiles = [];
	},

	setMode: function (mode) {
		this._mode = mode;
		return this;
	},

	setEmitter: function (emitter) {
		this._emitter = emitter;
	},

	addSourceFile: function (file) {
		for (var i = 0; i < this._sourceFiles.length; ++i)
			if (this._sourceFiles[i] === file)
				return;
		this._sourceFiles.push(file);
	},

	compile: function () {
		if (! this._precompile())
			return false;
		// TODO control flow analysis
		// TODO optimize
		this._generateCode();
		return true;
	},

	_precompile: function () {
		var errors = [];
		// parse all files
		for (var i = 0; i < this._sourceFiles.length; ++i) {
			if (! this.parseFile(errors, this._sourceFiles[i])) {
				this._printErrors(errors);
				return false;
			}
		}
		switch (this._mode) {
		case Compiler.MODE_PARSE:
			this._output = ClassDefinition.serialize(this._classDefs);
			return true;
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
		return true;
	},

	getOutput: function() {
		return this._output;
	},

	parseFile: function (errors, filename) {
		// read file
		var content = OS.readFile(filename);
		if (content == null) {
			errors.push("could not open the file");
			return false;
		}
		// parse
		var parser = new Parser(filename, content, errors);
		parser.parse();
		if (errors.length != 0)
			return false;
		// get the imported files from parser and set to _sourceFiles
		this._classDefs = this._classDefs.concat(parser.getClassDefs());
		return true;
	},

	_resolveTypes: function (errors) {
		for (var i = 0; i < this._classDefs.length; ++i)
			this._classDefs[i].resolveTypes(errors, this._classDefs);
	},

	_analyze: function (errors) {
		for (var i = 0; i < this._classDefs.length; ++i)
			this._classDefs[i].analyze(errors, this._classDefs);
	},

	_generateCode: function () {
		for (var i = 0; i < this._classDefs.length; ++i) {
			var classDef = this._classDefs[i];
			if ((classDef.flags() & ClassDefinition.IS_NATIVE) == 0)
				this._emitter.emitClassDefinition(classDef);
		}
		for (var i = 0; i < this._classDefs.length; ++i)
			this._emitter.emitStaticInitializationCode(this._classDefs[i]);
		this._output = this._emitter.getOutput();
	},

	_printErrors: function (errors) {
		for (var i = 0; i < errors.length; ++i)
			OS.errprint(errors[i].toString());
	}

});

// vim: set noexpandtab:
