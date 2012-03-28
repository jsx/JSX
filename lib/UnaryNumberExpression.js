"use strict";

var Expression = require("./Expression");

var UnaryNumberIncrementExpression = module.exports = Expression.extend({

	initialize: function (op, expr) {
		this._op = op;
		this._expr = expr;
	}

});
