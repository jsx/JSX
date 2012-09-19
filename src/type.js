/*
 * Copyright (c) 2012 DeNA Co., Ltd.
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to
 * deal in the Software without restriction, including without limitation the
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 * sell copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 * IN THE SOFTWARE.
 */

var Class = require("./Class");
eval(Class.$import("./classdef"));
eval(Class.$import("./util"));

"use strict";

var Type = exports.Type = Class.extend({

	$_initialize: function () {
		this.voidType = new VoidType();
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
		return this == x;
	},

	resolveIfNullable: function () {
		if (this instanceof NullableType)
			return this.getBaseType();
		return this;
	},

	asAssignableType: function () {
		return this;
	},

	toNullableType: function (force) {
		if (force || this instanceof PrimitiveType) {
			return new NullableType(this);
		}
		return this;
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
		return type instanceof NullableType || type instanceof ObjectType || type instanceof VariantType || type instanceof StaticFunctionType;
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
		type = type.resolveIfNullable();
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
		type = type.resolveIfNullable();
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
		type = type.resolveIfNullable();
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
		type = type.resolveIfNullable();
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
		type = type.resolveIfNullable();
		return type instanceof VariantType;
	},

	getClassDef: function () {
		throw new Error("not supported");
	},

	toString: function () {
		return "variant";
	}

});

// Nullable
var NullableType = exports.NullableType = Type.extend({

	constructor: function (type) {
		if (type.equals(Type.variantType))
			throw new Error("logic error, cannot create Nullable.<variant>");
		this._baseType = type instanceof NullableType ? type._baseType : type;
	},

	instantiate: function (instantiationContext) {
		var baseType = this._baseType.resolveIfNullable().instantiate(instantiationContext);
		return baseType.toNullableType();
	},

	equals: function (x) {
		return x instanceof NullableType && this._baseType.equals(x._baseType);
	},

	isConvertibleTo: function (type) {
		return this._baseType.isConvertibleTo(type instanceof NullableType ? type._baseType : type);
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
		return "Nullable.<" + this._baseType.toString() + ">";
	}

});

var VariableLengthArgumentType = exports.VariableLengthArgumentType = Type.extend({

	constructor: function (type) {
		if (type instanceof VariableLengthArgumentType)
			throw new Error("logic flaw");
		this._baseType = type;
	},

	instantiate: function (instantiationContext) {
		var baseType = this._baseType.instantiate(instantiationContext);
		return new VariableLengthArgumentType(baseType);
	},

	equals: function (x) {
		return x instanceof VariableLengthArgumentType && this._baseType.equals(x._baseType);
	},

	isConvertibleTo: function (type) {
		throw new Error("logic flaw"); // never becomes LHS
	},

	isAssignable: function () {
		throw new Error("logic flaw"); // never becomes LHS
	},

	getClassDef: function () {
		throw new Error("logic flaw"); // never becomes LHS
	},

	getBaseType: function () {
		return this._baseType;
	},

	toString: function () {
		return "..." + this._baseType.toString();
	}

});

// class and object types

var ObjectType = exports.ObjectType = Type.extend({

	constructor: function (classDef) {
		this._classDef = classDef;
	},

	instantiate: function (instantiationContext) {
		throw new Error("logic flaw; ObjectType is created during semantic analysis, after template instantiation");
	},

	equals: function (x) {
		if (this instanceof ParsedObjectType && x instanceof ParsedObjectType
			&& (this._classDef == null || x._classDef == null)) {
			return this.toString() == x.toString();
		}
		return x instanceof ObjectType && this._classDef == x._classDef;
	},

	resolveType: function (context) {
		if (this._classDef == null)
			throw new Error("logic flaw");
	},

	isConvertibleTo: function (type) {
		type = type.resolveIfNullable();
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
		return this._classDef != null ? this._classDef.className() : "(null)";
	}

});

var ParsedObjectType = exports.ParsedObjectType = ObjectType.extend({

	constructor: function (qualifiedName, typeArgs) {
		ObjectType.prototype.constructor.call(this, null);
		this._qualifiedName = qualifiedName;
		this._typeArguments = typeArgs;
	},

	getToken: function () {
		return this._qualifiedName.getToken();
	},

	getQualifiedName: function () {
		return this._qualifiedName;
	},

	getTypeArguments: function () {
		return this._typeArguments;
	},

	instantiate: function (instantiationContext) {
		if (this._typeArguments.length == 0) {
			var actualType = instantiationContext.typemap[this._qualifiedName.getToken().getValue()];
			if (actualType != undefined)
				return actualType;
			if (this._classDef == null)
				instantiationContext.objectTypesUsed.push(this);
			return this;
		}
		var typeArgs = [];
		for (var i = 0; i < this._typeArguments.length; ++i) {
			if (this._typeArguments[i] instanceof ParsedObjectType && this._typeArguments[i].getTypeArguments().length != 0) {
				var actualType = this._typeArguments[i].instantiate(instantiationContext);
			} else {
				actualType = instantiationContext.typemap[this._typeArguments[i].toString()];
			}
			typeArgs[i] = actualType != undefined ? actualType : this._typeArguments[i];
			// special handling for (Array|Map).<T> (T should not be NullableType)
			if (typeArgs[i] instanceof NullableType) {
				var templateClassName = this._qualifiedName.getToken().getValue();
				if (templateClassName == "Array" || templateClassName == "Map") {
					typeArgs[i] = typeArgs[i].getBaseType();
				}
			}
		}
		var objectType = new ParsedObjectType(this._qualifiedName, typeArgs);
		instantiationContext.objectTypesUsed.push(objectType);
		return objectType;
	},

	resolveType: function (context) {
		if (this._classDef == null) {
			this._classDef = this._qualifiedName.getClass(context, this._typeArguments);
		}
	},

	toString: function () {
		return this._typeArguments.length != 0 ? Type.templateTypeToString(this._qualifiedName.getToken().getValue(), this._typeArguments) : this._qualifiedName.getToken().getValue();
	}

});

// function types

var FunctionType = exports.FunctionType = Type.extend({

	$_classDef: null,

	isConvertibleTo: function (type) {
		// functions except StaticFunctionType are unassignable
		return false;
	},

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
			context.errors.push(
				new CompileError(
					operatorToken,
					operatorToken.getValue() == "[" ? "operator [] of type " + argTypes[0].toString() + " is not applicable to " + this._objectType.toString() : "no function with matching arguments"));
			break;
		case 1:
			return matched[0];
		default:
			context.errors.push(new CompileError(operatorToken, "result of function resolution using the arguments is ambiguous"));
			break;
		}
		return null;
	},

	// used for left to right deduction of callback function types
	getExpectedCallbackTypes: function (numberOfArgs, isStatic) {
		var expected = [];
		for (var i = 0; i < this._types.length; ++i)
			this._types[i]._getExpectedCallbackTypes(expected, numberOfArgs, isStatic);
		return expected;
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
			context.errors.push(
				new CompileError(
					operatorToken,
					operatorToken.getValue() == "[" ? "operator [] of type " + argTypes[0].toString() + " is not applicable to " + this._objectType.toString() : "no function with matching arguments"));
			return null;
		}
		return this;
	},

	_deduceByArgumentTypes: function (argTypes, isStatic, exact) {
		var compareArg = function (formal, actual) {
			if (formal.equals(actual))
				return true;
			else if (! exact && actual.isConvertibleTo(formal))
				return true;
			return false;
		};
		if ((this instanceof StaticFunctionType) != isStatic)
			return false;
		if (this._argTypes.length != 0 && this._argTypes[this._argTypes.length - 1] instanceof VariableLengthArgumentType) {
			// a vararg function
			if (argTypes.length < this._argTypes.length - 1)
				return false;
			for (var i = 0; i < this._argTypes.length - 1; ++i) {
				if (! compareArg(this._argTypes[i], argTypes[i]))
					return false;
			}
			if (argTypes[i] instanceof VariableLengthArgumentType && argTypes.length == this._argTypes.length) {
				if (! compareArg(this._argTypes[i].getBaseType(), argTypes[i].getBaseType()))
					return false;
			} else {
				for (; i < argTypes.length; ++i) {
					if (! compareArg(this._argTypes[this._argTypes.length - 1].getBaseType(), argTypes[i]))
						return false;
				}
			}
		} else {
			// non-vararg function
			if (this._argTypes.length != argTypes.length)
				return false;
			for (var i = 0; i < argTypes.length; ++i) {
				if (! compareArg(this._argTypes[i], argTypes[i]))
					return false;
			}
		}
		return true;
	},

	getExpectedCallbackTypes: function (numberOfArgs, isStatic) {
		var expected = [];
		this._getExpectedCallbackTypes(expected, numberOfArgs, isStatic);
		return expected;
	},

	_getExpectedCallbackTypes: function (expected, numberOfArgs, isStatic) {
		if ((this instanceof StaticFunctionType) != isStatic)
			return false;
		if (this._argTypes.length != numberOfArgs)
			return false;
		var hasCallback = false;
		var callbackArgTypes = this._argTypes.map(function (argType) {
			if (argType instanceof StaticFunctionType) {
				hasCallback = true;
				return argType;
			} else {
				return null;
			}
		});
		if (hasCallback)
			expected.push(callbackArgTypes);
	},

	toString: function () {
		var args = [];
		for (var i = 0; i < this._argTypes.length; ++i) {
			if (this._argTypes[i] instanceof VariableLengthArgumentType) {
				args[i] = "... : " + this._argTypes[i].getBaseType().toString();
			} else {
				args[i] = ": " + this._argTypes[i].toString();
			}
		}
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

	equals: function (x) {
		return x instanceof StaticFunctionType
			&& this._returnType.equals(x._returnType)
			&& Util.typesAreEqual(this._argTypes, x._argTypes);
	},

	_clone: function () {
		return new StaticFunctionType(this._returnType, this._argTypes, this._isAssignable);
	},

	isConvertibleTo: function (type) {
		type = type.resolveIfNullable();
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

	equals: function (x) {
		return x instanceof MemberFunctionType
			&& this._objectType == x._objectType
			&& this._returnType.equals(x._returnType)
			&& Util.typesAreEqual(this._argTypes, x._argTypes);
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
