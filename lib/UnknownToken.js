"use strict";

var Token = require("./Token");

var UnknownToken = module.exports = Token.extend({

	initialize: function (pos) {
		Token.prototype.initialize.call(this, pos);
	}
});
