"use strict";

var Class = require("./Class");

// FIXME add support for arrays and parameterized types
var TypeDeclaration = exports.TypeDeclaration = Class.extend({

	initialize: function (type) {
		this._type = type;
	},

	toString: function () {
		return this._type;
	}

});
