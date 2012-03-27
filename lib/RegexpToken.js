"use strict";

var Token = require("./Token");

var RegExpToken = module.exports = Token.extend({

	initialize: function (expr, pos) {
		Token.prototype.initialize.call(this, pos);
		this.expr = expr;
	},

	serialize: function () {
		return this._serialize("RegExp", this.expr);
	}
});
