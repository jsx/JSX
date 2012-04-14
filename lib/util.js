"use strict";

var Class = require("./Class");

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
	$format: function(fmt, __rest) {
		var args = arguments;
		var i = 0;
		return String(fmt).replace(/%([a-zA-Z%])/g, function(s, c) {
			switch (c) {
				case "%": return "%%";
				case "s": return args[++i];
				case "j": return JSON.stringify(args[++i]);
				default: throw new Error("Format character " +
										 JSON.stringify(c) +
										 " is not supported");
			}
		});
	},

	$qualifiedNameToString: function (tokens) {
		var s = [];
		for (var i = 0; i < tokens.length; ++i)
			s[i] = tokens[i]._value;
		return s.join(".");
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


	_calculatePos: function (compiler) {
		var TAB_WIDTH = 4;

		var content = compiler.getFileContent(this._filename);
		var lines   = content.split(/^/m); // TODO: cache it

		var c   = 0;
		var row = 0;
		while(row < lines.length) {
			var lineLen = lines[row].length;
			if((c + lineLen) > this._pos) break;
			c += lineLen;

			++row;
		}

		this._lineNumber   = row + 1;
		this._columnNumber = this._pos - c;

		// adjust the visual width
		// TODO: support Unicode EAST ASIAN WIDTH characters
		//       see alco http://unicode.org/reports/tr11/
		var line = lines[row];

		if(line == null) { // EOF
			return;
		}

		var tabs = line.slice(0, this._columnNumber).match(/\t/g);
		if(tabs != null) {
			this._columnNumber += (TAB_WIDTH-1) * tabs.length;
		}


		this._sourceLine = line.
			replace(/\t/g, Util.repeat(" ", TAB_WIDTH)).
			replace(/(\r?\n)$/, "\n"); // make sure it ends with a newline
	},

	getFilename: function () {
		return this._filename;
	},

	getPosition: function () {
		return this._pos;
	},

	toString: function (compiler) {
		if(compiler != null) {
			try {
				this._calculatePos(compiler);
			}
			catch (e) {
				// ignore errors
			}
		}

		var fileAndLineNum = this._filename;
		if(this._lineNumber) {
			fileAndLineNum += ":" + this._lineNumber;
		}

		var sourceLine;
		if(this._sourceLine != null) {
			sourceLine = this._sourceLine;

			sourceLine += Util.repeat(" ", this._columnNumber);
			sourceLine += Util.repeat("^", this._size);
			sourceLine += "\n";
		}
		else {
			sourceLine = "";
		}

		// make sure it ends with a newline
		var message = this._message.replace(/(?:\r?\n)?$/, "\n");

		return Util.format("[%s] %s%s", fileAndLineNum, message, sourceLine);
	}

});


// vim: set noexpandtab:
