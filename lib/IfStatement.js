"use strict";

var Statement = require("./Statement");

var IfStatement = module.exports = Statement.extend({

	initialize: function (expr, onTrueStatements, onFalseStatements) {
		this._expr = expr;
		this._onTrueStatements = onTrueStatements;
		this._onFalseStatements = onFalseStatements;
	}

});
