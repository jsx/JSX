"use strict";

var Expression = require("./Expression");

var PropertyExpression = module.exports = Expression.extend({

	initialize: function (baseExpr, propertyExpr) {
		this._baseExpr = baseExpr;
		this._propertyExpr = propertyExpr;
	}

});
