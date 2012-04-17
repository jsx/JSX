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

	// poor man's sprintf(), which only support %s and %j
	// Usage: format(" %1 %2:j ", ["foo", "bar"]);
	$format: function(fmt, args) {
		var i = 0;
		return String(fmt).replace(/%(?:(\d+):)?([a-zA-Z%])/g, function(s, n, c) {
			switch (c) {
			case "%": return "%";
			case "s": return                args[n ? (n-1) : i++];
			case "j": return JSON.stringify(args[n ? (n-1) : i++]);
			default: throw new Error("Format character " +
									 JSON.stringify(c) +
									 " is not supported");
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

	$qualifiedNameToString: function (tokens) {
		var s = [];
		for (var i = 0; i < tokens.length; ++i)
			s[i] = tokens[i]._value;
		return s.join(".");
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
				this._filename = "(unknown)";
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

	toString: function (compiler) {
		var lineNumber = 0;
		var columnOffset = 0;
		var sourceLine = null;
		if(compiler != null) {
			var content = null;
			try {
				content = compiler.getFileContent(this._filename);
			}
			catch (e) {
			}

			if(content != null) {
				var lines = content.split(/^/m); // TODO: cache it
				var position = Util.calculateSourcePosition(lines, this._pos);
				lineNumber   = position.row + 1;
				columnOffset = position.col;
				sourceLine   = position.line;
			}
		}

		var fileAndLineNum = this._filename;
		if(lineNumber) {
			fileAndLineNum += ":" + lineNumber;
		}

		if(sourceLine != null) {
			sourceLine += Util.repeat(" ", columnOffset);
			sourceLine += Util.repeat("^", this._size);
			sourceLine += "\n";
		}
		else {
			sourceLine = "";
		}

		// make sure it ends with a newline
		var message = this._message.replace(/(?:\r?\n)?$/, "\n");

		return Util.format("[%s] %s%s",
						   [fileAndLineNum, message, sourceLine]);
	}

});


// vim: set noexpandtab:
