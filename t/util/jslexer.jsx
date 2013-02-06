/***
 * Simple JavaScript lexer (not completely ECMA-262 compatible, but good enough now)
 */

class JSToken {
	var type : string;
	var token : string;
	var column : number;
	var line : number;
	var id : number;
	function constructor(type : string, token : string, column : number, line : number, id : number) {
		this.type = type;
		this.token = token;
		this.column = column;
		this.line = line;
		this.id = id;
	}
}

class JSLexer {

	static var DEBUG = false;

	static function makeAlt(patterns : string[]) : string {
		return "(?: \n" + patterns.join("\n | \n") + "\n)\n";
	}

	static function quoteMeta(pattern : string) : string {
		return pattern.replace(/([^0-9A-Za-z_])/g, '\\$1');
	}

	static function rx(pat : string) : RegExp {
		return new RegExp(pat.replace(/[ \t\r\n]/g, ""));
	}

	static function rx(pat : string, flags : string) : RegExp {
		return new RegExp(pat.replace(/[ \t\r\n]/g, ""), flags);
	}

	static var ident         = " [\\$a-zA-Z_] [\\$a-zA-Z0-9_]* ";
	static var doubleQuoted  = ' "  [^"\\n\\\\]* (?: \\\\. [^"\\n\\\\]* )* " ';
	static var singleQuoted  = JSLexer.doubleQuoted.replace(/"/g, "'");
	static var stringLiteral = JSLexer.makeAlt([JSLexer.singleQuoted, JSLexer.doubleQuoted]);
	static var regexpLiteral = JSLexer.doubleQuoted.replace(/"/g, "/") + "[mgi]*";

	static var decimalIntegerLiteral = "(?: 0 | [1-9][0-9]* )";
	static var exponentPart = "(?: [eE] [+-]? [0-9]+ )";
	static var numberLiteral = JSLexer.makeAlt([
			"(?: " + JSLexer.decimalIntegerLiteral + " \\. " +
					"[0-9]* " + JSLexer.exponentPart + "? )",
			"(?: \\. [0-9]+ " + JSLexer.exponentPart + "? )",
			"(?: " + JSLexer.decimalIntegerLiteral + JSLexer.exponentPart + " )"
		]) + "\\b";
	static var integerLiteral = JSLexer.makeAlt([
			"(?: 0 [xX] [0-9a-fA-F]+ )", // hex
			JSLexer.decimalIntegerLiteral
		]) + "(?![\\.0-9eE])\\b";

	static var multiLineComment  = "(?: /\\* (?: [^*] | (?: \\*+ [^*\\/]) )* \\*+/)";
	static var singleLineComment = "(?: // [^\\r\\n]* )";
	static var comment           = JSLexer.makeAlt([JSLexer.multiLineComment, JSLexer.singleLineComment]);
	static var whiteSpace        = "[\\x20\\t\\r\\n]+";

	static var keywords = [
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

	static var rxSpace          = JSLexer.rx("^" + JSLexer.makeAlt([JSLexer.comment, JSLexer.whiteSpace]) + "+");
	static var rxIdent          = JSLexer.rx("^" + JSLexer.ident);
	static var rxStringLiteral  = JSLexer.rx("^" + JSLexer.stringLiteral);
	static var rxNumberLiteral  = JSLexer.rx("^" + JSLexer.makeAlt([JSLexer.numberLiteral, JSLexer.integerLiteral]) + "\\b");
	static var rxRegExpLiteral  = JSLexer.rx("^" + JSLexer.regexpLiteral);
	static var rxKeyword        = JSLexer.rx("^" + JSLexer.makeAlt(JSLexer.keywords.map.<string>(function (s) { return JSLexer.quoteMeta(s); })) + "\\b");

	static var endOfPrimaryExpr  = {
		"null": true,
		"false": true,
		"true": true,
		")": true,
		"]": true
	};
	static function lastIsPrimaryExpr(tokens : JSToken[]) : boolean {
		var i = tokens.length - 1;
		while(i >= 0 && tokens[i].type == "space") {
			--i;
		}

		if(tokens[i].token in JSLexer.endOfPrimaryExpr) {
			return true;
		}

		var t = tokens[i].type;
		return t == "identifier" ||
			t == "string" ||
			t == "regexp" ||
			t == "number";
	}

	static function tokenize(fileName : string, src : string) : JSToken[] {
		var tokens = new JSToken[];
		var line = 1;
		var col  = 0;
		var id   = 0;
		while( src.length > 0 ) {
			var matched;
			var type;
			if( (matched = src.match(JSLexer.rxSpace)) != null ) {
				type = "space";
			}
			else if( src.charAt(0) == "/" ) {
				if( JSLexer.lastIsPrimaryExpr(tokens) ) {
					matched = src.match(/^./);
					type = "keyword";
				}
				else if( (matched = src.match(JSLexer.rxRegExpLiteral)) != null ) {
					type = "regexp";
				}
				else {
					throw new SyntaxError("jslexer: ["+fileName+":"+line as string+":"+col as string+"] "+
									"Unexpected character '" +
									src.charAt(0) + "'");
				}
			}
			else if( (matched = src.match(JSLexer.rxKeyword)) != null ) {
				type = "keyword";
			}
			else if( (matched = src.match(JSLexer.rxIdent)) != null ) {
				type = "identifier";
			}
			else if( (matched = src.match(JSLexer.rxStringLiteral)) != null ) {
				type = "string";
			}
			else if( (matched = src.match(JSLexer.rxNumberLiteral)) != null ) {
				type = "number";
			}
			else if( (matched = src.match(/^./)) != null ) {
				type = "keyword";
			}
			else {
				throw new SyntaxError("jslexer: ["+fileName+":"+line as string+":"+col as string+"] "+
								"Unexpected character '" +
								src.charAt(0) + "'");
			}
			var token = matched[0];
			if (JSLexer.DEBUG) {
				log matched;
			}

			src = src.slice(token.length);
			tokens.push(new JSToken(type, token, col, line, ++id));

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
}


