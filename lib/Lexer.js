/*
 * JSX tokanizer
 */
"use strict";

var Class = require("./Class");
var KeywordToken = require("./KeywordToken");
var SpaceToken = require("./SpaceToken");
var IdentifierToken = require("./IdentifierToken");
var StringToken = require("./StringToken");
var NumberToken = require("./NumberToken");
var RegExpToken = require("./RegExpToken");
var UnknownToken = require("./UnknownToken");

var validate = require("./validate");

var Lexer = Class.extend({

	$makeAlt: function (patterns) {
		return "(?: \n" + patterns.join("\n | \n") + "\n)\n";
	},

	$quoteMeta: function (pattern) {
		return pattern.replace(/([^0-9A-Za-z_])/g, '\\$1');
	},

	/// compile a regular expression
	$rx: function (pat, flags) {
		return RegExp(pat.replace(/[ \t\r\n]/g, ""), flags);
	},

	// static variables
	$initialize: function () {
		this.ident             = " [a-zA-Z_] [a-zA-Z0-9_]* ";
		this.doubleQuoted      = ' "  [^"\\\\]* (?: \\\\. [^"\\\\]* )* " ';
		this.singleQuoted      = " '  [^'\\\\]* (?: \\\\. [^'\\\\]* )* ' ";
		this.stringLiteral     = this.makeAlt([this.singleQuoted, this.doubleQuoted]);
		this.regexpLiteral     = this.doubleQuoted.replace(/"/g, "/");
		this.decimal           = "(?: [0-9][0-9_]* (?: \\. [0-9_]+)? \\b )";
		this.integral          =
			"(?: 0 " + this.makeAlt([
				"(?: [0-7_]+ )",         // octal
				"(?: x [0-9a-fA-F_]+ )", // hex
				"(?: b [01_]+ )"         // binary
			]) + "?)";
		this.numberLiteral     = this.makeAlt([this.decimal, this.integral]);
		this.multiLineComment  = "(?: /\\* (?: [^*] | (?: \\*+ [^*\/]) )* \\*+/)";
		this.singleLineComment = "(?: // [^\\r\\n]* )";
		this.comment           = this.makeAlt([this.multiLineComment, this.singleLineComment]);
		this.whiteSpace        = "[\\x20\\t\\r\\n]+";

		var keyword           = [
			// from ECMA262 (7.6.1)
			// keywords
			"break",    "do",       "instanceof", "typeof",
			"case",     "else",     "new",        "var",
			"catch",    "finally",  "return",     "void",
			"continue", "for",      "switch",     "while",
			"debugger", "function", "this",       "with",
			"default",  "if",       "throw",
			"delete",   "in",       "try",
			// future reserved words
			"class", "enum",   "extends", "super",
			"const", "export", "import",
			// future reserved words within strict mode
			"implements", "let",     "private",   "public", "yield",
			"interface",  "package", "protected", "static",
			// literals
			"null", "true", "false", "undefined",

			// JSX specific reserved words
			"extern", "native",
			"trait", "using",
			"as", "is",
			"operator",
			"assert", "log",
			"__FILE__", "__LINE__"
		];
		this.keyword = {};
		for (var i = 0; i < keyword; i++)
			this.keyword[keyword[i]] = 1;

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
		this.operator = this.makeAlt(ops.sort().reverse());

		// regular expressions
		this.rxOperator      = this.rx("^" + this.operator);
		this.rxIdent         = this.rx("^" + this.ident);
		this.rxStringLiteral = this.rx("^" + this.stringLiteral);
		this.rxNumberLiteral = this.rx("^" + this.numberLiteral);
		this.rxRegExpLiteral = this.rx("^" + this.regexpLiteral);
		this.rxSpace         = this.rx("^" + this.makeAlt([this.comment, this.whiteSpace]));
	},

	initialize: function (input) {
		this._input = input;
		this._ungetStack = [];
		//  position properties
		this._pos = 0;
	},

	unget: function (token) {
		this._ungetStack.push(token);
	},

	nextToken: function() {
		if (this._ungetStack.length > 0) {
			return this._ungetStack.pop();
		}

		if (this._input.length <= this._pos) {
			return null;
		}

		var start = this._input.substring(this._pos);
		var matched;
		var token;
		if (matched = start.match(Lexer.rxSpace)) {
			token = new SpaceToken(this._pos);
		}
		else if (matched = start.match(Lexer.rxStringLiteral)) {
			token = new StringToken(matched[0], this._pos);
		}
		else if (matched = start.match(Lexer.rxNumberLiteral)) {
			token = new NumberToken(matched[0], this._pos);
		}
		else if (matched = start.match(Lexer.rxRegExpLiteral)) {
			token = new RegExpToken(matched[0], this._pos);
		}
		else if (matched = start.match(Lexer.rxOperator)) {
			token = new KeywordToken(matched[0], this._pos);
		}
		else if (matched = start.match(Lexer.rxIdent)) {
			if (Lexer.keyword[matched[0]]) {
				token = new KeywordToken(matched[0], this._pos);
			} else {
				token = new IdentifierToken(matched[0], this._pos);
			}
		}
		else {
			matched = start.match(/^./);
			token = new UnknownToken(matched[0], this._pos);
		}

		this._pos += matched[0].length;

		return token;
	}
});

if (typeof(process) !== 'undefined' && process.argv[1] === __filename) {
    // testing in node.js
    process.argv.slice(2).map(function(file) {
        console.log(file);
        var fs   = require("fs");
        var content = fs.readFileSync(file).toString();

        var lexer = new Lexer(content);

        var t0 = Date.now();

        var token;
        while ((token = lexer.nextToken()) !== null) {
			console.log(JSON.stringify(token.serialize()));
        }
        console.log("elapsed %s ms.", Date.now() - t0);
    });
}
else {
    module.exports = Lexer;
}
