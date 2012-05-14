var Class = require("./Class");
eval(Class.$import("./classdef"));
eval(Class.$import("./util"));

"use strict";

var Type = exports.Type = Class.extend({

	$_initialize: function () {
		this.voidType = new VoidType();
		this.undefinedType = new UndefinedType();
		this.nullType = new NullType();
		this.booleanType = new BooleanType();
		this.integerType = new IntegerType();
		this.numberType = new NumberType();
		this.stringType = new StringType();
		this.variantType = new VariantType();
	},

	serialize: function () {
		return this.toString();
	},

	isAssignable: null, // bool isAssignable()
	isConvertibleTo: null, // bool isConvertibleTo(type)
	getClassDef: null, // ClassDefinition getClassDef()

	equals: function (x) {
		return this == x || ((x instanceof Type) && this.toString() == x.toString());
	},

	resolveIfMayBeUndefined: function () {
		if (this instanceof MayBeUndefinedType)
			return this.getBaseType();
		return this;
	},

	asAssignableType: function () {
		return this;
	},

	toMayBeUndefinedType: function () {
		if (this instanceof MayBeUndefinedType || this instanceof VariantType)
			return this;
		return new MayBeUndefinedType(this);
	},

	$templateTypeToString: function (parameterizedTypeName, typeArgs) {
		var s = parameterizedTypeName + ".<";
		for (var i = 0; i < typeArgs.length; ++i) {
			if (i != 0)
				s += ",";
			s += typeArgs[i].toString();
		}
		s += ">";
		return s;
	},

	$isIntegerOrNumber: function (type) {
		return type instanceof IntegerType || type instanceof NumberType;
	}

});

// void and null are special types

var VoidType = exports.VoidType = Type.extend({

	instantiate: function (instantiationContext) {
		return this;
	},

	isAssignable: function () {
		return false;
	},

	isConvertibleTo: function (type) {
		return false;
	},

	getClassDef: function () {
		throw new Error("not supported");
	},

	toString: function () {
		return "void";
	}

});

var NullType = exports.NullType = Type.extend({

	instantiate: function (instantiationContext) {
		return this;
	},

	isAssignable: function () {
		return false;
	},

	isConvertibleTo: function (type) {
		type = type.resolveIfMayBeUndefined();
		return type instanceof ObjectType || type instanceof VariantType || type instanceof StaticFunctionType;
	},

	getClassDef: function () {
		throw new Error("not supported");
	},

	toString: function () {
		return "null";
	}

});

// primitive types

var PrimitiveType = exports.PrimitiveType = Type.extend({

	instantiate: function (instantiationContext) {
		return this;
	},

	isAssignable: function () {
		return true; // still does not support "const" qualifier
	}

});

var BooleanType = exports.BooleanType = PrimitiveType.extend({

	$_classDef: null,

	isConvertibleTo: function (type) {
		type = type.resolveIfMayBeUndefined();
		return type instanceof BooleanType || type instanceof VariantType;
	},

	getClassDef: function () {
		return BooleanType._classDef;
	},

	toString: function () {
		return "boolean";
	}

});

var IntegerType = exports.IntegerType = PrimitiveType.extend({

	$_classDef: null,

	isConvertibleTo: function (type) {
		type = type.resolveIfMayBeUndefined();
		return type instanceof IntegerType || type instanceof NumberType || type instanceof VariantType;
	},

	getClassDef: function () {
		return NumberType._classDef;
	},

	toString: function () {
		return "int";
	}

});

var NumberType = exports.NumberType = PrimitiveType.extend({

	$_classDef: null,

	isConvertibleTo: function (type) {
		type = type.resolveIfMayBeUndefined();
		return type instanceof IntegerType || type instanceof NumberType || type instanceof VariantType;
	},

	getClassDef: function () {
		return NumberType._classDef;
	},

	toString: function () {
		return "number";
	}

});

var StringType = exports.StringType = PrimitiveType.extend({

	$_classDef: null,

	isConvertibleTo: function (type) {
		type = type.resolveIfMayBeUndefined();
		return type instanceof StringType || type instanceof VariantType;
	},

	getClassDef: function () {
		return StringType._classDef;
	},

	toString: function () {
		return "string";
	}

});

// any type
var VariantType = exports.VariantType = Type.extend({

	instantiate: function (instantiationContext) {
		return this;
	},

	isAssignable: function () {
		return true;
	},

	isConvertibleTo: function (type) {
		type = type.resolveIfMayBeUndefined();
		return type instanceof VariantType;
	},

	getClassDef: function () {
		throw new Error("not supported");
	},

	toString: function () {
		return "variant";
	}

});

// undefined and MayBeUndefined

var UndefinedType = exports.UndefinedType = Type.extend({

	instantiate: function (instantiationContext) {
		return this;
	},

	isAssignable: function () {
		return false;
	},

	isConvertibleTo: function (type) {
		return type instanceof MayBeUndefinedType || type instanceof VariantType;
	},

	getClassDef: function () {
		throw new Error("not supported");
	},

	toString: function () {
		return "undefined";
	}

});


var MayBeUndefinedType = exports.MayBeUndefinedType = Type.extend({

	constructor: function (type) {
		if (type.equals(Type.variantType))
			throw new Error("logic error, cannot create MayBeUndefined.<variant>");
		this._baseType = type instanceof MayBeUndefinedType ? type._baseType : type;
	},

	instantiate: function (instantiationContext) {
		var baseType = this._baseType.instantiate(instantiationContext);
		return baseType.toMayBeUndefinedType();
	},

	isConvertibleTo: function (type) {
		return this._baseType.isConvertibleTo(type instanceof MayBeUndefinedType ? type._baseType : type);
	},

	isAssignable: function () {
		return true;
	},

	getClassDef: function () {
		return this._baseType.getClassDef();
	},

	getBaseType: function () {
		return this._baseType;
	},

	toString: function () {
		return "MayBeUndefined.<" + this._baseType.toString() + ">";
	}

});

// class and object types

var ClassDefType = exports.ClassDefType = Type.extend({

	constructor: function (classDef) {
		this._classDef = classDef;
	},

	instantiate: function (instantiationContext) {
		throw new Error("logic flaw; ClassDefType is created during semantic analysis, after template instantiation");
	},

	isConvertibleTo: function (type) {
		return false;
	},

	isAssignable: function () {
		return false;
	},

	getClassDef: function () {
		return this._classDef;
	},

	toString: function () {
		return this._classDef.className();
	}

});

var ObjectType = exports.ObjectType = Type.extend({

	constructor: function (classDef) {
		this._classDef = classDef;
	},

	instantiate: function (instantiationContext) {
		throw new Error("logic flaw; ObjectType is created during semantic analysis, after template instantiation");
	},

	resolveType: function (context) {
		if (this._classDef == null)
			throw new Error("logic flaw");
	},

	isConvertibleTo: function (type) {
		type = type.resolveIfMayBeUndefined();
		if (type instanceof VariantType)
			return true;
		// conversions from Number / String to number / string is handled in each operator (since the behavior differ bet. the operators)
		if (! (type instanceof ObjectType))
			return false;
		return this._classDef.isConvertibleTo(type._classDef);
	},

	isAssignable: function () {
		return true; // still does not support "const" qualifier
	},

	getClassDef: function () {
		return this._classDef;
	},

	toString: function () {
		return this._classDef.className();
	}

});

var ParsedObjectType = exports.ParsedObjectType = ObjectType.extend({

	constructor: function (className, typeArgs, token) {
		ObjectType.prototype.constructor.call(this, null);
		this._className = className;
		this._typeArguments = typeArgs;
		this._token = token;
	},

	instantiate: function (instantiationContext) {
		if (this._typeArguments.length == 0) {
			var actualType = instantiationContext.typemap[this._className];
			if (actualType != undefined)
				return actualType;
		}
		var typeArgs = [];
		for (var i = 0; i < this._typeArguments.length; ++i) {
			var actualType = instantiationContext.typemap[this._typeArguments[i].toString()];
			typeArgs[i] = actualType != undefined ? actualType : this._typeArguments[i];
		}
		var objectType = new ParsedObjectType(this._className, typeArgs, this._token);
		instantiationContext.objectTypesUsed.push(objectType);
		return objectType;
	},

	resolveType: function (context) {
		if (this._classDef == null)
			if ((this._classDef = context.parser.lookup(context.errors, this._token, this.toString())) == null)
				context.errors.push(new CompileError(this._token, "'" + this.toString() + "' is not defined"));
	},

	toString: function () {
		return this._typeArguments.length != 0 ? Type.templateTypeToString(this._className, this._typeArguments) : this._className;
	}

});

// function types

var FunctionType = exports.FunctionType = Type.extend({

	$_classDef: null,

	getClassDef: function () {
		return FunctionType._classDef;
	}

});

var FunctionChoiceType = exports.FunctionChoiceType = FunctionType.extend({

	constructor: function (types) {
		this._types = types;
	},

	isAssignable: function () {
		return false;
	},

	asAssignableType: function () {
		throw new Error("logic flaw");
	},

	deduceByArgumentTypes: function (context, operatorToken, argTypes, isStatic) {
		// try an exact match
		for (var i = 0; i < this._types.length; ++i)
			if (this._types[i]._deduceByArgumentTypes(argTypes, isStatic, true))
				return this._types[i];
		// try loose match
		var matched = [];
		for (var i = 0; i < this._types.length; ++i)
			if (this._types[i]._deduceByArgumentTypes(argTypes, isStatic, false))
				matched.push(this._types[i]);
		switch (matched.length) {
		case 0:
			context.errors.push(new CompileError(operatorToken, "no function with matching arguments"));
			break;
		case 1:
			return matched[0];
		default:
			context.errors.push(new CompileError(operatorToken, "result of function resolution using the arguments is ambiguous"));
			break;
		}
		return null;
	},

	toString: function () {
		return this._types.length == 1 ? this._types[0].toString() : "<<multiple choices>>";
	}

});

var ResolvedFunctionType = exports.ResolvedFunctionType = FunctionType.extend({

	constructor: function (returnType, argTypes, isAssignable) {
		this._returnType = returnType;
		this._argTypes = argTypes;
		this._isAssignable = isAssignable;
	},

	setIsAssignable: function (isAssignable) {
		this._isAssignable = isAssignable;
		return this;
	},

	isAssignable: function () {
		return this._isAssignable;
	},

	asAssignableType: function () {
		return this._clone().setIsAssignable(true);
	},

	getReturnType: function () {
		return this._returnType;
	},

	getArgumentTypes: function () {
		return this._argTypes;
	},

	deduceByArgumentTypes: function (context, operatorToken, argTypes, isStatic) {
		if (! this._deduceByArgumentTypes(argTypes, isStatic, false)) {
			context.errors.push(new CompileError(operatorToken, "no function with matching arguments"));
			return null;
		}
		return this;
	},

	_deduceByArgumentTypes: function (argTypes, isStatic, exact) {
		if ((this instanceof StaticFunctionType) != isStatic)
			return false;
		if (this._argTypes.length != argTypes.length)
			return false;
		for (var i = 0; i < argTypes.length; i++) {
			if (this._argTypes[i].equals(argTypes[i])) {
				// ok
			} else {
				if (exact)
					return false;
				if (! argTypes[i].isConvertibleTo(this._argTypes[i]))
					return false;
			}
		}
		return true;
	},

	toString: function () {
		var args = [];
		for (var i = 0; i < this._argTypes.length; ++i)
			args[i] = " : " + this._argTypes[i].toString();
		return this._toStringPrefix() + "function (" + args.join(", ") + ") : " + this._returnType.toString();
	}

});

var StaticFunctionType = exports.StaticFunctionType = ResolvedFunctionType.extend({

	constructor: function (returnType, argTypes, isAssignable) {
		ResolvedFunctionType.prototype.constructor.call(this, returnType, argTypes, isAssignable);
	},

	instantiate: function (instantiationContext) {
		var returnType = this._returnType.instantiate(instantiationContext);
		if (returnType == null)
			return null;
		var argTypes = [];
		for (var i = 0; i < this._argTypes.length; ++i)
			if ((argTypes[i] = this._argTypes[i].instantiate(instantiationContext)) == null)
				return null;
		return new StaticFunctionType(returnType, argTypes, this._isAssignable);
	},

	_clone: function () {
		return new StaticFunctionType(this._returnType, this._argTypes, this._isAssignable);
	},

	isConvertibleTo: function (type) {
		type = type.resolveIfMayBeUndefined();
		if (type instanceof VariantType)
			return true;
		if (! (type instanceof StaticFunctionType))
			return false;
		if (! this._returnType.equals(type.getReturnType()))
			return false;
		return this._deduceByArgumentTypes(type.getArgumentTypes(), true, true);
	},

	_toStringPrefix: function () {
		return "";
	}

});

var MemberFunctionType = exports.MemberFunctionType = ResolvedFunctionType.extend({

	constructor: function (objectType, returnType, argTypes, isAssignable) {
		ResolvedFunctionType.prototype.constructor.call(this, returnType, argTypes, isAssignable);
		this._objectType = objectType;
	},

	_clone: function () {
		return new MemberFunctionType(this._objectType, this._returnType, this._argTypes, this._isAssignable);
	},

	_toStringPrefix: function () {
		return this._objectType.toString() + ".";
	},

	getObjectType: function () {
		return this._objectType;
	}

});

Type._initialize();
