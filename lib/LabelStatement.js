"use strict";

var Statement = require("./Statement");

var LabelStatement = module.exports = Statement.extend({

	initialize: function (identifier) {
		this._identifier = identifier;
	}

});
