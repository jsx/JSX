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

import "./compiler.jsx";
import "./analysis.jsx";
import "./classdef.jsx";
import "./expression.jsx";
import "./statement.jsx";
import "./parser.jsx";
import "./type.jsx";
import "./util.jsx";
import "./emitter.jsx";

abstract class _ExpressionTransformer {

	static var _expressionCountMap = new Map.<number>;

	var _transformer : CodeTransformer;
	var _id : number;

	function constructor (transformer : CodeTransformer, identifier : string) {
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

	function constructor (transformer : CodeTransformer, identifier : string) {
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
			newArgs.push(this._transformer._createFreshArgumentDeclaration(exprs[i].getType()));
		}
		var newArgLocals = new Expression[];
		for (var i = 0; i < exprs.length; ++i) {
			newArgLocals.push(new LocalExpression(exprs[i].getToken(), newArgs[i]));
		}

		var topExpr = null : Expression;
		var rootFuncDef = null : MemberFunctionDefinition;
		var prevFuncDef = parent;

		for (var i = 0; i < exprs.length; ++i) {
			var funcDef = this._transformer._createAnonymousFunction(prevFuncDef, this.getExpression().getToken(), [ newArgs[i] ], returnType);
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

	function constructor (transformer : CodeTransformer, expr : LeafExpression) {
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

	function constructor (transformer : CodeTransformer, expr : ArrayLiteralExpression) {
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

	function constructor (transformer : CodeTransformer, expr : MapLiteralExpression) {
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

	function constructor (transformer : CodeTransformer, expr : FunctionExpression) {
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

	function constructor (transformer : CodeTransformer, expr : UnaryExpression) {
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

	function constructor (transformer : CodeTransformer, expr : BitwiseNotExpression) {
		super(transformer, expr);
	}

	override function _clone (arg : Expression) : UnaryExpression {
		return new BitwiseNotExpression(this._expr.getToken(), arg);
	}

}

class _InstanceofExpressionTransformer extends _UnaryExpressionTransformer {

	function constructor (transformer : CodeTransformer, expr : InstanceofExpression) {
		super(transformer, expr);
	}

	override function _clone (arg : Expression) : UnaryExpression {
		return new InstanceofExpression(this._expr.getToken(), arg, (this._expr as InstanceofExpression).getExpectedType());
	}

}

class _AsExpressionTransformer extends _UnaryExpressionTransformer {

	function constructor (transformer : CodeTransformer, expr : AsExpression) {
		super(transformer, expr);
	}

	override function _clone (arg : Expression) : UnaryExpression {
		return new AsExpression(this._expr.getToken(), arg, this._expr.getType());
	}

}

class _AsNoConvertExpressionTransformer extends _UnaryExpressionTransformer {

	function constructor (transformer : CodeTransformer, expr : AsNoConvertExpression) {
		super(transformer, expr);
	}

	override function _clone (arg : Expression) : UnaryExpression {
		return new AsNoConvertExpression(this._expr.getToken(), arg, this._expr.getType());
	}

}

class _LogicalNotExpressionTransformer extends _UnaryExpressionTransformer {

	function constructor (transformer : CodeTransformer, expr : LogicalNotExpression) {
		super(transformer, expr);
	}

	override function _clone (arg : Expression) : UnaryExpression {
		return new LogicalNotExpression(this._expr.getToken(), arg);
	}

}

abstract class _IncrementExpressionTransformer extends _UnaryExpressionTransformer {

	function constructor (transformer : CodeTransformer, expr : IncrementExpression) {
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

	function constructor (transformer : CodeTransformer, expr : IncrementExpression) {
		super(transformer, expr);
	}

	override function _clone (arg : Expression) : UnaryExpression {
		return new PostIncrementExpression(this._expr.getToken(), arg);
	}

}

class _PreIncrementExpressionTransformer extends _IncrementExpressionTransformer {

	function constructor (transformer : CodeTransformer, expr : IncrementExpression) {
		super(transformer, expr);
	}

	override function _clone (arg : Expression) : UnaryExpression {
		return new PreIncrementExpression(this._expr.getToken(), arg);
	}

}

class _PropertyExpressionTransformer extends _MultiaryOperatorTransformer {

	var _expr : PropertyExpression;

	function constructor (transformer : CodeTransformer, expr : PropertyExpression) {
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

	function constructor (transformer : CodeTransformer, expr : TypeofExpression) {
		super(transformer, expr);
	}

	override function _clone (arg : Expression) : UnaryExpression {
		return new TypeofExpression(this._expr.getToken(), arg);
	}

}

class _SignExpressionTransformer extends _UnaryExpressionTransformer {

	function constructor (transformer : CodeTransformer, expr : SignExpression) {
		super(transformer, expr);
	}

	override function _clone (arg : Expression) : UnaryExpression {
		return new SignExpression(this._expr.getToken(), arg);
	}

}

abstract class _BinaryExpressionTransformer extends _MultiaryOperatorTransformer {

	var _expr : BinaryExpression;

	function constructor (transformer : CodeTransformer, expr : BinaryExpression) {
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

	function constructor (transformer : CodeTransformer, expr : AdditiveExpression) {
		super(transformer, expr);
	}

	override function _clone (arg1 : Expression, arg2 : Expression) : BinaryExpression {
		var ret = new AdditiveExpression(this._expr.getToken(), arg1, arg2);
		ret._type = (this._expr as AdditiveExpression)._type;
		return ret;
	}

}

class _ArrayExpressionTransformer extends _BinaryExpressionTransformer {

	function constructor (transformer : CodeTransformer, expr : ArrayExpression) {
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

	function constructor (transformer : CodeTransformer, expr : AssignmentExpression) {
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

	function constructor (transformer : CodeTransformer, expr : FusedAssignmentExpression) {
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

	function constructor (transformer : CodeTransformer, expr : BinaryNumberExpression) {
		super(transformer, expr);
	}

	override function _clone (arg1 : Expression, arg2 : Expression) : BinaryExpression {
		return new BinaryNumberExpression(this._expr.getToken(), arg1, arg2);
	}

}

class _EqualityExpressionTransformer extends _BinaryExpressionTransformer {

	function constructor (transformer : CodeTransformer, expr : EqualityExpression) {
		super(transformer, expr);
	}

	override function _clone (arg1 : Expression, arg2 : Expression) : BinaryExpression {
		return new EqualityExpression(this._expr.getToken(), arg1, arg2);
	}

}

class _InExpressionTransformer extends _BinaryExpressionTransformer {

	function constructor (transformer : CodeTransformer, expr : InExpression) {
		super(transformer, expr);
	}

	override function _clone (arg1 : Expression, arg2 : Expression) : BinaryExpression {
		return new InExpression(this._expr.getToken(), arg1, arg2);
	}

}

class _LogicalExpressionTransformer extends _ExpressionTransformer {

	var _expr : LogicalExpression;

	function constructor (transformer : CodeTransformer, expr : LogicalExpression) {
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

		var argVar = this._transformer._createFreshArgumentDeclaration(this._expr.getFirstExpr().getType());
		var contFuncDef = this._transformer._createAnonymousFunction(parent, null, [ argVar ], returnType);

		// `var $C = C;`
		var contVar : LocalVariable = null;
		if (continuation != null) {
			contVar = this._transformer._createFreshLocalVariable(continuation.getType());
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

	function constructor (transformer : CodeTransformer, expr : ShiftExpression) {
		super(transformer, expr);
	}

	override function _clone (arg1 : Expression, arg2 : Expression) : BinaryExpression {
		return new ShiftExpression(this._expr.getToken(), arg1, arg2);
	}

}

class _ConditionalExpressionTransformer extends _ExpressionTransformer {

	var _expr : ConditionalExpression;

	function constructor (transformer : CodeTransformer, expr : ConditionalExpression) {
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

		var argVar = this._transformer._createFreshArgumentDeclaration(this._expr.getCondExpr().getType());

		var contFuncDef = this._transformer._createAnonymousFunction(parent, null, [ argVar ], returnType);

		// `var $C = C;`
		var contVar : LocalVariable = null;
		if (continuation != null) {
			contVar = this._transformer._createFreshLocalVariable(continuation.getType());
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

	function constructor (transformer : CodeTransformer, expr : CallExpression) {
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
		} else if (this._transformer.getEmitter().isSpecialCall(this._expr)) {
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
		} else if (this._transformer.getEmitter().isSpecialCall(this._expr)) {
			return new CallExpression(new Token("(", false), this._expr.getExpr(), exprs);
		} else {
			return new CallExpression(new Token("(", false), exprs[0], exprs.slice(1));
		}
	}

}

class _SuperExpressionTransformer extends _MultiaryOperatorTransformer {

	var _expr : SuperExpression;

	function constructor (transformer : CodeTransformer, expr : SuperExpression) {
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

	function constructor (transformer : CodeTransformer, expr : NewExpression) {
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

	function constructor (transformer : CodeTransformer, expr : CommaExpression) {
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

	var _transformer : CodeTransformer;
	var _id : number;

	function constructor (transformer : CodeTransformer, identifier : string) {
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
			var funcDef = this._transformer.getTransformingFuncDef();
			this.getStatement().forEachExpression(function (expr, replaceCb) {
				replaceCb(this._transformer._getExpressionTransformerFor(expr).doCPSTransform(funcDef, null, expr.getType()));
				return true;
			});
		}
		this._replaceControlStructuresWithGotos();
	}

	abstract function _replaceControlStructuresWithGotos () : void;

}

class _ConstructorInvocationStatementTransformer extends _StatementTransformer {

	var _statement : ConstructorInvocationStatement;

	function constructor (transformer : CodeTransformer, statement : ConstructorInvocationStatement) {
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

	function constructor (transformer : CodeTransformer, statement : ExpressionStatement) {
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

	function constructor (transformer : CodeTransformer, statement : FunctionStatement) {
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

	function constructor (transformer : CodeTransformer, statement : ReturnStatement) {
		super(transformer, "RETURN");
		this._statement = statement;
	}

	override function getStatement () : Statement {
		return this._statement;
	}

	override function _replaceControlStructuresWithGotos () : void {
		if (this._statement.getExpr() != null) {
			var returnLocal = this._transformer._getTopReturnLocal();

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
		this._transformer._emit(new GotoStatement("$L_exit"));
	}

}

class _YieldStatementTransformer extends _StatementTransformer {

	var _statement : YieldStatement;

	function constructor (transformer : CodeTransformer, statement : YieldStatement) {
		super(transformer, "YIELD");
		this._statement = statement;
	}

	override function getStatement () : Statement {
		return this._statement;
	}

	override function _replaceControlStructuresWithGotos () : void {
		this._transformer._emit(this._statement);
		// split the continuation
		var label = "$L_yield_" + this.getID();
		this._transformer._emit(new GotoStatement(label));
		this._transformer._emit(new LabelStatement(label));
	}

}

class _DeleteStatementTransformer extends _StatementTransformer {

	var _statement : DeleteStatement;

	function constructor (transformer : CodeTransformer, statement : DeleteStatement) {
		super(transformer, "DELETE");
		this._statement = statement;
	}

	override function getStatement () : Statement {
		return this._statement;
	}

	override function replaceControlStructuresWithGotos () : void {
		if (this._transformer._transformExprs) {
			var funcDef = this._transformer.getTransformingFuncDef();
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

		function constructor (transformer : CodeTransformer, statement : DeleteStatement) {
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

	function constructor (transformer : CodeTransformer, statement : BreakStatement) {
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
		this._transformer._emit(new GotoStatement(label));
	}

}

class _ContinueStatementTransformer extends _StatementTransformer {

	var _statement : ContinueStatement;

	function constructor (transformer : CodeTransformer, statement : ContinueStatement) {
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
		this._transformer._emit(new GotoStatement(label));
	}

}

abstract class _LabellableStatementTransformer extends _StatementTransformer {

	function constructor (transformer : CodeTransformer, identifier : string) {
		super(transformer, identifier);
	}

	abstract function getBreakingLabel () : string;
	abstract function getContinuingLabel () : string;

}

class _DoWhileStatementTransformer extends _LabellableStatementTransformer {

	var _statement : DoWhileStatement;

	function constructor (transformer : CodeTransformer, statement : DoWhileStatement) {
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
		this._transformer._emit(new GotoStatement(bodyLabel));
		this._transformer._emit(new LabelStatement(bodyLabel));
		this._transformer._enterLabelledBlock(this);
		this._statement.getStatements().forEach((statement) -> {
			this._transformer._getStatementTransformerFor(statement).replaceControlStructuresWithGotos();
		});
		this._transformer._leaveLabelledBlock();
		var testLabel = "$L_test_do_while_" + this.getID();
		this._transformer._emit(new GotoStatement(testLabel));
		this._transformer._emit(new LabelStatement(testLabel));
		var endLabel = "$L_end_do_while_" + this.getID();
		this._transformer._emitConditionalBranch(this._statement.getExpr(), bodyLabel, endLabel);
		this._transformer._emit(new LabelStatement(endLabel));
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

	function constructor (transformer : CodeTransformer, statement : ForInStatement) {
		super(transformer, "FOR-IN");
		this._statement = statement;
	}

	override function getStatement () : Statement {
		return this._statement;
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

	function constructor (transformer : CodeTransformer, statement : ForStatement) {
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
		this._transformer._emit(new GotoStatement(initLabel));
		this._transformer._emit(new LabelStatement(initLabel));
		if (this._statement.getInitExpr() != null) {
			this._transformer._emitExpressionStatement(this._statement.getInitExpr());
		}
		var testLabel = "$L_test_for_" + this.getID();
		this._transformer._emit(new GotoStatement(testLabel));
		this._transformer._emit(new LabelStatement(testLabel));
		var bodyLabel = "$L_body_for_" + this.getID();
		var endLabel = "$L_end_for_" + this.getID();
		if (this._statement.getCondExpr() != null) {
			this._transformer._emitConditionalBranch(this._statement.getCondExpr(), bodyLabel, endLabel);
		} else {
			this._transformer._emitConditionalBranch(new BooleanLiteralExpression(new Token("true", false)), bodyLabel, endLabel);
		}
		this._transformer._emit(new LabelStatement(bodyLabel));
		this._transformer._enterLabelledBlock(this);
		this._statement.getStatements().forEach((statement) -> {
			this._transformer._getStatementTransformerFor(statement).replaceControlStructuresWithGotos();
		});
		this._transformer._leaveLabelledBlock();
		var postLabel = "$L_post_for_" + this.getID();
		this._transformer._emit(new GotoStatement(postLabel));
		this._transformer._emit(new LabelStatement(postLabel));
		if (this._statement.getPostExpr() != null) {
			this._transformer._emitExpressionStatement(this._statement.getPostExpr());
		}
		this._transformer._emit(new GotoStatement(testLabel));
		this._transformer._emit(new LabelStatement(endLabel));
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

	function constructor (transformer : CodeTransformer, statement : IfStatement) {
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
		this._transformer._emit(new GotoStatement(testLabel));
		this._transformer._emit(new LabelStatement(testLabel));
		this._transformer._emitConditionalBranch(this._statement.getExpr(), succLabel, failLabel);
		this._transformer._emit(new LabelStatement(succLabel));
		this._statement.getOnTrueStatements().forEach((statement) -> {
			this._transformer._getStatementTransformerFor(statement).replaceControlStructuresWithGotos();
		});
		var endLabel = "$L_end_if_" + this.getID();
		this._transformer._emit(new GotoStatement(endLabel));
		this._transformer._emit(new LabelStatement(failLabel));
		this._statement.getOnFalseStatements().forEach((statement) -> {
			this._transformer._getStatementTransformerFor(statement).replaceControlStructuresWithGotos();
		});
		this._transformer._emit(new GotoStatement(endLabel));
		this._transformer._emit(new LabelStatement(endLabel));
	}

}

class _SwitchStatementTransformer extends _LabellableStatementTransformer {

	var _statement : SwitchStatement;

	function constructor (transformer : CodeTransformer, statement : SwitchStatement) {
		super(transformer, "SWITCH");
		this._statement = statement;
		// create and register a stash
		statement.getStatements().forEach((statement) -> {
			if (statement instanceof CaseStatement) {
				statement.setStash(_SwitchStatementTransformer.CaseStash.ID, new _SwitchStatementTransformer.CaseStash);
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


		goto $TEST_SWITCH_n;
	$TEST_SWITCH_n;
		switch (expr) {
		case x:
			goto $SWITCH_n_CASE_x;
			return;	// necessary even if it's fall-through because every goto never returns!
		case y:
			goto $SWITCH_n_CASE_y;
			return;
		default:
			goto $SWITCH_n_DEFAULT;
			return;
		}
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
		var testLabel = "$L_test_switch_" + this.getID();
		this._transformer._emit(new GotoStatement(testLabel));
		this._transformer._emit(new LabelStatement(testLabel));
		this._emitConditionalSwitch();
		var endLabel = "$L_end_switch_" + this.getID();
		this._transformer._emit(new GotoStatement(endLabel));
		this._emitSwitchBodies();
		this._transformer._emit(new LabelStatement(endLabel));
	}

	function _emitConditionalSwitch () : void {
		var statements = this._statement.getStatements();
		var switchCases = new Statement[];
		for (var i = 0; i < statements.length; ++i) {
			var stmt = statements[i];
			if (stmt instanceof CaseStatement) {
				switchCases.push(stmt);
				switchCases.push(new GotoStatement(this._getLabelFromCaseStatement(stmt as CaseStatement)));
				switchCases.push(new BreakStatement(new Token("break", false), null));
			} else if (stmt instanceof DefaultStatement) {
				switchCases.push(stmt);
				switchCases.push(new GotoStatement(this._getLabelFromDefaultStatement()));
				switchCases.push(new BreakStatement(new Token("break", false), null));
			}
		}
		this._transformer._emit(new SwitchStatement(
			this._statement.getToken(),
			this._statement.getLabel(),
			this._statement.getExpr(),
			switchCases));
	}

	function _emitSwitchBodies () : void {
		var statements = this._statement.getStatements();

		this._transformer._enterLabelledBlock(this);
		for (var i = 0; i < statements.length; ++i) {
			var stmt = statements[i];
			if (stmt instanceof CaseStatement) {
				var label = this._getLabelFromCaseStatement(stmt as CaseStatement);
				this._transformer._emit(new GotoStatement(label));
				this._transformer._emit(new LabelStatement(label));
			} else if (stmt instanceof DefaultStatement) {
				label = this._getLabelFromDefaultStatement();
				this._transformer._emit(new GotoStatement(label));
				this._transformer._emit(new LabelStatement(label));
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

	function constructor (transformer : CodeTransformer, statement : CaseStatement) {
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

	function constructor (transformer : CodeTransformer, statement : DefaultStatement) {
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

	function constructor (transformer : CodeTransformer, statement : WhileStatement) {
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
		this._transformer._emit(new GotoStatement(testLabel));
		this._transformer._emit(new LabelStatement(testLabel));
		var bodyLabel = "$L_body_while_" + this.getID();
		var endLabel = "$L_end_while_" + this.getID();
		this._transformer._emitConditionalBranch(this._statement.getExpr(), bodyLabel, endLabel);
		this._transformer._emit(new LabelStatement(bodyLabel));
		this._transformer._enterLabelledBlock(this);
		this._statement.getStatements().forEach((statement) -> {
			this._transformer._getStatementTransformerFor(statement).replaceControlStructuresWithGotos();
		});
		this._transformer._leaveLabelledBlock();
		this._transformer._emit(new GotoStatement(testLabel));
		this._transformer._emit(new LabelStatement(endLabel));
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

	function constructor (transformer : CodeTransformer, statement : TryStatement) {
		super(transformer, "TRY");
		this._statement = statement;
	}

	override function getStatement () : Statement {
		return this._statement;
	}

	override function _replaceControlStructuresWithGotos () : void {
		throw new Error("logic flaw");
	}

}

class _CatchStatementTransformer extends _StatementTransformer {

	var _statement : CatchStatement;

	function constructor (transformer : CodeTransformer, statement : CatchStatement) {
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

	function constructor (transformer : CodeTransformer, statement : ThrowStatement) {
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

	function constructor (transformer : CodeTransformer, statement : AssertStatement) {
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

	function constructor (transformer : CodeTransformer, statement : LogStatement) {
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

	function constructor (transformer : CodeTransformer, statement : DebuggerStatement) {
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

class BasicBlock {

	var _label : LabelStatement;
	var _body : Statement[];

	function constructor (label : LabelStatement, body : Statement[]) {
		this._label = label;
		this._body = body;
	}

	function getBody () : Statement[] {
		return this._body;
	}

	function getLabel () : LabelStatement {
		return this._label;
	}

}

class CodeTransformer {

	var _forceTransform : boolean;
	var _transformExprs : boolean;

	var _compiler : Compiler;
	var _emitter : Emitter;

	var _stopIterationClassDef : ClassDefinition;
	var _jsxGeneratorClassDef : TemplateClassDefinition;

	function constructor () {
		this._forceTransform = false;
		this._transformExprs = false;

		this._stopIterationClassDef = null;
		this._jsxGeneratorClassDef = null;
	}

	function setup (compiler : Compiler, emitter : Emitter) : CodeTransformer {
		this._compiler = compiler;
		this._emitter = emitter;
		var builtins = compiler.getBuiltinParsers()[0];

		// get built-in classes related to generators
		this._stopIterationClassDef = builtins.lookup([], null, "StopIteration");
		for (var i = 0; i < builtins._templateClassDefs.length; ++i) {
			if (builtins._templateClassDefs[i].className() == "__jsx_generator") {
				this._jsxGeneratorClassDef = builtins._templateClassDefs[i];
				break;
			}
		}

		assert this._stopIterationClassDef != null;
		assert this._jsxGeneratorClassDef != null;

		return this;
	}

	function setForceTransform (force : boolean) : void {
		this._forceTransform = force;
	}

	function getEmitter () : Emitter {
		return this._emitter;
	}

	function _functionIsTransformable (funcDef : MemberFunctionDefinition) : boolean {
		if (funcDef instanceof TemplateFunctionDefinition)
			return false;
		if (funcDef.getStatements() == null)
			return false;
		if (funcDef.getNameToken() != null && funcDef.name() == "constructor")
			return false;
		return funcDef.forEachStatement(function onStatement (statement) {
			if (statement instanceof YieldStatement)
				return false;
			if (statement instanceof ForInStatement)
				return false;
			if (statement instanceof TryStatement)
				return false;
			return statement.forEachStatement(onStatement);
		});
	}

	function _getAllClosures () : MemberFunctionDefinition[] {
		var closures = new MemberFunctionDefinition[];
		this._compiler.forEachClassDef(function (parser, classDef) {
			return classDef.forEachMember(function onMember(member) {
				member.forEachClosure(function (funcDef) {
					return onMember(funcDef);
				});
				if (member instanceof MemberFunctionDefinition) {
					closures.push(member as MemberFunctionDefinition);
				}
				return true;
			});
		});
		return closures;
	}

	function performTransformation () : void {
		if (this._forceTransform) {
			var transformExprs = this._transformExprs;
			try {
				// force transform expressions
				this._transformExprs = true;

				// transform functions as many as possible
				this._getAllClosures().forEach((funcDef) -> {
					if (this._functionIsTransformable(funcDef)) {
						this._doCPSTransform(funcDef);
					}
				});
			} finally {
				this._transformExprs = transformExprs;
			}
		}
		// transform generators
		this._getAllClosures().forEach((funcDef) -> {
			if (funcDef.isGenerator()) {
				this._transformGenerator(funcDef);
			}
		});
	}

	function _transformGenerator (funcDef : MemberFunctionDefinition) : void {
		this._compileYields(funcDef);
	}

	var _transformingFuncDef : MemberFunctionDefinition = null;

	function getTransformingFuncDef () : MemberFunctionDefinition {
		return this._transformingFuncDef;
	}

	function _doCPSTransform (funcDef : MemberFunctionDefinition) : void {
		this._doCPSTransform(funcDef, function (blocks) {
			this._eliminateGotosByClosures(funcDef, blocks, function (block) {
			});
		});
	}

	function _doCPSTransform (funcDef : MemberFunctionDefinition, eliminateGotos : (BasicBlock[]) -> void) : void {
		this._transformingFuncDef = funcDef;

		var statements = new Statement[];

		var returnLocal : LocalVariable = null;
		if (! Type.voidType.equals(funcDef.getReturnType())) {
			var returnLocalName = "$return" + CodeTransformer._getFunctionNestDepth(funcDef);
			returnLocal = new LocalVariable(new Token(returnLocalName, false), funcDef.getReturnType());
			funcDef.getLocals().push(returnLocal);
			this._enterFunction(returnLocal);
		}

		// replace control structures with goto statements
		this._setOutputStatements(statements);
		for (var i = 0; i < funcDef.getStatements().length; ++i) {
			this._getStatementTransformerFor(funcDef.getStatements()[i]).replaceControlStructuresWithGotos();
		}
		// insert prologue code
		statements.unshift(
			new GotoStatement("$L_enter"),
			new LabelStatement("$L_enter")
		);
		// insert epilogue code
		statements.push(
			new GotoStatement("$L_exit"),
			new LabelStatement("$L_exit")
		);

		if (! Type.voidType.equals(funcDef.getReturnType())) {
			statements.push(new ReturnStatement(new Token("return", false), new LocalExpression(returnLocal.getName(), returnLocal)));
			this._leaveFunction();
		} else {
			statements.push(new ReturnStatement(new Token("return", false), null));
		}

		// build basic blocks
		var basicBlocks = this._buildBasicBlocks(statements);

		// replace goto statements with calls of closures by the strategy depending on 'eliminateGotos'
		eliminateGotos(basicBlocks);
	}

	function _buildBasicBlocks (statements : Statement[]) : BasicBlock[] {
		var basicBlocks = new BasicBlock[];

		// entry block
		var entry = new Statement[];
		for (var i = 0; i < statements.length; ++i) {
			if (statements[i] instanceof LabelStatement) { // until first label
				break;
			}
			entry.push(statements[i]);
		}
		basicBlocks.push(new BasicBlock(null, entry));

		// remaining basic blocks
		var currentLabel : LabelStatement = null;
		while (i < statements.length) {
			var currentLabel = statements[i] as LabelStatement;

			// read the block
			var body = new Statement[];
			++i;
			for (; i < statements.length; ++i) {
				if (statements[i] instanceof LabelStatement) {
					break;
				}
				body.push(statements[i]);
			}
			basicBlocks.push(new BasicBlock(currentLabel, body));
		}

		return basicBlocks;
	}

	function _eliminateGotosByClosures (funcDef : MemberFunctionDefinition, basicBlocks : BasicBlock[], postGotoEliminationCb : (BasicBlock) -> void) : void {
		// collect labels
		var labels = new Map.<LocalVariable>;
		basicBlocks.forEach(function (basicBlock) {
			if (basicBlock.getLabel() == null) // the entry block
				return;
			var name = basicBlock.getLabel().getName();
			labels[name] = new LocalVariable(new Token(name, true), new StaticFunctionType(null, Type.voidType, [], true));
			funcDef.getLocals().push(labels[name]);
		});
		// replace gotos with a function call (and a return statement)
		basicBlocks.forEach(function (basicBlock) {
			var statements = basicBlock.getBody();
			for (var i = 0; i < statements.length; ++i) {
				var stmt = statements[i];
				if (stmt instanceof GotoStatement) {
					var name = (stmt as GotoStatement).getLabel();
					statements[i] = new ReturnStatement(new Token("return", false), new CallExpression(new Token("(", false), new LocalExpression(null, labels[name]), []));
				} else if (stmt instanceof IfStatement) {
					var ifStmt = stmt as IfStatement;
					var succLabel = (ifStmt.getOnTrueStatements()[0] as GotoStatement).getLabel();
					ifStmt.getOnTrueStatements()[0] = new ReturnStatement(new Token("return", false), new CallExpression(new Token("(", false), new LocalExpression(null, labels[succLabel]), []));
					var failLabel = (ifStmt.getOnFalseStatements()[0] as GotoStatement).getLabel();
					ifStmt.getOnFalseStatements()[0] = new ReturnStatement(new Token("return", false), new CallExpression(new Token("(", false), new LocalExpression(null, labels[failLabel]), []));
				} else if (stmt instanceof SwitchStatement) {
					var switchStmt = stmt as SwitchStatement;
					for (var j = 0; j < switchStmt.getStatements().length; ++j) {
						if (switchStmt.getStatements()[j] instanceof GotoStatement) {
							name = (switchStmt.getStatements()[j] as GotoStatement).getLabel();
							switchStmt.getStatements()[j] = new ReturnStatement(new Token("return", false), new CallExpression(new Token("(", false), new LocalExpression(null, labels[name]), []));
						}
					}
				}
			}
		});
		basicBlocks.forEach(postGotoEliminationCb);
		// pack the blocks into closures
		var statements = new Statement[];
		for (var i = 1; i < basicBlocks.length; ++i) {
			// create a function block
			var block = this._createAnonymousFunction(funcDef, null, [], this._transformingFuncDef.getReturnType());
			block._statements = basicBlocks[i].getBody();
			statements.push(new ExpressionStatement(
				new AssignmentExpression(
					new Token("=", false),
					new LocalExpression(null, labels[basicBlocks[i].getLabel().getName()]),
					new FunctionExpression(new Token("function", false), block))));
		}
		funcDef._statements = statements.concat(basicBlocks[0].getBody());
	}

	function _compileYields(funcDef : MemberFunctionDefinition) : void { // FIXME wasabiz nested generator
		var yieldingType = (funcDef.getReturnType().getClassDef() as InstantiatedClassDefinition).getTypeArguments()[0];

		// create a generator object
		var genType = this._instantiateGeneratorType(yieldingType);
		var genLocalName = "$generator" + CodeTransformer._getGeneratorNestDepth(funcDef);
		var genLocal = new LocalVariable(new Token(genLocalName, false), genType);
		funcDef.getLocals().push(genLocal);

		// insert epilogue code `throw new StopIteration`
		var newExpr = new NewExpression(new Token("new", false), new ObjectType(this._stopIterationClassDef), []);
		newExpr.analyze(new AnalysisContext([], null, null), null);
		funcDef.getStatements().push(new ThrowStatement(new Token("throw", false), newExpr));

		// replace yield statement
		/*
		  yield expr;
		  $LABEL();

		  -> $generatorN.__value = expr;
		     $generatorN.__next = $LABEL;
		 */
		this._doCPSTransform(funcDef, function (blocks) : void {
			this._eliminateGotosByClosures(funcDef, blocks, function (block) {
				this._replaceYieldsWithContinuationSaves(block, yieldingType, genLocal);
			});
		});

		// declare generator object
		/*
		  var $generatorN = new __jsx_generator;
		*/
		var newExpr = new NewExpression(new Token("new", false), genType, []);
		newExpr.analyze(new AnalysisContext([], null, null), null);
		funcDef.getStatements().unshift(new ExpressionStatement(
			new AssignmentExpression(
				new Token("=", false),
				new LocalExpression(new Token(genLocalName, false), genLocal),
				newExpr)));

		// replace entry point
		/*
		  $L_enter();

		  -> $generatorN.__next = $L_enter;
		 */
		var statements = funcDef.getStatements();
		statements.splice(statements.length - 1, 1,
			new ExpressionStatement(
				new AssignmentExpression(
					new Token("=", false),
					new PropertyExpression(
						new Token(".", false),
						new LocalExpression(new Token(genLocalName, false), genLocal),
						new Token("__next", true),
						[],
						new StaticFunctionType(null, this._transformingFuncDef.getReturnType(), [], true)),
					new LocalExpression(
						new Token("$L_enter", true),
						(((statements[statements.length - 1] as ReturnStatement).getExpr() as CallExpression).getExpr() as LocalExpression).getLocal()))));

		// return the generator
		statements.push(
			new ReturnStatement(
				new Token("return", false),
				new LocalExpression(new Token("$generator", false), genLocal)));
	}

	function _replaceYieldsWithContinuationSaves (block : BasicBlock, yieldingType : Type, local : LocalVariable) : void {
		var statements = block.getBody();
		if (2 <= statements.length && statements[statements.length - 2] instanceof YieldStatement) {
			var idx = statements.length - 2;
			statements.splice(idx, 2,
				new ExpressionStatement(
					new AssignmentExpression(
						new Token("=", false),
						new PropertyExpression(
							new Token(".", false),
							new LocalExpression(new Token(local.getName().getValue(), false), local),
							new Token("__value", false),
							[],
							yieldingType),
						(statements[idx] as YieldStatement).getExpr())),
				new ExpressionStatement(
					new AssignmentExpression(
						new Token("=", false),
						new PropertyExpression(
							new Token(".", false),
							new LocalExpression(new Token(local.getName().getValue(), false), local),
							new Token("__next", true),
							[],
							new StaticFunctionType(null, this._transformingFuncDef.getReturnType(), [], true)),
						((statements[idx + 1] as ReturnStatement).getExpr()as CallExpression).getExpr())));
		}
	}

	function _instantiateGeneratorType (yieldingType : Type) : Type {
		// instantiate generator
		var genClassDef = this._jsxGeneratorClassDef.getParser().lookupTemplate(
			[],	// errors
			new TemplateInstantiationRequest(null, "__jsx_generator", [ yieldingType ] : Type[]),
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
		var parser = this._jsxGeneratorClassDef.getParser();
		genClassDef.resolveTypes(createContext(parser));
		genClassDef.analyze(createContext(parser));

		return new ObjectType(genClassDef);
	}

	static function _getGeneratorNestDepth (funcDef : MemberFunctionDefinition) : number {
		var depth = 0;
		var parent : MemberFunctionDefinition;
		while ((parent = funcDef.getParent()) != null) {
			if (parent.isGenerator())
				depth++;
			funcDef = parent;
		}
		return depth;
	}

	static function _getFunctionNestDepth (funcDef : MemberFunctionDefinition) : number {
		var depth = 0;
		var parent : MemberFunctionDefinition;
		while ((parent = funcDef.getParent()) != null) {
			depth++;
			funcDef = parent;
		}
		return depth;
	}

	var _outputStatements = null : Statement[];

	function _setOutputStatements (statements : Statement[]) : void {
		this._outputStatements = statements;
	}

	function _emit (statement : Statement) : void {
		this._outputStatements.push(statement);
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

	function _getStatementTransformerByLabel (labelName : string) : _LabellableStatementTransformer {
		var label;
		for (var i = 0; this._labelStack.length; ++i) {
			var transformer = this._labelStack[i];
			if ((label = (transformer.getStatement() as LabellableStatement).getLabel()) != null
				&& label.getValue() == labelName)
					return transformer;
		}
		throw new Error("fatal error: no corresponding transformer for label \"" + labelName + "\"");
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

	var _returnLocals = new LocalVariable[];

	function _getTopReturnLocal () : LocalVariable {
		return this._returnLocals[this._returnLocals.length - 1];
	}

	function _enterFunction (returnLocal : LocalVariable) : void {
		this._returnLocals.push(returnLocal);
	}

	function _leaveFunction () : void {
		this._returnLocals.pop();
	}

	var _numUniqVar = 0;

	function _createFreshArgumentDeclaration (type : Type) : ArgumentDeclaration {
		var id = this._numUniqVar++;
		return new ArgumentDeclaration(new Token("$a" + id, true), type);
	}

	function _createFreshLocalVariable (type : Type) : LocalVariable {
		var id = this._numUniqVar++;
		return new LocalVariable(new Token("$a" + id, true), type);
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
		else if (statement instanceof YieldStatement)
			return new _YieldStatementTransformer(this, statement as YieldStatement);
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

	function _createAnonymousFunction (parent : MemberFunctionDefinition, token : Token /* null for auto-gen */, args : ArgumentDeclaration[], returnType : Type) : MemberFunctionDefinition {
		if (token == null) {
			token = new Token("function", false);
		}
		var funcDef = new MemberFunctionDefinition(
			token,
			null, // name
			ClassDefinition.IS_STATIC,
			returnType,
			args,
			[], // locals
			[], // statements
			[], // closures
			null,
			null
		);
		Util.linkFunction(funcDef, parent);
		return funcDef;
	}

	function _createIdentityFunction (parent : MemberFunctionDefinition, type : Type) : FunctionExpression {
		assert ! type.equals(Type.voidType);

		var arg = this._createFreshArgumentDeclaration(type);
		var identity = new MemberFunctionDefinition(
			new Token("function", false),
			null,	// name
			ClassDefinition.IS_STATIC,
			type,
			[ arg ],
			[],	// locals
			[ new ReturnStatement(new Token("return", false), new LocalExpression(new Token(arg.getName().getValue(), true), arg)) ] : Statement[],
			[],	// closures
			null,	// lastToken
			null
		);
		Util.linkFunction(identity, parent);
		return new FunctionExpression(identity.getToken(), identity);
	}

}
