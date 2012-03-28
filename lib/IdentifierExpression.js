"use strict";

var Expression = require("./Expression");

var IdentifierExpression = module.exports = Expression.extend({

	initialize: function (identifier) {
		this._identifier = identifier;
	}

});
