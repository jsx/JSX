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
import "./type.jsx";
import "./expression.jsx";
import "./statement.jsx";
import "./emitter.jsx";
import "./jssourcemap.jsx";
import "./util.jsx";
import "./optimizer.jsx";
import "./parser.jsx";
import "./platform.jsx";
import _UnclassifyOptimizationCommandStash from "./optimizer.jsx";

class _Util {

	/**
	 * Originally, this function is used for the sake of optimization by Google Closure Compiler, but now JSX is faster than Closure Compiler and this method is no longer maintained.
	 */
	static function toClosureType (type : Type) : Nullable.<string> {
		if (type.equals(Type.booleanType)) {
			return "!boolean";
		} else if (type.equals(Type.integerType) || type.equals(Type.numberType)) {
			return "!number";
		} else if (type.equals(Type.stringType)) {
			return "!string";
		} else if (type instanceof NullableType) {
			return "undefined|" + _Util.toClosureType((type as NullableType).getBaseType());
		} else if (type instanceof ObjectType) {
			var classDef = type.getClassDef();
			if (classDef instanceof InstantiatedClassDefinition && (classDef as InstantiatedClassDefinition).getTemplateClassName() == "Array") {
				return "Array.<undefined|" + _Util.toClosureType((classDef as InstantiatedClassDefinition).getTypeArguments()[0]) + ">";
			} else if (classDef instanceof InstantiatedClassDefinition && (classDef as InstantiatedClassDefinition).getTemplateClassName() == "Map") {
				return "Object.<string, undefined|" + _Util.toClosureType((classDef as InstantiatedClassDefinition).getTypeArguments()[0]) + ">";
			} else {
				return classDef.getOutputClassName();
			}
		} else if (type instanceof VariantType) {
			return "*";
		} else if (type instanceof FunctionType) {
			return "*";
		}
		return null;
	}

	static function getInstanceofNameFromClassDef (classDef : ClassDefinition) : string {
		if (classDef instanceof InstantiatedClassDefinition) {
			var name = (classDef as InstantiatedClassDefinition).getTemplateClassName();
			if (name == "Map")
				name = "Object";
		} else {
			name = classDef.getOutputClassName();
		}
		return name;
	}

	static function buildAnnotation (template : string, type : Type) : string {
		var closureType = _Util.toClosureType(type);
		if (closureType == null)
			return "";
		return Util.format(template, [closureType]);
	}

	static function emitLabelOfStatement (emitter : JavaScriptEmitter, statement : LabellableStatement) : void {
		var label = statement.getLabel();
		if (label != null) {
			emitter._reduceIndent();
			emitter._emit(label.getValue() + ":\n", label);
			emitter._advanceIndent();
		}
	}

	static function getStash (stashable : Stashable) : variant {
		var stashHash = stashable.getOptimizerStash();
		var stash;
		if ((stash = stashHash["jsemitter"]) == null) {
			stash = stashHash["jsemitter"] = null;
		}
		return stashHash;
	}

	static function setupBooleanizeFlags (funcDef : MemberFunctionDefinition) : void {
		var exprReturnsBoolean = function (expr : Expression) : boolean {
			if (expr instanceof LogicalExpression) {
				return _Util.getStash(expr)["returnsBoolean"] as boolean;
			} else {
				return expr.getType().equals(Type.booleanType);
			}
		};
		funcDef.forEachStatement(function onStatement(statement : Statement) : boolean {
			var parentExpr = new Expression[]; // [0] is stack top
			statement.forEachExpression(function onExpr(expr : Expression) : boolean {
				// handle children
				parentExpr.unshift(expr);
				expr.forEachExpression(onExpr);
				parentExpr.shift();
				// check
				if (expr instanceof LogicalExpression) {
					var shouldBooleanize = true;
					var returnsBoolean = false;
					if (exprReturnsBoolean((expr as LogicalExpression).getFirstExpr()) && exprReturnsBoolean((expr as LogicalExpression).getSecondExpr())) {
						returnsBoolean = true;
						shouldBooleanize = false;
					} else if (parentExpr.length == 0) {
						if (statement instanceof ExpressionStatement
							|| statement instanceof IfStatement
							|| statement instanceof DoWhileStatement
							|| statement instanceof WhileStatement
							|| statement instanceof ForStatement) {
							shouldBooleanize = false;
						}
					} else if (parentExpr[0] instanceof LogicalExpression
						|| parentExpr[0] instanceof LogicalNotExpression) {
						shouldBooleanize = false;
					} else if (parentExpr[0] instanceof ConditionalExpression && (parentExpr[0] as ConditionalExpression).getCondExpr() == expr) {
						shouldBooleanize = false;
					}
					_Util.getStash(expr)["shouldBooleanize"] = shouldBooleanize;
					_Util.getStash(expr)["returnsBoolean"] = returnsBoolean;
				}
				return true;
			});
			return statement.forEachStatement(onStatement);
		});
	}

	static function shouldBooleanize (logicalExpr : Expression) : boolean {
		return _Util.getStash(logicalExpr)["shouldBooleanize"] as boolean;
	}

}

// statement emitter

abstract class _StatementEmitter {

	var _emitter : JavaScriptEmitter;

	function constructor (emitter : JavaScriptEmitter) {
		this._emitter = emitter;
	}

	abstract function emit () : void;

}

class _ConstructorInvocationStatementEmitter extends _StatementEmitter {

	var _statement : ConstructorInvocationStatement;

	function constructor (emitter : JavaScriptEmitter, statement : ConstructorInvocationStatement) {
		super(emitter);
		this._statement = statement;
	}

	override function emit () : void {
		var ctorType = this._statement.getConstructorType() as ResolvedFunctionType;
		var argTypes = ctorType != null ? ctorType.getArgumentTypes() : new Type[];
		var ctorName = this._emitter._mangleConstructorName(this._statement.getConstructingClassDef(), argTypes);
		var token = this._statement.getToken();
		if (ctorName == "Error" && this._statement.getArguments().length == 1) {
			/*
				At least v8 does not support "Error.call(this, message)"; it not only does not setup the stacktrace but also does
				not set the message property.  So we set the message property.
				We continue to call "Error" hoping that it would have some positive effect on other platforms (like setting the
				stacktrace, etc.).

				FIXME check that doing  "Error.call(this);" does not have any negative effect on other platforms
			*/
			this._emitter._emit("Error.call(this);\n", token);
			this._emitter._emit("this.message = ", token);
			this._emitter._getExpressionEmitterFor(this._statement.getArguments()[0]).emit(_AssignmentExpressionEmitter._operatorPrecedence["="]);
			this._emitter._emit(";\n", token);
		} else {
			this._emitter._emitCallArguments(token, ctorName + ".call(this", this._statement.getArguments(), argTypes);
			this._emitter._emit(";\n", token);
		}
	}

}

class _ExpressionStatementEmitter extends _StatementEmitter {

	var _statement : ExpressionStatement;

	function constructor (emitter : JavaScriptEmitter, statement : ExpressionStatement) {
		super(emitter);
		this._statement = statement;
	}

	override function emit () : void {
		this._emitter._getExpressionEmitterFor(this._statement.getExpr()).emit(0);
		this._emitter._emit(";\n", null);
	}

}

class _ReturnStatementEmitter extends _StatementEmitter {

	var _statement : ReturnStatement;

	function constructor (emitter : JavaScriptEmitter, statement : ReturnStatement) {
		super(emitter);
		this._statement = statement;
	}

	override function emit () : void {
		var expr = this._statement.getExpr();
		if (expr != null) {
			this._emitter._emit("return ", null);
			if (this._emitter._enableProfiler) {
				this._emitter._emit("$__jsx_profiler.exit(", null);
			}
			this._emitter._emitRHSOfAssignment(this._statement.getExpr(), this._emitter._emittingFunction.getReturnType());
			if (this._emitter._enableProfiler) {
				this._emitter._emit(")", null);
			}
			this._emitter._emit(";\n", null);
		} else {
			if (this._emitter._enableProfiler) {
				this._emitter._emit("return $__jsx_profiler.exit();\n", this._statement.getToken());
			} else {
				this._emitter._emit("return;\n", this._statement.getToken());
			}
		}
	}

}

class _DeleteStatementEmitter extends _StatementEmitter {

	var _statement : DeleteStatement;

	function constructor (emitter : JavaScriptEmitter, statement : DeleteStatement) {
		super(emitter);
		this._statement = statement;
	}

	override function emit () : void {
		this._emitter._emit("delete ", this._statement.getToken());
		this._emitter._getExpressionEmitterFor(this._statement.getExpr()).emit(0);
		this._emitter._emit(";\n", null);
	}

}

class _BreakStatementEmitter extends _StatementEmitter {

	var _statement : BreakStatement;

	function constructor (emitter : JavaScriptEmitter, statement : BreakStatement) {
		super(emitter);
		this._statement = statement;
	}

	override function emit () : void {
		if (this._statement.getLabel() != null)
			this._emitter._emit("break " + this._statement.getLabel().getValue() + ";\n", this._statement.getToken());
		else
			this._emitter._emit("break;\n", this._statement.getToken());
	}

}

class _ContinueStatementEmitter extends _StatementEmitter {

	var _statement : ContinueStatement;

	function constructor (emitter : JavaScriptEmitter, statement : ContinueStatement) {
		super(emitter);
		this._statement = statement;
	}

	override function emit () : void {
		if (this._statement.getLabel() != null)
			this._emitter._emit("continue " + this._statement.getLabel().getValue() + ";\n", this._statement.getToken());
		else
			this._emitter._emit("continue;\n", this._statement.getToken());
	}

}

class _DoWhileStatementEmitter extends _StatementEmitter {

	var _statement : DoWhileStatement;

	function constructor (emitter : JavaScriptEmitter, statement : DoWhileStatement) {
		super(emitter);
		this._statement = statement;
	}

	override function emit () : void {
		_Util.emitLabelOfStatement(this._emitter, this._statement);
		this._emitter._emit("do {\n", null);
		this._emitter._emitStatements(this._statement.getStatements());
		this._emitter._emit("} while (", null);
		this._emitter._getExpressionEmitterFor(this._statement.getExpr()).emit(0);
		this._emitter._emit(");\n", null);
	}

}

class _ForInStatementEmitter extends _StatementEmitter {

	var _statement : ForInStatement;

	function constructor (emitter : JavaScriptEmitter, statement : ForInStatement) {
		super(emitter);
		this._statement = statement;
	}

	override function emit () : void {
		_Util.emitLabelOfStatement(this._emitter, this._statement);
		this._emitter._emit("for (", null);
		this._emitter._getExpressionEmitterFor(this._statement.getLHSExpr()).emit(0);
		this._emitter._emit(" in ", null);
		this._emitter._getExpressionEmitterFor(this._statement.getListExpr()).emit(0);
		this._emitter._emit(") {\n", null);
		this._emitter._emitStatements(this._statement.getStatements());
		this._emitter._emit("}\n", null);
	}

}

class _ForStatementEmitter extends _StatementEmitter {

	var _statement : ForStatement;

	function constructor (emitter : JavaScriptEmitter, statement : ForStatement) {
		super(emitter);
		this._statement = statement;
	}

	override function emit () : void {
		_Util.emitLabelOfStatement(this._emitter, this._statement);
		this._emitter._emit("for (", this._statement.getToken());
		var initExpr = this._statement.getInitExpr();
		if (initExpr != null)
			this._emitter._getExpressionEmitterFor(initExpr).emit(0);
		this._emitter._emit("; ", null);
		var condExpr = this._statement.getCondExpr();
		if (condExpr != null)
			this._emitter._getExpressionEmitterFor(condExpr).emit(0);
		this._emitter._emit("; ", null);
		var postExpr = this._statement.getPostExpr();
		if (postExpr != null)
			this._emitter._getExpressionEmitterFor(postExpr).emit(0);
		this._emitter._emit(") {\n", null);
		this._emitter._emitStatements(this._statement.getStatements());
		this._emitter._emit("}\n", null);
	}

}

class _IfStatementEmitter extends _StatementEmitter {

	var _statement : IfStatement;

	function constructor (emitter : JavaScriptEmitter, statement : IfStatement) {
		super(emitter);
		this._statement = statement;
	}

	override function emit () : void {
		this._emitter._emit("if (", this._statement.getToken());
		this._emitter._getExpressionEmitterFor(this._statement.getExpr()).emit(0);
		this._emitter._emit(") {\n", null);
		this._emitter._emitStatements(this._statement.getOnTrueStatements());
		var ifFalseStatements = this._statement.getOnFalseStatements();
		if (ifFalseStatements.length != 0) {
			this._emitter._emit("} else {\n", null);
			this._emitter._emitStatements(ifFalseStatements);
		}
		this._emitter._emit("}\n", null);
	}

}

class _SwitchStatementEmitter extends _StatementEmitter {

	var _statement : SwitchStatement;

	function constructor (emitter : JavaScriptEmitter, statement : SwitchStatement) {
		super(emitter);
		this._statement = statement;
	}

	override function emit () : void {
		_Util.emitLabelOfStatement(this._emitter, this._statement);
		this._emitter._emit("switch (", this._statement.getToken());
		this._emitter._emitWithNullableGuard(this._statement.getExpr(), 0);
		this._emitter._emit(") {\n", null);
		this._emitter._emitStatements(this._statement.getStatements());
		this._emitter._emit("}\n", null);
	}

}

class _CaseStatementEmitter extends _StatementEmitter {

	var _statement : CaseStatement;

	function constructor (emitter : JavaScriptEmitter, statement : CaseStatement) {
		super(emitter);
		this._statement = statement;
	}

	override function emit () : void {
		this._emitter._reduceIndent();
		this._emitter._emit("case ", null);
		this._emitter._emitWithNullableGuard(this._statement.getExpr(), 0);
		this._emitter._emit(":\n", null);
		this._emitter._advanceIndent();
	}

}

class _DefaultStatementEmitter extends _StatementEmitter {

	var _statement : DefaultStatement;

	function constructor (emitter : JavaScriptEmitter, statement : DefaultStatement) {
		super(emitter);
		this._statement = statement;
	}

	override function emit () : void {
		this._emitter._reduceIndent();
		this._emitter._emit("default:\n", null);
		this._emitter._advanceIndent();
	}

}

class _WhileStatementEmitter extends _StatementEmitter {

	var _statement : WhileStatement;

	function constructor (emitter : JavaScriptEmitter, statement : WhileStatement) {
		super(emitter);
		this._statement = statement;
	}

	override function emit () : void {
		_Util.emitLabelOfStatement(this._emitter, this._statement);
		this._emitter._emit("while (", this._statement.getToken());
		this._emitter._getExpressionEmitterFor(this._statement.getExpr()).emit(0);
		this._emitter._emit(") {\n", null);
		this._emitter._emitStatements(this._statement.getStatements());
		this._emitter._emit("}\n", null);
	}

}

class _TryStatementEmitter extends _StatementEmitter {

	var _statement : TryStatement;
	var _emittingLocalName : string;

	function constructor (emitter : JavaScriptEmitter, statement : TryStatement) {
		super(emitter);
		this._statement = statement;
		var outerCatchStatements = 0;
		for (var i = 0; i < this._emitter._emittingStatementStack.length; ++i) {
			if (this._emitter._emittingStatementStack[i] instanceof _TryStatementEmitter)
				++outerCatchStatements;
		}
		this._emittingLocalName = "$__jsx_catch_" + outerCatchStatements as string;
	}

	override function emit () : void {
		this._emitter._emit("try {\n", this._statement.getToken());
		this._emitter._emitStatements(this._statement.getTryStatements());
		this._emitter._emit("}", null);
		var catchStatements = this._statement.getCatchStatements();
		if (catchStatements.length != 0) {
			this._emitter._emit(" catch (" + this._emittingLocalName + ") {\n", null);
			if (this._emitter._enableProfiler) {
				this._emitter._advanceIndent();
				this._emitter._emit("$__jsx_profiler.resume($__jsx_profiler_ctx);\n", null);
				this._emitter._reduceIndent();
			}
			this._emitter._emitStatements(catchStatements.map.<Statement>((s) -> { return s; }));
			if (! catchStatements[catchStatements.length - 1].getLocal().getType().equals(Type.variantType)) {
				this._emitter._advanceIndent();
				this._emitter._emit("{\n", null);
				this._emitter._advanceIndent();
				this._emitter._emit("throw " + this._emittingLocalName + ";\n", null);
				this._emitter._reduceIndent();
				this._emitter._emit("}\n", null);
				this._emitter._reduceIndent();
			}
			this._emitter._emit("}", null);
		}
		var finallyStatements = this._statement.getFinallyStatements();
		if (finallyStatements.length != 0) {
			this._emitter._emit(" finally {\n", null);
			this._emitter._emitStatements(finallyStatements);
			this._emitter._emit("}", null);
		}
		this._emitter._emit("\n", null);
	}

	function getEmittingLocalName () : string {
		return this._emittingLocalName;
	}

}

class _CatchStatementEmitter extends _StatementEmitter {

	var _statement : CatchStatement;

	function constructor (emitter : JavaScriptEmitter, statement : CatchStatement) {
		super(emitter);
		this._statement = statement;
	}

	override function emit () : void {
		var localType = this._statement.getLocal().getType();
		if (localType instanceof ObjectType) {
			var tryStatement = this._emitter._emittingStatementStack[this._emitter._emittingStatementStack.length - 2] as _TryStatementEmitter;
			var localName = tryStatement.getEmittingLocalName();
			this._emitter._emit("if (" + localName + " instanceof " + localType.getClassDef().getOutputClassName() + ") {\n", this._statement.getToken());
			this._emitter._emitStatements(this._statement.getStatements());
			this._emitter._emit("} else ", null);
		} else {
			this._emitter._emit("{\n", null);
			this._emitter._emitStatements(this._statement.getStatements());
			this._emitter._emit("}\n", null);
		}
	}

	static function getLocalNameFor (emitter : JavaScriptEmitter, name : string) : string {
		for (var i = emitter._emittingStatementStack.length - 1; i >= 0; --i) {
			if (! (emitter._emittingStatementStack[i] instanceof _CatchStatementEmitter))
				continue;
			var catchStatement = emitter._emittingStatementStack[i] as _CatchStatementEmitter;
			if (catchStatement._statement.getLocal().getName().getValue() == name) {
				var tryEmitter = emitter._emittingStatementStack[i - 1];
				if (! (tryEmitter instanceof _TryStatementEmitter))
					throw new Error("logic flaw");
				return (tryEmitter as _TryStatementEmitter).getEmittingLocalName();
			}
		}
		throw new Error("logic flaw");
	}

}

class _ThrowStatementEmitter extends _StatementEmitter {

	var _statement : ThrowStatement;

	function constructor (emitter : JavaScriptEmitter, statement : ThrowStatement) {
		super(emitter);
		this._statement = statement;
	}

	override function emit () : void {
		this._emitter._emit("throw ", this._statement.getToken());
		this._emitter._getExpressionEmitterFor(this._statement.getExpr()).emit(0);
		this._emitter._emit(";\n", null);
	}

}

class _AssertStatementEmitter extends _StatementEmitter {

	var _statement : AssertStatement;

	function constructor (emitter : JavaScriptEmitter, statement : AssertStatement) {
		super(emitter);
		this._statement = statement;
	}

	override function emit () : void {
		var condExpr = this._statement._expr;
		this._emitter._emitAssertion(function () {
			this._emitter._getExpressionEmitterFor(condExpr).emit(0);
		}, this._statement.getToken(), "assertion failure");
	}

}

class _LogStatementEmitter extends _StatementEmitter {

	var _statement : LogStatement;

	function constructor (emitter : JavaScriptEmitter, statement : LogStatement) {
		super(emitter);
		this._statement = statement;
	}

	override function emit () : void {
		this._emitter._emit("console.log(", this._statement.getToken());
		var exprs = this._statement.getExprs();
		for (var i = 0; i < exprs.length; ++i) {
			if (i != 0)
				this._emitter._emit(", ", null);
			this._emitter._getExpressionEmitterFor(exprs[i]).emit(0);
		}
		this._emitter._emit(");\n", null);
	}

}

class _DebuggerStatementEmitter extends _StatementEmitter {

	var _statement : DebuggerStatement;

	function constructor (emitter : JavaScriptEmitter, statement : DebuggerStatement) {
		super(emitter);
		this._statement = statement;
	}

	override function emit () : void {
		this._emitter._emit("debugger;\n", this._statement.getToken());
	}

}

// expression emitter

abstract class _ExpressionEmitter {

	var _emitter : JavaScriptEmitter;

	function constructor (emitter : JavaScriptEmitter) {
		this._emitter = emitter;
	}

	abstract function emit (outerOpPrecedence : number) : void;

	function emitWithPrecedence (outerOpPrecedence : number, precedence : number, callback : function():void) : void {
		if (precedence > outerOpPrecedence) {
			this._emitter._emit("(", null);
			callback();
			this._emitter._emit(")", null);
		} else {
			callback();
		}
	}

}

class _LocalExpressionEmitter extends _ExpressionEmitter {

	var _expr : LocalExpression;

	function constructor (emitter : JavaScriptEmitter, expr : LocalExpression) {
		super(emitter);
		this._expr = expr;
	}

	override function emit (outerOpPrecedence : number) : void {
		var local = this._expr.getLocal();
		var localName = local.getName().getValue();
		if (local instanceof CaughtVariable) {
			localName = _CatchStatementEmitter.getLocalNameFor(this._emitter, localName);
		}
		this._emitter._emit(localName, this._expr.getToken());
	}

}

class _ClassExpressionEmitter extends _ExpressionEmitter {

	var _expr : ClassExpression;

	function constructor (emitter : JavaScriptEmitter, expr : ClassExpression) {
		super(emitter);
		this._expr = expr;
	}

	override function emit (outerOpPrecedence : number) : void {
		var type = this._expr.getType();
		this._emitter._emit(type.getClassDef().getOutputClassName(), null);
	}

}

class _NullExpressionEmitter extends _ExpressionEmitter {

	var _expr : NullExpression;

	function constructor (emitter : JavaScriptEmitter, expr : NullExpression) {
		super(emitter);
		this._expr = expr;
	}

	override function emit (outerOpPrecedence : number) : void {
		var token = this._expr.getToken();
		this._emitter._emit("null", token);
	}

}

class _BooleanLiteralExpressionEmitter extends _ExpressionEmitter {

	var _expr : BooleanLiteralExpression;

	function constructor (emitter : JavaScriptEmitter, expr : BooleanLiteralExpression) {
		super(emitter);
		this._expr = expr;
	}

	override function emit (outerOpPrecedence : number) : void {
		var token = this._expr.getToken();
		this._emitter._emit(token.getValue(), token);
	}

}

class _IntegerLiteralExpressionEmitter extends _ExpressionEmitter {

	var _expr : IntegerLiteralExpression;

	function constructor (emitter : JavaScriptEmitter, expr : IntegerLiteralExpression) {
		super(emitter);
		this._expr = expr;
	}

	override function emit (outerOpPrecedence : number) : void {
		var token = this._expr.getToken();
		this._emitter._emit("" + token.getValue(), token);
	}

}

class _NumberLiteralExpressionEmitter extends _ExpressionEmitter {

	var _expr : NumberLiteralExpression;

	function constructor (emitter : JavaScriptEmitter, expr : NumberLiteralExpression) {
		super(emitter);
		this._expr = expr;
	}

	override function emit (outerOpPrecedence : number) : void {
		var token = this._expr.getToken();
		var str = token.getValue();
		if (outerOpPrecedence == _PropertyExpressionEmitter._operatorPrecedence && str.indexOf(".") == -1) {
			this._emitter._emit("(" + str + ")", token);
		} else {
			this._emitter._emit("" + str, token);
		}
	}

}

class _StringLiteralExpressionEmitter extends _ExpressionEmitter {

	var _expr : StringLiteralExpression;

	function constructor (emitter : JavaScriptEmitter, expr : StringLiteralExpression) {
		super(emitter);
		this._expr = expr;
	}

	override function emit (outerOpPrecedence : number) : void {
		var token = this._expr.getToken();
		// FIXME escape
		this._emitter._emit(token.getValue(), token);
	}

}

class _RegExpLiteralExpressionEmitter extends _ExpressionEmitter {

	var _expr : RegExpLiteralExpression;

	function constructor (emitter : JavaScriptEmitter, expr : RegExpLiteralExpression) {
		super(emitter);
		this._expr = expr;
	}

	override function emit (outerOpPrecedence : number) : void {
		var token = this._expr.getToken();
		this._emitter._emit(token.getValue(), token);
	}

}

class _ArrayLiteralExpressionEmitter extends _ExpressionEmitter {

	var _expr : ArrayLiteralExpression;

	function constructor (emitter : JavaScriptEmitter, expr : ArrayLiteralExpression) {
		super(emitter);
		this._expr = expr;
	}

	override function emit (outerOpPrecedence : number) : void {
		this._emitter._emit("[ ", null);
		var exprs = this._expr.getExprs();
		for (var i = 0; i < exprs.length; ++i) {
			if (i != 0)
				this._emitter._emit(", ", null);
			this._emitter._getExpressionEmitterFor(exprs[i]).emit(0);
		}
		this._emitter._emit(" ]", null);
	}

}

class _MapLiteralExpressionEmitter extends _ExpressionEmitter {

	var _expr : MapLiteralExpression;

	function constructor (emitter : JavaScriptEmitter, expr : MapLiteralExpression) {
		super(emitter);
		this._expr = expr;
	}

	override function emit (outerOpPrecedence : number) : void {
		this._emitter._emit("{ ", null);
		var elements = this._expr.getElements();
		for (var i = 0; i < elements.length; ++i) {
			var element = elements[i];
			if (i != 0)
				this._emitter._emit(", ", null);
			this._emitter._emit(element.getKey().getValue(), element.getKey());
			this._emitter._emit(": ", null);
			this._emitter._getExpressionEmitterFor(element.getExpr()).emit(0);
		}
		this._emitter._emit(" }", null);
	}

}

class _ThisExpressionEmitter extends _ExpressionEmitter {

	var _expr : ThisExpression;

	function constructor (emitter : JavaScriptEmitter, expr : ThisExpression) {
		super(emitter);
		this._expr = expr;
	}

	override function emit (outerOpPrecedence : number) : void {
		var emittingFunction = this._emitter._emittingFunction;
		if ((emittingFunction.flags() & ClassDefinition.IS_STATIC) != 0)
			this._emitter._emit("$this", this._expr.getToken());
		else
			this._emitter._emit("this", this._expr.getToken());
	}

}

class _AsExpressionEmitter extends _ExpressionEmitter {

	var _expr : AsExpression;

	function constructor (emitter : JavaScriptEmitter, expr : AsExpression) {
		super(emitter);
		this._expr = expr;
	}

	override function emit (outerOpPrecedence : number) : void {
		var srcType = this._expr.getExpr().getType();
		var destType = this._expr.getType();
		if (srcType instanceof ObjectType || srcType.equals(Type.variantType)) {
			if (srcType.isConvertibleTo(destType)) {
				this._emitter._getExpressionEmitterFor(this._expr.getExpr()).emit(outerOpPrecedence);
				return;
			}
			if (destType instanceof ObjectType || destType instanceof FunctionType) {
				// unsafe cast
				new _AsNoConvertExpressionEmitter(this._emitter, new AsNoConvertExpression(this._expr.getToken(), this._expr.getExpr(), this._expr.getType())).emit(outerOpPrecedence);
				return;
			}
		}
		if (srcType.resolveIfNullable().equals(Type.booleanType)) {
			// from boolean
			if (destType.equals(Type.integerType) || destType.equals(Type.numberType)) {
				var prec = _UnaryExpressionEmitter._operatorPrecedence["+"];
				this._emitWithParens(outerOpPrecedence, prec, prec, "+", null);
				return;
			}
			if (destType.equals(Type.stringType)) {
				var prec = _AdditiveExpressionEmitter._operatorPrecedence;
				this._emitWithParens(outerOpPrecedence, prec, prec, null, " + \"\"");
				return;
			}
		}
		if (srcType.resolveIfNullable().equals(Type.integerType)) {
			// from integer
			if (destType.equals(Type.booleanType)) {
				var prec = _UnaryExpressionEmitter._operatorPrecedence["!"];
				this._emitWithParens(outerOpPrecedence, prec, prec, "!! ", null);
				return;
			}
			if (destType.equals(Type.numberType)) {
				this._emitter._getExpressionEmitterFor(this._expr.getExpr()).emit(outerOpPrecedence);
				return;
			}
			if (destType.equals(Type.stringType)) {
				var prec = _AdditiveExpressionEmitter._operatorPrecedence;
				this._emitWithParens(outerOpPrecedence, prec, prec, null, " + \"\"");
				return;
			}
		}
		if (srcType.resolveIfNullable().equals(Type.numberType)) {
			// from number
			if (destType.equals(Type.booleanType)) {
				var prec = _UnaryExpressionEmitter._operatorPrecedence["!"];
				this._emitWithParens(outerOpPrecedence, prec, prec, "!! ", null);
				return;
			}
			if (destType.equals(Type.integerType)) {
				var prec = _BinaryNumberExpressionEmitter._operatorPrecedence["|"];
				this._emitWithParens(outerOpPrecedence, prec, prec, null, " | 0");
				return;
			}
			if (destType.equals(Type.stringType)) {
				var prec = _AdditiveExpressionEmitter._operatorPrecedence;
				this._emitWithParens(outerOpPrecedence, prec, prec, null, " + \"\"");
				return;
			}
		}
		if (srcType.resolveIfNullable().equals(Type.stringType)) {
			// from string
			if (destType.equals(Type.booleanType)) {
				var prec = _UnaryExpressionEmitter._operatorPrecedence["!"];
				this._emitWithParens(outerOpPrecedence, prec, prec, "!! ", null);
				return;
			}
			if (destType.equals(Type.integerType)) {
				var prec = _BinaryNumberExpressionEmitter._operatorPrecedence["|"];
				this._emitWithParens(outerOpPrecedence, prec, prec, null, " | 0");
				return;
			}
			if (destType.equals(Type.numberType)) {
				var prec = _UnaryExpressionEmitter._operatorPrecedence["+"];
				this._emitWithParens(outerOpPrecedence, prec, prec, "+", null);
				return;
			}
		}
		if (srcType.equals(Type.variantType)) {
			// from variant
			if (destType.equals(Type.booleanType)) {
				var prec = _UnaryExpressionEmitter._operatorPrecedence["!"];
				this._emitWithParens(outerOpPrecedence, prec, prec, "!! ", null);
				return;
			}
			if (destType.equals(Type.integerType)) {
				var prec = _BinaryNumberExpressionEmitter._operatorPrecedence["|"];
				this._emitWithParens(outerOpPrecedence, prec, prec, null, " | 0");
				return;
			}
			if (destType.equals(Type.numberType)) {
				var prec = _UnaryExpressionEmitter._operatorPrecedence["+"];
				this._emitWithParens(outerOpPrecedence, prec, prec, "+", null);
				return;
			}
			if (destType.equals(Type.stringType)) {
				var prec = _AdditiveExpressionEmitter._operatorPrecedence;
				this._emitWithParens(outerOpPrecedence, prec, prec, null, " + \"\"");
				return;
			}
		}
		if (srcType.isConvertibleTo(destType)) {
			// can perform implicit conversion
			if (srcType instanceof NullableType) {
				this._emitter._emitWithNullableGuard(this._expr.getExpr(), outerOpPrecedence);
			} else {
				this._emitter._getExpressionEmitterFor(this._expr.getExpr()).emit(outerOpPrecedence);
			}
			return;
		}
		throw new Error("explicit conversion logic unknown from " + srcType.toString() + " to " + destType.toString());
	}

	function _emitWithParens (outerOpPrecedence : number, opPrecedence : number, innerOpPrecedence : number, prefix : Nullable.<string>, postfix : Nullable.<string>) : void {
		// in contrast to _ExpressionEmitter#emitWithPrecedence the comparison op. is >=, since the conversion should have higher precedence than the outer op. (see t/run/110)
		if (opPrecedence >= outerOpPrecedence)
			this._emitter._emit("(", null);
		if (prefix != null)
			this._emitter._emit(prefix, this._expr.getToken());
		this._emitter._emitWithNullableGuard(this._expr.getExpr(), innerOpPrecedence);
		if (postfix != null)
			this._emitter._emit(postfix, this._expr.getToken());
		if (opPrecedence >= outerOpPrecedence)
			this._emitter._emit(")", null);
	}

}

class _AsNoConvertExpressionEmitter extends _ExpressionEmitter {

	var _expr : AsNoConvertExpression;

	function constructor (emitter : JavaScriptEmitter, expr : AsNoConvertExpression) {
		super(emitter);
		this._expr = expr;
	}

	override function emit (outerOpPrecedence : number) : void {
		if (this._emitter._enableRunTimeTypeCheck) {
			var emitWithAssertion = function (emitCheckExpr : () -> void, message : string) : void {
				var token = this._expr.getToken();
				this._emitter._emit("(function (v) {\n", token);
				this._emitter._advanceIndent();
				this._emitter._emitAssertion(emitCheckExpr, token, message);
				this._emitter._emit("return v;\n", token);
				this._emitter._reduceIndent();
				this._emitter._emit("}(", token);
				this._emitter._getExpressionEmitterFor(this._expr.getExpr()).emit(0);
				this._emitter._emit("))", token);
			};
			var srcType = this._expr.getExpr().getType();
			var destType = this._expr.getType();
			if (srcType.equals(destType) || srcType.equals(destType.resolveIfNullable())) {
				// skip
			} else if (destType instanceof VariantType) {
				// skip
			} else if (srcType instanceof ObjectType && srcType.isConvertibleTo(destType)) {
				// skip
			} else if (destType.equals(Type.booleanType)) {
				emitWithAssertion(function () : void {
					this._emitter._emit("typeof v === \"boolean\"", this._expr.getToken());
				}, "detected invalid cast, value is not a boolean");
				return;
			} else if (destType.resolveIfNullable().equals(Type.booleanType)) {
				emitWithAssertion(function () : void {
					this._emitter._emit("v == null || typeof v === \"boolean\"", this._expr.getToken());
				}, "detected invalid cast, value is not a boolean nor null");
				return;
			} else if (destType.equals(Type.numberType)) {
				emitWithAssertion(function () {
					this._emitter._emit("typeof v === \"number\"", this._expr.getToken());
				}, "detected invalid cast, value is not a number");
				return;
			} else if (destType.resolveIfNullable().equals(Type.numberType)) {
				emitWithAssertion(function () {
					this._emitter._emit("v == null || typeof v === \"number\"", this._expr.getToken());
				}, "detected invalid cast, value is not a number nor nullable");
				return;
			} else if (destType.equals(Type.integerType)) {
				emitWithAssertion(function () {
					this._emitter._emit("typeof v === \"number\" && (! $__jsx_isFinite(v) || v % 1 === 0)", this._expr.getToken());
				}, "detected invalid cast, value is not an int");
				return;
			} else if (destType.resolveIfNullable().equals(Type.integerType)) {
				emitWithAssertion(function () {
					this._emitter._emit("v == null || typeof v === \"number\" && (! $__jsx_isFinite(v) || v % 1 === 0)", this._expr.getToken());
				}, "detected invalid cast, value is not an int nor null");
				return;
			} else if (destType.equals(Type.stringType)) {
				emitWithAssertion(function () {
					this._emitter._emit("typeof v === \"string\"", this._expr.getToken());
				}, "detected invalid cast, value is not a string");
				return;
			} else if (destType.resolveIfNullable().equals(Type.stringType)) {
				emitWithAssertion(function () {
					this._emitter._emit("v == null || typeof v === \"string\"", this._expr.getToken());
				}, "detected invalid cast, value is not a string nor null");
				return;
			} else if (destType instanceof FunctionType) {
				emitWithAssertion(function () {
					this._emitter._emit("v == null || typeof v === \"function\"", this._expr.getToken());
				}, "detected invalid cast, value is not a function or null");
				return;
			} else if (destType instanceof ObjectType) {
				var destClassDef = destType.getClassDef();
				if ((destClassDef.flags() & ClassDefinition.IS_FAKE) != 0) {
					// skip
				} else if (destClassDef instanceof InstantiatedClassDefinition && (destClassDef as InstantiatedClassDefinition).getTemplateClassName() == "Array") {
					emitWithAssertion(function () {
						this._emitter._emit("v == null || v instanceof Array", this._expr.getToken());
					}, "detected invalid cast, value is not an Array or null");
					return;
				} else if (destClassDef instanceof InstantiatedClassDefinition && (destClassDef as InstantiatedClassDefinition).getTemplateClassName() == "Map") {
					if (srcType.equals(Type.variantType)) {
						// variant which is "typeof function" may be converted to a Map.<variant>
						emitWithAssertion(function () {
							this._emitter._emit("v == null || typeof v === \"object\" || typeof v === \"function\"", this._expr.getToken());
						}, "detected invalid cast, value is not a Map, function or null");
					} else {
						emitWithAssertion(function () {
							this._emitter._emit("v == null || typeof v === \"object\"", this._expr.getToken());
						}, "detected invalid cast, value is not a Map or null");
					}
					return;
				} else if ((destClassDef.flags() & (ClassDefinition.IS_INTERFACE | ClassDefinition.IS_MIXIN)) == 0) {
					emitWithAssertion(function () {
						this._emitter._emit("v == null || v instanceof " + destClassDef.getOutputClassName(), this._expr.getToken());
					}, "detected invalid cast, value is not an instance of the designated type or null");
					return;
				} else {
					emitWithAssertion(function () {
						this._emitter._emit("v == null || v.$__jsx_implements_" + destClassDef.getOutputClassName(), this._expr.getToken());
					}, "detected invalid cast, value is not an instance of the designated type or null");
					return;
				}
			} else {
				throw new Error("Hmm");
			}
		}
		this._emitter._getExpressionEmitterFor(this._expr.getExpr()).emit(outerOpPrecedence);
		return;
	}

}

abstract class _OperatorExpressionEmitter extends _ExpressionEmitter {

	function constructor (emitter : JavaScriptEmitter) {
		super(emitter);
	}

	override function emit (outerOpPrecedence : number) : void {
		this.emitWithPrecedence(outerOpPrecedence, this._getPrecedence(), function () : void { this._emit(); });
	}

	function _emit () : void {
	}

	abstract function _getPrecedence () : number;

}

class _UnaryExpressionEmitter extends _OperatorExpressionEmitter {

	var _expr : UnaryExpression;

	function constructor (emitter : JavaScriptEmitter, expr : UnaryExpression) {
		super(emitter);
		this._expr = expr;
	}

	override function _emit () : void {
		var opToken = this._expr.getToken();
		this._emitter._emit(opToken.getValue() + " ", opToken);
		this._emitter._getExpressionEmitterFor(this._expr.getExpr()).emit(this._getPrecedence());
	}

	override function _getPrecedence () : number {
		return _UnaryExpressionEmitter._operatorPrecedence[this._expr.getToken().getValue()];
	}

	static const _operatorPrecedence = new Map.<number>;

	static function _setOperatorPrecedence (op : string, precedence : number) : void {
		_UnaryExpressionEmitter._operatorPrecedence[op] = precedence;
	}

}

class _PostfixExpressionEmitter extends _UnaryExpressionEmitter {

	function constructor (emitter : JavaScriptEmitter, expr : UnaryExpression) {
		super(emitter, expr);
	}

	override function _emit () : void {
		var opToken = this._expr.getToken();
		this._emitter._getExpressionEmitterFor(this._expr.getExpr()).emit(this._getPrecedence());
		this._emitter._emit(opToken.getValue(), opToken);
	}

	override function _getPrecedence () : number {
		return _PostfixExpressionEmitter._operatorPrecedence[this._expr.getToken().getValue()];
	}

	static const _operatorPrecedence = new Map.<number>;

	static function _setOperatorPrecedence (op : string, precedence : number) : void {
		_PostfixExpressionEmitter._operatorPrecedence[op] = precedence;
	}

}

class _InstanceofExpressionEmitter extends _ExpressionEmitter {

	var _expr : InstanceofExpression;

	function constructor (emitter : JavaScriptEmitter, expr : InstanceofExpression) {
		super(emitter);
		this._expr = expr;
	}

	override function emit (outerOpPrecedence : number) : void {
		var expectedType = this._expr.getExpectedType();
		if (expectedType.getClassDef() instanceof InstantiatedClassDefinition && (expectedType.getClassDef() as InstantiatedClassDefinition).getTemplateClassName() == "Array") {
			this.emitWithPrecedence(outerOpPrecedence, _InstanceofExpressionEmitter._operatorPrecedence, function () {
				this._emitter._getExpressionEmitterFor(this._expr.getExpr()).emit(_InstanceofExpressionEmitter._operatorPrecedence);
				this._emitter._emit(" instanceof Array", this._expr.getToken());
			});
		} else if (expectedType.getClassDef() instanceof InstantiatedClassDefinition && (expectedType.getClassDef() as InstantiatedClassDefinition).getTemplateClassName() == "Map") {
			this.emitWithPrecedence(outerOpPrecedence, _InstanceofExpressionEmitter._operatorPrecedence, function () {
				this._emitter._emit("(typeof(", this._expr.getToken());
				this._emitter._getExpressionEmitterFor(this._expr.getExpr()).emit(_InstanceofExpressionEmitter._operatorPrecedence);
				this._emitter._emit(") === \"object\")", this._expr.getToken());
			});
		} else if ((expectedType.getClassDef().flags() & (ClassDefinition.IS_INTERFACE | ClassDefinition.IS_MIXIN)) == 0) {
			this.emitWithPrecedence(outerOpPrecedence, _InstanceofExpressionEmitter._operatorPrecedence, (function () {
				this._emitter._getExpressionEmitterFor(this._expr.getExpr()).emit(_InstanceofExpressionEmitter._operatorPrecedence);
				this._emitter._emit(" instanceof " + _Util.getInstanceofNameFromClassDef(expectedType.getClassDef()), null);
			}));
		} else {
			this.emitWithPrecedence(outerOpPrecedence, _CallExpressionEmitter._operatorPrecedence, (function () {
				this._emitter._emit("(function (o) { return !! (o && o.$__jsx_implements_" + expectedType.getClassDef().getOutputClassName() + "); })(", this._expr.getToken());
				this._emitter._getExpressionEmitterFor(this._expr.getExpr()).emit(0);
				this._emitter._emit(")", this._expr.getToken());
			}));
		}
	}

	static var _operatorPrecedence = 0;

	static function _setOperatorPrecedence (op : string, precedence : number) : void {
		_InstanceofExpressionEmitter._operatorPrecedence = precedence;
	}

}

class _PropertyExpressionEmitter extends _UnaryExpressionEmitter {

	function constructor (emitter : JavaScriptEmitter, expr : PropertyExpression) {
		super(emitter, expr);
	}

	override function _emit () : void {
		var expr = this._expr as PropertyExpression;
		var exprType = expr.getType();
		var identifierToken = expr.getIdentifierToken();
		// replace methods to global function (e.g. Number.isNaN to isNaN)
		if (expr.getExpr() instanceof ClassExpression
			&& expr.getExpr().getType().getClassDef() == Type.numberType.getClassDef()) {
			switch (identifierToken.getValue()) {
			case "parseInt":
			case "parseFloat":
			case "isNaN":
			case "isFinite":
				this._emitter._emit('$__jsx_' + identifierToken.getValue(), identifierToken);
				return;
			}
		}
		else if (expr.getExpr() instanceof ClassExpression
			&& expr.getExpr().getType().getClassDef() == Type.stringType.getClassDef()) {
			switch (identifierToken.getValue()) {
			case "encodeURIComponent":
			case "decodeURIComponent":
			case "encodeURI":
			case "decodeURI":
				this._emitter._emit('$__jsx_' + identifierToken.getValue(), identifierToken);
				return;
			}
		}

		this._emitter._getExpressionEmitterFor(expr.getExpr()).emit(this._getPrecedence());
		// mangle the name if necessary
		if (exprType instanceof FunctionType && ! exprType.isAssignable()
			&& (expr.getHolderType().getClassDef().flags() & ClassDefinition.IS_NATIVE) == 0) {
			if (expr.getExpr() instanceof ClassExpression) {
				// do not use "." notation for static functions, but use class$name
				this._emitter._emit("$", identifierToken);
			} else {
				this._emitter._emit(".", identifierToken);
			}
			this._emitter._emit(this._emitter._mangleFunctionName(identifierToken.getValue(), (exprType as ResolvedFunctionType).getArgumentTypes()), identifierToken);
		} else {
			this._emitter._emit(".", identifierToken);
			this._emitter._emit(identifierToken.getValue(), identifierToken);
		}
	}

	override function _getPrecedence () : number {
		return _PropertyExpressionEmitter._operatorPrecedence;
	}

	static var _operatorPrecedence = 0;

	static function _setOperatorPrecedence (op : string, precedence : number) : void {
		_PropertyExpressionEmitter._operatorPrecedence = precedence;
	}

}

class _FunctionExpressionEmitter extends _OperatorExpressionEmitter {

	var _expr : FunctionExpression;

	function constructor (emitter : JavaScriptEmitter, expr : FunctionExpression) {
		super(emitter);
		this._expr = expr;
	}

	override function _emit () : void {
		var funcDef = this._expr.getFuncDef();
		this._emitter._emit("(function (", funcDef.getToken());
		var args = funcDef.getArguments();
		for (var i = 0; i < args.length; ++i) {
			if (i != 0)
				this._emitter._emit(", ", funcDef.getToken());
			this._emitter._emit(args[i].getName().getValue(), funcDef.getToken());
		}
		this._emitter._emit(") {\n", funcDef.getToken());
		this._emitter._advanceIndent();
		this._emitter._emitFunctionBody(funcDef);
		this._emitter._reduceIndent();
		this._emitter._emit("})", funcDef.getToken());
	}

	override function _getPrecedence () : number {
		return _FunctionExpressionEmitter._operatorPrecedence;
	}

	static var _operatorPrecedence = 0;

	static function _setOperatorPrecedence (op : string, precedence : number) : void {
		_FunctionExpressionEmitter._operatorPrecedence = precedence;
	}

}

class _AdditiveExpressionEmitter extends _OperatorExpressionEmitter {

	var _expr : AdditiveExpression;

	function constructor (emitter : JavaScriptEmitter, expr : AdditiveExpression) {
		super(emitter);
		this._expr = expr;
	}

	override function _emit () : void {
		this._emitter._emitWithNullableGuard(this._expr.getFirstExpr(), _AdditiveExpressionEmitter._operatorPrecedence);
		this._emitter._emit(" + ", this._expr.getToken());
		this._emitter._emitWithNullableGuard(this._expr.getSecondExpr(), _AdditiveExpressionEmitter._operatorPrecedence - 1);
	}

	override function _getPrecedence () : number {
		return _AdditiveExpressionEmitter._operatorPrecedence;
	}

	static var _operatorPrecedence = 0;

	static function _setOperatorPrecedence (op : string, precedence : number) : void {
		_AdditiveExpressionEmitter._operatorPrecedence = precedence;
	}

}

class _AssignmentExpressionEmitter extends _OperatorExpressionEmitter {

	var _expr : AssignmentExpression;

	function constructor (emitter : JavaScriptEmitter, expr : AssignmentExpression) {
		super(emitter);
		this._expr = expr;
	}

	override function emit (outerOpPrecedence : number) : void {
		if (this._expr.getToken().getValue() == "/="
			&& this._expr.getFirstExpr().getType().resolveIfNullable().equals(Type.integerType)) {
			this._emitDivAssignToInt(outerOpPrecedence);
			return;
		}
		// normal handling
		super.emit(outerOpPrecedence);
	}

	override function _emit () : void {
		var op = this._expr.getToken().getValue();
		this._emitter._getExpressionEmitterFor(this._expr.getFirstExpr()).emit(_AssignmentExpressionEmitter._operatorPrecedence[op]);
		this._emitter._emit(" " + op + " ", this._expr.getToken());
		this._emitter._emitRHSOfAssignment(this._expr.getSecondExpr(), this._expr.getFirstExpr().getType());
	}

	function _emitDivAssignToInt (outerOpPrecedence : number) : void {
		var firstExpr = this._expr.getFirstExpr();
		var secondExpr = this._expr.getSecondExpr();
		if (firstExpr instanceof PropertyExpression || firstExpr instanceof ArrayExpression) {
			this._emitter._emit("$__jsx_div_assign(", this._expr.getToken());
			if (firstExpr instanceof PropertyExpression) {
				this._emitter._getExpressionEmitterFor((firstExpr as PropertyExpression).getExpr()).emit(0);
				this._emitter._emit(", ", this._expr.getToken());
				this._emitter._emit(Util.encodeStringLiteral((firstExpr as PropertyExpression).getIdentifierToken().getValue()), (firstExpr as PropertyExpression).getIdentifierToken());
			} else {
				this._emitter._getExpressionEmitterFor((firstExpr as ArrayExpression).getFirstExpr()).emit(0);
				this._emitter._emit(", ", this._expr.getToken());
				this._emitter._getExpressionEmitterFor((firstExpr as ArrayExpression).getSecondExpr()).emit(0);
			}
			this._emitter._emit(", ", this._expr.getToken());
			this._emitter._emitWithNullableGuard(secondExpr, 0);
			this._emitter._emit(")", this._expr.getToken());
		} else {
			this.emitWithPrecedence(outerOpPrecedence, _AssignmentExpressionEmitter._operatorPrecedence["="], function () {
				this._emitter._getExpressionEmitterFor(firstExpr).emit(_AssignmentExpressionEmitter._operatorPrecedence["="]);
				this._emitter._emit(" = (", this._expr.getToken());
				this._emitter._emitWithNullableGuard(firstExpr, _BinaryNumberExpressionEmitter._operatorPrecedence["/"]);
				this._emitter._emit(" / ", this._expr.getToken());
				this._emitter._emitWithNullableGuard(secondExpr, _BinaryNumberExpressionEmitter._operatorPrecedence["/"] - 1);
				this._emitter._emit(") | 0", this._expr.getToken());
			});
		}
	}

	override function _getPrecedence () : number {
		return _AssignmentExpressionEmitter._operatorPrecedence[this._expr.getToken().getValue()];
	}

	static const _operatorPrecedence = new Map.<number>;

	static function _setOperatorPrecedence (op : string, precedence : number) : void {
		_AssignmentExpressionEmitter._operatorPrecedence[op] = precedence;
	}

}

class _EqualityExpressionEmitter extends _OperatorExpressionEmitter {

	var _expr : EqualityExpression;

	function constructor (emitter : JavaScriptEmitter, expr : EqualityExpression) {
		super(emitter);
		this._expr = expr;
	}

	override function _emit () : void {
		var op = this._expr.getToken().getValue();
		var emitOp = op;
		// NOTE: works for cases where one side is an object and the other is the primitive counterpart
		if (this._expr.getFirstExpr().getType() instanceof PrimitiveType && this._expr.getSecondExpr().getType() instanceof PrimitiveType) {
			emitOp += "=";
		}
		this._emitter._getExpressionEmitterFor(this._expr.getFirstExpr()).emit(_EqualityExpressionEmitter._operatorPrecedence[op]);
		this._emitter._emit(" " + emitOp + " ", this._expr.getToken());
		this._emitter._getExpressionEmitterFor(this._expr.getSecondExpr()).emit(_EqualityExpressionEmitter._operatorPrecedence[op]);
	}

	override function _getPrecedence () : number {
		return _EqualityExpressionEmitter._operatorPrecedence[this._expr.getToken().getValue()];
	}

	static const _operatorPrecedence = new Map.<number>;

	static function _setOperatorPrecedence (op : string, precedence : number) : void {
		_EqualityExpressionEmitter._operatorPrecedence[op] = precedence;
	}

}

class _InExpressionEmitter extends _OperatorExpressionEmitter {

	var _expr : InExpression;

	function constructor (emitter : JavaScriptEmitter, expr : InExpression) {
		super(emitter);
		this._expr = expr;
	}

	override function _emit () : void {
		this._emitter._emitWithNullableGuard(this._expr.getFirstExpr(), _InExpressionEmitter._operatorPrecedence);
		this._emitter._emit(" in ", this._expr.getToken());
		this._emitter._getExpressionEmitterFor(this._expr.getSecondExpr()).emit(_InExpressionEmitter._operatorPrecedence);
	}

	override function _getPrecedence () : number {
		return _InExpressionEmitter._operatorPrecedence;
	}

	static var _operatorPrecedence = 0;

	static function _setOperatorPrecedence (op : string, precedence : number) : void {
		_InExpressionEmitter._operatorPrecedence = precedence;
	}

}

class _LogicalExpressionEmitter extends _OperatorExpressionEmitter {

	var _expr : LogicalExpression;

	function constructor (emitter : JavaScriptEmitter, expr : LogicalExpression) {
		super(emitter);
		this._expr = expr;
	}

	override function emit (outerOpPrecedence : number) : void {
		if (_Util.shouldBooleanize(this._expr)) {
			// !! is faster than Boolean, see http://jsperf.com/boolean-vs-notnot
			this._emitter._emit("!! (", this._expr.getToken());
			super.emit(0);
			this._emitter._emit(")", this._expr.getToken());
			return;
		}
		// normal handling
		super.emit(outerOpPrecedence);
	}

	override function _emit () : void {
		var op = this._expr.getToken().getValue();
		this._emitter._getExpressionEmitterFor(this._expr.getFirstExpr()).emit(_LogicalExpressionEmitter._operatorPrecedence[op]);
		this._emitter._emit(" " + op + " ", this._expr.getToken());
		this._emitter._getExpressionEmitterFor(this._expr.getSecondExpr()).emit(_LogicalExpressionEmitter._operatorPrecedence[op] - 1);
	}

	override function _getPrecedence () : number {
		return _LogicalExpressionEmitter._operatorPrecedence[this._expr.getToken().getValue()];
	}

	static const _operatorPrecedence = new Map.<number>;

	static function _setOperatorPrecedence (op : string, precedence : number) : void {
		_LogicalExpressionEmitter._operatorPrecedence[op] = precedence;
	}

}

class _ShiftExpressionEmitter extends _OperatorExpressionEmitter {

	var _expr : ShiftExpression;

	function constructor (emitter : JavaScriptEmitter, expr : ShiftExpression) {
		super(emitter);
		this._expr = expr;
	}

	override function _emit () : void {
		var op = this._expr.getToken().getValue();
		this._emitter._emitWithNullableGuard(this._expr.getFirstExpr(), _ShiftExpressionEmitter._operatorPrecedence[op]);
		this._emitter._emit(" " + op + " ", this._expr.getToken());
		this._emitter._emitWithNullableGuard(this._expr.getSecondExpr(), _ShiftExpressionEmitter._operatorPrecedence[op] - 1);
	}

	override function _getPrecedence () : number {
		return _ShiftExpressionEmitter._operatorPrecedence[this._expr.getToken().getValue()];
	}

	static const _operatorPrecedence = new Map.<number>;

	static function _setOperatorPrecedence (op : string, precedence : number) : void {
		_ShiftExpressionEmitter._operatorPrecedence[op] = precedence;
	}

}

class _BinaryNumberExpressionEmitter extends _OperatorExpressionEmitter {

	var _expr : BinaryNumberExpression;

	function constructor (emitter : JavaScriptEmitter, expr : BinaryNumberExpression) {
		super(emitter);
		this._expr = expr;
	}

	override function emit (outerOpPrecedence : number) : void {
		// optimize "1 * x" => x
		if (this._expr.getToken().getValue() == "*") {
			if (this._emitIfEitherIs(outerOpPrecedence, function (expr1, expr2) {
				return ((expr1 instanceof IntegerLiteralExpression || expr1 instanceof NumberLiteralExpression) && (expr1.getToken().getValue() as number) == 1)
					? expr2 : null;
			})) {
				return;
			}
		}
		// normal
		super.emit(outerOpPrecedence);
	}

	override function _emit () : void {
		var op = this._expr.getToken().getValue();
		this._emitter._emitWithNullableGuard(this._expr.getFirstExpr(), _BinaryNumberExpressionEmitter._operatorPrecedence[op]);
		this._emitter._emit(" " + op + " ", this._expr.getToken());
		this._emitter._emitWithNullableGuard(this._expr.getSecondExpr(), _BinaryNumberExpressionEmitter._operatorPrecedence[op] - 1);
	}

	function _emitIfEitherIs (outerOpPrecedence : number, cb : function(:Expression,:Expression):Expression) : boolean {
		var outcomeExpr;
		if ((outcomeExpr = cb(this._expr.getFirstExpr(), this._expr.getSecondExpr())) != null
			|| (outcomeExpr = cb(this._expr.getSecondExpr(), this._expr.getFirstExpr())) != null) {
			this._emitter._getExpressionEmitterFor(outcomeExpr).emit(outerOpPrecedence);
			return true;
		} else {
			return false;
		}
	}

	override function _getPrecedence () : number {
		return _BinaryNumberExpressionEmitter._operatorPrecedence[this._expr.getToken().getValue()];
	}

	static const _operatorPrecedence = new Map.<number>;

	static function _setOperatorPrecedence (op : string, precedence : number) : void {
		_BinaryNumberExpressionEmitter._operatorPrecedence[op] = precedence;
	}

}

class _ArrayExpressionEmitter extends _OperatorExpressionEmitter {

	var _expr : ArrayExpression;

	function constructor (emitter : JavaScriptEmitter, expr : ArrayExpression) {
		super(emitter);
		this._expr = expr;
	}

	override function _emit () : void {
		this._emitter._getExpressionEmitterFor(this._expr.getFirstExpr()).emit(_ArrayExpressionEmitter._operatorPrecedence);
		var secondExpr = this._expr.getSecondExpr();
		// property access using . is 4x faster on safari than using [], see http://jsperf.com/access-using-dot-vs-array
		var emitted = false;
		if (secondExpr instanceof StringLiteralExpression) {
			var propertyName = Util.decodeStringLiteral(secondExpr.getToken().getValue());
			if (propertyName.match(/^[\$_A-Za-z][\$_0-9A-Za-z]*$/) != null) {
				this._emitter._emit(".", this._expr.getToken());
				this._emitter._emit(propertyName, secondExpr.getToken());
				emitted = true;
			}
		}
		if (! emitted) {
			this._emitter._emit("[", this._expr.getToken());
			this._emitter._getExpressionEmitterFor(secondExpr).emit(0);
			this._emitter._emit("]", null);
		}
	}

	override function _getPrecedence () : number {
		return _ArrayExpressionEmitter._operatorPrecedence;
	}

	static var _operatorPrecedence = 0;

	static function _setOperatorPrecedence (op : string, precedence : number) : void {
		_ArrayExpressionEmitter._operatorPrecedence = precedence;
	}

}

class _ConditionalExpressionEmitter extends _OperatorExpressionEmitter {

	var _expr : ConditionalExpression;

	function constructor (emitter : JavaScriptEmitter, expr : ConditionalExpression) {
		super(emitter);
		this._expr = expr;
	}

	override function _emit () : void {
		var precedence = this._getPrecedence();
		var ifTrueExpr = this._expr.getIfTrueExpr();
		if (ifTrueExpr != null) {
			this._emitter._getExpressionEmitterFor(this._expr.getCondExpr()).emit(precedence - 1);
			this._emitter._emit(" ? ", null);
			this._emitter._getExpressionEmitterFor(ifTrueExpr).emit(precedence);
			this._emitter._emit(" : ", null);
			this._emitter._getExpressionEmitterFor(this._expr.getIfFalseExpr()).emit(precedence);
		} else {
			this._emitter._getExpressionEmitterFor(this._expr.getCondExpr()).emit(precedence - 1);
			this._emitter._emit(" || ", null);
			this._emitter._getExpressionEmitterFor(this._expr.getIfFalseExpr()).emit(precedence - 1);
		}
	}

	override function _getPrecedence () : number {
		return this._expr.getIfTrueExpr() != null ? _ConditionalExpressionEmitter._operatorPrecedence : _LogicalExpressionEmitter._operatorPrecedence["||"] as number;
	}

	static var _operatorPrecedence = 0;

	static function _setOperatorPrecedence (op : string, precedence : number) : void {
		_ConditionalExpressionEmitter._operatorPrecedence = precedence;
	}

}

class _CallExpressionEmitter extends _OperatorExpressionEmitter {

	var _expr : CallExpression;

	function constructor (emitter : JavaScriptEmitter, expr : CallExpression) {
		super(emitter);
		this._expr = expr;
	}

	override function _emit () : void {
		if (this._emitSpecial())
			return;
		// normal case
		var calleeExpr = this._expr.getExpr();
		this._emitter._getExpressionEmitterFor(calleeExpr).emit(_CallExpressionEmitter._operatorPrecedence);
		this._emitter._emitCallArguments(this._expr.getToken(), "(", this._expr.getArguments(), (this._expr.getExpr().getType().resolveIfNullable() as ResolvedFunctionType).getArgumentTypes());
	}

	override function _getPrecedence () : number {
		return _CallExpressionEmitter._operatorPrecedence;
	}

	static var _operatorPrecedence = 0;

	static function _setOperatorPrecedence (op : string, precedence : number) : void {
		_CallExpressionEmitter._operatorPrecedence = precedence;
	}

	function _emitSpecial () : boolean {
		// return false if is not js.apply
		var calleeExpr = this._expr.getExpr();
		if (! (calleeExpr instanceof PropertyExpression))
			return false;
		if (this._emitIfJsInvoke(calleeExpr as PropertyExpression))
			return true;
		else if (this._emitCallsToMap(calleeExpr as PropertyExpression))
			return true;
		else if (this._emitIfMathAbs(calleeExpr as PropertyExpression))
			return true;
		return false;
	}

	function _emitIfJsInvoke (calleeExpr : PropertyExpression) : boolean {
		if (! (calleeExpr.getType() instanceof StaticFunctionType))
			return false;
		if (calleeExpr.getIdentifierToken().getValue() != "invoke")
			return false;
		var classDef = calleeExpr.getExpr().getType().getClassDef();
		if (! (classDef.className() == "js" && classDef.getToken().getFilename() == Util.resolvePath(this._emitter._platform.getRoot() + "/lib/js/js.jsx")))
			return false;
		// emit
		var args = this._expr.getArguments();
		if (args[2] instanceof ArrayLiteralExpression) {
			this._emitter._getExpressionEmitterFor(args[0]).emit(_PropertyExpressionEmitter._operatorPrecedence);
			// FIXME emit as property expression if possible
			this._emitter._emit("[", calleeExpr.getToken());
			this._emitter._getExpressionEmitterFor(args[1]).emit(0);
			this._emitter._emit("]", calleeExpr.getToken());
			this._emitter._emitCallArguments(this._expr.getToken(), "(", (args[2] as ArrayLiteralExpression).getExprs(), null);
		} else {
			this._emitter._emit("(function (o, p, a) { return o[p].apply(o, a); }(", calleeExpr.getToken());
			this._emitter._getExpressionEmitterFor(args[0]).emit(0);
			this._emitter._emit(", ", this._expr.getToken());
			this._emitter._getExpressionEmitterFor(args[1]).emit(0);
			this._emitter._emit(", ", this._expr.getToken());
			this._emitter._getExpressionEmitterFor(args[2]).emit(0);
			this._emitter._emit("))", this._expr.getToken());
		}
		return true;
	}

	function _emitCallsToMap (calleeExpr : PropertyExpression) : boolean {
		// NOTE once we support member function references, we need to add special handling in _PropertyExpressionEmitter as well
		if (calleeExpr.getType() instanceof StaticFunctionType)
			return false;
		var classDef = calleeExpr.getExpr().getType().getClassDef();
		if (! (classDef instanceof InstantiatedClassDefinition))
			return false;
		if ((classDef as InstantiatedClassDefinition).getTemplateClassName() != "Map")
			return false;
		switch (calleeExpr.getIdentifierToken().getValue()) {
		case "toString":
			this._emitter._emitCallArguments(
				calleeExpr.getToken(), "$__jsx_ObjectToString.call(", [ calleeExpr.getExpr() ], [ new ObjectType(classDef) as Type ]);
			return true;
		case "hasOwnProperty":
			this._emitter._emitCallArguments(
				calleeExpr.getToken(), "$__jsx_ObjectHasOwnProperty.call(",
				[ calleeExpr.getExpr(), this._expr.getArguments()[0] ],
				[ new ObjectType(classDef) as Type, Type.stringType as Type ]);
			return true;
		default:
			return false;
		}
	}

	function _emitIfMathAbs (calleeExpr : PropertyExpression) : boolean {
		if (! _CallExpressionEmitter._calleeIsMathAbs(calleeExpr))
			return false;
		var argExpr = this._expr.getArguments()[0];
		if (argExpr instanceof LeafExpression) {
			this._emitter._emit("(", this._expr.getToken());
			this._emitter._getExpressionEmitterFor(argExpr).emit(0);
			this._emitter._emit(" >= 0 ? ", this._expr.getToken());
			this._emitter._getExpressionEmitterFor(argExpr).emit(0);
			this._emitter._emit(" : - ", this._expr.getToken());
			this._emitter._getExpressionEmitterFor(argExpr).emit(0);
			this._emitter._emit(")", this._expr.getToken());
		} else {
			this._emitter._emit("(($math_abs_t = ", this._expr.getToken());
			this._emitter._getExpressionEmitterFor(argExpr).emit(_AssignmentExpressionEmitter._operatorPrecedence["="]);
			this._emitter._emit(") >= 0 ? $math_abs_t : -$math_abs_t)", this._expr.getToken());
		}
		return true;
	}

	static function _calleeIsMathAbs (calleeExpr : PropertyExpression) : boolean {
		if (! (calleeExpr.getType() instanceof StaticFunctionType))
			return false;
		if (calleeExpr.getIdentifierToken().getValue() != "abs")
			return false;
		if (calleeExpr.getExpr().getType().getClassDef().className() != "Math")
			return false;
		return true;
	}

	static function mathAbsUsesTemporary (funcDef : MemberFunctionDefinition) : boolean {
		return ! funcDef.forEachStatement(function onStatement(statement : Statement) : boolean {
			if (! statement.forEachExpression(function onExpr(expr : Expression) : boolean {
				var calleeExpr;
				if (expr instanceof CallExpression
					&& (calleeExpr = (expr as CallExpression).getExpr()) instanceof PropertyExpression
					&& _CallExpressionEmitter._calleeIsMathAbs(calleeExpr as PropertyExpression)
					&& ! ((expr as CallExpression).getArguments()[0] instanceof LeafExpression))
					return false;
				return expr.forEachExpression(onExpr);
			})) {
				return false;
			}
			return statement.forEachStatement(onStatement);
		});
	}

}

class _SuperExpressionEmitter extends _OperatorExpressionEmitter {

	var _expr : SuperExpression;

	function constructor (emitter : JavaScriptEmitter, expr : SuperExpression) {
		super(emitter);
		this._expr = expr;
	}

	override function _emit () : void {
		var funcType = this._expr.getFunctionType() as ResolvedFunctionType;
		var className = funcType.getObjectType().getClassDef().getOutputClassName();
		var argTypes = funcType.getArgumentTypes();
		var mangledFuncName = this._emitter._mangleFunctionName(this._expr.getName().getValue(), argTypes);
		this._emitter._emitCallArguments(this._expr.getToken(), className + ".prototype." + mangledFuncName + ".call(this", this._expr.getArguments(), argTypes);
	}

	override function _getPrecedence () : number {
		return _CallExpressionEmitter._operatorPrecedence;
	}

	static var _operatorPrecedence = 0;

	static function _setOperatorPrecedence (op : string, precedence : number) : void {
		_SuperExpressionEmitter._operatorPrecedence = precedence;
	}

}

class _NewExpressionEmitter extends _OperatorExpressionEmitter {

	var _expr : NewExpression;

	function constructor (emitter : JavaScriptEmitter, expr : NewExpression) {
		super(emitter);
		this._expr = expr;
	}

	override function emit (outerOpPrecedence : number) : void {
		function getInliner(funcDef : MemberFunctionDefinition) : function(:NewExpression):Expression[] {
			var stash = funcDef.getOptimizerStash()["unclassify"];
			return (stash)? (stash as _UnclassifyOptimizationCommandStash).inliner : null : function(:NewExpression):Expression[];
		}
		var classDef = this._expr.getType().getClassDef();
		var ctor = this._expr.getConstructor();
		var argTypes = ctor.getArgumentTypes();
		var callingFuncDef = Util.findFunctionInClass(classDef, "constructor", argTypes, false);
		if (callingFuncDef == null) {
			throw new Error("logic flaw");
		}
		var inliner = getInliner(callingFuncDef);
		if (inliner) {
			this._emitAsObjectLiteral(classDef, inliner(this._expr));
		} else if (
			classDef instanceof InstantiatedClassDefinition
			&& (classDef as InstantiatedClassDefinition).getTemplateClassName() == "Array"
			&& argTypes.length == 0) {
			this._emitter._emit("[]", this._expr.getToken());
		} else if (
			classDef instanceof InstantiatedClassDefinition
			&& (classDef as InstantiatedClassDefinition).getTemplateClassName() == "Map") {
			this._emitter._emit("{}", this._expr.getToken());
		} else {
			this._emitter._emitCallArguments(
				this._expr.getToken(),
				"new " + this._emitter._mangleConstructorName(classDef, argTypes) + "(",
				this._expr.getArguments(),
				argTypes);
		}
	}

	function _emitCallArguments (token : Token, prefix : string, args : Expression[], argTypes : Type[]) : void {
		this._emitter._emit(prefix, token);
		for (var i = 0; i < args.length; ++i) {
			if (i != 0 || prefix.charAt(prefix.length - 1) != '(')
				this._emitter._emit(", ", null);
			if (argTypes != null
				&& ! (argTypes[i] instanceof NullableType || argTypes[i] instanceof VariantType)) {
				this._emitter._emitWithNullableGuard(args[i], 0);
			} else {
				this._emitter._getExpressionEmitterFor(args[i]).emit(0);
			}
		}
		this._emitter._emit(")", token);
	}

	function _emitAsObjectLiteral (classDef : ClassDefinition, propertyExprs : Expression[]) : void {
		this._emitter._emit("{", this._expr.getToken());
		var propertyIndex = 0;
		classDef.forEachMemberVariable(function (member) {
			if ((member.flags() & ClassDefinition.IS_STATIC) == 0) {
				if (propertyIndex != 0) {
					this._emitter._emit(", ", this._expr.getToken());
				}
				this._emitter._emit(member.name() + ": ", this._expr.getToken());
				this._emitter._getExpressionEmitterFor(propertyExprs[propertyIndex++]).emit(_AssignmentExpressionEmitter._operatorPrecedence["="]);
			}
			return true;
		});
		this._emitter._emit("}", this._expr.getToken());
	}

	override function _getPrecedence () : number {
		return _NewExpressionEmitter._operatorPrecedence;
	}

	static var _operatorPrecedence = 0;

	static function _setOperatorPrecedence (op : string, precedence : number) : void {
		_NewExpressionEmitter._operatorPrecedence = precedence;
	}

}

class _CommaExpressionEmitter extends _ExpressionEmitter {

	var _expr : CommaExpression;

	function constructor (emitter : JavaScriptEmitter, expr : CommaExpression) {
		super(emitter);
		this._expr = expr;
	}

	override function emit (outerOpPrecedence : number) : void {
		// comma operations should be surrounded by brackets unless within a comma expression, since "," might get considered as an argument separator (of function calls, etc.)
		var useBrackets = outerOpPrecedence != _CommaExpressionEmitter._operatorPrecedence;
		if (useBrackets)
			this._emitter._emit("(", null);
		this._emitter._getExpressionEmitterFor(this._expr.getFirstExpr()).emit(_CommaExpressionEmitter._operatorPrecedence);
		this._emitter._emit(", ", null);
		this._emitter._getExpressionEmitterFor(this._expr.getSecondExpr()).emit(_CommaExpressionEmitter._operatorPrecedence);
		if (useBrackets)
			this._emitter._emit(")", null);
	}

	static var _operatorPrecedence = 0;

	static function _setOperatorPrecedence (op : string, precedence : number) : void {
		_CommaExpressionEmitter._operatorPrecedence = precedence;
	}

}

// the global emitter

class JavaScriptEmitter implements Emitter {

	var _platform : Platform;
	var _output : string;
	var _outputEndsWithReturn : boolean;
	var _outputFile : Nullable.<string>;
	var _indent : number;
	var _emittingClass : ClassDefinition;
	var _emittingFunction : MemberFunctionDefinition;
	var _emittingStatementStack : _StatementEmitter[];
	var _enableRunTimeTypeCheck : boolean;

	var _enableSourceMap : boolean;
	var _enableProfiler : boolean;
	var _sourceMapGen : SourceMapGenerator;

	function constructor (platform : Platform) {
		JavaScriptEmitter.initialize();
		this._platform = platform;
		this._output = "";
		this._outputEndsWithReturn = this._output.match(/\n$/) != null;
		this._outputFile = null;
		this._indent = 0;
		this._emittingClass = null;
		this._emittingFunction = null;
		this._emittingStatementStack = new _StatementEmitter[];
		this._enableRunTimeTypeCheck = true;
	}

	override function getSearchPaths () : string[] {
		return [ this._platform.getRoot() + "/lib/js" ];
	}

	override function setOutputFile (name : Nullable.<string>) : void {
		this._outputFile = name;

		if(this._enableSourceMap && name != null) {
			// FIXME: set correct sourceRoot
			var sourceRoot = null : Nullable.<string>;
			this._sourceMapGen = new SourceMapGenerator(name, sourceRoot);
		}
	}

	override function saveSourceMappingFile (platform : Platform) : void {
		var gen = this._sourceMapGen;
		if(gen != null) {
			platform.save(gen.getSourceMappingFile(), gen.generate());
		}
	}

	function setSourceMapGenerator (gen : SourceMapGenerator) : void {
		this._sourceMapGen = gen;
	}

	override function setEnableRunTimeTypeCheck (enable : boolean) : void {
		this._enableRunTimeTypeCheck = enable;
	}

	override function setEnableSourceMap (enable : boolean) : void {
		this._enableSourceMap = enable;
	}

	override function setEnableProfiler (enable : boolean) : void {
		this._enableProfiler = enable;
	}

	override function addHeader (header : string) : void {
		this._output += header;
	}

	override function emit (classDefs : ClassDefinition[]) : void {
		var bootstrap = this._platform.load(this._platform.getRoot() + "/src/js/bootstrap.js");
		this._output += bootstrap;
		for (var i = 0; i < classDefs.length; ++i) {
			classDefs[i].forEachMemberFunction(function onFuncDef(funcDef : MemberFunctionDefinition) : boolean {
				funcDef.forEachClosure(onFuncDef);
				_Util.setupBooleanizeFlags(funcDef);
				return true;
			});
		}
		for (var i = 0; i < classDefs.length; ++i) {
			if ((classDefs[i].flags() & ClassDefinition.IS_NATIVE) == 0)
				this._emitClassDefinition(classDefs[i]);
		}
		for (var i = 0; i < classDefs.length; ++i)
			this._emitStaticInitializationCode(classDefs[i]);
		this._emitClassMap(classDefs);
	}

	function _emitClassDefinition (classDef : ClassDefinition) : void {
		this._emittingClass = classDef;
		try {

			// emit class object
			this._emitClassObject(classDef);

			// emit constructors
			var ctors = this._findFunctions(classDef, "constructor", false);
			for (var i = 0; i < ctors.length; ++i)
				this._emitConstructor(ctors[i]);

			// emit functions
			var members = classDef.members();
			for (var i = 0; i < members.length; ++i) {
				var member = members[i];
				if (member instanceof MemberFunctionDefinition) {
					if (! (member.name() == "constructor" && (member.flags() & ClassDefinition.IS_STATIC) == 0) && (member as MemberFunctionDefinition).getStatements() != null) {
						if (member instanceof TemplateFunctionDefinition) {
						} else {
							this._emitFunction(member as MemberFunctionDefinition);
						}
					}
				}
			}

		} finally {
			this._emittingClass = null;
		}

	}

	function _emitStaticInitializationCode (classDef : ClassDefinition) : void {
		if ((classDef.flags() & ClassDefinition.IS_NATIVE) != 0)
			return;
		// special handling for js.jsx
		if (classDef.getToken() != null && classDef.getToken().getFilename() == Util.resolvePath(this._platform.getRoot() + "/lib/js/js.jsx")) {
			this._emit("js.global = (function () { return this; })();\n\n", null);
			return;
		}
		// normal handling
		var members = classDef.members();
		// FIXME can we (should we?) automatically resolve dependencies? isn't it impossible?
		for (var i = 0; i < members.length; ++i) {
			var member = members[i];
			if ((member instanceof MemberVariableDefinition)
				&& (member.flags() & (ClassDefinition.IS_STATIC | ClassDefinition.IS_NATIVE)) == ClassDefinition.IS_STATIC)
				this._emitStaticMemberVariable(classDef.getOutputClassName(), member as MemberVariableDefinition);
		}
	}

	function _emitClassMap (classDefs : ClassDefinition[]) : void {
		classDefs = classDefs.concat(new ClassDefinition[]); // shallow clone
		// remove the classDefs wo. source token or native
		for (var i = 0; i < classDefs.length;) {
			if (classDefs[i].getToken() == null || (classDefs[i].flags() & ClassDefinition.IS_NATIVE) != 0)
				classDefs.splice(i, 1);
			else
				++i;
		}
		// start emitting
		this._emit("var $__jsx_classMap = {\n", null);
		this._advanceIndent();
		while (classDefs.length != 0) {
			// fetch the first classDef, and others that came from the same file
			var list = new string[][];
			var pushClass = (function (classDef : ClassDefinition) : void {
				var push = function (suffix : string) : void {
					list.push([ classDef.className() + suffix, classDef.getOutputClassName() + suffix ]);
				};
				var ctors = this._findFunctions(classDef, "constructor", false);
				push("");
				if (ctors.length == 0) {
					push(this._mangleFunctionArguments(new Type[]));
				} else {
					for (var i = 0; i < ctors.length; ++i)
						push(this._mangleFunctionArguments(ctors[i].getArgumentTypes()));
				}
			});
			var filename = classDefs[0].getToken().getFilename();
			pushClass(classDefs.shift());
			for (var i = 0; i < classDefs.length;) {
				if (classDefs[i].getToken().getFilename() == filename) {
					pushClass(classDefs[i]);
					classDefs.splice(i, 1);
				} else {
					++i;
				}
			}
			// emit the map
			var escapedFilename = JSON.stringify(this._encodeFilename(filename, "system:"));
			this._emit(escapedFilename  + ": ", null);
			this._emit("{\n", null);
			this._advanceIndent();
			for (var i = 0; i < list.length; ++i) {
				this._emit(list[i][0] + ": " + list[i][1], null);
				if (i != list.length - 1)
					this._emit(",", null);
				this._emit("\n", null);
			}
			this._reduceIndent();
			this._emit("}", null);
			if (classDefs.length != 0)
				this._emit(",", null);
			this._emit("\n", null);
		}
		this._reduceIndent();
		this._emit("};\n\n", null);
	}

	function _encodeFilename (filename : string, prefix : string) : string {
		var rootDir = this._platform.getRoot() + "/";
		if (filename.indexOf(rootDir) == 0)
			filename = prefix + filename.substring(rootDir.length);
		return filename;
	}

	override function getOutput (sourceFile : string, entryPoint : Nullable.<string>, executableFor : Nullable.<string>) : string {
		var output = this._output + "\n";
		if (this._enableProfiler) {
			output += this._platform.load(this._platform.getRoot() + "/src/js/profiler.js");
		}
		if (entryPoint != null) {
			output = this._platform.addLauncher(this, this._encodeFilename(sourceFile, "system:"), output, entryPoint, executableFor);
		}
		output += "})();\n";
		if (this._sourceMapGen) {
			output += this._sourceMapGen.magicToken();
		}
		return output;
	}

	function _emitClassObject (classDef : ClassDefinition) : void {
		this._emit(
			"/**\n" +
			" * class " + classDef.getOutputClassName() +
			(classDef.extendType() != null ? " extends " + classDef.extendType().getClassDef().getOutputClassName() : "") + "\n" +
			" * @constructor\n" +
			" */\n" +
			"function ", null);
		this._emit(classDef.getOutputClassName() + "() {\n" +
			"}\n" +
			"\n",
			classDef.getToken());
		if (classDef.extendType() != null)
			this._emit(classDef.getOutputClassName() + ".prototype = new " + classDef.extendType().getClassDef().getOutputClassName() + ";\n", null);
		var implementTypes = classDef.implementTypes();
		if (implementTypes.length != 0) {
			for (var i = 0; i < implementTypes.length; ++i)
				this._emit("$__jsx_merge_interface(" + classDef.getOutputClassName() + ", " + implementTypes[i].getClassDef().getOutputClassName() + ");\n", null);
			this._emit("\n", null);
		}
		if ((classDef.flags() & (ClassDefinition.IS_INTERFACE | ClassDefinition.IS_MIXIN)) != 0)
			this._emit(classDef.getOutputClassName() + ".prototype.$__jsx_implements_" + classDef.getOutputClassName() + " = true;\n\n", null);
	}

	function _emitConstructor (funcDef : MemberFunctionDefinition) : void {
		var funcName = this._mangleConstructorName(funcDef.getClassDef(), funcDef.getArgumentTypes());

		// emit prologue
		this._emit("/**\n", null);
		this._emit(" * @constructor\n", null);
		this._emitFunctionArgumentAnnotations(funcDef);
		this._emit(" */\n", null);
		this._emit("function ", null);
		this._emit(funcName + "(", funcDef.getClassDef().getToken());
		this._emitFunctionArguments(funcDef);
		this._emit(") {\n", null);
		this._advanceIndent();
		// emit body
		this._emitFunctionBody(funcDef);
		// emit epilogue
		this._reduceIndent();
		this._emit("};\n\n", null);
		this._emit(funcName + ".prototype = new " + funcDef.getClassDef().getOutputClassName() + ";\n\n", null);
	}

	function _emitFunction (funcDef : MemberFunctionDefinition) : void {
		var className = funcDef.getClassDef().getOutputClassName();
		var funcName = this._mangleFunctionName(funcDef.name(), funcDef.getArgumentTypes());
		// emit
		this._emit("/**\n", null);
		this._emitFunctionArgumentAnnotations(funcDef);
		this._emit(_Util.buildAnnotation(" * @return {%1}\n", funcDef.getReturnType()), null);
		this._emit(" */\n", null);
		this._emit(className + ".", null);
		if ((funcDef.flags() & ClassDefinition.IS_STATIC) == 0)
			this._emit("prototype.", null);
		this._emit(funcName + " = ", funcDef.getNameToken());
		this._emit("function (", funcDef.getToken());
		this._emitFunctionArguments(funcDef);
		this._emit(") {\n", null);
		this._advanceIndent();
		this._emitFunctionBody(funcDef);
		this._reduceIndent();
		this._emit("};\n\n", null);
		if ((funcDef.flags() & ClassDefinition.IS_STATIC) != 0)
			this._emit("var " + className + "$" + funcName + " = " + className + "." + funcName + ";\n\n", null);
	}

	function _emitFunctionArgumentAnnotations (funcDef : MemberFunctionDefinition) : void {
		var args = funcDef.getArguments();
		for (var i = 0; i < args.length; ++i)
			this._emit(_Util.buildAnnotation(" * @param {%1} " + args[i].getName().getValue() + "\n", args[i].getType()), null);
	}

	function _emitFunctionArguments (funcDef : MemberFunctionDefinition) : void {
		var args = funcDef.getArguments();
		for (var i = 0; i < args.length; ++i) {
			if (i != 0)
				this._emit(", ", null);
			var name = args[i].getName();
			this._emit(name.getValue(), name);
		}
	}

	function _emitFunctionBody (funcDef : MemberFunctionDefinition) : void {
		var prevEmittingFunction = this._emittingFunction;
		try {
			this._emittingFunction = funcDef;

			if (this._enableProfiler) {
				this._emit(
					"var $__jsx_profiler_ctx = $__jsx_profiler.enter("
					+ Util.encodeStringLiteral(
						(funcDef.getClassDef() != null ? funcDef.getClassDef().className() : "<<unnamed>>")
						+ ((funcDef.flags() & ClassDefinition.IS_STATIC) != 0 ? "." : "#")
						+ (funcDef.getNameToken() != null ? funcDef.name() : "line_" + funcDef.getToken().getLineNumber() as string)
						+ "("
						+ function () : string {
							var r = new string[];
							funcDef.getArgumentTypes().forEach(function (argType) {
								r.push(":" + argType.toString());
							});
							return r.join(", ");
						}()
						+ ")")
					+ ");\n",
					null);
			}

			// emit reference to this for closures
			// if funDef is NOT in another closure
			if (funcDef.getClosures().length != 0 && (funcDef.flags() & ClassDefinition.IS_STATIC) == 0)
				this._emit("var $this = this;\n", null);
			// emit helper variable for Math.abs
			if (_CallExpressionEmitter.mathAbsUsesTemporary(funcDef)) {
				this._emit("var $math_abs_t;\n", null);
			}
			// emit local variable declarations
			var locals = funcDef.getLocals();
			for (var i = 0; i < locals.length; ++i) {
				// FIXME unused variables should never be emitted by the compiler
				var type = locals[i].getType();
				if (type == null)
					continue;
				this._emit(_Util.buildAnnotation("/** @type {%1} */\n", type), null);
				var name = locals[i].getName();
				// do not pass the token for declaration
				this._emit("var " + name.getValue() + ";\n", null);
			}
			// emit code
			var statements = funcDef.getStatements();
			for (var i = 0; i < statements.length; ++i)
				this._emitStatement(statements[i]);

			if (this._enableProfiler) {
				if (statements.length == 0 || ! (statements[statements.length - 1] instanceof ReturnStatement)) {
					this._emit("$__jsx_profiler.exit();\n", null);
				}
			}

		} finally {
			this._emittingFunction = prevEmittingFunction;
		}
	}

	function _emitStaticMemberVariable (holder : string, variable : MemberVariableDefinition) : void {
		var initialValue = variable.getInitialValue();
		if (initialValue != null
			&& ! (initialValue instanceof NullExpression
				|| initialValue instanceof BooleanLiteralExpression
				|| initialValue instanceof IntegerLiteralExpression
				|| initialValue instanceof NumberLiteralExpression
				|| initialValue instanceof StringLiteralExpression
				|| initialValue instanceof RegExpLiteralExpression)) {
			// use deferred initialization
			this._emit("$__jsx_lazy_init(" + holder + ", \"" + variable.name() + "\", function () {\n", variable.getNameToken());
			this._advanceIndent();
			this._emit("return ", variable.getNameToken());
			this._emitRHSOfAssignment(initialValue, variable.getType());
			this._emit(";\n", variable.getNameToken());
			this._reduceIndent();
			this._emit("});\n", variable.getNameToken());
		} else {
			this._emit(holder + "." + variable.name() + " = ", variable.getNameToken());
			this._emitRHSOfAssignment(initialValue, variable.getType());
			this._emit(";\n", initialValue.getToken());
		}
	}

	function _emitDefaultValueOf (type : Type) : void {
		if (type.equals(Type.booleanType))
			this._emit("false", null);
		else if (type.equals(Type.integerType) || type.equals(Type.numberType))
			this._emit("0", null);
		else if (type.equals(Type.stringType))
			this._emit("\"\"", null);
		else if (type instanceof NullableType)
			this._emit("null", null);
		else
			this._emit("null", null);
	}

	function _emitStatements (statements : Statement[]) : void {
		this._advanceIndent();
		for (var i = 0; i < statements.length; ++i)
			this._emitStatement(statements[i]);
		this._reduceIndent();
	}

	function _emitStatement (statement : Statement) : void {
		var emitter = this._getStatementEmitterFor(statement);
		this._emittingStatementStack.push(emitter);
		try {
			emitter.emit();
		} finally {
			this._emittingStatementStack.pop();
		}
	}

	function _emit (str : string, token : Token) : void {
		if (str == "")
			return;
		if (this._outputEndsWithReturn && this._indent != 0) {
			this._output += this._getIndent();
			this._outputEndsWithReturn = false;
		}
		// optional source map
		if(this._sourceMapGen != null && token != null) {
			var lastNewLinePos = this._output.lastIndexOf("\n") + 1;
			var genColumn = (this._output.length - lastNewLinePos) - 1;
			var genPos = {
				line: this._output.match(/^/mg).length,
				column: genColumn
			};
			var origPos = {
				line: token.getLineNumber(),
				column: token.getColumnNumber()
			};
			var tokenValue = null : Nullable.<string>;
			if (token.isIdentifier())
				tokenValue = token.getValue();
			var filename = token.getFilename();
			if (filename != null) {
				filename = this._encodeFilename(filename, "");
			}
			this._sourceMapGen.add(genPos, origPos, filename, tokenValue);
		}
		str = str.replace(/\n(.)/g, (function (m : string) : string {
			return "\n" + this._getIndent() + m.substring(1);
		}));
		this._output += str;
		this._outputEndsWithReturn = str.charAt(str.length - 1) == "\n";
	}

	function _advanceIndent () : void {
		++this._indent;
	}

	function _reduceIndent () : void {
		if (--this._indent < 0)
			throw new Error("indent mistach");
	}

	function _getIndent () : string {
		var s = "";
		for (var i = 0; i < this._indent; ++i)
			s += "\t";
		return s;
	}

	function _getStatementEmitterFor (statement : Statement) : _StatementEmitter {
		if (statement instanceof ConstructorInvocationStatement)
			return new _ConstructorInvocationStatementEmitter(this, statement as ConstructorInvocationStatement);
		else if (statement instanceof ExpressionStatement)
			return new _ExpressionStatementEmitter(this, statement as ExpressionStatement);
		else if (statement instanceof ReturnStatement)
			return new _ReturnStatementEmitter(this, statement as ReturnStatement);
		else if (statement instanceof DeleteStatement)
			return new _DeleteStatementEmitter(this, statement as DeleteStatement);
		else if (statement instanceof BreakStatement)
			return new _BreakStatementEmitter(this, statement as BreakStatement);
		else if (statement instanceof ContinueStatement)
			return new _ContinueStatementEmitter(this, statement as ContinueStatement);
		else if (statement instanceof DoWhileStatement)
			return new _DoWhileStatementEmitter(this, statement as DoWhileStatement);
		else if (statement instanceof ForInStatement)
			return new _ForInStatementEmitter(this, statement as ForInStatement);
		else if (statement instanceof ForStatement)
			return new _ForStatementEmitter(this, statement as ForStatement);
		else if (statement instanceof IfStatement)
			return new _IfStatementEmitter(this, statement as IfStatement);
		else if (statement instanceof SwitchStatement)
			return new _SwitchStatementEmitter(this, statement as SwitchStatement);
		else if (statement instanceof CaseStatement)
			return new _CaseStatementEmitter(this, statement as CaseStatement);
		else if (statement instanceof DefaultStatement)
			return new _DefaultStatementEmitter(this, statement as DefaultStatement);
		else if (statement instanceof WhileStatement)
			return new _WhileStatementEmitter(this, statement as WhileStatement);
		else if (statement instanceof TryStatement)
			return new _TryStatementEmitter(this, statement as TryStatement);
		else if (statement instanceof CatchStatement)
			return new _CatchStatementEmitter(this, statement as CatchStatement);
		else if (statement instanceof ThrowStatement)
			return new _ThrowStatementEmitter(this, statement as ThrowStatement);
		else if (statement instanceof AssertStatement)
			return new _AssertStatementEmitter(this, statement as AssertStatement);
		else if (statement instanceof LogStatement)
			return new _LogStatementEmitter(this, statement as LogStatement);
		else if (statement instanceof DebuggerStatement)
			return new _DebuggerStatementEmitter(this, statement as DebuggerStatement);
		throw new Error("got unexpected type of statement: " + JSON.stringify(statement.serialize()));
	}

	function _getExpressionEmitterFor (expr : Expression) : _ExpressionEmitter {
		if (expr instanceof LocalExpression)
			return new _LocalExpressionEmitter(this, expr as LocalExpression);
		else if (expr instanceof ClassExpression)
			return new _ClassExpressionEmitter(this, expr as ClassExpression);
		else if (expr instanceof NullExpression)
			return new _NullExpressionEmitter(this, expr as NullExpression);
		else if (expr instanceof BooleanLiteralExpression)
			return new _BooleanLiteralExpressionEmitter(this, expr as BooleanLiteralExpression);
		else if (expr instanceof IntegerLiteralExpression)
			return new _IntegerLiteralExpressionEmitter(this, expr as IntegerLiteralExpression);
		else if (expr instanceof NumberLiteralExpression)
			return new _NumberLiteralExpressionEmitter(this, expr as NumberLiteralExpression);
		else if (expr instanceof StringLiteralExpression)
			return new _StringLiteralExpressionEmitter(this, expr as StringLiteralExpression);
		else if (expr instanceof RegExpLiteralExpression)
			return new _RegExpLiteralExpressionEmitter(this, expr as RegExpLiteralExpression);
		else if (expr instanceof ArrayLiteralExpression)
			return new _ArrayLiteralExpressionEmitter(this, expr as ArrayLiteralExpression);
		else if (expr instanceof MapLiteralExpression)
			return new _MapLiteralExpressionEmitter(this, expr as MapLiteralExpression);
		else if (expr instanceof ThisExpression)
			return new _ThisExpressionEmitter(this, expr as ThisExpression);
		else if (expr instanceof BitwiseNotExpression)
			return new _UnaryExpressionEmitter(this, expr as BitwiseNotExpression);
		else if (expr instanceof InstanceofExpression)
			return new _InstanceofExpressionEmitter(this, expr as InstanceofExpression);
		else if (expr instanceof AsExpression)
			return new _AsExpressionEmitter(this, expr as AsExpression);
		else if (expr instanceof AsNoConvertExpression)
			return new _AsNoConvertExpressionEmitter(this, expr as AsNoConvertExpression);
		else if (expr instanceof LogicalNotExpression)
			return new _UnaryExpressionEmitter(this, expr as LogicalNotExpression);
		else if (expr instanceof TypeofExpression)
			return new _UnaryExpressionEmitter(this, expr as TypeofExpression);
		else if (expr instanceof PostIncrementExpression)
			return new _PostfixExpressionEmitter(this, expr as PostIncrementExpression);
		else if (expr instanceof PreIncrementExpression)
			return new _UnaryExpressionEmitter(this, expr as PreIncrementExpression);
		else if (expr instanceof PropertyExpression)
			return new _PropertyExpressionEmitter(this, expr as PropertyExpression);
		else if (expr instanceof SignExpression)
			return new _UnaryExpressionEmitter(this, expr as SignExpression);
		else if (expr instanceof AdditiveExpression)
			return new _AdditiveExpressionEmitter(this, expr as AdditiveExpression);
		else if (expr instanceof ArrayExpression)
			return new _ArrayExpressionEmitter(this, expr as ArrayExpression);
		else if (expr instanceof AssignmentExpression)
			return new _AssignmentExpressionEmitter(this, expr as AssignmentExpression);
		else if (expr instanceof BinaryNumberExpression)
			return new _BinaryNumberExpressionEmitter(this, expr as BinaryNumberExpression);
		else if (expr instanceof EqualityExpression)
			return new _EqualityExpressionEmitter(this, expr as EqualityExpression);
		else if (expr instanceof InExpression)
			return new _InExpressionEmitter(this, expr as InExpression);
		else if (expr instanceof LogicalExpression)
			return new _LogicalExpressionEmitter(this, expr as LogicalExpression);
		else if (expr instanceof ShiftExpression)
			return new _ShiftExpressionEmitter(this, expr as ShiftExpression);
		else if (expr instanceof ConditionalExpression)
			return new _ConditionalExpressionEmitter(this, expr as ConditionalExpression);
		else if (expr instanceof CallExpression)
			return new _CallExpressionEmitter(this, expr as CallExpression);
		else if (expr instanceof SuperExpression)
			return new _SuperExpressionEmitter(this, expr as SuperExpression);
		else if (expr instanceof NewExpression)
			return new _NewExpressionEmitter(this, expr as NewExpression);
		else if (expr instanceof FunctionExpression)
			return new _FunctionExpressionEmitter(this, expr as FunctionExpression);
		else if (expr instanceof CommaExpression)
			return new _CommaExpressionEmitter(this, expr as CommaExpression);
		throw new Error("got unexpected type of expression: " + (expr != null ? JSON.stringify(expr.serialize()) : expr.toString()));
	}

	function _mangleConstructorName (classDef : ClassDefinition, argTypes : Type[]) : string {
		if ((classDef.flags() & ClassDefinition.IS_NATIVE) != 0) {
			if (classDef instanceof InstantiatedClassDefinition) {
				if ((classDef as InstantiatedClassDefinition).getTemplateClassName() == "Map") {
					return "Object";
				} else {
					return (classDef as InstantiatedClassDefinition).getTemplateClassName();
				}
			} else {
				return classDef.className();
			}
		}
		return classDef.getOutputClassName() + this._mangleFunctionArguments(argTypes);
	}

	function _mangleFunctionName (name : string, argTypes : Type[]) : string {
		// NOTE: how mangling of "toString" is omitted is very hacky, but it seems like the easiest way, taking the fact into consideration that it is the only function in Object
		if (name != "toString")
			name += this._mangleFunctionArguments(argTypes);
		return name;
	}

	function _mangleTypeName (type : Type) : string {
		if (type.equals(Type.voidType))
			return "V";
		else if (type.equals(Type.booleanType))
			return "B";
		else if (type.equals(Type.integerType))
			return "I";
		else if (type.equals(Type.numberType))
			return "N";
		else if (type.equals(Type.stringType))
			return "S";
		else if (type instanceof ObjectType) {
			var classDef = type.getClassDef();
			if (classDef instanceof InstantiatedClassDefinition) {
				var typeArgs = (classDef as InstantiatedClassDefinition).getTypeArguments();
				switch ((classDef as InstantiatedClassDefinition).getTemplateClassName()) {
				case "Array":
					return "A" + this._mangleTypeName(typeArgs[0]);
				case "Map":
					return "H" + this._mangleTypeName(typeArgs[0]);
				default:
					// fall through
				}
			}
			return "L" + type.getClassDef().getOutputClassName() + "$";
		} else if (type instanceof StaticFunctionType)
			return "F" + this._mangleFunctionArguments((type as StaticFunctionType).getArgumentTypes()) + this._mangleTypeName((type as StaticFunctionType).getReturnType()) + "$";
		else if (type instanceof MemberFunctionType)
			return "M" + this._mangleTypeName((type as MemberFunctionType).getObjectType()) + this._mangleFunctionArguments((type as MemberFunctionType).getArgumentTypes()) + this._mangleTypeName((type as MemberFunctionType).getReturnType()) + "$";
		else if (type instanceof NullableType)
			return "U" + this._mangleTypeName((type as NullableType).getBaseType());
		else if (type.equals(Type.variantType))
			return "X";
		else
			throw new Error("FIXME " + type.toString());
	}

	function _mangleFunctionArguments (argTypes : Type[]) : string {
		var s = "$";
		for (var i = 0; i < argTypes.length; ++i)
			s += this._mangleTypeName(argTypes[i]);
		return s;
	}

	function _mangleTypeString (s : String) : string {
		return s.length as string + s;
	}

	function _findFunctions (classDef : ClassDefinition, name : string, isStatic : boolean) : MemberFunctionDefinition[] {
		var functions = new MemberFunctionDefinition[];
		var members = classDef.members();
		for (var i = 0; i < members.length; ++i) {
			var member = members[i];
			if ((member instanceof MemberFunctionDefinition) && member.name() == name
				&& (member.flags() & ClassDefinition.IS_STATIC) == (isStatic ? ClassDefinition.IS_STATIC : 0))
				functions.push(member as MemberFunctionDefinition);
		}
		return functions;
	}

	function _emitCallArguments (token : Token, prefix : string, args : Expression[], argTypes : Type[]) : void {
		this._emit(prefix, token);
		for (var i = 0; i < args.length; ++i) {
			if (i != 0 || prefix.charAt(prefix.length - 1) != '(')
				this._emit(", ", null);
			if (argTypes != null
				&& ! (argTypes[i] instanceof NullableType || argTypes[i] instanceof VariantType)) {
				this._emitWithNullableGuard(args[i], 0);
			} else {
				this._getExpressionEmitterFor(args[i]).emit(0);
			}
		}
		this._emit(")", token);
	}

	function _emitAssertion (emitTestExpr : function():void, token : Token, message : string) : void {
		this._emit("if (! (", token);
		emitTestExpr();
		this._emit(")) {\n", null);
		this._advanceIndent();
		this._emit("debugger;\n", null);
		// FIXME make the expression source and throw a fit exception class
		var err = Util.format('throw new Error("[%1:%2] %3");\n', [token.getFilename(), token.getLineNumber() as string, message]);
		this._emit(err, null);
		this._reduceIndent();
		this._emit("}\n", null);
	}

	function _emitWithNullableGuard (expr : Expression, outerOpPrecedence : number) : void {
		if (this._enableRunTimeTypeCheck && expr.getType() instanceof NullableType) {
			var token = expr.getToken();
			this._emit("(function (v) {\n", token);
			this._advanceIndent();
			this._emitAssertion(function () {
				this._emit("v != null", token);
			}, token, "null access");
			this._emit("return v;\n", token);
			this._reduceIndent();
			this._emit("}(", token);
			this._getExpressionEmitterFor(expr).emit(0);
			this._emit("))", token);
		} else {
			this._getExpressionEmitterFor(expr).emit(outerOpPrecedence);
		}
	}

	function _emitRHSOfAssignment (expr : Expression, lhsType : Type) : void {
		var exprType = expr.getType();
		// FIXME what happens if the op is /= or %= ?
		if (lhsType.resolveIfNullable().equals(Type.integerType) && exprType.equals(Type.numberType)) {
			if (expr instanceof NumberLiteralExpression
				|| expr instanceof IntegerLiteralExpression) {
				this._emit((expr.getToken().getValue() as int).toString(), expr.getToken());
			} else {
				this._emit("(", expr.getToken());
				this._getExpressionEmitterFor(expr).emit(_BinaryNumberExpressionEmitter._operatorPrecedence["|"]);
				this._emit(" | 0)", expr.getToken());
			}
			return;
		}
		if (lhsType.equals(Type.integerType) && exprType.resolveIfNullable().equals(Type.numberType)) {
			this._emit("(", expr.getToken());
			this._emitWithNullableGuard(expr, _BinaryNumberExpressionEmitter._operatorPrecedence["|"]);
			this._emit(" | 0)", expr.getToken());
			return;
		}
		if ((lhsType instanceof NullableType && (lhsType as NullableType).getBaseType().equals(Type.integerType))
			&& (exprType instanceof NullableType && (exprType as NullableType).getBaseType().equals(Type.numberType))) {
			// NOTE this is very slow, but such an operation would practically not be found
			this._emit("(function (v) { return v != null ? v | 0 : v; })(", expr.getToken());
			this._getExpressionEmitterFor(expr).emit(0);
			this._emit(")", expr.getToken());
			return;
		}
		// normal mode
		if (lhsType.equals(Type.variantType) || lhsType instanceof NullableType) {
			this._getExpressionEmitterFor(expr).emit(_AssignmentExpressionEmitter._operatorPrecedence["="]);
		} else {
			this._emitWithNullableGuard(expr, _AssignmentExpressionEmitter._operatorPrecedence["="]);
		}
	}

	static function initialize () : void {
		var precedence = [
			[
				{ "new":        function (op : string, precedence : number) : void { _NewExpressionEmitter._setOperatorPrecedence(op, precedence); } },
				{ "[":          function (op : string, precedence : number) : void { _ArrayExpressionEmitter._setOperatorPrecedence(op, precedence); } },
				{ ".":          function (op : string, precedence : number) : void { _PropertyExpressionEmitter._setOperatorPrecedence(op, precedence); } },
				{ "(":          function (op : string, precedence : number) : void { _CallExpressionEmitter._setOperatorPrecedence(op, precedence); } },
				{ "super":      function (op : string, precedence : number) : void { _SuperExpressionEmitter._setOperatorPrecedence(op, precedence); } },
				{ "function":   function (op : string, precedence : number) : void { _FunctionExpressionEmitter._setOperatorPrecedence(op, precedence); } }
			], [
				{ "++":         function (op : string, precedence : number) : void { _PostfixExpressionEmitter._setOperatorPrecedence(op, precedence); } },
				{ "--":         function (op : string, precedence : number) : void { _PostfixExpressionEmitter._setOperatorPrecedence(op, precedence); } }
			], [
				// delete is not used by JSX
				{ "void":       function (op : string, precedence : number) : void { _UnaryExpressionEmitter._setOperatorPrecedence(op, precedence); } },
				{ "typeof":     function (op : string, precedence : number) : void { _UnaryExpressionEmitter._setOperatorPrecedence(op, precedence); } },
				{ "++":         function (op : string, precedence : number) : void { _UnaryExpressionEmitter._setOperatorPrecedence(op, precedence); } },
				{ "--":         function (op : string, precedence : number) : void { _UnaryExpressionEmitter._setOperatorPrecedence(op, precedence); } },
				{ "+":          function (op : string, precedence : number) : void { _UnaryExpressionEmitter._setOperatorPrecedence(op, precedence); } },
				{ "-":          function (op : string, precedence : number) : void { _UnaryExpressionEmitter._setOperatorPrecedence(op, precedence); } },
				{ "~":          function (op : string, precedence : number) : void { _UnaryExpressionEmitter._setOperatorPrecedence(op, precedence); } },
				{ "!":          function (op : string, precedence : number) : void { _UnaryExpressionEmitter._setOperatorPrecedence(op, precedence); } }
			], [
				{ "*":          function (op : string, precedence : number) : void { _BinaryNumberExpressionEmitter._setOperatorPrecedence(op, precedence); } },
				{ "/":          function (op : string, precedence : number) : void { _BinaryNumberExpressionEmitter._setOperatorPrecedence(op, precedence); } },
				{ "%":          function (op : string, precedence : number) : void { _BinaryNumberExpressionEmitter._setOperatorPrecedence(op, precedence); } }
			], [
				{ "+":          function (op : string, precedence : number) : void { _AdditiveExpressionEmitter._setOperatorPrecedence(op, precedence); } },
				{ "-":          function (op : string, precedence : number) : void { _BinaryNumberExpressionEmitter._setOperatorPrecedence(op, precedence); } }
			], [
				{ "<<":         function (op : string, precedence : number) : void { _ShiftExpressionEmitter._setOperatorPrecedence(op, precedence); } },
				{ ">>":         function (op : string, precedence : number) : void { _ShiftExpressionEmitter._setOperatorPrecedence(op, precedence); } },
				{ ">>>":        function (op : string, precedence : number) : void { _ShiftExpressionEmitter._setOperatorPrecedence(op, precedence); } }
			], [
				{ "<":          function (op : string, precedence : number) : void { _BinaryNumberExpressionEmitter._setOperatorPrecedence(op, precedence); } },
				{ ">":          function (op : string, precedence : number) : void { _BinaryNumberExpressionEmitter._setOperatorPrecedence(op, precedence); } },
				{ "<=":         function (op : string, precedence : number) : void { _BinaryNumberExpressionEmitter._setOperatorPrecedence(op, precedence); } },
				{ ">=":         function (op : string, precedence : number) : void { _BinaryNumberExpressionEmitter._setOperatorPrecedence(op, precedence); } },
				{ "instanceof": function (op : string, precedence : number) : void { _InstanceofExpressionEmitter._setOperatorPrecedence(op, precedence); } },
				{ "in":         function (op : string, precedence : number) : void { _InExpressionEmitter._setOperatorPrecedence(op, precedence); } }
			], [
				{ "==":         function (op : string, precedence : number) : void { _EqualityExpressionEmitter._setOperatorPrecedence(op, precedence); } },
				{ "!=":         function (op : string, precedence : number) : void { _EqualityExpressionEmitter._setOperatorPrecedence(op, precedence); } }
			], [
				{ "&":          function (op : string, precedence : number) : void { _BinaryNumberExpressionEmitter._setOperatorPrecedence(op, precedence); } }
			], [
				{ "^":          function (op : string, precedence : number) : void { _BinaryNumberExpressionEmitter._setOperatorPrecedence(op, precedence); } }
			], [
				{ "|":          function (op : string, precedence : number) : void { _BinaryNumberExpressionEmitter._setOperatorPrecedence(op, precedence); } }
			], [
				{ "&&":         function (op : string, precedence : number) : void { _LogicalExpressionEmitter._setOperatorPrecedence(op, precedence); } }
			], [
				{ "||":         function (op : string, precedence : number) : void { _LogicalExpressionEmitter._setOperatorPrecedence(op, precedence); } }
			], [
				{ "=":          function (op : string, precedence : number) : void { _AssignmentExpressionEmitter._setOperatorPrecedence(op, precedence); } },
				{ "*=":         function (op : string, precedence : number) : void { _AssignmentExpressionEmitter._setOperatorPrecedence(op, precedence); } },
				{ "/=":         function (op : string, precedence : number) : void { _AssignmentExpressionEmitter._setOperatorPrecedence(op, precedence); } },
				{ "%=":         function (op : string, precedence : number) : void { _AssignmentExpressionEmitter._setOperatorPrecedence(op, precedence); } },
				{ "+=":         function (op : string, precedence : number) : void { _AssignmentExpressionEmitter._setOperatorPrecedence(op, precedence); } },
				{ "-=":         function (op : string, precedence : number) : void { _AssignmentExpressionEmitter._setOperatorPrecedence(op, precedence); } },
				{ "<<=":        function (op : string, precedence : number) : void { _AssignmentExpressionEmitter._setOperatorPrecedence(op, precedence); } },
				{ ">>=":        function (op : string, precedence : number) : void { _AssignmentExpressionEmitter._setOperatorPrecedence(op, precedence); } },
				{ ">>>=":       function (op : string, precedence : number) : void { _AssignmentExpressionEmitter._setOperatorPrecedence(op, precedence); } },
				{ "&=":         function (op : string, precedence : number) : void { _AssignmentExpressionEmitter._setOperatorPrecedence(op, precedence); } },
				{ "^=":         function (op : string, precedence : number) : void { _AssignmentExpressionEmitter._setOperatorPrecedence(op, precedence); } },
				{ "|=":         function (op : string, precedence : number) : void { _AssignmentExpressionEmitter._setOperatorPrecedence(op, precedence); } }
			], [
				{ "?":          function (op : string, precedence : number) : void { _ConditionalExpressionEmitter._setOperatorPrecedence(op, precedence); } }
			], [
				{ ",":          function (op : string, precedence : number) : void { _CommaExpressionEmitter._setOperatorPrecedence(op, precedence); } }
			]
		];
		for (var i = 0; i < precedence.length; ++i) {
			var opTypeList = precedence[i];
			for (var j = 0; j < opTypeList.length; ++j)
				for (var key in opTypeList[j])
					opTypeList[j][key](key, -(precedence.length - i));
		}
	}

}
// vim: set noexpandtab:
