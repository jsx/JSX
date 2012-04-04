var Class = require("./Class");
eval(Class.$import("./classdef"));
eval(Class.$import("./type"));
eval(Class.$import("./util"));

"use strict";

var Expression = exports.Expression = Class.extend({

	analyze: null, // bool analyze(errors, classDefs, funcDef)

	getType: null, // string getType()

	getHolderType: function () {
		return null;
	},

	isAssignable: function (type) {
		return false;
	},

	assertTypeIsPrimitive: function (errors, token) {
		if (getType() instanceof PrimitiveType)
			return true;
		errors.push(new CompileError(token, "result of expression should be a primitive"));
		return false;
	}
			
});

var OperatorExpression = exports.OperatorExpression = Expression.extend({

	initialize: function (operatorToken) {
		this._operatorToken = operatorToken;
	},

	assertIsConvertibleTo: function (errors, expr, type) {
		var exprType = expr.getType();
		if (! exprType.isConvertibleTo(type)) {
			errors.push(new CompileError(this._operatorToken, "cannot apply operator '" + this._operatorToken.keyword + "' to type '" + exprType.toString()));
			return false;
		}
		return true;
	}

});

// primary expressions

var IdentifierExpression = exports.IdentifierExpression = Expression.extend({

	initialize: function (identifierToken) {
		this._identifierToken = identifierToken;
		this._local = null;
		this._classDefType = null;
	},

	serialize: function () {
		if (this._local != null)
			return [
				"IdentifierExpression",
				this._identifierToken.serialize(),
				"local",
				Util.serializeNullable(this._local)
			];
		else
			return [
				"IdentifierExpression",
				this._identifierToken.serialize(),
				"classDef"
			];
	},

	analyze: function (errors, classDefs, funcDef) {
		if ((this._local = funcDef.getLocal(this._identifierToken.identifier)) != null) {
			// ok
		} else {
			var classDef = ClassDefinition.getClass(classDefs, this._identifierToken.identifier);
			if (classDef == null) {
				errors.push(new CompileError(this._identifierToken, "local variable '" + this._identifierToken.identifier + "' is not declared"));
				return false;
			}
			this._classDefType = new ClassDefType(classDef);
		}
		return true;
	},

	getType: function () {
		if (this._local != null)
			return this._local.getType();
		else
			return this._classDefType;
	},

	isAssignable: function (type) {
		if (this._local != null) {
			if (this._local.getType() == null) {
				this._local.setType(type.asAssignableType());
				return true;
			} else if (! type.isConvertibleTo(this._local.getType())) {
				return false;
			}
		} else {
			return this._classDefType.isAssignable();
		}
		return true;
	}

});

var NumberLiteralExpression = exports.NumberLiteralExpression = Expression.extend({

	initialize: function (literalToken) {
		this._literalToken = literalToken;
	},

	serialize: function () {
		return [
			"NumberLiteralExpression",
			this._literalToken.serialize()
		];
	},

	analyze: function (errors, classDefs, funcDef) {
		return true;
	},

	getType: function () {
		return Type.numberType;
	}

});

var StringLiteralExpression = exports.StringLiteralExpression = Expression.extend({

	initialize: function (literalToken) {
		this._literalToken = literalToken;
	},

	serialize: function () {
		return [
			"StringLiteralExpression",
			this._literalToken.serialize()
		];
	},

	analyze: function (errors, classDefs, funcDef) {
		return true;
	},

	getType: function () {
		return Type.stringType;
	}

});

var ThisExpression = exports.ThisExpression = Expression.extend({

	initialize: function (token) {
		this._token = token;
		this._funcDef = null;
	},

	serialize: function () {
		return [
			"ThisExpression",
			this._token.serialize(),
			Util.serializeNullable(this._funcDef)
		];
	},

	analyze: function (errors, classDefs, funcDef) {
		this._funcDef = funcDef;
		return true;
	},

	getType: function () {
		if ((this._funcDef.flags() & ClassDefinition.IS_STATIC) != 0)
			return new ClassDefType(this._funcDef.getClass());
		else
			return new ObjectType(this._funcDef.getClass());
	}

});

// unary expressions

var UnaryExpression = exports.UnaryExpression = OperatorExpression.extend({

	initialize: function (operatorToken, expr) {
		OperatorExpression.prototype.initialize.call(this, operatorToken);
		this._expr = expr;
	},

	serialize: function () {
		return [
			"UnaryExpression",
			this._operatorToken.serialize(),
			this._expr.serialize()
		];
	},

	analyze: function (errors, classDefs, funcDef) {
		if (! this._expr.analyze(errors, classDefs, funcDef))
			return false;
		if (this._expr.getType().equals(Type.voidType)) {
			errors.push(new Error(this._operatorToken, "cannot apply operator '" + this._operatorToken.keyword + "' against void"));
			return false;
		}
		return true;
	}

});

var BitwiseNotExpression = exports.BitwiseNotExpression = UnaryExpression.extend({

	initialize: function (operatorToken, expr) {
		UnaryExpression.prototype.initialize.call(this, operatorToken, expr);
	},

	getType: function () {
		return Type.booleanType;
	}

});

var DeleteExpression = exports.DeleteExpression = UnaryExpression.extend({

	initialize: function (operatorToken, expr) {
		UnaryExpression.prototype.initialize.call(this, operatorToken, expr);
	},

	getType: function () {
		throw new Error("FIXME");
	}

});

var InstanceofExpression = exports.InstanceofExpression = UnaryExpression.extend({

	initialize: function (operatorToken, expr1, expectedType) {
		UnaryExpression.prototype.initialize.call(this, operatorToken, expr1);
		this._expectedType = expectedType;
	},

	serialize: function () {
		return [
			"InstanceofExpression",
			this._expr.serialize(),
			expectedType.serialize()
		];
	},

	analyze: function (errors, classDefs, funcDef) {
		if (! UnaryExpression.prototype.analyze.call(this, errors, classDefs, funcDef))
			return false;
		if (! (this._expr.getType() instanceof ObjectType)) {
			errors.push(new CompileError(this._operatorToken, "operator 'instanceof' is only applicable to an object"));
			return false;
		}
		return true;
	},

	getType: function () {
		return Type.booleanType;
	}

});

var LogicalNotExpression = exports.LogicalNotExpression = UnaryExpression.extend({

	initialize: function (operatorToken, expr) {
		UnaryExpression.prototype.initialize.call(this, operatorToken, expr);
	},

	analyze: function (errors, classDefs, funcDef) {
		if (! UnaryExpression.prototype.analyze.call(this, errors, classDefs, funcDef))
			return false;
		if (! this.assertIsConvertibleTo(errors, this._expr, Type.booleanType))
			return false;
		return true;
	},

	getType: function () {
		return Type.booleanType;
	}

});

var IncrementExpression = exports.IncrementExpression = UnaryExpression.extend({

	initialize: function (operatorToken, expr) {
		UnaryExpression.prototype.initialize.call(this, operatorToken, expr);
	},

	serialize: function () {
		return [
			this._getClassName(),
			this._operatorToken.serialize(),
			this._expr.serialize()
		];
	},

	analyze: function (errors, classDefs, funcDef) {
		if (! UnaryExpression.prototype.analyze.call(this, errors, classDefs, funcDef))
			return false;
		var exprType = this._expr.getType();
		if (exprType == null) {
			errors.push(new CompileError(this._operatorToken, "type unknown"));
			return false;
		} else if (exprType.equals(Type.integerType) || exprType.equals(Type.numberType)) {
			// ok
		} else {
			errors.push(new CompileError(this._operatorToken, "cannot apply operator '" + this._operatorToken.keyword + "' to a non-number"));
			return false;
		}
		return true;
	},

	getType: function () {
		return this._expr.getType();
	}

});

var PostIncrementExpression = exports.PostIncrementExpression = IncrementExpression.extend({

	initialize: function (operatorToken, expr) {
		IncrementExpression.prototype.initialize.call(this, operatorToken, expr);
	},

	_getClassName: function() {
		return "PostIncrementExpression";
	}

});

var PreIncrementExpression = exports.PreIncrementExpression = IncrementExpression.extend({

	initialize: function (operatorToken, expr) {
		IncrementExpression.prototype.initialize.call(this, operatorToken, expr);
	},

	_getClassName: function() {
		return "PreIncrementExpression";
	}

});

var PropertyExpression = exports.PropertyExpression = UnaryExpression.extend({

	initialize: function (operatorToken, expr1, identifierToken) {
		UnaryExpression.prototype.initialize.call(this, operatorToken, expr1);
		this._identifierToken = identifierToken;
		this._type = null;
	},

	serialize: function () {
		return [
			"PropertyExpression",
			this._expr.serialize(),
			this._identifierToken.serialize(),
			Util.serializeNullable(this._type)
		];
	},

	analyze: function (errors, classDefs, funcDef) {
		if (! UnaryExpression.prototype.analyze.call(this, errors, classDefs, funcDef))
			return false;
		var exprType = this._expr.getType();
		if (exprType.equals(Type.voidType)) {
			errors.push(new CompileError(this._identifierToken, "cannot obtain a member of void"));
			return false;
		}
		if (exprType.equals(Type.nullType)) {
			errors.push(new CompileError(this._identifierToken, "cannot obtain a member of null"));
			return false;
		}
		var classDef = exprType.getClassDef();
		if ((this._type = classDef.getMemberTypeByName(errors, classDefs, this._identifierToken.identifier)) == null) {
			errors.push(new CompileError(this._identifierToken, "'" + exprType.toString() + "' does not have property named '" + this._identifierToken.identifier) + "'");
			return false;
		}
		return true;
	},

	getType: function () {
		return this._type;
	},

	getHolderType: function () {
		return this._expr1.getType();
	},

	isAssignable: function (type) {
		if (! this._type.isAssignable())
			return false;
		if (! type.isConvertibleTo(this._type))
			return false;
		return true;
	},

});

var TypeofExpression = exports.TypeofExpression = UnaryExpression.extend({

	initialize: function (operatorToken, expr) {
		UnaryExpression.prototype.initialize.call(this, operatorToken, expr);
	},

	analyze: function (errors, classDef, funcDef) {
		throw new Error("FIXME");
	},

});

var SignExpression = exports.SignExpression = UnaryExpression.extend({

	initialize: function (operatorToken, expr) {
		UnaryExpression.prototype.initialize.call(this, operatorToken, expr);
	},

	analyze: function (errors, classDef, funcDef) {
		if (! UnaryExpression.prototype.analyze.call(this, errors, classDef, funcDef))
			return false;
		if (! this.assertIsConvertibleTo(errors, this._expr, Type.numberType))
			return false;
	},

	getType: function () {
		var type = this._expr.getType();
		if (type.equals(Type.numberType))
			return type;
		else
			return Type.integerType;
	}

});

// binary expressions

var BinaryExpression = exports.BinaryExpression = OperatorExpression.extend({

	initialize: function (operatorToken, expr1, expr2) {
		OperatorExpression.prototype.initialize.call(this, operatorToken);
		this._expr1 = expr1;
		this._expr2 = expr2;
	},

	serialize: function () {
		return [
			"BinaryExpression",
			this._operatorToken.serialize(),
			this._expr1.serialize(),
			this._expr2.serialize()/*,
			Util.serializeNullable(this.getType())*/
		];
	},

	analyze: function (errors, classDefs, funcDef) {
		if (! this._expr1.analyze(errors, classDefs, funcDef))
			return false;
		if (! this._expr2.analyze(errors, classDefs, funcDef))
			return false;
		return true;
	}

});

var AdditiveExpression = exports.AdditiveExpression = BinaryExpression.extend({

	initialize: function (operatorToken, expr1, expr2) {
		BinaryExpression.prototype.initialize.call(this, operatorToken, expr1, expr2);
		this._type = null;
	},

	analyze: function (errors, classDefs, funcDef) {
		if (! BinaryExpression.prototype.analyze.call(this, errors, classDefs, funcDef))
			return false;
		var expr1Type = this._expr1.getType();
		var expr2Type = this._expr2.getType();
		if (expr1Type.isConvertibleTo(Type.numberType) && expr2Type.isConvertibleTo(Type.numberType)) {
			// ok
			this._type = (expr1Type instanceof NumberType) || (expr2Type instanceof NumberType)
				? Type.numberType : Type.integerType;
		} else if (expr1Type instanceof StringType && expr2Type instanceof StringType) {
			// ok
			this._type = expr1Type;
		} else {
			errors.push(new CompileError(this._operatorToken, "cannot apply operator '+' to '" + expr1Type.toString() + "' and '" + expr2Type.toString() + "'"));
			return false;
		}
		return true;
	},

	getType: function () {
		return this._type;
	}

});

var ArrayExpression = exports.ArrayExpression = BinaryExpression.extend({

	initialize: function (operatorToken, expr1, expr2) {
		BinaryExpression.prototype.initialize.call(this, operatorToken, expr1, expr2);
	},

	analyze: function (errors, classDefs, funcDef) {
		throw new Error("FIXME");
	},

	getType: function () {
		throw new Error("FIXME");
	}

});

var AssignmentExpression = exports.AssignmentExpression = BinaryExpression.extend({

	initialize: function (operatorToken, expr1, expr2) {
		BinaryExpression.prototype.initialize.call(this, operatorToken, expr1, expr2);
	},

	analyze: function (errors, classDefs, funcDef) {
		if (! BinaryExpression.prototype.analyze.call(this, errors, classDefs, funcDef))
			return false;
		var rhsType = this._expr2.getType();
		if (rhsType == null)
			return false;
		if (rhsType.equals(Type.voidType)) {
			errors.push(new CompileError(this._operatorToken, "cannot assign void"));
			return false;
		}
		if (rhsType.equals(Type.nullType) && this._expr1.getType() == null) {
			errors.push(new CompileError(this._operatorToken, "cannot assign null to an unknown type"));
			return false;
		}
		if (! this._expr1.isAssignable(rhsType)) {
			errors.push(new CompileError(this._operatorToken, "cannot assign '" + rhsType.toString() + "' to '" + this._expr1.getType().toString()));
			return false;
		}
		return true;
	},

	getType: function () {
		return this._expr1.getType();
	}

});

// + - * / % < <= > >= & | ^
var BinaryNumberExpression = exports.BinaryNumberExpression = BinaryExpression.extend({

	initialize: function (operatorToken, expr1, expr2) {
		BinaryExpression.prototype.initialize.call(this, operatorToken, expr1, expr2);
	},

	analyze: function (errors, classDefs, funcDef) {
		if (! BinaryExpression.prototype.analyze.call(this, errors, classDefs, funcDef))
			return false;
		if (! this.assertIsConvertibleTo(errors, this._expr1, Type.numberType))
			return false;
		if (! this.assertIsConvertibleTo(errors, this._expr2, Type.numberType))
			return false;
		return true;
	},

	getType: function () {
		switch (this._operatorToken.keyword) {
		case "+":
		case "-":
		case "*":
		case "/":
		case "%":
			if (this._expr1.getType().equals(Type.numberType) || this._expr2.getType().equals(Type.numberType))
				return Type.numberType;
			else
				return Type.integerType;
			break;
		case "<":
		case "<=":
		case ">":
		case ">=":
			return Type.booleanType;
		case "&":
		case "|":
		case "^":
			return Type.integerType;
		default:
			throw new Error("unexpected operator:" + this._operatorToken.keyword);
		}
	}

});

var EqualityExpression = exports.EqualityExpression = BinaryExpression.extend({

	initialize: function (operatorToken, expr1, expr2) {
		BinaryExpression.prototype.initialize.call(this, operatorToken, expr1, expr2);
	},

	analyze: function (errors, classDefs, funcDef) {
		if (! BinaryExpression.prototype.analyze.call(this, errors, classDefs, funcDef))
			return false;
		var expr1Type = this._expr1.getType();
		var expr2Type = this._expr2.getType();
		if (expr1Type.equals(expr2Type)) {
			// ok
		} else if (expr1Type.isConvertibleTo(expr2Type) || expr2Type.isConvertibleTo(expr1Type)) {
			// ok
		} else {
			errors.push(new CompileError(this._operatorToken, "either side of operator == should be convertible from the other"));
			return false;
		}
		return true;
	},

	getType: function () {
		return Type.booleanType;
	}

});

var InExpression = exports.InExpression = BinaryExpression.extend({

	initialize: function (operatorToken, expr1, expr2) {
		throw new Error("FIXME");
	},

	getType: function () {
		return Type.booleanType;
	}

});

var LogicalExpression = exports.LogicalExpression = BinaryExpression.extend({

	initialize: function (operatorToken, expr1, expr2) {
		BinaryExpression.prototype.initialize.call(this, operatorToken, expr1, expr2);
	},

	analyze: function (errors, classDefs, funcDef) {
		if (! BinaryExpression.prototype.analyze.call(this, errors, classDefs, funcDef))
			return false;
		if (! this.assertIsConvertibleTo(errors, this._expr1, Type.booleanType))
			return false;
		if (! this.assertIsConvertibleTo(errors, this._expr2, Type.booleanType))
			return false;
		return true;
	},

	getType: function () {
		return Type.booleanType;
	}

});

var ShiftExpression = exports.ShiftExpression = BinaryExpression.extend({

	initialize: function (operatorToken, expr1, expr2) {
		BinaryExpression.prototype.initialize.call(this, operatorToken, expr1, expr2);
	},

	analyze: function (errors, classDefs, funcDef) {
		if (! BinaryExpression.prototype.analyze.call(this, errors, classDefs, funcDef))
			return false;
		if (! this.assertIsConvertibleTo(errors, this._expr1, Type.integerType))
			return false;
		if (! this.assertIsConvertibleTo(errors, this._expr2, Type.integerType))
			return false;
		return true;
	},

	getType: function () {
		return Type.integerType;
	}

});

// (the only) tertary expression

var ConditionalExpression = exports.ConditionalExpression = OperatorExpression.extend({

	initialize: function (operatorToken, condExpr, ifTrueExpr, ifFalseExpr) {
		OperatorExpression.prototype.initialize.call(this, operatorToken);
		this._condExpr = condExpr;
		this._ifTrueExpr = ifTrueExpr;
		this._ifFalseExpr = ifFalseExpr;
	},

	serialize: function () {
		return [
			"ConditionalExpression",
			this._operatorToken.serialize(),
			this._condExpr.serialize(),
			Util.serializeNullable(this._ifTrueExpr),
			this._ifFalseExpr.serialize()
		];
	},

	analyze: function (errors, classDefs, funcDef) {
		if (! this._condExpr.analyze(errors, classDefs, funcDef))
			return false;
		var condExprType = this._condExpr.getType();
		if (! condExprType.isConvertibleTo(Type.booleanType)) {
			errors.push(new CompileError(this._operatorToken, "condition should be convertible to bool"));
			return false;
		}
		var typeIfTrue;
		if (this._ifTrueExpr != null) {
			if (! this._ifTrueExpr.analyze(errors, classDefs, funcDef))
				return false;
			typeIfTrue = this._ifTrueExpr.getType();
		} else {
			typeIfTrue = condExprType;
		}
		if (! this._ifFalseExpr.analyze(errors, classDefs, funcDef))
			return false;
		var typeIfFalse = this._ifFalseExpr.getType();
		if (! typeIfTrue.equals(typeIfFalse)) {
			errors.push(new CompileError(this._operatorToken, "returned types should be the same for operator ?: but got '" + typeIfTrue.toString() + "' and '" + typeIfFalse.toString() + "'"));
			return false;
		}
		return true;
	},

	getType: function () {
		return this._ifFalseExpr.getType();
	}

});

// invocation expressions

var CallExpression = exports.CallExpression = OperatorExpression.extend({

	initialize: function (operatorToken, expr, args) {
		OperatorExpression.prototype.initialize.call(this, operatorToken);
		this._expr = expr;
		this._args = args;
	},

	serialize: function () {
		return [
			"CallExpression",
			this._operatorToken.serialize(),
			this._expr.serialize(),
			Util.serializeArray(this._args)
		];
	},

	analyze: function (errors, classDefs, funcDef) {
		if (! this._expr.analyze(errors, classDefs, funcDef))
			return false;
		var argTypes = [];
		for (var i = 0; i < this._args.length; ++i) {
			if (! this._args[i].analyze(errors, classDefs, funcDef))
				return false;
			argTypes[i] = this._args[i].getType();
		}
		var exprType = this._expr.getType();
		if (! (exprType instanceof FunctionType)) {
			errors.push(new CompileError(this._operatorToken, "cannot call a non-function"));
			return false;
		}
		if (! exprType.isCallableWith(argTypes, false)) {
			errors.push(new CompileError(this._operatorToken, "cannot call function, arguments mismatch"));
			return false;
		}
		return true;
	},

	getType: function () {
		return this._expr.getType().getReturnType();
	}

});

var NewExpression = exports.NewExpression = OperatorExpression.extend({

	initialize: function (operatorToken, name, args) {
		OperatorExpression.prototype.initialize.call(this, operatorToken);
		this._operatorToken = operatorToken;
		this._name = name;
		this._args = args;
	}

});

// comma expression is not treated as a binary expression

var CommaExpression = exports.CommaExpression = Expression.extend({

	initialize: function (expr1, expr2) {
		this._expr1 = expr1;
		this._expr2 = expr2;
	},

	serialize: function () {
		return [
			"CommaExpression",
			this._expr1.serialize(),
			this._expr2.serialize()
		];
	},

	analyze: function (errors, classDefs, funcDef) {
		return this._expr1.analyze(errors, classDefs, funcDef)
			&& this._expr2.analyze(errors, classDefs, funcDef);
	},

	getType: function () {
		return this._expr2.getType();
	}

});
