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
import "./expression.jsx";
import "./statement.jsx";
import "./parser.jsx";
import "./type.jsx";
import "./util.jsx";

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

	abstract function replaceControlStructuresWithGotos () : Statement[];

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

	override function replaceControlStructuresWithGotos () : Statement[] {
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

	override function replaceControlStructuresWithGotos () : Statement[] {
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

	override function replaceControlStructuresWithGotos () : Statement[] {
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

	override function replaceControlStructuresWithGotos () : Statement[] {
		throw new Error("logic flaw");
	}

}

class _YieldStatementTransformer extends _StatementTransformer {

	var _index : number;
	var _statement : YieldStatement;

	function constructor (transformer : CodeTransformer, statement : YieldStatement) {
		super(transformer, "YIELD");
		this._statement = statement;
	}

	override function getStatement () : Statement {
		return this._statement;
	}

	override function replaceControlStructuresWithGotos () : Statement[] {
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

	override function replaceControlStructuresWithGotos () : Statement[] {
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

	override function replaceControlStructuresWithGotos () : Statement[] {
		if (this._statement.getLabel() != null) {
			var trans = this._transformer.findLabellableStatementTransformerByLabel(this._statement.getLabel().getValue());
		} else {
			trans = this._transformer.getInnermostLabellableStatementTransformer();
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

	override function replaceControlStructuresWithGotos () : Statement[] {
		if (this._statement.getLabel() != null) {
			var trans = this._transformer.findLabellableStatementTransformerByLabel(this._statement.getLabel().getValue());
		} else {
			trans = this._transformer.getInnermostLabellableStatementTransformer();
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

	var _index : number;
	var _statement : DoWhileStatement;

	function constructor (transformer : CodeTransformer, statement : DoWhileStatement) {
		super(transformer, "DO-WHILE");
		this._statement = statement;
	}

	override function getStatement () : Statement {
		return this._statement;
	}

	override function replaceControlStructuresWithGotos () : Statement[] {
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
		this._transformer.convertAndPushStatements(this._statement.getStatements(), statements);
		this._transformer.leaveLabelledBlock();
		var testLabel = "$TEST_DO_WHILE_" + this.getID() as string;
		statements.push(new GotoStatement(testLabel));
		statements.push(new LabelStatement(testLabel));
		var endLabel = "$END_DO_WHILE_" + this.getID() as string;
		this._transformer.pushConditionalBranch(this._statement.getExpr(), bodyLabel, endLabel, statements);
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

	override function replaceControlStructuresWithGotos () : Statement[] {
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

	var _index : number;
	var _statement : ForStatement;

	function constructor (transformer : CodeTransformer, statement : ForStatement) {
		super(transformer, "FOR");
		this._statement = statement;
	}

	override function getStatement () : Statement {
		return this._statement;
	}

	override function replaceControlStructuresWithGotos () : Statement[] {
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
		this._transformer.pushExpressionStatement(this._statement.getInitExpr(), statements);
		var testLabel = "$TEST_FOR_" + this.getID() as string;
		statements.push(new GotoStatement(testLabel));
		statements.push(new LabelStatement(testLabel));
		var bodyLabel = "$BODY_FOR_" + this.getID() as string;
		var endLabel = "$END_FOR_" + this.getID() as string;
		this._transformer.pushConditionalBranch(this._statement.getCondExpr(), bodyLabel, endLabel, statements);
		statements.push(new LabelStatement(bodyLabel));
		this._transformer.enterLabelledBlock(this);
		this._transformer.convertAndPushStatements(this._statement.getStatements(), statements);
		this._transformer.leaveLabelledBlock();
		var postLabel = "$POST_FOR_" + this.getID() as string;
		statements.push(new GotoStatement(postLabel));
		statements.push(new LabelStatement(postLabel));
		this._transformer.pushExpressionStatement(this._statement.getPostExpr(), statements);
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

	override function replaceControlStructuresWithGotos () : Statement[] {
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
		this._transformer.pushConditionalBranch(this._statement.getExpr(), succLabel, failLabel, statements);
		statements.push(new LabelStatement(succLabel));
		this._transformer.convertAndPushStatements(this._statement.getOnTrueStatements(), statements);
		var endLabel = "$END_IF_" + this.getID() as string;
		statements.push(new GotoStatement(endLabel));
		statements.push(new LabelStatement(failLabel));
		this._transformer.convertAndPushStatements(this._statement.getOnFalseStatements(), statements);
		statements.push(new GotoStatement(endLabel));
		statements.push(new LabelStatement(endLabel));
		return statements;
	}

}

class _SwitchStatementTransformer extends _LabellableStatementTransformer {

	var _index : number;
	var _statement : SwitchStatement;

	function constructor (transformer : CodeTransformer, statement : SwitchStatement) {
		super(transformer, "SWITCH");
		this._statement = statement;
	}

	override function getStatement () : Statement {
		return this._statement;
	}

	override function replaceControlStructuresWithGotos () : Statement[] {
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
				this._transformer.convertAndPushStatement(stmt, output);
			}
		}
		this._transformer.leaveLabelledBlock();
	}

	function _getLabelFromCaseStatement (caseStmt : CaseStatement) : string {
		return "$SWITCH_" + this.getID() as string + "_CASE_" + caseStmt.getExpr().getToken().getValue();
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

	override function replaceControlStructuresWithGotos () : Statement[] {
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

	override function replaceControlStructuresWithGotos () : Statement[] {
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

	override function replaceControlStructuresWithGotos () : Statement[] {
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
		this._transformer.pushConditionalBranch(this._statement.getExpr(), bodyLabel, endLabel, statements);
		statements.push(new LabelStatement(bodyLabel));
		this._transformer.enterLabelledBlock(this);
		this._transformer.convertAndPushStatements(this._statement.getStatements(), statements);
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

	override function replaceControlStructuresWithGotos () : Statement[] {
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

	override function replaceControlStructuresWithGotos () : Statement[] {
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

	override function replaceControlStructuresWithGotos () : Statement[] {
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

	override function replaceControlStructuresWithGotos () : Statement[] {
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

	override function replaceControlStructuresWithGotos () : Statement[] {
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

	override function replaceControlStructuresWithGotos () : Statement[] {
		return [ this._statement ] : Statement[];
	}

}

class CodeTransformer {

	static var stopIterationType : ObjectType;
	static var jsxGeneratorClassDef : TemplateClassDefinition;

	var _labelMap = new _LabellableStatementTransformer[];

	function findLabellableStatementTransformerByLabel (label : string) : _LabellableStatementTransformer {
		for (var i = 0; this._labelMap.length; ++i) {
			var trans = this._labelMap[i];
			if ((trans.getStatement() as LabellableStatement).getLabel().getValue() == label)
				return trans;
		}
		throw new Error("fatal error: no corresponding transformer for label \"" + label + "\"");
	}

	function getInnermostLabellableStatementTransformer () : _LabellableStatementTransformer {
		return this._labelMap[this._labelMap.length - 1];
	}

	function enterLabelledBlock (transformer : _LabellableStatementTransformer) : void {
		this._labelMap.push(transformer);
	}

	function leaveLabelledBlock () : void {
		this._labelMap.pop();
	}

	function convertAndPushStatement (input : Statement, output : Statement[]) : void {
		var conved = this._getStatementTransformerFor(input).replaceControlStructuresWithGotos();
		for (var i = 0; i < conved.length; ++i) {
			output.push(conved[i]);
		}
	}

	function convertAndPushStatements (input : Statement[], output : Statement[]) : void {
		for (var i = 0; i < input.length; ++i) {
			this.convertAndPushStatement(input[i], output);
		}
	}

	function pushConditionalBranch (expr : Expression, succLabel : string, failLabel : string, output : Statement[]) : void {
		output.push(new IfStatement(new Token("if", false), expr, [ new GotoStatement(succLabel) ] : Statement[], [ new GotoStatement(failLabel) ] : Statement[]));
	}

	function pushExpressionStatement (expr : Expression, output : Statement[]) : void {
		output.push(new ExpressionStatement(expr));
	}

	var _statementIDs = new Map.<number>;

	function getStatementIDMap () : Map.<number> {
		return this._statementIDs;
	}

	function transformFunctionDefinition (funcDef : MemberFunctionDefinition) : void {
		var newExpr = new NewExpression(new Token("new", false), CodeTransformer.stopIterationType, []);
		newExpr.analyze(new AnalysisContext([], null, null), null);
		funcDef.getStatements().push(new ThrowStatement(new Token("throw", false), newExpr));
		var numBlock = this._doCPSConvert(funcDef);
		this._eliminateYields(funcDef, numBlock);
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
	// 		return new _LocalExpressionTransformer(this, expr as LocalExpression);
	// 	else if (expr instanceof ClassExpression)
	// 		return new _ClassExpressionTransformer(this, expr as ClassExpression);
	// 	else if (expr instanceof NullExpression)
	// 		return new _NullExpressionTransformer(this, expr as NullExpression);
	// 	else if (expr instanceof BooleanLiteralExpression)
	// 		return new _BooleanLiteralExpressionTransformer(this, expr as BooleanLiteralExpression);
	// 	else if (expr instanceof IntegerLiteralExpression)
	// 		return new _IntegerLiteralExpressionTransformer(this, expr as IntegerLiteralExpression);
	// 	else if (expr instanceof NumberLiteralExpression)
	// 		return new _NumberLiteralExpressionTransformer(this, expr as NumberLiteralExpression);
	// 	else if (expr instanceof StringLiteralExpression)
	// 		return new _StringLiteralExpressionTransformer(this, expr as StringLiteralExpression);
	// 	else if (expr instanceof RegExpLiteralExpression)
	// 		return new _RegExpLiteralExpressionTransformer(this, expr as RegExpLiteralExpression);
	// 	else if (expr instanceof ArrayLiteralExpression)
	// 		return new _ArrayLiteralExpressionTransformer(this, expr as ArrayLiteralExpression);
	// 	else if (expr instanceof MapLiteralExpression)
	// 		return new _MapLiteralExpressionTransformer(this, expr as MapLiteralExpression);
	// 	else if (expr instanceof ThisExpression)
	// 		return new _ThisExpressionTransformer(this, expr as ThisExpression);
	// 	else if (expr instanceof BitwiseNotExpression)
	// 		return new _UnaryExpressionTransformer(this, expr as BitwiseNotExpression);
	// 	else if (expr instanceof InstanceofExpression)
	// 		return new _InstanceofExpressionTransformer(this, expr as InstanceofExpression);
	// 	else if (expr instanceof AsExpression)
	// 		return new _AsExpressionTransformer(this, expr as AsExpression);
	// 	else if (expr instanceof AsNoConvertExpression)
	// 		return new _AsNoConvertExpressionTransformer(this, expr as AsNoConvertExpression);
	// 	else if (expr instanceof LogicalNotExpression)
	// 		return new _UnaryExpressionTransformer(this, expr as LogicalNotExpression);
	// 	else if (expr instanceof TypeofExpression)
	// 		return new _UnaryExpressionTransformer(this, expr as TypeofExpression);
	// 	else if (expr instanceof PostIncrementExpression)
	// 		return new _PostfixExpressionTransformer(this, expr as PostIncrementExpression);
	// 	else if (expr instanceof PreIncrementExpression)
	// 		return new _UnaryExpressionTransformer(this, expr as PreIncrementExpression);
	// 	else if (expr instanceof PropertyExpression)
	// 		return new _PropertyExpressionTransformer(this, expr as PropertyExpression);
	// 	else if (expr instanceof SignExpression)
	// 		return new _UnaryExpressionTransformer(this, expr as SignExpression);
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

	function _doCPSConvert (funcDef : MemberFunctionDefinition) : number {
		this._replaceControlStructuresWithGotos(funcDef);
		return this._eliminateGotos(funcDef);
	}

	function _replaceControlStructuresWithGotos (funcDef : MemberFunctionDefinition) : void {
		var statements = new Statement[];
		for (var i = 0; i < funcDef.getStatements().length; ++i) {
			statements = statements.concat(this._getStatementTransformerFor(funcDef.getStatements()[i]).replaceControlStructuresWithGotos());
		}
		// insert prologue code
		statements.unshift(
			new GotoStatement("$START"),
			new LabelStatement("$START")
		);
		// insert epilogue code
		statements.push(
			new GotoStatement("$END"),
			new LabelStatement("$END")
		);
		funcDef._statements = statements;
	}

	function _eliminateGotos (funcDef : MemberFunctionDefinition) : number {
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
		// replace gotos with function call
		for (var i = 0; i < statements.length; ++i) {
			var stmt = statements[i];
			if (stmt instanceof GotoStatement) {
				var name = (stmt as GotoStatement).getLabel();
				statements[i] = new ExpressionStatement(new CallExpression(new Token("(", false), new LocalExpression(null, labels[name]), []));
			} else if (stmt instanceof IfStatement) {
				var ifStmt = stmt as IfStatement;
				var succLabel = (ifStmt.getOnTrueStatements()[0] as GotoStatement).getLabel();
				ifStmt.getOnTrueStatements()[0] = new ExpressionStatement(new CallExpression(new Token("(", false), new LocalExpression(null, labels[succLabel]), []));
				var failLabel = (ifStmt.getOnFalseStatements()[0] as GotoStatement).getLabel();
				ifStmt.getOnFalseStatements()[0] = new ExpressionStatement(new CallExpression(new Token("(", false), new LocalExpression(null, labels[failLabel]), []));
			} else if (stmt instanceof SwitchStatement) {
				var switchStmt = stmt as SwitchStatement;
				for (var j = 0; j < switchStmt.getStatements().length; ++j) {
					if (switchStmt.getStatements()[j] instanceof GotoStatement) {
						name = (switchStmt.getStatements()[j] as GotoStatement).getLabel();
						switchStmt.getStatements()[j] = new ExpressionStatement(new CallExpression(new Token("(", false), new LocalExpression(null, labels[name]), []));
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
		var numBlock = 0;
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
			var block = new MemberFunctionDefinition(
						new Token("function", false),
						null,
						ClassDefinition.IS_STATIC,
						Type.voidType,
						[], // args
						[], // locals
						body,
						[], // closures
						null,
						null
			);
			funcDef.getClosures().push(block);
			codeBlocks.push(new ExpressionStatement(
				new AssignmentExpression(
					new Token("=", false),
					new LocalExpression(null, labels[currentLabel.getName()]),
					new FunctionExpression(new Token("function", false), block))));
			++numBlock;
		}
		funcDef._statements = codeBlocks.concat(entries);
		return numBlock;
	}

	static function _calcGeneratorNestDepth (funcDef : MemberFunctionDefinition) : number {
		var depth = 0;
		var parent : MemberFunctionDefinition;
		while ((parent = funcDef.getParent()) != null) {
			if (parent.isGenerator())
				depth++;
			funcDef = parent;
		}
		return depth;
	}

	function _eliminateYields (funcDef : MemberFunctionDefinition, numBlock : number) : void { // FIXME wasabiz nested generator
		var yieldType = (funcDef.getReturnType().getClassDef() as InstantiatedClassDefinition).getTypeArguments()[0];

		// create a generator object
		var genClassDef = CodeTransformer.jsxGeneratorClassDef.instantiateTemplateClass([], new TemplateInstantiationRequest(null, "__jsx_generator", [ yieldType ] : Type[]));
		var createContext = function (parser : Parser) : AnalysisContext {
			return new AnalysisContext(
				[],
				parser,
				function (parser : Parser, classDef : ClassDefinition) : ClassDefinition {
					classDef.setAnalysisContextOfVariables(createContext(parser));
					classDef.analyze(createContext(parser));
					return classDef;
				});
		};
		var parser = CodeTransformer.jsxGeneratorClassDef.getParser();
		genClassDef.resolveTypes(createContext(parser));
		genClassDef.analyze(createContext(parser));
		CodeTransformer.jsxGeneratorClassDef.getParser()._classDefs.push(genClassDef);
		var genType = new ObjectType(genClassDef);

		var genLocalName = "$generator" + CodeTransformer._calcGeneratorNestDepth(funcDef) as string;
		var genLocal = new LocalVariable(new Token(genLocalName, false), genType);
		funcDef.getLocals().push(genLocal);

		var newExpr = new NewExpression(new Token("new", false), genType, []);
		newExpr.analyze(new AnalysisContext([], null, null), null);
		funcDef.getStatements().unshift(new ExpressionStatement(
			new AssignmentExpression(
				new Token("=", false),
				new LocalExpression(new Token(genLocalName, false), genLocal),
				newExpr)));

		// replace yield statement
		/*
		  yield expr;
		  $LABEL();

		  -> $generatorN.__value = expr;
		     $generatorN.__next = $LABEL;
		 */
		var blocks = funcDef.getClosures().slice(funcDef.getClosures().length - numBlock);
		for (var i = 0; i < blocks.length; ++i) {
			var statements = blocks[i].getStatements();
			for (var j = 0; j < statements.length; ++j) {
				if (statements[j] instanceof YieldStatement) {
					statements.splice(j, 2,
						new ExpressionStatement(
							new AssignmentExpression(
								new Token("=", false),
								new PropertyExpression(
									new Token(".", false),
									new LocalExpression(new Token(genLocalName, false), genLocal),
									new Token("__value", false),
									[],
									yieldType),
								(statements[j] as YieldStatement).getExpr())),
						new ExpressionStatement(
							new AssignmentExpression(
								new Token("=", false),
								new PropertyExpression(
									new Token(".", false),
									new LocalExpression(new Token(genLocalName, false), genLocal),
									new Token("__next", true),
									[],
									new StaticFunctionType(null, Type.voidType, [], true)),
								((statements[j + 1] as ExpressionStatement).getExpr()as CallExpression).getExpr())));
					break;
				}
			}
		}

		// replace entry point
		/*
		  $START();

		  -> $generatorN.__next = $START;
		 */
		statements = funcDef.getStatements();
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
						new Token("$START", true),
						(((statements[statements.length - 1] as ExpressionStatement).getExpr() as CallExpression).getExpr() as LocalExpression).getLocal()))));

		// return the generator
		statements.push(
			new ReturnStatement(
				new Token("return", false),
				new LocalExpression(new Token("$generator", false), genLocal)));
	}

}
