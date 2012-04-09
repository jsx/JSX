/*
 * JSX tokanizer
 */

var Class = require("./Class");
eval(Class.$import("./token"));
eval(Class.$import("./util"));

"use strict";

var Lexer = exports.Lexer = Class.extend({

	$makeAlt: function (patterns) {
		return "(?: \n" + patterns.join("\n | \n") + "\n)\n";
	},

	$quoteMeta: function (pattern) {
		return pattern.replace(/([^0-9A-Za-z_])/g, '\\$1');
	},

	$asHash: function (array) {
		var hash = {};
		for (var i = 0; i < array.length; ++i)
			hash[array[i]] = 1;
		return hash;
	},

	/// compile a regular expression
	$rx: function (pat, flags) {
		return RegExp(pat.replace(/[ \t\r\n]/g, ""), flags);
	},

	// static variables
	$initialize: function () {
		var ident         = " [a-zA-Z_] [a-zA-Z0-9_]* ";
		var doubleQuoted  = ' "  [^"\\\\]* (?: \\\\. [^"\\\\]* )* " ';
		var singleQuoted  = " '  [^'\\\\]* (?: \\\\. [^'\\\\]* )* ' ";
		var stringLiteral = this.makeAlt([singleQuoted, doubleQuoted]);
		var regexpLiteral = doubleQuoted.replace(/"/g, "/");

		// ECMA 262 compatible,
		// see also ECMA 262 5th (7.8.3) Numeric Literals
		var decimalIntegerLiteral = "(?: 0 | [1-9][0-9]* )";
		var exponentPart = "(?: [eE] [+-]? [0-9]+ )";
		var numberLiteral = this.makeAlt([
				"(?: " + decimalIntegerLiteral + " \. " +
					   "[0-9]* " + exponentPart + "? )",
				"(?: \. [0-9]+ " + exponentPart + "? )",
				"(?: " + decimalIntegerLiteral + exponentPart + " )"
			]) + "\\b";
		var integerLiteral = this.makeAlt([
				"(?: 0 [xX] [0-9a-fA-F]+ )", // hex
				decimalIntegerLiteral
			]) + "(?![\.0-9eE])";

		var multiLineComment  = "(?: /\\* (?: [^*] | (?: \\*+ [^*\/]) )* \\*+/)";
		var singleLineComment = "(?: // [^\\r\\n]* )";
		var comment           = this.makeAlt([multiLineComment, singleLineComment]);
		var whiteSpace        = "[\\x20\\t\\r\\n]+";

		this.keyword = this.asHash([
			// literals shared with ECMA 262
			"null",     "true",     "false",
			// keywords shared with ECMA 262
			"break",    "do",       "instanceof", "typeof",
			"case",     "else",     "new",        "var",
			"catch",    "finally",  "return",     "void",
			"continue", "for",      "switch",     "while",
			"function", "this",
			"default",  "if",       "throw",
			"delete",   "in",       "try",
			// keywords of JSX
			"class",	 "extends", "super",
			"import",    "implements",
			"interface", "static",
			"assert",    "log",
			"__FILE__",  "__LINE__"
		]);
		this.reserved = this.asHash([
			// literals of ECMA 262 but not used by JSX
			"debugger", "with",
			// future reserved words of ECMA 262
			"const", "export",
			// future reserved words within strict mode of ECMA 262
			"let",   "private",   "public", "yield",
			"protected",

			// JSX specific reserved words
			"extern", "native",
			"trait", "using",
			"as", "is",
			"operator", "package"
		]);

		// some operators are not used, but recognized
		// in order to make error massages helpful.
		// e.g. "operator -> is not defined. Do you mean this.foo()?"
		var ops = [
			"{",  "}",  "(",  ")",  "[",  "]",
			".",  ";",  ",",  ":",  "?",  "@",
			"->", "\\", "::", "..", "...",

			"<",  ">",  "<=",  ">=",
			"==", "!=", "<=>", "=~", "~!",

			"=",
			"+",  "-",  "*",  "/",  "%",
			"+=", "-=", "*=", "/=", "%=",
			"&",  "|",  "^",
			"&=", "|=", "^=",
			"~",  "!",
			"++", "--",
			"||", "&&"
		];
		for (var i = 0; i < ops.length; i++)
			ops[i] = this.quoteMeta(ops[i]);

		var operator = this.makeAlt(ops.sort().reverse());

		// regular expressions
		this.rxOperator       = this.rx("^" + operator);
		this.rxIdent          = this.rx("^" + ident);
		this.rxStringLiteral  = this.rx("^" + stringLiteral);
		this.rxNumberLiteral  = this.rx("^" + numberLiteral);
		this.rxIntegerLiteral = this.rx("^" + integerLiteral);
		this.rxRegExpLiteral  = this.rx("^" + regexpLiteral);
		this.rxSpace          = this.rx("^" + this.makeAlt([comment, whiteSpace]));
	},

	initialize: function (filename, input, errors) {
		this._filename = filename;
		this._input = input;
		this._pos = 0;
		this._errors = errors;
	},

	tokenize: function() {

		var tokens = [];

		while (this._pos < this._input.length) {

			var start = this._input.substring(this._pos);
			var matched;
			if (matched = start.match(Lexer.rxSpace)) {
				// skip tokens.push(new SpaceToken(this._filename, this._pos));
			}
			else if (matched = start.match(Lexer.rxStringLiteral)) {
				tokens.push(new StringToken(matched[0], this._filename, this._pos));
			}
			else if (matched = start.match(Lexer.rxIntegerLiteral)) {
				tokens.push(IntegerToken.create(matched[0], null, this._filename, this._pos));
			}
			else if (matched = start.match(Lexer.rxNumberLiteral)) {
				tokens.push(new NumberToken(matched[0], null, this._filename, this._pos));
			}
			else if (matched = start.match(Lexer.rxRegExpLiteral)) {
				tokens.push(new RegExpToken(matched[0], this._filename, this._pos));
			}
			else if (matched = start.match(Lexer.rxOperator)) {
				tokens.push(new KeywordToken(matched[0], this._filename, this._pos));
			}
			else if (matched = start.match(Lexer.rxIdent)) {
				if (Lexer.keyword.hasOwnProperty(matched[0])) {
					tokens.push(new KeywordToken(matched[0], this._filename, this._pos));
				} else if (Lexer.reserved.hasOwnProperty(matched[0])) {
					this._newError("keyword " + matched[0] + " is not supported under current version of JSX");
				} else {
					tokens.push(new IdentifierToken(matched[0], this._filename, this._pos));
				}
			}
			else {
				this._newError("unexpected character " + JSON.stringify(start[0]));
				// skip to the end of line
				matched = start.match(/^.*(?:\r\n?|\n|$)/);
			}

			this._pos += matched[0].length;
		}

		return tokens;
	},

	_newError: function (message) {
		var e = new CompileError(this._filename, this._pos, message);
		this._errors.push(e);
	}

});

if (typeof(process) !== 'undefined' && process.argv[1] === __filename) {
	// testing in node.js
	process.argv.slice(2).map(function(file) {
		console.log(file);
		var fs   = require("fs");
		var content = fs.readFileSync(file).toString();
		var errors = [];

		var lexer = new Lexer(file, content, errors);

		var t0 = Date.now();

		var tokens = lexer.tokenize();
		console.log("*** Errors ***");
		for (var i = 0; i < errors.length; ++i) {
			console.log(errors[i].toString());
		}
		console.log("*** Tokens ***");
		for (var i = 0; i < tokens.length; ++i) {
			console.log(JSON.stringify(tokens[i].serialize()));
		}
		console.log("elapsed %s ms.", Date.now() - t0);
	});
}
// vim: set noexpandtab:
