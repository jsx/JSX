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

import "./classdef.jsx";
import "./util.jsx";
import "./parser.jsx";

abstract class Type {

	static const voidType = new VoidType();
	static const nullType = new NullType();
	static const booleanType = new BooleanType();
	static const integerType = new IntegerType();
	static const numberType = new NumberType();
	static const stringType = new StringType();
	static const variantType = new VariantType();

	function serialize () : variant {
		return this.toString();
	}

	abstract function isAssignable() : boolean;
	abstract function isConvertibleTo(type : Type) : boolean;
	abstract function getClassDef() : ClassDefinition;
	abstract function instantiate (instantiationContext : InstantiationContext) : Type;

	function equals (x : Type) : boolean {
		return this == x;
	}

	function resolveIfNullable () : Type {
		if (this instanceof NullableType)
			return (this as NullableType).getBaseType();
		return this;
	}

	function asAssignableType () : Type {
		return this;
	}

	function toNullableType () : Type {
		return this.toNullableType(false);
	}

	function toNullableType (force : boolean) : Type {
		if (force || this instanceof PrimitiveType) {
			return new NullableType(this);
		}
		return this;
	}

	static function templateTypeToString (parameterizedTypeName : string, typeArgs : Type[]) : string {
		var s = parameterizedTypeName + ".<";
		for (var i = 0; i < typeArgs.length; ++i) {
			if (i != 0)
				s += ",";
			s += typeArgs[i].toString();
		}
		s += ">";
		return s;
	}

	static function isIntegerOrNumber (type : Type) : boolean {
		return type instanceof IntegerType || type instanceof NumberType;
	}

 	static function calcLeastCommonAncestor (type1 : Type, type2 : Type) : Type {
 		if (type1.equals(type2))
 			return type1;
 		if (Type.isIntegerOrNumber(type1) && Type.isIntegerOrNumber(type2))
 			return Type.numberType;
 		// VoidType
 		if (Type.voidType.equals(type1) || Type.voidType.equals(type2))
 			return null;
 		// NullType
 		if (Type.nullType.equals(type1))
 			return (Type.nullType.isConvertibleTo(type2))? type2 : new NullableType(type2);
 		if (Type.nullType.equals(type2))
 			return (Type.nullType.isConvertibleTo(type1))? type1 : new NullableType(type1);
 		if (Type.nullType.equals(type1) || Type.nullType.equals(type2))
 			return null;
 		// VariantType
 		if (Type.variantType.equals(type1) || Type.variantType.equals(type2))
 			return Type.variantType;
 		// PrimitiveTypes
 		if (type1.resolveIfNullable() instanceof PrimitiveType || type2.resolveIfNullable() instanceof PrimitiveType) {
 			if (type1.resolveIfNullable().equals(type2.resolveIfNullable()))
 				return new NullableType(type1);
 			else if (Type.isIntegerOrNumber(type1.resolveIfNullable()) && Type.isIntegerOrNumber(type2.resolveIfNullable()))
 				return new NullableType(Type.numberType);
 			else
 				return null;
 		}
 		// ObjectTypes
 		if (type1.resolveIfNullable() instanceof ParsedObjectType && type2.resolveIfNullable() instanceof ParsedObjectType) {
 			var obj1 = type1.resolveIfNullable() as ParsedObjectType;
 			var obj2 = type2.resolveIfNullable() as ParsedObjectType;
 			var ifaces1 = new ParsedObjectType[];
 			for (;;) {
 				ifaces1 = ifaces1.concat(obj1.getClassDef().implementTypes());
 				if (obj2.isConvertibleTo(obj1))
 					break;
 				obj1 = obj1.getClassDef().extendType();
 			}
 			if (obj1.getToken().getValue() != "Object")
 				return obj1;
 			var candidates = new Type[];
 			for (var i in ifaces1) {
 				var iface = ifaces1[i];
 				do {
 					if (obj2.isConvertibleTo(iface)) {
 						candidates.push(iface);
 						break;
 					}
 				} while (iface = iface.getClassDef().extendType());
 			}
 			function uniquify(list : Type[]) : Type[] {
 				var result = new Type[];
 				for (var i = 0; i < list.length; ++i) {
 					result.push(list[i]);
 					for (var j = i + 1; j < list.length; ++j) {
 						if (list[i].equals(list[j])) {
 							result.pop();
 							break;
 						}
 					}
 				}
 				return result;
 			}
 			candidates = uniquify(candidates);
 			switch (candidates.length) {
 			case 0:
 				return obj1;
 			case 1:
 				return candidates[0];
 			default:
 				return null;
 			}
 		}
 		// FunctionType
 		return null;
 	}
}

// void and null are special types

class VoidType extends Type {

	override function instantiate (instantiationContext : InstantiationContext) : VoidType {
		return this;
	}

	override function isAssignable () : boolean {
		return false;
	}

	override function isConvertibleTo (type : Type) : boolean {
		return false;
	}

	override function getClassDef () : ClassDefinition {
		throw new Error("not supported");
	}

	override function toString () : string {
		return "void";
	}

}

class NullType extends Type {

	override function instantiate (instantiationContext : InstantiationContext) : NullType {
		return this;
	}

	override function isAssignable () : boolean {
		return false;
	}

	override function isConvertibleTo (type : Type) : boolean {
		return type instanceof NullableType || type instanceof ObjectType || type instanceof VariantType || type instanceof StaticFunctionType;
	}

	override function getClassDef () : ClassDefinition {
		throw new Error("not supported");
	}

	override function toString () : string {
		return "null";
	}

}

// primitive types

abstract class PrimitiveType extends Type {

	override function instantiate (instantiationContext : InstantiationContext) : Type {
		return this;
	}

	override function isAssignable () : boolean {
		return true; // still does not support "const" qualifier
	}

}

class BooleanType extends PrimitiveType {

	static var _classDef = null : ClassDefinition;

	override function isConvertibleTo (type : Type) : boolean {
		type = type.resolveIfNullable();
		return type instanceof BooleanType || type instanceof VariantType;
	}

	override function getClassDef () : ClassDefinition {
		return BooleanType._classDef;
	}

	override function toString () : string {
		return "boolean";
	}

}

class IntegerType extends PrimitiveType {

	static var _classDef = null : ClassDefinition;

	override function isConvertibleTo (type : Type) : boolean {
		type = type.resolveIfNullable();
		return type instanceof IntegerType || type instanceof NumberType || type instanceof VariantType;
	}

	override function getClassDef () : ClassDefinition {
		return NumberType._classDef;
	}

	override function toString () : string {
		return "int";
	}

}

class NumberType extends PrimitiveType {

	static var _classDef = null : ClassDefinition;

	override function isConvertibleTo (type : Type) : boolean {
		type = type.resolveIfNullable();
		return type instanceof IntegerType || type instanceof NumberType || type instanceof VariantType;
	}

	override function getClassDef () : ClassDefinition {
		return NumberType._classDef;
	}

	override function toString () : string {
		return "number";
	}

}

class StringType extends PrimitiveType {

	static var _classDef = null : ClassDefinition;

	override function isConvertibleTo (type : Type) : boolean {
		type = type.resolveIfNullable();
		return type instanceof StringType || type instanceof VariantType;
	}

	override function getClassDef () : ClassDefinition {
		return StringType._classDef;
	}

	override function toString () : string {
		return "string";
	}

}

// any type
class VariantType extends Type {

	override function instantiate (instantiationContext : InstantiationContext) : VariantType {
		return this;
	}

	override function isAssignable () : boolean {
		return true;
	}

	override function isConvertibleTo (type : Type) : boolean {
		type = type.resolveIfNullable();
		return type instanceof VariantType;
	}

	override function getClassDef () : ClassDefinition {
		throw new Error("not supported");
	}

	override function toString () : string {
		return "variant";
	}

}

// Nullable
class NullableType extends Type {

	var _baseType : Type; 

	function constructor (type : Type) {
		if (type.equals(Type.variantType))
			throw new Error("logic error, cannot create Nullable.<variant>");
		this._baseType = type instanceof NullableType ? (type as NullableType)._baseType : type;
	}

	override function instantiate (instantiationContext : InstantiationContext) : Type {
		var baseType = this._baseType.resolveIfNullable().instantiate(instantiationContext);
		return baseType.toNullableType();
	}

	override function equals (x : Type) : boolean {
		return x instanceof NullableType && this._baseType.equals((x as NullableType)._baseType);
	}

	override function isConvertibleTo (type : Type) : boolean {
		return this._baseType.isConvertibleTo(type instanceof NullableType ? (type as NullableType)._baseType : type);
	}

	override function isAssignable () : boolean {
		return true;
	}

	override function getClassDef () : ClassDefinition {
		return this._baseType.getClassDef();
	}

	function getBaseType () : Type {
		return this._baseType;
	}

	override function toString () : string {
		return "Nullable.<" + this._baseType.toString() + ">";
	}

}

class VariableLengthArgumentType extends Type {

	var _baseType : Type;

	function constructor (type : Type) {
		if (type instanceof VariableLengthArgumentType)
			throw new Error("logic flaw");
		this._baseType = type;
	}

	override function instantiate (instantiationContext : InstantiationContext) : VariableLengthArgumentType {
		var baseType = this._baseType.instantiate(instantiationContext);
		return new VariableLengthArgumentType(baseType);
	}

	override function equals (x : Type) : boolean {
		return x instanceof VariableLengthArgumentType && this._baseType.equals((x as VariableLengthArgumentType)._baseType);
	}

	override function isConvertibleTo (type : Type) : boolean {
		throw new Error("logic flaw"); // never becomes LHS
	}

	override function isAssignable () : boolean {
		throw new Error("logic flaw"); // never becomes LHS
	}

	override function getClassDef () : ClassDefinition {
		throw new Error("logic flaw"); // never becomes LHS
	}

	function getBaseType () : Type {
		return this._baseType;
	}

	override function toString () : string {
		return "..." + this._baseType.toString();
	}

}

// class and object types

class ObjectType extends Type {

	var _classDef : ClassDefinition;

	function constructor (classDef : ClassDefinition) {
		this._classDef = classDef;
	}

	override function instantiate (instantiationContext : InstantiationContext) : Type {
		throw new Error("logic flaw; ObjectType is created during semantic analysis, after template instantiation");
	}

	override function equals (x : Type) : boolean {
		if (this instanceof ParsedObjectType && x instanceof ParsedObjectType
			&& ((this as ParsedObjectType)._classDef == null || (x as ParsedObjectType)._classDef == null)) {
			return this.toString() == x.toString();
		}
		return x instanceof ObjectType && this._classDef == (x as ObjectType)._classDef;
	}

	function resolveType (context : AnalysisContext) : void {
		if (this._classDef == null)
			throw new Error("logic flaw");
	}

	override function isConvertibleTo (type : Type) : boolean {
		type = type.resolveIfNullable();
		if (type instanceof VariantType)
			return true;
		// conversions from Number / String to number / string is handled in each operator (since the behavior differ bet. the operators)
		if (! (type instanceof ObjectType)) {
			return false;
		}
		if (this._classDef == null) { // occurs with completion mode
			return false;
		}
		return this._classDef.isConvertibleTo((type as ObjectType)._classDef);
	}

	override function isAssignable () : boolean {
		return true; // still does not support "const" qualifier
	}

	override function getClassDef () : ClassDefinition {
		return this._classDef;
	}

	override function toString () : string {
		return this._classDef != null ? this._classDef.className() : "(null)";
	}

}

class ParsedObjectType extends ObjectType {

	var _qualifiedName : QualifiedName;
	var _typeArguments : Type[];

	function constructor (qualifiedName : QualifiedName, typeArgs : Type[]) {
		super(null);
		this._qualifiedName = qualifiedName;
		this._typeArguments = typeArgs;
	}

	function getToken () : Token {
		return this._qualifiedName.getToken();
	}

	function getQualifiedName () : QualifiedName {
		return this._qualifiedName;
	}

	function getTypeArguments () : Type[] {
		return this._typeArguments;
	}

	override function instantiate (instantiationContext : InstantiationContext) : Type {
		if (this._typeArguments.length == 0) {
			var actualType = instantiationContext.typemap[this._qualifiedName.getToken().getValue()];
			if (actualType != null)
				return actualType;
			if (this._classDef == null)
				instantiationContext.objectTypesUsed.push(this);
			return this;
		}
		var typeArgs = new Type[];
		for (var i = 0; i < this._typeArguments.length; ++i) {
			if (this._typeArguments[i] instanceof ParsedObjectType && (this._typeArguments[i] as ParsedObjectType).getTypeArguments().length != 0) {
				var actualType = this._typeArguments[i].instantiate(instantiationContext);
			} else {
				actualType = instantiationContext.typemap[this._typeArguments[i].toString()];
			}
			typeArgs[i] = actualType != null ? actualType : this._typeArguments[i];
			// special handling for (Array|Map).<T> (T should not be NullableType)
			if (typeArgs[i] instanceof NullableType) {
				var templateClassName = this._qualifiedName.getToken().getValue();
				if (templateClassName == "Array" || templateClassName == "Map") {
					typeArgs[i] = (typeArgs[i] as NullableType).getBaseType();
				}
			}
		}
		var objectType = new ParsedObjectType(this._qualifiedName, typeArgs);
		instantiationContext.objectTypesUsed.push(objectType);
		return objectType;
	}

	override function resolveType (context : AnalysisContext) : void {
		if (this._classDef == null) {
			this._classDef = this._qualifiedName.getClass(context, this._typeArguments);
		}
	}

	override function toString () : string {
		return this._typeArguments.length != 0 ? Type.templateTypeToString(this._qualifiedName.getToken().getValue(), this._typeArguments) : this._qualifiedName.getToken().getValue();
	}

}

// function types

abstract class FunctionType extends Type {

	static var _classDef = null : ClassDefinition;

	abstract function getObjectType() : Type;

	abstract function getExpectedCallbackTypes (numberOfArgs : number, isStatic : boolean) : Type[][];

	abstract function deduceByArgumentTypes (context : AnalysisContext, operatorToken : Token, argTypes : Type[], isStatic : boolean) : ResolvedFunctionType;

	override function isConvertibleTo (type : Type) : boolean {
		// functions except StaticFunctionType are unassignable
		return false;
	}

	override function getClassDef () : ClassDefinition {
		return FunctionType._classDef;
	}

	override function instantiate (instantiationContext : InstantiationContext) : FunctionType {
		throw new Error("logic flaw");
	}
}

class FunctionChoiceType extends FunctionType {

	var _types : ResolvedFunctionType[];

	function constructor (types : ResolvedFunctionType[]) {
		this._types = types;
	}

	override function isAssignable () : boolean {
		return false;
	}

	override function asAssignableType () : Type {
		throw new Error("logic flaw");
	}

	override function deduceByArgumentTypes (context : AnalysisContext, operatorToken : Token, argTypes : Type[], isStatic : boolean) : ResolvedFunctionType {
		// try an exact match
		for (var i = 0; i < this._types.length; ++i)
			if (this._types[i]._deduceByArgumentTypes(argTypes, isStatic, true, (msg) -> {}))
				return this._types[i];
		// try loose match
		var matched = new ResolvedFunctionType[];
		var notes = new CompileNote[];
		for (var i = 0; i < this._types.length; ++i)
			if (this._types[i]._deduceByArgumentTypes(argTypes, isStatic, false, (msg) -> { notes.push(new CompileNote(this._types[i].getToken(), 'candidate function not viable: ' + msg)); }))
				matched.push(this._types[i]);
		switch (matched.length) {
		case 0:
			context.errors.push(
				new CompileError(
					operatorToken,
					operatorToken.getValue() == "[" ? "operator [] of type " + argTypes[0].toString() + " is not applicable to " + this.getObjectType().toString() : "no function with matching arguments"));
			break;
		case 1:
			return matched[0];
		default:
			context.errors.push(new CompileError(operatorToken, "result of function resolution using the arguments is ambiguous"));
			break;
		}
		for (var i = 0; i < notes.length; ++i) {
			context.errors.push(notes[i]);
		}
		return null;
	}

	// used for left to right deduction of callback function types
	override function getExpectedCallbackTypes (numberOfArgs : number, isStatic : boolean) : Type[][] {
		var expected = new Type[][];
		for (var i = 0; i < this._types.length; ++i)
			this._types[i]._getExpectedCallbackTypes(expected, numberOfArgs, isStatic);
		return expected;
	}

	override function toString () : string {
		return this._types.length == 1 ? this._types[0].toString() : "<<multiple choices>>";
	}

	override function getObjectType () : Type {
		throw new Error("logic flaw");
	}

}

class ResolvedFunctionType extends FunctionType {

	var _token : Token;
	var _returnType : Type;
	var _argTypes : Type[];
	var _isAssignable : boolean;

	function constructor (token : Token, returnType : Type, argTypes : Type[], isAssignable : boolean) {
		this._token = token;
		this._returnType = returnType;
		this._argTypes = argTypes;
		this._isAssignable = isAssignable;
	}

	function _clone () : ResolvedFunctionType {
		throw new Error("logic flaw");
	}

	function _toStringPrefix() : string {
		throw new Error("logic flaw");
	}

	function setIsAssignable (isAssignable : boolean) : ResolvedFunctionType {
		this._isAssignable = isAssignable;
		return this;
	}

	override function isAssignable () : boolean {
		return this._isAssignable;
	}

	override function asAssignableType () : Type {
		return this._clone().setIsAssignable(true);
	}

	function getToken() : Token {
		return this._token;
	}

	function getReturnType () : Type {
		return this._returnType;
	}

	function getArgumentTypes () : Type[] {
		return this._argTypes;
	}

	override function deduceByArgumentTypes (context : AnalysisContext, operatorToken : Token, argTypes : Type[], isStatic : boolean) : ResolvedFunctionType {
		var note = '';
		if (! this._deduceByArgumentTypes(argTypes, isStatic, false, (msg) -> { note = msg; })) {
			context.errors.push(
				new CompileError(
					operatorToken,
					operatorToken.getValue() == "[" ? "operator [] of type " + argTypes[0].toString() + " is not applicable to " + this.getObjectType.toString() : "no function with matching arguments"));
			context.errors.push(
				new CompileNote(
					(this._token != null) ? this._token : operatorToken,
					'candidate function not viable: ' + note));
			return null;
		}
		return this;
	}

	function _deduceByArgumentTypes (argTypes : Type[], isStatic : boolean, exact : boolean, errorCb : (string) -> void) : boolean {
		var compareArg = function (formal : Type, actual : Type) : boolean {
			if (formal.equals(actual))
				return true;
			else if (! exact && actual.isConvertibleTo(formal))
				return true;
			return false;
		};
		if ((this instanceof StaticFunctionType) != isStatic) {
			errorCb('unmatched static flags');
			return false;
		}
		if (this._argTypes.length != 0 && this._argTypes[this._argTypes.length - 1] instanceof VariableLengthArgumentType) {
			var vargType = this._argTypes[this._argTypes.length - 1] as VariableLengthArgumentType;
			// a vararg function
			if (argTypes.length < this._argTypes.length - 1) {
				errorCb('wrong number of arguments');
				return false;
			}
			for (var i = 0; i < this._argTypes.length - 1; ++i) {
				if (! compareArg(this._argTypes[i], argTypes[i])) {
					errorCb('no known conversion from ' + argTypes[i].toString() + ' to ' + this._argTypes[i].toString() + ' for ' +
						((i == 0) ? '1st' : (i == 1) ? '2nd' : (i as string)+'th') + ' argument.');
					return false;
				}
			}
			if (argTypes[i] instanceof VariableLengthArgumentType && argTypes.length == this._argTypes.length) {
				if (! compareArg((this._argTypes[i] as VariableLengthArgumentType).getBaseType(), (argTypes[i] as VariableLengthArgumentType).getBaseType())) {
					errorCb('no known conversion from ' + (argTypes[i] as VariableLengthArgumentType).getBaseType().toString() + ' to ' + (this._argTypes[i] as VariableLengthArgumentType).getBaseType().toString() + ' for ' + ((i == 0) ? '1st' : (i == 1) ? '2nd' : (i as string)+'th') + ' argument.');
					return false;
				}
			} else {
				for (; i < argTypes.length; ++i) {
					if (! compareArg(vargType.getBaseType(), argTypes[i])) {
						errorCb('no known conversion from ' + argTypes[i].toString() + ' to ' + vargType.getBaseType().toString() + ' for ' +
							((i == 0) ? '1st' : (i == 1) ? '2nd' : (i as string)+'th') + ' argument.');
						return false;
					}
				}
			}
		} else {
			// non-vararg function
			if (this._argTypes.length != argTypes.length) {
				errorCb('wrong number of arguments');
				return false;
			}
			for (var i = 0; i < argTypes.length; ++i) {
				if (! compareArg(this._argTypes[i], argTypes[i])) {
					errorCb('no known conversion from ' + argTypes[i].toString() + ' to ' + this._argTypes[i].toString() + ' for ' +
						((i == 0) ? '1st' : (i == 1) ? '2nd' : (i as string)+'th') + ' argument.');
					return false;
				}
			}
		}
		return true;
	}

	override function getExpectedCallbackTypes (numberOfArgs : number, isStatic : boolean) : Type[][] {
		var expected = new Type[][];
		this._getExpectedCallbackTypes(expected, numberOfArgs, isStatic);
		return expected;
	}

	function _getExpectedCallbackTypes (expected : Type[][], numberOfArgs : number, isStatic : boolean) : void {
		if ((this instanceof StaticFunctionType) != isStatic)
			return;
		if (this._argTypes.length != numberOfArgs)
			return;
		var hasCallback = false;
		var callbackArgTypes = this._argTypes.map.<Type>(function (argType) {
			if (argType instanceof StaticFunctionType) {
				hasCallback = true;
				return argType;
			} else {
				return null;
			}
		});
		if (hasCallback)
			expected.push(callbackArgTypes);
		
	}

	override function toString () : string {
		var args = new string[];
		for (var i = 0; i < this._argTypes.length; ++i) {
			if (this._argTypes[i] instanceof VariableLengthArgumentType) {
				args[i] = "... : " + (this._argTypes[i] as VariableLengthArgumentType).getBaseType().toString();
			} else {
				args[i] = ": " + this._argTypes[i].toString();
			}
		}
		return this._toStringPrefix() + "function (" + args.join(", ") + ") : " + this._returnType.toString();
	}

	override function getObjectType () : Type {
		throw new Error("logic flaw");
	}

}

class StaticFunctionType extends ResolvedFunctionType {

	function constructor (token : Token, returnType : Type, argTypes : Type[], isAssignable : boolean) {
		super(token, returnType, argTypes, isAssignable);
	}

	override function instantiate (instantiationContext : InstantiationContext) : StaticFunctionType {
		var returnType = this._returnType.instantiate(instantiationContext);
		if (returnType == null)
			return null;
		var argTypes = new Type[];
		for (var i = 0; i < this._argTypes.length; ++i)
			if ((argTypes[i] = this._argTypes[i].instantiate(instantiationContext)) == null)
				return null;
		return new StaticFunctionType(this._token, returnType, argTypes, this._isAssignable);
	}

	override function equals (x : Type) : boolean {
		return x instanceof StaticFunctionType
			&& this._returnType.equals((x as StaticFunctionType)._returnType)
			&& Util.typesAreEqual(this._argTypes, (x as StaticFunctionType)._argTypes);
	}

	override function _clone () : ResolvedFunctionType {
		return new StaticFunctionType(this._token, this._returnType, this._argTypes, this._isAssignable);
	}

	override function isConvertibleTo (type : Type) : boolean {
		type = type.resolveIfNullable();
		if (type instanceof VariantType)
			return true;
		if (! (type instanceof StaticFunctionType))
			return false;
		if (! this._returnType.equals((type as StaticFunctionType).getReturnType()))
			return false;
		return this._deduceByArgumentTypes((type as StaticFunctionType).getArgumentTypes(), true, true, (msg) -> {});
	}

	override function _toStringPrefix () : string {
		return "";
	}

	override function getObjectType () : Type {
		throw new Error("logic flaw");
	}
}

class MemberFunctionType extends ResolvedFunctionType {

	var _objectType : Type;

	function constructor (token : Token, objectType : Type, returnType : Type, argTypes : Type[], isAssignable : boolean) {
		super(token, returnType, argTypes, isAssignable);
		this._objectType = objectType;
	}

	override function equals (x : Type) : boolean {
		return x instanceof MemberFunctionType
			&& this._objectType == (x as MemberFunctionType)._objectType
			&& this._returnType.equals((x as MemberFunctionType)._returnType)
			&& Util.typesAreEqual(this._argTypes, (x as MemberFunctionType)._argTypes);
	}

	override function _clone () : MemberFunctionType {
		return new MemberFunctionType(this._token, this._objectType, this._returnType, this._argTypes, this._isAssignable);
	}

	override function _toStringPrefix () : string {
		return this._objectType.toString() + ".";
	}

	override function getObjectType () : Type {
		return this._objectType;
	}

}

