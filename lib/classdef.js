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
	}
});

var ArgumentDeclaration = exports.ArgumentDeclaration = Class.extend({

	initialize: function (name, type) {
		this._name = name;
		this._type = type;
	},

	toString: function () {
		return this._name + " : " + this._type;
	}
});

var LocalVariable = exports.LocalVariable = Class.extend({

	initialize: function (name, type) {
		this.name = name;
		this.type = type;
	}

});
