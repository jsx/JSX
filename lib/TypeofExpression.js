"use strict";

var Expression = require("./Expression");

var TypeofExpression = module.exports = Expression.extend({

	initialize: function (expr) {
		this._expr = expr;
	}

});
