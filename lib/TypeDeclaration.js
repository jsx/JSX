"use strict";

var Class = require("./Class");

// FIXME add support for arrays and parameterized types
var Type = module.exports = Class.extend({

	initialize: function (type) {
		this._type = type;
	},

	toString: function () {
		return this._type;
	}

});
