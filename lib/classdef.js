var Class = require("./Class");
var Type = require("./Type"); // cannot use eval(Class.$import()) since it is a lop

"use strict";

var ClassDefinition = exports.ClassDefinition = Class.extend({

	$IS_CONST: 1,
	$IS_ABSTRACT: 2,
	$IS_FINAL: 4,
	$IS_STATIC: 8,

	$getClass: function (classDefs, name) {
		for (var i = 0; i < classDefs.length; ++i)
			if (name == classDefs[i].className())
				return classDefs[i];
		return null;
	},

	initialize: function (className, flags, extendName, implementNames, members, objectTypesUsed) {
		this._className = className;
		this._flags = flags;
		this._extendName = extendName;
		this._extendClassDef = null;
		this._implementNames = implementNames;
		this._implementClassDefs = [];
		this._members = members;
		this._objectTypesUsed = objectTypesUsed;
	},

	className: function () {
		return this._className;
	},

	flags: function () {
		return this._flags;
	},

	extendName: function () {
		return this._extendName;
	},

	extendClassDef: function () {
		return tihs._extendClassDef;
	},

	implementNames: function () {
		return this._implementNames;
	},

	implementClassDefs: function () {
		return this._implementClassDefs;
	},

	members: function () {
		return this._members;
	},

	getMemberTypesByName: function (errors, classDefs, name) {
		// returns an array to support function overloading
		var types = [];
		this._getMemberTypesByName(errors, classDefs, types, name);
		if (types.length == 0)
			return null;
		return types;
	},

	_getMemberTypesByName: function (errors, classDefs, types, name) {
		if (this._extendClassDef != null)
			this._extendClassDef._getMemberTypesByName(errors, classDefs, types, name);
		for (var i = 0; i < this._implementClassDefs.length; ++i)
			this._implementClassDefs[i]._getMemberTypesByName(errors, classDefs, types, name);
		for (var i = 0; i < this._members.length; ++i)
			if (name == this._members[i].name())
				ClassDefinition._addTypeToArrayIfNotExists(errors, classDefs, types, this._members[i]);
	},

	$_addTypeToArrayIfNotExists: function (errors, classDefs, types, member) {
		if (member instanceof MemberVariableDefinition) {
			var type = member.getType(errors, classDefs);
			// ignore member variables that failed in type deduction
			if (type != null)
				types.push(type);
			return;
		} else {
			// member function
			// skip if already in list (happens if the function is overridden)
			var newType = member.getType();
			for (var i = 0; i < types.length; ++i)
				if (newType.equalsIgnoringClassName(types[i]))
					return;
			types.push(newType);
		}
	},

	resolveTypes: function (errors, classDefs) {
		// resolve extends
		if (this._extendName != null) {
			var baseClassName = IdentifierToken.toString(this._extendName);
			var baseClass = ClassDefinition.getClass(classDefs, baseClassName);
			if (baseClass == null)
				errors.push(new CompileError(this._extendName[0], "class '" + baseClassName + "' is not defined"));
			this._extendClassDef = baseClass;
		}
		// resolve implements
		for (var i = 0; i < this._implementNames.length; ++i) {
			var baseClassName = IdentifierToken.toString(this._implementNames[i]);
			var baseClass = ClassDefinition.getClass(classDefs, baseClassName);
			if (baseClass == null)
				errors.push(new CompileError(this._implementNames[i][0], "interface '" + baseClassName + "' is not defined"));
			this._implementsClassDefs.push(baseClass);
		}
		// resolve types used
		for (var i = 0; i < this._objectTypesUsed.length; ++i)
			this._objectTypesUsed[i].resolveTypes(errors, classDefs);
	},

	analyze: function (errors, classDefs) {
		for (var i = 0; i < this._members.length; ++i) {
			var member = this._members[i];
			// analysis of member variables are delayed (and those that where never analyzed will be removed by dead code elimination)
			if (member instanceof MemberFunctionDefinition)
				member.analyze(errors, classDefs, this);
		}
	},
});

var MemberDefinition = exports.MemberDefinition = Class.extend({

	initialize: function (identifierToken, flags) {
		this._identifierToken = identifierToken;
		this._flags = flags;
	},

	name: function () {
		return this._identifierToken.identifier;
	}

});

var MemberVariableDefinition = exports.MemberVariableDefinition = MemberDefinition.extend({

	$NOT_ANALYZED: 0,
	$IS_ANALYZING: 1,
	$ANALYZE_SUCEEDED: 2,
	$ANALYZE_FAILED: 3,

	initialize: function (identifierToken, flags, type, initialValue) {
		MemberDefinition.call(this, identifierToken, flags);
		this._type = type; // may be null
		this._initialValue = initialValue; // may be null
		this._analyzeState = MemberVariableDefinition.NOT_ANALYZED;
	},

	getType: function (errors, classDefs) {
		switch (this._analyzeState) {
		case MemberVariableDefinition.NOT_ANALYZED:
			try {
				this._analyzeState = MemberVariableDefinition.IS_ANALYZING;
				if (this._type != null)
					if (! this._type.assertExistence(classDefs))
						return;
				if (this._initialValue != null) {
					if (! this._initialValue.analyze(errors, classDefs, null))
						return;
					var ivType = this._initialValue.getType();
					if (this._type == null) {
						this._type = ivType;
					} else if (! this._type.equals(ivType)) {
						errors.push(new CompileError(this._initialValue,
							"conflicting types for variable '" + this.name + "', expected '" + this._type.toString(), "' but got '" + ivType.toString()));
					}
				}
				this._analyzeState = MemberVariableDefinition.ANALYZE_SUCEEDED;
			} finally {
				if (this._analyzeState != MemberVariableDefinition.ANALYZE_SUCEEDED)
					this._analyzeState = MemberVariableDefinition.ANALYZE_FAILED;
			}
			break;
		case MemberVariableDefinition.IS_ANALYZING:
			errors.push(new CompileError(this._identifierToken,
				"please declare type of variable '" + this._identifierToken.identifier + "' (detected recursion while trying to reduce type)"));
			break;
		default:
			break;
		}
		return this._type;
	}

});

var MemberFunctionDefinition = exports.MemberFunctionDefinition = MemberDefinition.extend({

	initialize: function (identifierToken, flags, returnType, args, locals, statements) {
		MemberDefinition.call(this, identifierToken, flags);
		this._returnType = returnType;
		this._args = args;
		this._locals = locals;
		this._statements = statements;
		this._classDef = null;
	},

	analyze: function (errors, classDefs, classDef) {
		this._classDef = classDef;
		for (var i = 0; i < this._statements.length; ++i)
			this._statements[i].analyze(errors, classDefs, this);
	},

	getClassDef: function () {
		return this._classDef;
	},

	getArgumentTypes: function () {
		var argTypes = [];
		for (var i = 0; i < this._args.length; ++i)
			argTypes[i] = this._args[i].getType();
		return argTypes;
	},

	isCallableWith: function (argTypes, strict) {
		var myArgTypes = this.getArgumentTypes();
		if (myArgTypes.length != argTypes)
			return false;
		for (var i = 0; i < argTypes.length; i++) {
			if (argTypes[i].equals(myArgTypes[i])) {
				// ok
			} else {
				if (strict)
					return false;
				if (! argTypes[i].isConvertibleTo(myArgTypes[i]))
					return false;
			}
		}
		return true;
	},

	getLocal: function (name) {
		for (var i = 0; i < this._locals.length; ++i) {
			var local = this._locals[i];
			if (local.getName() == name)
				return local;
		}
		for (var i = 0; i < this._args.length; ++i) {
			var arg = this._args[i];
			if (arg.getName() == name)
				return arg;
		}
		return null;
	},

	getType: function () {
		return (this._flags & ClassDefinition.IS_STATIC) != 0
			? new Type.StaticFunctionType(this._returnType, this.getArgumentTypes(), false)
			: new Type.MemberFunctionType(new ObjectType(this._classDef), this._returnType, this.getArgumentTypes(), false);
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
		LocalVariable.prototype.initialize.call(this, name, type);
	}

});
