var Class = require("./Class");
eval(Class.$import("./lexer"));
eval(Class.$import("./parser"));
eval(Class.$import("./jsemitter"));
eval(Class.$import("./os"));

"use strict";

var Compiler = module.exports = Class.extend({

	initialize: function () {
		this._sourceFiles = []; // [ file, parsedOrNotParsed ] do not use hash, to always compile deep-first
		this._classDefs = [];
	},

	addSourceFile: function (file) {
		for (var i = 0; i < this._sourceFiles.length; ++i)
			if (this._sourceFiles[i][0] === file)
				return;
		this._sourceFiles.push([ file, false ]);
	},

	compile: function () {

		// parse all files
		for (var i = 0; i < this._sourceFiles.length; ++i) {
			if (! this._sourceFiles[i][1]) {
				if (! this._parseFile(this._sourceFiles[i][0]))
					return false;
				this._sourceFiles[i][1] = true;
			}
		}

		// semantic analysis
		if (! this._resolveTypes())
			return false;
		if (! this._analyze())
			return false;

		// TODO control flow analysis

		// TODO optimize

		if (! this._generateCode())
			return false;

		return true;
	},

    getOutput: function() {
        return this._output;
    },

	_parseFile: function (filename) {

		var errors = [];

		// read file
		var content = OS.readFile(filename);
		if (content == null) {
			errors.push("could not open the file");
		}

		// tokenize
		if (errors.length == 0) {
			var lexer = new Lexer(filename, content);
			var tokens = lexer.tokenize(errors);
		}

		// parse
		if (errors.length == 0) {
			var parser = new Parser(tokens, errors);
			parser.parse();
			if (errors.length == 0) {
				// get the imported files from parser and set to _sourceFiles
				this._classDefs = this._classDefs.concat(parser.getClassDefs());
			}
		}

		this._printErrors(errors);
		return errors.length == 0;
	},

	_resolveTypes: function () {
		var errors = [];
		for (var i = 0; i < this._classDefs.length; ++i)
			this._classDefs[i].resolveTypes(errors, this._classDefs);
		this._printErrors(errors);
		return errors.length == 0;
	},

	_analyze: function () {
		var errors = [];
		for (var i = 0; i < this._classDefs.length; ++i)
			this._classDefs[i].analyze(errors, this._classDefs);
		this._printErrors(errors);
		return errors.length == 0;
	},

	_generateCode: function () {
		var emitter = new JavaScriptEmitter();
		for (var i = 0; i < this._classDefs.length; ++i)
			emitter.emitClassDefinition(this._classDefs[i]);
		for (var i = 0; i < this._classDefs.length; ++i)
			emitter.emitStaticInitializationCode(this._classDefs[i]);
		this._output = emitter.getOutput();
		return true;
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
