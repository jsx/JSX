var Class = require("./Class");
eval(Class.$import("./lexer"));
eval(Class.$import("./parser"));
eval(Class.$import("./token"));
eval(Class.$import("./classdef"));
eval(Class.$import("./jsemitter"));
eval(Class.$import("./os"));

"use strict";

var Compiler = exports.Compiler = Class.extend({

	$MODE_COMPILE: 0,
	$MODE_TOKENIZE: 1,
	$MODE_PARSE: 2,

	initialize: function () {
		this._mode = Compiler.MODE_COMPILE;
		this._emitter = new JavaScriptEmitter();
		this._sourceFiles = [];
		this._classDefs = [];
		this._output = "";
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

		var errors = [];

		// parse all files
		for (var i = 0; i < this._sourceFiles.length; ++i) {
			var tokens = this.tokenizeFile(errors, this._sourceFiles[i]);
			if (errors.length != 0) {
				this._printErrors(errors);
				return false;
			}
			if (this._mode == Compiler.MODE_TOKENIZE) {
				this._output += Token.serialize(tokens);
			} else {
				this.parseFile(errors, tokens);
				if (errors.length != 0) {
					this._printErrors(errors);
					return false;
				}
			}
		}
		switch (this._mode) {
		case Compiler.MODE_TOKENIZE:
			return true;
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

		// TODO control flow analysis

		// TODO optimize

		this._generateCode();

		return true;
	},

	getOutput: function() {
		return this._output;
	},

	tokenizeFile: function (errors, filename) {
		// read file
		var content = OS.readFile(filename);
		if (content == null) {
			errors.push("could not open the file");
			return null;
		}
		// tokenize
		var lexer = new Lexer(filename, content, errors);
		return lexer.tokenize();
	},

	parseFile: function (errors, tokens) {
		var parser = new Parser(tokens, errors);
		parser.parse();
		if (errors.length == 0) {
			// get the imported files from parser and set to _sourceFiles
			this._classDefs = this._classDefs.concat(parser.getClassDefs());
		}
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
		for (var i = 0; i < this._classDefs.length; ++i)
			this._emitter.emitClassDefinition(this._classDefs[i]);
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
