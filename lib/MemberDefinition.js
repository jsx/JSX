"use strict";

var Class = require("./Class");

var MemberDefinition = module.exports = Class.extend({

	initialize: function (name, flags) {
		this._name = name;
		this._flags = flags;
	}
});
