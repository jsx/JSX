"use strict";

var Expression = require("./Expression");

var ConditionalExpression = module.exports = Expression.extend({

	initialize: function (condExpr, ifTrueExpr, ifFalseExpr) {
		this._condExpr = condExpr;
		this._ifTrueExpr = ifTrueExpr;
		this._ifFalseExpr = ifFalseExpr;
	}

});
