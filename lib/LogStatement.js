"use strict";

var Statement = require("./Statement");

var LogStatement = module.exports = Statement.extend({

	initialize: function (expr) {
		this._expr = expr;
	}

});
