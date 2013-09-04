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
import "./platform.jsx";
import "./util.jsx";

class Verifier {

	var _log : string;

	function constructor () {
		this._log = "";
	}

	function log (message : string) : void {
		this._log += message + "\n";
	}

	function dumpLogs (platform : Platform) : void {
		platform.log(this._log);
	}

	static function perform(classDefs : ClassDefinition[], platform : Platform = null) : boolean {
		var verifier = new Verifier;

		var success = true;
		if (success && ! (success = verifier.checkTypes(classDefs))) {
			if (platform != null)
				verifier.dumpLogs(platform);
		}
		if (success && ! (success = verifier.checkClosureLinks(classDefs))) {
			if (platform != null)
				verifier.dumpLogs(platform);
		}
		return success;
	}

	function checkTypes (classDefs : ClassDefinition[]) : boolean {
		for (var i = 0; i < classDefs.length; ++i) {
			if (! classDefs[i].forEachMemberFunction(function onFuncDef (funcDef) {
				var statements = funcDef.getStatements();
				if (statements != null && ! Util.forEachStatement(function onStatement (statement) {
					return statement.forEachExpression(function onExpr (expr) {
						if (expr.getType() == null) {
							this.log(Util.format("expression with uninitialized type found (L.%1 C.%2)", [ expr.getToken().getLineNumber() as string, expr.getToken().getColumnNumber() as string ]));
							return false;
						}
						return expr.forEachExpression(onExpr);
					}) && statement.forEachStatement(onStatement);
				}, statements)) {
					return false;
				}
				return funcDef.forEachClosure(onFuncDef);
			})) {
				break;
			}
		}
		if (i != classDefs.length) {
			return false;
		}
		return true;
	}

	function checkClosureLinks (classDefs : ClassDefinition[]) : boolean {
		for (var i = 0; i < classDefs.length; ++i) {

			function onFuncDef (funcDef : MemberFunctionDefinition, parent : MemberFunctionDefinition) : boolean {
				if (funcDef instanceof TemplateFunctionDefinition)
					return true;

				if (funcDef.getParent() != parent) {
					this.log("unmatched parent");
					return false;
				}
				if (funcDef.getClassDef() != classDefs[i]) {
					this.log("unmatched class definition");
					return false;
				}
				if (parent != null && parent.getClosures().indexOf(funcDef) == -1) {
					this.log("function definition not registered on the parent");
					return false;
				}
				var statements = funcDef.getStatements();
				var numClosures = 0;
				if (statements != null && ! Util.forEachStatement(function onStatement (statement) {
					if (statement instanceof FunctionStatement) {
						++numClosures;
						return onFuncDef((statement as FunctionStatement).getFuncDef(), funcDef);
					}
					return statement.forEachExpression(function onExpr (expr) {
						if (expr instanceof FunctionExpression) {
							++numClosures;
							return onFuncDef((expr as FunctionExpression).getFuncDef(), funcDef);
						}
						return expr.forEachExpression(onExpr);
					}) && statement.forEachStatement(onStatement);
				}, statements)) {
					return false;
				}
				if (funcDef.getClosures().length != numClosures) {
					this.log("orphan function definitions missed to be removed");
					return false;
				}
				return true;
			}

			if (! classDefs[i].forEachMemberFunction((funcDef) -> onFuncDef(funcDef, null))) {
				break;
			}
		}
		if (i != classDefs.length) {
			return false;
		}
		return true;
	}

}
// vim: set noexpandtab
