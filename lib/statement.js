"use strict";

var Class = require("./Class");

var Statement = exports.Statement = Class.extend({
});

var AssertStatement = exports.AssertStatement = Statement.extend({

	initialize: function (expr) {
		this._expr = expr;
	}

});

var BreakStatement = exports.BreakStatement = Statement.extend({

	initialize: function (label) {
		this._label = label;
	}

});

var ContinueStatement = exports.ContinueStatement = Statement.extend({

	initialize: function (label) {
		this._label = label;
	}

});

var DoWhileStatement = exports.DoWhileStatement = Statement.extend({

	initialize: function (expr, statements) {
		this._expr = expr;
		this._statements = statements;
	}

});

var ExpressionStatement = exports.ExpressionStatement = Statement.extend({

	initialize: function (expr) {
		this._expr = expr;
	}

});

var ForInStatement = exports.ForInStatement = Statement.extend({

	initialize: function (identifier, expr, statements) {
		this._identifier = identifier;
		this._expr = expr;
		this._statements = statements;
	}

});

var ForStatement = exports.ForStatement = Statement.extend({

	initialize: function (initExpr, condExpr, postExpr, statements) {
		this._initExpr = initExpr;
		this._condExpr = condExpr;
		this._postExpr = postExpr;
		this._statements = statements;
	}

});

var IfStatement = exports.IfStatement = Statement.extend({

	initialize: function (expr, onTrueStatements, onFalseStatements) {
		this._expr = expr;
		this._onTrueStatements = onTrueStatements;
		this._onFalseStatements = onFalseStatements;
	}

});

var LabelStatement = exports.LabelStatement = Statement.extend({

	initialize: function (identifier) {
		this._identifier = identifier;
	}

});

var LogStatement = exports.LogStatement = Statement.extend({

	initialize: function (expr) {
		this._expr = expr;
	}

});

var ReturnStatement = exports.ReturnStatement = Statement.extend({

	initialize: function (expr) {
		this._expr = expr;
	}

});

var SwitchStatement = exports.SwitchStatement = Statement.extend({

	initialize: function (expr, caseExpr, defaultStatementIndex, statements) {
		this._expr = expr;
		this._caseExpr = caseExpr;
		this._defaultStatementIndex = defaultStatementIndex;
		this._statements = statements;
	}

});

var TryStatement = exports.TryStatement = Statement.extend({

	initialize: function (tryStatements, catchIdentifier, catchStatements, finallyStatements) {
		this._tryStatements = tryStatements;
		this._catchIdentifier = catchIdentifier;
		this._catchStatements = catchStatements;
		this._finallyStatements = finallyStatements;
	}

});

var WhileStatement = exports.WhileStatement = Statement.extend({

	initialize: function (expr, statements) {
		this._expr = expr;
		this._statements = statements;
	}

});
