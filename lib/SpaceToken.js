"use strict";

var Token = require("./Token");

var SpaceToken = module.exports = Token.extend({

	initialize: function (_unused, pos) {
		Token.prototype.initialize.call(this, pos);
	},

	serialize: function () {
		return this._serialize("space");
	}
});
