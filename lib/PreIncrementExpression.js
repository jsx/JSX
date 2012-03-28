"use strict";

var Expression = require("./Expression");

var PreIncrementExpression = module.exports = Expression.extend({

	initialize: function (op, expr) {
		this._op = op;
		this._expr = expr;
	}

});
