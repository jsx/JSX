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
import "./type.jsx";
import "./util.jsx";
import "./emitter.jsx";

abstract class _StatementTransformer {

	static var _statementCountMap = new Map.<number>;

	var _transformer : _CPSTransformer;
	var _id : number;

	function constructor (transformer : _CPSTransformer, identifier : string) {
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
		this._replaceControlStructuresWithGotos();
	}

	abstract function _replaceControlStructuresWithGotos () : void;

}

class _ConstructorInvocationStatementTransformer extends _StatementTransformer {

	var _statement : ConstructorInvocationStatement;

	function constructor (transformer : _CPSTransformer, statement : ConstructorInvocationStatement) {
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

	function constructor (transformer : _CPSTransformer, statement : ExpressionStatement) {
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

	function constructor (transformer : _CPSTransformer, statement : FunctionStatement) {
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

	function constructor (transformer : _CPSTransformer, statement : ReturnStatement) {
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

	function constructor (transformer : _CPSTransformer, statement : YieldStatement) {
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

	function constructor (transformer : _CPSTransformer, statement : DeleteStatement) {
		super(transformer, "DELETE");
		this._statement = statement;
	}

	override function getStatement () : Statement {
		return this._statement;
	}

	override function _replaceControlStructuresWithGotos () : void {
		this._transformer._emit(this._statement);
	}

}

class _BreakStatementTransformer extends _StatementTransformer {

	var _statement : BreakStatement;

	function constructor (transformer : _CPSTransformer, statement : BreakStatement) {
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

	function constructor (transformer : _CPSTransformer, statement : ContinueStatement) {
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

	function constructor (transformer : _CPSTransformer, identifier : string) {
		super(transformer, identifier);
	}

	abstract function getBreakingLabel () : string;
	abstract function getContinuingLabel () : string;

}

class _DoWhileStatementTransformer extends _LabellableStatementTransformer {

	var _statement : DoWhileStatement;

	function constructor (transformer : _CPSTransformer, statement : DoWhileStatement) {
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

	function constructor (transformer : _CPSTransformer, statement : ForInStatement) {
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

	function constructor (transformer : _CPSTransformer, statement : ForStatement) {
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

	function constructor (transformer : _CPSTransformer, statement : IfStatement) {
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

	function constructor (transformer : _CPSTransformer, statement : SwitchStatement) {
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
				switchCases.push(new ReturnStatement(new Token("return", false), null));
			} else if (stmt instanceof DefaultStatement) {
				switchCases.push(stmt);
				switchCases.push(new GotoStatement(this._getLabelFromDefaultStatement()));
				switchCases.push(new ReturnStatement(new Token("return", false), null));
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

	function constructor (transformer : _CPSTransformer, statement : CaseStatement) {
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

	function constructor (transformer : _CPSTransformer, statement : DefaultStatement) {
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

	function constructor (transformer : _CPSTransformer, statement : WhileStatement) {
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

	function constructor (transformer : _CPSTransformer, statement : TryStatement) {
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

	function constructor (transformer : _CPSTransformer, statement : CatchStatement) {
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

	function constructor (transformer : _CPSTransformer, statement : ThrowStatement) {
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

	function constructor (transformer : _CPSTransformer, statement : AssertStatement) {
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

	function constructor (transformer : _CPSTransformer, statement : LogStatement) {
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

	function constructor (transformer : _CPSTransformer, statement : DebuggerStatement) {
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

class _CPSTransformer {

	static const ID = "cps";

	var _transformer : CodeTransformer;

	function constructor (transformer : CodeTransformer) {
		this._transformer = transformer;
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

	function _doCPSTransform (funcDef : MemberFunctionDefinition) : void {
		this._doCPSTransform(funcDef, function (name, statements) {
			// do nothing
		});
	}

	function _doCPSTransform (funcDef : MemberFunctionDefinition, bbCallback : (string, Statement[]) -> void) : void {
		this._transformingFuncDef = funcDef;

		var returnLocal : LocalVariable = null;
		if (! Type.voidType.equals(funcDef.getReturnType())) {
			var returnLocalName = "$return" + CodeTransformer._getFunctionNestDepth(funcDef);
			returnLocal = new LocalVariable(new Token(returnLocalName, false), funcDef.getReturnType());
			funcDef.getLocals().push(returnLocal);
			this._enterFunction(returnLocal);
		}

		// replace control structures with goto statements
		var statements = new Statement[];
		this._setOutputStatements(statements);
		for (var i = 0; i < funcDef.getStatements().length; ++i) {
			this._getStatementTransformerFor(funcDef.getStatements()[i]).replaceControlStructuresWithGotos();
		}
		// insert prologue code
		statements.unshift(
			new LabelStatement("$L_enter")
		);
		// insert epilogue code
		statements.push(
			new GotoStatement("$L_exit"),
			new LabelStatement("$L_exit"),
			new ReturnStatement(new Token("return", false), null));
		funcDef._statements = statements;

		// replace goto statements with calls of closures
		this._eliminateGotos(funcDef, bbCallback);

		if (! Type.voidType.equals(funcDef.getReturnType())) {
			funcDef._statements.push(new ReturnStatement(new Token("return", false), new LocalExpression(returnLocal.getName(), returnLocal)));
			this._leaveFunction();
		}
	}

	function _eliminateGotos (funcDef : MemberFunctionDefinition, bbCallback : (string, Statement[]) -> void) : void {
		var statements = funcDef.getStatements();

		var loopVar = new LocalVariable(new Token("$loop", true), new StaticFunctionType(null, Type.voidType, [ Type.integerType ] : Type[], true));
		funcDef.getLocals().push(loopVar);

		// create executor
		var nextVar = new ArgumentDeclaration(new Token("$next", true), Type.integerType);
		var executor = this._transformer._createNamedFunction(funcDef, null, new Token("$loop", true), [ nextVar ], Type.voidType);
		executor.setFuncLocal(loopVar);

		// number labels
		var labelIndeces = new Map.<int>;
		for (var i = 0, c = 0; i < statements.length; ++i) {
			if (statements[i] instanceof LabelStatement) {
				var name =(statements[i] as LabelStatement).getName();
				labelIndeces[name] = c++;
			}
		}

		function makeJump (gotoStmt : GotoStatement) : Statement {
			var name = gotoStmt.getLabel();
			var index;
			if ((index = labelIndeces[name]) == null) {
				throw new Error("logic flaw! label not found");
			}
			return new ExpressionStatement(
				new AssignmentExpression(
					new Token("=", false),
					new LocalExpression(new Token("$next", true), nextVar),
					new IntegerLiteralExpression(new Token("" + index, false))));
		}

		function makeBreak () : Statement {
			return new BreakStatement(new Token("break", false), null);
		}

		function replaceGoto (statements : Statement[], index : int) : int {
			assert statements[index] instanceof GotoStatement;
			var gotoStmt = statements[index] as GotoStatement;
			statements.splice(index, 1, makeJump(gotoStmt), makeBreak());
			return index + 1;
		}

		// replace gotos with function call (and return statement)
		for (var i = 0; i < statements.length; ++i) {
			var stmt = statements[i];

			if (stmt instanceof GotoStatement) {
				i = replaceGoto(statements, i);
			} else if (stmt instanceof IfStatement) {
				var ifStmt = stmt as IfStatement;
				replaceGoto(ifStmt.getOnTrueStatements(), 0);
				replaceGoto(ifStmt.getOnFalseStatements(), 0);
			} else if (stmt instanceof SwitchStatement) {
				var switchStmt = stmt as SwitchStatement;
				for (var j = 0; j < switchStmt.getStatements().length; ++j) {
					if (switchStmt.getStatements()[j] instanceof GotoStatement) {
						j = replaceGoto(switchStmt.getStatements(), j);
					}
				}
				statements.splice(i + 1, 0, makeBreak());
				i = i + 1;
			}
		}

		function makeBasicBlock (label : string, body : Statement[]) : Statement[] {
			var statements = body.concat([]);
			statements.unshift(
				new CaseStatement(
					new Token("case", false),
					new IntegerLiteralExpression(new Token("" + labelIndeces[label], false))));
			return statements;
		}

		// basic blocks
		var basicBlocks = new Statement[];
		for (var i = 0; i < statements.length;) {
			var currentLabel = statements[i] as LabelStatement;
			++i;

			// read the block
			var body = new Statement[];
			for (; i < statements.length; ++i) {
				if (statements[i] instanceof LabelStatement) {
					break;
				}
				body.push(statements[i]);
			}
			bbCallback(currentLabel.getName(), body);

			// create a basic block
			basicBlocks = basicBlocks.concat(makeBasicBlock(currentLabel.getName(), body));
		}

		// create while-switch loop
		var switchStmt = new SwitchStatement(
			new Token("switch", false),
			null,
			new LocalExpression(new Token("$next", true), nextVar),
			basicBlocks);
		var whileStmt = new WhileStatement(
			new Token("while", false),
			null,
			new BooleanLiteralExpression(new Token("true", false)),
			[ switchStmt ] : Statement[]);

		// set the vm to executor
		executor._statements = [ whileStmt ] : Statement[];

		// amend funcDef._statements
		funcDef.getStatements().length = 0;
		funcDef.getStatements().push(new FunctionStatement(
			new Token("function", false), executor));
		funcDef.getStatements().push(new ExpressionStatement(
			new CallExpression(
				new Token("(", false),
				new LocalExpression(new Token("$loop", true), loopVar),
				[ new IntegerLiteralExpression(new Token("0", false)) ] : Expression[])));
	}

	var _transformingFuncDef : MemberFunctionDefinition = null;

	function getTransformingFuncDef () : MemberFunctionDefinition {
		return this._transformingFuncDef;
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

	// function _getExpressionTransformerFor (expr : Expression) : _ExpressionTransformer {
	// 	if (expr instanceof LocalExpression)
	// 		return new _LeafExpressionTransformer(this, expr as LocalExpression);
	// 	else if (expr instanceof ClassExpression)
	// 		throw new Error("logic flaw");
	// 	else if (expr instanceof NullExpression)
	// 		return new _LeafExpressionTransformer(this, expr as NullExpression);
	// 	else if (expr instanceof BooleanLiteralExpression)
	// 		return new _LeafExpressionTransformer(this, expr as BooleanLiteralExpression);
	// 	else if (expr instanceof IntegerLiteralExpression)
	// 		return new _LeafExpressionTransformer(this, expr as IntegerLiteralExpression);
	// 	else if (expr instanceof NumberLiteralExpression)
	// 		return new _LeafExpressionTransformer(this, expr as NumberLiteralExpression);
	// 	else if (expr instanceof StringLiteralExpression)
	// 		return new _LeafExpressionTransformer(this, expr as StringLiteralExpression);
	// 	else if (expr instanceof RegExpLiteralExpression)
	// 		return new _LeafExpressionTransformer(this, expr as RegExpLiteralExpression);
	// 	else if (expr instanceof ArrayLiteralExpression)
	// 		return new _ArrayLiteralExpressionTransformer(this, expr as ArrayLiteralExpression);
	// 	else if (expr instanceof MapLiteralExpression)
	// 		return new _MapLiteralExpressionTransformer(this, expr as MapLiteralExpression);
	// 	else if (expr instanceof ThisExpression)
	// 		return new _LeafExpressionTransformer(this, expr as ThisExpression);
	// 	else if (expr instanceof BitwiseNotExpression)
	// 		return new _BitwiseNotExpressionTransformer(this, expr as BitwiseNotExpression);
	// 	else if (expr instanceof InstanceofExpression)
	// 		return new _InstanceofExpressionTransformer(this, expr as InstanceofExpression);
	// 	else if (expr instanceof AsExpression)
	// 		return new _AsExpressionTransformer(this, expr as AsExpression);
	// 	else if (expr instanceof AsNoConvertExpression)
	// 		return new _AsNoConvertExpressionTransformer(this, expr as AsNoConvertExpression);
	// 	else if (expr instanceof LogicalNotExpression)
	// 		return new _LogicalNotExpressionTransformer(this, expr as LogicalNotExpression);
	// 	else if (expr instanceof TypeofExpression)
	// 		return new _TypeofExpressionTransformer(this, expr as TypeofExpression);
	// 	else if (expr instanceof PostIncrementExpression)
	// 		return new _PostIncrementExpressionTransformer(this, expr as PostIncrementExpression);
	// 	else if (expr instanceof PreIncrementExpression)
	// 		return new _PreIncrementExpressionTransformer(this, expr as PreIncrementExpression);
	// 	else if (expr instanceof PropertyExpression)
	// 		return new _PropertyExpressionTransformer(this, expr as PropertyExpression);
	// 	else if (expr instanceof SignExpression)
	// 		return new _SignExpressionTransformer(this, expr as SignExpression);
	// 	else if (expr instanceof AdditiveExpression)
	// 		return new _AdditiveExpressionTransformer(this, expr as AdditiveExpression);
	// 	else if (expr instanceof ArrayExpression)
	// 		return new _ArrayExpressionTransformer(this, expr as ArrayExpression);
	// 	else if (expr instanceof AssignmentExpression)
	// 		return new _AssignmentExpressionTransformer(this, expr as AssignmentExpression);
	// 	else if (expr instanceof BinaryNumberExpression)
	// 		return new _BinaryNumberExpressionTransformer(this, expr as BinaryNumberExpression);
	// 	else if (expr instanceof EqualityExpression)
	// 		return new _EqualityExpressionTransformer(this, expr as EqualityExpression);
	// 	else if (expr instanceof InExpression)
	// 		return new _InExpressionTransformer(this, expr as InExpression);
	// 	else if (expr instanceof LogicalExpression)
	// 		return new _LogicalExpressionTransformer(this, expr as LogicalExpression);
	// 	else if (expr instanceof ShiftExpression)
	// 		return new _ShiftExpressionTransformer(this, expr as ShiftExpression);
	// 	else if (expr instanceof ConditionalExpression)
	// 		return new _ConditionalExpressionTransformer(this, expr as ConditionalExpression);
	// 	else if (expr instanceof CallExpression)
	// 		return new _CallExpressionTransformer(this, expr as CallExpression);
	// 	else if (expr instanceof SuperExpression)
	// 		return new _SuperExpressionTransformer(this, expr as SuperExpression);
	// 	else if (expr instanceof NewExpression)
	// 		return new _NewExpressionTransformer(this, expr as NewExpression);
	// 	else if (expr instanceof FunctionExpression)
	// 		return new _FunctionExpressionTransformer(this, expr as FunctionExpression);
	// 	else if (expr instanceof CommaExpression)
	// 		return new _CommaExpressionTransformer(this, expr as CommaExpression);
	// 	throw new Error("got unexpected type of expression: " + (expr != null ? JSON.stringify(expr.serialize()) : expr.toString()));
	// }

}

class _GeneratorTransformer {

	static const ID = "generator";

	var _transformer : CodeTransformer;
	var _cpsTransformer : _CPSTransformer;

	var _jsxGeneratorObject : TemplateClassDefinition;

	function constructor (transformer : CodeTransformer, cpsTransformer : _CPSTransformer) {
		this._transformer = transformer;
		this._cpsTransformer = cpsTransformer;

		var builtins = transformer.getCompiler().getBuiltinParsers()[0];
		for (var i = 0; i < builtins._templateClassDefs.length; ++i) {
			if (builtins._templateClassDefs[i].className() == "__jsx_generator_object") {
				this._jsxGeneratorObject = builtins._templateClassDefs[i];
				break;
			}
		}
		if (this._jsxGeneratorObject == null) {
			throw new Error("logic flaw! internal built-in class '__jsx_generator_object' not found");
		}
	}

	function _transformGenerator (funcDef : MemberFunctionDefinition) : void {
		this._transformGeneratorCore(funcDef);

		// drop IS_GENERATOR flag
		funcDef.setFlags(funcDef.flags() & ~ClassDefinition.IS_GENERATOR);
	}

	function _transformGeneratorCore(funcDef : MemberFunctionDefinition) : void {
		var yieldingType = (funcDef.getReturnType().getClassDef() as InstantiatedClassDefinition).getTypeArguments()[0];

		// create a generator object
		var genType = this._instantiateGeneratorType(yieldingType);
		var genLocalName = "$generator" + CodeTransformer._getGeneratorNestDepth(funcDef);
		var genLocal = new LocalVariable(new Token(genLocalName, false), genType);
		funcDef.getLocals().push(genLocal);

		this._cpsTransformer._doCPSTransform(funcDef, function (label : string, statements : Statement[]) : void {
			// replace yield statement
			/*
			  yield expr;
			  $next = LABEL;
			  break;

                          -> $generatorN.__value = expr;
			     $generatorN.__next = $LABEL;
			     return;
			*/
			if (3 <= statements.length && statements[statements.length - 3] instanceof YieldStatement) {
				var idx = statements.length - 3;
				statements.splice(idx, 3,
					new ExpressionStatement(
						new AssignmentExpression(
							new Token("=", false),
							new PropertyExpression(
								new Token(".", false),
								new LocalExpression(new Token(genLocalName, false), genLocal),
								new Token("__value", false),
								[],
								yieldingType.toNullableType()),
							(statements[idx] as YieldStatement).getExpr())),
					new ExpressionStatement(
						new AssignmentExpression(
							new Token("=", false),
							new PropertyExpression(
								new Token(".", false),
								new LocalExpression(new Token(genLocalName, false), genLocal),
								new Token("__next", true),
								[],
								Type.integerType.toNullableType()),
							(statements[idx + 1] as ExpressionStatement).getExpr())),
					new ReturnStatement(new Token("return", false), null));
			}
			// insert epilogue code
			/*
			  return;

			  -> $generatorN.__value = $returnM;
			     $generatorN.__next = -1;
			     return;
			*/
			else if (statements.length == 1 && statements[statements.length - 1] instanceof ReturnStatement) {
				statements.splice(statements.length - 1, 0,
					new ExpressionStatement(
						new AssignmentExpression(
							new Token("=", false),
							new PropertyExpression(
								new Token(".", false),
								new LocalExpression(new Token(genLocalName, false), genLocal),
								new Token("__value", false),
								[],
								yieldingType),
							new LocalExpression(
								this._cpsTransformer._getTopReturnLocal().getName(),
								this._cpsTransformer._getTopReturnLocal()))),
					new ExpressionStatement(
						new AssignmentExpression(
							new Token("=", false),
							new PropertyExpression(
								new Token(".", false),
								new LocalExpression(new Token(genLocalName, false), genLocal),
								new Token("__next", true),
								[],
								Type.integerType.toNullableType()),
							new IntegerLiteralExpression(new Token("-1", false)))));
			}
		});

		// declare generator object
		/*
		  var $generatorN = new __jsx_generator_object;
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
		  $loop(0);
		  return $returnN;

		  -> $generatorN.__next = 0;
		     $generatorN.__loop = $loop;
		 */
		var statements = funcDef.getStatements();
		statements.splice(statements.length - 2, 2,
			new ExpressionStatement(
				new AssignmentExpression(
					new Token("=", false),
					new PropertyExpression(
						new Token(".", false),
						new LocalExpression(new Token(genLocalName, false), genLocal),
						new Token("__next", true),
						[],
						Type.integerType.toNullableType()),
					new IntegerLiteralExpression(new Token("0", false)))),
			new ExpressionStatement(
				new AssignmentExpression(
					new Token("=", false),
					new PropertyExpression(
						new Token(".", false),
						new LocalExpression(new Token(genLocalName, false), genLocal),
						new Token("__loop", true),
						[],
						new StaticFunctionType(null, Type.voidType, [ Type.integerType ] : Type[], true)),
					new LocalExpression(new Token("$loop", true), funcDef.getLocals()[funcDef.getLocals().length - 1]))));

		// return the generator
		statements.push(
			new ReturnStatement(
				new Token("return", false),
				new LocalExpression(new Token("$generator", false), genLocal)));
	}

	function _instantiateGeneratorType (yieldingType : Type) : Type {
		// instantiate generator
		var genClassDef = this._jsxGeneratorObject.getParser().lookupTemplate(
			[],	// errors
			new TemplateInstantiationRequest(null, "__jsx_generator_object", [ yieldingType ] : Type[]),
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

class CodeTransformer {

	var _forceTransform : boolean;
	var _transformExprs : boolean;
	var _generatorEmulationMode : boolean;

	var _compiler : Compiler;
	var _emitter : Emitter;

	var _cpsTransformer : _CPSTransformer;
	var _generatorTransformer : _GeneratorTransformer;

	var _commands : string[];

	function constructor (compiler : Compiler, emitter : Emitter) {
		this._compiler = compiler;
		this._emitter = emitter;

		this._forceTransform = false;
		this._transformExprs = true;
		this._generatorEmulationMode = false;
		this._cpsTransformer = null;
		this._generatorTransformer = null;

		this._commands = null;
	}

	function setup (transformCommands : string[]) : Nullable.<string> {
		this._commands = transformCommands;
		if (this._forceTransform) {
			this._commands.push("cps");
		}
		if (this._generatorEmulationMode || this._forceTransform) {
			this._commands.push("generator");
		}

		// setup transformers
		try {
			if (this._commands.indexOf("cps") || this._commands.indexOf("generator")) {
				this._cpsTransformer = new _CPSTransformer(this);
			}
			if (this._commands.indexOf("generator")) {
				this._generatorTransformer = new _GeneratorTransformer(this, this._cpsTransformer);
			}
		} catch (e : Error) {
			return e.message;
		}

		return null;
	}

	function setForceTransform (force : boolean) : void {
		this._forceTransform = force;
	}

	function setGeneratorEmulationMode (mode : boolean) : void {
		this._generatorEmulationMode = mode;
	}

	function getCompiler () : Compiler {
		return this._compiler;
	}

	function getEmitter () : Emitter {
		return this._emitter;
	}

	function performTransformation () : void {
		this._commands.forEach((cmd) -> {
			switch (cmd) {
			case "cps":
				this._getAllClosures().forEach((funcDef) -> {
					if (this._cpsTransformer._functionIsTransformable(funcDef)) {
						this._cpsTransformer._doCPSTransform(funcDef);
					}
				});
				break;
			case "generator":
				this._getAllClosures().forEach((funcDef) -> {
					if (funcDef.isGenerator()) {
						this._generatorTransformer._transformGenerator(funcDef);
					}
				});
				break;
			}
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

	static function _getFunctionNestDepth (funcDef : MemberFunctionDefinition) : number {
		var depth = 0;
		var parent : MemberFunctionDefinition;
		while ((parent = funcDef.getParent()) != null) {
			depth++;
			funcDef = parent;
		}
		return depth;
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

	var _numUniqVar = 0;

	function _createFreshArgumentDeclaration (type : Type) : ArgumentDeclaration {
		var id = this._numUniqVar++;
		return new ArgumentDeclaration(new Token("$a" + id, true), type);
	}

	function _createFreshLocalVariable (type : Type) : LocalVariable {
		var id = this._numUniqVar++;
		return new LocalVariable(new Token("$a" + id, true), type);
	}

	function _createAnonymousFunction (parent : MemberFunctionDefinition, token : Token /* null for auto-gen */, args : ArgumentDeclaration[], returnType : Type) : MemberFunctionDefinition {
		return this._createNamedFunction(parent, token, null, args, returnType);
	}

	function _createNamedFunction (parent : MemberFunctionDefinition, token : Token /* null for auto-gen */, nameToken : Token, args : ArgumentDeclaration[], returnType : Type) : MemberFunctionDefinition {
		if (token == null) {
			token = new Token("function", false);
		}
		var funcDef = new MemberFunctionDefinition(
			token,
			nameToken,
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
