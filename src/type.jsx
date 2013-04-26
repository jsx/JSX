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

import "./analysis.jsx";
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
		return Type.calcLeastCommonAncestor(type1, type2, false);
	}

 	static function calcLeastCommonAncestor (type1 : Type, type2 : Type, acceptVariant : boolean) : Type {
 		if (type1.equals(type2))
 			return type1;
 		if (Type.isIntegerOrNumber(type1) && Type.isIntegerOrNumber(type2))
 			return Type.numberType;
 		// VoidType
 		if (Type.voidType.equals(type1) || Type.voidType.equals(type2))
 			return null;
 		// VariantType
 		if (Type.variantType.equals(type1) || Type.variantType.equals(type2))
 			return Type.variantType;
 		// NullType
 		if (Type.nullType.equals(type1))
 			return (Type.nullType.isConvertibleTo(type2))? type2 : new NullableType(type2);
 		if (Type.nullType.equals(type2))
 			return (Type.nullType.isConvertibleTo(type1))? type1 : new NullableType(type1);
 		// PrimitiveTypes
 		if (type1.resolveIfNullable() instanceof PrimitiveType || type2.resolveIfNullable() instanceof PrimitiveType) {
 			if (type1.resolveIfNullable().equals(type2.resolveIfNullable()))
 				return new NullableType(type1);
 			else if (Type.isIntegerOrNumber(type1.resolveIfNullable()) && Type.isIntegerOrNumber(type2.resolveIfNullable()))
 				return new NullableType(Type.numberType);
 			else
 				return acceptVariant? Type.variantType : null;
 		}
 		// ObjectTypes
 		if (type1.resolveIfNullable() instanceof ObjectType && type2.resolveIfNullable() instanceof ObjectType) {
 			var obj1 = type1.resolveIfNullable() as ObjectType;
 			var obj2 = type2.resolveIfNullable() as ObjectType;
 			var ifaces1 = new ObjectType[];
 			for (;;) {
 				ifaces1 = ifaces1.concat(obj1.getClassDef().implementTypes().map.<ObjectType>((t) -> { return t; }));
 				if (obj2.isConvertibleTo(obj1))
 					break;
 				obj1 = obj1.getClassDef().extendType();
 			}
 			if (obj1.getClassDef().className() != "Object")
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
 		if (type1.resolveIfNullable() instanceof FunctionType && type2.resolveIfNullable() instanceof FunctionType) {
			return null;
		}
		// Otherwise
 		return acceptVariant? Type.variantType : null;
 	}

	static function calcLeastCommonAncestor (types : Type[]) : Type {
		return Type.calcLeastCommonAncestor(types, false);
	}

	static function calcLeastCommonAncestor (types : Type[], acceptVariant : boolean) : Type {
		if (types.length == 0)
			return null;
		var type = types[0];
		for (var i = 1; i < types.length; ++i) {
			type = Type.calcLeastCommonAncestor(type, types[i], acceptVariant);
			if (type == null)
				return null;
		}
		return type;
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
		throw new Error("VoidType#getClassDef() is not supported");
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
		throw new Error("NullType#getClassDef() is not supported");
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
		throw new Error("VariantType#getClassDef() is not supported");
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
			throw new Error("logic flaw, cannot create Nullable.<variant>");
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
		var enclosingType = this._qualifiedName.getEnclosingType();
		if (enclosingType == null && this._typeArguments.length == 0) {
			var actualType = instantiationContext.typemap[this._qualifiedName.getToken().getValue()];
			if (actualType != null)
				return actualType;
			if (this._classDef == null)
				instantiationContext.objectTypesUsed.push(this);
			return this;
		}
		var qualifiedName = this._qualifiedName;
		if (enclosingType != null) {
			var actualEnclosingType = this._qualifiedName.getEnclosingType().instantiate(instantiationContext) as ParsedObjectType;
			if (! this._qualifiedName.getEnclosingType().equals(actualEnclosingType)) {
				qualifiedName = new QualifiedName(this._qualifiedName.getToken(), actualEnclosingType);
			}
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
				var templateClassName = qualifiedName.getToken().getValue();
				if (templateClassName == "Array" || templateClassName == "Map") {
					typeArgs[i] = (typeArgs[i] as NullableType).getBaseType();
				}
			}
		}
		var objectType = new ParsedObjectType(qualifiedName, typeArgs);
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

	// used for left to right deduction of callback function types and empty literals
	abstract function getExpectedTypes (numberOfArgs : number, isStatic : boolean) : Type[][];

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
		var types = this._types;

		// try an exact match
		for (var i = 0; i < types.length; ++i) {
			if (types[i]._deduceByArgumentTypes(types[i].getToken(), argTypes, isStatic, true, [])) {
				return types[i];
			}
		}

		// try loose match
		var matched = new ResolvedFunctionType[];
		var notes = new CompileNote[];
		for (var i = 0; i < types.length; ++i) {
			if (types[i]._deduceByArgumentTypes(types[i].getToken(), argTypes, isStatic, false, notes)) {
				matched.push(types[i]);
			}
		}
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
		context.errors[context.errors.length - 1].addCompileNotes(notes);
		return null;
	}

	override function getExpectedTypes (numberOfArgs : number, isStatic : boolean) : Type[][] {
		var expected = new Type[][];
		for (var i = 0; i < this._types.length; ++i)
			this._types[i]._getExpectedTypes(expected, numberOfArgs, isStatic);
		return expected;
	}

	override function toString () : string {
		return this._types.length == 1 ? this._types[0].toString() : "<<multiple choices>>";
	}

	override function getObjectType () : Type {
		throw new Error("logic flaw");
	}

}

abstract class ResolvedFunctionType extends FunctionType {

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

	abstract function _clone () : ResolvedFunctionType;

	abstract function _toStringPrefix() : string;

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
		var notes = new CompileNote[];
		if (! this._deduceByArgumentTypes(this._token != null ? this._token : operatorToken, argTypes, isStatic, false, notes)) {
			var error = new CompileError(
					operatorToken,
					operatorToken.getValue() == "[" ? "operator [] of type " + argTypes[0].toString() + " is not applicable to " + this.getObjectType().toString() : "no function with matching arguments");
			error.addCompileNotes(notes);
			context.errors.push(error);
			return null;
		}
		return this;
	}

	function _deduceByArgumentTypes (token : Token, argTypes : Type[], isStatic : boolean, exact : boolean, notes : CompileNote[]) : boolean {
		var compareArg = function (formal : Type, actual : Type) : boolean {
			if (formal.equals(actual))
				return true;
			else if (! exact && actual.isConvertibleTo(formal))
				return true;
			return false;
		};
		if ((this instanceof StaticFunctionType) != isStatic) {
			if (isStatic) {
				notes.push(new CompileNote(token, 'candidate function not viable: expected a static function, but got a member function'));
			} else {
				notes.push(new CompileNote(token, 'candidate function not viable: expected a member function, but got a static function'));
			}
			return false;
		}
		if (this._argTypes.length != 0 && this._argTypes[this._argTypes.length - 1] instanceof VariableLengthArgumentType) {
			var vargType = this._argTypes[this._argTypes.length - 1] as VariableLengthArgumentType;
			// a vararg function
			if (argTypes.length < this._argTypes.length - 1) {
				notes.push(new CompileNote(token, 'candidate function not viable: wrong number of arguments'));
				return false;
			}
			for (var i = 0; i < this._argTypes.length - 1; ++i) {
				if (! compareArg(this._argTypes[i], argTypes[i])) {
					notes.push(new CompileNote(token, Util.format('candidate function not viable: no known conversion from %1 to %2 for %3 argument.', [ argTypes[i].toString(), this._argTypes[i].toString(), Util.toOrdinal(i+1) ])));
					return false;
				}
			}
			if (argTypes[i] instanceof VariableLengthArgumentType && argTypes.length == this._argTypes.length) {
				if (! compareArg((this._argTypes[i] as VariableLengthArgumentType).getBaseType(), (argTypes[i] as VariableLengthArgumentType).getBaseType())) {
					notes.push(new CompileNote(token, Util.format('candidate function not viable: no known conversion from %1 to %2 for %3 argument.', [ (argTypes[i] as VariableLengthArgumentType).getBaseType().toString(), (this._argTypes[i] as VariableLengthArgumentType).getBaseType().toString(), Util.toOrdinal(i+1) ])));
					return false;
				}
			} else {
				for (; i < argTypes.length; ++i) {
					if (! compareArg(vargType.getBaseType(), argTypes[i])) {
						notes.push(new CompileNote(token, Util.format('candidate function not viable: no known conversion from %1 to %2 for %3 argument.', [ argTypes[i].toString(), vargType.getBaseType().toString(), Util.toOrdinal(i+1) ])));
						return false;
					}
				}
			}
		} else {
			// non-vararg function
			if (argTypes.length != this._argTypes.length) {
				notes.push(new CompileNote(token, Util.format('candidate function not viable: wrong number of arguments (%1 for %2)',
					[argTypes.length as string, this._argTypes.length as string])));
				return false;
			}
			for (var i = 0; i < argTypes.length; ++i) {
				if (! compareArg(this._argTypes[i], argTypes[i])) {
					notes.push(new CompileNote(token, Util.format('candidate function not viable: no known conversion from %1 to %2 for %3 argument.', [ argTypes[i].toString(), this._argTypes[i].toString(), Util.toOrdinal(i+1) ])));
					return false;
				}
			}
		}
		return true;
	}

	override function getExpectedTypes (numberOfArgs : number, isStatic : boolean) : Type[][] {
		var expected = new Type[][];
		this._getExpectedTypes(expected, numberOfArgs, isStatic);
		return expected;
	}

	function _getExpectedTypes (expected : Type[][], numberOfArgs : number, isStatic : boolean) : void {
		if ((this instanceof StaticFunctionType) != isStatic)
			return;
		var argTypes = new Type[];
		if (this._argTypes.length > 0 && numberOfArgs >= this._argTypes.length
		    && this._argTypes[this._argTypes.length - 1] instanceof VariableLengthArgumentType) {
			for (var i = 0; i < numberOfArgs; ++i) {
				if (i < this._argTypes.length - 1) {
					argTypes[i] = this._argTypes[i];
				} else {
					argTypes[i] = (this._argTypes[this._argTypes.length - 1] as VariableLengthArgumentType).getBaseType();
				}
			}
		} else if (this._argTypes.length == numberOfArgs) {
			argTypes = this._argTypes;
		} else {
			// fail
			return;
		}
		var hasCallback = false;
		var callbackArgTypes = argTypes.map.<Type>(function (argType) {
			var typeName = '';
			if (argType instanceof StaticFunctionType
				|| (argType instanceof ObjectType
					&& argType.getClassDef() instanceof InstantiatedClassDefinition
					&& ((typeName = (argType.getClassDef() as InstantiatedClassDefinition).getTemplateClassName()) == 'Array' || typeName == 'Map'))) {
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
		return this._deduceByArgumentTypes((type as ResolvedFunctionType).getToken(), (type as StaticFunctionType).getArgumentTypes(), true, true, []);
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

