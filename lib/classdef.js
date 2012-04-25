var Class = require("./Class");
var Type = require("./type");
eval(Class.$import("./util"));

"use strict";

var AnalysisContext = exports.AnalysisContext = Class.extend({

	initialize: function (errors, classDefs, instantiateTemplate) {
		this.errors = errors;
		this.classDefs = classDefs;
		this.instantiateTemplate = instantiateTemplate;
		this.funcDef = null;
		this.blockStack = null;
	},

	clone: function () {
		return new AnalysisContext(this.errors, this.classDefs, this.instantiateTemplate).setFuncDef(this.funcDef).setBlockStack(this.blockStack);
	},

	setFuncDef: function (funcDef) {
		this.funcDef = funcDef;
		return this;
	},

	setBlockStack: function (blockStack) {
		this.blockStack = blockStack;
		return this;
	}

});

var ClassDefinition = exports.ClassDefinition = Class.extend({

	$IS_CONST: 1,
	$IS_ABSTRACT: 2,
	$IS_FINAL: 4,
	$IS_STATIC: 8,
	$IS_NATIVE: 16,
	$IS_OVERRIDE: 32,
	$IS_INTERFACE: 64,

	$getClass: function (classDefs, name) {
		for (var i = 0; i < classDefs.length; ++i)
			if (name == classDefs[i].className())
				return classDefs[i];
		return null;
	},

	initialize: function (token, className, flags, extendName, implementNames, members, objectTypesUsed) {
		this._token = token;
		this._className = className;
		this._flags = flags;
		this._extendName = extendName;
		this._extendClassDef = null;
		this._implementNames = implementNames;
		this._implementClassDefs = [];
		this._members = members;
		this._objectTypesUsed = objectTypesUsed;
	},

	serialize: function () {
		// FIXME implement in a way that is compatible with JSX
		return {
			"token"      : this._token,
			"name"       : this._className,
			"flags"      : this._flags,
			"extends"    : Util.serializeNullable(this._extendClassDef),
			"implements" : Util.serializeArray(this._implementClassDefs),
			"members"    : Util.serializeArray(this._members)
		};
	},

	$serialize: function (classDefs) {
		var s = [];
		for (var i = 0; i < classDefs.length; ++i)
			s[i] = classDefs[i].serialize();
		return JSON.stringify(s, null, 2);
	},

	getToken: function () {
		return this._token;
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
		return this._extendClassDef;
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

	getMemberTypeByName: function (errors, classDefs, name, includeBaseClasses) {
		// returns an array to support function overloading
		var types = [];
		this._getMemberTypesByName(errors, classDefs, types, name, includeBaseClasses);
		switch (types.length) {
		case 0:
			return null;
		case 1:
			return types[0];
		default:
			return new Type.FunctionChoiceType(types);
		}
	},

	_getMemberTypesByName: function (errors, classDefs, types, name, includeBaseClasses) {
		if (includeBaseClasses) {
			if (this._extendClassDef != null)
				this._extendClassDef._getMemberTypesByName(errors, classDefs, types, name, includeBaseClasses);
			for (var i = 0; i < this._implementClassDefs.length; ++i)
				this._implementClassDefs[i]._getMemberTypesByName(errors, classDefs, types, name, includeBaseClasses);
		}
		for (var i = 0; i < this._members.length; ++i) {
			var member = this._members[i];
			if (name == member.name() && (member.flags() & ClassDefinition.IS_OVERRIDE) == 0) {
				if (member instanceof MemberVariableDefinition) {
					var type = member.getType(errors, classDefs);
					// ignore member variables that failed in type deduction (already reported as a compile error)
					// it is guranteed by _assertMemberVariableIsDefinable that there would not be a property with same name using different type, so we can use the first one (declarations might be found more than once using the "abstract" attribute)
					if (type != null && types.length == 0)
						types[0] = type;
				} else if (member instanceof MemberFunctionDefinition) {
					// member function
					types.push(member.getType());
				} else {
					throw new Error("logic flaw");
				}
			}
		}
	},

	resolveTypes: function (context) {
		// resolve extends
		if (this._extendName != null) {
			var baseClass = ClassDefinition.getClass(context.classDefs, this._extendName.getValue());
			if (baseClass == null)
				context.errors.push(new CompileError(this._extendName, "class '" + this._extendName.getValue() + "' is not defined"));
			else if ((baseClass.flags() & ClassDefinition.IS_FINAL) != 0)
				context.errors.push(new CompileError(this._extendName, "cannot extend a final class"));
			else if ((baseClass.flags() & ClassDefinition.IS_INTERFACE) != 0)
				context.errors.push(new CompileError(this._extendName, "cannot extend an interface, use the 'implements' keyword"));
			else
				this._extendClassDef = baseClass;
		} else if (this._className != "Object") {
			this._extendClassDef = ClassDefinition.getClass(context.classDefs, "Object");
		}
		// resolve implements
		for (var i = 0; i < this._implementNames.length; ++i) {
			var baseClass = ClassDefinition.getClass(context.classDefs, this._implementNames[i].getValue());
			var success = true;
			if (baseClass == null) {
				context.errors.push(new CompileError(this._implementNames[i], "interface '" + this._implementNames[i].getValue() + "' is not defined"));
				success = false;
			} else if ((baseClass.flags() & ClassDefinition.IS_INTERFACE) == 0) {
				context.errors.push(new CompileError(this._implementNames[i], "cannot implement a class (only interfaces can be implemented)"));
				success = false;
			} else {
				for (var j = 0; j < this._implementClassDefs.length; ++j) {
					if (this._implementClassDefs[j] == baseClass) {
						context.errors.push(new CompileError(this._implementNames[i], "cannot implement the same interface more than once"));
						success = false;
						break;
					}
				}
			}
			if (success)
				this._implementClassDefs.push(baseClass);
		}
		// resolve types used
		for (var i = 0; i < this._objectTypesUsed.length; ++i)
			this._objectTypesUsed[i].resolveType(context);
	},

	analyze: function (context) {
		// check that the class may be extended
		if (this._extendClassDef != null)
			this._extendClassDef._assertClassIsExtendable(context, this, this._extendName);
		// check that none of the implement interfaces are implemented by the base classes
		if ((this.flags() & ClassDefinition.IS_INTERFACE) != 0)
			for (var i = 0; i < this._implementClassDefs.length; ++i)
				if (! this._implementClassDefs[i]._assertInterfaceIsImplementable(context, this, this.getToken()))
					break;
		for (var i = 0; i < this._implementClassDefs.length; ++i) {
			if (this._extendClassDef != null && ! this._extendClassDef._assertInterfaceIsImplementable(context, this._implementClassDefs[i], this._implementNames[i])) {
				// error found and reported
			} else {
				for (var j = 0; j < i; ++j) {
					if (! this._implementClassDefs[j]._assertInterfaceIsImplementable(context, this._implementClassDefs[i], this._implementNames[i])) {
						// error found and reported
					}
				}
			}
		}
		// check that the properties of the class does not conflict with those in base classes or implemented interfaces
		for (var i = 0; i < this._members.length; ++i)
			this._assertMemberIsDefinable(context, this._members[i], this, this._members[i].getToken());
		// check that the properties of the implemented interfaces does not conflict with those in base classes or other implement interfaces
		for (var i = 0; i < this._implementClassDefs.length; ++i) {
			var interfaceDef = this._implementClassDefs[i];
			for (var j = 0; j < interfaceDef._members.length; ++j) {
				if (this._extendClassDef != null && ! this._extendClassDef._assertMemberIsDefinable(context, interfaceDef._members[j], interfaceDef, this._implementNames[i])) {
					// error found and reported
				} else {
					for (var k = 0; k < i; ++k) {
						if (! this._implementClassDefs[k]._assertMemberIsDefinable(context, interfaceDef._members[j], interfaceDef, this._implementNames[i])) {
							// error found and reported
							break;
						}
					}
				}
			}
		}
		// analyze the member functions, analysis of member variables is performed lazily (and those that where never analyzed will be removed by dead code elimination)
		for (var i = 0; i < this._members.length; ++i) {
			var member = this._members[i];
			if (member instanceof MemberFunctionDefinition)
				member.analyze(context, this);
		}
	},

	isConvertibleTo: function (classDef) {
		if (this == classDef)
			return true;
		if (this._extendClassDef != null && this._extendClassDef.isConvertibleTo(classDef))
			return true;
		for (var i = 0; i < this._implementClassDefs.length; ++i)
			if (this._implementClassDefs[i].isConvertibleTo(classDef))
				return true;
		return false;
	},

	_assertClassIsExtendable: function (context, classDef, token) {
		if (this == classDef) {
			context.errors.push(new CompileError(token, "class inheritance is in a loop"));
			return false;
		}
		if (this._extendClassDef != null)
			return this._extendClassDef._assertClassIsExtendable(context, classDef, token);
		return true;
	},

	_assertInterfaceIsImplementable: function (context, classDef, token) {
		for (var i = 0; i < this._implementClassDefs.length; ++i) {
			if (this._implementClassDefs[i] == classDef) {
				context.errors.push(new CompileError(token, "cannot implement interface '" + classDef.className() + "' already implement by '" + this.className() + "'"));
				return false;
			}
		}
		return true;
	},

	_assertMemberIsDefinable: function (context, member, memberClassDef, token) {
		if ((member.flags() & ClassDefinition.IS_STATIC) != 0)
			return true;
		if (member instanceof MemberVariableDefinition) {
			if (this._extendClassDef != null && ! this._extendClassDef._assertMemberVariableIsDefinable(context, member, memberClassDef, token))
				return false;
			for (var i = 0; i < this._implementClassDefs.length; ++i)
				if (this._implementClassDefs[i]._assertMemberVariableIsDefinable(context, member, memberClassDef, token))
					return false;
		} else { // function
			if (this._extendClassDef != null && ! this._extendClassDef._assertMemberFunctionIsDefinable(context, member, memberClassDef, token))
				return false;
			for (var i = 0; i < this._implementClassDefs.length; ++i)
				if (! this._assertMemberFunctionIsDefinable(context, member, memberClassDef, token))
					return false;
		}
		return true;
	},

	_assertMemberVariableIsDefinable: function (context, member, memberClassDef, token) {
		for (var i = 0; i < this._members.length; ++i) {
			if (this._members[i].name() == member.name()) {
				if ((this._members[i].flags() & ClassDefinition.IS_ABSTRACT) == 0) {
					context.errors.push(new CompileError(token, "cannot define property '" + memberClassDef.className() + "#" + member.name() + "', the name is already used in '" + this.className() + "'"));
					return false;
				}
				if (! this._members[i].getType().equals(member.getType())) {
					context.errors.push(new CompileError(token, "cannot override property '" + this.className() + "#" + member.name() + "' of type '" + this._members[i].getType().toString() + "' in class '" + memberClassDef.className() + "' with different type '" + member.getType().toString() + "'"));
					return false;
				}
			}
		}
		if (this._extendClassDef != null && ! this._extendClassDef._assertMemberVariableIsDefinable(context, member, memberClassDef, token))
			return false;
		for (var i = 0; i < this._implementClassDefs.length; ++i)
			if (! this._implementClassDefs[i]._assertMemberVariableIsDefinable(context, member, memberClassDef, token))
				return false;
		return true;
	},

	_assertMemberFunctionIsDefinable: function (context, member, memberClassDef, token) {
		for (var i = 0; i < this._members.length; ++i) {
			if (this._members[i].name() != member.name())
				continue;
			// property with the same name has been found, we can tell yes or no now
			if (this._members[i] instanceof MemberVariableDefinition) {
				context.errors.push(new CompileError(token, "cannot define property '" + memberClassDef.className() + "#" + member.name() + "', the name is already used in '" + this.className() + "'"));
				return false;
			}
			if (! Util.typesAreEqual(this._members[i].getArgumentTypes(), member.getArgumentTypes()))
				continue;
			if ((member.flags() & ClassDefinition.IS_OVERRIDE) == 0) {
				context.errors.push(new CompileError(member.getToken(), "overriding functions must have 'override' attribute set (defined in base class '" + this.className() + "')"));
				return false;
			}
			if ((this._members[i].flags() & ClassDefinition.IS_FINAL) != 0) {
				context.errors.push(new CompileError(member.getToken(), "cannot override a function with 'final' attribute set (defined in base class '" + this.className() + "')"));
				return false;
			}
			return true;
		}
		// delegate to base classes
		if (this._extendClassDef != null && ! this._extendClassDef._assertMemberFunctionIsDefinable(context, member, memberClassDef, token))
			return false;
		for (var i = 0; i < this._implementClassDefs.length; ++i)
			if (! this._implementClassDefs[i]._assertMemberFunctionIsDefinable(context, member, memberClassDef, token))
				return false;
		return true;
	}

});

var MemberDefinition = exports.MemberDefinition = Class.extend({

	initialize: function (identifierToken, flags) {
		this._identifierToken = identifierToken;
		this._flags = flags;
	},

	getToken: function () {
		return this._identifierToken;
	},

	name: function () {
		return this._identifierToken.getValue();
	},

	flags: function () {
		return this._flags;
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

	serialize: function () {
		return {
			"name"         : this.name(),
			"flags"        : this.flags(),
			"type"         : this._type.serialize(),
			"initialValue" : Util.serializeNullable(this._initialValue)
		};
	},

	getType: function (errors, classDefs) {
		switch (this._analyzeState) {
		case MemberVariableDefinition.NOT_ANALYZED:
			try {
				this._analyzeState = MemberVariableDefinition.IS_ANALYZING;
				if (this._initialValue != null) {
					if (! this._initialValue.analyze(new AnalysisContext(errors, classDefs, null)))
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
				"please declare type of variable '" + this._identifierToken.getValue() + "' (detected recursion while trying to reduce type)"));
			break;
		default:
			break;
		}
		return this._type;
	},

	getInitialValue: function () {
		return this._initialValue;
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

	instantiate: function (instantiationContext) {
		if (this._statements != null)
			throw new Error("template instantiation of function body is not supported (yet)");
		var returnType = this._returnType.instantiate(instantiationContext);
		if (returnType == null)
			return null;
		var args = [];
		for (var i = 0; i < this._args.length; ++i) {
			var arg = this._args[i].instantiate(instantiationContext);
			if (arg == null)
				return null;
			args[i] = arg;
		}
		return new MemberFunctionDefinition(this._identifierToken, this._flags, returnType, args, null, null);
	},

	serialize: function () {
		return {
			"name"       : this.name(),
			"flags"      : this.flags(),
			"returnType" : this._returnType.serialize(),
			"args"       : Util.serializeArray(this._args),
			"locals"     : Util.serializeArray(this._locals),
			"statements" : Util.serializeArray(this._statements)
		};
	},

	analyze: function (context, classDef) {
		this._classDef = classDef;
		// return if is abtract (wo. function body) or is native
		if (this._statements == null)
			return;
		context = context.clone().setFuncDef(this).setBlockStack([]); // FIXME push something onto the block stack as an initial value?
		for (var i = 0; i < this._statements.length; ++i)
			this._statements[i].analyze(context);
	},

	getClassDef: function () {
		return this._classDef;
	},

	getReturnType: function () {
		return this._returnType;
	},

	getArguments: function () {
		return this._args;
	},

	getArgumentTypes: function () {
		var argTypes = [];
		for (var i = 0; i < this._args.length; ++i)
			argTypes[i] = this._args[i].getType();
		return argTypes;
	},

	// return list of local variables (omitting arguments)
	getLocals: function () {
		return this._locals;
	},

	getStatements: function () {
		return this._statements;
	},

	// return an argument or a local variable
	getLocal: function (name) {
		for (var i = 0; i < this._locals.length; ++i) {
			var local = this._locals[i];
			if (local.getName().getValue() == name)
				return local;
		}
		for (var i = 0; i < this._args.length; ++i) {
			var arg = this._args[i];
			if (arg.getName().getValue() == name)
				return arg;
		}
		return null;
	},

	getType: function () {
		return (this._flags & ClassDefinition.IS_STATIC) != 0
			? new Type.StaticFunctionType(this._returnType, this.getArgumentTypes(), false)
			: new Type.MemberFunctionType(new Type.ObjectType(this._classDef), this._returnType, this.getArgumentTypes(), false);
	}

});

var LocalVariable = exports.LocalVariable = Class.extend({

	initialize: function (name, type) {
		this._name = name;
		this._type = type;
	},

	serialize: function () {
		return [
			this._name,
			Util.serializeNullable(this._type)
		];
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
		// implicit declarations of "int" is not supported
		if (type.equals(Type.integerType))
			type = Type.numberType;
		this._type = type;
	},

	toString: function () {
		return this._name + " : " + this._type;
	}
});

var ArgumentDeclaration = exports.ArgumentDeclaration = LocalVariable.extend({

	initialize: function (name, type) {
		LocalVariable.prototype.initialize.call(this, name, type);
	},

	instantiate: function (instantiationContext) {
		var type = this._type.instantiate(instantiationContext);
		return new ArgumentDeclaration(this._name, type);
	}

});

var TemplateClassDefinition = exports.TemplateClassDefinition = Class.extend({

	$getClass: function (classDefs, name) {
		for (var i = 0; i < classDefs.length; ++i)
			if (name == classDefs[i].className())
				return classDefs[i];
		return null;
	},

	initialize: function (className, flags, typeArgs, extendName, implementNames, members, objectTypesUsed) {
		if (extendName != null || implementNames.length != 0)
			throw new Error("not supported");
		this._className = className;
		this._flags = flags;
		this._typeArgs = typeArgs;
		this._members = members;
		this._objectTypesUsed = objectTypesUsed;
	},

	className: function () {
		return this._className;
	},

	instantiate: function (errors, request) {
		// check number of type arguments
		if (this._typeArgs.length != request.getTypeArguments().length) {
			errors.push(new CompileError(request.getToken(), "wrong number of template arguments (expected " + this._typeArgs.length + ", got " + request.getTypes().length));
			return null;
		}
		// build context
		var instantiationContext = {
			errors: errors,
			request: request,
			typemap: {}, // string => Type
			objectTypesUsed: []
		};
		for (var i = 0; i < this._typeArgs.length; ++i)
			instantiationContext.typemap[this._typeArgs[i].getValue()] = request.getTypeArguments()[i];
		// FIXME add support for extend and implements
		var succeeded = true;
		var members = [];
		for (var i = 0; i < this._members.length; ++i) {
			var member = this._members[i].instantiate(instantiationContext);
			if (member == null)
				succeeded = false;
			members[i] = member;
		}
		// done
		if (! succeeded)
			return null;
		return new InstantiatedClassDefinition(
			this._className,
			this._flags,
			request.getTypeArguments(),
			null,
			[],
			members,
			instantiationContext.objectTypesUsed);
	}

});

var InstantiatedClassDefinition = exports.InstantiatedClassDefinition = ClassDefinition.extend({

	initialize: function (templateClassName, flags, typeArguments, extendName, implementNames, members, objectTypesUsed) {
		ClassDefinition.prototype.initialize.call(
			this,
			null,
			Type.Type.templateTypeToString(templateClassName, typeArguments),
			flags,
			extendName,
			implementNames,
			members,
			objectTypesUsed);
		this._templateClassName = templateClassName;
		this._typeArguments = typeArguments;
	},

	getTemplateClassName: function () {
		return this._templateClassName;
	},

	getTypeArguments: function () {
		return this._typeArguments;
	}

});
