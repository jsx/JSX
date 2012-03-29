"use strict";

var Expression = require("./Expression");

var StringLiteralExpression = module.exports = Expression.extend({

	initialize: function (literal) {
		this._literal = literal;
	}

});
