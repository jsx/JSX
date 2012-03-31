"use strict";

var Statement = require("./Statement");

var ContinueStatement = module.exports = Statement.extend({

	initialize: function (label) {
		this._label = label;
	}

});
