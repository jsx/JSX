"use strict";

var Class = require("./Class");

var ArgumentDeclaration = module.exports = Class.extend({

	initialize: function (name, type) {
		this._name = name;
		this._type = type;
	},

	toString: function () {
		return this._name + " : " + this._type;
	}
});
