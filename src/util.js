"use strict";

var Class = require("./Class");

var SourcePosition = Class.extend({
	initialize: function (row, col, line) {
		this.row  = row;
		this.col  = col;
		this.line = line;
	}
});

var Util = exports.Util = Class.extend({

	$serializeArray: function (a) {
		if (a == null)
			return null;
		var ret = [];
		for (var i = 0; i < a.length; ++i)
			ret[i] = a[i].serialize();
		return ret;
	},

	$serializeNullable: function (v) {
		if (v == null)
			return null;
		return v.serialize();
	},

	$repeat: function(c, n) {
		var s = "";
		for(var i = 0; i < n; ++i) {
			s += c;
		}
		return s;
	},

	// Usage: format("%1 %% %2", ["foo", "bar"]) -> "foo % bar"
	$format: function(fmt, args) {
		if(!(args instanceof Array)) {
			throw new Error("args must be an Array");
		}

		var i = 0;
		return fmt.replace(/%(\d+|%)/g, function(s, f) {
			if (f === "%") {
				return "%";
			}
			else {
				return args[parseInt(f) - 1];
			}
		});
	},

	$calculateSourcePosition: function (lines, offset) {
		var c   = 0;
		var row = 0;

		while(row < lines.length) {
			var lineLen = lines[row].length;
			if((c + lineLen) > offset) break;
			c += lineLen;

			++row;
		}
		var col = offset - c;

		// adjust the visual width
		// TODO: support Unicode EAST ASIAN WIDTH characters
		//       see alco http://unicode.org/reports/tr11/
		var line = lines[row];

		if(line == null) { // over EOF
			return new SourcePosition(row, col, null);
		}

		var TAB_WIDTH = 4;

		var tabs = line.slice(0, col).match(/\t/g);
		if(tabs != null) {
			col += (TAB_WIDTH-1) * tabs.length;
		}

		line = line.
			replace(/\t/g, Util.repeat(" ", TAB_WIDTH)).
			replace(/(?:\r?\n)?$/, "\n"); // make sure it ends with a newline

		return new SourcePosition(row, col, line);
	},

	$analyzeArgs: function (context, args) {
		var argTypes = [];
		for (var i = 0; i < args.length; ++i) {
			if (! args[i].analyze(context))
				return null;
			argTypes[i] = args[i].getType();
		}
		return argTypes;
	},

	$typesAreEqual : function (x, y) {
		if (x.length != y.length)
			return false;
		for (var i = 0; i < x.length; ++i)
			if (! x[i].equals(y))
				return false;
		return true;
	},

	$decodeStringLiteral: function (literal) {
		var matched = literal.match(/^([\'\"]).*([\'\"])$/);
		if (matched == null || matched[1] != matched[2])
			throw new Error("input string is not quoted properly: " + literal);
		var src = literal.substring(1, literal.length - 1);
		var decoded = "";
		var pos = 0, backslashAt;
		while ((backslashAt = src.indexOf("\\", pos)) != -1) {
			// copy the string before backslash
			decoded += src.substring(pos, backslashAt);
			pos = backslashAt + 1;
			// decode
			if (pos == src.length)
				throw new Error("last character within a string literal cannot be a backslash: " + literal);
			var escapeChar = src.charAt(pos++);
			switch (escapeChar) {
			case "'":
			case "\"":
			case "\\":
				decoded += escapeChar;
				break;
			case "b": decoded += "\b"; break;
			case "f": decoded += "\f"; break;
			case "n": decoded += "\n"; break;
			case "r": decoded += "\r"; break;
			case "t": decoded += "\t"; break;
			case "v": decoded += "\v"; break;
			case "u":
				var matched = src.substring(pos).match(/^([0-9A-Fa-f]{4})/);
				if (matched == null)
					throw new Error("expected four hexdigits after \\u: " + literal);
				decoded += String.fromCharCode(parseInt(matched[1], 16));
				pos += 4;
				break;
			case "0":
				if (pos == src.length || src.charAt(pos).match(/[0-9]/) == null)
					decoded += "\0";
				else
					throw new Error("found a digit after '\\0': " + literal);
				break;
			}
		}
		decoded += src.substring(pos);
		return decoded;
	},

	$resolvePath: function (path) {
		var tokens = path.split("/");
		for (var i = 0; i < tokens.length;) {
			if (tokens[i] == ".") {
				tokens.splice(i, 1);
			} else if (tokens[i] == ".." && i != 0 && tokens[i - 1] != "..") {
				if (i == 1 && tokens[0] == "") {
					tokens.splice(i, 1);
				} else {
					tokens.splice(i - 1, 2);
					i -= 1;
				}
			} else {
				i++;
			}
		}
		return tokens.join("/");
	}

});

var TemplateInstantiationRequest = exports.TemplateInstantiationRequest = Class.extend({

	initialize: function (token, className, typeArgs) {
		this._token = token;
		this._className = className;
		this._typeArgs = typeArgs;
	},

	getToken: function() {
		return this._token;
	},

	getClassName: function () {
		return this._className;
	},

	getTypeArguments: function () {
		return this._typeArgs;
	}

});

var CompileError = exports.CompileError = Class.extend({

	initialize: function () {
		switch (arguments.length) {
		case 2: // token, text
			var token = arguments[0];
			if(token != null) {
				this._filename = token.filename;
				this._pos = token.pos;
				this._size = token.getValue().length;
			}
			else {
				this._filename = null; // may become null
				this._pos = 0;
				this._size = 1;
			}
			this._message = arguments[1];
			break;
		case 3: // filename, pos, text
			this._filename = arguments[0];
			this._pos = arguments[1];
			this._message = arguments[2];
			this._size = 1;
			break;
		default:
			throw new Error("Unrecognized arguments for CompileError: " + JSON.stringify( Array.prototype.slice.call(arguments) ));
		}
	},

	getFilename: function () {
		return this._filename;
	},

	getPosition: function () {
		return this._pos;
	},

	format: function (compiler) {
		var prefix = "";
		var sourceLine = "";

		if (this._filename != null) {
			// obtain the file content and position info.
			var content = compiler.getPlatform().load(this._filename);
			var lines = content.split(/^/m); // TODO: cache it
			var position = Util.calculateSourcePosition(lines, this._pos);
			// setup prefix
			prefix = "[" + this._filename + ":" + (position.row + 1) + "] ";
			// setup source and cursor
			if (position.line != null) {
				sourceLine = "\n"
					+ position.line // ends with a newline
					+ Util.repeat(" ", position.col) + Util.repeat("^", this._size);
			}
		}

		return prefix + this._message + sourceLine + "\n";
	}

});


// vim: set noexpandtab:
