/*
 * JSX tokanizer
 */
"use strict";

var validate = require("./validate");

function makeAlt(__va_args__) {
    return  "(?: \n" +
            Array.prototype.join.call(arguments, "\n | \n") +
            "\n)\n";
}

function quoteMeta(pattern) {
    return pattern.replace(/([^0-9A-Za-z_])/g, '\\$1');
}

/// compile a regular expression
function rx(pat, flags) {
    return RegExp( pat.replace(/[ \t\r\n]/g, ""),  flags);
};

var ident = " [a-zA-Z_] [a-zA-Z0-9_]* ";

var doubleQuoted= ' "  [^"\\\\]* (?: \\\\. [^"\\\\]* )* " ';
var singleQuoted= " '  [^'\\\\]* (?: \\\\. [^'\\\\]* )* ' ";

var stringLiteral = makeAlt(singleQuoted, doubleQuoted);

var regexpLiteral = doubleQuoted.replace(/"/g, "/");

var decimal  = "(?: [0-9][0-9_]* (?: \\. [0-9_]+)? \\b )"; // decimal
var integral =
        "(?: 0 " + makeAlt(
            "(?: [0-7_]+ )",         // octal
            "(?: x [0-9a-fA-F_]+ )", // hex
            "(?: b [01_]+ )" ) +     // binary
        "?)";

var numberLiteral  = makeAlt(decimal, integral);

var multiLineComment   = "(?: /\\* (?: [^*] | (?: \\*+ [^*\/]) )* \\*+/)";
var singleLineComment  = "(?: // [^\\r\\n]* )";
var comment            = makeAlt(multiLineComment, singleLineComment);
var whiteSpace         = "[\\x20\\t\\r\\n]+";

var keyword = makeAlt(
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
);


// some operators are not used, but recognized
// in order to make error massages helpful.
// e.g. "operator -> is not defined. Do you mean this.foo()?"
var operator = makeAlt.apply(null, [
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
].map(quoteMeta));

// regular expressions

var rxKeyword       = rx("^" + makeAlt(keyword, operator));

var rxIdent         = rx("^" + ident);
var rxStringLiteral = rx("^" + stringLiteral);
var rxNumberLiteral = rx("^" + numberLiteral);
var rxRegExpLiteral = rx("^" + regexpLiteral);
var rxSpace         = rx("^" + makeAlt(comment, whiteSpace));


function Lexer(input) {
    this.input = input;
    this.ungetStack = [];

    //  position properties
    this.pos = 0;
    this.row = 0;
    this.col = 0;
}

// the base class of tokens
function Token() { }
Token.prototype.toString = function() {
    return "<"+this.name +">"+ JSON.stringify(this);
};
// for debugging and profiling
Token.stats = {};

function defineToken(name) {
    var t = function (id, position, value) {
        this.id       = id;
        this.position = position;
        if(value !== undefined) {
            this.value = value;
        }

        Token.stats[name]++;
    };
    t.prototype = new Token();
    t.prototype.constructor = t;
    t.prototype.name = "Lexer." + name;

    Token.stats[name] = 0;

    return t;
}


// token classes
// TODO: avoid metaprogramming!
Lexer.Keyword    = defineToken("Keyword");
Lexer.Space      = defineToken("Space");
Lexer.Identifier = defineToken("Identifier");
Lexer.String     = defineToken("String");
Lexer.Number     = defineToken("Number");
Lexer.RegExp     = defineToken("RegExp");
Lexer.Unknown    = defineToken("Unknown");

Lexer.prototype.unget = function(token) {
    this.ungetStack.push(token);
};

Lexer.prototype.nextToken = function() {
    var input = this.input;

    if(this.ungetStack.length > 0) {
        return this.ungetStack.pop();
    }

    if(input.length === 0) {
        return null;
    }

    var type;
    var matched;
    if(matched = input.match(rxSpace)) {
        type = Lexer.Space;
    }
    else if(matched = input.match(rxStringLiteral)) {
        type = Lexer.String;
    }
    else if(matched = input.match(rxNumberLiteral)) {
        type = Lexer.Number;
    }
    else if(matched = input.match(rxRegExpLiteral)) {
        type = Lexer.RegExp;
    }
    else if(matched = input.match(rxKeyword)) {
        type = Lexer.Keyword;
    }
    else if(matched = input.match(rxIdent)) {
        type = Lexer.Identifier;
    }
    else {
        matched = input.match(/^./);
        type = Lexer.Unknown;
    }

    var id    = matched[0];
    var idLen = id.length;

    this.input = input.slice(idLen);

    var pos = this.pos;
    var row = this.row;
    var col = this.col;

    // count pos, row and col
    // TODO: make this lazy
    {
        this.pos += idLen;

        var lines = id.split(/(?:\r\n|[\r\n])/g);

        this.row +=  lines.length - 1;
        if(lines.length == 1) {
            this.col += idLen;
        }
        else { // reset col
            this.col = lines[ lines.length - 1 ].length;
        }
    }

    validate.isa(id,  "string");
    validate.isa(pos, "number");
    validate.isa(row, "number");
    validate.isa(col, "number");

    return new type(id, {
        pos: pos,
        row: row,
        col: col
    });
};

if(typeof(process) !== 'undefined' && process.argv[1] === __filename) {
    // testing in node.js
    process.argv.slice(2).map(function(file) {
        console.log(file);
        var fs   = require("fs");
        var content = fs.readFileSync(file).toString();

        var lexer = new Lexer(content);

        var t0 = Date.now();

        var token;
        while( (token = lexer.nextToken()) !== null ) {
            //console.log(token.toString());
            if(token instanceof Lexer.Unknown) {
                console.log(token.toString());
            }
        }
        console.log("tokens:");
        console.log(Token.stats);
        console.log("elapsed %s ms.", Date.now() - t0 );
    });
}
else {
    module.exports = Lexer;
}
