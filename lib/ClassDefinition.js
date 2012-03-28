"use strict";

var Class = require("./Class");

var ClassDefinition = module.exports = Class.extend({

	$IS_CONST: 1,
	$IS_ABSTRACT: 2,
	$IS_FINAL: 4,
	$IS_STATIC: 8,

	initialize: function (className, flags, extendNames, implementNames, members) {
		this._className = className;
		this._flags = flags;
		this._extendNames = extendNames;
		this._implementNames = implementNames;
		this._members = members;
	}

});
