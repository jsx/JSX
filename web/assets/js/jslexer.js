
(function (exports) {
	"use strict";

	var DEBUG = false;

	function makeAlt(patterns) {
		return "(?: \n" + patterns.join("\n | \n") + "\n)\n";
	}

	function quoteMeta(pattern) {
		return pattern.replace(/([^0-9A-Za-z_])/g, '\\$1');
	}

	function rx(pat, flags) {
		return RegExp(pat.replace(/[ \t\r\n]/g, ""), flags);
	}

	var ident         = " [\\$a-zA-Z_] [\\$a-zA-Z0-9_]* ";
	var doubleQuoted  = ' "  [^"\\n\\\\]* (?: \\\\. [^"\\n\\\\]* )* " ';
	var singleQuoted  = doubleQuoted.replace(/"/g, "'");
	var stringLiteral = makeAlt([singleQuoted, doubleQuoted]);
	var regexpLiteral = doubleQuoted.replace(/"/g, "/") + "[mgi]*";

	var decimalIntegerLiteral = "(?: 0 | [1-9][0-9]* )";
	var exponentPart = "(?: [eE] [+-]? [0-9]+ )";
	var numberLiteral = makeAlt([
			"(?: " + decimalIntegerLiteral + " \\. " +
					"[0-9]* " + exponentPart + "? )",
			"(?: \\. [0-9]+ " + exponentPart + "? )",
			"(?: " + decimalIntegerLiteral + exponentPart + " )"
		]) + "\\b";
	var integerLiteral = makeAlt([
			"(?: 0 [xX] [0-9a-fA-F]+ )", // hex
			decimalIntegerLiteral
		]) + "(?![\\.0-9eE])\\b";

	var multiLineComment  = "(?: /\\* (?: [^*] | (?: \\*+ [^*\\/]) )* \\*+/)";
	var singleLineComment = "(?: // [^\\r\\n]* )";
	var comment           = makeAlt([multiLineComment, singleLineComment]);
	var whiteSpace        = "[\\x20\\t\\r\\n]+";

	var keywords = [
		"null",     "true",     "false",
		"break",    "do",       "instanceof", "typeof",
		"case",     "else",     "new",        "var",
		"catch",    "finally",  "return",     "void",
		"continue", "for",      "switch",     "while",
		"function", "this",
		"default",  "if",       "throw",
		"delete",   "in",       "try",
		"class",    "extends",  "super",
		"import",   "implements",
		"debugger", "with",
		"const",    "export",
		"let",     "private",   "public", "yield",
		"protected"
	];

	var rxSpace          = rx("^" + makeAlt([comment, whiteSpace]) + "+");
	var rxIdent          = rx("^" + ident);
	var rxStringLiteral  = rx("^" + stringLiteral);
	var rxNumberLiteral  = rx("^" + makeAlt([numberLiteral, integerLiteral]) + "\\b");
	var rxRegExpLiteral  = rx("^" + regexpLiteral);
	var rxKeyword        = rx("^" + makeAlt(keywords.map(quoteMeta)) + "\\b");

	var endOfPrimaryExpr  = {
		"null": true,
		"false": true,
		"true": true,
		")": true,
		"]": true
	};
	function lastIsPrimaryExpr(tokens) {
		var i = tokens.length - 1;
		while(i >= 0 && tokens[i].type === "space") {
			--i;
		}

		if(tokens[i].token in endOfPrimaryExpr) {
			return true;
		}

		var t = tokens[i].type;
		return t === "identifier" ||
			t === "string" ||
			t === "regexp" ||
			t === "number";
	}

	function tokenize(fileName, src) {
		var tokens = [];
		var line = 1;
		var col  = 0;
		var id   = 0;
		while( src.length > 0 ) {
			var matched;
			var type;
			if( (matched = src.match(rxSpace)) !== null ) {
				type = "space";
			}
			else if( src.charAt(0) === "/" ) {
				if( lastIsPrimaryExpr(tokens) ) {
					matched = src.match(/^./);
					type = "keyword";
				}
				else if( (matched = src.match(rxRegExpLiteral)) !== null ) {
					type = "regexp";
				}
				else {
					throw new SyntaxError("jslexer: ["+fileName+":"+line+":"+col+"] "+
									"Unexpected character '" +
									src.charAt(0) + "'");
				}
			}
			else if( (matched = src.match(rxKeyword)) !== null ) {
				type = "keyword";
			}
			else if( (matched = src.match(rxIdent)) !== null ) {
				type = "identifier";
			}
			else if( (matched = src.match(rxStringLiteral)) !== null ) {
				type = "string";
			}
			else if( (matched = src.match(rxNumberLiteral)) !== null ) {
				type = "number";
			}
			else if( (matched = src.match(/^./)) !== null ) {
				type = "keyword";
			}
			else {
				throw new SyntaxError("jslexer: ["+fileName+":"+line+":"+col+"] "+
								"Unexpected character '" +
								src.charAt(0) + "'");
			}
			var token = matched[0];
			if (DEBUG) {
				console.info(matched);
			}

			src = src.slice(token.length);
			tokens.push({
				type:   type,
				token:  token,
				column: col,
				line:   line,
				id:     ++id
			});

			if(token.match(/\n/)) {
				var lines = token.split(/\n/);
				line += lines.length - 1;
				col   = lines[lines.length - 1].length;
			}
			else {
				col += matched[0].length;
			}
		}
		return tokens;
	}
	exports.tokenize = tokenize;
}( typeof(exports) !== "undefined" ? exports : window ));

if(typeof(process) !== "undefined" && process.argv[1] === __filename) { // node
	process.argv.slice(2).forEach(function (file) {
		var buff= require("fs").readFileSync(file).toString();
		var tokens = exports.tokenize(file, buff);
		console.log(tokens);
	});
}

