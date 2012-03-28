"use strict";

var Expression = require("./Expression");

var CallExpression = module.exports = Expression.extend({

	initialize: function (expr, args) {
		this._expr = expr;
		this._args = args;
	}

});
