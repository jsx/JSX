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
import "./parser.jsx";
import "./type.jsx";
import "./util.jsx";
import "./statement.jsx";
import "./optimizer.jsx";


abstract class Expression implements Stashable {

	var _token : Token;

	function constructor (token : Token) {
		this._token = token;
	}

	function constructor (that : Expression) {
		this._token = that.getToken();
		for (var k in that._optimizerStash)
			this._optimizerStash[k] = that._optimizerStash[k].clone();
	}

	abstract function clone () : Expression;
	abstract function serialize () : variant;

	function instantiate (instantiationContext : InstantiationContext) : boolean {
		function onExpr(expr : Expression) : boolean {
			if (expr instanceof NullExpression) {
				var srcType = expr.getType();
				if (srcType != null) {
					(expr as NullExpression).setType(srcType.instantiate(instantiationContext));
				}
			} else if (expr instanceof NewExpression) {
				var srcType = expr.getType();
				if (srcType != null) {
					(expr as NewExpression).setType(srcType.instantiate(instantiationContext));
				}
			} else if (expr instanceof ArrayLiteralExpression) {
				var srcType = expr.getType();
				if (srcType != null) {
					(expr as ArrayLiteralExpression).setType(srcType.instantiate(instantiationContext));
				}
			} else if (expr instanceof MapLiteralExpression) {
				var srcType = expr.getType();
				if (srcType != null) {
					(expr as MapLiteralExpression).setType(srcType.instantiate(instantiationContext));
				}
			} else if (expr instanceof AsExpression) {
				var srcType = expr.getType();
				if (srcType != null) {
					(expr as AsExpression).setType(srcType.instantiate(instantiationContext));
				}
			} else if (expr instanceof AsNoConvertExpression) {
				var srcType = expr.getType();
				if (srcType != null) {
					(expr as AsNoConvertExpression).setType(srcType.instantiate(instantiationContext));
				}
			} else if (expr instanceof ClassExpression) {
				var srcType = expr.getType();
				if (srcType != null) {
					(expr as ClassExpression).setType(srcType.instantiate(instantiationContext));
				}
			} else if (expr instanceof LocalExpression) {
				// update local to the instantiated one
				(expr as LocalExpression).setLocal((expr as LocalExpression).getLocal().getInstantiated());
			}
			return expr.forEachExpression(onExpr);
		}
		return onExpr(this);
	}

	function getToken () : Token {
		return this._token;
	}

	abstract function analyze (context : AnalysisContext, parentExpr : Expression) : boolean;

	abstract function getType () : Type;

	function getHolderType () : Type {
		return null;
	}

	function forEachExpression (cb : function(:Expression):boolean) : boolean {
		return this.forEachExpression(function(expr : Expression, _ : function(:Expression):void){
			return cb(expr);
		});
	}

	abstract function forEachExpression (cb : function (:Expression, :function (:Expression) : void) : boolean) : boolean;

	function assertIsAssignable (context : AnalysisContext, token : Token, type : Type) : boolean {
		context.errors.push(new CompileError(token, "left-hand-side expression is not assignable"));
		return false;
	}

	static function assertIsAssignable (context : AnalysisContext, token : Token, lhsType : Type, rhsType : Type) : boolean {
		if (! lhsType.isAssignable()) {
			context.errors.push(new CompileError(token, "left-hand-side expression is not assignable"));
			return false;
		}
		if (! rhsType.isConvertibleTo(lhsType)) {
			context.errors.push(new CompileError(token, "cannot assign a value of type '" + rhsType.toString() + "' to '" + lhsType.toString() + "'"));
			return false;
		}
		return true;
	}

	static function getDefaultValueExpressionOf (type : Type) : Expression {
		if (type.equals(Type.booleanType))
			return new BooleanLiteralExpression(new Token("false", false));
		else if (type.equals(Type.integerType))
			return new IntegerLiteralExpression(new Token("0", false));
		else if (type.equals(Type.numberType))
			return new NumberLiteralExpression(new Token("0", false));
		else if (type.equals(Type.stringType))
			return new StringLiteralExpression(new Token("\"\"", false));
		else
			return new NullExpression(new Token("null", false), type);
	}

	static function instantiateTemplate (context : AnalysisContext, token : Token, className : string, typeArguments : Type[]) : ClassDefinition {
		return context.parser.lookupTemplate(context.errors, new TemplateInstantiationRequest(token, className, typeArguments), context.postInstantiationCallback);
	}

}

abstract class LeafExpression extends Expression {

	function constructor (token : Token) {
		super(token);
	}

	override function forEachExpression (cb : function(:Expression,:function(:Expression):void):boolean) : boolean {
		return true;
	}

}

abstract class OperatorExpression extends Expression {

	function constructor (token : Token) {
		super(token);
	}

	function constructor (that : Expression) {
		super(that);
	}

	function isConvertibleTo (context : AnalysisContext, expr : Expression, type : Type, mayUnbox : boolean) : boolean {
		var exprType = expr.getType().resolveIfNullable();
		if (mayUnbox && type instanceof PrimitiveType && exprType instanceof ObjectType && exprType.getClassDef() == type.getClassDef())
			return true;
		return exprType.isConvertibleTo(type);
	}

	function assertIsConvertibleTo (context : AnalysisContext, expr : Expression, type : Type, mayUnbox : boolean) : boolean {
		if (! this.isConvertibleTo(context, expr, type, mayUnbox)) {
			context.errors.push(new CompileError(this._token, "cannot apply operator '" + this._token.getValue() + "' to type '" + expr.getType().toString() + "'"));
			return false;
		}
		return true;
	}

}

// primary expressions

class LocalExpression extends LeafExpression {

	var _local : LocalVariable;
	var _cloned : boolean;

	function constructor (token : Token, local : LocalVariable) {
		super(token);
		this._local = local;
	}

	override function clone () : LocalExpression {
		var that = new LocalExpression(this._token, this._local);
		that._cloned = true;
		return that;
	}

	function getLocal () : LocalVariable {
		return this._local;
	}

	function setLocal (local : LocalVariable) : void {
		this._local = local;
	}

	override function serialize () : variant {
		return [
			"LocalExpression",
			this._token.serialize(),
			this._local.serialize()
		] : variant[];
	}

	override function analyze (context : AnalysisContext, parentExpr : Expression) : boolean {
		// check that the variable is readable
		if ((parentExpr instanceof AssignmentExpression
		     && (parentExpr as AssignmentExpression).getFirstExpr() == this
			&& (parentExpr as AssignmentExpression).getToken().getValue() == "=")
			|| (parentExpr == null
				&& context.statement instanceof ForInStatement
				&& (context.statement as ForInStatement).getLHSExpr() == this)) {
			// is LHS
		} else {
			this._local.touchVariable(context, this._token, false);
			if (this._local.getType() == null)
				return false;
		}
		return true;
	}

	override function getType () : Type {
		return this._local.getType();
	}

	override function assertIsAssignable (context : AnalysisContext, token : Token, type : Type) : boolean {
		if (this._local.getType() == null) {
			if (type.equals(Type.nullType)) {
				context.errors.push(new CompileError(token, "cannot assign null without type annotation to a value of undetermined type"));
				return false;
			}
			this._local.setType(type.asAssignableType());
		} else if (! type.isConvertibleTo(this._local.getType())) {
			context.errors.push(new CompileError(token, "cannot assign a value of type '" + type.toString() + "' to '" + this._local.getType().toString() + "'"));
			return false;
		}
		this._local.touchVariable(context, this._token, true);
		return true;
	}

}

class ClassExpression extends LeafExpression {

	var _parsedType : Type;

	function constructor (token : Token, parsedType : Type) {
		super(token);
		this._parsedType = parsedType;
	}

	override function clone () : ClassExpression {
		return new ClassExpression(this._token, this._parsedType);
	}

	override function serialize () : variant {
		return [
			"ClassExpression",
			this._token.serialize(),
			this._parsedType.serialize()
		] : variant[];
	}

	override function analyze (context : AnalysisContext, parentExpr : Expression) : boolean {
		return true;
	}

	override function getType () : Type {
		return this._parsedType;
	}

	function setType (type : Type) : void {
		this._parsedType = type;
	}

	override function assertIsAssignable (context : AnalysisContext, token : Token, type : Type) : boolean {
		context.errors.push(new CompileError(token, "cannot modify a class definition"));
		return false;
	}

}

class NullExpression extends LeafExpression {

	var _type : Type;

	function constructor (token : Token, type : Type) {
		super(token);
		this._type = type;
	}

	override function clone () : NullExpression {
		return new NullExpression(this._token, this._type);
	}

	override function serialize () : variant {
		return [
			"NullExpression",
			this._token.serialize(),
			this._type.serialize()
		] : variant[];
	}

	override function analyze (context : AnalysisContext, parentExpr : Expression) : boolean {
		return true;
	}

	override function getType () : Type {
		return this._type;
	}

	function setType (type : Type) : void {
		this._type = type;
	}
}

class BooleanLiteralExpression extends LeafExpression {

	function constructor (token : Token) {
		super(token);
	}

	override function clone () : BooleanLiteralExpression {
		return new BooleanLiteralExpression(this._token);
	}

	override function serialize () : variant {
		return [
			"BooleanLiteralExpression",
			this._token.serialize()
		] : variant[];
	}

	override function analyze (context : AnalysisContext, parentExpr : Expression) : boolean {
		return true;
	}

	override function getType () : Type {
		return Type.booleanType;
	}

}

class IntegerLiteralExpression extends LeafExpression {

	function constructor (token : Token) {
		super(token);
	}

	override function clone () : IntegerLiteralExpression {
		return new IntegerLiteralExpression(this._token);
	}

	override function serialize () : variant {
		return [
			"IntegerLiteralExpression",
			this._token.serialize()
		] : variant[];
	}

	override function analyze (context : AnalysisContext, parentExpr : Expression) : boolean {
		return true;
	}

	override function getType () : Type {
		return Type.integerType;
	}

}


class NumberLiteralExpression extends LeafExpression {

	function constructor (token : Token) {
		super(token);
	}

	override function clone () : NumberLiteralExpression {
		return new NumberLiteralExpression(this._token);
	}

	override function serialize () : variant {
		return [
			"NumberLiteralExpression",
			this._token.serialize()
		] : variant[];
	}

	override function analyze (context : AnalysisContext, parentExpr : Expression) : boolean {
		return true;
	}

	override function getType () : Type {
		return Type.numberType;
	}

}

class StringLiteralExpression extends LeafExpression {

	function constructor (token : Token) {
		super(token);
	}

	override function clone () : StringLiteralExpression {
		return new StringLiteralExpression(this._token);
	}

	override function serialize () : variant {
		return [
			"StringLiteralExpression",
			this._token.serialize()
		] : variant[];
	}

	override function analyze (context : AnalysisContext, parentExpr : Expression) : boolean {
		return true;
	}

	override function getType () : Type {
		return Type.stringType;
	}

}

class RegExpLiteralExpression extends LeafExpression {

	var _type : Type;

	function constructor (token : Token) {
		this(token, null);
	}

	function constructor (token : Token, type : Type) {
		super(token);
		this._type = type;
	}

	override function clone () : RegExpLiteralExpression {
		return new RegExpLiteralExpression(this._token, this._type);
	}

	override function serialize () : variant {
		return [
			"RegExpLiteralExpression",
			this._token.serialize()
		] : variant[];
	}

	override function analyze (context : AnalysisContext, parentExpr : Expression) : boolean {
		var classDef = context.parser.lookup(context.errors, this._token, "RegExp");
		if (classDef == null)
			throw new Error("could not find definition for RegExp");
		this._type = new ObjectType(classDef);
		return true;
	}

	override function getType () : Type {
		return this._type;
	}

}

class ArrayLiteralExpression extends Expression {

	var _exprs : Expression[];
	var _type : Type;

	function constructor (token : Token, exprs : Expression[], type : Type) {
		super(token);
		this._exprs = exprs;
		this._type = type; // optional at this moment
	}

	override function clone () : ArrayLiteralExpression {
		return new ArrayLiteralExpression(this._token, Cloner.<Expression>.cloneArray(this._exprs), this._type);
	}

	function getExprs () : Expression[] {
		return this._exprs;
	}

	override function getType () : Type {
		return this._type;
	}

	function setType (type : Type) : void {
		this._type = type;
	}

	override function serialize () : variant {
		return [
			"ArrayLiteralExpression",
			this._token.serialize(),
			Serializer.<Expression>.serializeArray(this._exprs),
			Serializer.<Type>.serializeNullable(this._type)
		] : variant[];
	}

	override function analyze (context : AnalysisContext, parentExpr : Expression) : boolean {
		// analyze all elements
		var succeeded = true;
		for (var i = 0; i < this._exprs.length; ++i) {
			if (! this._exprs[i].analyze(context, this)) {
				succeeded = false;
			} else if (this._exprs[i].getType().equals(Type.voidType)) {
				 // FIXME the location of the error would be strange; we deseparately need expr.getToken()
				context.errors.push(new CompileError(this._token, "cannot assign void to an array"));
				succeeded = false;
			}
		}
		if (! succeeded)
			return false;
		// determine the type from the array members if the type was not specified
		if (this._type != null) {
			var classDef;
			if (this._type instanceof ObjectType
				&& (classDef = this._type.getClassDef()) instanceof InstantiatedClassDefinition
				&& (classDef as InstantiatedClassDefinition).getTemplateClassName() == "Array") {
				//ok
			} else {
				context.errors.push(new CompileError(this._token, "the type specified after ':' is not an array type"));
				return false;
			}
			// check type of the elements
			var expectedType = (this._type.getClassDef() as InstantiatedClassDefinition).getTypeArguments()[0].toNullableType();
			for (var i = 0; i < this._exprs.length; ++i) {
				var elementType = this._exprs[i].getType();
				if (! elementType.isConvertibleTo(expectedType)) {
					context.errors.push(new CompileError(this._token, "cannot assign '" + elementType.toString() + "' to an array of '" + expectedType.toString() + "'"));
					succeeded = false;
				}
			}
		} else {
			var elementType = Type.calcLeastCommonAncestor(this._exprs.map.<Type>((expr) -> { return expr.getType(); }), true);
			if (elementType == null || elementType.equals(Type.nullType)) {
				context.errors.push(new CompileError(this._token, "could not deduce array type, please specify"));
				return false;
			}
			if (elementType.equals(Type.integerType))
				elementType = Type.numberType;
			elementType = elementType.resolveIfNullable();
			this._type = new ObjectType(Expression.instantiateTemplate(context, this._token, "Array", [ elementType ]));
		}
		return succeeded;
	}

	override function forEachExpression (cb : function(:Expression,:function(:Expression):void):boolean) : boolean {
		if (! Util.forEachExpression(cb, this._exprs))
			return false;
		return true;
	}

}

class MapLiteralElement {

	var _key : Token;
	var _expr : Expression;

	function constructor (key : Token, expr : Expression) {
		this._key = key;
		this._expr = expr;
	}

	function getKey () : Token {
		return this._key;
	}

	function getExpr () : Expression {
		return this._expr;
	}

	function setExpr (expr : Expression) : void {
		this._expr = expr;
	}

	function serialize () : variant {
		return [
			this._key.serialize(),
			this._expr.serialize()
		] : variant[];
	}

}

class MapLiteralExpression extends Expression {

	var _elements : MapLiteralElement[];
	var _type : Type;

	function constructor (token : Token, elements : MapLiteralElement[], type : Type) {
		super(token);
		this._elements = elements;
		this._type = type; // optional at this moment
	}

	override function clone () : MapLiteralExpression {
		var ret = new MapLiteralExpression(this._token, new MapLiteralElement[], this._type);
		for (var i = 0; i < this._elements.length; ++i)
			ret._elements[i] = new MapLiteralElement(this._elements[i].getKey(), this._elements[i].getExpr().clone());
		return ret;
	}

	function getElements () : MapLiteralElement[] {
		return this._elements;
	}

	override function getType () : Type {
		return this._type;
	}

	function setType (type : Type) : void {
		this._type = type;
	}

	override function serialize () : variant {
		return [
			"MapLiteralExpression",
			this._token.serialize(),
			Serializer.<MapLiteralElement>.serializeArray(this._elements),
			Serializer.<Type>.serializeNullable(this._type)
		] : variant[];
	}

	override function analyze (context : AnalysisContext, parentExpr : Expression) : boolean {
		// analyze all elements
		var succeeded = true;
		for (var i = 0; i < this._elements.length; ++i) {
			if (! this._elements[i].getExpr().analyze(context, this)) {
				succeeded = false;
			} else if (this._elements[i].getExpr().getType().equals(Type.voidType)) {
				 // FIXME the location of the error would be strange; we deseparately need expr.getToken()
				context.errors.push(new CompileError(this._token, "cannot assign void to a hash"));
				succeeded = false;
			}
		}
		if (! succeeded)
			return false;
		// determine the type from the array members if the type was not specified
		if (this._type != null && this._type == Type.variantType) {
			// pass
		} else if (this._type != null && this._type instanceof ObjectType) {
			var classDef = this._type.getClassDef();
			if (! (classDef instanceof InstantiatedClassDefinition && (classDef as InstantiatedClassDefinition).getTemplateClassName() == "Map")) {
				context.errors.push(new CompileError(this._token, "specified type is not a hash type"));
				return false;
			}
			var expectedType = (this._type as ParsedObjectType).getTypeArguments()[0];
			// check type of the elements (expect when expectedType == null, meaning that it is a variant)
			for (var i = 0; i < this._elements.length; ++i) {
				var elementType = this._elements[i].getExpr().getType();
				if (! elementType.isConvertibleTo(expectedType)) {
					context.errors.push(new CompileError(this._token, "cannot assign '" + elementType.toString() + "' to a map of '" + expectedType.toString() + "'"));
					succeeded = false;
				}
			}
		} else if (this._type != null) {
			context.errors.push(new CompileError(this._token, "invalid type for a map literal"));
			return false;
		} else {
			var elementType = Type.calcLeastCommonAncestor(this._elements.map.<Type>((elt) -> { return elt.getExpr().getType(); }), true);
			if (elementType == null || elementType.equals(Type.nullType)) {
				context.errors.push(new CompileError(this._token, "could not deduce hash type, please specify"));
				return false;
			}
			if (elementType.equals(Type.integerType))
				elementType = Type.numberType;
			elementType = elementType.resolveIfNullable();
			this._type = new ObjectType(Expression.instantiateTemplate(context, this._token, "Map", [ elementType ]));
		}
		return succeeded;
	}

	override function forEachExpression (cb : function(:Expression,:function(:Expression):void):boolean) : boolean {
		for (var i = 0; i < this._elements.length; ++i) {
			if (! cb(this._elements[i].getExpr(), function (elements : MapLiteralElement[], index : number) : function(:Expression):void {
				return function (expr) {
					elements[index].setExpr(expr);
				};
			}(this._elements, i))) {
				return false;
			}
		}
		return true;
	}

}

class ThisExpression extends Expression {

	var _classDef : ClassDefinition;

	function constructor (token : Token, classDef : ClassDefinition) {
		super(token);
		this._classDef = classDef;
	}

	override function clone () : ThisExpression {
		return new ThisExpression(this._token, this._classDef);
	}

	override function serialize () : variant {
		return [
			"ThisExpression",
			this._token.serialize(),
			Serializer.<ClassDefinition>.serializeNullable(this._classDef)
		] : variant[];
	}

	override function analyze (context : AnalysisContext, parentExpr : Expression) : boolean {
		var rootFuncDef = context.funcDef;
		if (rootFuncDef != null)
			while (rootFuncDef.getParent() != null)
				rootFuncDef = rootFuncDef.getParent();
		if (rootFuncDef == null || (rootFuncDef.flags() & ClassDefinition.IS_STATIC) != 0) {
			context.errors.push(new CompileError(this._token, "cannot use 'this' outside of a member function"));
			return false;
		}
		this._classDef = rootFuncDef.getClassDef();
		return true;
	}

	override function getType () : Type {
		return new ObjectType(this._classDef);
	}

	override function forEachExpression (cb : function(:Expression,:function(:Expression):void):boolean) : boolean {
		return true;
	}

}

class FunctionExpression extends Expression {

	var _funcName : LocalVariable;
	var _funcDef : MemberFunctionDefinition;
	var _isStatement : boolean;

	function constructor (token : Token, funcName : LocalVariable, funcDef : MemberFunctionDefinition, isStatement : boolean) {
		super(token);
		this._funcName = funcName;
		this._funcDef = funcDef;
		this._isStatement = isStatement;
	}

	override function clone () : FunctionExpression {
		// NOTE: funcDef is not cloned, but is later replaced in MemberFunctionDefitition#instantiate
		return new FunctionExpression(this._token, this._funcName, this._funcDef, this._isStatement);
	}

	function getFuncName () : LocalVariable {
		return this._funcName;
	}

	function getFuncDef () : MemberFunctionDefinition {
		return this._funcDef;
	}

	function setFuncDef (funcDef : MemberFunctionDefinition) : void {
		this._funcDef = funcDef;
	}

	function isStatement () : boolean {
		return this._isStatement;
	}

	override function serialize () : variant {
		return [
			"FunctionExpression",
			this._funcDef.serialize()
		] : variant[];
	}

	override function analyze (context : AnalysisContext, parentExpr : Expression) : boolean {
		if (! this.typesAreIdentified()) {
			context.errors.push(new CompileError(this._token, "argument / return types were not automatically deductable, please specify them by hand"));
			return false;
		}
		if (this._isStatement) {
			context.getTopBlock().localVariableStatuses.setStatus(new LocalVariable(this._funcDef.getNameToken(), this.getType()));
		}
		this._funcDef.analyze(context);
		return true; // return true since everything is resolved correctly even if analysis of the function definition failed
	}

	override function getType () : Type {
		return this._funcDef.getType();
	}

	function typesAreIdentified () : boolean {
		var argTypes = this._funcDef.getArgumentTypes();
		for (var i = 0; i < argTypes.length; ++i) {
			if (argTypes[i] == null)
				return false;
		}
		if (this._funcDef.getReturnType() == null)
			return false;
		return true;
	}

	function deductTypeIfUnknown (context : AnalysisContext, type : ResolvedFunctionType) : boolean {
		if (! this._funcDef.deductTypeIfUnknown(context, type))
			return false;
		if (this._funcName != null) {
			if (this._funcName.getType() != null) {
				if (! this._funcName.getType().equals(this._funcDef.getType()))
					throw new Error("unmatched type for local function: " + this._funcName.getName().getValue());
			} else {
				this._funcName.setType(this._funcDef.getType());
			}
		}
		return true;
	}

	override function forEachExpression (cb : function(:Expression,:function(:Expression):void):boolean) : boolean {
		return true;
	}

}

// unary expressions

abstract class UnaryExpression extends OperatorExpression {

	var _expr : Expression;

	function constructor (operatorToken : Token, expr : Expression) {
		super(operatorToken);
		this._expr = expr;
	}

	function getExpr () : Expression {
		return this._expr;
	}

	function setExpr (expr : Expression) : void {
		this._expr = expr;
	}

	override function serialize () : variant {
		return [
			"UnaryExpression",
			this._token.serialize(),
			this._expr.serialize()
		] : variant[];
	}

	function _analyze (context : AnalysisContext) : boolean {
		if (! this._expr.analyze(context, this))
			return false;
		if (this._expr.getType().equals(Type.voidType)) {
			context.errors.push(new CompileError(this._token, "cannot apply operator '" + this._token.getValue() + "' against void"));
			return false;
		}
		return true;
	}

	override function forEachExpression (cb : function(:Expression,:function(:Expression):void):boolean) : boolean {
		return cb(this._expr, function (expr) { this._expr = expr; });
	}

}

class BitwiseNotExpression extends UnaryExpression {

	function constructor (operatorToken : Token, expr : Expression) {
		super(operatorToken, expr);
	}

	override function clone () : BitwiseNotExpression {
		return new BitwiseNotExpression(this._token, this._expr.clone());
	}

	override function analyze (context : AnalysisContext, parentExpr : Expression) : boolean {
		if (! this._analyze(context))
			return false;
		if (! this.assertIsConvertibleTo(context, this._expr, Type.numberType, false))
			return false;
		return true;
	}

	override function getType () : Type {
		return Type.integerType;
	}

}

class InstanceofExpression extends UnaryExpression {

	var _expectedType : Type;

	function constructor (operatorToken : Token, expr : Expression, expectedType : Type) {
		super(operatorToken, expr);
		this._expectedType = expectedType;
	}

	override function clone () : InstanceofExpression {
		return new InstanceofExpression(this._token, this._expr.clone(), this._expectedType);
	}

	function getExpectedType () : Type {
		return this._expectedType;
	}

	override function serialize () : variant {
		return [
			"InstanceofExpression",
			this._expr.serialize(),
			this._expectedType.serialize()
		] : variant[];
	}

	override function analyze (context : AnalysisContext, parentExpr : Expression) : boolean {
		if (! this._analyze(context))
			return false;
		var exprType = this._expr.getType();
		if (exprType instanceof ObjectType) {
		} else if (exprType.equals(Type.variantType)) {
		} else {
			context.errors.push(new CompileError(this._token, "operator 'instanceof' is only applicable to an object or a variant"));
			return false;
		}
		return true;
	}

	override function getType () : Type {
		return Type.booleanType;
	}

}

class AsExpression extends UnaryExpression {

	var _type : Type;

	function constructor (operatorToken : Token, expr : Expression, type : Type) {
		super(operatorToken, expr);
		this._type = type;
	}

	override function clone () : AsExpression {
		return new AsExpression(this._token, this._expr.clone(), this._type);
	}

	override function serialize () : variant {
		return [
			"AsExpression",
			this._expr.serialize(),
			this._type.serialize()
		] : variant[];
	}

	override function analyze (context : AnalysisContext, parentExpr : Expression) : boolean {
		if (! this._analyze(context))
			return false;
		if (this._type instanceof NullableType) {
			context.errors.push(new CompileError(this._token, "right operand of 'as' expression cannot be a Nullable<T> type"));
			return false;
		}
		// nothing to care if the conversion is allowed by implicit conversion
		if (this._expr.getType().isConvertibleTo(this._type))
			return true;
		// possibly unsafe conversions
		var exprType = this._expr.getType().resolveIfNullable();
		var success = false;
		if (exprType.equals(Type.nullType)) {
			if (this._type instanceof ObjectType || this._type instanceof FunctionType) {
				// ok
				success = true;
			}
		} else if (exprType instanceof PrimitiveType) {
			if (this._type instanceof PrimitiveType) {
				// ok: primitive => primitive
				success = true;
			}
		} else if (exprType.equals(Type.variantType)) {
			// ok, variant is convertible to all types of objects
			success = true;
		} else if (exprType instanceof ObjectType) {
			// FIXME? conversion from objects to primitives should be done by calling toString(), valueOf(), etc. (optimized by emitter)
			if (this._type instanceof ObjectType && this._type.isConvertibleTo(exprType)) {
				// is down-cast, maybe unsafe
				success = true;
			}
		} else if (this._expr instanceof PropertyExpression && exprType instanceof FunctionType && this._type instanceof StaticFunctionType) {
			var deducedType = (this._expr as PropertyExpression).deduceByArgumentTypes(context, this._token, (this._type as StaticFunctionType).getArgumentTypes(), true);
			if (deducedType != null) {
				exprType = deducedType;
				if (deducedType.getReturnType().equals((this._type as StaticFunctionType).getReturnType())) {
					success = true;
				}
			}
		}
		if (! success) {
			context.errors.push(new CompileError(this._token, "cannot convert a value of type '" + exprType.toString() + "' to '" + this._type.toString() + "'"));
			return false;
		}
		return true;
	}

	override function getType () : Type {
		return this._type;
	}

	function setType (type : Type) : void {
		this._type = type;
	}

}

class AsNoConvertExpression extends UnaryExpression {

	var _type : Type;

	function constructor (operatorToken : Token, expr : Expression, type : Type) {
		super(operatorToken, expr);
		this._type = type;
	}

	override function clone () : AsNoConvertExpression {
		return new AsNoConvertExpression(this._token, this._expr.clone(), this._type);
	}

	override function serialize () : variant {
		return [
			"AsNoConvertExpression",
			this._expr.serialize(),
			this._type.serialize()
		] : variant[];
	}

	override function analyze (context : AnalysisContext, parentExpr : Expression) : boolean {
		if (! this._analyze(context))
			return false;
		var srcType = this._expr.getType();
		if ((srcType.equals(Type.nullType) && ! (this._type instanceof NullableType || this._type instanceof ObjectType || this._type instanceof FunctionType))) {
			context.errors.push(new CompileError(this._token, "'" + srcType.toString() + "' cannot be treated as a value of type '" + this._type.toString() + "'"));
			return false;
		}
		return true;
	}

	override function getType () : Type {
		return this._type;
	}

	function setType (type : Type) : void {
		this._type = type;
	}

}

class LogicalNotExpression extends UnaryExpression {

	function constructor (operatorToken : Token, expr : Expression) {
		super(operatorToken, expr);
	}

	override function clone () : LogicalNotExpression {
		return new LogicalNotExpression(this._token, this._expr.clone());
	}

	override function analyze (context : AnalysisContext, parentExpr : Expression) : boolean {
		if (! this._analyze(context))
			return false;
		if (this._expr.getType().resolveIfNullable().equals(Type.voidType)) {
			context.errors.push(new CompileError(this._token, "cannot apply operator '!' against void"));
			return false;
		}
		return true;
	}

	override function getType () : Type {
		return Type.booleanType;
	}

}

abstract class IncrementExpression extends UnaryExpression {

	function constructor (operatorToken : Token, expr : Expression) {
		super(operatorToken, expr);
	}

	override function serialize () : variant {
		return [
			this._getClassName(),
			this._token.serialize(),
			this._expr.serialize()
		] : variant[];
	}

	override function analyze (context : AnalysisContext, parentExpr : Expression) : boolean {
		if (! this._analyze(context))
			return false;
		var exprType = this._expr.getType();
		if (exprType.resolveIfNullable().equals(Type.integerType) || exprType.resolveIfNullable().equals(Type.numberType)) {
			// ok
		} else {
			context.errors.push(new CompileError(this._token, "cannot apply operator '" + this._token.getValue() + "' to a non-number"));
			return false;
		}
		if (! this._expr.assertIsAssignable(context, this._token, exprType))
			return false;
		return true;
	}

	override function getType () : Type {
		return this._expr.getType().resolveIfNullable();
	}

	abstract function _getClassName () : string;

}

class PostIncrementExpression extends IncrementExpression {

	function constructor (operatorToken : Token, expr : Expression) {
		super(operatorToken, expr);
	}

	override function clone () : PostIncrementExpression {
		return new PostIncrementExpression(this._token, this._expr.clone());
	}

	override function _getClassName () : string {
		return "PostIncrementExpression";
	}

}

class PreIncrementExpression extends IncrementExpression {

	function constructor (operatorToken : Token, expr : Expression) {
		super(operatorToken, expr);
	}

	override function clone () : PreIncrementExpression {
		return new PreIncrementExpression(this._token, this._expr.clone());
	}

	override function _getClassName () : string {
		return "PreIncrementExpression";
	}

}

class PropertyExpression extends UnaryExpression {

	var _identifierToken : Token;
	var _typeArgs : Type[];
	var _type : Type;

	function constructor (operatorToken : Token, expr1 : Expression, identifierToken : Token, typeArgs : Type[]) {
		this(operatorToken, expr1, identifierToken, typeArgs, null);
	}

	function constructor (operatorToken : Token, expr1 : Expression, identifierToken : Token, typeArgs : Type[], type : Type) {
		super(operatorToken, expr1);
		this._identifierToken = identifierToken;
		this._typeArgs = typeArgs;
		this._type = type != null ? type : null;
	}

	override function clone () : PropertyExpression {
		return new PropertyExpression(this._token, this._expr.clone(), this._identifierToken, this._typeArgs, this._type);
	}

	function getIdentifierToken () : Token {
		return this._identifierToken;
	}

	function getTypeArguments () : Type[] {
		return this._typeArgs;
	}

	override function serialize () : variant {
		return [
			"PropertyExpression",
			this._expr.serialize(),
			this._identifierToken.serialize(),
			Serializer.<Type>.serializeNullable(this._type)
		] : variant[];
	}

	override function analyze (context : AnalysisContext, parentExpr : Expression) : boolean {
		// normal handling
		if (! this._analyze(context))
			return false;
		var exprType = this._expr.getType();
		if (exprType.equals(Type.voidType)) {
			context.errors.push(new CompileError(this._identifierToken, "cannot obtain a member of void"));
			return false;
		}
		if (exprType.equals(Type.nullType)) {
			context.errors.push(new CompileError(this._identifierToken, "cannot obtain a member of null"));
			return false;
		}
		if (exprType.resolveIfNullable().equals(Type.variantType)) {
			context.errors.push(new CompileError(this._identifierToken, "property of a variant should be referred to by using the [] operator"));
			return false;
		}
		var classDef = exprType.getClassDef();
		if (classDef == null) {
			context.errors.push(new CompileError(this._identifierToken, "cannot determine type due to preceding errors"));
			return false;
		}
		this._type = classDef.getMemberTypeByName(
			context.errors,
			this._identifierToken,
			this._identifierToken.getValue(),
			this._expr instanceof ClassExpression,
			this._typeArgs,
			(this._expr instanceof ClassExpression) ? ClassDefinition.GET_MEMBER_MODE_CLASS_ONLY : ClassDefinition.GET_MEMBER_MODE_ALL);
		if (this._type == null) {
			context.errors.push(new CompileError(this._identifierToken, "'" + exprType.toString() + "' does not have a property named '" + this._identifierToken.getValue() + "'"));
			return false;
		}
		return true;
	}

	override function getType () : Type {
		return this._type;
	}

	override function getHolderType () : Type {
		var type = this._expr.getType();
		if (type instanceof PrimitiveType)
			type = new ObjectType(type.getClassDef());
		return type;
	}

	override function assertIsAssignable (context : AnalysisContext, token : Token, type : Type) : boolean {
		if (! Expression.assertIsAssignable(context, token, this._type, type))
			return false;
		// check constness (note: a possibly assignable property is always a member variable)
		var holderType = this.getHolderType();
		var varFlags = 0;
		if (! holderType.equals(Type.variantType)) {
			if (holderType.getClassDef().forEachClassToBase(function (classDef) {
				return classDef.forEachMemberVariable(function (varDef) {
					if (varDef.name() == this._identifierToken.getValue()) {
						// found
						varFlags = varDef.flags();
						return false;
					}
					return true;
				});
			})) {
				throw new Error("logic flaw, could not find definition for " + holderType.getClassDef().className() + "#" + this._identifierToken.getValue());
			}
		}
		if ((varFlags & ClassDefinition.IS_CONST) != 0) {
			context.errors.push(new CompileError(token, "cannot modify a constant"));
			return false;
		} else if ((varFlags & ClassDefinition.IS_READONLY) != 0) {
			context.errors.push(new CompileError(token, "cannot modify a readonly variable"));
			return false;
		}
		return true;
	}

	function deduceByArgumentTypes (context : AnalysisContext, operatorToken : Token, argTypes : Type[], isStatic : boolean) : ResolvedFunctionType {
		for (var i = 0; i < argTypes.length; ++i) {
			if (argTypes[i] instanceof FunctionChoiceType) {
				context.errors.push(new CompileError(operatorToken, "type deduction of overloaded function passed in as an argument is not supported; use 'as' to specify the function"));
				return null;
			}
		}
		var rhsType = (this._type as FunctionType).deduceByArgumentTypes(context, operatorToken, argTypes, isStatic);
		if (rhsType == null)
			return null;
		this._type = rhsType;
		return rhsType;
	}

}

class TypeofExpression extends UnaryExpression {

	function constructor (operatorToken : Token, expr : Expression) {
		super(operatorToken, expr);
	}

	override function clone () : TypeofExpression {
		return new TypeofExpression(this._token, this._expr.clone());
	}

	override function analyze (context : AnalysisContext, parentExpr : Expression) : boolean {
		if (! this._analyze(context))
			return false;
		var exprType = this._expr.getType();
		if (! exprType.equals(Type.variantType)) {
			context.errors.push(new CompileError(this._token, "cannot apply operator 'typeof' to '" + this._expr.getType().toString() + "'"));
			return false;
		}
		return true;
	}

	override function getType () : Type {
		return Type.stringType;
	}

}

class SignExpression extends UnaryExpression {

	function constructor (operatorToken : Token, expr : Expression) {
		super(operatorToken, expr);
	}

	override function clone () : SignExpression {
		return new SignExpression(this._token, this._expr.clone());
	}

	override function analyze (context : AnalysisContext, parentExpr : Expression) : boolean {
		if (! this._analyze(context))
			return false;
		if (! this.assertIsConvertibleTo(context, this._expr, Type.numberType, true))
			return false;
		return true;
	}

	override function getType () : Type {
		var type = this._expr.getType();
		if (type.resolveIfNullable().equals(Type.numberType))
			return Type.numberType;
		else
			return Type.integerType;
	}

}

// binary expressions

abstract class BinaryExpression extends OperatorExpression {

	var _expr1 : Expression;
	var _expr2 : Expression;

	function constructor (operatorToken : Token, expr1 : Expression, expr2 : Expression) {
		super(operatorToken);
		this._expr1 = expr1;
		this._expr2 = expr2;
	}

	function getFirstExpr () : Expression {
		return this._expr1;
	}

	function setFirstExpr (expr : Expression) : void {
		this._expr1 = expr;
	}

	function getSecondExpr () : Expression {
		return this._expr2;
	}

	function setSecondExpr (expr : Expression) : void {
		this._expr2 = expr;
	}

	override function serialize () : variant {
		return [
			"BinaryExpression",
			this._token.serialize(),
			this._expr1.serialize(),
			this._expr2.serialize()/*,
			Util.serializeNullable(this.getType())*/
		] : variant[];
	}

	function _analyze (context : AnalysisContext) : boolean {
		if (! this._expr1.analyze(context, this))
			return false;
		if (! this._expr2.analyze(context, this))
			return false;
		return true;
	}

	override function forEachExpression (cb : function(:Expression,:function(:Expression):void):boolean) : boolean {
		if (! cb(this._expr1, function (expr) { this._expr1 = expr; }))
			return false;
		if (! cb(this._expr2, function (expr) { this._expr2 = expr; }))
			return false;
		return true;
	}

}

class AdditiveExpression extends BinaryExpression {

	var _type : Type;

	function constructor (operatorToken : Token, expr1 : Expression, expr2 : Expression) {
		super(operatorToken, expr1, expr2);
		this._type = null;
	}

	override function clone () : AdditiveExpression {
		var ret = new AdditiveExpression(this._token, this._expr1.clone(), this._expr2.clone());
		ret._type = this._type;
		return ret;
	}

	override function analyze (context : AnalysisContext, parentExpr : Expression) : boolean {
		if (! this._analyze(context))
			return false;
		var expr1Type = this._expr1.getType().resolveIfNullable();
		var expr2Type = this._expr2.getType().resolveIfNullable();
		if ((expr1Type.isConvertibleTo(Type.numberType) || (expr1Type instanceof ObjectType && expr1Type.getClassDef() == Type.numberType.getClassDef()))
			&& (expr2Type.isConvertibleTo(Type.numberType) || (expr2Type instanceof ObjectType && expr2Type.getClassDef() == Type.numberType.getClassDef()))) {
			// ok
			this._type = (expr1Type instanceof NumberType) || (expr2Type instanceof NumberType)
				? (Type.numberType as Type) : (Type.integerType as Type);
		} else if ((expr1Type.equals(Type.stringType) || (expr1Type instanceof ObjectType && expr1Type.getClassDef() == Type.stringType.getClassDef()))
			&& (expr2Type.equals(Type.stringType) || (expr2Type instanceof ObjectType && expr2Type.getClassDef() == Type.stringType.getClassDef()))) {
			// ok
			this._type = expr1Type;
		} else {
			context.errors.push(new CompileError(this._token, "cannot apply operator '+' to '" + expr1Type.toString() + "' and '" + expr2Type.toString() + "'"));
			return false;
		}
		return true;
	}

	override function getType () : Type {
		return this._type;
	}
}

class ArrayExpression extends BinaryExpression {

	var _type : Type;

	function constructor (operatorToken : Token, expr1 : Expression, expr2 : Expression) {
		super(operatorToken, expr1, expr2);
		this._type = null;
	}

	override function clone () : ArrayExpression {
		var ret = new ArrayExpression(this._token, this._expr1.clone(), this._expr2.clone());
		ret._type = this._type;
		return ret;
	}

	override function analyze (context : AnalysisContext, parentExpr : Expression) : boolean {
		if (! this._analyze(context))
			return false;
		if (this._expr1.getType() == null) {
			context.errors.push(new CompileError(this._token, "cannot determine type due to preceding errors"));
			return false;
		}
		// obtain classDef
		var expr1Type = this._expr1.getType().resolveIfNullable();
		if (expr1Type instanceof ObjectType) {
			return this._analyzeApplicationOnObject(context, expr1Type);
		} else if (expr1Type.equals(Type.variantType)) {
			return this._analyzeApplicationOnVariant(context);
		}
		context.errors.push(new CompileError(this._token, "cannot apply []; the operator is only applicable against an array or an variant"));
		return false;
	}

	function _analyzeApplicationOnObject (context : AnalysisContext, expr1Type : Type) : boolean {
		var expr1ClassDef = expr1Type.getClassDef();
		assert expr1ClassDef;
		// obtain type of operator []
		var funcType = expr1ClassDef.getMemberTypeByName(context.errors, this._token, "__native_index_operator__", false, new Type[], ClassDefinition.GET_MEMBER_MODE_ALL) as FunctionType;
		if (funcType == null) {
			context.errors.push(new CompileError(this._token, "cannot apply operator[] on an instance of class '" + expr1ClassDef.className() + "'"));
			return false;
		}
		// check type of expr2
		var deducedFuncType = funcType.deduceByArgumentTypes(context, this._token, [ this._expr2.getType() ], false);
		if (deducedFuncType == null) {
			return false;
		}
		// set type of the expression
		this._type = deducedFuncType.getReturnType();
		return true;
	}

	function _analyzeApplicationOnVariant (context : AnalysisContext) : boolean {
		var expr2Type = this._expr2.getType().resolveIfNullable();
		if (! (expr2Type.equals(Type.stringType) || expr2Type.isConvertibleTo(Type.numberType))) {
			context.errors.push(new CompileError(this._token, "the argument of variant[] should be a string or a number"));
			return false;
		}
		this._type = Type.variantType;
		return true;
	}

	override function getType () : Type {
		return this._type;
	}

	override function assertIsAssignable (context : AnalysisContext, token : Token, type : Type) : boolean {
		return Expression.assertIsAssignable(context, token, this._type, type);
	}

}

class AssignmentExpression extends BinaryExpression {

	function constructor (operatorToken : Token, expr1 : Expression, expr2 : Expression) {
		super(operatorToken, expr1, expr2);
	}

	override function clone () : AssignmentExpression {
		return new AssignmentExpression(this._token, this._expr1.clone(), this._expr2.clone());
	}

	override function analyze (context : AnalysisContext, parentExpr : Expression) : boolean {
		// special handling for v = function () ...
		if (this._expr2 instanceof FunctionExpression)
			return this._analyzeFunctionExpressionAssignment(context, parentExpr);
		// normal handling
		if (! this._analyze(context))
			return false;
		if (this._token.getValue() != "=")
			return this._analyzeFusedAssignment(context);
		var rhsType = this._expr2.getType();
		if (rhsType == null)
			return false;
		if (rhsType.equals(Type.voidType)) {
			context.errors.push(new CompileError(this._token, "cannot assign void"));
			return false;
		}
		if (this._expr2 instanceof ClassExpression) {
			context.errors.push(new CompileError(this._token, "cannot assign a class"));
			return false;
		}
		if (rhsType.resolveIfNullable().equals(Type.nullType) && this._expr1.getType() == null) {
			context.errors.push(new CompileError(this._token, "cannot assign null to an unknown type"));
			return false;
		}
		if (rhsType instanceof FunctionChoiceType) {
			var lhsType = this._expr1.getType();
			if (lhsType != null) {
				if (! (lhsType instanceof ResolvedFunctionType)) {
					context.errors.push(new CompileError(this._token, "cannot assign a function reference to '" + this._expr1.getType().toString() + "'"));
					return false;
				}
				if ((rhsType = (this._expr2 as PropertyExpression).deduceByArgumentTypes(context, this._token, (lhsType as ResolvedFunctionType).getArgumentTypes(), lhsType instanceof StaticFunctionType)) == null)
					return false;
			} else {
				context.errors.push(new CompileError(this._token, "function reference is ambiguous"));
				return false;
			}
		}
		// assert that rhs type is not a member function, after resolving the function
		if (rhsType instanceof MemberFunctionType) {
			context.errors.push(new CompileError(this._token, "cannot assign a member function"));
			return false;
		}
		if (! this._expr1.assertIsAssignable(context, this._token, rhsType))
			return false;
		return true;
	}

	function _analyzeFusedAssignment (context : AnalysisContext) : boolean {
		var lhsType = this._expr1.getType().resolveIfNullable();
		var rhsType = this._expr2.getType().resolveIfNullable();
		if (! this._expr1.assertIsAssignable(context, this._token, lhsType)) {
			return false;
		}
		if (this._token.getValue() == "+=" && lhsType.equals(Type.stringType) && rhsType.equals(Type.stringType))
			return true;
		if (Type.isIntegerOrNumber(lhsType) && Type.isIntegerOrNumber(rhsType))
			return true;
		context.errors.push(new CompileError(this._token, "cannot apply operator '" + this._token.getValue() + "' against '" + this._expr1.getType().toString() + "' and '" + this._expr2.getType().toString() + "'"));
		return false;
	}

	function _analyzeFunctionExpressionAssignment (context : AnalysisContext, parentExpr : Expression) : boolean {
		// analyze from left to right to avoid "variable may not be defined" error in case the function calls itself
		if (! this._expr1.analyze(context, this))
			return false;
		if (this._expr1.getType() == null) {
			if (! (this._expr2 as FunctionExpression).typesAreIdentified()) {
				context.errors.push(new CompileError(this._token, "either side of the operator should be fully type-qualified"));
				return false;
			}
		}
		else if (! this._expr1.getType().equals(Type.variantType)) {
			if (! (this._expr2 as FunctionExpression).deductTypeIfUnknown(context, this._expr1.getType() as ResolvedFunctionType)) {
				return false;
			}
		}
		if (! this._expr1.assertIsAssignable(context, this._token, this._expr2.getType()))
			return false;
		if (! this._expr2.analyze(context, this))
			return false;
		return true;
	}

	override function getType () : Type {
		return this._expr1.getType();
	}

}

// + - * / % < <= > >= & | ^
class BinaryNumberExpression extends BinaryExpression {

	function constructor (operatorToken : Token, expr1 : Expression, expr2 : Expression) {
		super(operatorToken, expr1, expr2);
	}

	override function clone () : BinaryNumberExpression {
		return new BinaryNumberExpression(this._token, this._expr1.clone(), this._expr2.clone());
	}

	override function analyze (context : AnalysisContext, parentExpr : Expression) : boolean {
		if (! this._analyze(context))
			return false;
		switch (this._token.getValue()) {
		case "<":
		case "<=":
		case ">":
		case ">=":
			if (this.isConvertibleTo(context, this._expr1, Type.numberType, true)) {
			  return this.assertIsConvertibleTo(context, this._expr2, Type.numberType, true);
			}
			if (this.isConvertibleTo(context, this._expr1, Type.stringType, true)) {
			  return this.assertIsConvertibleTo(context, this._expr2, Type.stringType, true);
			}
			context.errors.push(new CompileError(this._token, "cannot apply operator '" + this._token.getValue() + "' to type '" + this._expr1.getType().toString() + "'"));
			return false;
		default:
			var expr1Type = this._expr1.getType().resolveIfNullable();
			if (! this.assertIsConvertibleTo(context, this._expr1, Type.numberType, true))
				return false;
			var expr2Type = this._expr2.getType().resolveIfNullable();
			if (! this.assertIsConvertibleTo(context, this._expr2, Type.numberType, true))
				return false;
			return true;
		}
	}

	override function getType () : Type {
		switch (this._token.getValue()) {
		case "+":
		case "-":
		case "*":
			if (this._expr1.getType().resolveIfNullable().equals(Type.numberType) || this._expr2.getType().resolveIfNullable().equals(Type.numberType))
				return Type.numberType;
			else
				return Type.integerType;
		case "/":
		case "%":
			return Type.numberType;
		case "<":
		case "<=":
		case ">":
		case ">=":
			return Type.booleanType;
		case "&":
		case "|":
		case "^":
			return Type.integerType;
		default:
			throw new Error("unexpected operator:" + this._token.getValue());
		}
	}

}

class EqualityExpression extends BinaryExpression {

	function constructor (operatorToken : Token, expr1 : Expression, expr2 : Expression) {
		super(operatorToken, expr1, expr2);
	}

	override function clone () : EqualityExpression {
		return new EqualityExpression(this._token, this._expr1.clone(), this._expr2.clone());
	}

	override function analyze (context : AnalysisContext, parentExpr : Expression) : boolean {
		function bool (x : boolean) : number {
			return x ? 1 : 0;
		}

		if (! this._analyze(context))
			return false;
		var expr1Type = this._expr1.getType();
		var expr2Type = this._expr2.getType();
		if (expr1Type.resolveIfNullable().equals(expr2Type.resolveIfNullable())) {
			// ok
		} else if (expr1Type.isConvertibleTo(expr2Type) || expr2Type.isConvertibleTo(expr1Type)) {
			// ok
		} else if (bool(expr1Type instanceof ObjectType) + bool(expr2Type instanceof ObjectType) == 1
			&& expr1Type.getClassDef() == expr2Type.getClassDef()) {
			// ok, either side is an object and the other is the primitive counterpart
		} else {
			context.errors.push(new CompileError(this._token, "either side of operator == should be convertible from the other"));
			return false;
		}
		return true;
	}

	override function getType () : Type {
		return Type.booleanType;
	}

}

class InExpression extends BinaryExpression {

	function constructor (operatorToken : Token, expr1 : Expression, expr2 : Expression) {
		super(operatorToken, expr1, expr2);
	}

	override function clone () : InExpression {
		return new InExpression(this._token, this._expr1.clone(), this._expr2.clone());
	}

	override function analyze (context : AnalysisContext, parentExpr : Expression) : boolean {
		if (! this._analyze(context))
			return false;
		if (! this._expr1.getType().resolveIfNullable().equals(Type.stringType)) {
			context.errors.push(new CompileError(this._token, "left operand of 'in' expression should be a string"));
			return false;
		}
		var expr2Type;
		var expr2ClassDef;
		if ((expr2Type = this._expr2.getType().resolveIfNullable()) instanceof ObjectType
			&& (expr2ClassDef = expr2Type.getClassDef()) instanceof InstantiatedClassDefinition
			&& (expr2ClassDef as InstantiatedClassDefinition).getTemplateClassName() == "Map") {
			// ok
		} else {
			context.errors.push(new CompileError(this._token, "right operand of 'in' expression should be a map"));
			return false;
		}
		return true;
	}

	override function getType () : Type {
		return Type.booleanType;
	}

}

class LogicalExpression extends BinaryExpression {

	function constructor (operatorToken : Token, expr1 : Expression, expr2 : Expression) {
		super(operatorToken, expr1, expr2);
	}

	override function clone () : LogicalExpression {
		return new LogicalExpression(this._token, this._expr1.clone(), this._expr2.clone());
	}

	override function analyze (context : AnalysisContext, parentExpr : Expression) : boolean {
		if (! this._analyze(context))
			return false;
		if (this._expr1.getType().resolveIfNullable().equals(Type.voidType)) {
			context.errors.push(new CompileError(this._token, "left argument of operator '" + this._token.getValue() + "' cannot be void"));
			return false;
		}
		if (this._expr2.getType().resolveIfNullable().equals(Type.voidType)) {
			context.errors.push(new CompileError(this._token, "right argument of operator '" + this._token.getValue() + "' cannot be void"));
			return false;
		}
		return true;
	}

	override function getType () : Type {
		return Type.booleanType;
	}

}

class ShiftExpression extends BinaryExpression {

	function constructor (operatorToken : Token, expr1 : Expression, expr2 : Expression) {
		super(operatorToken, expr1, expr2);
	}

	override function clone () : ShiftExpression {
		return new ShiftExpression(this._token, this._expr1.clone(), this._expr2.clone());
	}

	override function analyze (context : AnalysisContext, parentExpr : Expression) : boolean {
		if (! this._analyze(context))
			return false;
		if (! this.assertIsConvertibleTo(context, this._expr1, Type.integerType, true))
			return false;
		if (! this.assertIsConvertibleTo(context, this._expr2, Type.integerType, true))
			return false;
		return true;
	}

	override function getType () : Type {
		return Type.integerType;
	}

}

// (the only) tertary expression

class ConditionalExpression extends OperatorExpression {

	var _condExpr : Expression;
	var _ifTrueExpr : Expression;
	var _ifFalseExpr : Expression;
	var _type : Type;

	function constructor (operatorToken : Token, condExpr : Expression, ifTrueExpr : Expression, ifFalseExpr : Expression) {
		this(operatorToken, condExpr, ifTrueExpr, ifFalseExpr, null);
	}

	function constructor (operatorToken : Token, condExpr : Expression, ifTrueExpr : Expression, ifFalseExpr : Expression, type : Type) {
		super(operatorToken);
		this._condExpr = condExpr;
		this._ifTrueExpr = ifTrueExpr;
		this._ifFalseExpr = ifFalseExpr;
		this._type = type != null ? type : null;
	}

	override function clone () : ConditionalExpression {
		return new ConditionalExpression(this._token, this._condExpr.clone(), this._ifTrueExpr != null ? this._ifTrueExpr.clone() : null, this._ifFalseExpr.clone(), this._type);
	}

	function getCondExpr () : Expression {
		return this._condExpr;
	}

	function setCondExpr (expr : Expression) : void {
		this._condExpr = expr;
	}

	function getIfTrueExpr () : Expression {
		return this._ifTrueExpr;
	}

	function getIfFalseExpr () : Expression {
		return this._ifFalseExpr;
	}

	override function serialize () : variant {
		return [
			"ConditionalExpression",
			this._token.serialize(),
			this._condExpr.serialize(),
			Serializer.<Expression>.serializeNullable(this._ifTrueExpr),
			this._ifFalseExpr.serialize()
		] : variant[];
	}

	override function analyze (context : AnalysisContext, parentExpr : Expression) : boolean {
		// analyze the three expressions
		if (! this._condExpr.analyze(context, this))
			return false;
		if (this._ifTrueExpr != null && ! this._ifTrueExpr.analyze(context, this))
			return false;
		if (! this._ifFalseExpr.analyze(context, this))
			return false;
		// check the types
		if (this._condExpr.getType().equals(Type.voidType)) {
			context.errors.push(new CompileError(this._token, "condition cannot be void"));
			return false;
		}
		if (this._ifTrueExpr != null) {
			var typeIfTrue = this._ifTrueExpr.getType();
		} else {
			typeIfTrue = this._condExpr.getType();
		}
		var typeIfFalse = this._ifFalseExpr.getType();
		this._type = Type.calcLeastCommonAncestor(typeIfTrue, typeIfFalse);
		if (this._type == null) {
			context.errors.push(new CompileError(this._token, "could not get the join type of '" + typeIfTrue.toString() + "' and '" + typeIfFalse.toString() + "'"));
			return false;
		}
		return true;
	}

	override function getType () : Type {
		return this._type;
	}

	override function forEachExpression (cb : function(:Expression,:function(:Expression):void):boolean) : boolean {
		if (! cb(this._condExpr, function (expr) { this._condExpr = expr; }))
			return false;
		if (this._ifTrueExpr != null && ! cb(this._ifTrueExpr, function (expr) { this._ifTrueExpr = expr; }))
			return false;
		if (! cb(this._ifFalseExpr, function (expr) { this._ifFalseExpr = expr; }))
			return false;
		return true;
	}

}

// invocation expressions

class CallExpression extends OperatorExpression {

	var _expr : Expression;
	var _args : Expression[];

	function constructor (token : Token, expr : Expression, args : Expression[]) {
		super(token);
		this._expr = expr;
		this._args = args;
	}

	function constructor (that : CallExpression) {
		// clone
		super(that);
		this._expr = that._expr.clone();
		this._args = Cloner.<Expression>.cloneArray(that._args);
	}

	override function clone () : CallExpression {
		return new CallExpression(this);
	}

	function getExpr () : Expression {
		return this._expr;
	}

	function setExpr (expr : Expression) : void {
		this._expr = expr;
	}

	function getArguments () : Expression[] {
		return this._args;
	}

	override function serialize () : variant {
		return [
			"CallExpression",
			this._token.serialize(),
			this._expr.serialize(),
			Serializer.<Expression>.serializeArray(this._args)
		] : variant[];
	}

	override function analyze (context : AnalysisContext, parentExpr : Expression) : boolean {
		if (! this._expr.analyze(context, this))
			return false;
		var exprType = this._expr.getType().resolveIfNullable();
		if (! (exprType instanceof FunctionType)) {
			context.errors.push(new CompileError(this._token, "cannot call a non-function"));
			return false;
		}
		var argTypes = Util.analyzeArgs(
			context, this._args, this,
			(exprType as FunctionType).getExpectedTypes(
				this._args.length,
				! (this._expr instanceof PropertyExpression && ! exprType.isAssignable() && ! ((this._expr as PropertyExpression).getExpr() instanceof ClassExpression))));
		if (argTypes == null)
			return false;
		if (this._expr instanceof PropertyExpression && ! exprType.isAssignable()) {
			var isCallingStatic = (this._expr as PropertyExpression).getExpr() instanceof ClassExpression;
			if (! isCallingStatic && (this._expr as PropertyExpression).getIdentifierToken().getValue() == "constructor") {
				context.errors.push(new CompileError(this._token, "cannot call a constructor other than by using 'new'"));
				return false;
			}
			if ((this._expr as PropertyExpression).deduceByArgumentTypes(context, this._token, argTypes, isCallingStatic) == null)
				return false;
		} else {
			if ((exprType as FunctionType).deduceByArgumentTypes(context, this._token, argTypes, true) == null)
				return false;
		}
		return true;
	}

	override function getType () : Type {
		var type = this._expr.getType();
		if (type == null)
			return null;
		return (type.resolveIfNullable() as ResolvedFunctionType).getReturnType();
	}

	override function forEachExpression (cb : function(:Expression,:function(:Expression):void):boolean) : boolean {
		if (! cb(this._expr, function (expr) { this._expr = expr; }))
			return false;
		if (! Util.forEachExpression(cb, this._args))
			return false;
		return true;
	}

}

class SuperExpression extends OperatorExpression {

	var _name : Token;
	var _args : Expression[];
	var _funcType : FunctionType;
	var _classDef : ClassDefinition;

	function constructor (token : Token, name : Token, args : Expression[]) {
		super(token);
		this._name = name;
		this._args = args;
		this._funcType = null;
	}

	function constructor (that : SuperExpression) {
		super(that);
		this._name = that._name;
		this._args = Cloner.<Expression>.cloneArray(that._args);
		this._funcType = that._funcType;
	}

	override function clone () : SuperExpression {
		return new SuperExpression(this);
	}

	function getName () : Token {
		return this._name;
	}

	function getArguments () : Expression[] {
		return this._args;
	}

	function getFunctionType () : FunctionType {
		return this._funcType;
	}

	override function serialize () : variant {
		return [
			"SuperExpression",
			this._token.serialize(),
			this._name.serialize(),
			Serializer.<Expression>.serializeArray(this._args),
			Serializer.<ClassDefinition>.serializeNullable(this._classDef)
		] : variant[];
	}

	override function analyze (context : AnalysisContext, parentExpr : Expression) : boolean {
		// obtain class definition
		if ((context.funcDef.flags() & ClassDefinition.IS_STATIC) != 0) {
			context.errors.push(new CompileError(this._token, "cannot use 'super' keyword in a static function"));
			return false;
		}
		var classDef = context.funcDef.getClassDef();
		// lookup function
		var funcType = null : FunctionType;
		if ((funcType = classDef.getMemberTypeByName(context.errors, this._token, this._name.getValue(), false, new Type[], ClassDefinition.GET_MEMBER_MODE_SUPER) as FunctionType) == null) {
			context.errors.push(new CompileError(this._token, "could not find a member function with given name in super classes of class '" + classDef.className() + "'"));
			return false;
		}
		// analyze args
		var argTypes = Util.analyzeArgs(
			context, this._args, this,
			funcType.getExpectedTypes(this._args.length, false));
		if (argTypes == null)
			return false;
		// deduce
		if ((funcType = funcType.deduceByArgumentTypes(context, this._token, argTypes, false)) == null)
			return false;
		// success
		this._funcType = funcType;
		return true;
	}

	override function getType () : Type {
		return (this._funcType as ResolvedFunctionType).getReturnType();
	}

	override function forEachExpression (cb : function(:Expression,:function(:Expression):void):boolean) : boolean {
		if (! Util.forEachExpression(cb, this._args))
			return false;
		return true;
	}

}

class NewExpression extends OperatorExpression {

	var _type : Type;
	var _args : Expression[];
	var _constructor : ResolvedFunctionType;

	function constructor (token : Token, type : Type, args : Expression[]) {
		super(token);
		this._type = type;
		this._args = args;
		this._constructor = null;
	}

	function constructor (that : NewExpression) {
		super(that);
		this._type = that._type;
		this._args = Cloner.<Expression>.cloneArray(that._args);
		this._constructor = that._constructor;
	}

	override function clone () : NewExpression {
		return new NewExpression(this);
	}

	function getQualifiedName () : QualifiedName {
		throw new Error("will be removed");
	}

	function getArguments () : Expression[] {
		return this._args;
	}

	override function serialize () : variant {
		return [
			"NewExpression",
			this._token.serialize(),
			this._type.serialize(),
			Serializer.<Expression>.serializeArray(this._args)
		] : variant[];
	}

	override function analyze (context : AnalysisContext, parentExpr : Expression) : boolean {
		// for instantiated code, check is necessary at this moment
		if (! (this._type instanceof ObjectType)) {
			context.errors.push(new CompileError(this._token, "cannot instantiate a non-object type: " + this._type.toString()));
			return false;
		}
		var classDef = this._type.getClassDef();
		if (classDef == null)
			return false;
		if ((classDef.flags() & (ClassDefinition.IS_INTERFACE | ClassDefinition.IS_MIXIN)) != 0) {
			context.errors.push(new CompileError(this._token, "cannot instantiate an interface or a mixin"));
			return false;
		}
		if ((classDef.flags() & ClassDefinition.IS_ABSTRACT) != 0) {
			context.errors.push(new CompileError(this._token, "cannot instantiate an abstract class"));
			return false;
		}
		var ctors = classDef.getMemberTypeByName(context.errors, this._token, "constructor", false, new Type[], ClassDefinition.GET_MEMBER_MODE_CLASS_ONLY) as FunctionType;
		if (ctors == null) {
			// classes will always have at least one constructor unless the default constructor is marked "delete"
			context.errors.push(new CompileError(this._token, "the class cannot be instantiated"));
			return false;
		}
		var argTypes = Util.analyzeArgs(
			context, this._args, this,
			ctors.getExpectedTypes(this._args.length, false));
		if (argTypes == null)
			return false;
		if ((this._constructor = ctors.deduceByArgumentTypes(context, this._token, argTypes, false)) == null) {
			context.errors.push(new CompileError(this._token, "cannot create an object of type '" + this._type.toString() + "', arguments mismatch"));
			return false;
		}
		return true;
	}

	override function getType () : Type {
		return this._type;
	}

	function setType (type : Type) : void {
		this._type = type;
	}

	function getConstructor () : ResolvedFunctionType {
		return this._constructor;
	}

	override function forEachExpression (cb : function(:Expression,:function(:Expression):void):boolean) : boolean {
		if (! Util.forEachExpression(cb, this._args))
			return false;
		return true;
	}

}

// comma expression is not treated as a binary expression (why? it should be)

class CommaExpression extends Expression {

	var _expr1 : Expression;
	var _expr2 : Expression;

	function constructor (token : Token, expr1 : Expression, expr2 : Expression) {
		super(token);
		assert expr1 != null;
		assert expr2 != null;
		this._expr1 = expr1;
		this._expr2 = expr2;
	}

	override function clone () : CommaExpression {
		return new CommaExpression(this._token, this._expr1.clone(), this._expr2.clone());
	}

	function getFirstExpr () : Expression {
		return this._expr1;
	}

	function getSecondExpr () : Expression {
		return this._expr2;
	}

	override function serialize () : variant {
		return [
			"CommaExpression",
			this._expr1.serialize(),
			this._expr2.serialize()
		] : variant[];
	}

	override function analyze (context : AnalysisContext, parentExpr : Expression) : boolean {
		return this._expr1.analyze(context, this)
			&& this._expr2.analyze(context, this);
	}

	override function getType () : Type {
		return this._expr2.getType();
	}

	override function forEachExpression (cb : function(:Expression,:function(:Expression):void):boolean) : boolean {
		if (! cb(this._expr1, function (expr) { this._expr1 = expr; }))
			return false;
		if (! cb(this._expr2, function (expr) { this._expr2 = expr; }))
			return false;
		return true;
	}

}
// vim: set noexpandtab:
