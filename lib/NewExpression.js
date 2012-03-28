"use strict";

var Expression = require("./Expression");

var NewExpression = module.exports = Expression.extend({

	initialize: function (name, args) {
		this._name = name;
		this._args = args;
	}

});
