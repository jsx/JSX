"use strict";

var Expression = require("./Expression");

var AssignmentExpression = module.exports = Expression.extend({

	initialize: function (op, lhsExpr, rhsExpr) {
		this._op = op;
		this._lhsExpr = lhsExpr;
		this._rhsExpr = rhsExpr;
	}

});
