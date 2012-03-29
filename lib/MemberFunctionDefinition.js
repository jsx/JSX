"use strict";

var MemberDefinition = require("./MemberDefinition");

var MemberFunctionDefinition = module.exports = MemberDefinition.extend({

	initialize: function (name, flags, returnType, args, locals, statements) {
		MemberDefinition.call(this, name, flags);
		this._returnType = returnType;
		this._args = args;
		this._locals = locals;
		this._statements = statements;
	}
});
