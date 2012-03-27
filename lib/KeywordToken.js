"use strict";

var Token = require("./Token");

var KeywordToken = module.exports = Token.extend({

	initialize: function (keyword, pos) {
		Token.prototype.initialize.call(this, pos);
		this.keyword = keyword;
	},

	serialize: function () {
		return this._serialize("keyword", this.keyword);
	}
});
