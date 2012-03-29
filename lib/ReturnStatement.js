"use strict";

var Statement = require("./Statement");

var ReturnStatement = module.exports = Statement.extend({

	initialize: function (expr) {
		this._expr = expr;
	}

});
