"use strict";

var Statement = require("./Statement");

var WhileStatement = module.exports = Statement.extend({

	initialize: function (identifier, expr, statements) {
		this._identifier = identifier;
		this._expr = expr;
		this._statements = statements;
	}

});
