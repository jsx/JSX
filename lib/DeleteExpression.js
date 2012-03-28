"use strict";

var Expression = require("./Expression");

var DeleteExpression = module.exports = Expression.extend({

	initialize: function (expr) {
		this._expr = expr;
	}

});
