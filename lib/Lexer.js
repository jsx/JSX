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
var CompileError = require("./CompileError");

var validate = require("./validate");
var log = console.log;

var Lexer = Class.extend({

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

		this.keyword           = this.asHash([
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
			"class",    "extends",  "super",
			"import",   "implements",
			"interface",	"package", "static",
			"assert", "log",
			"__FILE__",	"__LINE__"
		]);
		this.reserved          = this.asHash([
			// literals of ECMA 262 but not used by JSX
			"debugger", "with",
			// future reserved words of ECMA 262
			"const", "export",
			// future reserved words within strict mode of ECMA 262
			"let",     "private",   "public", "yield",
			"protected",

			// JSX specific reserved words
			"extern", "native",
			"trait", "using",
			"as", "is",
			"operator"
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
		this.operator = this.makeAlt(ops.sort().reverse());

		// regular expressions
		this.rxOperator      = this.rx("^" + this.operator);
		this.rxIdent         = this.rx("^" + this.ident);
		this.rxStringLiteral = this.rx("^" + this.stringLiteral);
		this.rxNumberLiteral = this.rx("^" + this.numberLiteral);
		this.rxRegExpLiteral = this.rx("^" + this.regexpLiteral);
		this.rxSpace         = this.rx("^" + this.makeAlt([this.comment, this.whiteSpace]));
	},

	initialize: function (filename, input) {
		this._filename = filename;
		this._input = input;
		this._pos = 0;
	},

	tokenize: function(errors) {

		var tokens = [];

		while (this._pos < this._input.length) {

			var start = this._input.substring(this._pos);
			var matched;
			if (matched = start.match(Lexer.rxSpace)) {
				// skip tokens.push(new SpaceToken(this._pos));
			}
			else if (matched = start.match(Lexer.rxStringLiteral)) {
				tokens.push(new StringToken(matched[0], this._pos));
			}
			else if (matched = start.match(Lexer.rxNumberLiteral)) {
				tokens.push(new NumberToken(matched[0], this._pos));
			}
			else if (matched = start.match(Lexer.rxRegExpLiteral)) {
				tokens.push(new RegExpToken(matched[0], this._pos));
			}
			else if (matched = start.match(Lexer.rxOperator)) {
				tokens.push(new KeywordToken(matched[0], this._pos));
			}
			else if (matched = start.match(Lexer.rxIdent)) {
				if (Lexer.keyword[matched[0]]) {
					tokens.push(new KeywordToken(matched[0], this._pos));
				} else if (Lexer.reserved[matched[0]]) {
					errors.push(this._newError("keyword " + matched[0] + " is not supported under current version of JSX"));
				} else {
					tokens.push(new IdentifierToken(matched[0], this._pos));
				}
			}
			else {
				errors.push(this._newError("unexpected character"));
				matched = start.match(/^.?(?:\r\n?|\n|$)/); // skip to the end of line
			}

			this._pos += matched[0].length;
		}

		return tokens;
	},

	_newError: function (message) {
		return new CompileError(this._filename, this._pos, message);
	}

});

if (typeof(process) !== 'undefined' && process.argv[1] === __filename) {
    // testing in node.js
    process.argv.slice(2).map(function(file) {
        console.log(file);
        var fs   = require("fs");
        var content = fs.readFileSync(file).toString();

		var lexer = new Lexer(file, content);

        var t0 = Date.now();

		var errors = [];
        var tokens = lexer.tokenize(errors);
		console.log("*** Errors ***");
		for (var i = 0; i < errors.length; ++i) {
			console.log(errors.toString());
		}
		console.log("*** Tokens ***");
		for (var i = 0; i < tokens.length; ++i) {
			console.log(JSON.stringify(tokens[i].serialize()));
        }
        console.log("elapsed %s ms.", Date.now() - t0);
    });
}
else {
    module.exports = Lexer;
}
