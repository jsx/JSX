var Class = require("./Class");
var Type = require("./type");
eval(Class.$import("./util"));

"use strict";

var AnalysisContext = exports.AnalysisContext = Class.extend({

	initialize: function (errors, classDefs, funcDef) {
		this.errors = errors;
		this.classDefs = classDefs;
		this.funcDef = funcDef;
		this.blockStack = null;
	},

});

var ClassDefinition = exports.ClassDefinition = Class.extend({

	$IS_CONST: 1,
	$IS_ABSTRACT: 2,
	$IS_FINAL: 4,
	$IS_STATIC: 8,
	$IS_NATIVE: 16,
	$IS_OVERRIDE: 32,

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

	serialize: function () {
		// FIXME implement in a way that is compatible with JSX
		return {
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
		if (! includeBaseClasses) {
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
					if (type != null)
						types.push(type);
				} else if (member instanceof MemberFunctionDefinition) {
					// member function
					types.push(member.getType());
				} else {
					throw new Error("logic flaw");
				}
			}
		}
	},

	resolveTypes: function (errors, classDefs) {
		// resolve extends
		if (this._extendName != null) {
			var baseClassName = Util.qualifiedNameToString(this._extendName);
			var baseClass = ClassDefinition.getClass(classDefs, baseClassName);
			if (baseClass == null)
				errors.push(new CompileError(this._extendName[0], "class '" + baseClassName + "' is not defined"));
			this._extendClassDef = baseClass;
		}
		// resolve implements
		for (var i = 0; i < this._implementNames.length; ++i) {
			var baseClassName = Util.qualifiedNameToString(this._implementNames[i]);
			var baseClass = ClassDefinition.getClass(classDefs, baseClassName);
			if (baseClass == null)
				errors.push(new CompileError(this._implementNames[i][0], "interface '" + baseClassName + "' is not defined"));
			this._implementsClassDefs.push(baseClass);
		}
		// resolve types used
		for (var i = 0; i < this._objectTypesUsed.length; ++i)
			this._objectTypesUsed[i].resolveType(errors, classDefs);
	},

	analyze: function (errors, classDefs) {
		for (var i = 0; i < this._members.length; ++i) {
			var member = this._members[i];
			// analysis of member variables are delayed (and those that where never analyzed will be removed by dead code elimination)
			if (member instanceof MemberFunctionDefinition)
				member.analyze(errors, classDefs, this);
		}
	},

	isConvertibleTo: function (classDef) {
		if (this == classDef)
			return true;
		throw new Error("FIXME");
	}
});

var MemberDefinition = exports.MemberDefinition = Class.extend({

	initialize: function (identifierToken, flags) {
		this._identifierToken = identifierToken;
		this._flags = flags;
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

	analyze: function (errors, classDefs, classDef) {
		this._classDef = classDef;
		// return if is abtract (wo. function body) or is native
		if (this._statements == null)
			return;
		var context = new AnalysisContext(errors, classDefs, this);
		try {
			context.blockStack = []; // FIXME push something in
			for (var i = 0; i < this._statements.length; ++i)
				this._statements[i].analyze(context);
		} finally {
			context.blockStack = null;
		}
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
			typemap: {} // string => Type
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
			[]);
	}

});

var InstantiatedClassDefinition = exports.InstantiatedClassDefinition = ClassDefinition.extend({

	initialize: function (templateClassName, flags, typeArguments, extendName, implementNames, members, objectTypesUsed) {
		ClassDefinition.prototype.initialize.call(
			this,
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
