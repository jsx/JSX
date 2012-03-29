"use strict";

var Expression = require("./Expression");

var NumberLiteralExpression = module.exports = Expression.extend({

	initialize: function (literal) {
		this._literal = literal;
	}

});
