"use strict";

var Expression = require("./Expression");

var InExpression = module.exports = Expression.extend({

	initialize: function (expr1, expr2) {
		this._expr1 = expr2;
		this._expr2 = expr2;
	}

});
