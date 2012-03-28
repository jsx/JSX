"use strict";

var Class = require("./Class");

var CompileError = module.exports = Class.extend({

	initialize: function (filename, pos, message) {
		this._filename = filename;
		this._pos = pos;
		this._message = message;
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
