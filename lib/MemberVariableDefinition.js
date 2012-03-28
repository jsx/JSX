"use strict";

var MemberDefinition = require("./MemberDefinition");

var MemberVariableDefinition = module.exports = MemberDefinition.extend({

	initialize: function (name, flags, type, initialValue) {
		MemberDefinition.call(this, name, flags);
		this._type = type;
		this._initialValue = initialValue;
	}
});
