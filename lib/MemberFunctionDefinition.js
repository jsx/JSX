"use strict";

var MemberDefinition = require("./MemberDefinition");

var MemberFunctionDefinition = module.exports = MemberDefinition.extend({

	initialize: function (name, flags, returnType, args, statements) {
		MemberDefinition.call(this, name, flags);
		this._returnType = returnType;
		this._args = args;
		this._statements = statements;
	}
});
