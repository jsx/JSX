"use strict";

var Statement = require("./Statement");

var DoWhileStatement = module.exports = Statement.extend({

	initialize: function (expr, statements) {
		this._expr = expr;
		this._statements = statements;
	}

});
