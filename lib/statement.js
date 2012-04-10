var Class = require("./Class");
eval(Class.$import("./expression.js"));
eval(Class.$import("./util.js"));

"use strict";

var Statement = exports.Statement = Class.extend({

	analyze: null, // void analyze(errors, classDefs, funcDef)
	serialize: null
});

// statements that take one expression

var UnaryExpressionStatement = exports.UnaryExpressionStatement = Statement.extend({

	initialize: function (expr) {
		this._expr = expr;
	},

	getExpr: function () {
		return this._expr;
	},

	analyze: function (errors, classDefs, funcDef) {
		this._expr.analyze(errors, classDefs, funcDef);
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

	analyze: function (errors, classDefs, funcDef) {
		if (! this._expr.analyze(errors, classDefs, funcDef))
			return;
		var exprType = this._expr.getType();
		var returnType = funcDef.getReturnType();
		if (! exprType.isConvertibleTo(returnType))
			errors.push(new CompileError(this._token, "cannot convert '" + exprType.toString() + "' to return type '" + returnType.toString() + "'"));
	}

});

// break and continue

var JumpStatement = exports.JumpStatement = Statement.extend({

	initialize: function (identifierToken) {
		this._identifierToken = identifierToken;
	},

	analyze: function (errors, classDefs, funcDef) {
		// FIXME check the existence of destination
	}

});

var BreakStatement = exports.BreakStatement = JumpStatement.extend({

	initialize: function (identifierToken) {
		JumpStatement.prototype.initialize.call(this, identifierToken);
	},

	serialize: function () {
		return [
			"BreakStatement",
			Util.serializeNullable(this._identifierToken)
		];
	}

});

var ContinueStatement = exports.ContinueStatement = JumpStatement.extend({

	initialize: function (label) {
		this._label = label;
	},

	serialize: function () {
		return [
			"ContinueStatement",
			Util.serializeNullable(this._identifierToken)
		];
	}

});

// label

var LabelStatement = exports.LabelStatement = Statement.extend({

	initialize: function (identifier) {
		this._identifier = identifier;
	},

	serialize: function () {
		return [
			"LabelStatement",
			this._identifier.serialize()
		];
	},

	analyze: function (errors, classDefs, funcDef) {
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

	analyze: function (errors, classDefs, funcDef) {
		this._expr.analyze(errors, classDefs, funcDef);
		for (var i = 0; i < this._statements.length; ++i)
			this._statements[i].analyze(errors, classDefs, funcDef);
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

	analyze: function (errors, classDefs, funcDef) {
		this._expr.analyze(errors, classDefs, funcDef);
		for (var i = 0; i < this._statements.length; ++i)
			this._statements[i].analyze(errors, classDefs, funcDef);
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

	analyze: function (errors, classDefs, funcDef) {
		if (this._initExpr != null)
			this._initExpr.analyze(errors, classDefs, funcDef);
		if (this._condExpr != null)
			this._condExpr.analyze(errors, classDefs, funcDef);
		if (this._postExpr != null)
			this._postExpr.analyze(errors, classDefs, funcDef);
		for (var i = 0; i < this._statements.length; ++i)
			this._statements[i].analyze(errors, classDefs, funcDef);
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

	analyze: function (errors, classDefs, funcDef) {
		this._expr.analyze(errors, classDefs, funcDef);
		for (var i = 0; i < this._onTrueStatements.length; ++i)
			this._onTrueStatements[i].analyze(errors, classDefs, funcDef);
		for (var i = 0; i < this._onFalseStatements.length; ++i)
			this._onFalseStatements[i].analyze(errors, classDefs, funcDef);
	}

});

var SwitchStatement = exports.SwitchStatement = Statement.extend({

	initialize: function (expr, caseExpr, defaultStatementIndex, statements) {
		this._expr = expr;
		this._caseExpr = caseExpr;
		this._defaultStatementIndex = defaultStatementIndex;
		this._statements = statements;
	},

	serialize: function () {
		return [
			"SwitchStatement",
			this._expr.serialize(),
			(function (a) {
				var ret = 0;
				for (var i = 0; i < a.length; ++i)
					ret[i] = [ a[i][0].serialize(), a[i][1] ];
				return ret;
			})(this._caseExpr),
			this._defaultStatementIndex,
			Util.serializeArray(this._statements)
		];
	},

	analyze: function (errors, classDefs, funcDef) {
		this._expr.analyze(errors, classDefs, funcDef);
		for (var i = 0; i < this._caseExpr.length; ++i)
			this._caseExpr[i][0].analyze(errors, classDefs, funcDef);
		for (var i = 0; i < this._statements.length; ++i)
			this._statements[i].analyze(errors, classDefs, funcDef);
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

	analyze: function (errors, classDefs, funcDef) {
		this._expr.analyze(errors, classDefs, funcDef);
		for (var i = 0; i < this._statements.length; ++i)
			this._statements[i].analyze(errors, classDefs, funcDef);
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

	analyze: function (errors, classDefs, funcDef) {
		for (var i = 0; i < this._tryStatements.length; ++i)
			this._tryStatements[i].analyze(errors, classDefs, funcDef);
		if (this._catchStatements != null)
			for (var i = 0; i < this._catchStatements.length; ++i)
				this._catchStatements[i].analyze(errors, classDefs, funcDef);
		if (this._finallyStatements != null)
			for (var i = 0; i < this._finallyStatements.length; ++i)
				this._finallyStatements[i].analyze(errors, classDefs, funcDef);
	}

});

// information statements

var InformationStatement = exports.InformationStatement = Statement.extend({

	initialize: function (exprs) {
		this._exprs = exprs;
	},

	getExprs: function () {
		return this._exprs;
	},

	analyze: function (errors, classDefs, funcDef) {
		for (var i = 0; i < this._exprs.length; ++i)
			this._exprs[i].analyze(errors, classDefs, funcDef);
	}

});

var AssertStatement = exports.AssertStatement = InformationStatement.extend({

	initialize: function (exprs) {
		InformationStatement.prototype.initialize.call(this, exprs);
	},

	serialize: function () {
		return [
			"AssertStatement",
			Util.serializeArray(this._exprs)
		];
	}

});

var LogStatement = exports.LogStatement = InformationStatement.extend({

	initialize: function (exprs) {
		InformationStatement.prototype.initialize.call(this, exprs);
	},

	serialize: function () {
		return [
			"LogStatement",
			Util.serializeArray(this._exprs)
		];
	}

});
