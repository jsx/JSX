/*
 * JSX tokanizer
 */
"use strict";

var validate = require("./validate");

function makeAlt (__va_args__) {
    return  "(?: \n" +
            Array.prototype.join.call(arguments, "\n | \n") +
            "\n)\n";
};

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

// global property for debugging/profiling
var nSpace    = 0;
var nIdent    = 0;
var nString   = 0;
var nNumber   = 0;
var nRegExp   = 0;
var nOperator = 0;

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
        nSpace++;
        type = "space";
    }
    else if(matched = input.match(rxIdent)) {
        nIdent++;
        type = "identifier";
    }
    else if(matched = input.match(rxStringLiteral)) {
        nString++;
        type = "string";
    }
    else if(matched = input.match(rxNumberLiteral)) {
        type = "number";
        nNumber++;
    }
    else if(matched = input.match(rxRegExpLiteral)) {
        type = "regexp";
        nRegExp++;
    }
    else if(matched = input.match(/^[^a-zA-Z0-9_]+/)) {
        type = "operator";
        nOperator++;
    }
    else {
        throw new Error("Not reached");
    }
    var token    = matched[0];
    var tokenLen = token.length;

    this.input = input.slice(tokenLen);

    var pos = this.pos;
    var row = this.row;
    var col = this.col;

    // count pos, row and col
    // TODO: make this lazy
    {
        this.pos += tokenLen;

        var lines = token.split(/(?:\r\n|[\r\n])/g);

        this.row +=  lines.length - 1;
        if(lines.length == 1) {
            this.col += tokenLen;
        }
        else { // reset col
            this.col = lines[ lines.length - 1 ].length;
        }
    }

    validate.isa(token, "string");
    validate.isa(pos,   "number");
    validate.isa(row,   "number");
    validate.isa(col,   "number");

    return {
        type: type,
        id:   token,

        pos: pos,
        row: row, // or line number
        col: col
    };
};

if(typeof(process) !== 'undefined' && process.argv[1] === __filename) {
    (function(file) {
        var fs = require("fs");
        var content = fs.readFileSync(file).toString();

        var lexer = new Lexer(content);

        var t0 = Date.now();

        var token;
        while( (token = lexer.nextToken()) !== null ) {
            //console.log(token);
        }

        console.log({
            space: nSpace,
            ident: nIdent,
            string: nString,
            number: nNumber,
            regexp: nRegExp,
            operator: nOperator
        });
        console.log("elapsed %s ms.", Date.now() - t0 );
    }).apply(this, process.argv.slice(2));
}
else {
    module.exports = Lexer;
}
