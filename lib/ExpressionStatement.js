"use strict";

var Statement = require("./Statement");

var ExpressionStatement = module.exports = Statement.extend({

	initialize: function (expr) {
		this._expr = expr;
	}

});
