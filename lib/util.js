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
		default:
			throw new Error();
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
