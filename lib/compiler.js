var Class = require("./Class");
eval(Class.$import("./lexer"));
eval(Class.$import("./parser"));
eval(Class.$import("./jsemitter"));
eval(Class.$import("./os"));

"use strict";

var Compiler = module.exports = Class.extend({

	initialize: function () {
		this._sourceFiles = [];
		this._classDefs = [];
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
			this.parseFile(errors, tokens);
			if (errors.length != 0) {
				this._printErrors(errors);
				return false;
			}
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
		var emitter = new JavaScriptEmitter();
		for (var i = 0; i < this._classDefs.length; ++i)
			emitter.emitClassDefinition(this._classDefs[i]);
		for (var i = 0; i < this._classDefs.length; ++i)
			emitter.emitStaticInitializationCode(this._classDefs[i]);
		this._output = emitter.getOutput();
	},

	_printErrors: function (errors) {
		for (var i = 0; i < errors.length; ++i)
			OS.errprint(errors[i].toString());
	}

});

if (typeof(process) !== 'undefined' && process.argv[1] === __filename) {
	// testing in node.js
	var compiler = new Compiler();
	for (var i = 2; i < process.argv.length; i++)
		compiler.addSourceFile(process.argv[i]);
	if (compiler.compile()) {
        console.log(compiler.getOutput());
        var util = require('util');
		var classes = [];
		for (var i = 0; i < compiler._classDefs.length; ++i)
			classes[i] = compiler._classDefs[i].serialize();
		console.log(util.inspect(classes, false, 100));
	}
}
// vim: set noexpandtab:
