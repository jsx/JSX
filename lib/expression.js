var Class = require("./Class");
eval(Class.$import("./classdef"));
eval(Class.$import("./type"));
eval(Class.$import("./util"));

"use strict";

var _Util = exports._Util = Class.extend({

	$analyzeArgs: function (context, args) {
		var argTypes = [];
		for (var i = 0; i < args.length; ++i) {
			if (! args[i].analyze(context))
				return null;
			argTypes[i] = args[i].getType();
		}
		return argTypes;
	}

});

var Expression = exports.Expression = Class.extend({

	analyze: null, // bool analyze(context)

	getType: null, // string getType()

	getHolderType: function () {
		return null;
	},

	isAssignable: function (type) {
		return false;
	}

});

var OperatorExpression = exports.OperatorExpression = Expression.extend({

	initialize: function (operatorToken) {
		this._operatorToken = operatorToken;
	},

	getOperatorToken: function() {
		return this._operatorToken;
	},

	assertIsConvertibleTo: function (context, expr, type) {
		var exprType = expr.getType();
		if (! exprType.isConvertibleTo(type)) {
			context.errors.push(new CompileError(this._operatorToken, "cannot apply operator '" + this._operatorToken.getValue() + "' to type '" + exprType.toString() + "'"));
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

	analyze: function (context) {
		if ((this._local = context.funcDef.getLocal(this._identifierToken.getValue())) != null) {
			// ok
		} else {
			var classDef = ClassDefinition.getClass(context.classDefs, this._identifierToken.getValue());
			if (classDef == null) {
				context.errors.push(new CompileError(this._identifierToken, "local variable '" + this._identifierToken.getValue() + "' is not declared"));
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
				if (type.equals(Type.undefinedType))
					return false;
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

var UndefinedExpression = exports.UndefinedExpression = Expression.extend({

	initialize: function (token) {
		this._token = token;
	},

	getToken: function () {
		return this._token;
	},

	serialize: function () {
		return [
			"UndefinedExpression",
			this._token.serialize()
		];
	},

	analyze: function (context) {
		return true;
	},

	getType: function () {
		return Type.undefinedType;
	}

});

var NullExpression = exports.NullExpression = Expression.extend({

	initialize: function (token) {
		this._token = token;
	},

	getToken: function () {
		return this._token;
	},

	serialize: function () {
		return [
			"NullExpression",
			this._token.serialize()
		];
	},

	analyze: function (context) {
		return true;
	},

	getType: function () {
		return Type.nullType;
	}

});

var BooleanLiteralExpression = exports.BooleanLiteralExpression = Expression.extend({

	initialize: function (token) {
		this._token = token;
	},

	getToken: function () {
		return this._token;
	},

	serialize: function () {
		return [
			"BooleanLiteralExpression",
			this._token.serialize()
		];
	},

	analyze: function (context) {
		return true;
	},

	getType: function () {
		return Type.booleanType;
	}

});

var IntegerLiteralExpression = exports.IntegerLiteralExpression = Expression.extend({

	initialize: function (token) {
		this._token = token;
	},

	getToken: function () {
		return this._token;
	},

	serialize: function () {
		return [
			"IntegerLiteralExpression",
			this._token.serialize()
		];
	},

	analyze: function (context) {
		return true;
	},

	getType: function () {
		return Type.integerType;
	}

});


var NumberLiteralExpression = exports.NumberLiteralExpression = Expression.extend({

	initialize: function (token) {
		this._token = token;
	},

	getToken: function () {
		return this._token;
	},

	serialize: function () {
		return [
			"NumberLiteralExpression",
			this._token.serialize()
		];
	},

	analyze: function (context) {
		return true;
	},

	getType: function () {
		return Type.numberType;
	}

});

var StringLiteralExpression = exports.StringLiteralExpression = Expression.extend({

	initialize: function (token) {
		this._token = token;
	},

	getToken: function () {
		return this._token;
	},

	serialize: function () {
		return [
			"StringLiteralExpression",
			this._token.serialize()
		];
	},

	analyze: function (context) {
		return true;
	},

	getType: function () {
		return Type.stringType;
	}

});

var RegExpLiteralExpression = exports.RegExpLiteralExpression = Expression.extend({

	initialize: function (token) {
		this._token = token;
		this._type = null;
	},

	getToken: function () {
		return this._token;
	},

	serialize: function () {
		return [
			"RegExpLiteralExpression",
			this._token.serialize()
		];
	},

	analyze: function (context) {
		var classDef = ClassDefinition.getClass(context.classDefs, "RegExp");
		if (classDef == null)
			throw new Error("logic flaw: could not find RegExp class definition");
		this._type = new ObjectType(classDef);
		return true;
	},

	getType: function () {
		return this._type;
	}

});

var ArrayLiteralExpression = exports.ArrayLiteralExpression = Expression.extend({

	initialize: function (token, exprs, type) {
		this._token = token;
		this._exprs = exprs;
		this._type = type; // optional at this moment
	},

	getToken: function () {
		return this._token;
	},

	getExprs: function () {
		return this._exprs;
	},

	getType: function () {
		return this._type;
	},

	serialize: function () {
		return [
			"ArrayLiteralExpression",
			this._token.serialize(),
			Util.serializeArray(this._exprs),
			Util.serializeNullable(this._type)
		];
	},

	analyze: function (context) {
		// analyze all elements
		var succeeded = true;
		for (var i = 0; i < this._exprs.length; ++i) {
			if (! this._exprs[i].analyze(context)) {
				succeeded = false;
			} else if (this._exprs[i].getType().equals(Type.voidType)) {
				 // FIXME the location of the error would be strange; we deseparately need expr.getToken()
				context.errors.push(new CompileError(this._token, "cannot assign void to an array"));
				suceeded = false;
			}
		}
		if (! succeeded)
			return false;
		// determine the type from the array members if the type was not specified
		if (this._type != null) {
			var classDef = this._type.getClassDef();
			if (! (classDef instanceof InstantiatedClassDefinition && classDef.getTemplateClassName() == "Array")) {
				context.errors.push(new CompileError(this._token, "specified type is not an array type"));
				return false;
			}
		} else {
			for (var i = 0; i < this._exprs.length; ++i) {
				var elementType = this._exprs[i].getType();
				if (! elementType.equals(Type.nullType)) {
					if (elementType.equals(Type.integerType))
						elementType = Type.numberType;
					var instantiatedClass = context.instantiateTemplate(context.errors, new TemplateInstantiationRequest(this._token, "Array", [ elementType ]));
					if (instantiatedClass == null)
						return false;
					this._type = new ObjectType(instantiatedClass);
					break;
				}
			}
			if (this._type == null) {
				context.errors.push(new CompileError(this._token, "could not deduce array type, please specify"));
				return false;
			}
		}
		// check type of the elements
		var expectedType = this._type.getClassDef().getTypeArguments()[0];
		for (var i = 0; i < this._exprs.length; ++i) {
			var elementType = this._exprs[i].getType();
			if (! elementType.isConvertibleTo(expectedType)) {
				context.errors.push(new CompileError(this._token, "cannot assign '" + elementType.toString() + "' to an array of '" + expectedType.toString() + "'"));
				succeeded = false;
			}
		}
		return succeeded;
	}

});

var HashLiteralElement = exports.HashLiteralElement = Class.extend({

	initialize: function (key, expr) {
		this._key = key;
		this._expr = expr;
	},

	getKey: function () {
		return this._key;
	},

	getExpr: function () {
		return this._expr;
	}

});

var HashLiteralExpression = exports.HashLiteralExpression = Expression.extend({

	initialize: function (token, elements, type) {
		this._token = token;
		this._elements = elements;
		this._type = type; // optional at this moment
	},

	getToken: function () {
		return this._token;
	},

	getElements: function () {
		return this._elements;
	},

	getType: function () {
		return this._type;
	},

	serialize: function () {
		return [
			"HashLiteralExpression",
			this._token.serialize(),
			Util.serializeArray(this._elements),
			Util.serializeNullable(this._type)
		];
	},

	analyze: function (context) {
		// analyze all elements
		var succeeded = true;
		for (var i = 0; i < this._elements.length; ++i) {
			if (! this._elements[i].getExpr().analyze(context)) {
				succeeded = false;
			} else if (this._elements[i].getExpr().getType().equals(Type.voidType)) {
				 // FIXME the location of the error would be strange; we deseparately need expr.getToken()
				context.errors.push(new CompileError(this._token, "cannot assign void to a hash"));
				suceeded = false;
			}
		}
		if (! succeeded)
			return false;
		// determine the type from the array members if the type was not specified
		if (this._type != null) {
			var classDef = this._type.getClassDef();
			if (! (classDef instanceof InstantiatedClassDefinition && classDef.getTemplateClassName() == "Hash")) {
				context.errors.push(new CompileError(this._token, "specified type is not a hash type"));
				return false;
			}
		} else {
			for (var i = 0; i < this._elements.length; ++i) {
				var elementType = this._elements[i].getExpr().getType();
				if (! elementType.equals(Type.nullType)) {
					if (elementType.equals(Type.integerType))
						elementType = Type.numberType;
					var instantiatedClass = context.instantiateTemplate(context.errors, new TemplateInstantiationRequest(this._token, "Hash", [ elementType ]));
					if (instantiatedClass == null)
						return false;
					this._type = new ObjectType(instantiatedClass);
					break;
				}
			}
			if (this._type == null) {
				context.errors.push(new CompileError(this._token, "could not deduce hash type, please specify"));
				return false;
			}
		}
		// check type of the elements
		var expectedType = this._type.getClassDef().getTypeArguments()[0];
		for (var i = 0; i < this._elements.length; ++i) {
			var elementType = this._elements[i].getExpr().getType();
			if (! elementType.isConvertibleTo(expectedType)) {
				context.errors.push(new CompileError(this._token, "cannot assign '" + elementType.toString() + "' to a hash of '" + expectedType.toString() + "'"));
				succeeded = false;
			}
		}
		return succeeded;
	}

});

var ThisExpression = exports.ThisExpression = Expression.extend({

	initialize: function (token) {
		this._token = token;
		this._funcDef = null;
	},

	getToken: function () {
		return this._token;
	},

	serialize: function () {
		return [
			"ThisExpression",
			this._token.serialize(),
			Util.serializeNullable(this._funcDef)
		];
	},

	analyze: function (context) {
		this._funcDef = context.funcDef;
		return true;
	},

	getType: function () {
		if ((this._funcDef.flags() & ClassDefinition.IS_STATIC) != 0)
			return new ClassDefType(this._funcDef.getClassDef());
		else
			return new ObjectType(this._funcDef.getClassDef());
	}

});

// unary expressions

var UnaryExpression = exports.UnaryExpression = OperatorExpression.extend({

	initialize: function (operatorToken, expr) {
		OperatorExpression.prototype.initialize.call(this, operatorToken);
		this._expr = expr;
	},

	getExpr: function () {
		return this._expr;
	},

	serialize: function () {
		return [
			"UnaryExpression",
			this._operatorToken.serialize(),
			this._expr.serialize()
		];
	},

	analyze: function (context) {
		if (! this._expr.analyze(context))
			return false;
		if (this._expr.getType().equals(Type.voidType)) {
			context.errors.push(new CompileError(this._operatorToken, "cannot apply operator '" + this._operatorToken.getValue() + "' against void"));
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

var InstanceofExpression = exports.InstanceofExpression = UnaryExpression.extend({

	initialize: function (operatorToken, expr, expectedType) {
		UnaryExpression.prototype.initialize.call(this, operatorToken, expr);
		this._expectedType = expectedType;
	},

	serialize: function () {
		return [
			"InstanceofExpression",
			this._expr.serialize(),
			this._expectedType.serialize()
		];
	},

	analyze: function (context) {
		if (! UnaryExpression.prototype.analyze.call(this, context))
			return false;
		if (! (this._expr.getType() instanceof ObjectType)) {
			context.errors.push(new CompileError(this._operatorToken, "operator 'instanceof' is only applicable to an object"));
			return false;
		}
		return true;
	},

	getType: function () {
		return Type.booleanType;
	}

});

var AsExpression = exports.AsExpression = UnaryExpression.extend({

	initialize: function (operatorToken, expr, type) {
		UnaryExpression.prototype.initialize.call(this, operatorToken, expr);
		this._type = type;
	},

	serialize: function () {
		return [
			"AsExpression",
			this._expr.serialize(),
			this._type.serialize()
		];
	},

	analyze: function (context) {
		if (! UnaryExpression.prototype.analyze.call(this, context))
			return false;
		if (this._type instanceof MayBeUndefinedType) {
			context.errors.push(new CompileError(this._operatorToken, "right operand of 'as' expression cannot be a MayBeUndefined<T> type"));
			return false;
		}
		// nothing to care if the conversion is allowed by implicit conversion
		if (this._expr.getType().isConvertibleTo(this._type))
			return true;
		// possibly unsafe conversions
		var exprType = this._expr.getType().resolveIfMayBeUndefined();
		var success = false;
		if (exprType instanceof PrimitiveType) {
			if (this._type instanceof PrimitiveType) {
				// ok: primitive => primitive
				success = true;
			}
		} else if (exprType instanceof VariantType) {
			// ok, variant is convertible to all types of objects
			success = true;
		} else if (exprType instanceof ObjectType) {
			// FIXME? conversion from objects to primitives should be done by calling toString(), valueOf(), etc. (optimized by emitter)
			if (this._type instanceof ObjectType && this._type.isConvertibleTo(exprType)) {
				// is down-cast, maybe unsafe
				success = true;
			}
		}
		if (! success) {
			context.errors.push(new CompileError(this._operatorToken, "cannot convert a value of type '" + this._expr.getType().toString() + "' to '" + this._type.toString() + "'"));
			return false;
		}
		return true;
	},

	getType: function () {
		return this._type;
	}

});

var LogicalNotExpression = exports.LogicalNotExpression = UnaryExpression.extend({

	initialize: function (operatorToken, expr) {
		UnaryExpression.prototype.initialize.call(this, operatorToken, expr);
	},

	analyze: function (context) {
		if (! UnaryExpression.prototype.analyze.call(this, context))
			return false;
		if (! this.assertIsConvertibleTo(context, this._expr, Type.booleanType))
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

	analyze: function (context) {
		if (! UnaryExpression.prototype.analyze.call(this, context))
			return false;
		var exprType = this._expr.getType();
		if (exprType == null) {
			context.errors.push(new CompileError(this._operatorToken, "type unknown"));
			return false;
		} else if (exprType.resolveIfMayBeUndefined().equals(Type.integerType) || exprType.resolveIfMayBeUndefined().equals(Type.numberType)) {
			// ok
		} else {
			context.errors.push(new CompileError(this._operatorToken, "cannot apply operator '" + this._operatorToken.getValue() + "' to a non-number"));
			return false;
		}
		return true;
	},

	getType: function () {
		return this._expr.getType().resolveIfMayBeUndefined();
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

	getIdentifierToken: function () {
		return this._identifierToken;
	},

	serialize: function () {
		return [
			"PropertyExpression",
			this._expr.serialize(),
			this._identifierToken.serialize(),
			Util.serializeNullable(this._type)
		];
	},

	analyze: function (context) {
		if (! UnaryExpression.prototype.analyze.call(this, context))
			return false;
		var exprType = this._expr.getType();
		if (exprType.equals(Type.voidType)) {
			context.errors.push(new CompileError(this._identifierToken, "cannot obtain a member of void"));
			return false;
		}
		if (exprType.equals(Type.nullType)) {
			context.errors.push(new CompileError(this._identifierToken, "cannot obtain a member of null"));
			return false;
		}
		var classDef = exprType.getClassDef();
		if (classDef == null) {
			context.errors.push(new CompileError(this._identifierToken, "cannot determine type due to preceding errors"));
			return false;
		}
		if ((this._type = classDef.getMemberTypeByName(context.errors, context.classDefs, this._identifierToken.getValue(), ! (exprType instanceof ClassDefType))) == null) {
			context.errors.push(new CompileError(this._identifierToken, "'" + exprType.toString() + "' does not have a property named '" + this._identifierToken.getValue() + "'"));
			return false;
		}
		return true;
	},

	getType: function () {
		return this._type;
	},

	getHolderType: function () {
		var type = this._expr.getType();
		if (type instanceof PrimitiveType)
			type = new ObjectType(type.getClassDef());
		return type;
	},

	isAssignable: function (type) {
		if (! this._type.isAssignable())
			return false;
		if (! type.isConvertibleTo(this._type))
			return false;
		return true;
	},

	deduceByArgumentTypes: function (context, operatorToken, argTypes, isStatic) {
		var rhsType = this._type.deduceByArgumentTypes(context, operatorToken, argTypes, isStatic);
		if (rhsType == null)
			return null;
		this._type = rhsType;
		return rhsType;
	}

});

var TypeofExpression = exports.TypeofExpression = UnaryExpression.extend({

	initialize: function (operatorToken, expr) {
		UnaryExpression.prototype.initialize.call(this, operatorToken, expr);
	},

	analyze: function (context) {
		throw new Error("FIXME");
	},

});

var SignExpression = exports.SignExpression = UnaryExpression.extend({

	initialize: function (operatorToken, expr) {
		UnaryExpression.prototype.initialize.call(this, operatorToken, expr);
	},

	analyze: function (context) {
		if (! UnaryExpression.prototype.analyze.call(this, context))
			return false;
		if (! this.assertIsConvertibleTo(context, this._expr, Type.numberType))
			return false;
	},

	getType: function () {
		var type = this._expr.getType();
		if (type.resolveIfMayBeUndefined().equals(Type.numberType))
			return Type.numberType;
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

	getFirstExpr: function() {
		return this._expr1;
	},
	getSecondExpr: function() {
		return this._expr2;
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

	analyze: function (context) {
		if (! this._expr1.analyze(context))
			return false;
		if (! this._expr2.analyze(context))
			return false;
		return true;
	}

});

var AdditiveExpression = exports.AdditiveExpression = BinaryExpression.extend({

	initialize: function (operatorToken, expr1, expr2) {
		BinaryExpression.prototype.initialize.call(this, operatorToken, expr1, expr2);
		this._type = null;
	},

	analyze: function (context) {
		if (! BinaryExpression.prototype.analyze.call(this, context))
			return false;
		var expr1Type = this._expr1.getType().resolveIfMayBeUndefined();
		var expr2Type = this._expr2.getType().resolveIfMayBeUndefined();
		if (expr1Type.isConvertibleTo(Type.numberType) && expr2Type.isConvertibleTo(Type.numberType)) {
			// ok
			this._type = (expr1Type instanceof NumberType) || (expr2Type instanceof NumberType)
				? Type.numberType : Type.integerType;
		} else if (expr1Type.equals(Type.stringType) && expr2Type.equals(Type.stringType)) {
			// ok
			this._type = expr1Type;
		} else {
			context.errors.push(new CompileError(this._operatorToken, "cannot apply operator '+' to '" + expr1Type.toString() + "' and '" + expr2Type.toString() + "'"));
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
		this._type = null;
	},

	analyze: function (context) {
		if (! BinaryExpression.prototype.analyze.call(this, context))
			return false;
		if (this._expr1.getType() == null) {
			context.errors.push(new CompileError(this._operatorToken, "cannot determine type due to preceding errors"));
			return false;
		}
		var expr1ClassDef = this._expr1.getType().getClassDef();
		if (expr1ClassDef instanceof InstantiatedClassDefinition && expr1ClassDef.getTemplateClassName() == "Array") {
			if (! this._expr2.getType().isConvertibleTo(Type.integerType)) {
				context.errors.push(new CompileError(this._operatorToken, "array index should be a number"));
				return false;
			}
			this._type = expr1ClassDef.getTypeArguments()[0].toMayBeUndefinedType();
		} else if (expr1ClassDef instanceof InstantiatedClassDefinition && expr1ClassDef.getTemplateClassName() == "Hash") {
			if (! this._expr2.getType().isConvertibleTo(Type.stringType)) {
				context.errors.push(new CompileError(this._operatorToken, "hash key should be a string"));
				return false;
			}
			this._type = expr1ClassDef.getTypeArguments()[0].toMayBeUndefinedType();
		} else {
			context.errors.push(new CompileError(this._operatorToken, "cannot apply operator '[]' (only applicable to an array or a hash)"));
			return false;
		}
		return true;
	},

	getType: function () {
		return this._type;
	}

});

var AssignmentExpression = exports.AssignmentExpression = BinaryExpression.extend({

	initialize: function (operatorToken, expr1, expr2) {
		BinaryExpression.prototype.initialize.call(this, operatorToken, expr1, expr2);
	},

	analyze: function (context) {
		if (! BinaryExpression.prototype.analyze.call(this, context))
			return false;
		var rhsType = this._expr2.getType();
		if (rhsType == null)
			return false;
		if (rhsType.equals(Type.voidType)) {
			context.errors.push(new CompileError(this._operatorToken, "cannot assign void"));
			return false;
		}
		if (rhsType instanceof ClassDefType) {
			context.errors.push(new CompileError(this._operatorToken, "cannot assign a class"));
			return false;
		}
		if (rhsType.resolveIfMayBeUndefined().equals(Type.nullType) && this._expr1.getType() == null) {
			context.errors.push(new CompileError(this._operatorToken, "cannot assign null to an unknown type"));
			return false;
		}
		if (rhsType instanceof FunctionChoiceType) {
			var lhsType = this._expr1.getType();
			if (lhsType != null) {
				if (! (lhsType instanceof ResolvedFunctionType)) {
					context.errors.push(new CompileError(this._operatorToken, "cannot assign a function reference to '" + this._expr1.getType().toString() + "'"));
					return false;
				}
				if ((rhsType = this._expr2.deduceByArgumentTypes(context, this._operatorToken, lhsType.getArgumentTypes(), lhsType instanceof StaticFunctionType)) == null)
					return false;
			} else {
				context.errors.push(new CompileError(this._operatorToken, "function reference is ambigous"));
				return false;
			}
		}
		if (! this._expr1.isAssignable(rhsType)) {
			var lhsType = this._expr1.getType();
			if (lhsType != null)
				context.errors.push(new CompileError(this._operatorToken, "cannot assign '" + rhsType.toString() + "' to '" + lhsType.toString() + "'"));
			else
				context.errors.push(new CompileError(this._operatorToken, "cannot assign '" + rhsType.toString() + "' to an undetermined type"));
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

	analyze: function (context) {
		if (! BinaryExpression.prototype.analyze.call(this, context))
			return false;
		if (! this.assertIsConvertibleTo(context, this._expr1, Type.numberType))
			return false;
		if (! this.assertIsConvertibleTo(context, this._expr2, Type.numberType))
			return false;
		return true;
	},

	getType: function () {
		switch (this._operatorToken.getValue()) {
		case "+":
		case "-":
		case "*":
		case "/":
		case "%":
			if (this._expr1.getType().resolveIfMayBeUndefined().equals(Type.numberType) || this._expr2.getType().resolveIfMayBeUndefined().equals(Type.numberType))
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
			throw new Error("unexpected operator:" + this._operatorToken.getValue());
		}
	}

});

var EqualityExpression = exports.EqualityExpression = BinaryExpression.extend({

	initialize: function (operatorToken, expr1, expr2) {
		BinaryExpression.prototype.initialize.call(this, operatorToken, expr1, expr2);
	},

	analyze: function (context) {
		if (! BinaryExpression.prototype.analyze.call(this, context))
			return false;
		var expr1Type = this._expr1.getType();
		var expr2Type = this._expr2.getType();
		if (expr1Type.resolveIfMayBeUndefined().equals(expr2Type.resolveIfMayBeUndefined())) {
			// ok
		} else if (expr1Type.isConvertibleTo(expr2Type) || expr2Type.isConvertibleTo(expr1Type)) {
			// ok
		} else {
			context.errors.push(new CompileError(this._operatorToken, "either side of operator == should be convertible from the other"));
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

	analyze: function (context) {
		if (! BinaryExpression.prototype.analyze.call(this, context))
			return false;
		if (! this.assertIsConvertibleTo(context, this._expr1, Type.booleanType))
			return false;
		if (! this.assertIsConvertibleTo(context, this._expr2, Type.booleanType))
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

	analyze: function (context) {
		if (! BinaryExpression.prototype.analyze.call(this, context))
			return false;
		if (! this.assertIsConvertibleTo(context, this._expr1, Type.integerType))
			return false;
		if (! this.assertIsConvertibleTo(context, this._expr2, Type.integerType))
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
		this._type = null;
	},

	getCondExpr: function () {
		return this._condExpr;
	},

	getIfTrueExpr: function () {
		return this._ifTrueExpr;
	},

	getIfFalseExpr: function () {
		return this._ifFalseExpr;
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

	analyze: function (context) {
		if (! this._condExpr.analyze(context))
			return false;
		var condExprType = this._condExpr.getType();
		if (! condExprType.isConvertibleTo(Type.booleanType)) {
			context.errors.push(new CompileError(this._operatorToken, "condition should be convertible to bool"));
			return false;
		}
		var typeIfTrue;
		if (this._ifTrueExpr != null) {
			if (! this._ifTrueExpr.analyze(context))
				return false;
			typeIfTrue = this._ifTrueExpr.getType();
		} else {
			typeIfTrue = condExprType;
		}
		if (! this._ifFalseExpr.analyze(context))
			return false;
		var typeIfFalse = this._ifFalseExpr.getType();
		// FIXME how should we handle undefined?
		if (typeIfTrue.equals(typeIfFalse)) {
			// ok
			this._type = typeIfTrue;
		} else if (Type.isIntegerOrNumber(typeIfTrue) && Type.isIntegerOrNumber(typeIfFalse)) {
			// specal case
			this._type = Type.numberType;
		} else {
			context.errors.push(new CompileError(this._operatorToken, "returned types should be the same for operator ?: but got '" + typeIfTrue.toString() + "' and '" + typeIfFalse.toString() + "'"));
			return false;
		}
		return true;
	},

	getType: function () {
		return this._type;
	}

});

// invocation expressions

var CallExpression = exports.CallExpression = OperatorExpression.extend({

	initialize: function (operatorToken, expr, args) {
		OperatorExpression.prototype.initialize.call(this, operatorToken);
		this._expr = expr;
		this._args = args;
	},

	getExpr: function () {
		return this._expr;
	},

	getArguments: function () {
		return this._args;
	},

	serialize: function () {
		return [
			"CallExpression",
			this._operatorToken.serialize(),
			this._expr.serialize(),
			Util.serializeArray(this._args)
		];
	},

	analyze: function (context) {
		if (! this._expr.analyze(context))
			return false;
		var argTypes = _Util.analyzeArgs(context, this._args);
		if (argTypes == null)
			return false;
		var exprType = this._expr.getType();
		if (! (exprType instanceof FunctionType)) {
			context.errors.push(new CompileError(this._operatorToken, "cannot call a non-function"));
			return false;
		}
		if (this._expr instanceof PropertyExpression
			&& this._expr.deduceByArgumentTypes(context, this._operatorToken, argTypes, ! (this._expr.getHolderType() instanceof ObjectType)) == null)
			return false;
		return true;
	},

	getType: function () {
		return this._expr.getType().getReturnType();
	}

});

var NewExpression = exports.NewExpression = OperatorExpression.extend({

	initialize: function (operatorToken, name, args) {
		OperatorExpression.prototype.initialize.call(this, operatorToken);
		this._name = name;
		this._args = args;
		this._constructor = null; // may be null if zero constructors exist for the class
		this._type = null;
	},

	getName: function () {
		return this._name;
	},

	getArguments: function () {
		return this._args;
	},

	serialize: function () {
		return [
			"NewExpression",
			this._operatorToken.serialize(),
			Util.serializeArray(this._name),
			Util.serializeArray(this._args)
		];
	},

	analyze: function (context) {
		if (this._name.length != 1)
			throw new Error("FIXME");
		var classDef = ClassDefinition.getClass(context.classDefs, this._name[0].getValue());
		if (classDef == null) {
			context.errors.push(new CompileError(this._name[0], "no class definition for '" + this._name[0].getValue() + "'"));
			return false;
		}
		var argTypes = _Util.analyzeArgs(context, this._args);
		if (argTypes == null)
			return false;
		var ctors = classDef.getMemberTypeByName(context.errors, context.classDefs, "initialize", false);
		if (ctors != null) {
			if ((this._constructor = ctors.deduceByArgumentTypes(context, this._operatorToken, argTypes, false)) == null) {
				context.errors.push(new CompileError(this._operatorToken, "cannot create an object of type '" + this._name[0].getValue() + "', arguments mismatch"));
				return false;
			}
		}
		this._type = new ObjectType(classDef);
		return true;
	},

	getType: function () {
		return this._type;
	},

	getConstructor: function () {
		return this._constructor;
	}

});

// comma expression is not treated as a binary expression (why? it should be)

var CommaExpression = exports.CommaExpression = Expression.extend({

	initialize: function (expr1, expr2) {
		this._expr1 = expr1;
		this._expr2 = expr2;
	},

	getFirstExpr: function () {
		return this._expr1;
	},

	getSecondExpr: function () {
		return this._expr2;
	},

	serialize: function () {
		return [
			"CommaExpression",
			this._expr1.serialize(),
			this._expr2.serialize()
		];
	},

	analyze: function (context) {
		return this._expr1.analyze(context)
			&& this._expr2.analyze(context);
	},

	getType: function () {
		return this._expr2.getType();
	}

});
// vim: set noexpandtab:
