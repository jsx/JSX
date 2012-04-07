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
		return this._filename + "(" + this._pos + "):" + this._message;
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
	}

});
// vim: set noexpandtab:
