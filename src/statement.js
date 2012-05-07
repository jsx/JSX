var Class = require("./Class");
eval(Class.$import("./classdef"));
eval(Class.$import("./expression"));
eval(Class.$import("./type"));
eval(Class.$import("./util"));

"use strict";

var Statement = exports.Statement = Class.extend({

	analyze: function (context) {
		try {
			this.doAnalyze(context);
		} catch (e) {
			var token = this.getToken();
			console.log("fatal error while compiling statement at file: " + token.getFilename() + ", line " + token.getLineNumber());
			throw e;
		}
	},

	getToken: null, // returns a token of the statement

	doAnalyze: null, // void doAnalyze(context)
	serialize: null
});

var ConstructorInvocationStatement = exports.ConstructorInvocationStatement = Statement.extend({

	constructor: function (qualifiedName, args) {
		this._qualifiedName = qualifiedName;
		this._args = args;
		this._ctorClassDef = null;
		this._ctorType = null;
	},

	getToken: function () {
		return this._qualifiedName.getToken();
	},

	serialize: function () {
		return [
			"ConstructorInvocationStatement",
			this._qualifiedName.serialize(),
			Util.serializeArray(this._args)
		];
	},

	getQualifiedName: function () {
		return this._qualifiedName;
	},

	getArguments: function () {
		return this._args;
	},

	getConstructingClassDef: function () {
		return this._ctorClassDef;
	},

	getConstructorType: function () {
		return this._ctorType;
	},

	doAnalyze: function (context) {
		if (this._qualifiedName.getImport() == null && this._qualifiedName.getToken().getValue() == "super") {
			this._ctorClassDef = context.funcDef.getClassDef().extendClassDef();
		} else {
			if ((this._ctorClassDef = this._qualifiedName.getClass(context)) == null) {
				// error should have been reported already
				return;
			}
		}
		// analyze args
		var argTypes = Util.analyzeArgs(context, this._args);
		if (argTypes == null) {
			// error is reported by callee
			return;
		}
		var ctorType = this._ctorClassDef.getMemberTypeByName("constructor", ClassDefinition.GET_MEMBER_MODE_CLASS_ONLY);
		if (ctorType == null) {
			if (this._args.length != 0) {
				context.errors.push(new CompileError(this._qualifiedName.getToken(), "no function with matching arguments"));
				return;
			}
		} else if ((ctorType = ctorType.deduceByArgumentTypes(context, this._qualifiedName.getToken(), argTypes, false)) == null) {
			// error is reported by callee
			return;
		}
		this._ctorType = ctorType;
	}

});

// statements that take one expression

var UnaryExpressionStatement = exports.UnaryExpressionStatement = Statement.extend({

	constructor: function (expr) {
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

	doAnalyze: function (context) {
		this._expr.analyze(context, null);
	}

});

var ExpressionStatement = exports.ExpressionStatement = UnaryExpressionStatement.extend({

	constructor: function (expr) {
		UnaryExpressionStatement.prototype.constructor.call(this, expr);
	},

	serialize: function () {
		return [
			"ExpressionStatement",
			this._expr.serialize()
		];
	}

});

var ReturnStatement = exports.ReturnStatement = UnaryExpressionStatement.extend({

	constructor: function (token, expr) {
		UnaryExpressionStatement.prototype.constructor.call(this, expr);
		this._token = token;
	},

	serialize: function () {
		return [
			"ReturnStatement",
			this._expr.serialize()
		];
	},

	doAnalyze: function (context) {
		if (! this._expr.analyze(context, null))
			return;
		var exprType = this._expr.getType();
		if (exprType == null)
			return;
		var returnType = context.funcDef.getReturnType();
		if (! exprType.isConvertibleTo(returnType))
			context.errors.push(new CompileError(this._token, "cannot convert '" + exprType.toString() + "' to return type '" + returnType.toString() + "'"));
	}

});

var DeleteStatement = exports.DeleteStatement = UnaryExpressionStatement.extend({

	constructor: function (token, expr) {
		UnaryExpressionStatement.prototype.constructor.call(this, expr);
		this._token = token;
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
		if (! this._expr.analyze(context, null))
			return;
		if (! (this._expr instanceof ArrayExpression)) {
			context.errors.push(new CompileError(this._token, "only properties of a hash object can be deleted"));
			return;
		}
		var secondExprType = this._expr.getSecondExpr().getType();
		if (secondExprType == null)
			return; // error should have been already reported
		if (! secondExprType.resolveIfMayBeUndefined().equals(Type.stringType)) {
			context.errors.push(new CompileError(this._token, "only properties of a hash object can be deleted"));
			return;
		}
	}

});

// break and continue

var JumpStatement = exports.JumpStatement = Statement.extend({

	constructor: function (token, label) {
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

	_determineDestination: function (context) {
		// find the destination by iterate to the one before the last, which is function scope
		for (var i = context.blockStack.length - 1; i > 0; --i) {
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
	}

});

var BreakStatement = exports.BreakStatement = JumpStatement.extend({

	constructor: function (token, label) {
		JumpStatement.prototype.constructor.call(this, token, label);
	},

	_getName: function () {
		return "BreakStatement";
	},

	doAnalyze: function (context) {
		var targetBlock = this._determineDestination(context);
		if (targetBlock == null)
			return;
		targetBlock.statement.registerVariableStatusesOnExit(context.getTopBlock().localVariableStatuses);
	}

});

var ContinueStatement = exports.ContinueStatement = JumpStatement.extend({

	constructor: function (token, label) {
		JumpStatement.prototype.constructor.call(this, token, label);
	},

	_getName: function () {
		return "ContinueStatement";
	},


	doAnalyze: function (context) {
		var targetBlock = this._determineDestination(context);
		if (targetBlock == null)
			return;
		targetBlock.statement.registerVariableStatusesOnExit(context.getTopBlock().localVariableStatuses);
	}

});

// control flow statements

var LabellableStatement = exports.LabellableStatement = Statement.extend({

	constructor: function (token, label) {
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
		this._lvStatusesOnExit = null;
	},

	_finalizeBlockAnalysis: function (context) {
		context.blockStack.pop();
		context.getTopBlock().localVariableStatuses = this._lvStatusesOnExit;
		this._lvStatusesOnExit = null;
	},

	registerVariableStatusesOnExit: function (statuses) {
		if (this._lvStatusesOnExit == null)
			this._lvStatusesOnExit = statuses.clone();
		else
			this._lvStatusesOnExit = this._lvStatusesOnExit.merge(statuses);
	}

});

var DoWhileStatement = exports.DoWhileStatement = LabellableStatement.extend({

	constructor: function (token, label, expr, statements) {
		LabellableStatement.prototype.constructor.call(this, token, label);
		this._expr = expr;
		this._statements = statements;
	},

	getExpr: function () {
		return this._expr;
	},

	getStatements: function () {
		return this._statements;
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
				this._statements[i].analyze(context);
			this._expr.analyze(context, null);
			this.registerVariableStatusesOnExit(context.getTopBlock().localVariableStatuses);
		} finally {
			this._finalizeBlockAnalysis(context);
		}
	}

});

var ForInStatement = exports.ForInStatement = LabellableStatement.extend({

	constructor: function (token, label, identifier, expr, statements) {
		LabellableStatement.prototype.constructor.call(this, token, label);
		this._identifier = identifier;
		this._expr = expr;
		this._statements = statements;
	},

	serialize: function () {
		return [
			"ForInStatement",
		].concat(this._serialize()).concat([
			this._identifier.serialize(),
			this._expr.serialize(),
			Util.serializeArray(this._statements)
		]);
	},

	doAnalyze: function (context) {
		this._expr.analyze(context, null);
		this._prepareBlockAnalysis(context);
		try {
			for (var i = 0; i < this._statements.length; ++i)
				this._statements[i].analyze(context);
			this.registerVariableStatusesOnExit(context.getTopBlock().localVariableStatuses);
		} finally {
			this._finalizeBlockAnalysis(context);
		}
	}

});

var ForStatement = exports.ForStatement = LabellableStatement.extend({

	constructor: function (token, label, initExpr, condExpr, postExpr, statements) {
		LabellableStatement.prototype.constructor.call(this, token, label);
		this._initExpr = initExpr;
		this._condExpr = condExpr;
		this._postExpr = postExpr;
		this._statements = statements;
	},

	getInitExpr: function () {
		return this._initExpr;
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
			this._initExpr.analyze(context, null);
		if (this._condExpr != null)
			this._condExpr.analyze(context, null);
		this._prepareBlockAnalysis(context);
		try {
			for (var i = 0; i < this._statements.length; ++i)
				this._statements[i].analyze(context);
			if (this._postExpr != null)
				this._postExpr.analyze(context, null);
			this.registerVariableStatusesOnExit(context.getTopBlock().localVariableStatuses);
		} finally {
			this._finalizeBlockAnalysis(context);
		}
	}

});

var IfStatement = exports.IfStatement = Statement.extend({

	constructor: function (token, expr, onTrueStatements, onFalseStatements) {
		this._token = token;
		this._expr = expr;
		this._onTrueStatements = onTrueStatements;
		this._onFalseStatements = onFalseStatements;
	},

	getToken: function () {
		return this._token;
	},

	getExpr: function () {
		return this._expr;
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
		this._expr.analyze(context, null);
		// if the expr is true
		var lvStatusesOnTrueStmts = context.getTopBlock().localVariableStatuses.clone();
		context.blockStack.push(new BlockContext(lvStatusesOnTrueStmts, this));
		try {
			for (var i = 0; i < this._onTrueStatements.length; ++i)
				this._onTrueStatements[i].analyze(context);
		} finally {
			context.blockStack.pop();
		}
		// if the expr is false
		var lvStatusesOnFalseStmts = context.getTopBlock().localVariableStatuses.clone();
		try {
			context.blockStack.push(new BlockContext(lvStatusesOnFalseStmts, this));
			for (var i = 0; i < this._onFalseStatements.length; ++i)
				this._onFalseStatements[i].analyze(context);
		} finally {
			context.blockStack.pop();
		}
		// merge the variable statuses
		context.getTopBlock().localVariableStatuses = lvStatusesOnTrueStmts.merge(lvStatusesOnFalseStmts);
	}

});

var SwitchStatement = exports.SwitchStatement = LabellableStatement.extend({

	constructor: function (token, label, expr, statements) {
		LabellableStatement.prototype.constructor.call(this, token, label);
		this._expr = expr;
		this._statements = statements;
	},

	getExpr: function () {
		return this._expr;
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
		if (! this._expr.analyze(context, null))
			return;
		var exprType = this._expr.getType();
		if (exprType == null)
			return;
		if (! (exprType.equals(Type.booleanType) || exprType.equals(Type.integerType) || exprType.equals(Type.numberType) || exprType.equals(Type.stringType))) {
			context.errors.push(new CompileError(this._token, "switch statement only accepts boolean, number, or string expressions"));
			return;
		}
		this._prepareBlockAnalysis(context);
		try {
			var hasDefaultLabel = false;
			for (var i = 0; i < this._statements.length; ++i) {
				var statement = this._statements[i];
				statement.analyze(context);
				if (statement instanceof DefaultStatement)
					hasDefaultLabel = true;
			}
			if (! hasDefaultLabel)
				this.registerVariableStatusesOnExit(context.blockStack[context.blockStack.length - 2].localVariableStatuses);
		} finally {
			this._finalizeBlockAnalysis(context);
		}
	},

	$resetLocalVariableStatuses: function (context) {
		context.getTopBlock().localVariableStatuses = context.blockStack[context.blockStack.length - 2].localVariableStatuses.clone();
	}

});

var CaseStatement = exports.CaseStatement = Statement.extend({

	constructor: function (token, expr) {
		this._token = token;
		this._expr = expr;
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
		if (! this._expr.analyze(context, null))
			return;
		var statement = context.getTopBlock().statement;
		if (! (statement instanceof SwitchStatement))
			throw new Error("logic flaw");
		var expectedType = statement.getExpr().getType();
		if (expectedType == null)
			return;
		var exprType = this._expr.getType();
		if (exprType == null)
			return;
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
	}

});

var DefaultStatement = exports.DefaultStatement = Statement.extend({

	constructor: function (token) {
		this._token = token;
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
	}

});

var WhileStatement = exports.WhileStatement = LabellableStatement.extend({

	constructor: function (token, label, expr, statements) {
		LabellableStatement.prototype.constructor.call(this, token, label);
		this._expr = expr;
		this._statements = statements;
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
		this._expr.analyze(context, null);
		this._prepareBlockAnalysis(context);
		try {
			for (var i = 0; i < this._statements.length; ++i)
				this._statements[i].analyze(context);
			this.registerVariableStatusesOnExit(context.getTopBlock().localVariableStatuses);
		} finally {
			this._finalizeBlockAnalysis(context);
		}
	}

});

var TryStatement = exports.TryStatement = Statement.extend({

	constructor: function (token, tryStatements, catchIdentifier, catchStatements, finallyStatements) {
		this._token = token;
		this._tryStatements = tryStatements;
		this._catchIdentifier = catchIdentifier; // FIXME type?
		this._catchStatements = catchStatements;
		this._finallyStatements = finallyStatements;
	},

	getToken: function () {
		return this._token;
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
		try {
			context.blockStack.push(new BlockContext(context.getTopBlock().localVariableStatuses.clone(), this));
			for (var i = 0; i < this._tryStatements.length; ++i)
				this._tryStatements[i].analyze(context);
		} finally {
			context.blockStack.pop();
		}
		if (this._catchStatements != null) {
			try {
				context.blockStack.push(new BlockContext(context.getTopBlock().localVariableStatuses.clone(), this));
				for (var i = 0; i < this._catchStatements.length; ++i)
					this._catchStatements[i].analyze(context);
			} finally {
				context.blockStack.pop();
			}
		}
		if (this._finallyStatements != null) {
			try {
				context.blockStack.push(new BlockContext(context.getTopBlock().localVariableStatuses.clone(), this));
				for (var i = 0; i < this._finallyStatements.length; ++i)
					this._finallyStatements[i].analyze(context);
			} finally {
				context.blockStack.pop();
			}
		}
	}

});

// information statements

var InformationStatement = exports.InformationStatement = Statement.extend({

	constructor: function (token, exprs) {
		this._token = token;
		this._exprs = exprs;
	},

	getToken: function () {
		return this._token;
	},

	getExprs: function () {
		return this._exprs;
	},

	_analyzeExprs: function (context) {
		for (var i = 0; i < this._exprs.length; ++i)
			if (! this._exprs[i].analyze(context, null))
				return false;
		return true;
	}

});

var AssertStatement = exports.AssertStatement = InformationStatement.extend({

	constructor: function (token, exprs) {
		InformationStatement.prototype.constructor.call(this, token, exprs);
	},

	serialize: function () {
		return [
			"AssertStatement",
			Util.serializeArray(this._exprs)
		];
	},

	doAnalyze: function (context) {
		if (! this._analyzeExprs(context))
			return;
		var exprType = this._exprs[this._exprs.length - 1].getType();
		if (exprType.equals(Type.voidType))
			context.errors.push(new CompileError(this._token, "cannot assert type void"));
		else if (exprType.equals(Type.nullType))
			context.errors.push(new CompileError(this._token, "assertion never succeeds"));
	}

});

var LogStatement = exports.LogStatement = InformationStatement.extend({

	constructor: function (token, exprs) {
		InformationStatement.prototype.constructor.call(this, token, exprs);
	},

	serialize: function () {
		return [
			"LogStatement",
			Util.serializeArray(this._exprs)
		];
	},

	doAnalyze: function (context) {
		if (! this._analyzeExprs(context))
			return;
		for (var i = 0; i < this._exprs.length; ++i) {
			var exprType = this._exprs[i].getType();
			if (exprType == null)
				return;
			if (exprType.equals(Type.voidType)) {
				context.errors.push(new CompileError(this._token, "cannot log a void expression"));
				break;
			}
		}
	}

});
