var Class = require("./Class");

"use strict";

var Expression = exports.Expression = Class.extend({
});

// primary expressions

var IdentifierExpression = exports.IdentifierExpression = Expression.extend({

	initialize: function (identifierToken) {
		this._identifierToken = identifierToken;
	}

});

var NumberLiteralExpression = exports.NumberLiteralExpression = Expression.extend({

	initialize: function (literalToken) {
		this._literalToken = literalToken;
	}

});

var StringLiteralExpression = exports.StringLiteralExpression = Expression.extend({

	initialize: function (literalToken) {
		this._literalToken = literalToken;
	}

});

var ThisExpression = exports.ThisExpression = Expression.extend({

	initialize: function (token) {
		this._token = token;
	}

});

// unary expressions

var UnaryExpression = exports.UnaryExpression = Expression.extend({

	initialize: function (operatorToken, expr) {
		this._operatorToken = operatorToken;
		this._expr = expr;
	}

});

var BitwiseNotExpression = exports.BitwiseNotExpression = UnaryExpression.extend({

	initialize: function (operatorToken, expr) {
		UnaryExpression.prototype.initialize.call(this, operatorToken, expr);
	}

});

var DeleteExpression = exports.DeleteExpression = UnaryExpression.extend({

	initialize: function (operatorToken, expr) {
		UnaryExpression.prototype.initialize.call(this, operatorToken, expr);
	}

});

var LogicalNotExpression = exports.LogicalNotExpression = UnaryExpression.extend({

	initialize: function (operatorToken, expr) {
		UnaryExpression.prototype.initialize.call(this, operatorToken, expr);
	}

});

var PostIncrementExpression = exports.PostIncrementExpression = UnaryExpression.extend({

	initialize: function (operatorToken, expr) {
		UnaryExpression.prototype.initialize.call(this, operatorToken, expr);
	}

});

var PreIncrementExpression = exports.PreIncrementExpression = UnaryExpression.extend({

	initialize: function (operatorToken, expr) {
		UnaryExpression.prototype.initialize.call(this, operatorToken, expr);
	}

});

var TypeofExpression = exports.TypeofExpression = UnaryExpression.extend({

	initialize: function (operatorToken, expr) {
		UnaryExpression.prototype.initialize.call(this, operatorToken, expr);
	}

});

var SignExpression = exports.SignExpression = Expression.extend({

	initialize: function (operatorToken, expr) {
		UnaryExpression.prototype.initialize.call(this, operatorToken, expr);
	}

});

// binary expressions

var BinaryExpression = exports.BinaryExpression = Expression.extend({

	initialize: function (operatorToken, expr1, expr2) {
		this._operatorToken = operatorToken;
		this._expr1 = expr1;
		this._expr2 = expr2;
	}

});

var AdditiveExpression = exports.AdditiveExpression = BinaryExpression.extend({

	initialize: function (operatorToken, expr1, expr2) {
		BinaryExpression.prototype.initialize.call(this, operatorToken, expr1, expr2);
	}

});

var ArrayExpression = exports.ArrayExpression = BinaryExpression.extend({

	initialize: function (operatorToken, expr1, expr2) {
		BinaryExpression.prototype.initialize.call(this, operatorToken, expr1, expr2);
	}

});

var AssignmentExpression = exports.AssignmentExpression = BinaryExpression.extend({

	initialize: function (operatorToken, expr1, expr2) {
		BinaryExpression.prototype.initialize.call(this, operatorToken, expr1, expr2);
	}

});

var BinaryNumberExpression = exports.BinaryNumberExpression = BinaryExpression.extend({

	initialize: function (operatorToken, expr1, expr2) {
		BinaryExpression.prototype.initialize.call(this, operatorToken, expr1, expr2);
	}

});

var BitwiseExpression = exports.BitwiseExpression = BinaryExpression.extend({

	initialize: function (operatorToken, expr1, expr2) {
		BinaryExpression.prototype.initialize.call(this, operatorToken, expr1, expr2);
	}

});

var CommaExpression = exports.CommaExpression = BinaryExpression.extend({

	initialize: function (operatorToken, expr1, expr2) {
		BinaryExpression.prototype.initialize.call(this, operatorToken, expr1, expr2);
	}

});

var ComparisonExpression = exports.ComparisonExpression = BinaryExpression.extend({

	initialize: function (operatorToken, expr1, expr2) {
		BinaryExpression.prototype.initialize.call(this, operatorToken, expr1, expr2);
	}

});

var EqualityExpression = exports.EqualityExpression = BinaryExpression.extend({

	initialize: function (operatorToken, expr1, expr2) {
		BinaryExpression.prototype.initialize.call(this, operatorToken, expr1, expr2);
	}

});

var InExpression = exports.InExpression = BinaryExpression.extend({

	initialize: function (operatorToken, expr1, expr2) {
		BinaryExpression.prototype.initialize.call(this, operatorToken, expr1, expr2);
	}

});

var InstanceofExpression = exports.InstanceofExpression = BinaryExpression.extend({

	initialize: function (operatorToken, expr1, expr2) {
		BinaryExpression.prototype.initialize.call(this, operatorToken, expr1, expr2);
	}

});

var LogicalExpression = exports.LogicalExpression = BinaryExpression.extend({

	initialize: function (operatorToken, expr1, expr2) {
		BinaryExpression.prototype.initialize.call(this, operatorToken, expr1, expr2);
	}

});

var PropertyExpression = exports.PropertyExpression = BinaryExpression.extend({

	initialize: function (operatorToken, expr1, expr2) {
		BinaryExpression.prototype.initialize.call(this, operatorToken, expr1, expr2);
	}

});

var ShiftExpression = exports.ShiftExpression = BinaryExpression.extend({

	initialize: function (operatorToken, expr1, expr2) {
		BinaryExpression.prototype.initialize.call(this, operatorToken, expr1, expr2);
	}

});

var StrictEqualityExpression = exports.StrictEqualityExpression = BinaryExpression.extend({

	initialize: function (operatorToken, expr1, expr2) {
		BinaryExpression.prototype.initialize.call(this, operatorToken, expr1, expr2);
	}

});

// (the only) tertary expression

var ConditionalExpression = exports.ConditionalExpression = Expression.extend({

	initialize: function (condExpr, ifTrueExpr, ifFalseExpr) {
		this._condExpr = condExpr;
		this._ifTrueExpr = ifTrueExpr;
		this._ifFalseExpr = ifFalseExpr;
	}

});

// invocation expressions

var CallExpression = exports.CallExpression = Expression.extend({

	initialize: function (operatorToken, expr, args) {
		this._operatorToken = operatorToken;
		this._expr = expr;
		this._args = args;
	}

});

var NewExpression = exports.NewExpression = Expression.extend({

	initialize: function (operatorToken, name, args) {
		this._operatorToken = operatorToken;
		this._name = name;
		this._args = args;
	}

});
