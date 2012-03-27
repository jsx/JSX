"use strict";

var Token = require("./Token");

var StringToken = module.exports = Token.extend({

	initialize: function (string, pos) {
		Token.prototype.initialize.call(this, pos);
		this.string = string;
	},

	serialize: function () {
		return this._serialize("string", this.string);
	}
});
