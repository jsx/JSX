"use strict";

var Expression = require("./Expression");

var EqualityExpression = module.exports = Expression.extend({

	initialize: function (op, expr1, expr2) {
		this._op = op;
		this._expr1 = expr2;
		this._expr2 = expr2;
	}

});
