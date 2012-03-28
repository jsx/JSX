"use strict";

var Class = require("./Class");

var ClassDefinition = module.exports = Class.extend({

	initialize: function (className, flags, extendNames, implementNames, members) {
		this._className = className;
		this._flags = flags;
		this._extendNames = extendNames;
		this._implementNames = implementNames;
		this._members = members;
	}

});
