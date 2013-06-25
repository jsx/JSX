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

	abstract function doCPSTransform (parent : MemberFunctionDefinition, continuation : Expression) : Expression;

	function _transformOp (parent : MemberFunctionDefinition, continuation : Expression, exprs : Expression[]) : Expression {

		var newArgs = new ArgumentDeclaration[];
		for (var i = 0; i < exprs.length; ++i) {
			newArgs.push(this._transformer.createFreshArgumentDeclaration(exprs[i].getType()));
		}

		if (! (continuation.getType() instanceof ResolvedFunctionType)) {
			throw new Error("logic flaw");
		}
		var delimContReturnType = (continuation.getType() as ResolvedFunctionType).getReturnType();

		var firstBody : Expression = null;
		var parentFuncDef = parent;
		for (var i = 0; i < exprs.length; ++i) {
			var childFuncDef = new MemberFunctionDefinition(
				new Token("function", false),
				null, // name
				ClassDefinition.IS_STATIC,
				delimContReturnType,
				[ newArgs[i] ],
				[], // locals
				[], // statements
				[], // closures
				null,
				null
			);
			parentFuncDef.getClosures().push(childFuncDef);
			var cont = new FunctionExpression(childFuncDef.getToken(), childFuncDef);
			var body = this._transformer._getExpressionTransformerFor(exprs[i]).doCPSTransform(parentFuncDef, cont);
			if (i == 0) {
				firstBody = body;
			} else {
				parentFuncDef.getStatements().push(new ReturnStatement(new Token("return", false), body));
			}

			childFuncDef.setParent(parentFuncDef);
			childFuncDef.setClassDef(parentFuncDef.getClassDef());
			parentFuncDef = childFuncDef;
		}
		var lastBody = new CallExpression(
			new Token("(", false),
			continuation,
			[ this._constructOp(newArgs.map.<Expression>((arg) -> (new LocalExpression(arg.getName(), arg) as Expression))) ]
		);
		if (i == 0) {
			firstBody = lastBody;
		} else {
			parentFuncDef.getStatements().push(new ReturnStatement(new Token("return", false), lastBody));
		}

		var closures = new MemberFunctionDefinition[];
		lastBody.forEachExpression(function (expr) {
			if (expr instanceof FunctionExpression) {
				closures.push((expr as FunctionExpression).getFuncDef());
			}
			// does not search for funcDefs deeper than the first level
			return true;
		});

		// detach closures
		for (var i = 0; i < closures.length; ++i) {
			var j;
			if ((j = parent.getClosures().indexOf(closures[i])) != -1) {
				parent.getClosures().splice(j, 1);
			}
		}

		// change the parent
		parentFuncDef._closures = closures;
		for (var i = 0; i < closures.length; ++i) {
			closures[i].setParent(parentFuncDef);
		}

		return firstBody;
	}

	function _constructOp (exprs : Expression[]) : Expression {
		throw new Error("logic flaw");
	}

	function _createCall1 (proc : Expression, arg : Expression) : CallExpression {
		return new CallExpression(
			arg.getToken(),
			proc,
			[ arg ] : Expression[]
		);
	}

	function _detachClosures (parent : MemberFunctionDefinition, expr : Expression, closures : MemberFunctionDefinition[]) : void {
		expr.forEachExpression(function (expr) {
			if (expr instanceof FunctionExpression) {
				closures.push((expr as FunctionExpression).getFuncDef());
			}
			// does not search for funcDefs deeper than the first level
			return true;
		});

		// detach closures
		for (var i = 0; i < closures.length; ++i) {
			var j;
			if ((j = parent.getClosures().indexOf(closures[i])) != -1) {
				parent.getClosures().splice(j, 1);
			}
			else {
				throw new Error("logic flaw, wrong parent passed");
			}
		}
	}

}

class _LeafExpressionTransformer extends _ExpressionTransformer {

	var _expr : LeafExpression;

	function constructor (transformer : CodeTransformer, expr : LeafExpression) {
		super(transformer, "LEAF");
		this._expr = expr;
	}

	override function getExpression () : Expression {
		return this._expr;
	}

	override function doCPSTransform (parent : MemberFunctionDefinition, continuation : Expression) : Expression {
		return this._createCall1(continuation, this._expr);
	}

}

class _ArrayLiteralExpressionTransformer extends _ExpressionTransformer {

	var _expr : ArrayLiteralExpression;

	function constructor (transformer : CodeTransformer, expr : ArrayLiteralExpression) {
		super(transformer, "ARRAY-LITERAL");
		this._expr = expr;
	}

	override function getExpression () : Expression {
		return this._expr;
	}

	override function doCPSTransform (parent : MemberFunctionDefinition, continuation : Expression) : Expression {
		return this._transformOp(parent, continuation, this._expr.getExprs());
	}

	override function _constructOp (exprs : Expression[]) : Expression {
		var arrayLiteralExpr = this._expr.clone();
		arrayLiteralExpr._exprs = exprs;
		return arrayLiteralExpr;
	}

}

class _MapLiteralExpressionTransformer extends _ExpressionTransformer {

	var _expr : MapLiteralExpression;

	function constructor (transformer : CodeTransformer, expr : MapLiteralExpression) {
		super(transformer, "MAP-LITERAL");
		this._expr = expr;
	}

	override function getExpression () : Expression {
		return this._expr;
	}

	override function doCPSTransform (parent : MemberFunctionDefinition, continuation : Expression) : Expression {
		return this._transformOp(parent, continuation, this._expr.getElements().map.<Expression>((elt) -> elt.getExpr()));
	}

	override function _constructOp (exprs : Expression[]) : Expression {
		var elts = new MapLiteralElement[];
		for (var i = 0; i < this._expr.getElements().length; ++i) {
			var elt = this._expr.getElements()[i];
			elts[i] = new MapLiteralElement(elt.getKey(), exprs[i]);
		}
		return new MapLiteralExpression(this._expr.getToken(), elts, this._expr.getType());
	}

}

class _ThisExpressionTransformer extends _ExpressionTransformer {

	var _expr : ThisExpression;

	function constructor (transformer : CodeTransformer, expr : ThisExpression) {
		super(transformer, "THIS");
		this._expr = expr;
	}

	override function getExpression () : Expression {
		return this._expr;
	}

	override function doCPSTransform (parent : MemberFunctionDefinition, continuation : Expression) : Expression {
		return this._createCall1(continuation, this._expr);
	}

}

class _FunctionExpressionTransformer extends _ExpressionTransformer {

	var _expr : FunctionExpression;

	function constructor (transformer : CodeTransformer, expr : FunctionExpression) {
		super(transformer, "FUNCTION");
		this._expr = expr;
	}

	override function getExpression () : Expression {
		return this._expr;
	}

	override function doCPSTransform (parent : MemberFunctionDefinition, continuation : Expression) : Expression {
		return this._createCall1(continuation, this._expr);
	}

}

abstract class _UnaryExpressionTransformer extends _ExpressionTransformer {

	var _expr : UnaryExpression;

	function constructor (transformer : CodeTransformer, expr : UnaryExpression) {
		super(transformer, "UNARY");
		this._expr = expr;
	}

	override function getExpression () : Expression {
		return this._expr;
	}

	override function doCPSTransform (parent : MemberFunctionDefinition, continuation : Expression) : Expression {
		/*
		  op(v) | C

		  v | function ($v) { return C(op($v)); }
		*/

		return this._transformOp(parent, continuation, [ this._expr.getExpr() ]);
	}

	override function _constructOp (exprs : Expression[]) : Expression {
		assert exprs.length == 1;

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

	override function doCPSTransform (parent : MemberFunctionDefinition, continuation : Expression) : Expression {
		// expr must be of any of type 'local', 'property', and 'array'

		var expr = this._expr.getExpr();
		if (expr instanceof LocalExpression || (expr instanceof PropertyExpression && (expr as PropertyExpression).getExpr().isClassSpecifier())) {
			/*
			  local_or_classvar++ | C

			  C(local_or_classvar++)
			*/

			return this._createCall1(continuation, this._expr);
		} else if (expr instanceof PropertyExpression) {
			/*
			  E.prop++ | C

			  E | function ($1) { return C($1.prop++); }
			*/

			return this._transformOp(parent, continuation, [ (expr as PropertyExpression).getExpr() ]);
		} else if (expr instanceof ArrayExpression) {
			/*
			  E1[E2]++ | C

			  E1 | function ($1) { return E2 | function ($2) { return C($1[$2]++); }; }
			*/
			var arrayExpr = expr as ArrayExpression;
			return this._transformOp(parent, continuation, [ arrayExpr.getFirstExpr(), arrayExpr.getSecondExpr() ]);
		} else {
			throw new Error("logic flaw");
		}
	}

	override function _constructOp (exprs : Expression[]) : Expression {
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
			throw new Error("logic flaw");
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

class _PropertyExpressionTransformer extends _UnaryExpressionTransformer {

	function constructor (transformer : CodeTransformer, expr : PropertyExpression) {
		super(transformer, expr);
	}

	override function doCPSTransform (parent : MemberFunctionDefinition, continuation : Expression) : Expression {
		// member method
		if (this._expr.getType() instanceof MemberFunctionType) {
			throw new Error("logic flaw");
		}
		// static member
		if (this._expr.getExpr() instanceof ClassExpression) {
			return this._createCall1(continuation, this._expr);
		}
		return super.doCPSTransform(parent, continuation);
	}

	override function _clone (arg : Expression) : UnaryExpression {
		var propExpr = new PropertyExpression(this._expr.getToken(), arg, (this._expr as PropertyExpression).getIdentifierToken(), (this._expr as PropertyExpression).getTypeArguments(), this._expr.getType());
		propExpr._isInner = (this._expr as PropertyExpression)._isInner;
		return propExpr;
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

abstract class _BinaryExpressionTransformer extends _ExpressionTransformer {

	var _expr : BinaryExpression;

	function constructor (transformer : CodeTransformer, expr : BinaryExpression) {
		super(transformer, "BINARY");
		this._expr = expr;
	}

	override function getExpression () : Expression {
		return this._expr;
	}

	override function doCPSTransform (parent : MemberFunctionDefinition, continuation : Expression) : Expression {
		/*
		  op(E1,E2) | C

		  E1 | function ($1) { return E2 | function ($2) { return C(op($1,$2); }; }
		                                   ^^^^^^^^^^^^^^^^cont2^^^^^^^^^^^^^^^^
		       ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^cont1^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
		*/

		return this._transformOp(parent, continuation, [ this._expr.getFirstExpr(), this._expr.getSecondExpr() ]);
	}

	override function _constructOp (exprs : Expression[]) : Expression {
		assert exprs.length == 2;
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

class _AssignmentExpressionTransformer extends _ExpressionTransformer {

	var _expr : AssignmentExpression;

	function constructor (transformer : CodeTransformer, expr : AssignmentExpression) {
		super(transformer, "ASSIGNMENT");
		this._expr = expr;
	}

	override function getExpression () : Expression {
		return this._expr;
	}

	override function doCPSTransform (parent : MemberFunctionDefinition, continuation : Expression) : Expression {
		// LHS expr must be of any of type 'local', 'property', and 'array'

		var lhsExpr = this._expr.getFirstExpr();
		if (lhsExpr instanceof LocalExpression || (lhsExpr instanceof PropertyExpression && (lhsExpr as PropertyExpression).getExpr() instanceof ClassExpression)) {
			return this._transformSimpleAssignment(parent, continuation);
		} else if (lhsExpr instanceof PropertyExpression) {
			return this._transformPropertyAssignment(parent, continuation);
		} else if (lhsExpr instanceof ArrayExpression) {
			return this._transformArrayAssignment(parent, continuation);
		} else {
			throw new Error("logic flaw");
		}
	}

	function _transformSimpleAssignment (parent : MemberFunctionDefinition, continuation : Expression) : Expression {
		/*
		  local_or_classvar = E | C

		  E | function ($1) { return C(local_or_classvar = $1); }
		*/

		return this._transformOp(parent, continuation, [ this._expr.getSecondExpr() ]);
	}

	function _transformPropertyAssignment (parent : MemberFunctionDefinition, continuation : Expression) : Expression {
		/*
		  E1.prop = E2 | C

		  E1 | function ($1) { return E2 | function ($2) { return C($1.prop = $2); }; }
		*/

		return this._transformOp(parent, continuation, [ (this._expr.getFirstExpr() as PropertyExpression).getExpr(), this._expr.getSecondExpr() ]);
	}

	function _transformArrayAssignment (parent : MemberFunctionDefinition, continuation : Expression) : Expression {
		/*
		  E1[E2] = E3 | C

		  E1 | function ($1) { return E2 | function ($2) { return E3 | function ($3) { return C($1[$2] = $3); }; }; }
		*/

		var arrayExpr = this._expr.getFirstExpr() as ArrayExpression;
		return this._transformOp(parent, continuation, [ arrayExpr.getFirstExpr(), arrayExpr.getSecondExpr(), this._expr.getSecondExpr() ]);
	}

	override function _constructOp (exprs : Expression[]) : Expression {
		var lhsExpr = this._expr.getFirstExpr();
		if (lhsExpr instanceof LocalExpression || (lhsExpr instanceof PropertyExpression && (lhsExpr as PropertyExpression).getExpr() instanceof ClassExpression)) {
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

class _LogicalExpressionTransformer extends _BinaryExpressionTransformer {

	function constructor (transformer : CodeTransformer, expr : LogicalExpression) {
		super(transformer, expr);
	}

	override function _clone (arg1 : Expression, arg2 : Expression) : BinaryExpression {
		return new LogicalExpression(this._expr.getToken(), arg1, arg2);
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

	override function doCPSTransform (parent : MemberFunctionDefinition, continuation : Expression) : Expression {
		/*

a ? b : c | C

a | function ($a) { var $C = C; return $a ? b | $C : c | $C; }

		*/

		var argVar = this._transformer.createFreshArgumentDeclaration(this._expr.getCondExpr().getType());
		var contVar = this._transformer.createFreshLocalVariable(continuation.getType());

		var closures = new MemberFunctionDefinition[];
		this._detachClosures(parent, continuation, closures);
		this._detachClosures(parent, this._expr, closures);

		var contFuncDef = new MemberFunctionDefinition(
			new Token("function", false),
			null,	// name
			ClassDefinition.IS_STATIC,
			Type.voidType,
			[ argVar ],
			[ contVar ],
			[],	// statements
			closures,
			null,
			null
		);
		parent.getClosures().push(contFuncDef);

		// `var $C = C;`
		var condStmt = new ExpressionStatement(
			new AssignmentExpression(
				new Token("=", false),
				new LocalExpression(contVar.getName(), contVar),
				continuation
			)
		);

		// `return $a ? b | $C : c | $C;`
		var returnStmt = new ReturnStatement(
			new Token("return", false),
			new ConditionalExpression(
				this._expr.getToken(),
				new LocalExpression(argVar.getName(), argVar),
				this._transformer._getExpressionTransformerFor(this._expr.getIfTrueExpr()).doCPSTransform(contFuncDef, new LocalExpression(contVar.getName(), contVar)),
				this._transformer._getExpressionTransformerFor(this._expr.getIfFalseExpr()).doCPSTransform(contFuncDef, new LocalExpression(contVar.getName(), contVar))
			)
		);

		contFuncDef.getStatements().push(condStmt);
		contFuncDef.getStatements().push(returnStmt);

		var cont = new FunctionExpression(contFuncDef.getToken(), contFuncDef);

		return this._transformer._getExpressionTransformerFor(this._expr.getCondExpr()).doCPSTransform(parent, cont);
	}

}

class _CallExpressionTransformer extends _ExpressionTransformer {

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

	override function doCPSTransform (parent : MemberFunctionDefinition, continuation : Expression) : Expression {
		// function calls are considered a primitive operation
		if (this._isMethodCall()) {
			// method calls
			var receiver = (this._expr.getExpr() as PropertyExpression).getExpr();
			return this._transformOp(parent, continuation, [ receiver ].concat(this._expr.getArguments()));
		} else {
			return this._transformOp(parent, continuation, [ this._expr.getExpr() ].concat(this._expr.getArguments()));
		}

	}

	override function _constructOp (exprs : Expression[]) : Expression {
		if (this._isMethodCall()) {
			var propertyExpr = this._expr.getExpr() as PropertyExpression;
			return new CallExpression(
				new Token("(", false),
				new PropertyExpression(propertyExpr.getToken(), exprs[0], propertyExpr.getIdentifierToken(), propertyExpr.getTypeArguments(), propertyExpr.getType()),
				exprs.slice(1));
		} else {
			return new CallExpression(new Token("(", false), exprs[0], exprs.slice(1));
		}
	}

}

class _SuperExpressionTransformer extends _ExpressionTransformer {

	var _expr : SuperExpression;

	function constructor (transformer : CodeTransformer, expr : SuperExpression) {
		super(transformer, "SUPER");
		this._expr = expr;
	}

	override function getExpression () : Expression {
		return this._expr;
	}

	override function doCPSTransform (parent : MemberFunctionDefinition, continuation : Expression) : Expression {
		return this._transformOp(parent, continuation, this._expr.getArguments());
	}

	override function _constructOp (exprs : Expression[]) : Expression {
		var superExpr = new SuperExpression(this._expr);
		superExpr._args = exprs;
		return superExpr;
	}

}

class _NewExpressionTransformer extends _ExpressionTransformer {

	var _expr : NewExpression;

	function constructor (transformer : CodeTransformer, expr : NewExpression) {
		super(transformer, "NEW");
		this._expr = expr;
	}

	override function getExpression () : Expression {
		return this._expr;
	}

	override function doCPSTransform (parent : MemberFunctionDefinition, continuation : Expression) : Expression {
		return this._transformOp(parent, continuation, this._expr.getArguments());
	}

	override function _constructOp (exprs : Expression[]) : Expression {
		var newExpr = new NewExpression(this._expr);
		newExpr._args = exprs;
		return newExpr;
	}

}

class _CommaExpressionTransformer extends _ExpressionTransformer {

	var _expr : CommaExpression;

	function constructor (transformer : CodeTransformer, expr : CommaExpression) {
		super(transformer, "COMMA");
		this._expr = expr;
	}

	override function getExpression () : Expression {
		return this._expr;
	}

	override function doCPSTransform (parent : MemberFunctionDefinition, continuation : Expression) : Expression {
		return this._transformOp(parent, continuation, [ this._expr.getFirstExpr(), this._expr.getSecondExpr() ]);
	}

	override function _constructOp (exprs : Expression[]) : Expression {
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

	abstract function _replaceControlStructuresWithGotos () : Statement[];

	static function pushConditionalBranch (expr : Expression, succLabel : string, failLabel : string, output : Statement[]) : void {
		output.push(new IfStatement(new Token("if", false), expr, [ new GotoStatement(succLabel) ] : Statement[], [ new GotoStatement(failLabel) ] : Statement[]));
	}

	static function pushExpressionStatement (expr : Expression, output : Statement[]) : void {
		output.push(new ExpressionStatement(expr));
	}

	function _transformAndPush (input : Statement, output : Statement[]) : void {
		var conved = this._transformer._getStatementTransformerFor(input)._replaceControlStructuresWithGotos();
		for (var i = 0; i < conved.length; ++i) {
			output.push(conved[i]);
		}
	}

	function _transformAndPush (input : Statement[], output : Statement[]) : void {
		for (var i = 0; i < input.length; ++i) {
			this._transformAndPush(input[i], output);
		}
	}

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

	override function _replaceControlStructuresWithGotos () : Statement[] {
		return [ this._statement ] : Statement[];
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

	override function _replaceControlStructuresWithGotos () : Statement[] {
		return [ this._statement ] : Statement[];
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

	override function _replaceControlStructuresWithGotos () : Statement[] {
		return [ this._statement ] : Statement[];
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

	override function _replaceControlStructuresWithGotos () : Statement[] {
		var statements = new Statement[];
		if (this._statement.getExpr() != null) {
			var returnLocal = this._transformer.getTopReturnLocal();
			assert returnLocal != null;
			statements.push(new ExpressionStatement(
				new AssignmentExpression(
					new Token("=", false),
					new LocalExpression(returnLocal.getName(), returnLocal),
					this._statement.getExpr())));
		}
		statements.push(new GotoStatement("$END"));

		return statements;
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

	override function _replaceControlStructuresWithGotos () : Statement[] {
		var statements = new Statement[];
		statements.push(this._statement);
		// split the continuation
		var label = "$YIELD_" + this.getID() as string;
		statements.push(new GotoStatement(label));
		statements.push(new LabelStatement(label));
		return statements;
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

	override function _replaceControlStructuresWithGotos () : Statement[] {
		return [ this._statement ] : Statement[];
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

	override function _replaceControlStructuresWithGotos () : Statement[] {
		if (this._statement.getLabel() != null) {
			var trans = this._transformer.getStatementTransformerByLabel(this._statement.getLabel().getValue());
		} else {
			trans = this._transformer.getTopLabelledBlock();
		}
		return [ new GotoStatement(trans.getBreakingLabel()) ] : Statement[];
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

	override function _replaceControlStructuresWithGotos () : Statement[] {
		if (this._statement.getLabel() != null) {
			var trans = this._transformer.getStatementTransformerByLabel(this._statement.getLabel().getValue());
		} else {
			trans = this._transformer.getTopLabelledBlock();
		}
		return [ new GotoStatement(trans.getContinuingLabel()) ] : Statement[];
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

	override function _replaceControlStructuresWithGotos () : Statement[] {
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
		var statements = new Statement[];
		var bodyLabel = "$BODY_DO_WHILE_" + this.getID() as string;
		statements.push(new GotoStatement(bodyLabel));
		statements.push(new LabelStatement(bodyLabel));
		this._transformer.enterLabelledBlock(this);
		this._transformAndPush(this._statement.getStatements(), statements);
		this._transformer.leaveLabelledBlock();
		var testLabel = "$TEST_DO_WHILE_" + this.getID() as string;
		statements.push(new GotoStatement(testLabel));
		statements.push(new LabelStatement(testLabel));
		var endLabel = "$END_DO_WHILE_" + this.getID() as string;
		_StatementTransformer.pushConditionalBranch(this._statement.getExpr(), bodyLabel, endLabel, statements);
		statements.push(new LabelStatement(endLabel));
		return statements;
	}

	override function getBreakingLabel () : string {
		return "$END_DO_WHILE_" + this.getID() as string;
	}

	override function getContinuingLabel () : string {
		return "$BODY_DO_WHILE_" + this.getID() as string;
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

	override function _replaceControlStructuresWithGotos () : Statement[] {
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

	override function _replaceControlStructuresWithGotos () : Statement[] {
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
		var statements = new Statement[];
		var initLabel = "$INIT_FOR_" + this.getID() as string;
		statements.push(new GotoStatement(initLabel));
		statements.push(new LabelStatement(initLabel));
		_StatementTransformer.pushExpressionStatement(this._statement.getInitExpr(), statements);
		var testLabel = "$TEST_FOR_" + this.getID() as string;
		statements.push(new GotoStatement(testLabel));
		statements.push(new LabelStatement(testLabel));
		var bodyLabel = "$BODY_FOR_" + this.getID() as string;
		var endLabel = "$END_FOR_" + this.getID() as string;
		_StatementTransformer.pushConditionalBranch(this._statement.getCondExpr(), bodyLabel, endLabel, statements);
		statements.push(new LabelStatement(bodyLabel));
		this._transformer.enterLabelledBlock(this);
		this._transformAndPush(this._statement.getStatements(), statements);
		this._transformer.leaveLabelledBlock();
		var postLabel = "$POST_FOR_" + this.getID() as string;
		statements.push(new GotoStatement(postLabel));
		statements.push(new LabelStatement(postLabel));
		_StatementTransformer.pushExpressionStatement(this._statement.getPostExpr(), statements);
		statements.push(new GotoStatement(testLabel));
		statements.push(new LabelStatement(endLabel));
		return statements;
	}

	override function getBreakingLabel () : string {
		return "$END_FOR_" + this.getID() as string;
	}

	override function getContinuingLabel () : string {
		return "$POST_FOR_" + this.getID() as string;
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

	override function _replaceControlStructuresWithGotos () : Statement[] {
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
		var statements = new Statement[];
		var testLabel = "$TEST_IF_" + this.getID() as string;
		var succLabel = "$SUCC_IF_" + this.getID() as string;
		var failLabel = "$FAIL_IF_" + this.getID() as string;
		statements.push(new GotoStatement(testLabel));
		statements.push(new LabelStatement(testLabel));
		_StatementTransformer.pushConditionalBranch(this._statement.getExpr(), succLabel, failLabel, statements);
		statements.push(new LabelStatement(succLabel));
		this._transformAndPush(this._statement.getOnTrueStatements(), statements);
		var endLabel = "$END_IF_" + this.getID() as string;
		statements.push(new GotoStatement(endLabel));
		statements.push(new LabelStatement(failLabel));
		this._transformAndPush(this._statement.getOnFalseStatements(), statements);
		statements.push(new GotoStatement(endLabel));
		statements.push(new LabelStatement(endLabel));
		return statements;
	}

}

class _SwitchStatementTransformer extends _LabellableStatementTransformer {

	var _statement : SwitchStatement;
	var _escapeMap : Map.<number>;

	function constructor (transformer : CodeTransformer, statement : SwitchStatement) {
		super(transformer, "SWITCH");
		this._statement = statement;
		this._escapeMap = new Map.<number>;
	}

	override function getStatement () : Statement {
		return this._statement;
	}

	override function _replaceControlStructuresWithGotos () : Statement[] {
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
		var statements = new Statement[];
		var testLabel = "$TEST_SWITCH_" + this.getID() as string;
		statements.push(new GotoStatement(testLabel));
		statements.push(new LabelStatement(testLabel));
		this._pushConditionalSwitch(statements);
		var endLabel = "$END_SWITCH_" + this.getID() as string;
		statements.push(new GotoStatement(endLabel));
		this._pushSwitchBody(statements);
		statements.push(new LabelStatement(endLabel));
		return statements;
	}

	function _pushConditionalSwitch (output : Statement[]) : void {
		var statements = this._statement.getStatements();
		var switchCases = new Statement[];
		for (var i = 0; i < statements.length; ++i) {
			var stmt = statements[i];
			if (stmt instanceof CaseStatement) {
				switchCases.push(stmt);
				switchCases.push(new GotoStatement(this._getLabelFromCaseStatement(stmt as CaseStatement)));
				switchCases.push(new ReturnStatement(new Token("return", false), null));
			} else if (stmt instanceof DefaultStatement) {
				switchCases.push(stmt);
				switchCases.push(new GotoStatement(this._getLabelFromDefaultStatement()));
				switchCases.push(new ReturnStatement(new Token("return", false), null));
			}
		}
		var condSwitch = this._statement.clone() as SwitchStatement;
		condSwitch._statements = switchCases;
		output.push(condSwitch);
	}

	function _pushSwitchBody (output : Statement[]) : void {
		var statements = this._statement.getStatements();
		this._transformer.enterLabelledBlock(this);
		for (var i = 0; i < statements.length; ++i) {
			var stmt = statements[i];
			if (stmt instanceof CaseStatement) {
				var label = this._getLabelFromCaseStatement(stmt as CaseStatement);
				output.push(new GotoStatement(label));
				output.push(new LabelStatement(label));
			} else if (stmt instanceof DefaultStatement) {
				label = this._getLabelFromDefaultStatement();
				output.push(new GotoStatement(label));
				output.push(new LabelStatement(label));
			} else {
				this._transformAndPush(stmt, output);
			}
		}
		this._transformer.leaveLabelledBlock();
	}

	function _getLabelFromCaseStatement (caseStmt : CaseStatement) : string {
		return "$SWITCH_" + this.getID() as string + "_CASE_" + this.escapeCaseExpression(caseStmt.getExpr().getToken().getValue());
	}

	function _getLabelFromDefaultStatement () : string {
		return "$SWITCH_" + this.getID() as string + "_DEFAULT";
	}

	override function getBreakingLabel () : string {
		return "$END_SWITCH_" + this.getID() as string;
	}

	override function getContinuingLabel () : string {
		throw new Error("logic flaw");
	}

	function escapeCaseExpression (value : string) : string {
		if (value in this._escapeMap) {
			return this._escapeMap[value] as string;
		}
		this._escapeMap[value] = this._escapeMap.keys().length;
		return this._escapeMap[value] as string;
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

	override function _replaceControlStructuresWithGotos () : Statement[] {
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

	override function _replaceControlStructuresWithGotos () : Statement[] {
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

	override function _replaceControlStructuresWithGotos () : Statement[] {
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
		var statements = new Statement[];
		var testLabel = "$TEST_WHILE_" + this.getID() as string;
		statements.push(new GotoStatement(testLabel));
		statements.push(new LabelStatement(testLabel));
		var bodyLabel = "$BODY_WHILE_" + this.getID() as string;
		var endLabel = "$END_WHILE_" + this.getID() as string;
		_StatementTransformer.pushConditionalBranch(this._statement.getExpr(), bodyLabel, endLabel, statements);
		statements.push(new LabelStatement(bodyLabel));
		this._transformer.enterLabelledBlock(this);
		this._transformAndPush(this._statement.getStatements(), statements);
		this._transformer.leaveLabelledBlock();
		statements.push(new GotoStatement(testLabel));
		statements.push(new LabelStatement(endLabel));
		return statements;
	}

	override function getBreakingLabel () : string {
		return "$END_WHILE_" + this.getID() as string;
	}

	override function getContinuingLabel () : string {
		return "$TEST_WHILE_" + this.getID() as string;
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

	override function _replaceControlStructuresWithGotos () : Statement[] {
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

	override function _replaceControlStructuresWithGotos () : Statement[] {
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

	override function _replaceControlStructuresWithGotos () : Statement[] {
		return [ this._statement ] : Statement[];
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

	override function _replaceControlStructuresWithGotos () : Statement[] {
		return [ this._statement ] : Statement[];
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

	override function _replaceControlStructuresWithGotos () : Statement[] {
		return [ this._statement ] : Statement[];
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

	override function _replaceControlStructuresWithGotos () : Statement[] {
		return [ this._statement ] : Statement[];
	}

}

class CodeTransformer {

	var _forceTransform : boolean;
	var _compiler : Compiler;

	var _stopIterationClassDef : ClassDefinition;
	var _jsxGeneratorClassDef : TemplateClassDefinition;

	function constructor () {
		this._forceTransform = false;

		this._stopIterationClassDef = null;
		this._jsxGeneratorClassDef = null;
	}

	function setup (compiler : Compiler) : CodeTransformer {
		this._compiler = compiler;
		var builtins = compiler.getBuiltinParsers()[0];

		this._stopIterationClassDef = builtins.lookup([], null, "g_StopIteration");
		for (var i = 0; i < builtins._templateClassDefs.length; ++i)
			if (builtins._templateClassDefs[i].className() == "__jsx_generator")
				this._jsxGeneratorClassDef = builtins._templateClassDefs[i];

		assert this._stopIterationClassDef != null;
		assert this._jsxGeneratorClassDef != null;

		return this;
	}

	function performTransformation () : void {
		function hasForInStatement (funcDef : MemberFunctionDefinition) : boolean {
			return ! funcDef.forEachStatement(function onStatement (statement) {
				if (statement instanceof ForInStatement)
					return false;
				return statement.forEachStatement(onStatement);
			});
		}
		// transform all functions
		if (this._forceTransform) {
			this._compiler.forEachClassDef(function (parser, classDef) {
				return classDef.forEachMember(function onMember(member) {
					if (member instanceof MemberFunctionDefinition) {
						var funcDef = member as MemberFunctionDefinition;
						if (funcDef.getStatements() != null && funcDef.name() != "constructor" && ! hasForInStatement(funcDef)) {
							this._doCPSTransform(funcDef);
						}
					}
					return true;
				});
			});
		}
		// transform generators
		this._compiler.forEachClassDef(function (parser, classDef) {
			return classDef.forEachMember(function onMember(member) {
				if (member instanceof MemberFunctionDefinition) {
					var funcDef = member as MemberFunctionDefinition;
					if (funcDef.isGenerator()) {
						this.transformFunctionDefinition(funcDef);
					}
				}
				return member.forEachClosure(function (funcDef) {
					return onMember(funcDef);
				});
			});
		});
	}

	function setForceTransform (force : boolean) : void {
		this._forceTransform = force;
	}

	var _labelMap = new _LabellableStatementTransformer[];

	function getStatementTransformerByLabel (label : string) : _LabellableStatementTransformer {
		for (var i = 0; this._labelMap.length; ++i) {
			var trans = this._labelMap[i];
			if ((trans.getStatement() as LabellableStatement).getLabel().getValue() == label)
				return trans;
		}
		throw new Error("fatal error: no corresponding transformer for label \"" + label + "\"");
	}

	function getTopLabelledBlock () : _LabellableStatementTransformer {
		return this._labelMap[this._labelMap.length - 1];
	}

	function enterLabelledBlock (transformer : _LabellableStatementTransformer) : void {
		this._labelMap.push(transformer);
	}

	function leaveLabelledBlock () : void {
		this._labelMap.pop();
	}

	var _returnLocals = new LocalVariable[];

	function getTopReturnLocal () : LocalVariable {
		return this._returnLocals[this._returnLocals.length - 1];
	}

	function enterFunction (returnLocal : LocalVariable) : void {
		this._returnLocals.push(returnLocal);
	}

	function leaveFunction () : void {
		this._returnLocals.pop();
	}

	var _numUniqVar = 0;

	function createFreshArgumentDeclaration (type : Type) : ArgumentDeclaration {
		var id = this._numUniqVar++;
		return new ArgumentDeclaration(new Token("$a" + id as string, true), type);
	}

	function createFreshLocalVariable (type : Type) : LocalVariable {
		var id = this._numUniqVar++;
		return new LocalVariable(new Token("$a" + id as string, true), type);
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
		// else if (expr instanceof ClassExpression)
		// 	return new _ClassExpressionTransformer(this, expr as ClassExpression);
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
			return new _ThisExpressionTransformer(this, expr as ThisExpression);
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

	function transformFunctionDefinition (funcDef : MemberFunctionDefinition) : void {
		this._compileYields(funcDef);
	}

	function _createIdentityFunction (parent : MemberFunctionDefinition, type : Type) : FunctionExpression {
		var arg = this.createFreshArgumentDeclaration(type);
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
		parent.getClosures().push(identity);
		return new FunctionExpression(identity.getToken(), identity);
	}

	function _doCPSTransform (funcDef : MemberFunctionDefinition) : void {
		this._doCPSTransform(funcDef, false, function (name, statements) {
			// do nothing
		});
	}

	function _doCPSTransform (funcDef : MemberFunctionDefinition, transformOnlyStmts : boolean, postFragmentationCallback : (string, Statement[]) -> void) : void {
		var returnLocal : LocalVariable = null;

		if (! transformOnlyStmts) {
			// transform expressions inside as well
			for (var i = 0; i < funcDef.getStatements().length; ++i) {
				var statement = funcDef.getStatements()[i];
				statement.forEachExpression(function (expr, replaceCb) {
					replaceCb(this._getExpressionTransformerFor(expr).doCPSTransform(funcDef, this._createIdentityFunction(funcDef, expr.getType())));
					return true;
				});
			}
		}

		var returnType = funcDef.getReturnType();
		if (! Type.voidType.equals(returnType)) {
			var returnLocalName = "$return" + CodeTransformer._getFunctionNestDepth(funcDef) as string;
			returnLocal = new LocalVariable(new Token(returnLocalName, false), returnType);
			funcDef.getLocals().push(returnLocal);
			this.enterFunction(returnLocal);
		}

		// replace control structures with goto statements
		var statements = new Statement[];
		for (var i = 0; i < funcDef.getStatements().length; ++i) {
			statements = statements.concat(this._getStatementTransformerFor(funcDef.getStatements()[i])._replaceControlStructuresWithGotos());
		}
		// insert prologue code
		statements.unshift(
			new GotoStatement("$BEGIN"),
			new LabelStatement("$BEGIN")
		);
		// insert epilogue code
		statements.push(
			new GotoStatement("$END"),
			new LabelStatement("$END")
		);
		funcDef._statements = statements;

		if (! Type.voidType.equals(returnType)) {
			funcDef._statements.push(new ReturnStatement(new Token("return", false), new LocalExpression(returnLocal.getName(), returnLocal)));
			this.leaveFunction();
		}

		// replace goto statements with calls of closures
		this._eliminateGotos(funcDef, postFragmentationCallback);
	}

	function _eliminateGotos (funcDef : MemberFunctionDefinition, postFragmentationCallback : (string, Statement[]) -> void) : void {
		var statements = funcDef.getStatements();
		// collect labels
		var labels = new Map.<LocalVariable>;
		for (var i = 0; i < statements.length; ++i) {
			if (statements[i] instanceof LabelStatement && labels[(statements[i] as LabelStatement).getName()] == null) {
				var name = (statements[i] as LabelStatement).getName();
				labels[name] = new LocalVariable(new Token(name, true), new StaticFunctionType(null, Type.voidType, [], true));
				funcDef.getLocals().push(labels[name]);
			}
		}
		// replace gotos with function call (and return statement)
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
		// collect entry points
		var entries = new Statement[];
		for (var i = 0; i < statements.length; ++i) {
			if (statements[i] instanceof LabelStatement) { // until first label
				break;
			}
			entries.push(statements[i]);
		}
		// collect code blocks
		var codeBlocks = new Statement[];
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
			postFragmentationCallback(currentLabel.getName(), body);
			var block = new MemberFunctionDefinition(
						new Token("function", false),
						null, // name
						ClassDefinition.IS_STATIC,
						Type.voidType,
						[],   // args
						[],   // locals
						body,
						[],   // closures
						null, // last token
						null
			);
			funcDef.getClosures().push(block);
			codeBlocks.push(new ExpressionStatement(
				new AssignmentExpression(
					new Token("=", false),
					new LocalExpression(null, labels[currentLabel.getName()]),
					new FunctionExpression(new Token("function", false), block))));
		}
		funcDef._statements = codeBlocks.concat(entries);
	}

	function _compileYields(funcDef : MemberFunctionDefinition) : void { // FIXME wasabiz nested generator
		var yieldingType = (funcDef.getReturnType().getClassDef() as InstantiatedClassDefinition).getTypeArguments()[0];

		// create a generator object
		var genType = this._instantiateGeneratorType(yieldingType);
		var genLocalName = "$generator" + CodeTransformer._getGeneratorNestDepth(funcDef) as string;
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
		this._doCPSTransform(funcDef, true, function (label : string, statements : Statement[]) : void {
			if (2 <= statements.length && statements[statements.length - 2] instanceof YieldStatement) {
				var idx = statements.length - 2;
				statements.splice(idx, 2,
					new ExpressionStatement(
						new AssignmentExpression(
							new Token("=", false),
							new PropertyExpression(
								new Token(".", false),
								new LocalExpression(new Token(genLocalName, false), genLocal),
								new Token("__value", false),
								[],
								yieldingType),
							(statements[idx] as YieldStatement).getExpr())),
					new ExpressionStatement(
						new AssignmentExpression(
							new Token("=", false),
							new PropertyExpression(
								new Token(".", false),
								new LocalExpression(new Token(genLocalName, false), genLocal),
								new Token("__next", true),
								[],
								new StaticFunctionType(null, Type.voidType, [], true)),
							((statements[idx + 1] as ReturnStatement).getExpr()as CallExpression).getExpr())));
			}
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
		  $BEGIN();

		  -> $generatorN.__next = $BEGIN;
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
						new StaticFunctionType(null, Type.voidType, [], true)),
					new LocalExpression(
						new Token("$BEGIN", true),
						(((statements[statements.length - 1] as ReturnStatement).getExpr() as CallExpression).getExpr() as LocalExpression).getLocal()))));

		// return the generator
		statements.push(
			new ReturnStatement(
				new Token("return", false),
				new LocalExpression(new Token("$generator", false), genLocal)));
	}

	function _instantiateGeneratorType (yieldingType : Type) : Type {
		// instantiate generator
		var genClassDef = this._jsxGeneratorClassDef.instantiateTemplateClass(
			[],	// errors
			new TemplateInstantiationRequest(null, "__jsx_generator", [ yieldingType ] : Type[])
		);
		this._jsxGeneratorClassDef.getParser()._classDefs.push(genClassDef);

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

}
