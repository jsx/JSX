var Class = require("./Class");
eval(Class.$import("./classdef"));
eval(Class.$import("./expression"));
eval(Class.$import("./type"));
eval(Class.$import("./util"));

"use strict";

var Statement = exports.Statement = Class.extend({

	analyze: null, // void analyze(context)
	serialize: null
});

var ConstructorInvocationStatement = exports.ConstructorInvocationStatement = Statement.extend({

	initialize: function (classToken, args) {
		this._classToken = classToken;
		this._args = args;
		this._ctorClassDef = null;
		this._ctorType = null;
	},

	serialize: function () {
		return [
			"ConstructorInvocationStatement",
			this._classToken.serialize(),
			Util.serializeArray(this._args)
		];
	},

	getToken: function () {
		return this._classToken;
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

	analyze: function (context) {
		var className = this._classToken.getValue();
		if (className == "super") {
			this._ctorClassDef = context.funcDef.getClassDef().extendClassDef();
		} else {
			var classDefs = context.parser.lookup(className);
			if (classDefs.length != 1) {
				// error should have been reported already
				return;
			}
			this._ctorClassDef = classDefs[0];
		}
		// analyze args
		var argTypes = Util.analyzeArgs(context, this._args);
		if (argTypes == null) {
			// error is reported by callee
			return;
		}
		var ctorType = this._ctorClassDef.getMemberTypeByName(context.errors, context.classDefs, "initialize", ClassDefinition.GET_MEMBER_MODE_CLASS_ONLY);
		if (ctorType == null) {
			if (this._args.length != 0) {
				context.errors.push(new CompileError(this._classToken, "no function with matching arguments"));
				return;
			}
		}
		if ((ctorType = ctorType.deduceByArgumentTypes(context, this._classToken, argTypes, false)) == null) {
			// error is reported by callee
			return;
		}
		this._ctorType = ctorType;
	}

});

// statements that take one expression

var UnaryExpressionStatement = exports.UnaryExpressionStatement = Statement.extend({

	initialize: function (expr) {
		this._expr = expr;
	},

	getExpr: function () {
		return this._expr;
	},

	analyze: function (context) {
		this._expr.analyze(context);
	}

});

var ExpressionStatement = exports.ExpressionStatement = UnaryExpressionStatement.extend({

	initialize: function (expr) {
		UnaryExpressionStatement.prototype.initialize.call(this, expr);
	},

	serialize: function () {
		return [
			"ExpressionStatement",
			this._expr.serialize()
		];
	}

});

var ReturnStatement = exports.ReturnStatement = UnaryExpressionStatement.extend({

	initialize: function (token, expr) {
		UnaryExpressionStatement.prototype.initialize.call(this, expr);
		this._token = token;
	},

	serialize: function () {
		return [
			"ReturnStatement",
			this._expr.serialize()
		];
	},

	analyze: function (context) {
		if (! this._expr.analyze(context))
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

	initialize: function (token, expr) {
		UnaryExpressionStatement.prototype.initialize.call(this, expr);
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

	analyze: function (context) {
		if (! this._expr.analyze(context))
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

	initialize: function (token, label) {
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

	_assertIsJumpable: function (context) {
		if (this._label != null)
			throw new Error("FIXME");
		return true;
	}

});

var BreakStatement = exports.BreakStatement = JumpStatement.extend({

	initialize: function (token, label) {
		JumpStatement.prototype.initialize.call(this, token, label);
	},

	_getName: function () {
		return "BreakStatement";
	},

	analyze: function (context) {
		// check if the statement may appear
		var allowed = false;
		for (var i = context.blockStack.length - 1; i >= 0; --i) {
			var statement = context.blockStack[i];
			if (statement instanceof ForInStatement
				|| statement instanceof ForStatement
				|| statement instanceof DoWhileStatement
				|| statement instanceof WhileStatement
				|| statement instanceof SwitchStatement) {
				allowed = true;
				break;
			}
		}
		if (! allowed) {
			context.errors.push(new CompileError(this._token, "cannot break (a break statement is only allowed within the following statements: for/do-while/while/switch)"));
			return;
		}
		// check that it is possible to jump to the labelled statement
		this._assertIsJumpable();
	}

});

var ContinueStatement = exports.ContinueStatement = JumpStatement.extend({

	initialize: function (token, label) {
		JumpStatement.prototype.initialize.call(this, token, label);
	},

	_getName: function () {
		return "ContinueStatement";
	},


	analyze: function (context) {
		// check if the statement may appear
		var allowed = false;
		for (var i = context.blockStack.length - 1; i >= 0; --i) {
			var statement = context.blockStack[i];
			if (statement instanceof ForInStatement
				|| statement instanceof ForStatement
				|| statement instanceof DoWhileStatement
				|| statement instanceof WhileStatement) {
				allowed = true;
				break;
			}
		}
		if (! allowed) {
			context.errors.push(new CompileError(this._token, "cannot continue (a continue statement is only allowed within the following statements: for/do-while/while)"));
			return;
		}
		// check that it is possible to jump to the labelled statement
		this._assertIsJumpable();
	}

});

// label

var LabelStatement = exports.LabelStatement = Statement.extend({

	initialize: function (identifier) {
		this._identifier = identifier;
	},

	getIdentifier: function () {
		return this._identifier;
	},

	serialize: function () {
		return [
			"LabelStatement",
			this._identifier.serialize()
		];
	},

	analyze: function (context) {
	}

});

// control flow statements

var DoWhileStatement = exports.DoWhileStatement = Statement.extend({

	initialize: function (expr, statements) {
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
			"DoWhileStatement",
			this._expr.serialize(),
			Util.serializeArray(this._statements)
		];
	},

	analyze: function (context) {
		this._expr.analyze(context);
		try {
			context.blockStack.push(this);
			for (var i = 0; i < this._statements.length; ++i)
				this._statements[i].analyze(context);
		} finally {
			context.blockStack.pop();
		}
	}

});

var ForInStatement = exports.ForInStatement = Statement.extend({

	initialize: function (identifier, expr, statements) {
		this._identifier = identifier;
		this._expr = expr;
		this._statements = statements;
	},

	serialize: function () {
		return [
			"ForInStatement",
			this._identifier.serialize(),
			this._expr.serialize(),
			Util.serializeArray(this._statements)
		];
	},

	analyze: function (context) {
		this._expr.analyze(context);
		try {
			context.blockStack.push(this);
			for (var i = 0; i < this._statements.length; ++i)
				this._statements[i].analyze(context);
		} finally {
			context.blockStack.pop();
		}
	}

});

var ForStatement = exports.ForStatement = Statement.extend({

	initialize: function (initExpr, condExpr, postExpr, statements) {
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
			Util.serializeNullable(this._initExpr),
			Util.serializeNullable(this._condExpr),
			Util.serializeNullable(this._postExpr),
			Util.serializeArray(this._statements)
		];
	},

	analyze: function (context) {
		if (this._initExpr != null)
			this._initExpr.analyze(context);
		if (this._condExpr != null)
			this._condExpr.analyze(context);
		if (this._postExpr != null)
			this._postExpr.analyze(context);
		try {
			context.blockStack.push(this);
			for (var i = 0; i < this._statements.length; ++i)
				this._statements[i].analyze(context);
		} finally {
			context.blockStack.pop();
		}
	}

});

var IfStatement = exports.IfStatement = Statement.extend({

	initialize: function (expr, onTrueStatements, onFalseStatements) {
		this._expr = expr;
		this._onTrueStatements = onTrueStatements;
		this._onFalseStatements = onFalseStatements;
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

	analyze: function (context) {
		this._expr.analyze(context);
		try {
			context.blockStack.push(this);
			for (var i = 0; i < this._onTrueStatements.length; ++i)
				this._onTrueStatements[i].analyze(context);
		} finally {
			context.blockStack.pop();
		}
		try {
			context.blockStack.push(this);
			for (var i = 0; i < this._onFalseStatements.length; ++i)
				this._onFalseStatements[i].analyze(context);
		} finally {
			context.blockStack.pop();
		}
	}

});

var SwitchStatement = exports.SwitchStatement = Statement.extend({

	initialize: function (token, expr, statements) {
		this._token = token;
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
			this._expr.serialize(),
			Util.serializeArray(this._statements)
		];
	},

	analyze: function (context) {
		if (! this._expr.analyze(context))
			return;
		var exprType = this._expr.getType();
		if (exprType == null)
			return;
		if (! (exprType.equals(Type.booleanType) || exprType.equals(Type.integerType) || exprType.equals(Type.numberType) || exprType.equals(Type.stringType))) {
			context.errors.push(new CompileError(this._token, "switch statement only accepts boolean, number, or string expressions"));
			return;
		}
		try {
			context.blockStack.push(this);
			for (var i = 0; i < this._statements.length; ++i)
				this._statements[i].analyze(context);
		} finally {
			context.blockStack.pop();
		}
	}

});

var CaseStatement = exports.CaseStatement = Statement.extend({

	initialize: function (token, expr) {
		this._token = token;
		this._expr = expr;
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

	analyze: function (context) {
		if (! this._expr.analyze(context))
			return false;
		var statement = context.blockStack[context.blockStack.length - 1];
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
	}

});

var DefaultStatement = exports.DefaultStatement = Statement.extend({

	initialize: function (token) {
		this._token = token;
	},

	serialize: function () {
		return [
			"DefaultStatement"
		];
	},

	analyze: function (context) {
	}

});

var WhileStatement = exports.WhileStatement = Statement.extend({

	initialize: function (expr, statements) {
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
			this._expr.serialize(),
			Util.serializeArray(this._statements)
		];
	},

	analyze: function (context) {
		this._expr.analyze(context);
		try {
			context.blockStack.push(this);
			for (var i = 0; i < this._statements.length; ++i)
				this._statements[i].analyze(context);
		} finally {
			context.blockStack.pop();
		}
	}

});

var TryStatement = exports.TryStatement = Statement.extend({

	initialize: function (tryStatements, catchIdentifier, catchStatements, finallyStatements) {
		this._tryStatements = tryStatements;
		this._catchIdentifier = catchIdentifier; // FIXME type?
		this._catchStatements = catchStatements;
		this._finallyStatements = finallyStatements;
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

	analyze: function (context) {
		try {
			context.blockStack.push(this);
			for (var i = 0; i < this._tryStatements.length; ++i)
				this._tryStatements[i].analyze(context);
		} finally {
			context.blockStack.pop();
		}
		if (this._catchStatements != null) {
			try {
				context.blockStack.push(this);
				for (var i = 0; i < this._catchStatements.length; ++i)
					this._catchStatements[i].analyze(context);
			} finally {
				context.blockStack.pop();
			}
		}
		if (this._finallyStatements != null) {
			try {
				context.blockStack.push(this);
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

	initialize: function (token, exprs) {
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
			if (! this._exprs[i].analyze(context))
				return false;
		return true;
	}

});

var AssertStatement = exports.AssertStatement = InformationStatement.extend({

	initialize: function (token, exprs) {
		InformationStatement.prototype.initialize.call(this, token, exprs);
	},

	serialize: function () {
		return [
			"AssertStatement",
			Util.serializeArray(this._exprs)
		];
	},

	analyze: function (context) {
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

	initialize: function (token, exprs) {
		InformationStatement.prototype.initialize.call(this, token, exprs);
	},

	serialize: function () {
		return [
			"LogStatement",
			Util.serializeArray(this._exprs)
		];
	},

	analyze: function (context) {
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
