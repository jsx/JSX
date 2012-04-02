"use strict";

var Statement = require("./Statement");

var SwitchStatement = module.exports = Statement.extend({

	initialize: function (expr, caseExpr, defaultStatementIndex, statements) {
		this._expr = expr;
		this._caseExpr = caseExpr;
		this._defaultStatementIndex = defaultStatementIndex;
		this._statements = statements;
	}

});
