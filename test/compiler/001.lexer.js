#!/usr/bin/env node

var Class = require("Class");
var Test  = require("Test");

eval(Class.$import("lexer"));
eval(Class.$import("token"));

"use strict";

var test = new Test(__filename);

test.describe('tokenize identifiers', function(t) {
	var good = [
		"foo",
		"bar",
		"f",
		"_foo",
		"_",
		"foo_",
		"Foo",
		"FOO",
		"foo123",
		"foo_123",
		"varfoo",
		"var_foo",
		"var123"
	];
	var bad = [
		"123",
		"$foo",
		"+",
		"-foo",
		" ",
		"var" // keyword is not an identifier
	];


	good.map(function(src) {
		var lexer = new Lexer(__filename, src);
		var tokens = lexer.tokenize();

		t.expect(tokens, 'tokanize ' + t.explain(src)).
			toBeInstanceOf(Array);
		t.expect(tokens.length).toBe(1);
		t.expect(tokens[0], 'IdentifierToken').
			toBeInstanceOf(IdentifierToken);
	});

	bad.map(function(src) {
		var lexer = new Lexer(__filename, src);
		var tokens;

		try {
			tokens = lexer.tokenize();
		}
		catch(e) {
			tokens = [];
		}

		t.expect(tokens,
				 'tokanize ' + t.explain(src)).
					 toBeInstanceOf(Array);
		t.expect(tokens[0] instanceof IdentifierToken,
				 'not IdentifierToken').
					 toBeFalsy();
	});

	t.done();
});

test.describe('tokenize keywords', function(t) {
	var good = [
		"var",
		"+"
		// TODO: list all the keywords
	];
	var bad = [
		"123",
		"foo",
		"varfoo"
	];

	good.map(function(src) {
		var lexer = new Lexer(__filename, src);
		var tokens = lexer.tokenize();

		t.expect(tokens, 'tokanize ' + t.explain(src)).
			toBeInstanceOf(Array);
		t.expect(tokens.length).toBe(1);
		t.expect(tokens[0], 'KeywordToken').
			toBeInstanceOf(KeywordToken);
	});

	bad.map(function(src) {
		var lexer = new Lexer(__filename, src);
		var tokens;

		try {
			tokens = lexer.tokenize();
		}
		catch(e) {
			tokens = [];
		}

		t.expect(tokens,
				 'tokanize ' + t.explain(src)).
					 toBeInstanceOf(Array);
		t.expect(tokens[0] instanceof KeywordToken,
				 'not KeywordToken').
					 toBeFalsy();
	});

	t.done();
});

test.describe('tokenize numbers', function(t) {
	var good = [
		"1",
		"42",
		"1234567890",
		"3.14",
		".012",
		"0.012",
		"0.012e8",
		"0.e8",
		"1e32",
		"1E32",
		"0E0",
		"0xabcdef123",
		"0XABCDEF123",
		"0775",
		"0011",
		"0b1010",
		"0B1010",

		"1_2_3",
		"0xFF_FF_FF",

		"0"
		// TODO: list ECMA 262 compatible
	];
	var bad = [
		//"1a2", // TODO?
		"foo",
		"..2",
		//"0xZZ", // TODO?
		//"088",
		//"0b1212"
		"+"
	];

	good.map(function(src) {
		var lexer = new Lexer(__filename, src);
		var tokens = lexer.tokenize();

		t.expect(tokens, 'tokanize ' + t.explain(src)).
			toBeInstanceOf(Array);
		t.expect(tokens.length).toBe(1);
		t.expect(tokens[0], 'NumberToken').
			toBeInstanceOf(NumberToken);
	});

	bad.map(function(src) {
		var lexer = new Lexer(__filename, src);
		var tokens;

		try {
			tokens = lexer.tokenize();
		}
		catch(e) {
			tokens = [];
		}

		t.expect(tokens,
				 'tokanize ' + t.explain(src)).
					 toBeInstanceOf(Array);
		t.expect(tokens[0] instanceof NumberToken,
				 'not NumberToken').
					 toBeFalsy();
	});

	t.done();
});
test.describe('tokenize integers', function(t) {
	var good = [
		"1",
		"42",
		"1234567890",
		"0xabcdef123",
		"0XABCDEF123",
		"0775",
		"0011",
		"0b1010",
		"0B1010",

		"1_2_3",
		"0xFF_FF_FF",

		"0"
		// TODO: list ECMA 262 compatible
	];
	var bad = [
		"3.14",
		".012",
		"0.012",
		"0.012e8",
		"0.e8",
		"1e32",
		"1E32",
		"0E0",
		"0xFFFFFFFF",

		"+"
	];

	good.map(function(src) {
		var lexer = new Lexer(__filename, src);
		var tokens = lexer.tokenize();

		t.expect(tokens, 'tokanize ' + t.explain(src)).
			toBeInstanceOf(Array);
		t.expect(tokens.length).toBe(1);
		t.expect(tokens[0], 'IntegerToken').
			toBeInstanceOf(IntegerToken);
	});

	bad.map(function(src) {
		var lexer = new Lexer(__filename, src);
		var tokens;

		try {
			tokens = lexer.tokenize();
		}
		catch(e) {
			tokens = [];
		}

		t.expect(tokens,
				 'tokanize ' + t.explain(src)).
					 toBeInstanceOf(Array);
		t.expect(tokens[0] instanceof IntegerToken,
				 'not IntegerToken').
					 toBeFalsy();
	});

	t.done();
});

test.done();
