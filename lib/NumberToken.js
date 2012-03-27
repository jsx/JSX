"use strict";

var Token = require("./Token");

var NumberToken = module.exports = Token.extend({

	initialize: function (number, pos) {
		Token.prototype.initialize.call(this, pos);
		this.number = +number;
	},

	serialize: function () {
		return this._serialize("number", this.number);
	}
});
