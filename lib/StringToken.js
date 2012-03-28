"use strict";

var Token = require("./Token");

var StringToken = module.exports = Token.extend({

	initialize: function (string, pos) {
		Token.prototype.initialize.call(this, pos);
		this.string = string.substring(1, string.length - 2).replace(/\\(.)/g, "$1"); // FIXME add support for \x, \u, etc.
	},

	serialize: function () {
		return this._serialize("string", this.string);
	}
});
