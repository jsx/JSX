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
import "./expression.jsx";
import "./statement.jsx";
import "./parser.jsx";
import "./type.jsx";

class CodeTransformer {

	// function transformGenerator (funcDef : MemberFunctionDefinition) : MemberFunctionDefinition {
	// }

	// function _doCPSConvert (funcDef : MemberFunctionDefinition) : MemberFunctionDefinition {
	// }

	// function _doCPSConvertStatement (statement : Statement, continuation : Statement) : Statement {
	// 	if (statement instanceof ConstructorInvocationStatement) {
	// 		throw new Error("FIXME");
	// 	} else if (statement instanceof ExpressionStatement) {
	// 		return new CallExpression(new FunctionExpression(continuation), statement.getExpr());
	// 	} else if (statement instanceof ReturnStatement) {
	// 	} else {
	// 		throw new Error("logic flaw");
	// 	}
	// }

	static function _doCPSConvertExpression (expr : Expression, continuation : Expression) : Expression { // TODO: rewrite to non-recursive style
		var token = expr.getToken();
		if (expr instanceof LeafExpression) {
			// v {C}  |-  C(v)
			return new CallExpression(token, continuation, [ expr ]);
		// } else if (expr instanceof AssignmentExpression) {
		// 	var expr1 = (expr as AssignmentExpression).getFirstExpr(), expr2 = (expr as AssignmentExpression).getSecondExpr();
		// 	if (expr1 instanceof LocalExpression) {
		// 		// x = e {C}  |-  e {(function (r1) { C(x = r1) })}
		// 		return this._doCPSConvertExpression(
		// 			expr2,
		// 			this._makeSimpleAnonymousClosure(token, 
		// 		);
		// 	} else if (expr1 instanceof PropertyExpression) {
		// 		// TODO
		// 		throw new Error("FIXME");
		// 	} else if (expr1 instanceof ArrayExpression) {
		// 		throw new Error("FIXME");
		// 	} else {
		// 		throw new Error("logic flaw");
		// 	}
		// } else if (expr instanceof CallExpression) {
		} else if (expr instanceof AdditiveExpression) {
			var addExpr = expr as AdditiveExpression;
			if (addExpr.getType().equals(Type.numberType)) {
				var type : Type = Type.numberType;
			} else {
				type = Type.stringType;
			}
			var arg0 = new ArgumentDeclaration(new Token(CodeTransformer._generateUniqueName(), false), type);
			var arg1 = new ArgumentDeclaration(new Token(CodeTransformer._generateUniqueName(), false), type);
			var expr0 = addExpr.getFirstExpr();
			var expr1 = addExpr.getSecondExpr();
			return CodeTransformer._doCPSConvertExpression(
				expr0,
				CodeTransformer._makeSimpleAnonymousClosure(
					token,
					[ arg0 ],
					CodeTransformer._doCPSConvertExpression(
						expr1,
						CodeTransformer._makeSimpleAnonymousClosure(
							token,
							[ arg1 ],
							new CallExpression(
								token,
								continuation,
								[ new AdditiveExpression(token, new LocalExpression(arg0.getName(), arg0), new LocalExpression(arg1.getName(), arg1)) ] : Expression[]
							)
						)
					)
				)
			);
		} else {
			throw new Error("logic flaw");
		}
	}

	static function _makeSimpleAnonymousClosure (token : Token, args : ArgumentDeclaration[], body : Expression) : FunctionExpression {
		// collect closures
		var closures = new MemberFunctionDefinition[];
		body.forEachExpression(function onExpr (expr) {
			if (expr instanceof FunctionExpression) {
				closures.push((expr as FunctionExpression).getFuncDef());
				return true;
			}
			return expr.forEachExpression(onExpr);
		});
		var funcDef = new MemberFunctionDefinition(
			token,
			null,
			ClassDefinition.IS_STATIC,
			body.getType(),
			args,
			[],
			[ new ReturnStatement(new Token("return", false), body) ] : Statement[],
			closures,
			null,	// FIXME: lastTokenOfBody
			null
		);
		return new FunctionExpression(token, null, funcDef, false);
	}

	static var _numUniq = 0;

	static function _generateUniqueName () : string {
		var idx = CodeTransformer._numUniq++;
		return "$" + idx as string;
	}

}