var Class = require("./Class");

"use strict";

var Expression = exports.Expression = Class.extend({
});

var AdditiveExpression = exports.AdditiveExpression = Expression.extend({

	initialize: function (expr1, expr2) {
		this._expr1 = expr1;
		this._expr2 = expr2;
	}

});

var ArrayExpression = exports.ArrayExpression = Expression.extend({

	initialize: function (baseExpr, indexExpr) {
		this._baseExpr = baseExpr;
		this._indexExpr = indexExpr;
	}

});

var AssignmentExpression = exports.AssignmentExpression = Expression.extend({

	initialize: function (op, lhsExpr, rhsExpr) {
		this._op = op;
		this._lhsExpr = lhsExpr;
		this._rhsExpr = rhsExpr;
	}

});

var BinaryNumberExpression = exports.BinaryNumberExpression = Expression.extend({

	initialize: function (op, expr1, expr2) {
		this._op = op;
		this._expr1 = expr1;
		this._expr2 = expr2;
	}

});

var BitwiseExpression = exports.BitwiseExpression = Expression.extend({

	initialize: function (op, expr1, expr2) {
		this._op = op;
		this._expr1 = expr1;
		this._expr2 = expr2;
	}

});

var BitwiseNotExpression = exports.BitwiseNotExpression = Expression.extend({

	initialize: function (expr) {
		this._expr = expr;
	}

});

var CallExpression = exports.CallExpression = Expression.extend({

	initialize: function (expr, args) {
		this._expr = expr;
		this._args = args;
	}

});

var CommaExpression = exports.CommaExpression = Expression.extend({

	initialize: function (expr1, expr2) {
		this._expr1 = expr1;
		this._expr2 = expr2;
	}

});

var ComparisonExpression = exports.ComparisonExpression = Expression.extend({

	initialize: function (op, expr1, expr2) {
		this._op = op;
		this._expr1 = expr1;
		this._expr2 = expr2;
	}

});

var ConditionalExpression = exports.ConditionalExpression = Expression.extend({

	initialize: function (condExpr, ifTrueExpr, ifFalseExpr) {
		this._condExpr = condExpr;
		this._ifTrueExpr = ifTrueExpr;
		this._ifFalseExpr = ifFalseExpr;
	}

});

var DeleteExpression = exports.DeleteExpression = Expression.extend({

	initialize: function (expr) {
		this._expr = expr;
	}

});

var EqualityExpression = exports.EqualityExpression = Expression.extend({

	initialize: function (op, expr1, expr2) {
		this._op = op;
		this._expr1 = expr1;
		this._expr2 = expr2;
	}

});

var IdentifierExpression = exports.IdentifierExpression = Expression.extend({

	initialize: function (identifier) {
		this._identifier = identifier;
	}

});

var InExpression = exports.InExpression = Expression.extend({

	initialize: function (expr1, expr2) {
		this._expr1 = expr1;
		this._expr2 = expr2;
	}

});

var InstanceofExpression = exports.InstanceofExpression = Expression.extend({

	initialize: function (expr1, expr2) {
		this._expr1 = expr1;
		this._expr2 = expr2;
	}

});

var LogicalExpression = exports.LogicalExpression = Expression.extend({

	initialize: function (op, expr1, expr2) {
		this._op = op;
		this._expr1 = expr1;
		this._expr2 = expr2;
	}

});

var LogicalNotExpression = exports.LogicalNotExpression = Expression.extend({

	initialize: function (expr) {
		this._expr = expr;
	}

});

var NewExpression = exports.NewExpression = Expression.extend({

	initialize: function (name, args) {
		this._name = name;
		this._args = args;
	}

});

var NumberLiteralExpression = exports.NumberLiteralExpression = Expression.extend({

	initialize: function (literal) {
		this._literal = literal;
	}

});

var PostIncrementExpression = exports.PostIncrementExpression = Expression.extend({

	initialize: function (op, expr) {
		this._op = op;
		this._expr = expr;
	}

});

var PreIncrementExpression = exports.PreIncrementExpression = Expression.extend({

	initialize: function (op, expr) {
		this._op = op;
		this._expr = expr;
	}

});

var PropertyExpression = exports.PropertyExpression = Expression.extend({

	initialize: function (baseExpr, propertyExpr) {
		this._baseExpr = baseExpr;
		this._propertyExpr = propertyExpr;
	}

});

var ShiftExpression = exports.ShiftExpression = Expression.extend({

	initialize: function (op, expr1, expr2) {
		this._op = op;
		this._expr1 = expr1;
		this._expr2 = expr2;
	}

});

var StrictEqualityExpression = exports.StrictEqualityExpression = Expression.extend({

	initialize: function (op, expr1, expr2) {
		this._op = op;
		this._expr1 = expr1;
		this._expr2 = expr2;
	}

});

var StringLiteralExpression = exports.StringLiteralExpression = Expression.extend({

	initialize: function (literal) {
		this._literal = literal;
	}

});

var ThisExpression = exports.ThisExpression = Expression.extend({

	initialize: function () {
	}

});

var TypeofExpression = exports.TypeofExpression = Expression.extend({

	initialize: function (expr) {
		this._expr = expr;
	}

});

var UnaryNumberIncrementExpression = exports.UnaryNumberIncrementExpression = Expression.extend({

	initialize: function (op, expr) {
		this._op = op;
		this._expr = expr;
	}

});
