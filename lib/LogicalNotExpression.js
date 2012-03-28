"use strict";

var Expression = require("./Expression");

var LogicalNotExpression = module.exports = Expression.extend({

	initialize: function (expr) {
		this._expr = expr;
	}

});
