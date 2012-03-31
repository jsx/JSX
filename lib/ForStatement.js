"use strict";

var Statement = require("./Statement");

var ForStatement = module.exports = Statement.extend({

	initialize: function (initExpr, condExpr, postExpr, statements) {
		this._initExpr = initExpr;
		this._condExpr = condExpr;
		this._postExpr = postExpr;
		this._statements = statements;
	}

});
