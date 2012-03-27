"use strict";

var Token = require("./Token");

var KeywordToken = module.exports = Token.extend({

	initialize: function (pos) {
		Token.prototype.initialize.call(this, pos);
	}
});
