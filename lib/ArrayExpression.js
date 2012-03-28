"use strict";

var Expression = require("./Expression");

var ArrayExpression = module.exports = Expression.extend({

	initialize: function (baseExpr, indexExpr) {
		this._baseExpr = baseExpr;
		this._indexExpr = indexExpr;
	}

});
