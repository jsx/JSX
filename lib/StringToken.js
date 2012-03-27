"use strict";

var Token = require("./Token");

var StringToken = module.exports = Token.extend({

	initialize: function (pos) {
		Token.prototype.initialize.call(this, pos);
	}
});
