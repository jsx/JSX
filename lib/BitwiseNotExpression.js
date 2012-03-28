"use strict";

var Expression = require("./Expression");

var BitwiseNotExpression = module.exports = Expression.extend({

	initialize: function (expr) {
		this._expr = expr;
	}

});
