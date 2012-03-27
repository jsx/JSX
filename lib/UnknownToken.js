"use strict";

var Token = require("./Token");

var UnknownToken = module.exports = Token.extend({

	initialize: function (unknown, pos) {
		Token.prototype.initialize.call(this, pos);
		this.unknown = unknown;
	},

	serialize: function () {
		return this._serialize("UnknownToken", this.unknown);
	}
});
