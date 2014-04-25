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

import "./analysis.jsx";
import "./classdef.jsx";
import "./expression.jsx";
import "./type.jsx";
import "./util.jsx";
import "./parser.jsx";

abstract class Statement implements Stashable {

	function constructor () {
	}

	// returns whether or not to continue analysing the following statements
	function analyze (context : AnalysisContext) : boolean {
		if (! (this instanceof CaseStatement || this instanceof DefaultStatement))
			if (! Statement.assertIsReachable(context, this.getToken()))
				return false;
		try {
			return this.doAnalyze(context);
		} catch (e : Error) {
			var token = this.getToken();
			var srcPos = token != null ? Util.format(" at file %1, line %2, near %3", [token.getFilename(), token.getLineNumber() as string, token.getValue()]) : "";
			e.message = Util.format("fatal error while compiling statement%1\n%2", [srcPos, e.message]);

			throw e;
		}
	}

	function forEachStatement (cb : function(:Statement):boolean) : boolean {
		return this.forEachStatement(function(stmt,_) {
			return cb(stmt);
		});
	}

	function forEachStatement (cb : function(:Statement,:function(:Statement):void):boolean) : boolean {
		return true;
	}

	function handleStatements (cb : function(:Statement[]):boolean) : boolean {
		return true;
	}

	function forEachExpression (cb : function (:Expression):boolean) : boolean {
		return this.forEachExpression(function (expr : Expression, _ : function(:Expression):void) : boolean {
			return cb(expr);
		});
	}

	abstract function forEachExpression (cb : function (:Expression, :function(:Expression):void) : boolean) : boolean;

	abstract function getToken () : Token; // returns a token of the statement

	abstract function doAnalyze(context : AnalysisContext) : boolean; // returns whether or not to continue analysing the following statements

	function _analyzeExpr (context : AnalysisContext, expr : Expression) : boolean {
		if (context.statement != null)
			throw new Error("logic flaw");
		context.statement = this;
		var result = false;
		try {
			result = expr.analyze(context, null);
		} finally {
			context.statement = null;
		}
		return result;
	}

	static function assertIsReachable (context : AnalysisContext, token : Token) : boolean {
		if (! context.getTopBlock().localVariableStatuses.isReachable()) {
			context.errors.push(new CompileWarning(token, "the code is unreachable"));
		}
		return true;
	}

	abstract function clone () : Statement;
	abstract function serialize () : variant;
}

class ConstructorInvocationStatement extends Statement {

	var _token : Token;
	var _ctorClassType : Type;
	var _args : Expression[];
	var _ctorFunctionType : FunctionType;

	function constructor (token : Token, ctorClassType : Type, args : Expression[]) {
		this(token, ctorClassType, args, null);
	}
	function constructor (token : Token, ctorClassType : Type, args : Expression[], ctorFunctionType : FunctionType) {
		super();
		this._token = token;
		this._ctorClassType = ctorClassType;
		this._args = args;
		this._ctorFunctionType = ctorFunctionType != null ? ctorFunctionType : null;
	}

	override function clone () : Statement {
		return new ConstructorInvocationStatement(this._token, this._ctorClassType, Util.cloneArray(this._args), this._ctorFunctionType);
	}

	function instantiate (instantiationContext : InstantiationContext) : Statement {
		if (this._ctorFunctionType != null) {
			throw new Error("instantiation after analysis?");
		}
		return new ConstructorInvocationStatement(
			this._token,
			this._ctorClassType.instantiate(instantiationContext, false),
			Util.cloneArray(this._args),
			null);
	}

	override function getToken () : Token {
		return this._token;
	}

	function getArguments () : Expression[] {
		return this._args;
	}

	function getConstructingClassDef () : ClassDefinition {
		return this._ctorClassType.getClassDef();
	}

	function getConstructorType () : FunctionType {
		return this._ctorFunctionType;
	}

	override function serialize () : variant {
		return [
			"ConstructorInvocationStatement",
			this._ctorClassType.serialize(),
			Util.serializeArray(this._args)
		] : variant[];
	}

	override function doAnalyze (context : AnalysisContext) : boolean {
		assert this.getConstructingClassDef(), this._ctorClassType.toString();
		var ctorType = this.getConstructingClassDef().getMemberTypeByName(context.errors, this._token, "constructor", false, new Type[], ClassDefinition.GET_MEMBER_MODE_CLASS_ONLY) as FunctionType;
		if (ctorType == null) {
			if (this._args.length != 0) {
				context.errors.push(new CompileError(this.getToken(), "no function with matching arguments"));
				return true;
			}
			ctorType = new MemberFunctionType(this.getConstructingClassDef().getToken(), new ObjectType(this.getConstructingClassDef()), Type.voidType, new Type[], false); // implicit constructor
		} else {
			// analyze args
			var argTypes = Util.analyzeArgs(
				context, this._args, null,
				ctorType.getExpectedTypes(this._args.length, false));
			if (argTypes == null) {
				// error is reported by callee
				return true;
			}
			if ((ctorType = ctorType.deduceByArgumentTypes(context, this.getToken(), argTypes, false)) == null) {
				// error is reported by callee
				return true;
			}
		}
		this._ctorFunctionType = ctorType;
		return true;
	}

	override function forEachExpression (cb : function(:Expression,:function(:Expression):void):boolean) : boolean {
		if (! Util.forEachExpression(cb, this._args))
			return false;
		return true;
	}

}

// statements that take one expression

abstract class UnaryExpressionStatement extends Statement {

	var _expr : Expression;

	function constructor (expr : Expression) {
		super();
		if (expr == null)
			throw new Error("logic flaw");
		this._expr = expr;
	}

	override function getToken () : Token {
		return this._expr.getToken();
	}

	function getExpr () : Expression {
		return this._expr;
	}

	function setExpr (expr : Expression) : void {
		this._expr = expr;
	}

	override function doAnalyze (context : AnalysisContext) : boolean {
		this._analyzeExpr(context, this._expr);
		return true;
	}

	override function forEachExpression (cb : function(:Expression,:function(:Expression):void):boolean) : boolean {
		if (! cb(this._expr, function (expr) { this._expr = expr; }))
			return false;
		return true;
	}

}

class ExpressionStatement extends UnaryExpressionStatement {

	function constructor (expr : Expression) {
		super(expr);
	}

	override function clone () : Statement {
		return new ExpressionStatement(this._expr.clone());
	}

	override function serialize () : variant {
		return [
			"ExpressionStatement",
			this._expr.serialize()
		] : variant[];
	}

}

class FunctionStatement extends Statement {

	var _token : Token;
	var _funcDef : MemberFunctionDefinition;

	function constructor (token : Token, funcDef : MemberFunctionDefinition) {
		super();
		this._token = token;
		this._funcDef = funcDef;
	}

	override function clone () : FunctionStatement {
		// NOTE: funcDef is not cloned, but is later replaced in MemberFunctionDefitition#instantiate
		return new FunctionStatement(this._token, this._funcDef);
	}

	override function getToken () : Token {
		return this._token;
	}

	function getFuncDef () : MemberFunctionDefinition {
		return this._funcDef;
	}

	function setFuncDef (funcDef : MemberFunctionDefinition) : void {
		this._funcDef = funcDef;
	}

	override function serialize () : variant {
		return [
			"FunctionStatement",
			this._funcDef.serialize()
		] : variant[];
	}

	override function doAnalyze (context : AnalysisContext) : boolean {
		if (! this._typesAreIdentified()) {
			context.errors.push(new CompileError(this._token, "argument / return types were not automatically deductable, please specify them by hand"));
			return false;
		}
		var returnType = this._funcDef.getReturnType();
		if (this._funcDef.isGenerator()) {
			var classDef;
			if (! (returnType instanceof ObjectType
				&& (classDef = returnType.getClassDef()) instanceof InstantiatedClassDefinition
				&& (classDef as InstantiatedClassDefinition).getTemplateClassName() == "Generator")) {
					this._funcDef.setReturnType(new ObjectType(Util.instantiateTemplate(context, this._token, "Generator", [ Type.voidType, returnType ])));
			}
		}
		this._funcDef.analyze(context);
		// the function can be used from the scope of the same level
		context.getTopBlock().localVariableStatuses.setStatus(this._funcDef.getFuncLocal());
		return true; // return true since everything is resolved correctly even if analysis of the function definition failed
	}

	function _typesAreIdentified () : boolean {
		var argTypes = this._funcDef.getArgumentTypes();
		for (var i = 0; i < argTypes.length; ++i) {
			if (argTypes[i] == null)
				return false;
		}
		if (this._funcDef.getReturnType() == null)
			return false;
		return true;
	}

	override function forEachExpression (cb : function(:Expression,:function(:Expression):void):boolean) : boolean {
		return true;
	}

}

class ReturnStatement extends Statement {

	var _token : Token;
	var _expr : Expression; // nullable

	function constructor (token : Token, expr : Expression) {
		super();
		this._token = token;
		this._expr = expr;
	}

	override function clone () : Statement {
		return new ReturnStatement(this._token, Util.cloneNullable(this._expr));
	}

	override function getToken () : Token {
		return this._token;
	}

	function getExpr () : Expression {
		return this._expr;
	}

	function setExpr (expr : Expression) : void {
		this._expr = expr;
	}

	override function serialize () : variant {
		return [
			"ReturnStatement",
			Util.serializeNullable(this._expr)
		] : variant[];
	}

	override function doAnalyze (context : AnalysisContext) : boolean {
		// handle generator
		if (context.funcDef.isGenerator()) {
			context.errors.push(new CompileError(this._token, "return statement in generator is not allowed"));
			return true;
		}
		var returnType = context.funcDef.getReturnType();
		if (returnType == null) {
			if (this._expr != null) {
				if (! this._analyzeExpr(context, this._expr))
					return true;
				var exprType = this._expr.getType();
				if (exprType == null)
					return true;
				context.funcDef.setReturnType(exprType);
			} else {
				context.funcDef.setReturnType(Type.voidType);
			}
		} else if (returnType.equals(Type.voidType)) {
			// handle return(void);
			if (this._expr != null) {
				if (! this._analyzeExpr(context, this._expr))
					return true;
				var exprType = this._expr.getType();
				if (exprType == null)
					return true;
				if (! exprType.equals(Type.voidType)) {
					context.errors.push(new CompileError(this._token, "unmatched return type, expected a void expression"));
					return true;
				}
			}
		} else {
			// handle return of values
			if (this._expr == null) {
				context.errors.push(new CompileError(this._token, "cannot return void, the function is declared to return a value of type '" + returnType.toString() + "'"));
				return true;
			}
			if (this._expr instanceof FunctionExpression && ! (this._expr as FunctionExpression).argumentTypesAreIdentified() && returnType instanceof StaticFunctionType) {
				if (! (this._expr as FunctionExpression).deductTypeIfUnknown(context, returnType as StaticFunctionType))
					return false;
			}
			if (! this._analyzeExpr(context, this._expr))
				return true;
			var exprType = this._expr.getType();
			if (exprType == null)
				return true;
			if (! exprType.isConvertibleTo(returnType)) {
				context.errors.push(new CompileError(this._token, "cannot convert '" + exprType.toString() + "' to return type '" + returnType.toString() + "'"));
				return false;
			}
		}
		context.getTopBlock().localVariableStatuses.setIsReachable(false);
		return true;
	}

	override function forEachExpression (cb : function(:Expression,:function(:Expression):void):boolean) : boolean {
		if (this._expr != null && ! cb(this._expr, function (expr) { this._expr = expr; }))
			return false;
		return true;
	}

}

class DeleteStatement extends UnaryExpressionStatement {

	var _token : Token;

	function constructor (token : Token, expr : Expression) {
		super(expr);
		this._token = token;
	}

	override function clone () : Statement {
		return new DeleteStatement(this._token, this._expr.clone());
	}

	override function getToken () : Token {
		return this._token;
	}

	override function serialize () : variant {
		return [
			"DeleteStatement",
			this._expr.serialize()
		] : variant[];
	}

	override function doAnalyze (context : AnalysisContext) : boolean {
		if (! this._analyzeExpr(context, this._expr))
			return true;
		if (! (this._expr instanceof ArrayExpression)) {
			context.errors.push(new CompileError(this._token, "only properties of a map object can be deleted"));
			return true;
		}
		var secondExprType = (this._expr as ArrayExpression).getSecondExpr().getType();
		if (secondExprType == null)
			return true; // error should have been already reported
		if (! secondExprType.resolveIfNullable().equals(Type.stringType)) {
			context.errors.push(new CompileError(this._token, "only properties of a map object can be deleted"));
			return true;
		}
		return true;
	}

}

// break and continue

abstract class JumpStatement extends Statement {

	var _token : Token;
	var _label : Token;

	function constructor (token : Token, label : Token) {
		super();
		this._token = token;
		this._label = label;
	}

	override function getToken () : Token {
		return this._token;
	}

	abstract function _getName() : string;

	function getLabel () : Token {
		return this._label;
	}

	override function serialize () : variant {
		return [
			this._getName(),
			this._token.serialize(),
			Util.serializeNullable(this._label)
		] : variant[];
	}

	override function doAnalyze (context : AnalysisContext) : boolean {
		var targetBlock = this._determineDestination(context);
		if (targetBlock == null)
			return true;
		if (this instanceof BreakStatement)
			(targetBlock.block as LabellableStatement).registerVariableStatusesOnBreak(context.getTopBlock().localVariableStatuses);
		else
			(targetBlock.block as ContinuableStatement).registerVariableStatusesOnContinue(context.getTopBlock().localVariableStatuses);
		context.getTopBlock().localVariableStatuses.setIsReachable(false);
		return true;
	}

	function _determineDestination (context : AnalysisContext) : BlockContext {
		for (var i = context.blockStack.length - 1; ! (context.blockStack[i].block instanceof MemberFunctionDefinition); --i) {
			var statement = context.blockStack[i].block;
			// continue unless we are at the destination level
			if (! (statement instanceof LabellableStatement))
				continue;
			if (this._label != null) {
				var statementLabel = (statement as LabellableStatement).getLabel();
				if (statementLabel != null && statementLabel.getValue() == this._label.getValue()) {
					if (this._token.getValue() == "continue" && statement instanceof SwitchStatement) {
						context.errors.push(new CompileError(this._token, "cannot 'continue' to a switch statement"));
						return null;
					}
				} else {
					continue;
				}
			} else {
				if (this._token.getValue() == "continue" && statement instanceof SwitchStatement)
					continue;
			}
			// found the destination
			return context.blockStack[i];
		}
		if (this._label != null)
			context.errors.push(new CompileError(this._label, "label '" + this._label.getValue() + "' is either not defined or invalid as the destination"));
		else
			context.errors.push(new CompileError(this._token, "cannot '" + this._token.getValue() + "' at this point"));
		return null;
	}

	override function forEachExpression (cb : function(:Expression,:function(:Expression):void):boolean) : boolean {
		return true;
	}

}

class BreakStatement extends JumpStatement {

	function constructor (token : Token, label : Token) {
		super(token, label);
	}

	override function clone () : Statement {
		return new BreakStatement(this._token, this._label);
	}

	override function _getName () : string {
		return "BreakStatement";
	}

	override function forEachExpression (cb : function(:Expression,:function(:Expression):void):boolean) : boolean {
		return true;
	}

}

class ContinueStatement extends JumpStatement {

	function constructor (token : Token, label : Token) {
		super(token, label);
	}

	override function clone () : Statement {
		return new ContinueStatement(this._token, this._label);
	}

	override function _getName () : string {
		return "ContinueStatement";
	}

	override function forEachExpression (cb : function(:Expression,:function(:Expression):void):boolean) : boolean {
		return true;
	}

}

// control flow statements

abstract class LabellableStatement extends Statement implements Block {

	var _token : Token;
	var _label : Token;
	var _lvStatusesOnBreak : LocalVariableStatuses;

	function constructor (token : Token, label : Token) {
		super();
		this._token = token;
		this._label = label;
	}

	override function getToken () : Token {
		return this._token;
	}

	function getLabel () : Token {
		return this._label;
	}

	function _serialize () : variant[] {
		return [
			Util.serializeNullable(this._label)
		] : variant[];
	}

	function _prepareBlockAnalysis (context : AnalysisContext) : void {
		if (this._label) {
			// check if labels conflict
			for (var i = context.blockStack.length - 1; ! (context.blockStack[i].block instanceof MemberFunctionDefinition); --i) {
				var statement = context.blockStack[i].block;
				if (! (statement instanceof LabellableStatement)) {
					continue;
				}

				var ls = statement as LabellableStatement;
				if (ls.getLabel() && ls.getLabel().getValue() == this.getLabel().getValue()) {
					var error = new CompileError(this.getLabel(), Util.format("label '%1' has already been defined", [this.getLabel().getValue()]));
					error.addCompileNote(new CompileNote(ls.getLabel(), "defined here"));
					context.errors.push(error);
					break;
				}
			}
		}

		context.blockStack.push(new BlockContext(context.getTopBlock().localVariableStatuses.clone(), this));
		this._lvStatusesOnBreak = context.getTopBlock().localVariableStatuses.clone();
		this._lvStatusesOnBreak.setIsReachable(false);
	}

	function _abortBlockAnalysis (context : AnalysisContext) : void {
		context.blockStack.pop();
		this._lvStatusesOnBreak = null;
	}

	function _finalizeBlockAnalysis (context : AnalysisContext) : void {
		context.blockStack.pop();
		context.getTopBlock().localVariableStatuses = this._lvStatusesOnBreak;
		this._lvStatusesOnBreak = null;
	}

	function registerVariableStatusesOnBreak (statuses : LocalVariableStatuses) : void {
		if (statuses != null) {
			if (this._lvStatusesOnBreak == null)
				this._lvStatusesOnBreak = statuses.clone();
			else
				this._lvStatusesOnBreak = this._lvStatusesOnBreak.merge(statuses);
		}
	}

}

abstract class ContinuableStatement extends LabellableStatement {

	var _statements : Statement[];
	var _lvStatusesOnContinue : LocalVariableStatuses;

	function constructor (token : Token, label : Token, statements : Statement[]) {
		super(token, label);
		this._statements = statements;
	}

	function getStatements () : Statement[] {
		return this._statements;
	}

	override function forEachStatement (cb : function(:Statement,:function(:Statement):void):boolean) : boolean {
		if (! Util.forEachStatement(cb, this._statements))
			return false;
		return true;
	}

	override function handleStatements (cb : function(:Statement[]):boolean) : boolean {
		if (! cb(this._statements))
			return false;
		return true;
	}

	override function _prepareBlockAnalysis (context : AnalysisContext) : void {
		super._prepareBlockAnalysis(context);
		this._lvStatusesOnContinue = null;
	}

	override function _abortBlockAnalysis (context : AnalysisContext) : void {
		super._abortBlockAnalysis(context);
		this._lvStatusesOnContinue = null;
	}

	override function _finalizeBlockAnalysis (context : AnalysisContext) : void {
		super._finalizeBlockAnalysis(context);
		this._restoreContinueVariableStatuses(context);
	}

	function _restoreContinueVariableStatuses (context : AnalysisContext) : void {
		if (this._lvStatusesOnContinue != null) {
			context.getTopBlock().localVariableStatuses = context.getTopBlock().localVariableStatuses.merge(this._lvStatusesOnContinue);
			this._lvStatusesOnContinue = null;
		}
	}

	function registerVariableStatusesOnContinue (statuses : LocalVariableStatuses) : void {
		if (statuses != null) {
			if (this._lvStatusesOnContinue == null)
				this._lvStatusesOnContinue = statuses.clone();
			else
				this._lvStatusesOnContinue = this._lvStatusesOnContinue.merge(statuses);
		}
	}

}

class DoWhileStatement extends ContinuableStatement {

	var _expr : Expression;

	function constructor (token : Token, label : Token, expr : Expression, statements : Statement[]) {
		super(token, label, statements);
		this._expr = expr;
	}

	override function clone () : Statement {
		return new DoWhileStatement(this._token, this._label, this._expr.clone(), Util.cloneArray(this._statements));
	}

	function getExpr () : Expression {
		return this._expr;
	}

	override function serialize () : variant {
		return [
			"DoWhileStatement"
		] : variant[].concat(this._serialize()).concat([
			this._expr.serialize(),
			Util.serializeArray(this._statements)
		]);
	}

	override function doAnalyze (context : AnalysisContext) : boolean {
		this._prepareBlockAnalysis(context);
		try {
			for (var i = 0; i < this._statements.length; ++i)
				if (! this._statements[i].analyze(context))
					return false;
			this._restoreContinueVariableStatuses(context);
			if (! Statement.assertIsReachable(context, this._expr.getToken()))
				return false;
			if (this._analyzeExpr(context, this._expr))
				if (this._expr.getType().resolveIfNullable().equals(Type.voidType))
					context.errors.push(new CompileError(this._expr.getToken(), "expression of the do-while statement should not return void"));
			this.registerVariableStatusesOnBreak(context.getTopBlock().localVariableStatuses);
			this._finalizeBlockAnalysis(context);
		} catch (e : Error) {
			this._abortBlockAnalysis(context);
			throw e;
		}
		return true;
	}

	override function forEachExpression (cb : function(:Expression,:function(:Expression):void):boolean) : boolean {
		if (! cb(this._expr, function (expr) { this._expr = expr; }))
			return false;
		return true;
	}

}

class ForInStatement extends ContinuableStatement {

	var _lhsExpr : Expression;
	var _listExpr : Expression;

	function constructor (token : Token, label : Token, lhsExpr : Expression, listExpr : Expression, statements : Statement[]) {
		super(token, label, statements);
		this._lhsExpr = lhsExpr;
		this._listExpr = listExpr;
	}

	override function clone () : Statement {
		return new ForInStatement(this._token, this._label, this._lhsExpr.clone(), this._listExpr.clone(), Util.cloneArray(this._statements));
	}

	function getLHSExpr () : Expression {
		return this._lhsExpr;
	}

	function getListExpr () : Expression {
		return this._listExpr;
	}

	override function getStatements () : Statement[] {
		return this._statements;
	}

	override function serialize () : variant {
		return [
			"ForInStatement"
		] : variant[].concat(this._serialize()).concat([
			this._lhsExpr.serialize(),
			this._listExpr.serialize(),
			Util.serializeArray(this._statements)
		]);
	}

	override function doAnalyze (context : AnalysisContext) : boolean {
		if (! this._analyzeExpr(context, this._listExpr))
			return true;
		var listType = this._listExpr.getType().resolveIfNullable();
		var listClassDef;
		var listTypeName;
		if (listType instanceof ObjectType
			&& (listClassDef = listType.getClassDef()) instanceof InstantiatedClassDefinition
			&& ((listTypeName = (listClassDef as InstantiatedClassDefinition).getTemplateClassName()) == "Array" || listTypeName == "Map")) {
			// ok
		} else {
			context.errors.push(new CompileError(this.getToken(), "list expression of the for..in statement should be an array or a map"));
			return true;
		}
		this._prepareBlockAnalysis(context);
		try {
			this._analyzeExpr(context, this._lhsExpr);
			if (! this._lhsExpr.assertIsAssignable(context, this._token, listTypeName == "Array" ? (Type.numberType as Type) : (Type.stringType as Type)))
				return false;
			for (var i = 0; i < this._statements.length; ++i)
				if (! this._statements[i].analyze(context))
					return false;
			this.registerVariableStatusesOnContinue(context.getTopBlock().localVariableStatuses);
			this._finalizeBlockAnalysis(context);
		} catch (e : Error) {
			this._abortBlockAnalysis(context);
			throw e;
		}
		return true;
	}

	override function forEachExpression (cb : function(:Expression,:function(:Expression):void):boolean) : boolean {
		if (! cb(this._lhsExpr, function (expr) { this._lhsExpr = expr; }))
			return false;
		if (! cb(this._listExpr, function (expr) { this._listExpr = expr; }))
			return false;
		return true;
	}

}

class ForStatement extends ContinuableStatement {

	var _initExpr : Expression;
	var _condExpr : Expression;
	var _postExpr : Expression;

	function constructor (token : Token, label : Token, initExpr : Expression, condExpr : Expression, postExpr : Expression, statements : Statement[]) {
		super(token, label, statements);
		this._initExpr = initExpr; // nullable
		this._condExpr = condExpr; // nullable
		this._postExpr = postExpr; // nullable
	}

	override function clone () : Statement {
		return new ForStatement(this._token, this._label, Util.cloneNullable(this._initExpr), Util.cloneNullable(this._condExpr), Util.cloneNullable(this._postExpr), Util.cloneArray(this._statements));
	}

	function getInitExpr () : Expression {
		return this._initExpr;
	}

	function setInitExpr (expr : Expression) : void {
		this._initExpr = expr;
	}

	function getCondExpr () : Expression {
		return this._condExpr;
	}

	function getPostExpr () : Expression {
		return this._postExpr;
	}

	override function getStatements () : Statement[] {
		return this._statements;
	}

	override function serialize () : variant {
		return [
			"ForStatement"
		] : variant[].concat(this._serialize()).concat([
			Util.serializeNullable(this._initExpr),
			Util.serializeNullable(this._condExpr),
			Util.serializeNullable(this._postExpr),
			Util.serializeArray(this._statements)
		]);
	}

	override function doAnalyze (context : AnalysisContext) : boolean {
		if (this._initExpr != null)
			this._analyzeExpr(context, this._initExpr);
		if (this._condExpr != null)
			if (this._analyzeExpr(context, this._condExpr))
				if (this._condExpr.getType().resolveIfNullable().equals(Type.voidType))
					context.errors.push(new CompileError(this._condExpr.getToken(), "condition expression of the for statement should not return void"));
		this._prepareBlockAnalysis(context);
		try {
			for (var i = 0; i < this._statements.length; ++i)
				if (! this._statements[i].analyze(context))
					return false;
			this._restoreContinueVariableStatuses(context);
			if (this._postExpr != null) {
				if (! Statement.assertIsReachable(context, this._postExpr.getToken()))
					return false;
				this._analyzeExpr(context, this._postExpr);
			}
			this.registerVariableStatusesOnBreak(context.getTopBlock().localVariableStatuses);
			this._finalizeBlockAnalysis(context);
		} catch (e : Error) {
			this._abortBlockAnalysis(context);
			throw e;
		}
		return true;
	}

	override function forEachExpression (cb : function(:Expression,:function(:Expression):void):boolean) : boolean {
		if (this._initExpr != null && ! cb(this._initExpr, function (expr) { this._initExpr = expr; }))
			return false;
		if (this._condExpr != null && ! cb(this._condExpr, function (expr) { this._condExpr = expr; }))
			return false;
		if (this._postExpr != null && ! cb(this._postExpr, function (expr) { this._postExpr = expr; }))
			return false;
		return true;
	}

}

class IfStatement extends Statement implements Block {

	var _token : Token;
	var _expr : Expression;
	var _onTrueStatements : Statement[];
	var _onFalseStatements : Statement[];

	function constructor (token : Token, expr : Expression, onTrueStatements : Statement[], onFalseStatements : Statement[]) {
		super();
		this._token = token;
		this._expr = expr;
		this._onTrueStatements = onTrueStatements;
		this._onFalseStatements = onFalseStatements;
	}

	override function clone () : Statement {
		return new IfStatement(this._token, this._expr.clone(), Util.cloneArray(this._onTrueStatements), Util.cloneArray(this._onFalseStatements));
	}

	override function getToken () : Token {
		return this._token;
	}

	function getExpr () : Expression {
		return this._expr;
	}

	function setExpr (expr : Expression) : void {
		this._expr = expr;
	}

	function getOnTrueStatements () : Statement[] {
		return this._onTrueStatements;
	}

	function getOnFalseStatements () : Statement[] {
		return this._onFalseStatements;
	}

	override function serialize () : variant {
		return [
			"IfStatement",
			this._expr.serialize(),
			Util.serializeArray(this._onTrueStatements),
			Util.serializeArray(this._onFalseStatements)
		] : variant[];
	}

	override function doAnalyze (context : AnalysisContext) : boolean {
		if (this._analyzeExpr(context, this._expr))
			if (this._expr.getType().resolveIfNullable().equals(Type.voidType))
				context.errors.push(new CompileError(this._expr.getToken(), "expression of the if statement should not return void"));
		// if the expr is true
		context.blockStack.push(new BlockContext(context.getTopBlock().localVariableStatuses.clone(), this));
		var lvStatusesOnTrueStmts = null : LocalVariableStatuses, lvStatusesOnFalseStmts = null : LocalVariableStatuses;
		try {
			for (var i = 0; i < this._onTrueStatements.length; ++i)
				if (! this._onTrueStatements[i].analyze(context))
					return false;
			lvStatusesOnTrueStmts = context.getTopBlock().localVariableStatuses;
		} finally {
			context.blockStack.pop();
		}
		// if the expr is false
		try {
			context.blockStack.push(new BlockContext(context.getTopBlock().localVariableStatuses.clone(), this));
			for (var i = 0; i < this._onFalseStatements.length; ++i)
				if (! this._onFalseStatements[i].analyze(context))
					return false;
			var lvStatusesOnFalseStmts = context.getTopBlock().localVariableStatuses;
		} finally {
			context.blockStack.pop();
		}
		// merge the variable statuses
		context.getTopBlock().localVariableStatuses = lvStatusesOnTrueStmts.merge(lvStatusesOnFalseStmts);
		return true;
	}

	override function forEachStatement (cb : function(:Statement,:function(:Statement):void):boolean) : boolean {
		if (! Util.forEachStatement(cb, this._onTrueStatements))
			return false;
		if (! Util.forEachStatement(cb, this._onFalseStatements))
			return false;
		return true;
	}

	override function handleStatements (cb : function(:Statement[]):boolean) : boolean {
		if (! cb(this._onTrueStatements))
			return false;
		if (! cb(this._onFalseStatements))
			return false;
		return true;
	}

	override function forEachExpression (cb : function(:Expression,:function(:Expression):void):boolean) : boolean {
		if (! cb(this._expr, function (expr) { this._expr = expr; }))
			return false;
		return true;
	}

}

class SwitchStatement extends LabellableStatement {

	var _expr : Expression;
	var _statements : Statement[];

	function constructor (token : Token, label : Token, expr : Expression, statements : Statement[]) {
		super(token, label);
		this._expr = expr;
		this._statements = statements;
	}

	override function clone () : Statement {
		return new SwitchStatement(this._token, this._label, this._expr.clone(), Util.cloneArray(this._statements));
	}

	function getExpr () : Expression {
		return this._expr;
	}

	function setExpr (expr : Expression) : void {
		this._expr = expr;
	}

	function getStatements () : Statement[] {
		return this._statements;
	}

	override function serialize () : variant {
		return [
			"SwitchStatement"
		] : variant[].concat(this._serialize()).concat([
			this._expr.serialize(),
			Util.serializeArray(this._statements)
		]);
	}

	override function doAnalyze (context : AnalysisContext) : boolean {
		if (! this._analyzeExpr(context, this._expr))
			return true;
		var exprType = this._expr.getType().resolveIfNullable();
		if (! (exprType.equals(Type.booleanType) || exprType.equals(Type.integerType) || exprType.equals(Type.numberType) || exprType.equals(Type.stringType))) {
			context.errors.push(new CompileError(this._token, "switch statement only accepts boolean, number, or string expressions"));
			return true;
		}
		this._prepareBlockAnalysis(context);
		try {
			var hasDefaultLabel = false;
			var caseMap = new Map.<boolean>;
			for (var i = 0; i < this._statements.length; ++i) {
				var statement = this._statements[i];
				if (! statement.analyze(context))
					return false;
				if (statement instanceof DefaultStatement) {
					hasDefaultLabel = true;
				}
				else if (statement instanceof CaseStatement) {
					var caseExpr = (statement as CaseStatement).getExpr();
					var caseStr : Nullable.<string>;
					if (caseExpr instanceof IntegerLiteralExpression) {
						caseStr = (caseExpr as IntegerLiteralExpression).getDecoded() as string;
					} else if (caseExpr instanceof NumberLiteralExpression) {
						caseStr = (caseExpr as NumberLiteralExpression).getDecoded() as string;
					} else if (caseExpr instanceof BooleanLiteralExpression) {
						caseStr = (caseExpr as BooleanLiteralExpression).getDecoded() as string;
					} else if (caseExpr instanceof StringLiteralExpression) {
						caseStr = (caseExpr as StringLiteralExpression).getDecoded() as string;
					} else {
						// might not be a constant, so the duplicates are not checked
						caseStr = null;
					}
					if (caseStr != null && caseMap.hasOwnProperty(caseStr)) {
						context.errors.push(new CompileError(caseExpr.getToken(), "duplicate case value " + caseExpr.getToken().getValue()));
						return false;
					}
					caseMap[caseStr] = true;
				}
			}
			if (context.getTopBlock().localVariableStatuses.isReachable())
				this.registerVariableStatusesOnBreak(context.getTopBlock().localVariableStatuses);
			if (! hasDefaultLabel)
				this.registerVariableStatusesOnBreak(context.blockStack[context.blockStack.length - 2].localVariableStatuses);
			this._finalizeBlockAnalysis(context);
		} catch (e : Error) {
			this._abortBlockAnalysis(context);
			throw e;
		}
		return true;
	}

	override function forEachStatement (cb : function(:Statement,:function(:Statement):void):boolean) : boolean {
		if (! Util.forEachStatement(cb, this._statements))
			return false;
		return true;
	}

	override function handleStatements (cb : function(:Statement[]):boolean) : boolean {
		if (! cb(this._statements))
			return false;
		return true;
	}

	override function forEachExpression (cb : function(:Expression,:function(:Expression):void):boolean) : boolean {
		if (! cb(this._expr, function (expr) { this._expr = expr; }))
			return false;
		return true;
	}

	static function resetLocalVariableStatuses (context : AnalysisContext) : void {
		context.getTopBlock().localVariableStatuses = context.blockStack[context.blockStack.length - 2].localVariableStatuses.clone();
	}

}

class CaseStatement extends Statement {

	var _token : Token;
	var _expr : Expression;

	function constructor (token : Token, expr : Expression) {
		super();
		this._token = token;
		this._expr = expr;
	}

	override function clone () : Statement {
		return new CaseStatement(this._token, this._expr.clone());
	}

	override function getToken () : Token {
		return this._token;
	}

	function getExpr () : Expression {
		return this._expr;
	}

	override function serialize () : variant {
		return [
			"CaseStatement",
			this._expr.serialize()
		] : variant[];
	}

	override function doAnalyze (context : AnalysisContext) : boolean {
		if (! this._analyzeExpr(context, this._expr))
			return true;
		var statement = context.getTopBlock().block;
		if (! (statement instanceof SwitchStatement))
			throw new Error("logic flaw");
		var expectedType = (statement as SwitchStatement).getExpr().getType();
		if (expectedType == null)
			return true;
		expectedType = expectedType.resolveIfNullable();
		var exprType = this._expr.getType();
		if (exprType == null)
			return true;
		exprType = exprType.resolveIfNullable();
		if (exprType.equals(expectedType)) {
			// ok
		} else if (Type.isIntegerOrNumber(exprType) && Type.isIntegerOrNumber(expectedType)) {
			// ok
		} else if (expectedType.equals(Type.stringType) && exprType.equals(Type.nullType)) {
			// ok
		} else {
			context.errors.push(new CompileError(this._token, "type mismatch; expected type was '" + expectedType.toString() + "' but got '" + exprType.toString() + "'"));
		}
		// reset local variable statuses
		SwitchStatement.resetLocalVariableStatuses(context);
		return true;
	}

	override function forEachExpression (cb : function(:Expression,:function(:Expression):void):boolean) : boolean {
		if (! cb(this._expr, function (expr) { this._expr = expr; }))
			return false;
		return true;
	}

}

class DefaultStatement extends Statement {

	var _token : Token;

	function constructor (token : Token) {
		super();
		this._token = token;
	}

	override function clone () : Statement {
		return new DefaultStatement(this._token);
	}

	override function getToken () : Token {
		return this._token;
	}

	override function serialize () : variant {
		return [
			"DefaultStatement"
		] : variant[];
	}

	override function doAnalyze (context : AnalysisContext) : boolean {
		SwitchStatement.resetLocalVariableStatuses(context);
		return true;
	}

	override function forEachExpression (cb : function(:Expression,:function(:Expression):void):boolean) : boolean {
		return true;
	}

}

class WhileStatement extends ContinuableStatement {

	var _expr : Expression;

	function constructor (token : Token, label : Token, expr : Expression, statements : Statement[]) {
		super(token, label, statements);
		this._expr = expr;
	}

	override function clone () : Statement {
		return new WhileStatement(this._token, this._label, this._expr.clone(), Util.cloneArray(this._statements));
	}

	function getExpr () : Expression {
		return this._expr;
	}

	override function getStatements () : Statement[] {
		return this._statements;
	}

	override function serialize () : variant {
		return [
			"WhileStatement"
		] : variant[].concat(this._serialize()).concat([
			this._expr.serialize(),
			Util.serializeArray(this._statements)
		]);
	}

	override function doAnalyze (context : AnalysisContext) : boolean {
		if (this._analyzeExpr(context, this._expr))
			if (this._expr.getType().resolveIfNullable().equals(Type.voidType))
				context.errors.push(new CompileError(this._expr.getToken(), "expression of the while statement should not return void"));
		this._prepareBlockAnalysis(context);
		try {
			for (var i = 0; i < this._statements.length; ++i)
				if (! this._statements[i].analyze(context))
					return false;
			this.registerVariableStatusesOnContinue(context.getTopBlock().localVariableStatuses);
			this._finalizeBlockAnalysis(context);
		} catch (e : Error) {
			this._abortBlockAnalysis(context);
			throw e;
		}
		return true;
	}

	override function forEachExpression (cb : function(:Expression,:function(:Expression):void):boolean) : boolean {
		if (! cb(this._expr, function (expr) { this._expr = expr; }))
			return false;
		return true;
	}

}

class TryStatement extends Statement implements Block {

	var _token : Token;
	var _tryStatements : Statement[];
	var _catchStatements : CatchStatement[];
	var _finallyStatements : Statement[];

	function constructor (token : Token, tryStatements : Statement[], catchStatements : CatchStatement[], finallyStatements : Statement[]) {
		super();
		this._token = token;
		this._tryStatements = tryStatements;
		this._catchStatements = catchStatements;
		this._finallyStatements = finallyStatements;
	}

	override function clone () : Statement {
		return new TryStatement(this._token, Util.cloneArray(this._tryStatements), Util.cloneArray(this._catchStatements), Util.cloneArray(this._finallyStatements));
	}

	override function getToken () : Token {
		return this._token;
	}

	function getTryStatements () : Statement[] {
		return this._tryStatements;
	}

	function getCatchStatements () : CatchStatement[] {
		return this._catchStatements;
	}

	function getFinallyStatements () : Statement[] {
		return this._finallyStatements;
	}

	override function serialize () : variant {
		return [
			"TryStatement",
			Util.serializeArray(this._tryStatements),
			Util.serializeArray(this._catchStatements),
			Util.serializeArray(this._finallyStatements)
		] : variant[];
	}

	override function doAnalyze (context : AnalysisContext) : boolean {
		// try
		context.blockStack.push(new BlockContext(context.getTopBlock().localVariableStatuses.clone(), this));
		var lvStatusesAfterTryCatch = null : LocalVariableStatuses;
		try {
			for (var i = 0; i < this._tryStatements.length; ++i)
				if (! this._tryStatements[i].analyze(context))
					return false;
			lvStatusesAfterTryCatch = context.getTopBlock().localVariableStatuses;
		} finally {
			context.blockStack.pop();
		}
		// catch
		for (var i = 0; i < this._catchStatements.length; ++i) {
			context.blockStack.push(new BlockContext(context.getTopBlock().localVariableStatuses.clone(), this._catchStatements[i]));
			var lvStatusesAfterCatch = null : LocalVariableStatuses;
			try {
				if (! this._catchStatements[i].analyze(context))
					return false;
				lvStatusesAfterCatch = context.getTopBlock().localVariableStatuses;
			} finally {
				context.blockStack.pop();
			}
			lvStatusesAfterTryCatch = lvStatusesAfterTryCatch.merge(lvStatusesAfterCatch);
			var curCatchType = this._catchStatements[i].getLocal().getType();
			for (var j = 0; j < i; ++j) {
				var precCatchType = this._catchStatements[j].getLocal().getType();
				if (curCatchType.isConvertibleTo(precCatchType)) {
					context.errors.push(new CompileError(
						this._catchStatements[i]._token,
						"code is unreachable, a broader catch statement for type '" + precCatchType.toString() + "' already exists"));
					return false;
				}
			}
		}
		// finally
		context.blockStack.push(new BlockContext(context.getTopBlock().localVariableStatuses.merge(lvStatusesAfterTryCatch), this));
		var lvStatusesAfterFinally = null : LocalVariableStatuses;
		try {
			for (var i = 0; i < this._finallyStatements.length; ++i)
				if (! this._finallyStatements[i].analyze(context))
					return false;
			lvStatusesAfterFinally = context.getTopBlock().localVariableStatuses;
		} finally {
			context.blockStack.pop();
		}
		context.getTopBlock().localVariableStatuses = lvStatusesAfterTryCatch.mergeFinally(lvStatusesAfterFinally);
		return true;
	}

	override function forEachStatement (cb : function(:Statement,:function(:Statement):void):boolean) : boolean {
		if (! Util.forEachStatement(cb, this._tryStatements))
			return false;
		if (! Util.forEachStatement(cb, this._catchStatements.map.<Statement>((s) -> { return s; })))
			return false;
		if (! Util.forEachStatement(cb, this._finallyStatements))
			return false;
		return true;
	}

	override function handleStatements (cb : function(:Statement[]):boolean) : boolean {
		if (! cb(this._tryStatements))
			return false;
		if (! cb(this._catchStatements.map.<Statement>((s) -> { return s; })))
			return false;
		if (! cb(this._finallyStatements))
			return false;
		return true;
	}

	override function forEachExpression (cb : function(:Expression,:function(:Expression):void):boolean) : boolean {
		return true;
	}

}

class CatchStatement extends Statement implements Block {

	var _token : Token;
	var _local : CaughtVariable;
	var _statements : Statement[];

	function constructor (token : Token, local : CaughtVariable, statements : Statement[]) {
		super();
		this._token = token;
		this._local = local;
		this._statements = statements;
	}

	override function clone () : Statement {
		// TODO rewrite the references from _statements to _local
		return new CatchStatement(this._token, this._local, Util.cloneArray(this._statements));
	}

	override function getToken () : Token {
		return this._token;
	}

	function getLocal () : CaughtVariable {
		return this._local;
	}

	function setLocal (local : CaughtVariable) : void {
		// NOTE: does not rewrite the references to the local from the statements within
		this._local = local;
	}

	function getStatements () : Statement[] {
		return this._statements;
	}

	override function serialize () : variant {
		return [
			"CatchStatement",
			this._token.serialize(),
			this._local.serialize(),
			Util.serializeArray(this._statements)
		] : variant[];
	}

	override function doAnalyze (context : AnalysisContext) : boolean {
		// check the catch type
		var catchType = this.getLocal().getType();
		if (! (catchType instanceof ObjectType || catchType.equals(Type.variantType))) {
			context.errors.push(new CompileError(this._token, "only objects or a variant may be caught"));
		}
		// analyze the statements
		for (var i = 0; i < this._statements.length; ++i) {
			if (! this._statements[i].analyze(context))
				return false;
		}
		return true;
	}

	override function forEachStatement (cb : function(:Statement,:function(:Statement):void):boolean) : boolean {
		return Util.forEachStatement(cb, this._statements);
	}

	override function handleStatements (cb : function(:Statement[]):boolean) : boolean {
		return cb(this._statements);
	}

	override function forEachExpression (cb : function(:Expression,:function(:Expression):void):boolean) : boolean {
		return true;
	}

}

class ThrowStatement extends Statement {

	var _token : Token;
	var _expr : Expression;

	function constructor (token : Token, expr : Expression) {
		super();
		this._token = token;
		this._expr = expr;
	}

	override function clone () : Statement {
		return new ThrowStatement(this._token, this._expr.clone());
	}

	override function getToken () : Token {
		return this._token;
	}

	function getExpr () : Expression {
		return this._expr;
	}

	override function serialize () : variant {
		return [
			"ThrowStatement",
			this._token.serialize(),
			this._expr.serialize()
		] : variant[];
	}

	override function doAnalyze (context : AnalysisContext) : boolean {
		if (! this._analyzeExpr(context, this._expr))
			return true;
		var errorClassDef = context.parser.lookup(context.errors, this._token, "Error");
		if (errorClassDef == null)
			throw new Error("could not find definition for Error");
		if (this._expr.getType().equals(Type.voidType)) {
			context.errors.push(new CompileError(this._token, "cannot throw 'void'"));
			return true;
		}
		context.getTopBlock().localVariableStatuses.setIsReachable(false);
		return true;
	}

	override function forEachExpression (cb : function(:Expression,:function(:Expression):void):boolean) : boolean {
		if (! cb(this._expr, function (expr) { this._expr = expr; }))
			return false;
		return true;
	}

}

// information statements

abstract class InformationStatement extends Statement {

	var _token : Token;

	function constructor (token : Token) {
		super();
		this._token = token;
	}

	override function getToken () : Token {
		return this._token;
	}

}

class AssertStatement extends InformationStatement {

	var _expr : Expression;
	var _msgExpr : Expression;

	function constructor (token : Token, expr : Expression, msgExpr : Expression) {
		super(token);
		this._expr = expr;
		this._msgExpr = msgExpr;
	}

	override function clone () : Statement {
		return new AssertStatement(this._token, this._expr.clone(), Util.cloneNullable(this._msgExpr));
	}

	function getExpr () : Expression {
		return this._expr;
	}

	function getMessageExpr () : Expression {
		return this._msgExpr;
	}

	override function serialize () : variant {
		return [
			"AssertStatement",
			this._token.serialize(),
			Util.serializeNullable(this._expr),
			Util.serializeNullable(this._msgExpr)
		] : variant[];
	}

	override function doAnalyze (context : AnalysisContext) : boolean {
		if (! this._analyzeExpr(context, this._expr))
			return true;
		var exprType = this._expr.getType();
		if (exprType.equals(Type.voidType))
			context.errors.push(new CompileError(this._expr.getToken(), "argument of the assert statement cannot be void"));
		if (this._msgExpr != null) {
			if (! this._analyzeExpr(context, this._msgExpr))
				return true;
			var msgExprType = this._msgExpr.getType();
			if (! msgExprType.equals(Type.stringType))
				context.errors.push(new CompileError(this._msgExpr.getToken(), "message expression of the assert statement must be of string type"));
		}
		return true;
	}

	override function forEachExpression (cb : function(:Expression,:function(:Expression):void):boolean) : boolean {
		if (! cb(this._expr, function (expr) { this._expr = expr; }))
			return false;
		if (this._msgExpr != null && ! cb(this._msgExpr, function (expr) { this._msgExpr = expr; }))
			return false;
		return true;
	}

}

class LogStatement extends InformationStatement {

	var _exprs : Expression[];

	function constructor (token : Token, exprs : Expression[]) {
		super(token);
		this._exprs = exprs;
	}

	override function clone () : Statement {
		return new LogStatement(this._token, Util.cloneArray(this._exprs));
	}

	function getExprs () : Expression[] {
		return this._exprs;
	}

	override function serialize () : variant {
		return [
			"LogStatement",
			this._token.serialize(),
			Util.serializeArray(this._exprs)
		] : variant[];
	}

	override function doAnalyze (context : AnalysisContext) : boolean {
		for (var i = 0; i < this._exprs.length; ++i) {
			if (! this._analyzeExpr(context, this._exprs[i]))
				return true;
			var exprType = this._exprs[i].getType();
			if (exprType == null)
				return true;
			if (exprType.equals(Type.voidType)) {
				context.errors.push(new CompileError(this._token, "cannot log a void expression"));
				break;
			}
		}
		return true;
	}

	override function forEachExpression (cb : function(:Expression,:function(:Expression):void):boolean) : boolean {
		return Util.forEachExpression(cb, this._exprs);
	}

}

class DebuggerStatement extends InformationStatement {

	function constructor (token : Token) {
		super(token);
	}

	override function clone () : Statement {
		return new DebuggerStatement(this._token);
	}

	override function serialize () : variant {
		return [
			"DebuggerStatement",
			this._token.serialize()
		] : variant[];
	}

	override function doAnalyze (context : AnalysisContext) : boolean {
		return true;
	}

	override function forEachExpression (cb : function(:Expression,:function(:Expression):void):boolean) : boolean {
		return true;
	}

}

// GotoStatement and LabelStatement are used by code transformer

class GotoStatement extends Statement {

	var _label : string;
	var _id : int;

	function constructor(label : string) {
		this._label = label;
		this._id = -1;
	}

	function getLabel () : string {
		return this._label;
	}

	function setLabel (label : string) : void {
		this._label = label;
	}

	function getID () : int {
		return this._id;
	}

	function setID (id : int) : void {
		this._id = id;
	}

	override function getToken() : Token {
		return null;
	}

	override function clone() : Statement {
		return new GotoStatement(this._label);
	}

	override function serialize():variant {
		return null;
	}

	override function doAnalyze(context : AnalysisContext) : boolean {
		return true;
	}

	override function forEachExpression(cb : (Expression, (Expression) -> void) -> boolean) : boolean {
		return true;
	}

}

class LabelStatement extends Statement {

	var _name : string;
	var _id : int;

	function constructor(name : string) {
		this._name = name;
		this._id = -1;
	}

	function getName () : string {
		return this._name;
	}

	function getID () : int {
		return this._id;
	}

	function setID (id : int) : void {
		this._id = id;
	}

	override function getToken() : Token {
		return null;
	}

	override function clone() : Statement {
		return new LabelStatement(this._name);
	}

	override function serialize():variant {
		return null;
	}

	override function doAnalyze(context : AnalysisContext) : boolean {
		return true;
	}

	override function forEachExpression(cb : (Expression, (Expression) -> void) -> boolean) : boolean {
		return true;
	}
}
