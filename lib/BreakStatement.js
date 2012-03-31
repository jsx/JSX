"use strict";

var Statement = require("./Statement");

var BreakStatement = module.exports = Statement.extend({

	initialize: function (label) {
		this._label = label;
	}

});
