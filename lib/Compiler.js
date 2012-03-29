"use strict";

var Class = require("./Class");
var Lexer = require("./Lexer");
var Parser = require("./Parser");
var OS = require("./OS");

var Compiler = module.exports = Class.extend({

	initialize: function () {
		this._sourceFiles = []; // [ file, parsedOrNotParsed ] do not use hash, to always compile deep-first
		this._classDefs = [];
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

		// report error if any
		if (errors.length != 0) {
			OS.errprint("In file: " + filename + ":");
			for (var i = 0; i < errors.length; ++i)
				OS.errprint("  " + errors[i].toString());
		}

		return errors.length == 0;
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

		// TODO: infer the types and generate code
		return true;
	}

});

if (typeof(process) !== 'undefined' && process.argv[1] === __filename) {
    // testing in node.js
	var compiler = new Compiler();
	for (var i = 2; i < process.argv.length; i++)
		compiler.addSourceFile(process.argv[i]);
	if (compiler.compile()) {
        var util = require('util');
		console.log( util.inspect(compiler, false, 100));
	}
}
