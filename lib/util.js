"use strict";

var Class = require("./Class");

var CompileError = exports.CompileError = Class.extend({

	initialize: function () {
		switch (arguments.length) {
		case 2: // token, text
			this._filename = arguments[0].filename;
			this._pos = arguments[0].pos;
			this._message = arguments[1];
			break;
		case 3: // filename, pos, text
			this._filename = arguments[0];
			this._pos = arguments[1];
			this._message = arguments[2];
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

	toString: function () {
		return this._filename + "(" + this._pos + "):" +
			this._message;
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
	}
});

var FilePos = exports.FilePos = Class.extend({
	$TAB_WIDTH: 4,
	
	initialize: function (lines, filename, pos) {
		this._filename = filename;
		
		var c   = 0;
		var row = 0;
		while(row < lines.length) {
			var lineLen = lines[row].length;
			if((c + lineLen) > pos) break;
			c += lineLen;

			++row;
		}
		
		this._lineNumber   = row + 1;
		this._columnNumber = pos - c;
		
		// adjust the visual width
		// TODO: support Unicode EAST ASIAN WIDTH characters
		//       see alco http://unicode.org/reports/tr11/
		var line = lines[row];
		var tabs = line.slice(0, this._columnNumber).match(/\t/g);
		if(tabs != null) {
			this._columnNumber += (FilePos.TAB_WIDTH-1) * tabs.length;
		}
		
		line = line.replace(/\t/, Util.repeat(" ", FilePos.TAB_WIDTH));

		this._line = line;
	},

	getLineNumber: function () {
		return this._lineNumber;
	},
	getColumnNumber: function () {
		return this._columnNumber;
	},
	
	format: function(size) {
		if(!size) size = 1;
		
		var s = this._line.replace(/[\r\n]/, '') + "\n";

		s += Util.repeat(" ", this._columnNumber);
		s += Util.repeat("^", size);
		
		s += "\n";
		return s;
	},
	toString: function () {
		return this._filename + ':' + this._lineNumber;
	}
});

/*
var src = "foo\n\tbar\n\n\thello";
for(var i = 0; i < src.length; ++i) {
	var pos = new FilePos(src.split(/^/m), "foo.jsx", i);
	console.log(pos.explain());
}
//*/
// vim: set noexpandtab:
