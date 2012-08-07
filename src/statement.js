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

var Class = require("./Class");
eval(Class.$import("./classdef"));
eval(Class.$import("./expression"));
eval(Class.$import("./type"));
eval(Class.$import("./util"));

"use strict";

var Statement = exports.Statement = Class.extend({

	constructor: function () {
		// FIXME clone the stash the right way
		this._optimizerStash = {};
	},

	// returns whether or not to continue analysing the following statements
	analyze: function (context) {
		var Parser = require("./parser");
		if (! (this instanceof CaseStatement || this instanceof DefaultStatement))
			if (! Statement.assertIsReachable(context, this.getToken()))
				return false;
		try {
			return this.doAnalyze(context);
		} catch (e) {
			var token = this.getToken();
			console.error("fatal error while compiling statement" + (token instanceof Parser.Token ? " at file " + token.getFilename() + ", line " + token.getLineNumber() : ""));
			throw e;
		}
	},

	forEachStatement: function (cb) {
		return true;
	},

	handleStatements: function (cb) {
		return true;
	},

	clone: null, // function clone() : Statement

	forEachExpression: null, // function forEachExpression(cb : function (expr, replaceCb) : boolean) : boolean

	getToken: null, // returns a token of the statement

	serialize: null,

	doAnalyze: null, // void doAnalyze(context), returns whether or not to continue analysing the following statements

	_analyzeExpr: function (context, expr) {
		if (context.statement != null)
			throw new Error("logic flaw");
		context.statement = this;
		try {
			return expr.analyze(context, null);
		} finally {
			context.statement = null;
		}
	},

	getOptimizerStash: function () {
		return this._optimizerStash;
	},

	$assertIsReachable: function (context, token) {
		if (context.getTopBlock().localVariableStatuses == null) {
			context.errors.push(new CompileError(token, "the code is unreachable"));
			return false;
		}
		return true;
	}

});

var ConstructorInvocationStatement = exports.ConstructorInvocationStatement = Statement.extend({

	constructor: function (token, ctorClassType, args, ctorFunctionType /* optional */) {
		Statement.prototype.constructor.call(this);
		this._token = token;
		this._ctorClassType = ctorClassType;
		this._args = args;
		this._ctorFunctionType = ctorFunctionType != null ? ctorFunctionType : null;
	},

	clone: function () {
		return new ConstructorInvocationStatement(this._token, this._ctorClassType, Util.cloneArray(this._args), this._ctorFunctionType);
	},

	instantiate: function (instantiationContext) {
		if (this._ctorFunctionType != null) {
			throw new Error("instantiation after analysis?");
		}
		return new ConstructorInvocationStatement(
			this._token,
			this._ctorClassType.instantiate(instantiationContext),
			Util.cloneArray(this._args),
			null);
	},

	getToken: function () {
		return this._token;
	},

	getArguments: function () {
		return this._args;
	},

	getConstructingClassDef: function () {
		return this._ctorClassType.getClassDef();
	},

	getConstructorType: function () {
		return this._ctorFunctionType;
	},

	serialize: function () {
		return [
			"ConstructorInvocationStatement",
			this._ctorClassType.serialize(),
			Util.serializeArray(this._args)
		];
	},

	doAnalyze: function (context) {
		var ctorType = this.getConstructingClassDef().getMemberTypeByName(context.errors, this._token, "constructor", false, [], ClassDefinition.GET_MEMBER_MODE_CLASS_ONLY);
		if (ctorType == null) {
			if (this._args.length != 0) {
				context.errors.push(new CompileError(this.getToken().getToken(), "no function with matching arguments"));
				return true;
			}
			ctorType = new ResolvedFunctionType(Type.voidType, [], false); // implicit constructor
		} else {
			// analyze args
			var argTypes = Util.analyzeArgs(
				context, this._args, null,
				ctorType.getExpectedCallbackTypes(this._args.length, false));
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
	},

	forEachExpression: function (cb) {
		if (! Util.forEachExpression(cb, this._args))
			return false;
		return true;
	}

});

// statements that take one expression

var UnaryExpressionStatement = exports.UnaryExpressionStatement = Statement.extend({

	constructor: function (expr) {
		Statement.prototype.constructor.call(this);
		if (expr == null)
			throw new Error("logic flaw");
		this._expr = expr;
	},

	getToken: function () {
		return this._expr.getToken();
	},

	getExpr: function () {
		return this._expr;
	},

	setExpr: function (expr) {
		this._expr = expr;
	},

	doAnalyze: function (context) {
		this._analyzeExpr(context, this._expr);
		return true;
	},

	forEachExpression: function (cb) {
		if (! cb(this._expr, function (expr) { this._expr = expr; }.bind(this)))
			return false;
		return true;
	}

});

var ExpressionStatement = exports.ExpressionStatement = UnaryExpressionStatement.extend({

	constructor: function (expr) {
		UnaryExpressionStatement.prototype.constructor.call(this, expr);
	},

	clone: function () {
		return new ExpressionStatement(this._expr.clone());
	},

	serialize: function () {
		return [
			"ExpressionStatement",
			this._expr.serialize()
		];
	}

});

var ReturnStatement = exports.ReturnStatement = Statement.extend({

	constructor: function (token, expr) {
		Statement.prototype.constructor.call(this);
		this._token = token;
		this._expr = expr; // nullable
	},

	clone: function () {
		return new ReturnStatement(this._token, Util.cloneNullable(this._expr));
	},

	getToken: function () {
		return this._token;
	},

	getExpr: function () {
		return this._expr;
	},

	setExpr: function (expr) {
		this._expr = expr;
	},

	serialize: function () {
		return [
			"ReturnStatement",
			Util.serializeNullable(this._expr)
		];
	},

	doAnalyze: function (context) {
		var returnType = context.funcDef.getReturnType();
		if (returnType.equals(Type.voidType)) {
			// handle return(void);
			if (this._expr != null) {
				context.errors.push(new CompileError(this._token, "cannot return a value from a void function"));
				return true;
			}
		} else {
			// handle return of values
			if (this._expr == null) {
				context.errors.push(new CompileError(this._token, "cannot return void, the function is declared to return a value of type '" + returnType.toString() + "'"));
				return true;
			}
			if (this._expr instanceof FunctionExpression && ! this._expr.typesAreIdentified() && returnType instanceof StaticFunctionType) {
				if (! this._expr.getFuncDef().deductTypeIfUnknown(context, returnType))
					return false;
			}
			if (! this._analyzeExpr(context, this._expr))
				return true;
			var exprType = this._expr != null ? this._expr.getType() : Type.voidType;
			if (exprType == null)
				return true;
			if (! exprType.isConvertibleTo(returnType)) {
				context.errors.push(new CompileError(this._token, "cannot convert '" + exprType.toString() + "' to return type '" + returnType.toString() + "'"));
				return false;
			}
		}
		context.getTopBlock().localVariableStatuses = null;
		return true;
	},

	forEachExpression: function (cb) {
		if (this._expr != null && ! cb(this._expr, function (expr) { this._expr = expr; }.bind(this)))
			return false;
		return true;
	}

});

var DeleteStatement = exports.DeleteStatement = UnaryExpressionStatement.extend({

	constructor: function (token, expr) {
		UnaryExpressionStatement.prototype.constructor.call(this, expr);
		this._token = token;
	},

	clone: function () {
		return new DeleteStatement(this._token, this._expr.clone());
	},

	getToken: function () {
		return this._token;
	},

	serialize: function () {
		return [
			"DeleteStatement",
			this._expr.serialize()
		];
	},

	doAnalyze: function (context) {
		if (! this._analyzeExpr(context, this._expr))
			return true;
		if (! (this._expr instanceof ArrayExpression)) {
			context.errors.push(new CompileError(this._token, "only properties of a hash object can be deleted"));
			return true;
		}
		var secondExprType = this._expr.getSecondExpr().getType();
		if (secondExprType == null)
			return true; // error should have been already reported
		if (! secondExprType.resolveIfNullable().equals(Type.stringType)) {
			context.errors.push(new CompileError(this._token, "only properties of a hash object can be deleted"));
			return true;
		}
		return true;
	}

});

// break and continue

var JumpStatement = exports.JumpStatement = Statement.extend({

	constructor: function (token, label) {
		Statement.prototype.constructor.call(this);
		this._token = token;
		this._label = label;
	},

	getToken: function () {
		return this._token;
	},

	getLabel: function () {
		return this._label;
	},

	serialize: function () {
		return [
			this._getName(),
			this._token.serialize(),
			Util.serializeNullable(this._label)
		];
	},

	doAnalyze: function (context) {
		var targetBlock = this._determineDestination(context);
		if (targetBlock == null)
			return true;
		if (this instanceof BreakStatement)
			targetBlock.statement.registerVariableStatusesOnBreak(context.getTopBlock().localVariableStatuses);
		else
			targetBlock.statement.registerVariableStatusesOnContinue(context.getTopBlock().localVariableStatuses);
		context.getTopBlock().localVariableStatuses = null;
		return true;
	},

	_determineDestination: function (context) {
		for (var i = context.blockStack.length - 1; ! (context.blockStack[i].statement instanceof MemberFunctionDefinition); --i) {
			var statement = context.blockStack[i].statement;
			// continue unless we are at the destination level
			if (! (statement instanceof LabellableStatement))
				continue;
			if (this._label != null) {
				var statementLabel = statement.getLabel();
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
	},

	forEachExpression: function (cb) {
		return true;
	}

});

var BreakStatement = exports.BreakStatement = JumpStatement.extend({

	constructor: function (token, label) {
		JumpStatement.prototype.constructor.call(this, token, label);
	},

	clone: function () {
		return new BreakStatement(this._token, this._label);
	},

	_getName: function () {
		return "BreakStatement";
	},

	forEachExpression: function (cb) {
		return true;
	}

});

var ContinueStatement = exports.ContinueStatement = JumpStatement.extend({

	constructor: function (token, label) {
		JumpStatement.prototype.constructor.call(this, token, label);
	},

	clone: function () {
		return new ContinueStatement(this._token, this._label);
	},

	_getName: function () {
		return "ContinueStatement";
	},

	forEachExpression: function (cb) {
		return true;
	}

});

// control flow statements

var LabellableStatement = exports.LabellableStatement = Statement.extend({

	constructor: function (token, label) {
		Statement.prototype.constructor.call(this);
		this._token = token;
		this._label = label;
	},

	getToken: function () {
		return this._token;
	},

	getLabel: function () {
		return this._label;
	},

	_serialize: function () {
		return [
			Util.serializeNullable(this._label)
		];
	},

	_prepareBlockAnalysis: function (context) {
		context.blockStack.push(new BlockContext(context.getTopBlock().localVariableStatuses.clone(), this));
		this._lvStatusesOnBreak = null;
	},

	_abortBlockAnalysis: function (context) {
		context.blockStack.pop();
		this._lvStatusesOnBreak = null;
	},

	_finalizeBlockAnalysis: function (context) {
		context.blockStack.pop();
		context.getTopBlock().localVariableStatuses = this._lvStatusesOnBreak;
		this._lvStatusesOnBreak = null;
	},

	registerVariableStatusesOnBreak: function (statuses) {
		if (statuses != null) {
			if (this._lvStatusesOnBreak == null)
				this._lvStatusesOnBreak = statuses.clone();
			else
				this._lvStatusesOnBreak = this._lvStatusesOnBreak.merge(statuses);
		}
	}

});

var ContinuableStatement = exports.ContinuableStatement = LabellableStatement.extend({

	constructor: function (token, label, statements) {
		LabellableStatement.prototype.constructor.call(this, token, label);
		this._statements = statements;
	},

	getStatements: function () {
		return this._statements;
	},

	forEachStatement: function (cb) {
		if (! Util.forEachStatement(cb, this._statements))
			return false;
		return true;
	},

	handleStatements: function (cb) {
		if (! cb(this._statements))
			return false;
		return true;
	},

	_prepareBlockAnalysis: function (context) {
		LabellableStatement.prototype._prepareBlockAnalysis.call(this, context);
		this._lvStatusesOnContinue = null;
	},

	_abortBlockAnalysis: function (context) {
		LabellableStatement.prototype._abortBlockAnalysis.call(this, context);
		this._lvStatusesOnContinue = null;
	},

	_finalizeBlockAnalysis: function (context) {
		LabellableStatement.prototype._finalizeBlockAnalysis.call(this, context);
		this._restoreContinueVariableStatuses(context);
	},

	_restoreContinueVariableStatuses: function (context) {
		if (this._lvStatusesOnContinue != null) {
			if (context.getTopBlock().localVariableStatuses != null)
				context.getTopBlock().localVariableStatuses = context.getTopBlock().localVariableStatuses.merge(this._lvStatusesOnContinue);
			else
				context.getTopBlock().localVariableStatuses = this._lvStatusesOnContinue;
			this._lvStatusesOnContinue = null;
		}
	},

	registerVariableStatusesOnContinue: function (statuses) {
		if (statuses != null) {
			if (this._lvStatusesOnContinue == null)
				this._lvStatusesOnContinue = statuses.clone();
			else
				this._lvStatusesOnContinue = this._lvStatusesOnContinue.merge(statuses);
		}
	}

});

var DoWhileStatement = exports.DoWhileStatement = ContinuableStatement.extend({

	constructor: function (token, label, expr, statements) {
		ContinuableStatement.prototype.constructor.call(this, token, label, statements);
		this._expr = expr;
	},

	clone: function () {
		return new DoWhileStatement(this._token, this._label, this._expr.clone(), Util.cloneArray(this._statements));
	},

	getExpr: function () {
		return this._expr;
	},

	serialize: function () {
		return [
			"DoWhileStatement"
		].concat(this._serialize()).concat([
			this._expr.serialize(),
			Util.serializeArray(this._statements)
		]);
	},

	doAnalyze: function (context) {
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
		} catch (e) {
			this._abortBlockAnalysis(context);
			throw e;
		}
		return true;
	},

	forEachExpression: function (cb) {
		if (! cb(this._expr, function (expr) { this._expr = expr; }.bind(this)))
			return false;
		return true;
	}

});

var ForInStatement = exports.ForInStatement = ContinuableStatement.extend({

	constructor: function (token, label, lhsExpr, listExpr, statements) {
		ContinuableStatement.prototype.constructor.call(this, token, label, statements);
		this._lhsExpr = lhsExpr;
		this._listExpr = listExpr;
	},

	clone: function () {
		return new ForInStatement(this._token, this._label, this._lhsExpr.clone(), this._listExpr.clone(), Util.cloneArray(this._statements));
	},

	getLHSExpr: function () {
		return this._lhsExpr;
	},

	getListExpr: function () {
		return this._listExpr;
	},

	getStatements: function () {
		return this._statements;
	},

	serialize: function () {
		return [
			"ForInStatement",
		].concat(this._serialize()).concat([
			this._lhsExpr.serialize(),
			this._listExpr.serialize(),
			Util.serializeArray(this._statements)
		]);
	},

	doAnalyze: function (context) {
		if (! this._analyzeExpr(context, this._listExpr))
			return true;
		var listType = this._listExpr.getType().resolveIfNullable();
		var listClassDef;
		var listTypeName;
		if (listType instanceof ObjectType
			&& (listClassDef = listType.getClassDef()) instanceof InstantiatedClassDefinition
			&& ((listTypeName = listClassDef.getTemplateClassName()) == "Array" || listTypeName == "Map")) {
			// ok
		} else {
			context.errors.push(new CompileError(this.getToken(), "list expression of the for..in statement should be an array or a map"));
			return true;
		}
		this._prepareBlockAnalysis(context);
		try {
			this._analyzeExpr(context, this._lhsExpr);
			if (! this._lhsExpr.assertIsAssignable(context, this._token, listTypeName == "Array" ? Type.numberType : Type.stringType))
				return false;
			for (var i = 0; i < this._statements.length; ++i)
				if (! this._statements[i].analyze(context))
					return false;
			this.registerVariableStatusesOnContinue(context.getTopBlock().localVariableStatuses);
			this._finalizeBlockAnalysis(context);
		} catch (e) {
			this._abortBlockAnalysis(context);
			throw e;
		}
		return true;
	},

	forEachExpression: function (cb) {
		if (! cb(this._lhsExpr, function (expr) { this._lhsExpr = expr; }.bind(this)))
			return false;
		if (! cb(this._listExpr, function (expr) { this._listExpr = expr; }.bind(this)))
			return false;
		return true;
	}

});

var ForStatement = exports.ForStatement = ContinuableStatement.extend({

	constructor: function (token, label, initExpr, condExpr, postExpr, statements) {
		ContinuableStatement.prototype.constructor.call(this, token, label, statements);
		this._initExpr = initExpr; // nullable
		this._condExpr = condExpr; // nullable
		this._postExpr = postExpr; // nullable
	},

	clone: function () {
		return new ForStatement(this._token, this._label, Util.cloneNullable(this._initExpr), Util.cloneNullable(this._condExpr), Util.cloneNullable(this._postExpr), Util.cloneArray(this._statements));
	},

	getInitExpr: function () {
		return this._initExpr;
	},

	setInitExpr: function (expr) {
		this._initExpr = expr;
	},

	getCondExpr: function () {
		return this._condExpr;
	},

	getPostExpr: function () {
		return this._postExpr;
	},

	getStatements: function () {
		return this._statements;
	},

	serialize: function () {
		return [
			"ForStatement",
		].concat(this._serialize()).concat([
			Util.serializeNullable(this._initExpr),
			Util.serializeNullable(this._condExpr),
			Util.serializeNullable(this._postExpr),
			Util.serializeArray(this._statements)
		]);
	},

	doAnalyze: function (context) {
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
				this.registerVariableStatusesOnBreak(context.getTopBlock().localVariableStatuses);
			}
			this._finalizeBlockAnalysis(context);
		} catch (e) {
			this._abortBlockAnalysis(context);
			throw e;
		}
		return true;
	},

	forEachExpression: function (cb) {
		if (this._initExpr != null && ! cb(this._initExpr, function (expr) { this._initExpr = expr; }.bind(this)))
			return false;
		if (this._condExpr != null && ! cb(this._condExpr, function (expr) { this._condExpr = expr; }.bind(this)))
			return false;
		if (this._postExpr != null && ! cb(this._postExpr, function (expr) { this._postExpr = expr; }.bind(this)))
			return false;
		return true;
	}

});

var IfStatement = exports.IfStatement = Statement.extend({

	constructor: function (token, expr, onTrueStatements, onFalseStatements) {
		Statement.prototype.constructor.call(this);
		this._token = token;
		this._expr = expr;
		this._onTrueStatements = onTrueStatements;
		this._onFalseStatements = onFalseStatements;
	},

	clone: function () {
		return new IfStatement(this._token, this._expr.clone(), Util.cloneArray(this._onTrueStatements), Util.cloneArray(this._onFalseStatements));
	},

	getToken: function () {
		return this._token;
	},

	getExpr: function () {
		return this._expr;
	},

	setExpr: function (expr) {
		this._expr = expr;
	},

	getOnTrueStatements: function () {
		return this._onTrueStatements;
	},

	getOnFalseStatements: function () {
		return this._onFalseStatements;
	},

	serialize: function () {
		return [
			"IfStatement",
			this._expr.serialize(),
			Util.serializeArray(this._onTrueStatements),
			Util.serializeArray(this._onFalseStatements)
		];
	},

	doAnalyze: function (context) {
		if (this._analyzeExpr(context, this._expr))
			if (this._expr.getType().resolveIfNullable().equals(Type.voidType))
				context.errors.push(new CompileError(this._expr.getToken(), "expression of the if statement should not return void"));
		// if the expr is true
		context.blockStack.push(new BlockContext(context.getTopBlock().localVariableStatuses.clone(), this));
		try {
			for (var i = 0; i < this._onTrueStatements.length; ++i)
				if (! this._onTrueStatements[i].analyze(context))
					return false;
			var lvStatusesOnTrueStmts = context.getTopBlock().localVariableStatuses;
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
		if (lvStatusesOnTrueStmts != null)
			if (lvStatusesOnFalseStmts != null)
				context.getTopBlock().localVariableStatuses = lvStatusesOnTrueStmts.merge(lvStatusesOnFalseStmts);
			else
				context.getTopBlock().localVariableStatuses = lvStatusesOnTrueStmts;
		else
			context.getTopBlock().localVariableStatuses = lvStatusesOnFalseStmts;
		return true;
	},

	forEachStatement: function (cb) {
		if (! Util.forEachStatement(cb, this._onTrueStatements))
			return false;
		if (! Util.forEachStatement(cb, this._onFalseStatements))
			return false;
		return true;
	},

	handleStatements: function (cb) {
		if (! cb(this._onTrueStatements))
			return false;
		if (! cb(this._onFalseStatements))
			return false;
		return true;
	},

	forEachExpression: function (cb) {
		if (! cb(this._expr, function (expr) { this._expr = expr; }.bind(this)))
			return false;
		return true;
	}

});

var SwitchStatement = exports.SwitchStatement = LabellableStatement.extend({

	constructor: function (token, label, expr, statements) {
		LabellableStatement.prototype.constructor.call(this, token, label);
		this._expr = expr;
		this._statements = statements;
	},

	clone: function () {
		return new SwitchStatement(this._token, this._label, this._expr.clone(), Util.cloneARray(this._statements));
	},

	getExpr: function () {
		return this._expr;
	},

	setExpr: function (expr) {
		this._expr = expr;
	},

	getStatements: function () {
		return this._statements;
	},

	serialize: function () {
		return [
			"SwitchStatement",
		].concat(this._serialize()).concat([
			this._expr.serialize(),
			Util.serializeArray(this._statements)
		]);
	},

	doAnalyze: function (context) {
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
			for (var i = 0; i < this._statements.length; ++i) {
				var statement = this._statements[i];
				if (! statement.analyze(context))
					return false;
				if (statement instanceof DefaultStatement)
					hasDefaultLabel = true;
			}
			if (! hasDefaultLabel)
				this.registerVariableStatusesOnBreak(context.blockStack[context.blockStack.length - 2].localVariableStatuses);
			this._finalizeBlockAnalysis(context);
		} catch (e) {
			this._abortBlockAnalysis(context);
			throw e;
		}
		return true;
	},

	forEachStatement: function (cb) {
		if (! Util.forEachStatement(cb, this._statements))
			return false;
		return true;
	},

	handleStatements: function (cb) {
		if (! cb(this._statements))
			return false;
		return true;
	},

	forEachExpression: function (cb) {
		if (! cb(this._expr, function (expr) { this._expr = expr; }.bind(this)))
			return false;
		return true;
	},

	$resetLocalVariableStatuses: function (context) {
		context.getTopBlock().localVariableStatuses = context.blockStack[context.blockStack.length - 2].localVariableStatuses.clone();
	}

});

var CaseStatement = exports.CaseStatement = Statement.extend({

	constructor: function (token, expr) {
		Statement.prototype.constructor.call(this);
		this._token = token;
		this._expr = expr;
	},

	clone: function () {
		return new CaseStatement(this._token, this._expr.clone());
	},

	getToken: function () {
		return this._token;
	},

	getExpr: function () {
		return this._expr;
	},

	serialize: function () {
		return [
			"CaseStatement",
			this._expr.serialize()
		];
	},

	doAnalyze: function (context) {
		if (! this._analyzeExpr(context, this._expr))
			return true;
		var statement = context.getTopBlock().statement;
		if (! (statement instanceof SwitchStatement))
			throw new Error("logic flaw");
		var expectedType = statement.getExpr().getType();
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
			context.errors.push(new CompileError(this._token, "type mismatch; expected type was '" + expectedType.toString() + "' but got '" + exprType + "'"));
		}
		// reset local variable statuses
		SwitchStatement.resetLocalVariableStatuses(context);
		return true;
	},

	forEachExpression: function (cb) {
		if (! cb(this._expr, function (expr) { this._expr = expr; }.bind(this)))
			return false;
		return true;
	}

});

var DefaultStatement = exports.DefaultStatement = Statement.extend({

	constructor: function (token) {
		Statement.prototype.constructor.call(this);
		this._token = token;
	},

	clone: function () {
		return new DefaultStatement(this._token);
	},

	getToken: function () {
		return this._token;
	},

	serialize: function () {
		return [
			"DefaultStatement"
		];
	},

	doAnalyze: function (context) {
		SwitchStatement.resetLocalVariableStatuses(context);
		return true;
	},

	forEachExpression: function (cb) {
		return true;
	}

});

var WhileStatement = exports.WhileStatement = ContinuableStatement.extend({

	constructor: function (token, label, expr, statements) {
		ContinuableStatement.prototype.constructor.call(this, token, label, statements);
		this._expr = expr;
	},

	clone: function () {
		return new WhileStatement(this._token, this._label, this._expr.clone(), Util.cloneArray(this._statements));
	},

	getExpr: function () {
		return this._expr;
	},

	getStatements: function () {
		return this._statements;
	},

	serialize: function () {
		return [
			"WhileStatement",
		].concat(this._serialize()).concat([
			this._expr.serialize(),
			Util.serializeArray(this._statements)
		]);
	},

	doAnalyze: function (context) {
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
		} catch (e) {
			this._abortBlockAnalysis(context);
			throw e;
		}
		return true;
	},

	forEachExpression: function (cb) {
		if (! cb(this._expr, function (expr) { this._expr = expr; }.bind(this)))
			return false;
		return true;
	}

});

var TryStatement = exports.TryStatement = Statement.extend({

	constructor: function (token, tryStatements, catchStatements, finallyStatements) {
		Statement.prototype.constructor.call(this);
		this._token = token;
		this._tryStatements = tryStatements;
		this._catchStatements = catchStatements;
		this._finallyStatements = finallyStatements;
	},

	clone: function () {
		return new TryStatement(this._token, Util.cloneArray(this._tryStatements), Util.cloneArray(this._catchStatements), Util.cloneArray(this._finallyStatements));
	},

	getToken: function () {
		return this._token;
	},

	getTryStatements: function () {
		return this._tryStatements;
	},

	getCatchStatements: function () {
		return this._catchStatements;
	},

	getFinallyStatements: function () {
		return this._finallyStatements;
	},

	serialize: function () {
		return [
			"TryStatement",
			Util.serializeArray(this._tryStatements),
			Util.serializeNullable(this._catchIdentifier),
			Util.serializeArray(this._catchStatements),
			Util.serializeArray(this._finallyStatements)
		];
	},

	doAnalyze: function (context) {
		// try
		context.blockStack.push(new BlockContext(context.getTopBlock().localVariableStatuses.clone(), this));
		try {
			for (var i = 0; i < this._tryStatements.length; ++i)
				if (! this._tryStatements[i].analyze(context))
					return false;
			// change the statuses to may (since they might be left uninitialized due to an exception)
			var lvStatusesAfterTry = context.getTopBlock().localVariableStatuses;
		} finally {
			context.blockStack.pop();
		}
		context.getTopBlock().localVariableStatuses = context.getTopBlock().localVariableStatuses.merge(lvStatusesAfterTry);
		// catch
		for (var i = 0; i < this._catchStatements.length; ++i) {
			if (! this._catchStatements[i].analyze(context))
				return false;
		}
		// finally
		for (var i = 0; i < this._finallyStatements.length; ++i)
			if (! this._finallyStatements[i].analyze(context))
				return false;
		return true;
	},

	forEachStatement: function (cb) {
		if (! Util.forEachStatement(cb, this._tryStatements))
			return false;
		if (! Util.forEachStatement(cb, this._catchStatements))
			return false;
		if (! Util.forEachStatement(cb, this._finallyStatements))
			return false;
		return true;
	},

	handleStatements: function (cb) {
		if (! cb(this._tryStatements))
			return false;
		if (! cb(this._catchStatements))
			return false;
		if (! cb(this._finallyStatements))
			return false;
		return true;
	},

	forEachExpression: function (cb) {
		return true;
	}

});

var CatchStatement = exports.CatchStatement = Statement.extend({

	constructor: function (token, local, statements) {
		Statement.prototype.constructor.call(this);
		this._token = token;
		this._local = local;
		this._statements = statements;
	},

	clone: function () {
		// TODO rewrite the references from _statements to _local
		return new CatchStatement(this._token, this._local.clone(), Util.cloneArray(this._statements));
	},

	getToken: function () {
		return this._token;
	},

	getLocal: function () {
		return this._local;
	},

	setLocal: function (local) {
		// NOTE: does not rewrite the references to the local from the statements within
		this._local = local;
	},

	getStatements: function () {
		return this._statements;
	},

	serialize: function () {
		return [
			"CatchStatement",
			this._token.serialize(),
			this._local.serialize(),
			Util.serializeArray(this._statements)
		];
	},

	doAnalyze: function (context) {
		// check the catch type
		var catchType = this.getLocal().getType();
		if (catchType instanceof ObjectType || catchType.equals(Type.variantType)) {
			for (var j = 0; j < i; ++j) {
				var prevCatchType = this._catchStatements[j].getLocal().getType();
				if (catchType.isConvertibleTo(prevCatchType)) {
					context.errors.push(new CompileError(
						this._token,
						"code is unreachable, a broader catch statement for type '" + prevCatchType.toString() + "' already exists"));
					break;
				}
			}
		} else {
			context.errors.push(new CompileError(this._token, "only objects or a variant may be caught"));
		}
		// analyze the statements
		context.blockStack.push(new BlockContext(context.getTopBlock().localVariableStatuses.clone(), this));
		try {
			for (var i = 0; i < this._statements.length; ++i) {
				if (! this._statements[i].analyze(context))
					return false;
			}
			var lvStatusesAfterCatch = context.getTopBlock().localVariableStatuses;
		} finally {
			context.blockStack.pop();
		}
		if (lvStatusesAfterCatch != null)
			context.getTopBlock().localVariableStatuses = context.getTopBlock().localVariableStatuses.merge(lvStatusesAfterCatch);
		return true;
	},

	forEachStatement: function (cb) {
		return Util.forEachStatement(cb, this._statements);
	},

	handleStatements: function (cb) {
		return cb(this._statements);
	},

	forEachExpression: function (cb) {
		return true;
	}

});

var ThrowStatement = exports.ThrowStatement = Statement.extend({

	constructor: function (token, expr) {
		Statement.prototype.constructor.call(this);
		this._token = token;
		this._expr = expr;
	},

	clone: function () {
		return new ThrowStatement(this._token, this._expr.clone());
	},

	getToken: function () {
		return this._token;
	},

	getExpr: function () {
		return this._expr;
	},

	serialize: function () {
		return [
			"ThrowStatement",
			this._token.serialize(),
			this._expr.serialize()
		];
	},

	doAnalyze: function (context) {
		if (! this._analyzeExpr(context, this._expr))
			return true;
		var errorClassDef = context.parser.lookup(context.errors, this._token, "Error");
		if (errorClassDef == null)
			throw new Error("could not find definition for Error");
		if (this._expr.getType().equals(Type.voidType)) {
			context.errors.push(new CompileError(this._token, "cannot throw 'void'"));
			return true;
		}
		return true;
	},

	forEachExpression: function (cb) {
		if (! cb(this._expr, function (expr) { this._expr = expr; }.bind(this)))
			return false;
		return true;
	}

});

// information statements

var InformationStatement = exports.InformationStatement = Statement.extend({

	constructor: function (token) {
		Statement.prototype.constructor.call(this);
		this._token = token;
	},

	getToken: function () {
		return this._token;
	},

});

var AssertStatement = exports.AssertStatement = InformationStatement.extend({

	constructor: function (token, expr) {
		InformationStatement.prototype.constructor.call(this, token);
		this._expr = expr;
	},

	clone: function () {
		return new AssertStatement(this._token, this._expr.clone());
	},

	getExpr: function () {
		return this._expr;
	},

	serialize: function () {
		return [
			"AssertStatement",
			this._token.serialize(),
			Util.serializeArray(this._expr)
		];
	},

	doAnalyze: function (context) {
		if (! this._analyzeExpr(context, this._expr))
			return true;
		var exprType = this._expr.getType();
		if (exprType.equals(Type.voidType))
			context.errors.push(new CompileError(this._exprs[0].getToken(), "argument of the assert statement cannot be void"));
		return true;
	},

	forEachExpression: function (cb) {
		if (! cb(this._expr, function (expr) { this._expr = expr; }.bind(this)))
			return false;
		return true;
	}

});

var LogStatement = exports.LogStatement = InformationStatement.extend({

	constructor: function (token, exprs) {
		InformationStatement.prototype.constructor.call(this, token);
		this._exprs = exprs;
	},

	clone: function () {
		return new LogStatement(this._token, Util.cloneArray(this._exprs));
	},

	getExprs: function () {
		return this._exprs;
	},

	serialize: function () {
		return [
			"LogStatement",
			this._token.serialize(),
			Util.serializeArray(this._exprs)
		];
	},

	doAnalyze: function (context) {
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
	},

	forEachExpression: function (cb) {
		return Util.forEachExpression(cb, this._exprs);
	}

});

var DebuggerStatement = exports.DebuggerStatement = InformationStatement.extend({

	constructor: function (token) {
		InformationStatement.prototype.constructor.call(this, token);
	},

	clone: function () {
		return new DebuggerStatement(this._token);
	},

	serialize: function () {
		return [
			"DebuggerStatement",
			this._token.serialize()
		];
	},

	doAnalyze: function (context) {
		return true;
	},

	forEachExpression: function (cb) {
		return true;
	}

});
