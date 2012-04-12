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
		var regexpLiteral = doubleQuoted.replace(/"/g, "/") + "[mgi]?";

		// ECMA 262 compatible,
		// see also ECMA 262 5th (7.8.3) Numeric Literals
		var decimalIntegerLiteral = "(?: 0 | [1-9][0-9]* )";
		var exponentPart = "(?: [eE] [+-]? [0-9]+ )";
		var numberLiteral = this.makeAlt([
				"(?: " + decimalIntegerLiteral + " \\. " +
				        "[0-9]* " + exponentPart + "? )",
				"(?: \\. [0-9]+ " + exponentPart + "? )",
				"(?: " + decimalIntegerLiteral + exponentPart + " )"
			]);
		var integerLiteral = this.makeAlt([
				"(?: 0 [xX] [0-9a-fA-F]+ )", // hex
				decimalIntegerLiteral
			]) + "(?![\\.0-9eE])";

		var multiLineComment  = "(?: /\\* (?: [^*] | (?: \\*+ [^*\\/]) )* \\*+/)";
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
			// operators used by JSX (listed in the appearance order in ECMA 262-3 A.3
			"(", ")", "[", "]", ",", ".", "{", "}",
			"++", "--", "+", "-", "~", "!",
			"*", "/", "%", "<<", ">>", ">>>",
			"<", ">", "<=", ">=", "==", "!=",
			"&", "^", "|", "&&", "||", "?", ":",
			"=", "*=", "/=", "%=", "+=", "-=", "<<=", ">>=", ">>>=", "&=", "^=", "|=",

			";", // not an operator but listed here

			// unused in JSX
			"===", "!==",

			// reserved
			"@", "->", "\\", "::", "..", "...",
			"<=>", "=~", "~!"
		];
		for (var i = 0; i < ops.length; i++)
			ops[i] = this.quoteMeta(ops[i]);

		var operator = this.makeAlt(ops.sort().reverse());

		// regular expressions
		this.rxDivOrRegExp    = this.rx("^" + "/");
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
				if (IntegerToken.MIN_VALUE <= matched[0] && matched[0] <= IntegerToken.MAX_VALUE)
					tokens.push(new IntegerToken(matched[0], this._filename, this._pos));
				else
					tokens.push(new NumberToken(matched[0], this._filename, this._pos));
			}
			else if (matched = start.match(Lexer.rxNumberLiteral)) {
				tokens.push(new NumberToken(matched[0], this._filename, this._pos));
			}
			else if (matched = start.match(Lexer.rxDivOrRegExp)) {
				var prev = tokens[tokens.length-1];
				if (
					prev instanceof IdentifierToken ||
					prev instanceof IntegerToken ||
					prev instanceof NumberToken ||
					prev instanceof StringToken || // wrong but tokenizable
					prev instanceof RegExpToken || // wrong but tokenizable
					(prev instanceof KeywordToken
						&& prev.getValue() === ")" )
				) {
					tokens.push(new KeywordToken(matched[0],this._filename, this._pos));
				}
				else if (matched = start.match(Lexer.rxRegExpLiteral)) {
					tokens.push(new RegExpToken(matched[0], this._filename, this._pos));
				}
				else {
					matched = this._skipToEOL(start);
				}
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
				matched = this._skipToEOL(start);
			}

			this._pos += matched[0].length;
		}

		return tokens;
	},

	// skip to the end of line
	_skipToEOL: function(start) {
		this._newError("unexpected character " + JSON.stringify(start[0]));
		return start.match(/^.*(?:\r\n?|\n|$)/);
	},

	_newError: function (message) {
		var e = new CompileError(this._filename, this._pos, message);
		this._errors.push(e);
	}

});

// vim: set noexpandtab:
