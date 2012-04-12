var Class = require("./Class");
eval(Class.$import("./classdef"));
eval(Class.$import("./util"));

"use strict";

// FIXME add support for arrays and parameterized types
var Type = exports.Type = Class.extend({

	$_initialize: function () {
		this.voidType = new VoidType();
		this.nullType = new NullType();
		this.booleanType = new BooleanType();
		this.integerType = new IntegerType();
		this.numberType = new NumberType();
		this.stringType = new StringType();
	},

	$_initializeBuiltin: function (classDefs) {
		StringType._classDef = ClassDefinition.getClass(classDefs, "String");
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

	asAssignableType: function () {
		return this;
	},

	$isIntegerOrNumber: function (type) {
		return type instanceof IntegerType || type instanceof NumberType;
	}

});

// void and null are special types

var VoidType = exports.VoidType = Type.extend({

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

	isAssignable: function () {
		return false;
	},

	isConvertibleTo: function (type) {
		return type instanceof StringType || type instanceof ObjectType;
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

	isAssignable: function () {
		return true; // still does not support "const" qualifier
	}

});

var BooleanType = exports.BooleanType = PrimitiveType.extend({

	$_classDef: null,

	isConvertibleTo: function (type) {
		return type instanceof BooleanType || type instanceof IntegerType || type instanceof NumberType;
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
		return type instanceof IntegerType || type instanceof NumberType;
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
		return type instanceof IntegerType || type instanceof NumberType;
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
		if (type instanceof BooleanType)
			return true;
		if (type instanceof StringType)
			return true;
		return false;
	},

	getClassDef: function () {
		return StringType._classDef;
	},

	toString: function () {
		return "String";
	}

});

// array and hash type

var ArrayType = exports.ArrayType = Type.extend({

	initialize: function (elementType) {
		this._elementType = elementType;
	},

	isConvertibleTo: function (type) {
		if (type instanceof BooleanType)
			return true;
		if (type instanceof ArrayType && type._elementType.equals(this._elementType))
			return true;
		return false;
	},

	isAssignable: function () {
		return true; // still does not support "const" qualifier
	},
	
	getClassDef: function () {
		throw new Error("FIXME");
	},

	getElementType: function () {
		return this._elementType;
	},

	toString: function () {
		return this._elementType.toString() + "[]";
	}

});

var HashType = exports.HashType = Type.extend({

	initialize: function (elementType) {
		this._elementType = elementType;
	},

	isConvertibleTo: function (type) {
		if (type instanceof BooleanType)
			return true;
		if (type instanceof HashType && type._elementType.equals(this._elementType))
			return true;
		return false;
	},

	isAssignable: function () {
		return true; // still does not support "const" qualifier
	},
	
	getClassDef: function () {
		throw new Error("FIXME");
	},

	getElementType: function () {
		return this._elementType;
	},

	toString: function () {
		return "Hash<" + this._elementType.toString() + ">";
	}

});

// class and object types

var ClassDefType = exports.ClassDefType = Type.extend({

	initialize: function (classDef) {
		this._classDef = classDef;
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

	initialize: function () {
		switch (arguments.length) {
		case 1:
			this._classDef = arguments[0];
			this._className = this._classDef.className().toString();
			this._token = null;
			break;
		case 2:
			this._classDef = null;
			this._className = arguments[0];
			this._token = arguments[1];
			break;
		}
	},

	resolveType: function (errors, classDefs) {
		if (this._classDef == null) {
			if ((this._classDef = ClassDefinition.getClass(classDefs, this.toString())) == null) {
				errors.push(new CompileError(this._token, "'" + this.toString() + "' is not defined"));
			}
		}
	},

	isConvertibleTo: function (type) {
		if (type instanceof BooleanType)
			return true;
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
		return this._className;
	}

});

// function types

var FunctionType = exports.FunctionType = Type.extend({

	initialize: function (returnType, argTypes, isAssignable) {
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

	getClassDef: function () {
		throw new Error("FIXME");
	},

	getReturnType: function () {
		return this._returnType;
	},

	getArgumentTypes: function () {
		return this._argTypes;
	},

	isCallableWith: function (argTypes, exact) {
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

var StaticFunctionType = exports.StaticFunctionType = FunctionType.extend({

	initialize: function (returnType, argTypes, isAssignable) {
		FunctionType.prototype.initialize.call(this, returnType, argTypes, isAssignable);
	},

	_clone: function () {
		return new StaticFunctionType(this._returnType, this._argTypes, this._isAssignable);
	},

	_toStringPrefix: function () {
		return "static ";
	}

});

var MemberFunctionType = exports.MemberFunctionType = FunctionType.extend({

	initialize: function (objectType, returnType, argTypes, isAssignable) {
		FunctionType.prototype.initialize.call(this, returnType, argTypes, isAssignable);
		this._objectType = objectType;
	},

	_clone: function () {
		return new MemberFunctionType(this._objectType, this._returnType, this._argTypes, this._isAssignable);
	},

	_toStringPrefix: function () {
		return this._objectType.toString() + ".";
	}

});

Type._initialize();
