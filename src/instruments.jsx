/*
 * Copyright (c) 2012,2013 DeNA Co., Ltd. et al.
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

import "./compiler.jsx";
import "./analysis.jsx";
import "./classdef.jsx";
import "./expression.jsx";
import "./statement.jsx";
import "./parser.jsx";
import "./transformer.jsx";
import "./type.jsx";
import "./util.jsx";
import "./emitter.jsx";
import _Util from "./transformer.jsx";

abstract class _ExpressionTransformer {

	static var _expressionCountMap = new Map.<number>;

	var _transformer : CPSTransformCommand;
	var _id : number;

	function constructor (transformer : CPSTransformCommand, identifier : string) {
		this._transformer = transformer;

		if (_ExpressionTransformer._expressionCountMap[identifier] == null) {
			_ExpressionTransformer._expressionCountMap[identifier] = 0;
		}
		this._id = _ExpressionTransformer._expressionCountMap[identifier]++;
	}

	function getID () : number {
		return this._id;
	}

	abstract function getExpression () : Expression;

	abstract function doCPSTransform (parent : MemberFunctionDefinition, continuation : Expression, type : Type) : Expression;

}

abstract class _MultiaryOperatorTransformer extends _ExpressionTransformer {

	function constructor (transformer : CPSTransformCommand, identifier : string) {
		super(transformer, identifier);
	}

	final override function doCPSTransform (parent : MemberFunctionDefinition, continuation : Expression, returnType : Type) : Expression {
		if (continuation != null) {
			assert continuation.getType() instanceof ResolvedFunctionType;
			assert (continuation.getType() as ResolvedFunctionType).getReturnType().equals(returnType);
		}
		return this.transformOp(parent, continuation, this.getArgumentExprs(), returnType);
	}

	abstract function getArgumentExprs () : Expression[];

	function transformOp (parent : MemberFunctionDefinition, continuation : Expression, exprs : Expression[], returnType : Type) : Expression {
		if (exprs.length == 0) {
			return this._createContinuationCall(continuation, this.constructOp([]));
		}
		else {
			if (continuation != null) {
				assert continuation.getType() instanceof ResolvedFunctionType;
				assert (continuation.getType() as ResolvedFunctionType).getReturnType().equals(returnType);
			}

			// do cps-transformation against operands first; and then construct a new body to inject into the result
			var result = new Map.<variant>;
			this._transformArgs(parent, exprs, returnType, result);
			this._injectBody(
				result['newArgs'] as Expression[],
				result['topExpr'] as Expression,
				result['topFuncDef'] as MemberFunctionDefinition,
				result['botFuncDef'] as MemberFunctionDefinition,
				continuation);
			return result['topExpr'] as Expression;
		}
	}

	abstract function constructOp (exprs : Expression[]) : Expression;

	function _transformArgs (parent : MemberFunctionDefinition, exprs : Expression[], returnType : Type, result : Map.<variant>) : void {
		assert exprs.length > 0;

		var newArgs = new ArgumentDeclaration[];
		for (var i = 0; i < exprs.length; ++i) {
			newArgs.push(_Util._createFreshArgumentDeclaration(exprs[i].getType()));
		}
		var newArgLocals = new Expression[];
		for (var i = 0; i < exprs.length; ++i) {
			newArgLocals.push(new LocalExpression(exprs[i].getToken(), newArgs[i]));
		}

		var topExpr = null : Expression;
		var rootFuncDef = null : MemberFunctionDefinition;
		var prevFuncDef = parent;

		for (var i = 0; i < exprs.length; ++i) {
			var funcDef = _Util._createAnonymousFunction(prevFuncDef, this.getExpression().getToken(), [ newArgs[i] ], returnType);
			if (rootFuncDef == null) {
				rootFuncDef = funcDef;
			}
			var cont = new FunctionExpression(funcDef.getToken(), funcDef);
			var body = this._transformer._getExpressionTransformerFor(exprs[i]).doCPSTransform(prevFuncDef, cont, returnType);
			if (i == 0) {
				topExpr = body;
			} else  {
				prevFuncDef.getStatements().push(new ReturnStatement(new Token("return", false), body));
			}
			prevFuncDef = funcDef;
		}

		assert topExpr != null;
		assert rootFuncDef != null;
		assert prevFuncDef != parent;

		// small hack for source map
		topExpr._token = this.getExpression().getToken();

		result['newArgs'] = newArgLocals;
		result['topExpr'] = topExpr;
		result['topFuncDef'] = rootFuncDef;
		result['botFuncDef'] = prevFuncDef;
	}

	function _injectBody (args : Expression[], topExpr : Expression, topFuncDef : MemberFunctionDefinition, botFuncDef : MemberFunctionDefinition, continuation : Expression) : void {
		assert args.length > 0;

		var body = this._createContinuationCall(continuation, this.constructOp(args));
		botFuncDef._statements = [ new ReturnStatement(new Token("return", false), body) ] : Statement[];
		Util.rebaseClosures(topFuncDef, botFuncDef);
	}

	function _createContinuationCall (proc : Expression, arg : Expression) : Expression {
		if (proc == null) {
			return arg;
		} else {
			return new CallExpression(
				arg.getToken(),
				proc,
				[ arg ] : Expression[]
			);
		}
	}

}

class _LeafExpressionTransformer extends _MultiaryOperatorTransformer {

	var _expr : LeafExpression;

	function constructor (transformer : CPSTransformCommand, expr : LeafExpression) {
		super(transformer, "LEAF");
		this._expr = expr;
	}

	override function getExpression () : Expression {
		return this._expr;
	}

	override function getArgumentExprs () : Expression[] {
		return new Expression[];
	}

	override function constructOp (exprs : Expression[]) : Expression {
		assert exprs.length == 0;
		return this._expr;
	}

}

class _ArrayLiteralExpressionTransformer extends _MultiaryOperatorTransformer {

	var _expr : ArrayLiteralExpression;

	function constructor (transformer : CPSTransformCommand, expr : ArrayLiteralExpression) {
		super(transformer, "ARRAY-LITERAL");
		this._expr = expr;
	}

	override function getExpression () : Expression {
		return this._expr;
	}

	override function getArgumentExprs () : Expression[] {
		return this._expr.getExprs();
	}

	override function constructOp (exprs : Expression[]) : Expression {
		var arrayLiteralExpr = this._expr.clone();
		arrayLiteralExpr._exprs = exprs;
		return arrayLiteralExpr;
	}

}

class _MapLiteralExpressionTransformer extends _MultiaryOperatorTransformer {

	var _expr : MapLiteralExpression;

	function constructor (transformer : CPSTransformCommand, expr : MapLiteralExpression) {
		super(transformer, "MAP-LITERAL");
		this._expr = expr;
	}

	override function getExpression () : Expression {
		return this._expr;
	}

	override function getArgumentExprs () : Expression[] {
		return this._expr.getElements().map((elt) -> elt.getExpr());
	}

	override function constructOp (exprs : Expression[]) : Expression {
		var elts = new MapLiteralElement[];
		for (var i = 0; i < this._expr.getElements().length; ++i) {
			var elt = this._expr.getElements()[i];
			elts[i] = new MapLiteralElement(elt.getKey(), exprs[i]);
		}
		return new MapLiteralExpression(this._expr.getToken(), elts, this._expr.getType());
	}

}

class _FunctionExpressionTransformer extends _MultiaryOperatorTransformer {

	var _expr : FunctionExpression;

	function constructor (transformer : CPSTransformCommand, expr : FunctionExpression) {
		super(transformer, "FUNCTION");
		this._expr = expr;
	}

	override function getExpression () : Expression {
		return this._expr;
	}

	override function getArgumentExprs () : Expression[] {
		return new Expression[];
	}

	override function constructOp (exprs : Expression[]) : Expression {
		assert exprs.length == 0;
		return this._expr;
	}

}

abstract class _UnaryExpressionTransformer extends _MultiaryOperatorTransformer {

	var _expr : UnaryExpression;

	function constructor (transformer : CPSTransformCommand, expr : UnaryExpression) {
		super(transformer, "UNARY");
		this._expr = expr;
	}

	override function getExpression () : Expression {
		return this._expr;
	}

	override function getArgumentExprs () : Expression[] {
		return [ this._expr.getExpr() ];
	}

	override function constructOp (exprs : Expression[]) : Expression {
		assert exprs.length == 1;

		/*
		  op(v) | C

		  v | function ($v) { return C(op($v)); }
		*/

		return this._clone(exprs[0]);
	}

	abstract function _clone (arg : Expression) : UnaryExpression;

}

class _BitwiseNotExpressionTransformer extends _UnaryExpressionTransformer {

	function constructor (transformer : CPSTransformCommand, expr : BitwiseNotExpression) {
		super(transformer, expr);
	}

	override function _clone (arg : Expression) : UnaryExpression {
		return new BitwiseNotExpression(this._expr.getToken(), arg);
	}

}

class _InstanceofExpressionTransformer extends _UnaryExpressionTransformer {

	function constructor (transformer : CPSTransformCommand, expr : InstanceofExpression) {
		super(transformer, expr);
	}

	override function _clone (arg : Expression) : UnaryExpression {
		return new InstanceofExpression(this._expr.getToken(), arg, (this._expr as InstanceofExpression).getExpectedType());
	}

}

class _AsExpressionTransformer extends _UnaryExpressionTransformer {

	function constructor (transformer : CPSTransformCommand, expr : AsExpression) {
		super(transformer, expr);
	}

	override function _clone (arg : Expression) : UnaryExpression {
		return new AsExpression(this._expr.getToken(), arg, this._expr.getType());
	}

}

class _AsNoConvertExpressionTransformer extends _UnaryExpressionTransformer {

	function constructor (transformer : CPSTransformCommand, expr : AsNoConvertExpression) {
		super(transformer, expr);
	}

	override function _clone (arg : Expression) : UnaryExpression {
		return new AsNoConvertExpression(this._expr.getToken(), arg, this._expr.getType());
	}

}

class _LogicalNotExpressionTransformer extends _UnaryExpressionTransformer {

	function constructor (transformer : CPSTransformCommand, expr : LogicalNotExpression) {
		super(transformer, expr);
	}

	override function _clone (arg : Expression) : UnaryExpression {
		return new LogicalNotExpression(this._expr.getToken(), arg);
	}

}

abstract class _IncrementExpressionTransformer extends _UnaryExpressionTransformer {

	function constructor (transformer : CPSTransformCommand, expr : IncrementExpression) {
		super(transformer, expr);
	}

	override function getArgumentExprs () : Expression[] {
		// expr must be of any of type 'local', 'property', and 'array'

		var expr = this._expr.getExpr();
		if (expr instanceof LocalExpression || (expr instanceof PropertyExpression && (expr as PropertyExpression).getExpr().isClassSpecifier())) {
			/*
			  local_or_classvar++ | C

			  C(local_or_classvar++)
			*/

			return new Expression[];
		} else if (expr instanceof PropertyExpression) {
			/*
			  E.prop++ | C

			  E | function ($1) { return C($1.prop++); }
			*/

			return [ (expr as PropertyExpression).getExpr() ];
		} else if (expr instanceof ArrayExpression) {
			/*
			  E1[E2]++ | C

			  E1 | function ($1) { return E2 | function ($2) { return C($1[$2]++); }; }
			*/
			var arrayExpr = expr as ArrayExpression;
			return [ arrayExpr.getFirstExpr(), arrayExpr.getSecondExpr() ];
		} else {
			throw new Error("logic flaw");
		}
	}

	override function constructOp (exprs : Expression[]) : Expression {
		var expr = this._expr.getExpr();
		if (expr instanceof PropertyExpression) {
			assert exprs.length == 1;
			var propertyExpr = (expr as PropertyExpression).clone();
			propertyExpr._expr = exprs[0];
			return this._clone(propertyExpr);
		} else if (expr instanceof ArrayExpression) {
			assert exprs.length == 2;
			var arrayExpr = new ArrayExpression(expr.getToken(), exprs[0], exprs[1]);
			arrayExpr._type = expr.getType();
			return this._clone(arrayExpr);
		} else {
			assert exprs.length == 0;
			return this._expr;
		}
	}

}

class _PostIncrementExpressionTransformer extends _IncrementExpressionTransformer {

	function constructor (transformer : CPSTransformCommand, expr : IncrementExpression) {
		super(transformer, expr);
	}

	override function _clone (arg : Expression) : UnaryExpression {
		return new PostIncrementExpression(this._expr.getToken(), arg);
	}

}

class _PreIncrementExpressionTransformer extends _IncrementExpressionTransformer {

	function constructor (transformer : CPSTransformCommand, expr : IncrementExpression) {
		super(transformer, expr);
	}

	override function _clone (arg : Expression) : UnaryExpression {
		return new PreIncrementExpression(this._expr.getToken(), arg);
	}

}

class _PropertyExpressionTransformer extends _MultiaryOperatorTransformer {

	var _expr : PropertyExpression;

	function constructor (transformer : CPSTransformCommand, expr : PropertyExpression) {
		super(transformer, "PROPERTY");
		this._expr = expr;
	}

	override function getExpression () : PropertyExpression {
		return this._expr;
	}

	override function getArgumentExprs () : Expression[] {
		// member method
		if (this._expr.getType() instanceof MemberFunctionType) {
			throw new Error("logic flaw");
		}
		// static member
		if (this._expr.getExpr().isClassSpecifier()) {
			return new Expression[];
		} else {
			return [ this._expr.getExpr() ];
		}
	}

	override function constructOp (exprs : Expression[]) : Expression {
		// static member
		if (this._expr.getExpr().isClassSpecifier()) {
			assert exprs.length == 0;
			return this._expr;
		} else {
			assert exprs.length == 1;
			var propExpr = new PropertyExpression(this._expr.getToken(), exprs[0], (this._expr as PropertyExpression).getIdentifierToken(), (this._expr as PropertyExpression).getTypeArguments(), this._expr.getType());
			propExpr._isInner = (this._expr as PropertyExpression)._isInner;
			return propExpr;
		}
	}

}

class _TypeofExpressionTransformer extends _UnaryExpressionTransformer {

	function constructor (transformer : CPSTransformCommand, expr : TypeofExpression) {
		super(transformer, expr);
	}

	override function _clone (arg : Expression) : UnaryExpression {
		return new TypeofExpression(this._expr.getToken(), arg);
	}

}

class _SignExpressionTransformer extends _UnaryExpressionTransformer {

	function constructor (transformer : CPSTransformCommand, expr : SignExpression) {
		super(transformer, expr);
	}

	override function _clone (arg : Expression) : UnaryExpression {
		return new SignExpression(this._expr.getToken(), arg);
	}

}

class _YieldExpressionTransformer extends _UnaryExpressionTransformer {

	function constructor (transformer : CPSTransformCommand, expr : YieldExpression) {
		super(transformer, expr);
	}

	override function _clone (arg : Expression) : UnaryExpression {
		return new YieldExpression(this._expr.getToken(), arg, (this._expr as YieldExpression).getSeedType(), (this._expr as YieldExpression).getGenType());
	}

}

abstract class _BinaryExpressionTransformer extends _MultiaryOperatorTransformer {

	var _expr : BinaryExpression;

	function constructor (transformer : CPSTransformCommand, expr : BinaryExpression) {
		super(transformer, "BINARY");
		this._expr = expr;
	}

	override function getExpression () : Expression {
		return this._expr;
	}

	override function getArgumentExprs () : Expression[] {
		return [ this._expr.getFirstExpr(), this._expr.getSecondExpr() ];
	}

	override function constructOp (exprs : Expression[]) : Expression {
		assert exprs.length == 2;
		/*
		  op(E1,E2) | C

		  E1 | function ($1) { return E2 | function ($2) { return C(op($1,$2); }; }
		                                   ^^^^^^^^^^^^^^^^cont2^^^^^^^^^^^^^^^^
		       ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^cont1^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
		*/

		return this._clone(exprs[0], exprs[1]);
	}

	abstract function _clone (arg1 : Expression, arg2 : Expression) : BinaryExpression;

}

class _AdditiveExpressionTransformer extends _BinaryExpressionTransformer {

	function constructor (transformer : CPSTransformCommand, expr : AdditiveExpression) {
		super(transformer, expr);
	}

	override function _clone (arg1 : Expression, arg2 : Expression) : BinaryExpression {
		var ret = new AdditiveExpression(this._expr.getToken(), arg1, arg2);
		ret._type = (this._expr as AdditiveExpression)._type;
		return ret;
	}

}

class _ArrayExpressionTransformer extends _BinaryExpressionTransformer {

	function constructor (transformer : CPSTransformCommand, expr : ArrayExpression) {
		super(transformer, expr);
	}

	override function _clone (arg1 : Expression, arg2 : Expression) : BinaryExpression {
		var aryExpr = new ArrayExpression(this._expr.getToken(), arg1, arg2);
		aryExpr._type = (this._expr as ArrayExpression)._type;
		return aryExpr;
	}

}

class _AssignmentExpressionTransformer extends _MultiaryOperatorTransformer {

	var _expr : AssignmentExpression;

	function constructor (transformer : CPSTransformCommand, expr : AssignmentExpression) {
		super(transformer, "ASSIGNMENT");
		this._expr = expr;
	}

	override function getExpression () : Expression {
		return this._expr;
	}

	override function getArgumentExprs () : Expression[] {
		// LHS expr must be of any of type 'local', 'property', and 'array'

		var lhsExpr = this._expr.getFirstExpr();
		if (lhsExpr instanceof LocalExpression || (lhsExpr instanceof PropertyExpression && (lhsExpr as PropertyExpression).getExpr().isClassSpecifier())) {
			/*
			  local_or_classvar = E | C

			  E | function ($1) { return C(local_or_classvar = $1); }
			*/
			return [ this._expr.getSecondExpr() ];
		} else if (lhsExpr instanceof PropertyExpression) {
			/*
			  E1.prop = E2 | C

			  E1 | function ($1) { return E2 | function ($2) { return C($1.prop = $2); }; }
			*/
			return [ (this._expr.getFirstExpr() as PropertyExpression).getExpr(), this._expr.getSecondExpr() ];
		} else if (lhsExpr instanceof ArrayExpression) {
			/*
			  E1[E2] = E3 | C

			  E1 | function ($1) { return E2 | function ($2) { return E3 | function ($3) { return C($1[$2] = $3); }; }; }
			*/
			var arrayExpr = this._expr.getFirstExpr() as ArrayExpression;
			return [ arrayExpr.getFirstExpr(), arrayExpr.getSecondExpr(), this._expr.getSecondExpr() ];
		} else {
			throw new Error("logic flaw");
		}
	}

	override function constructOp (exprs : Expression[]) : Expression {
		var lhsExpr = this._expr.getFirstExpr();
		if (lhsExpr instanceof LocalExpression || (lhsExpr instanceof PropertyExpression && (lhsExpr as PropertyExpression).getExpr().isClassSpecifier())) {
			assert exprs.length == 1;
			return this._constructSimpleAssignment(exprs[0]);
		} else if (lhsExpr instanceof PropertyExpression) {
			assert exprs.length == 2;
			return this._constructPropertyAssignment(exprs[0], exprs[1]);
		} else if (lhsExpr instanceof ArrayExpression) {
			assert exprs.length == 3;
			return this._constructArrayAssignment(exprs[0], exprs[1], exprs[2]);
		} else {
			throw new Error("logic flaw");
		}
	}

	function _constructSimpleAssignment (expr : Expression) : Expression {
		return new AssignmentExpression(this._expr.getToken(), this._expr.getFirstExpr(), expr);
	}

	function _constructPropertyAssignment (expr1 : Expression, expr2 : Expression) : Expression {
		var propertyExpr = (this._expr.getFirstExpr() as PropertyExpression).clone();
		propertyExpr._expr = expr1;
		return new AssignmentExpression(this._expr.getToken(), propertyExpr, expr2);
	}

	function _constructArrayAssignment (receiver : Expression, key : Expression, value : Expression) : Expression {
		var arrayExpr = new ArrayExpression(this._expr.getFirstExpr().getToken(), receiver, key);
		arrayExpr._type = this._expr.getFirstExpr().getType();
		return new AssignmentExpression(this._expr.getToken(), arrayExpr, value);
	}

}

class _FusedAssignmentExpressionTransformer extends _MultiaryOperatorTransformer {

	var _expr : FusedAssignmentExpression;

	function constructor (transformer : CPSTransformCommand, expr : FusedAssignmentExpression) {
		super(transformer, "FUSED-ASSIGNMENT");
		this._expr = expr;
	}

	override function getExpression () : Expression {
		return this._expr;
	}

	override function getArgumentExprs () : Expression[] {
		// LHS expr must be of any of type 'local', 'property', and 'array'

		var lhsExpr = this._expr.getFirstExpr();
		if (lhsExpr instanceof LocalExpression || (lhsExpr instanceof PropertyExpression && (lhsExpr as PropertyExpression).getExpr().isClassSpecifier())) {
			/*
			  local_or_classvar = E | C

			  E | function ($1) { return C(local_or_classvar = $1); }
			*/
			return [ this._expr.getSecondExpr() ];
		} else if (lhsExpr instanceof PropertyExpression) {
			/*
			  E1.prop = E2 | C

			  E1 | function ($1) { return E2 | function ($2) { return C($1.prop = $2); }; }
			*/
			return [ (this._expr.getFirstExpr() as PropertyExpression).getExpr(), this._expr.getSecondExpr() ];
		} else if (lhsExpr instanceof ArrayExpression) {
			/*
			  E1[E2] = E3 | C

			  E1 | function ($1) { return E2 | function ($2) { return E3 | function ($3) { return C($1[$2] = $3); }; }; }
			*/
			var arrayExpr = this._expr.getFirstExpr() as ArrayExpression;
			return [ arrayExpr.getFirstExpr(), arrayExpr.getSecondExpr(), this._expr.getSecondExpr() ];
		} else {
			throw new Error("logic flaw");
		}
	}

	override function constructOp (exprs : Expression[]) : Expression {
		var lhsExpr = this._expr.getFirstExpr();
		if (lhsExpr instanceof LocalExpression || (lhsExpr instanceof PropertyExpression && (lhsExpr as PropertyExpression).getExpr().isClassSpecifier())) {
			assert exprs.length == 1;
			return this._constructSimpleAssignment(exprs[0]);
		} else if (lhsExpr instanceof PropertyExpression) {
			assert exprs.length == 2;
			return this._constructPropertyAssignment(exprs[0], exprs[1]);
		} else if (lhsExpr instanceof ArrayExpression) {
			assert exprs.length == 3;
			return this._constructArrayAssignment(exprs[0], exprs[1], exprs[2]);
		} else {
			throw new Error("logic flaw");
		}
	}

	function _constructSimpleAssignment (expr : Expression) : Expression {
		return new FusedAssignmentExpression(this._expr.getToken(), this._expr.getFirstExpr(), expr);
	}

	function _constructPropertyAssignment (expr1 : Expression, expr2 : Expression) : Expression {
		var propertyExpr = (this._expr.getFirstExpr() as PropertyExpression).clone();
		propertyExpr._expr = expr1;
		return new FusedAssignmentExpression(this._expr.getToken(), propertyExpr, expr2);
	}

	function _constructArrayAssignment (receiver : Expression, key : Expression, value : Expression) : Expression {
		var arrayExpr = new ArrayExpression(this._expr.getFirstExpr().getToken(), receiver, key);
		arrayExpr._type = this._expr.getFirstExpr().getType();
		return new FusedAssignmentExpression(this._expr.getToken(), arrayExpr, value);
	}

}

class _BinaryNumberExpressionTransformer extends _BinaryExpressionTransformer {

	function constructor (transformer : CPSTransformCommand, expr : BinaryNumberExpression) {
		super(transformer, expr);
	}

	override function _clone (arg1 : Expression, arg2 : Expression) : BinaryExpression {
		return new BinaryNumberExpression(this._expr.getToken(), arg1, arg2);
	}

}

class _EqualityExpressionTransformer extends _BinaryExpressionTransformer {

	function constructor (transformer : CPSTransformCommand, expr : EqualityExpression) {
		super(transformer, expr);
	}

	override function _clone (arg1 : Expression, arg2 : Expression) : BinaryExpression {
		return new EqualityExpression(this._expr.getToken(), arg1, arg2);
	}

}

class _InExpressionTransformer extends _BinaryExpressionTransformer {

	function constructor (transformer : CPSTransformCommand, expr : InExpression) {
		super(transformer, expr);
	}

	override function _clone (arg1 : Expression, arg2 : Expression) : BinaryExpression {
		return new InExpression(this._expr.getToken(), arg1, arg2);
	}

}

class _LogicalExpressionTransformer extends _ExpressionTransformer {

	var _expr : LogicalExpression;

	function constructor (transformer : CPSTransformCommand, expr : LogicalExpression) {
		super(transformer, "LOGICAL");
		this._expr = expr;
	}

	override function getExpression () : Expression {
		return this._expr;
	}

	override function doCPSTransform (parent : MemberFunctionDefinition, continuation : Expression, returnType : Type) : Expression {
		/*

a && b | C

a | function ($a) { var $C = C; return $a ? (b as boolean) | $C : ($a as boolean) | $C; }

---

a || b | C

a | function ($a) { var $C = C; return $a ? ($a as boolean) | $C : (b as boolean) | $C; }

		*/

		if (continuation != null) {
			assert continuation.getType() instanceof ResolvedFunctionType;
			assert (continuation.getType() as ResolvedFunctionType).getReturnType().equals(returnType);
		}

		var argVar = _Util._createFreshArgumentDeclaration(this._expr.getFirstExpr().getType());
		var contFuncDef = _Util._createAnonymousFunction(parent, null, [ argVar ], returnType);

		// `var $C = C;`
		var contVar : LocalVariable = null;
		if (continuation != null) {
			contVar = _Util._createFreshLocalVariable(continuation.getType());
			contFuncDef.getLocals().push(contVar);

			var condStmt = new ExpressionStatement(
				new AssignmentExpression(
					new Token("=", false),
					new LocalExpression(contVar.getName(), contVar),
					continuation
				)
			);
			contFuncDef.getStatements().push(condStmt);
		}

		var ifTrueExpr : Expression;
		var ifFalseExpr : Expression;
		if (this._expr.getToken().getValue() == "&&") {
			ifTrueExpr = this._expr.getSecondExpr();
			ifFalseExpr = new LocalExpression(argVar.getName(), argVar);
		} else {	// "||"
			ifTrueExpr = new LocalExpression(argVar.getName(), argVar);
			ifFalseExpr = this._expr.getSecondExpr();
		}
		// booleanize the results
		if (ifTrueExpr.getType().resolveIfNullable() instanceof PrimitiveType) {
			ifTrueExpr = new AsExpression(new Token("as", false), ifTrueExpr, Type.booleanType);
		} else {
			// booleanize with double `!` operations because `obj as boolean` is not allowed
			ifTrueExpr = new LogicalNotExpression(new Token("!", false), new LogicalNotExpression(new Token("!", false), ifTrueExpr));
		}
		if (ifFalseExpr.getType().resolveIfNullable() instanceof PrimitiveType) {
			ifFalseExpr = new AsExpression(new Token("as", false), ifFalseExpr, Type.booleanType);
		} else {
			ifFalseExpr = new LogicalNotExpression(new Token("!", false), new LogicalNotExpression(new Token("!", false), ifFalseExpr));
		}

		var ifTrueCont : Expression = null;
		var ifFalseCont : Expression = null;
		if (continuation != null) {
			ifTrueCont = new LocalExpression(contVar.getName(), contVar);
			ifFalseCont = new LocalExpression(contVar.getName(), contVar);
		}

		// `return $a ? b | $C : c | $C;`
		var condExpr = new ConditionalExpression(
			this._expr.getToken(),
			new LocalExpression(argVar.getName(), argVar),
			this._transformer._getExpressionTransformerFor(ifTrueExpr).doCPSTransform(contFuncDef, ifTrueCont, returnType),
			this._transformer._getExpressionTransformerFor(ifFalseExpr).doCPSTransform(contFuncDef, ifFalseCont, returnType)
		);
		condExpr._type = returnType;
		var returnStmt = new ReturnStatement(
			new Token("return", false),
			condExpr
		);

		contFuncDef.getStatements().push(returnStmt);

		Util.rebaseClosures(parent, contFuncDef);

		var cont = new FunctionExpression(contFuncDef.getToken(), contFuncDef);
		return this._transformer._getExpressionTransformerFor(this._expr.getFirstExpr()).doCPSTransform(parent, cont, returnType);
	}

}

class _ShiftExpressionTransformer extends _BinaryExpressionTransformer {

	function constructor (transformer : CPSTransformCommand, expr : ShiftExpression) {
		super(transformer, expr);
	}

	override function _clone (arg1 : Expression, arg2 : Expression) : BinaryExpression {
		return new ShiftExpression(this._expr.getToken(), arg1, arg2);
	}

}

class _ConditionalExpressionTransformer extends _ExpressionTransformer {

	var _expr : ConditionalExpression;

	function constructor (transformer : CPSTransformCommand, expr : ConditionalExpression) {
		super(transformer, "CONDITIONAL");
		this._expr = expr;
	}

	override function getExpression () : Expression {
		return this._expr;
	}

	override function doCPSTransform (parent : MemberFunctionDefinition, continuation : Expression, returnType : Type) : Expression {
		/*

a ? b : c | C

a | function ($a) { var $C = C; return $a ? b | $C : c | $C; }

		*/

		if (continuation != null) {
			assert continuation.getType() instanceof ResolvedFunctionType;
			assert (continuation.getType() as ResolvedFunctionType).getReturnType().equals(returnType);
		}

		var argVar = _Util._createFreshArgumentDeclaration(this._expr.getCondExpr().getType());

		var contFuncDef = _Util._createAnonymousFunction(parent, null, [ argVar ], returnType);

		// `var $C = C;`
		var contVar : LocalVariable = null;
		if (continuation != null) {
			contVar = _Util._createFreshLocalVariable(continuation.getType());
			contFuncDef.getLocals().push(contVar);

			var condStmt = new ExpressionStatement(
				new AssignmentExpression(
					new Token("=", false),
					new LocalExpression(contVar.getName(), contVar),
					continuation
				)
			);
			contFuncDef.getStatements().push(condStmt);
		}

		var ifTrueExpr = this._expr.getIfTrueExpr();
		if (ifTrueExpr == null) {
			ifTrueExpr = new LocalExpression(argVar.getName(), argVar);
		}
		var ifFalseExpr = this._expr.getIfFalseExpr();

		var ifTrueCont : Expression = null;
		var ifFalseCont : Expression = null;
		if (continuation != null) {
			ifTrueCont = new LocalExpression(contVar.getName(), contVar);
			ifFalseCont = new LocalExpression(contVar.getName(), contVar);
		}

		// `return $a ? b | $C : c | $C;`
		var condExpr = new ConditionalExpression(
			this._expr.getToken(),
			new LocalExpression(argVar.getName(), argVar),
			this._transformer._getExpressionTransformerFor(ifTrueExpr).doCPSTransform(contFuncDef, ifTrueCont, returnType),
			this._transformer._getExpressionTransformerFor(ifFalseExpr).doCPSTransform(contFuncDef, ifFalseCont, returnType)
		);
		condExpr._type = returnType;
		var returnStmt = new ReturnStatement(
			new Token("return", false),
			condExpr
		);

		contFuncDef.getStatements().push(returnStmt);

		Util.rebaseClosures(parent, contFuncDef);

		var cont = new FunctionExpression(contFuncDef.getToken(), contFuncDef);
		return this._transformer._getExpressionTransformerFor(this._expr.getCondExpr()).doCPSTransform(parent, cont, returnType);
	}

}

class _CallExpressionTransformer extends _MultiaryOperatorTransformer {

	var _expr : CallExpression;

	function constructor (transformer : CPSTransformCommand, expr : CallExpression) {
		super(transformer, "CALL");
		this._expr = expr;
	}

	override function getExpression () : Expression {
		return this._expr;
	}

	function _isMethodCall () : boolean {
		if (this._expr.getExpr() instanceof PropertyExpression) {
			var propertyExpr = this._expr.getExpr() as PropertyExpression;
			if (propertyExpr.getType() instanceof MemberFunctionType) {
				return true;
			}
		}
		return false;
	}

	override function getArgumentExprs () : Expression[] {
		// method calls considered primitive operation
		if (this._isMethodCall()) {
			// method calls
			var receiver = (this._expr.getExpr() as PropertyExpression).getExpr();
			return [ receiver ].concat(this._expr.getArguments());
		} else if (this._transformer._compiler.getEmitter().isSpecialCall(this._expr)) {
			return this._expr.getArguments().concat([]);
		} else {
			return [ this._expr.getExpr() ].concat(this._expr.getArguments());
		}
	}

	override function constructOp (exprs : Expression[]) : Expression {
		if (this._isMethodCall()) {
			var propertyExpr = this._expr.getExpr() as PropertyExpression;
			return new CallExpression(
				new Token("(", false),
				new PropertyExpression(propertyExpr.getToken(), exprs[0], propertyExpr.getIdentifierToken(), propertyExpr.getTypeArguments(), propertyExpr.getType()),
				exprs.slice(1));
		} else if (this._transformer._compiler.getEmitter().isSpecialCall(this._expr)) {
			return new CallExpression(new Token("(", false), this._expr.getExpr(), exprs);
		} else {
			return new CallExpression(new Token("(", false), exprs[0], exprs.slice(1));
		}
	}

}

class _SuperExpressionTransformer extends _MultiaryOperatorTransformer {

	var _expr : SuperExpression;

	function constructor (transformer : CPSTransformCommand, expr : SuperExpression) {
		super(transformer, "SUPER");
		this._expr = expr;
	}

	override function getExpression () : Expression {
		return this._expr;
	}

	override function getArgumentExprs () : Expression[] {
		return this._expr.getArguments();
	}

	override function constructOp (exprs : Expression[]) : Expression {
		var superExpr = new SuperExpression(this._expr);
		superExpr._args = exprs;
		return superExpr;
	}

}

class _NewExpressionTransformer extends _MultiaryOperatorTransformer {

	var _expr : NewExpression;

	function constructor (transformer : CPSTransformCommand, expr : NewExpression) {
		super(transformer, "NEW");
		this._expr = expr;
	}

	override function getExpression () : Expression {
		return this._expr;
	}

	override function getArgumentExprs () : Expression[] {
		return this._expr.getArguments();
	}

	override function constructOp (exprs : Expression[]) : Expression {
		var newExpr = new NewExpression(this._expr);
		newExpr._args = exprs;
		return newExpr;
	}

}

class _CommaExpressionTransformer extends _MultiaryOperatorTransformer {

	var _expr : CommaExpression;

	function constructor (transformer : CPSTransformCommand, expr : CommaExpression) {
		super(transformer, "COMMA");
		this._expr = expr;
	}

	override function getExpression () : Expression {
		return this._expr;
	}

	override function getArgumentExprs () : Expression[] {
		return [ this._expr.getFirstExpr(), this._expr.getSecondExpr() ];
	}

	override function constructOp (exprs : Expression[]) : Expression {
		assert exprs.length == 2;
		return new CommaExpression(this._expr.getToken(), exprs[0], exprs[1]);
	}

}

abstract class _StatementTransformer {

	static var _statementCountMap = new Map.<number>;

	var _transformer : CPSTransformCommand;
	var _id : number;

	function constructor (transformer : CPSTransformCommand, identifier : string) {
		this._transformer = transformer;

		if (_StatementTransformer._statementCountMap[identifier] == null) {
			_StatementTransformer._statementCountMap[identifier] = 0;
		}
		this._id = _StatementTransformer._statementCountMap[identifier]++;
	}

	function getID () : number {
		return this._id;
	}

	abstract function getStatement () : Statement;

	function replaceControlStructuresWithGotos () : void {
		if (this._transformer._transformExprs) {
			var funcDef = CPSTransformCommand._extractVM(this._transformer._getTransformingFuncDef());
			this.getStatement().forEachExpression(function (expr, replaceCb) {
				var id = _Util._createIdentityFunction(funcDef, expr.getType());
				var expr;
				if ((expr = this._transformer._getExpressionTransformerFor(expr).doCPSTransform(funcDef, id, expr.getType())) == null) {
					throw new Error("fatal error in expression transformation");
				}
				replaceCb(expr);
				return true;
			});
		}
		this._replaceControlStructuresWithGotos();
	}

	abstract function _replaceControlStructuresWithGotos () : void;

}

class _ConstructorInvocationStatementTransformer extends _StatementTransformer {

	var _statement : ConstructorInvocationStatement;

	function constructor (transformer : CPSTransformCommand, statement : ConstructorInvocationStatement) {
		super(transformer, "CONSTRUCTOR-INVOCATION");
		this._statement = statement;
	}

	override function getStatement () : Statement {
		return this._statement;
	}

	override function _replaceControlStructuresWithGotos () : void {
		this._transformer._emit(this._statement);
	}

}

class _ExpressionStatementTransformer extends _StatementTransformer {

	var _statement : ExpressionStatement;

	function constructor (transformer : CPSTransformCommand, statement : ExpressionStatement) {
		super(transformer, "EXPRESSION");
		this._statement = statement;
	}

	override function getStatement () : Statement {
		return this._statement;
	}

	override function _replaceControlStructuresWithGotos () : void {
		this._transformer._emit(this._statement);
	}

}

class _FunctionStatementTransformer extends _StatementTransformer {

	var _statement : FunctionStatement;

	function constructor (transformer : CPSTransformCommand, statement : FunctionStatement) {
		super(transformer, "FUNCTION");
		this._statement = statement;
	}

	override function getStatement () : Statement {
		return this._statement;
	}

	override function _replaceControlStructuresWithGotos () : void {
		// convert to a combination of a FunctionExpression and an assignment in order to make the function visible from outside wrapping statement block
		var funcDef = this._statement.getFuncDef();
		var statement = new ExpressionStatement(
			new AssignmentExpression(
				new Token("=", false),
				new LocalExpression(funcDef.getFuncLocal().getName(), funcDef.getFuncLocal()),
				new FunctionExpression(this._statement.getToken(), funcDef)));
		funcDef.setFuncLocal(null); // `foo = function foo () { ... }` causes some kind of problems during minification
		this._transformer._emit(statement);
	}

}

class _ReturnStatementTransformer extends _StatementTransformer {

	var _statement : ReturnStatement;

	function constructor (transformer : CPSTransformCommand, statement : ReturnStatement) {
		super(transformer, "RETURN");
		this._statement = statement;
	}

	override function getStatement () : Statement {
		return this._statement;
	}

	override function _replaceControlStructuresWithGotos () : void {
		if (this._statement.getExpr() != null) {
			var returnLocal = CPSTransformCommand._extractReturnLocal(this._transformer._getTransformingFuncDef());

			/* returnLocal should be null when the return statement is declared like this:
			 *
			 *     function foo () : void {
			 *         return bar(); // bar returns void
			 *     }
			 */
			if (returnLocal == null) {
				this._transformer._emitExpressionStatement(this._statement.getExpr());
			}
			else {
				this._transformer._emitExpressionStatement(new AssignmentExpression(
					new Token("=", false),
					new LocalExpression(returnLocal.getName(), returnLocal),
					this._statement.getExpr()));
			}
		}
		this._transformer._emitGotoStatement("$L_exit");
	}

}

class _DeleteStatementTransformer extends _StatementTransformer {

	var _statement : DeleteStatement;

	function constructor (transformer : CPSTransformCommand, statement : DeleteStatement) {
		super(transformer, "DELETE");
		this._statement = statement;
	}

	override function getStatement () : Statement {
		return this._statement;
	}

	override function replaceControlStructuresWithGotos () : void {
		if (this._transformer._transformExprs) {
			var funcDef = CPSTransformCommand._extractVM(this._transformer._getTransformingFuncDef());
			var aryExpr = this._statement.getExpr() as ArrayExpression;
			this._transformer._emitExpressionStatement(new _DeleteStatementTransformer._Stash(this._transformer, this._statement).doCPSTransform(funcDef, null, aryExpr.getType()));
		} else {
			this._transformer._emit(this._statement);
		}
	}

	override function _replaceControlStructuresWithGotos () : void {
		throw new Error("logic flaw");
	}

	class _Stash extends _BinaryExpressionTransformer {

		var _statement : DeleteStatement;

		function constructor (transformer : CPSTransformCommand, statement : DeleteStatement) {
			super(transformer, statement.getExpr() as ArrayExpression);
			this._statement = statement;
		}

		override function _injectBody (args : Expression[], topExpr : Expression, topFuncDef : MemberFunctionDefinition, botFuncDef : MemberFunctionDefinition, continuation : Expression) : void {
			botFuncDef._statements = [ new DeleteStatement(this._statement.getToken(), this.constructOp(args)) ] : Statement[];
			Util.rebaseClosures(topFuncDef, botFuncDef);
		}

		override function _clone (arg1 : Expression, arg2 : Expression) : BinaryExpression {
			return new ArrayExpression(this._expr.getToken(), arg1, arg2);
		}

	}

}

class _BreakStatementTransformer extends _StatementTransformer {

	var _statement : BreakStatement;

	function constructor (transformer : CPSTransformCommand, statement : BreakStatement) {
		super(transformer, "BREAK");
		this._statement = statement;
	}

	override function getStatement () : Statement {
		return this._statement;
	}

	override function _replaceControlStructuresWithGotos () : void {
		var label;
		if (this._statement.getLabel() != null) {
			label = this._transformer._getStatementTransformerByLabel(this._statement.getLabel().getValue()).getBreakingLabel();
		} else {
			label = this._transformer._getTopLabelledBlock().getBreakingLabel();
		}
		this._transformer._emitGotoStatement(label);
	}

}

class _ContinueStatementTransformer extends _StatementTransformer {

	var _statement : ContinueStatement;

	function constructor (transformer : CPSTransformCommand, statement : ContinueStatement) {
		super(transformer, "CONTINUE");
		this._statement = statement;
	}

	override function getStatement () : Statement {
		return this._statement;
	}

	override function _replaceControlStructuresWithGotos () : void {
		var label;
		if (this._statement.getLabel() != null) {
			label = this._transformer._getStatementTransformerByLabel(this._statement.getLabel().getValue()).getContinuingLabel();
		} else {
			label = this._transformer._getTopLabelledBlock().getContinuingLabel();
		}
		this._transformer._emitGotoStatement(label);
	}

}

abstract class _LabellableStatementTransformer extends _StatementTransformer {

	function constructor (transformer : CPSTransformCommand, identifier : string) {
		super(transformer, identifier);
	}

	abstract function getBreakingLabel () : string;
	abstract function getContinuingLabel () : string;

}

class _DoWhileStatementTransformer extends _LabellableStatementTransformer {

	var _statement : DoWhileStatement;

	function constructor (transformer : CPSTransformCommand, statement : DoWhileStatement) {
		super(transformer, "DO-WHILE");
		this._statement = statement;
	}

	override function getStatement () : Statement {
		return this._statement;
	}

	override function _replaceControlStructuresWithGotos () : void {
		/*

		do {
			body;
		} while (expr);


		goto $BODY_DO_WHILE_n;
	$BODY_DO_WHILE_n:
		body;
		goto $TEST_DO_WHILE_n;
	$TEST_DO_WHILE_n:
		if (expr)
			goto $BODY_DO_WHILE_n;
		else
			goto $END_DO_WHILE_n;
	$END_DO_WHILE_n;

		*/
		var bodyLabel = "$L_body_do_while_" + this.getID();
		this._transformer._emitGotoStatement(bodyLabel);
		this._transformer._emitLabelStatement(bodyLabel);
		this._transformer._enterLabelledBlock(this);
		this._statement.getStatements().forEach((statement) -> {
			this._transformer._getStatementTransformerFor(statement).replaceControlStructuresWithGotos();
		});
		this._transformer._leaveLabelledBlock();
		var testLabel = "$L_test_do_while_" + this.getID();
		this._transformer._emitGotoStatement(testLabel);
		this._transformer._emitLabelStatement(testLabel);
		var endLabel = "$L_end_do_while_" + this.getID();
		this._transformer._emitConditionalBranch(this._statement.getExpr(), bodyLabel, endLabel);
		this._transformer._emitLabelStatement(endLabel);
	}

	override function getBreakingLabel () : string {
		return "$L_end_do_while_" + this.getID();
	}

	override function getContinuingLabel () : string {
		return "$L_body_do_while_" + this.getID();
	}

}

class _ForInStatementTransformer extends _LabellableStatementTransformer {

	var _statement : ForInStatement;

	function constructor (transformer : CPSTransformCommand, statement : ForInStatement) {
		super(transformer, "FOR-IN");
		this._statement = statement;
	}

	override function getStatement () : Statement {
		return this._statement;
	}

	override function replaceControlStructuresWithGotos () : void {
		this._transformer._emit(this._statement);
	}

	override function _replaceControlStructuresWithGotos () : void {
		throw new Error("logic flaw");
	}

	override function getBreakingLabel () : string {
		throw new Error("logic flaw");
	}

	override function getContinuingLabel () : string {
		throw new Error("logic flaw");
	}
}

class _ForStatementTransformer extends _LabellableStatementTransformer {

	var _statement : ForStatement;

	function constructor (transformer : CPSTransformCommand, statement : ForStatement) {
		super(transformer, "FOR");
		this._statement = statement;
	}

	override function getStatement () : Statement {
		return this._statement;
	}

	override function _replaceControlStructuresWithGotos () : void {
		/*

		for (init; cond; post) {
			body;
		}


		goto $INIT_FOR_n;
	$INIT_FOR_n:
		init;
		goto $TEST_FOR_n;
	$TEST_FOR_n:
		if (cond)
			goto $BODY_FOR_n;
		else
			goto $END_FOR_n;
	$BODY_FOR_n:
		body;
		goto $POST_FOR_n;
	$POST_FOR_n:
		post;
		goto $TEST_FOR_n;
	$END_FOR_n:

		*/
		var initLabel = "$L_init_for_" + this.getID();
		this._transformer._emitGotoStatement(initLabel);
		this._transformer._emitLabelStatement(initLabel);
		if (this._statement.getInitExpr() != null) {
			this._transformer._emitExpressionStatement(this._statement.getInitExpr());
		}
		var testLabel = "$L_test_for_" + this.getID();
		this._transformer._emitGotoStatement(testLabel);
		this._transformer._emitLabelStatement(testLabel);
		var bodyLabel = "$L_body_for_" + this.getID();
		var endLabel = "$L_end_for_" + this.getID();
		if (this._statement.getCondExpr() != null) {
			this._transformer._emitConditionalBranch(this._statement.getCondExpr(), bodyLabel, endLabel);
		} else {
			this._transformer._emitConditionalBranch(new BooleanLiteralExpression(new Token("true", false)), bodyLabel, endLabel);
		}
		this._transformer._emitLabelStatement(bodyLabel);
		this._transformer._enterLabelledBlock(this);
		this._statement.getStatements().forEach((statement) -> {
			this._transformer._getStatementTransformerFor(statement).replaceControlStructuresWithGotos();
		});
		this._transformer._leaveLabelledBlock();
		var postLabel = "$L_post_for_" + this.getID();
		this._transformer._emitGotoStatement(postLabel);
		this._transformer._emitLabelStatement(postLabel);
		if (this._statement.getPostExpr() != null) {
			this._transformer._emitExpressionStatement(this._statement.getPostExpr());
		}
		this._transformer._emitGotoStatement(testLabel);
		this._transformer._emitLabelStatement(endLabel);
	}

	override function getBreakingLabel () : string {
		return "$L_end_for_" + this.getID();
	}

	override function getContinuingLabel () : string {
		return "$L_post_for_" + this.getID();
	}

}

class _IfStatementTransformer extends _StatementTransformer {

	var _statement : IfStatement;

	function constructor (transformer : CPSTransformCommand, statement : IfStatement) {
		super(transformer, "IF");
		this._statement = statement;
	}

	override function getStatement () : Statement {
		return this._statement;
	}

	override function _replaceControlStructuresWithGotos () : void {
		/*

		if (test) {
			succ;
		} else {
			fail;
		}


		goto $TEST_IF_n;
	$TEST_IF_n;
		if (test)
			goto $SUCC_IF_n;
		else
			goto $FAIL_IF_n;
	$SUCC_IF_n;
		succ;
		goto $END_IF_n;
	$FAIL_IF_n;
		fail;
		goto $END_IF_n;
	$END_IF_n;

		*/
		var testLabel = "$L_test_if_" + this.getID();
		var succLabel = "$L_succ_if_" + this.getID();
		var failLabel = "$L_fail_if_" + this.getID();
		this._transformer._emitGotoStatement(testLabel);
		this._transformer._emitLabelStatement(testLabel);
		this._transformer._emitConditionalBranch(this._statement.getExpr(), succLabel, failLabel);
		this._transformer._emitLabelStatement(succLabel);
		this._statement.getOnTrueStatements().forEach((statement) -> {
			this._transformer._getStatementTransformerFor(statement).replaceControlStructuresWithGotos();
		});
		var endLabel = "$L_end_if_" + this.getID();
		this._transformer._emitGotoStatement(endLabel);
		this._transformer._emitLabelStatement(failLabel);
		this._statement.getOnFalseStatements().forEach((statement) -> {
			this._transformer._getStatementTransformerFor(statement).replaceControlStructuresWithGotos();
		});
		this._transformer._emitGotoStatement(endLabel);
		this._transformer._emitLabelStatement(endLabel);
	}

}

class _SwitchStatementTransformer extends _LabellableStatementTransformer {

	var _statement : SwitchStatement;
	var _hasDefault = false;

	function constructor (transformer : CPSTransformCommand, statement : SwitchStatement) {
		super(transformer, "SWITCH");
		this._statement = statement;
		// create and register a stash
		statement.getStatements().forEach((statement) -> {
			if (statement instanceof CaseStatement) {
				statement.setStash(_SwitchStatementTransformer.CaseStash.ID, new _SwitchStatementTransformer.CaseStash);
			} else if (statement instanceof DefaultStatement) {
				this._hasDefault = true;
			}
		});
	}

	override function getStatement () : Statement {
		return this._statement;
	}

	override function _replaceControlStructuresWithGotos () : void {
		/*

		switch (expr) {
		case x:
			caseX;
			// fall through
		case y:
			caseY;
			break;
		default:
			def;
		}


		goto $BEGIN_SWITCH_n;
	$BEGIN_SWITCH_n;
		var $v = expr;

	// case x
		if ($v == x) {
			goto $SWITCH_n_CASE_x;
		} else {
			goto $SWITCH_n_END_CASE_x;
		}
	$SWITCH_n_END_CASE_x;

	// case y
		if ($v == y) {
			goto $SWITCH_n_CASE_y;
		} else {
			goto $SWITCH_n_END_CASE_y;
		}
	$SWITCH_n_END_CASE_y;

	// default (if exists)
		goto $SWITCH_n_DEFAULT;
 	// otherwise
		goto $END_SWITCH_n;

		goto $SWITCH_n_CASE_x;
	$SWITCH_n_CASE_x:
		caseX;

		goto $SWITCH_n_CASE_y;
	$SWITCH_n_CASE_y:
		caseY;
		goto $END_SWITCH_n;

		goto $SWITCH_n_DEFAULT;
	$SWITCH_n_DEFAULT:
		def;

		goto $END_SWITCH_n;
	$END_SWITCH_n;

		 */
		var beginLabel = "$L_begin_switch_" + this.getID();
		this._transformer._emitGotoStatement(beginLabel);
		this._transformer._emitLabelStatement(beginLabel);
		this._emitSwitchConditionals();
		this._emitSwitchBodies();
		var endLabel = "$L_end_switch_" + this.getID();
		this._transformer._emitGotoStatement(endLabel);
		this._transformer._emitLabelStatement(endLabel);
	}

	function _emitSwitchConditionals () : void {
		var exprVar = _Util._createFreshLocalVariable(this._statement.getExpr().getType());
		this._transformer._getTransformingFuncDef().getLocals().push(exprVar);
		this._transformer._emit(new ExpressionStatement(
			new AssignmentExpression(
				new Token("=", false),
				new LocalExpression(exprVar.getName(), exprVar),
				this._statement.getExpr())));

		var statements = this._statement.getStatements();
		for (var i = 0; i < statements.length; ++i) {
			if (statements[i] instanceof CaseStatement) {
				var caseStmt = statements[i] as CaseStatement;
				this._transformer._emitConditionalBranch(
					new EqualityExpression(
						new Token("==", false),
						new LocalExpression(exprVar.getName(), exprVar),
						caseStmt.getExpr()),
					this._getLabelFromCaseStatement(caseStmt),
					this._getLabelFromEndCaseStatement(caseStmt));
				this._transformer._emitLabelStatement(this._getLabelFromEndCaseStatement(caseStmt));
			}
		}

		if (this._hasDefault) {
			this._transformer._emitGotoStatement(this._getLabelFromDefaultStatement());
		} else {
			this._transformer._emitGotoStatement("$L_end_switch_" + this.getID());
		}
	}

	function _emitSwitchBodies () : void {
		var statements = this._statement.getStatements();

		this._transformer._enterLabelledBlock(this);
		for (var i = 0; i < statements.length; ++i) {
			var stmt = statements[i];
			if (stmt instanceof CaseStatement) {
				var label = this._getLabelFromCaseStatement(stmt as CaseStatement);
				this._transformer._emitGotoStatement(label);
				this._transformer._emitLabelStatement(label);
			} else if (stmt instanceof DefaultStatement) {
				label = this._getLabelFromDefaultStatement();
				this._transformer._emitGotoStatement(label);
				this._transformer._emitLabelStatement(label);
			} else {
				this._transformer._getStatementTransformerFor(stmt).replaceControlStructuresWithGotos();
			}
		}
		this._transformer._leaveLabelledBlock();
	}

	class CaseStash extends Stash {
		static const ID = "CASE-ID";
		static var count = 0;
		var index : number;
		function constructor () {
			this.index = _SwitchStatementTransformer.CaseStash.count++;
		}
		override function clone () : Stash {
			throw new Error("not supported");
		}
	}

	function _getLabelFromCaseStatement (caseStmt : CaseStatement) : string {
		return "$L_switch_" + this.getID() + "_case_" + (caseStmt.getStash(_SwitchStatementTransformer.CaseStash.ID) as _SwitchStatementTransformer.CaseStash).index;
	}

	function _getLabelFromEndCaseStatement (caseStmt : CaseStatement) : string {
		return "$L_switch_" + this.getID() + "_end_case_" + (caseStmt.getStash(_SwitchStatementTransformer.CaseStash.ID) as _SwitchStatementTransformer.CaseStash).index;
	}

	function _getLabelFromDefaultStatement () : string {
		return "$L_switch_" + this.getID() + "_default";
	}

	override function getBreakingLabel () : string {
		return "$L_end_switch_" + this.getID();
	}

	override function getContinuingLabel () : string {
		throw new Error("logic flaw");
	}

}

class _CaseStatementTransformer extends _StatementTransformer {

	var _statement : CaseStatement;

	function constructor (transformer : CPSTransformCommand, statement : CaseStatement) {
		super(transformer, "CASE");
		this._statement = statement;
	}

	override function getStatement () : Statement {
		return this._statement;
	}

	override function _replaceControlStructuresWithGotos () : void {
		throw new Error("logic flaw");
	}

}

class _DefaultStatementTransformer extends _StatementTransformer {

	var _statement : DefaultStatement;

	function constructor (transformer : CPSTransformCommand, statement : DefaultStatement) {
		super(transformer, "DEFAULT");
		this._statement = statement;
	}

	override function getStatement () : Statement {
		return this._statement;
	}

	override function _replaceControlStructuresWithGotos () : void {
		throw new Error("logic flaw");
	}

}

class _WhileStatementTransformer extends _LabellableStatementTransformer {

	var _statement : WhileStatement;

	function constructor (transformer : CPSTransformCommand, statement : WhileStatement) {
		super(transformer, "WHILE");
		this._statement = statement;
	}

	override function getStatement () : Statement {
		return this._statement;
	}

	override function _replaceControlStructuresWithGotos () : void {
		/*

		while (expr) {
			body;
		}


		goto $TEST_WHILE_n;
	$TEST_WHILE_n:
		if (expr)
			goto $BODY_WHILE_n;
		else
			goto $END_WHILE_n;
	$BODY_WHILE_n:
		body;
		goto $TEST_WHILE_n;
	$END_WHILE_n;

		 */
		var testLabel = "$L_test_while_" + this.getID();
		this._transformer._emitGotoStatement(testLabel);
		this._transformer._emitLabelStatement(testLabel);
		var bodyLabel = "$L_body_while_" + this.getID();
		var endLabel = "$L_end_while_" + this.getID();
		this._transformer._emitConditionalBranch(this._statement.getExpr(), bodyLabel, endLabel);
		this._transformer._emitLabelStatement(bodyLabel);
		this._transformer._enterLabelledBlock(this);
		this._statement.getStatements().forEach((statement) -> {
			this._transformer._getStatementTransformerFor(statement).replaceControlStructuresWithGotos();
		});
		this._transformer._leaveLabelledBlock();
		this._transformer._emitGotoStatement(testLabel);
		this._transformer._emitLabelStatement(endLabel);
	}

	override function getBreakingLabel () : string {
		return "$L_end_while_" + this.getID();
	}

	override function getContinuingLabel () : string {
		return "$L_test_while_" + this.getID();
	}

}

class _TryStatementTransformer extends _StatementTransformer {

	var _statement : TryStatement;

	function constructor (transformer : CPSTransformCommand, statement : TryStatement) {
		super(transformer, "TRY");
		this._statement = statement;
	}

	override function getStatement () : Statement {
		return this._statement;
	}

	override function _replaceControlStructuresWithGotos () : void {
		/*

		try {
			body;	// assumes no return statements in body
		} catch (e : variant) {
			rescue;
		} finally {
			ensure;
		}

		goto $BEGIN_TRY_n;

	$BEGIN_TRY_n;
		goto $__push_local_jump__; // pseudo-instruction; push finally clause
		goto $BEGIN_FINALLY_n;
		goto $__push_local_jump__; // pseudo-instruction; push catch clause
		goto $BEGIN_CATCH_n;
		body;
		goto $END_TRY_n;
	$END_TRY_n;
		goto $BEGIN_CATCH_n; // the control enters into CATCH clause even if no error was raised.

	$BEGIN_CATCH_n;
		goto $__pop_local_jump__; // pseudo-instruction; pop catch clause
		if ($raised) {
			$raised = false;
			rescue;
		}
		goto $END_CATCH_n;
	$END_CATCH_n;
		goto $BEGIN_FINALLY_n;

	$BEGIN_FINALLY_n;
		goto $__pop_local_jump__; // pseudo-instruction; pop finally clause
		ensure;
		if ($raised) {
		    throw $error;
		}
		goto $END_FINALLY_n;

	$END_FINALLY_n;

		*/
		var funcDef = this._transformer._getTransformingFuncDef();
		var raisedLocal = CPSTransformCommand._extractRaisedLocal(funcDef);
		var errorLocal = CPSTransformCommand._extractErrorLocal(funcDef);

		// try
		var beginLabel = "$L_begin_try_" + this.getID();
		this._transformer._emit(new GotoStatement(beginLabel));
		this._transformer._emit(new LabelStatement(beginLabel));
		this._transformer._emit(new GotoStatement("$__push_local_jump__"));
		var finallyLabel = "$L_begin_finally_" + this.getID();
		this._transformer._emit(new GotoStatement(finallyLabel));
		this._transformer._emit(new GotoStatement("$__push_local_jump__"));
		var catchLabel = "$L_begin_catch_" + this.getID();
		this._transformer._emit(new GotoStatement(catchLabel));
		this._statement.getTryStatements().forEach((statement) -> {
			this._transformer._getStatementTransformerFor(statement).replaceControlStructuresWithGotos();
		});
		var endLabel = "$L_end_try_" + this.getID();
		this._transformer._emit(new GotoStatement(endLabel));
		this._transformer._emit(new LabelStatement(endLabel));

		// catch
		var catchStmt = this._statement.getCatchStatements()[0];
		catchStmt.forEachStatement(function onStmt (stmt) {
			return stmt.forEachExpression(function onExpr (expr, replaceCb) {
				if (expr instanceof LocalExpression) {
					var local = (expr as LocalExpression).getLocal();
					if (local == catchStmt.getLocal()) {
						var expr = new AsNoConvertExpression(
							new Token("as", false),
							new LocalExpression(
								errorLocal.getName(),
								errorLocal),
							local.getType());
						replaceCb(expr);
						return true;
					}
				}
				return expr.forEachExpression(onExpr);
			}) && stmt.forEachStatement(onStmt);
		});

		this._transformer._emit(new GotoStatement(catchLabel));
		this._transformer._emit(new LabelStatement(catchLabel));
		this._transformer._emit(new GotoStatement("$__pop_local_jump__"));
		this._transformer._getStatementTransformerFor(
			new IfStatement(
				new Token("if", false),
				new LocalExpression(raisedLocal.getName(), raisedLocal),
				[
					new ExpressionStatement(
						new AssignmentExpression(
							new Token("=", false),
							new LocalExpression(raisedLocal.getName(), raisedLocal),
							new BooleanLiteralExpression(new Token("false", false))))
				] : Statement[].concat(catchStmt.getStatements()),
				[])
		).replaceControlStructuresWithGotos();
		var endCatchLabel = "$L_end_catch_" + this.getID();
		this._transformer._emit(new GotoStatement(endCatchLabel));
		this._transformer._emit(new LabelStatement(endCatchLabel));

		// finally
		this._transformer._emit(new GotoStatement(finallyLabel));
		this._transformer._emit(new LabelStatement(finallyLabel));
		this._transformer._emit(new GotoStatement("$__pop_local_jump__"));
		this._statement.getFinallyStatements().forEach((statement) -> {
			this._transformer._getStatementTransformerFor(statement).replaceControlStructuresWithGotos();
		});

		var endFinallyLabel = "$L_end_finally_" + this.getID();
		this._transformer._getStatementTransformerFor(new IfStatement(
			new Token("if", false),
			new LocalExpression(raisedLocal.getName(), raisedLocal),
			[
				new ThrowStatement(
					new Token("throw", false),
					new LocalExpression(errorLocal.getName(), errorLocal))
			],
			[])
		).replaceControlStructuresWithGotos();
		this._transformer._emit(new LabelStatement(endFinallyLabel));
	}

}

class _CatchStatementTransformer extends _StatementTransformer {

	var _statement : CatchStatement;

	function constructor (transformer : CPSTransformCommand, statement : CatchStatement) {
		super(transformer, "CATCH");
		this._statement = statement;
	}

	override function getStatement () : Statement {
		return this._statement;
	}

	override function _replaceControlStructuresWithGotos () : void {
		throw new Error("logic flaw");
	}

}

class _ThrowStatementTransformer extends _StatementTransformer {

	var _statement : ThrowStatement;

	function constructor (transformer : CPSTransformCommand, statement : ThrowStatement) {
		super(transformer, "THROW");
		this._statement = statement;
	}

	override function getStatement () : Statement {
		return this._statement;
	}

	override function _replaceControlStructuresWithGotos () : void {
		this._transformer._emit(this._statement);
	}

}

class _AssertStatementTransformer extends _StatementTransformer {

	var _statement : AssertStatement;

	function constructor (transformer : CPSTransformCommand, statement : AssertStatement) {
		super(transformer, "ASSERT");
		this._statement = statement;
	}

	override function getStatement () : Statement {
		return this._statement;
	}

	override function _replaceControlStructuresWithGotos () : void {
		this._transformer._emit(this._statement);
	}

}

class _LogStatementTransformer extends _StatementTransformer {

	var _statement : LogStatement;

	function constructor (transformer : CPSTransformCommand, statement : LogStatement) {
		super(transformer, "LOG");
		this._statement = statement;
	}

	override function getStatement () : Statement {
		return this._statement;
	}

	override function _replaceControlStructuresWithGotos () : void {
		this._transformer._emit(this._statement);
	}

}

class _DebuggerStatementTransformer extends _StatementTransformer {

	var _statement : DebuggerStatement;

	function constructor (transformer : CPSTransformCommand, statement : DebuggerStatement) {
		super(transformer, "DEBUGGER");
		this._statement = statement;
	}

	override function getStatement () : Statement {
		return this._statement;
	}

	override function _replaceControlStructuresWithGotos () : void {
		this._transformer._emit(this._statement);
	}

}

class CPSTransformCommand extends FunctionTransformCommand {

	static const IDENTIFIER = "cps";

	var _transformYield : boolean;
	var _transformExprs : boolean;

	function constructor (compiler : Compiler) {
		super(compiler, CPSTransformCommand.IDENTIFIER);
		this._transformYield = false;
		this._transformExprs = false;
	}

	function setTransformYield (flag : boolean) : void {
		this._transformYield = flag;
	}

	function setTransformExprs (flag : boolean) : void {
		this._transformExprs = flag;
	}

	function _functionIsTransformable (funcDef : MemberFunctionDefinition) : boolean {
		if (funcDef instanceof TemplateFunctionDefinition)
			return false;
		if (funcDef.getStatements() == null)
			return false;
		if (funcDef.getNameToken() != null && funcDef.name() == "constructor")
			return false;
		return funcDef.forEachStatement(function onStatement (statement) {
			return statement.forEachExpression(function onExpr (expr) {
				if (! this._transformYield && expr instanceof YieldExpression)
					return false;
				return expr.forEachExpression(onExpr);
			}) && statement.forEachStatement(onStatement);
		});
	}

	override function transformFunction (funcDef : MemberFunctionDefinition) : void {
		var cmd : StatementTransformCommand;

		if (! this._functionIsTransformable(funcDef))
			return;

		// depends on normalize-try transform command
		cmd = new NormalizeTryStatementTransformCommand(this._compiler);
		cmd.setup([]);
		cmd.transformFunction(funcDef);

		cmd = new ForInStatementTransformCommand(this._compiler);
		cmd.setup([]);
		cmd.transformFunction(funcDef);

		this._doCPSTransform(funcDef);
	}

	function _doCPSTransform (funcDef : MemberFunctionDefinition) : void {

		// create and set a VM
		this._createAndSetVMReady(funcDef);

		// replace control structures with goto statements
		this._replaceControlStructuresWithGotos(funcDef);

		// peep-hole optimization
		this._eliminateDeadBranches(funcDef);

		// resolve labels
		this._resolveLabels(funcDef);

		// convert pseudo instructions into normal statements
		this._convertPseudoInstructions(funcDef);

		// replace goto statements with indirect threading
		this._eliminateGotos(funcDef);

	}

	function _createAndSetVMReady (funcDef : MemberFunctionDefinition) : void {

		// create a VM
		var loopVar = new LocalVariable(new Token("$loop", true), new StaticFunctionType(null, Type.voidType, [ Type.integerType ], true), false);
		funcDef.getLocals().push(loopVar);
		var vm = _Util._createNamedFunction(
			funcDef,
			null,	// Token
			new Token("$loop", true),
			[ new ArgumentDeclaration(new Token("$next", true), Type.integerType) ],
			Type.voidType
		);
		vm.setFuncLocal(loopVar);

		// handling local jumps
		var localJumpsVar = new LocalVariable(new Token("$localJumps", true), this._instantiateArrayType(Type.integerType), false);
		funcDef.getLocals().push(localJumpsVar);

		// amend vm._statements; lift statements up to the VM
		vm._statements = funcDef.getStatements();
		Util.rebaseClosures(funcDef, vm);

		// amend funcDef._statements; invoke the VM
		funcDef._statements = [
			new ExpressionStatement(
				new AssignmentExpression(
					new Token("=", false),
					new LocalExpression(new Token("$localJumps", true), localJumpsVar),
					new ArrayLiteralExpression(
						new Token("[", false),
						[],
						this._instantiateArrayType(Type.integerType)))),
			new FunctionStatement(
				new Token("function", false), vm),
			new ExpressionStatement(
				new CallExpression(
					new Token("(", false),
					new LocalExpression(new Token("$loop", true), loopVar),
					[ new IntegerLiteralExpression(new Token("0", false)) ])),
		];

	}

	function _replaceControlStructuresWithGotos (funcDef : MemberFunctionDefinition) : void {
		this._enterFunction(funcDef);
		try {
			var inStatements = CPSTransformCommand._extractVMBody(funcDef);
			var outStatements = new Statement[];

			this._setOutputStatements(outStatements);

			for (var i = 0; i < inStatements.length; ++i) {
				this._getStatementTransformerFor(inStatements[i]).replaceControlStructuresWithGotos();
			}

			// insert prologue code
			outStatements.unshift(
				new LabelStatement("$L_enter")
			);
			// insert epilogue code
			outStatements.push(
				new GotoStatement("$L_exit"),
				new LabelStatement("$L_exit"),
				new ReturnStatement(new Token("return", false), null));

			CPSTransformCommand._extractVM(funcDef)._statements = outStatements;
		} finally {
			this._leaveFunction();
		}
	}

	function _eliminateDeadBranches (funcDef : MemberFunctionDefinition) : void {

		var statements = CPSTransformCommand._extractVMBody(funcDef);

		function isPseudoStatement (statement : Statement) : boolean {
			return statement instanceof GotoStatement && (statement as GotoStatement).getLabel().search(/\$__/) != -1;
		}

		// removal of dead code after goto statement
		for (var i = 0; i < statements.length; ++i) {
			if (isPseudoStatement(statements[i])) {
				switch ((statements[i] as GotoStatement).getLabel()) {
				case "$__push_local_jump__":
					i += 1;
					break;
				}
			}
			else if (statements[i] instanceof GotoStatement) {
				for (var j = i; j < statements.length; ++j) {
					if (statements[j] instanceof LabelStatement)
						break;
				}
				statements.splice(i + 1, j - i - 1);
			}
		}

		// fold trivial branches
		for (var i = 0; i < statements.length - 1; ++i) {
			if (statements[i] instanceof LabelStatement && statements[i + 1] instanceof GotoStatement && ! isPseudoStatement(statements[i + 1])) {
				var srcLabel = statements[i] as LabelStatement;
				var destLabel = (statements[i + 1] as GotoStatement).getLabel();
				statements.splice(i, 2);

				for (var j = 0; j < statements.length; ++j) {
					if (statements[j] instanceof LabelStatement && (statements[j] as LabelStatement).getName() == destLabel) {
						break;
					}
				}
				if (j == statements.length) {
					throw new Error("logic flaw");
				}
				statements.splice(j, 0, srcLabel);
				if (i <= j) {
					i--;
				}
			}
		}

		// fold continuous labels
		var labelRenames = new Map.<string>;
		for (var i = 0; i < statements.length; ++i) {
			if (statements[i] instanceof LabelStatement) {
				var labels = new LabelStatement[];
				for (var j = i; statements[j] instanceof LabelStatement; ++j) {
					labels.push(statements[j] as LabelStatement);
				}
				var fusedLabel : Nullable.<string> = labels.reduce(function (fuse : Nullable.<string>, label) {
					if (fuse != "") {
						fuse += "_";
					}
					return fuse + label.getName();
				}, "");
				labels.forEach(function (label) {
					labelRenames[label.getName()] = fusedLabel;
				});
				statements.splice(i, labels.length, new LabelStatement(fusedLabel));
			}
		}
		Util.forEachStatement(function onStatement (statement) {
			if (statement instanceof GotoStatement && ! isPseudoStatement(statement)) {
				var gotoStmt = statement as GotoStatement;
				gotoStmt.setLabel(labelRenames[gotoStmt.getLabel()]);
			}
			return statement.forEachStatement(onStatement);
		}, statements);

	}

	function _resolveLabels (funcDef : MemberFunctionDefinition) : void {
		var statements = CPSTransformCommand._extractVMBody(funcDef);

		var labelIDs = new Map.<int>;
		// resolve LabelStatements
		for (var i = 0, c = 0; i < statements.length; ++i) {
			if (statements[i] instanceof LabelStatement) {
				var labelStmt = statements[i] as LabelStatement;
				labelStmt.setID(c);
				labelIDs[labelStmt.getName()] = c;
				c++;
			}
		}

		// resolve GotoStatements
		Util.forEachStatement(function onStatement (statement) {
			if (statement instanceof GotoStatement) {
				var gotoStmt = statement as GotoStatement;
				if (gotoStmt.getLabel().search(/^\$__/) != -1) {
					return true;
				}
				var label = gotoStmt.getLabel();
				if (! (label in labelIDs)) {
					throw new Error("logic flaw! label not found: " + label);
				}
				gotoStmt.setID(labelIDs[label]);
			}
			return statement.forEachStatement(onStatement);
		}, statements);
	}

	function _convertPseudoInstructions (funcDef : MemberFunctionDefinition) : void {
		var statements = CPSTransformCommand._extractVMBody(funcDef);

		var localJumpsVar = CPSTransformCommand._extractLocalJumpsLocal(funcDef);
		var raisedVar = CPSTransformCommand._extractRaisedLocal(funcDef);

		// convert pseudo-instructions
		for (var i = 0; i < statements.length; ++i) {
			if (statements[i] instanceof GotoStatement && (statements[i] as GotoStatement).getLabel().search(/^\$__/) != -1) {
				var gotoStmt = statements[i] as GotoStatement;
				switch (gotoStmt.getLabel()) {
				case '$__push_local_jump__':
					var gotoBeginFinally = statements[i + 1] as GotoStatement;
					statements.splice(i, 2,
						new ExpressionStatement(
							new CallExpression(
								new Token("(", false),
								new PropertyExpression(
									new Token(".", false),
									new LocalExpression(new Token("$localJumps", true), localJumpsVar),
									new Token("push", true),
									[],
									new MemberFunctionType(
										null,
										localJumpsVar.getType(),
										Type.integerType,
										[ new VariableLengthArgumentType(Type.integerType.toNullableType()) ] : Type[],
										false)),
								[ new IntegerLiteralExpression(new Token("" + gotoBeginFinally.getID(), false)) ] : Expression[])));
					break;
				case '$__pop_local_jump__':
					statements.splice(i, 1,
						new ExpressionStatement(
							new CallExpression(
								new Token("(", false),
								new PropertyExpression(
									new Token(".", false),
									new LocalExpression(new Token("$localJumps", true), localJumpsVar),
									new Token("pop", true),
									[],
									new MemberFunctionType(
										null,
										localJumpsVar.getType(),
										Type.integerType.toNullableType(),
										[],
										false)),
								[])));
					break;
				default:
					throw new Error('got unknown pseudo-instruction');
				}
			}
		}
	}

	function _eliminateGotos (funcDef : MemberFunctionDefinition) : void {
		var statements = CPSTransformCommand._extractVMBody(funcDef);

		var nextVar = CPSTransformCommand._extractNextLocal(funcDef);
		var localJumpsVar = CPSTransformCommand._extractLocalJumpsLocal(funcDef);
		var raisedVar = CPSTransformCommand._extractRaisedLocal(funcDef);
		var errorVar = CPSTransformCommand._extractErrorLocal(funcDef);

		function replaceGoto (statements : Statement[], index : int) : int {
			assert statements[index] instanceof GotoStatement;
			var gotoStmt = statements[index] as GotoStatement;
			statements.splice(index, 1,
				new ExpressionStatement(
					new AssignmentExpression(
						new Token("=", false),
						new LocalExpression(new Token("$next", true), nextVar),
						new IntegerLiteralExpression(new Token("" + gotoStmt.getID(), false)))),
				new BreakStatement(new Token("break", false), null));
			return index + 1;
		}

		// replace gotos with indirect threading
		for (var i = 0; i < statements.length; ++i) {
			var stmt = statements[i];

			if (stmt instanceof GotoStatement) {
				i = replaceGoto(statements, i);
			} else if (stmt instanceof IfStatement) {
				var ifStmt = stmt as IfStatement;
				replaceGoto(ifStmt.getOnTrueStatements(), 0);
				replaceGoto(ifStmt.getOnFalseStatements(), 0);
			}
		}

		function replaceBasicBlock (statements : Statement[], index : int, end : int) : int {
			assert statements[index] instanceof LabelStatement;
			var labelStmt = statements[index] as LabelStatement;
			statements.splice(index, 1,
				new CaseStatement(
					new Token("case", false),
					new IntegerLiteralExpression(new Token("" + labelStmt.getID(), false))));
			return end;
		}

		// replace basic blocks with simple case clauses
		for (var i = 0; i < statements.length;) {
			var index = i;

			for (i += 1; i < statements.length; ++i) {
				if (statements[i] instanceof LabelStatement) // advance until next label is found
					break;
			}
			i = replaceBasicBlock(statements, index, i);
		}

		var eVar = new CaughtVariable(new Token("$e", true), Type.variantType);

		// create while-switch loop
		var switchStmt = new SwitchStatement(
			new Token("switch", false),
			null,
			new LocalExpression(new Token("$next", true), nextVar),
			statements);
		var inferiorWhileStmt = new WhileStatement(
			new Token("while", false),
			null,
			new BooleanLiteralExpression(new Token("true", false)),
			[ switchStmt ] : Statement[]);
		var tryStmt = new TryStatement(
			new Token("try", false),
			[
				inferiorWhileStmt,
			], [
				new CatchStatement(
					new Token("catch", false),
					eVar,
					[
						new ExpressionStatement(
							new AssignmentExpression(
								new Token("=", false),
								new LocalExpression(new Token("$raised", true), raisedVar),
								new BooleanLiteralExpression(new Token("true", false)))),
						new ExpressionStatement(
							new AssignmentExpression(
								new Token("=", false),
								new LocalExpression(new Token("$error", true), errorVar),
								new LocalExpression(new Token("$e", true), eVar))),
						new ExpressionStatement(
							new AssignmentExpression(
								new Token("=", false),
								new LocalExpression(new Token("$next", true), nextVar),
								new ArrayExpression(
									new Token("[", false),
									new LocalExpression(new Token("$localJumps", true), localJumpsVar),
									new BinaryNumberExpression(
										new Token("-", false),
										new PropertyExpression(
											new Token(".", false),
											new LocalExpression(new Token("$localJumps", true), localJumpsVar),
											new Token("length", true),
											[],
											Type.numberType),
										new IntegerLiteralExpression(new Token("1", false))),
									Type.integerType)))
					] : Statement[])
			], [
				new IfStatement(
					new Token("if", false),
					new LogicalExpression(
						new Token("&&", false),
						new EqualityExpression(
							new Token("==", false),
							new PropertyExpression(
								new Token(".", false),
								new LocalExpression(new Token("$localJumps", true), localJumpsVar),
								new Token("length", true),
								[],
								Type.numberType),
							new IntegerLiteralExpression(new Token("0", false))),
						new LocalExpression(new Token("$raised", true), raisedVar)),
					[ new ThrowStatement(new Token("throw", false), new LocalExpression(new Token("$error", true), errorVar)) ] : Statement[],
					[])
			] : Statement[]);
		var superiorWhileStmt = new WhileStatement(
			new Token("while", false),
			null,
			new BooleanLiteralExpression(new Token("true", false)),
			[ tryStmt ] : Statement[]);

		// set indirect threading loop to the VM
		CPSTransformCommand._extractVM(funcDef)._statements = [ superiorWhileStmt ] : Statement[];

	}

	function _instantiateArrayType (type : Type) : Type {

		var arrayClass = null : TemplateClassDefinition;

		// find array class
		var builtins = this._compiler.getBuiltinParsers()[0];
		for (var i = 0; i < builtins._templateClassDefs.length; ++i) {
			if (builtins._templateClassDefs[i].className() == "Array") {
				arrayClass = builtins._templateClassDefs[i];
				break;
			}
		}
		if (arrayClass == null) {
			throw new Error("logic flaw");
		}

		// instantiate array
		var arrayClassDef = arrayClass.getParser().lookupTemplate(
			[],	// errors
			new TemplateInstantiationRequest(null, "Array", [ type ]),
			(parser, classDef) -> null
		);
		if (arrayClassDef == null) {
			throw new Error("logic flaw");
		}

		// semantic analysis
		var createContext = function (parser : Parser) : AnalysisContext {
			return new AnalysisContext(
				[], // errors
				parser,
				function (parser : Parser, classDef : ClassDefinition) : ClassDefinition {
					classDef.setAnalysisContextOfVariables(createContext(parser));
					classDef.analyze(createContext(parser));
					return classDef;
				});
		};
		var parser = arrayClass.getParser();
		arrayClassDef.resolveTypes(createContext(parser));
		arrayClassDef.analyze(createContext(parser));

		return new ObjectType(arrayClassDef);
	}

	var _outputStatements = null : Statement[];

	function _setOutputStatements (statements : Statement[]) : void {
		this._outputStatements = statements;
	}

	function _getOutputStatements () : Statement[] {
		return this._outputStatements;
	}

	function _emit (statement : Statement) : void {
		this._outputStatements.push(statement);
	}

	function _emitLabelStatement (label : string) : void {
		this._emit(new LabelStatement(label));
	}

	function _emitGotoStatement (label : string) : void {
		this._emit(new GotoStatement(label));
	}

	function _emitExpressionStatement (expr : Expression) : void {
		this._emit(new ExpressionStatement(expr));
	}

	function _emitConditionalBranch (expr : Expression, succLabel : string, failLabel : string) : void {
		this._emit(new IfStatement(
			new Token("if", false),
			expr,
			[ new GotoStatement(succLabel) ] : Statement[],
			[ new GotoStatement(failLabel) ] : Statement[]));
	}

	var _labelStack = new _LabellableStatementTransformer[];

	function _getStatementTransformerByLabel (label : string) : _LabellableStatementTransformer {
		for (var i = 0; this._labelStack.length; ++i) {
			var trans = this._labelStack[i];
			if ((trans.getStatement() as LabellableStatement).getLabel().getValue() == label)
				return trans;
		}
		throw new Error("fatal error: no corresponding transformer for label \"" + label + "\"");
	}

	function _getTopLabelledBlock () : _LabellableStatementTransformer {
		return this._labelStack[this._labelStack.length - 1];
	}

	function _enterLabelledBlock (transformer : _LabellableStatementTransformer) : void {
		this._labelStack.push(transformer);
	}

	function _leaveLabelledBlock () : void {
		this._labelStack.pop();
	}

	var _funcDefs = new MemberFunctionDefinition[];

	function _enterFunction (funcDef : MemberFunctionDefinition) : void {
		this._funcDefs.push(funcDef);

		if (! Type.voidType.equals(funcDef.getReturnType())) {
			var returnLocal = new LocalVariable(new Token("$return", true), funcDef.getReturnType(), false);
			funcDef.getLocals().push(returnLocal);
		}

		var raisedVar = new LocalVariable(new Token("$raised", true), Type.booleanType, false);
		funcDef.getLocals().push(raisedVar);

		var errorVar = new LocalVariable(new Token("$error", true), Type.variantType, false);
		funcDef.getLocals().push(errorVar);
	}

	function _leaveFunction () : void {
		var funcDef = this._funcDefs.pop();
		var returnLocal = CPSTransformCommand._extractReturnLocal(funcDef);

		if (! Type.voidType.equals(funcDef.getReturnType())) {
			funcDef.getStatements().push(new ReturnStatement(new Token("return", false), new LocalExpression(returnLocal.getName(), returnLocal)));
		}
	}

	function _getTransformingFuncDef () : MemberFunctionDefinition {
		return this._funcDefs[this._funcDefs.length - 1];
	}

	function _getStatementTransformerFor (statement : Statement) : _StatementTransformer {
		if (statement instanceof ConstructorInvocationStatement)
			return new _ConstructorInvocationStatementTransformer(this, statement as ConstructorInvocationStatement);
		else if (statement instanceof ExpressionStatement)
			return new _ExpressionStatementTransformer(this, statement as ExpressionStatement);
		else if (statement instanceof FunctionStatement)
			return new _FunctionStatementTransformer(this, statement as FunctionStatement);
		else if (statement instanceof ReturnStatement)
			return new _ReturnStatementTransformer(this, statement as ReturnStatement);
		else if (statement instanceof DeleteStatement)
			return new _DeleteStatementTransformer(this, statement as DeleteStatement);
		else if (statement instanceof BreakStatement)
			return new _BreakStatementTransformer(this, statement as BreakStatement);
		else if (statement instanceof ContinueStatement)
			return new _ContinueStatementTransformer(this, statement as ContinueStatement);
		else if (statement instanceof DoWhileStatement)
			return new _DoWhileStatementTransformer(this, statement as DoWhileStatement);
		else if (statement instanceof ForInStatement)
			return new _ForInStatementTransformer(this, statement as ForInStatement);
		else if (statement instanceof ForStatement)
			return new _ForStatementTransformer(this, statement as ForStatement);
		else if (statement instanceof IfStatement)
			return new _IfStatementTransformer(this, statement as IfStatement);
		else if (statement instanceof SwitchStatement)
			return new _SwitchStatementTransformer(this, statement as SwitchStatement);
		else if (statement instanceof CaseStatement)
			return new _CaseStatementTransformer(this, statement as CaseStatement);
		else if (statement instanceof DefaultStatement)
			return new _DefaultStatementTransformer(this, statement as DefaultStatement);
		else if (statement instanceof WhileStatement)
			return new _WhileStatementTransformer(this, statement as WhileStatement);
		else if (statement instanceof TryStatement)
			return new _TryStatementTransformer(this, statement as TryStatement);
		else if (statement instanceof CatchStatement)
			return new _CatchStatementTransformer(this, statement as CatchStatement);
		else if (statement instanceof ThrowStatement)
			return new _ThrowStatementTransformer(this, statement as ThrowStatement);
		else if (statement instanceof AssertStatement)
			return new _AssertStatementTransformer(this, statement as AssertStatement);
		else if (statement instanceof LogStatement)
			return new _LogStatementTransformer(this, statement as LogStatement);
		else if (statement instanceof DebuggerStatement)
			return new _DebuggerStatementTransformer(this, statement as DebuggerStatement);
		throw new Error("got unexpected type of statement: " + JSON.stringify(statement.serialize()));
	}

	function _getExpressionTransformerFor (expr : Expression) : _ExpressionTransformer {
		if (expr instanceof LocalExpression)
			return new _LeafExpressionTransformer(this, expr as LocalExpression);
		else if (expr instanceof ClassExpression)
			throw new Error("logic flaw");
		else if (expr instanceof NullExpression)
			return new _LeafExpressionTransformer(this, expr as NullExpression);
		else if (expr instanceof BooleanLiteralExpression)
			return new _LeafExpressionTransformer(this, expr as BooleanLiteralExpression);
		else if (expr instanceof IntegerLiteralExpression)
			return new _LeafExpressionTransformer(this, expr as IntegerLiteralExpression);
		else if (expr instanceof NumberLiteralExpression)
			return new _LeafExpressionTransformer(this, expr as NumberLiteralExpression);
		else if (expr instanceof StringLiteralExpression)
			return new _LeafExpressionTransformer(this, expr as StringLiteralExpression);
		else if (expr instanceof RegExpLiteralExpression)
			return new _LeafExpressionTransformer(this, expr as RegExpLiteralExpression);
		else if (expr instanceof ArrayLiteralExpression)
			return new _ArrayLiteralExpressionTransformer(this, expr as ArrayLiteralExpression);
		else if (expr instanceof MapLiteralExpression)
			return new _MapLiteralExpressionTransformer(this, expr as MapLiteralExpression);
		else if (expr instanceof ThisExpression)
			return new _LeafExpressionTransformer(this, expr as ThisExpression);
		else if (expr instanceof BitwiseNotExpression)
			return new _BitwiseNotExpressionTransformer(this, expr as BitwiseNotExpression);
		else if (expr instanceof InstanceofExpression)
			return new _InstanceofExpressionTransformer(this, expr as InstanceofExpression);
		else if (expr instanceof AsExpression)
			return new _AsExpressionTransformer(this, expr as AsExpression);
		else if (expr instanceof AsNoConvertExpression)
			return new _AsNoConvertExpressionTransformer(this, expr as AsNoConvertExpression);
		else if (expr instanceof LogicalNotExpression)
			return new _LogicalNotExpressionTransformer(this, expr as LogicalNotExpression);
		else if (expr instanceof TypeofExpression)
			return new _TypeofExpressionTransformer(this, expr as TypeofExpression);
		else if (expr instanceof PostIncrementExpression)
			return new _PostIncrementExpressionTransformer(this, expr as PostIncrementExpression);
		else if (expr instanceof PreIncrementExpression)
			return new _PreIncrementExpressionTransformer(this, expr as PreIncrementExpression);
		else if (expr instanceof PropertyExpression)
			return new _PropertyExpressionTransformer(this, expr as PropertyExpression);
		else if (expr instanceof SignExpression)
			return new _SignExpressionTransformer(this, expr as SignExpression);
		else if (expr instanceof YieldExpression)
			return new _YieldExpressionTransformer(this, expr as YieldExpression);
		else if (expr instanceof AdditiveExpression)
			return new _AdditiveExpressionTransformer(this, expr as AdditiveExpression);
		else if (expr instanceof ArrayExpression)
			return new _ArrayExpressionTransformer(this, expr as ArrayExpression);
		else if (expr instanceof AssignmentExpression)
			return new _AssignmentExpressionTransformer(this, expr as AssignmentExpression);
		else if (expr instanceof FusedAssignmentExpression)
			return new _FusedAssignmentExpressionTransformer(this, expr as FusedAssignmentExpression);
		else if (expr instanceof BinaryNumberExpression)
			return new _BinaryNumberExpressionTransformer(this, expr as BinaryNumberExpression);
		else if (expr instanceof EqualityExpression)
			return new _EqualityExpressionTransformer(this, expr as EqualityExpression);
		else if (expr instanceof InExpression)
			return new _InExpressionTransformer(this, expr as InExpression);
		else if (expr instanceof LogicalExpression)
			return new _LogicalExpressionTransformer(this, expr as LogicalExpression);
		else if (expr instanceof ShiftExpression)
			return new _ShiftExpressionTransformer(this, expr as ShiftExpression);
		else if (expr instanceof ConditionalExpression)
			return new _ConditionalExpressionTransformer(this, expr as ConditionalExpression);
		else if (expr instanceof CallExpression)
			return new _CallExpressionTransformer(this, expr as CallExpression);
		else if (expr instanceof SuperExpression)
			return new _SuperExpressionTransformer(this, expr as SuperExpression);
		else if (expr instanceof NewExpression)
			return new _NewExpressionTransformer(this, expr as NewExpression);
		else if (expr instanceof FunctionExpression)
			return new _FunctionExpressionTransformer(this, expr as FunctionExpression);
		else if (expr instanceof CommaExpression)
			return new _CommaExpressionTransformer(this, expr as CommaExpression);
		throw new Error("got unexpected type of expression: " + (expr != null ? JSON.stringify(expr.serialize()) : expr.toString()));
	}

	static function _extractVM (funcDef : MemberFunctionDefinition) : MemberFunctionDefinition {
		var funcStmt = funcDef.getStatements()[1] as FunctionStatement;
		return funcStmt.getFuncDef();
	}

	static function _extractVMBody (funcDef : MemberFunctionDefinition) : Statement[] {
		var funcStmt = funcDef.getStatements()[1] as FunctionStatement;
		return funcStmt.getFuncDef().getStatements();
	}

	static function _extractVMDispatchBody (funcDef : MemberFunctionDefinition) : Statement[] {
		var funcStmt = funcDef.getStatements()[1] as FunctionStatement;
		var superiorWhileStmt = funcStmt.getFuncDef().getStatements()[0] as WhileStatement;
		var tryStmt = superiorWhileStmt.getStatements()[0] as TryStatement;
		var inferiorWhileStmt = tryStmt.getTryStatements()[0] as WhileStatement;
		var switchStmt = inferiorWhileStmt.getStatements()[0] as SwitchStatement;
		return switchStmt.getStatements();
	}

	static function _extractLocal (funcDef : MemberFunctionDefinition, name : string) : LocalVariable {
		var locals = funcDef.getLocals();
		for (var i = 0; i < locals.length; ++i) {
			if (locals[i].getName().getValue() == name)
				return locals[i];
		}
		return null;
	}

	static function _extractReturnLocal (funcDef : MemberFunctionDefinition) : LocalVariable {
		return CPSTransformCommand._extractLocal(funcDef, "$return");
	}

	static function _extractNextLocal (funcDef : MemberFunctionDefinition) : ArgumentDeclaration {
		return CPSTransformCommand._extractVM(funcDef).getArguments()[0];
	}

	static function _extractLoopLocal (funcDef : MemberFunctionDefinition) : LocalVariable {
		return CPSTransformCommand._extractLocal(funcDef, "$loop");
	}

	static function _extractLocalJumpsLocal (funcDef : MemberFunctionDefinition) : LocalVariable {
		return CPSTransformCommand._extractLocal(funcDef, "$localJumps");
	}

	static function _extractRaisedLocal (funcDef : MemberFunctionDefinition) : LocalVariable {
		return CPSTransformCommand._extractLocal(funcDef, "$raised");
	}

	static function _extractErrorLocal (funcDef : MemberFunctionDefinition) : LocalVariable {
		return CPSTransformCommand._extractLocal(funcDef, "$error");
	}

}

class ANFTransformCommand extends FunctionTransformCommand {

	static const IDENTIFIER = "anf";

	var _vm : MemberFunctionDefinition;

	function constructor (compiler : Compiler) {
		super(compiler, __CLASS__.IDENTIFIER);
	}

	function _performCPSTransformation (funcDef : MemberFunctionDefinition) : void {
		var cpsTransformer = new CPSTransformCommand(this._compiler);
		cpsTransformer.setup([]);
		cpsTransformer.setTransformYield(true);
		cpsTransformer.setTransformExprs(true);
		cpsTransformer.transformFunction(funcDef);
	}

	override function transformFunction (funcDef : MemberFunctionDefinition) : void {

		this._performCPSTransformation(funcDef);

		// unfold expressions
		this._vm  = CPSTransformCommand._extractVM(funcDef);
		try {
			this._unfoldExpressions(CPSTransformCommand._extractVMDispatchBody(funcDef));
		} finally {
			this._vm = null;
		}

	}

	function _unfoldExpressions (statements : Statement[]) : void {
		for (var i = 0; i < statements.length; ++i) {
			var assignExprs = new AssignmentExpression[];
			Util.forEachStatement(function onStatement(statement) {
				return statement.forEachExpression(function onExpr(expr, replaceCb) {
					if (! (expr instanceof CallExpression))
						return true;

					if (! ((expr as CallExpression).getExpr() instanceof FunctionExpression))
						return true;

					replaceCb(this._unfoldExpr(expr, assignExprs));

					return true;
				}) && statement.forEachStatement(onStatement);
			}, [ statements[i] ]);

			for (var j = assignExprs.length - 1; j >= 0; --j) {
				statements.splice(i, 0, new ExpressionStatement(assignExprs[j]));
			}
			i += assignExprs.length;
		}
	}

	function _unfoldExpr (expr : Expression, assignExprs : AssignmentExpression[]) : Expression {
		if (expr instanceof CallExpression) {
			/** Expected AST structure:
			 *
			 * (function ($aXX) { ... })(primitiveExpr)
			 *
			 */
			var callExpr = expr as CallExpression;
			assert callExpr.getArguments().length == 1;
			assert callExpr.getExpr() instanceof FunctionExpression;

			var funcExpr = callExpr.getExpr() as FunctionExpression;
			assert funcExpr.getFuncDef().getArguments().length == 1;
			var argVar = funcExpr.getFuncDef().getArguments()[0];
			var localVar = new LocalVariable(argVar.getName(), argVar.getType(), false);
			this._vm.getLocals().push(localVar);

			/**
			 * (function ($aXX) { ... })(primitiveExpr)
			 *
			 * -> $aXX = primitiveExpr
			 *    ...
			 */
			assignExprs.push(
				new AssignmentExpression(
					new Token("=", false),
					new LocalExpression(localVar.getName(), localVar),
					callExpr.getArguments()[0]));

			funcExpr.getFuncDef().forEachStatement(function onStmt (stmt) {
				return stmt.forEachExpression(function onExpr (expr) {
					if (expr instanceof LocalExpression) {
						var local = (expr as LocalExpression).getLocal();
						if (local == argVar) {
							(expr as LocalExpression).setLocal(localVar);
						}
					}
					if (expr instanceof FunctionExpression) {
						(expr as FunctionExpression).getFuncDef().forEachStatement(onStmt);
					}
					return expr.forEachExpression(onExpr);
				}) && stmt.forEachStatement(onStmt);
			});

			assert funcExpr.getFuncDef().getStatements().length == 1;
			assert funcExpr.getFuncDef().getStatements()[0] instanceof ReturnStatement;
			var retStmt = funcExpr.getFuncDef().getStatements()[0] as ReturnStatement;

			assert retStmt.getExpr() != null;
			return this._unfoldExpr(retStmt.getExpr(), assignExprs);
		}
		else if (expr instanceof LocalExpression) {
			assert ! ((expr as LocalExpression).getLocal() instanceof ArgumentDeclaration);
			return expr;
		}
		else {
			throw new Error('logic flaw!');
		}
	}

}

class GeneratorTransformCommand extends FunctionTransformCommand {

	static const IDENTIFIER = "generator";

	var _jsxGeneratorObject : TemplateClassDefinition;

	function constructor (compiler : Compiler) {
		super(compiler, GeneratorTransformCommand.IDENTIFIER);
	}

	override function setup(errors : CompileError[]) : void {
		super.setup(errors);

		var builtins = this._compiler.getBuiltinParsers()[0];
		for (var i = 0; i < builtins._templateClassDefs.length; ++i) {
			if (builtins._templateClassDefs[i].className() == "__jsx_generator_object") {
				this._jsxGeneratorObject = builtins._templateClassDefs[i];
				break;
			}
		}

		assert this._jsxGeneratorObject != null;
	}

	override function transformFunction (funcDef : MemberFunctionDefinition) : void {
		if (! funcDef.isGenerator())
			return;

		this._transformGeneratorCore(funcDef);

		// drop IS_GENERATOR flag
		funcDef.setFlags(funcDef.flags() & ~ClassDefinition.IS_GENERATOR);
	}

	function _performANFTransformation (funcDef : MemberFunctionDefinition) : void {
		var anfTransformer = new ANFTransformCommand(this._compiler);
		anfTransformer.setup([]);
		anfTransformer.transformFunction(funcDef);
	}

	function _transformGeneratorCore (funcDef : MemberFunctionDefinition) : void {
		var generatorClassDef = funcDef.getReturnType().getClassDef() as InstantiatedClassDefinition;

		var seedType : Type = null;
		var genType : Type = null;
		if (generatorClassDef.getTypeArguments().length == 2) {
			seedType = generatorClassDef.getTypeArguments()[0];
			genType = generatorClassDef.getTypeArguments()[1];
		}
		else {
			throw new Error("logic flaw!");
		}

		// create a generator object
		var jsxGenType = this._instantiateJSXGeneratorType(seedType, genType);
		var jsxGenLocal = new LocalVariable(new Token("$generator", false), jsxGenType, false);
		funcDef.getLocals().push(jsxGenLocal);

		this._performANFTransformation(funcDef);

		var statements = CPSTransformCommand._extractVMDispatchBody(funcDef);

		var caseCnt = 0;
		statements.forEach(function (statement) {
			if (statement instanceof CaseStatement) {
				caseCnt++;
			}
		});

		// convert Yield and Return
		for (var i = 0; i < statements.length; ++i) {
			// insert return code
			/*
			  $aN = yield $aM;

			  -> $generator.__value = $aM;
			     $generator.__next = K;
			     return;
			  case K:
			     $aN = $generator.__seed;
			*/
			var exprStmt;
			var assignExpr;
			if (statements[i] instanceof ExpressionStatement
			    	&& ((exprStmt = (statements[i] as ExpressionStatement)).getExpr() instanceof AssignmentExpression)
				&& (assignExpr = (exprStmt.getExpr() as AssignmentExpression)).getSecondExpr() instanceof YieldExpression) {
					var yieldExpr = assignExpr.getSecondExpr() as YieldExpression;
					var caseLabel = caseCnt++;
					statements.splice(i, 1,
						new ExpressionStatement(
							new AssignmentExpression(
								new Token("=", false),
								new PropertyExpression(
									new Token(".", false),
									new LocalExpression(new Token("$generator", false), jsxGenLocal),
									new Token("__value", false),
									[],
									genType.toNullableType()),
								yieldExpr.getExpr())),
						new ExpressionStatement(
							new AssignmentExpression(
								new Token("=", false),
								new PropertyExpression(
									new Token(".", false),
									new LocalExpression(new Token("$generator", false), jsxGenLocal),
									new Token("__next", true),
									[],
									Type.integerType.toNullableType()),
								new IntegerLiteralExpression(new Token("" + caseLabel, false)))),
						new ReturnStatement(
							new Token("return", false),
							null),
						new CaseStatement(
							new Token("case", false),
							new IntegerLiteralExpression(new Token("" + caseLabel, false))),
						new ExpressionStatement(
							new AssignmentExpression(
								new Token("=", false),
								assignExpr.getFirstExpr(),
								new PropertyExpression(
									new Token(".", false),
									new LocalExpression(new Token("$generator", false), jsxGenLocal),
									new Token("__seed", true),
									[],
									seedType.toNullableType()))));
					i += 4;
			}
			// insert return code
			/*
			  return;

			  -> $generator.__value = $return;
			     $generator.__next = -1;
			     return;
			*/
			else if (statements[i] instanceof ReturnStatement) {
				statements.splice(i, 0,
					new ExpressionStatement(
						new AssignmentExpression(
							new Token("=", false),
							new PropertyExpression(
								new Token(".", false),
								new LocalExpression(new Token("$generator", false), jsxGenLocal),
								new Token("__value", false),
								[],
								genType.toNullableType()),
							new LocalExpression(
								new Token("$return", true),
								CPSTransformCommand._extractReturnLocal(funcDef)))),
					new ExpressionStatement(
						new AssignmentExpression(
							new Token("=", false),
							new PropertyExpression(
								new Token(".", false),
								new LocalExpression(new Token("$generator", false), jsxGenLocal),
								new Token("__next", true),
								[],
								Type.integerType.toNullableType()),
							new IntegerLiteralExpression(new Token("-1", false)))));
				i += 2;
			}
		}

		// declare generator object
		/*
		  var $generator = new __jsx_generator_object;
		*/
		var newExpr = new NewExpression(new Token("new", false), jsxGenType, []);
		newExpr.analyze(new AnalysisContext([], null, null), null);
		funcDef.getStatements().unshift(new ExpressionStatement(
			new AssignmentExpression(
				new Token("=", false),
				new LocalExpression(new Token("$generator", false), jsxGenLocal),
				newExpr)));

		// replace entry point
		/*
		  $loop(0);
		  return $return;

		  -> $generator.__next = 0;
		     $generator.__loop = $loop;
		 */
		var statements = funcDef.getStatements();
		statements.splice(statements.length - 2, 2,
			new ExpressionStatement(
				new AssignmentExpression(
					new Token("=", false),
					new PropertyExpression(
						new Token(".", false),
						new LocalExpression(new Token("$generator", false), jsxGenLocal),
						new Token("__next", true),
						[],
						Type.integerType.toNullableType()),
					new IntegerLiteralExpression(new Token("0", false)))),
			new ExpressionStatement(
				new AssignmentExpression(
					new Token("=", false),
					new PropertyExpression(
						new Token(".", false),
						new LocalExpression(new Token("$generator", false), jsxGenLocal),
						new Token("__loop", true),
						[],
						new StaticFunctionType(null, Type.voidType, [ Type.integerType ] : Type[], true)),
					new LocalExpression(
						new Token("$loop", true),
						CPSTransformCommand._extractLoopLocal(funcDef)))));

		// return the generator
		statements.push(
			new ReturnStatement(
				new Token("return", false),
				new LocalExpression(new Token("$generator", false), jsxGenLocal)));
	}

	function _instantiateJSXGeneratorType (seedType : Type, genType : Type) : Type {
		// instantiate generator
		var genClassDef = this._jsxGeneratorObject.getParser().lookupTemplate(
			[],	// errors
			new TemplateInstantiationRequest(null, "__jsx_generator_object", [ seedType, genType ]),
			(parser, classDef) -> null
		);
		assert genClassDef != null;

		// semantic analysis
		var createContext = function (parser : Parser) : AnalysisContext {
			return new AnalysisContext(
				[], // errors
				parser,
				function (parser : Parser, classDef : ClassDefinition) : ClassDefinition {
					classDef.setAnalysisContextOfVariables(createContext(parser));
					classDef.analyze(createContext(parser));
					return classDef;
				});
		};
		var parser = this._jsxGeneratorObject.getParser();
		genClassDef.resolveTypes(createContext(parser));
		genClassDef.analyze(createContext(parser));

		return new ObjectType(genClassDef);
	}

}
