"use strict";

var Token = require("./Token");

var IdentifierToken = module.exports = Token.extend({

	initialize: function (pos) {
		Token.prototype.initialize.call(this, pos);
	}
});
