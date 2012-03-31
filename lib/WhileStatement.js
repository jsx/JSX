"use strict";

var Statement = require("./Statement");

var WhileStatement = module.exports = Statement.extend({

	initialize: function (expr, statements) {
		this._expr = expr;
		this._statements = statements;
	}

});
