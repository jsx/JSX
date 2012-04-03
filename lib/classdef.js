var Class = require("./Class");

"use strict";

var ClassDefinition = exports.ClassDefinition = Class.extend({

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

var MemberDefinition = exports.MemberDefinition = Class.extend({

	initialize: function (name, flags) {
		this._name = name;
		this._flags = flags;
	}
});

var MemberVariableDefinition = exports.MemberVariableDefinition = MemberDefinition.extend({

	initialize: function (name, flags, type, initialValue) {
		MemberDefinition.call(this, name, flags);
		this._type = type;
		this._initialValue = initialValue;
	}
});

var MemberFunctionDefinition = exports.MemberFunctionDefinition = MemberDefinition.extend({

	initialize: function (name, flags, returnType, args, locals, statements) {
		MemberDefinition.call(this, name, flags);
		this._returnType = returnType;
		this._args = args;
		this._locals = locals;
		this._statements = statements;
	},

	getLocal: function (name) {
		for (var i = 0; i < this._locals.length; ++i) {
			var local = this_.locals[i];
			if (local.getName() == name)
				return local;
		}
		for (var i = 0; i < this._args.length; ++i) {
			var arg = this._args[i];
			if (arg.getName() == name)
				return arg;
		}
		return null;
	}
});

var LocalVariable = exports.LocalVariable = Class.extend({

	initialize: function (name, type) {
		this._name = name;
		this._type = type;
	},

	getName: function () {
		return this._name;
	},

	getType: function () {
		return this._type;
	},

	setType: function (type) {
		if (this._type != null)
			throw Error("type is already set");
		this._type = type;
	},

	toString: function () {
		return this._name + " : " + this._type;
	}
});

var ArgumentDeclaration = exports.ArgumentDeclaration = LocalVariable.extend({

	initialize: function (name, type) {
		LocalVariable.prototoype.initialize.call(this, name, type);
	}

});
