"use strict";

var Expression = require("./Expression");

var BitwiseExpression = module.exports = Expression.extend({

	initialize: function (op, expr1, expr2) {
		this._op = op;
		this._expr1 = expr1;
		this._expr2 = expr2;
	}

});
