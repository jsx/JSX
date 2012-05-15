var Class = require("./Class");
eval(Class.$import("./classdef"));
eval(Class.$import("./type"));
eval(Class.$import("./util"));
var Statement = require("./statement");

"use strict";

var Expression = exports.Expression = Class.extend({

	constructor: function (token) {
		this._token = token;
	},

	getToken: function () {
		return this._token;
	},

	analyze: null, // bool analyze(context, parentExpr)

	getType: null, // string getType()

	getHolderType: function () {
		return null;
	},

	forEachCodeElement: null, // function forEachCodeElement(cb : function (expr)) : boolean

	assertIsAssignable: function (context, token, type) {
		context.errors.push(new CompileError(token, "left-hand-side expression is not assignable"));
		return false;
	},

	$assertIsAssignable: function (context, token, lhsType, rhsType) {
		if (! lhsType.isAssignable()) {
			context.errors.push(new CompileError("left-hand-side expression is not assignable"));
			return false;
		}
		if (! rhsType.isConvertibleTo(lhsType)) {
			context.errors.push(new CompileError(token, "cannot assign a value of type '" + rhsType.toString() + "' to '" + lhsType.toString() + "'"));
			return false;
		}
		return true;
	}

});

var LeafExpression = exports.LeafExpression = Expression.extend({

	constructor: function (token) {
		Expression.prototype.constructor.call(this, token);
	},

	forEachCodeElement: function (cb) {
		return true;
	}

});

var OperatorExpression = exports.OperatorExpression = Expression.extend({

	constructor: function (token) {
		Expression.prototype.constructor.call(this, token);
	},

	assertIsConvertibleTo: function (context, expr, type, mayUnbox) {
		var exprType = expr.getType().resolveIfMayBeUndefined();
		if (mayUnbox && type instanceof PrimitiveType && exprType instanceof ObjectType && exprType.getClassDef() == type.getClassDef())
			return true;
		if (! exprType.isConvertibleTo(type)) {
			context.errors.push(new CompileError(this._token, "cannot apply operator '" + this._token.getValue() + "' to type '" + exprType.toString() + "'"));
			return false;
		}
		return true;
	}

});

// primary expressions

var IdentifierExpression = exports.IdentifierExpression = LeafExpression.extend({

	constructor: function (token) {
		LeafExpression.prototype.constructor.call(this, token);
		this._local = null;
		this._classDefType = null;
	},

	getLocal: function () {
		return this._local;
	},

	serialize: function () {
		if (this._local != null)
			return [
				"IdentifierExpression",
				this._token.serialize(),
				"local",
				Util.serializeNullable(this._local)
			];
		else
			return [
				"IdentifierExpression",
				this._token.serialize(),
				"classDef"
			];
	},

	analyze: function (context, parentExpr) {
		// if it is an access to local variable, return ok
		if (context.funcDef != null && (this._local = context.funcDef.getLocal(context, this._token.getValue())) != null) {
			// check that the variable is readable
			if ((parentExpr instanceof AssignmentExpression && parentExpr.getFirstExpr() == this)
				|| (parentExpr == null && context.statement instanceof Statement.ForInStatement && context.statement.getLHSExpr() == this)) {
				// is LHS
			} else {
				this._local.touchVariable(context, this._token, false);
				if (this._local.getType() == null)
					return false;
			}
			return true;
		}
		// access to class
		var classDef = context.parser.lookup(context.errors, this._token, this._token.getValue());
		if (classDef == null) {
			if (context.funcDef != null)
				context.errors.push(new CompileError(this._token, "local variable '" + this._token.getValue() + "' is not declared"));
			else
				context.errors.push(new CompileError(this._token, "could not find definition of class '" + this._token.getValue() + "'"));
			return false;
		}
		this._classDefType = new ClassDefType(classDef);
		return true;
	},

	getType: function () {
		if (this._local != null)
			return this._local.getType();
		else
			return this._classDefType;
	},

	assertIsAssignable: function (context, token, type) {
		if (this._local != null) {
			if (this._local.getType() == null) {
				if (type.equals(Type.undefinedType)) {
					context.errors.push(new CompileError(token, "cannot assign an undefined type to a value of undetermined type"));
					return false;
				}
				this._local.setType(type.asAssignableType());
			} else if (! type.isConvertibleTo(this._local.getType())) {
				context.errors.push(new CompileError(token, "cannot assign a value of type '" + type.toString() + "' to '" + this._local.getType() + "'"));
				return false;
			}
			this._local.touchVariable(context, this._token, true);
		} else {
			errors.push(new CompileError(token, "cannot modify a class definition"));
			return false;
		}
		return true;
	}

});

var UndefinedExpression = exports.UndefinedExpression = LeafExpression.extend({

	constructor: function (token) {
		LeafExpression.prototype.constructor.call(this, token);
	},

	serialize: function () {
		return [
			"UndefinedExpression",
			this._token.serialize()
		];
	},

	analyze: function (context, parentExpr) {
		return true;
	},

	getType: function () {
		return Type.undefinedType;
	}

});

var NullExpression = exports.NullExpression = LeafExpression.extend({

	constructor: function (token, type) {
		LeafExpression.prototype.constructor.call(this, token);
		this._type = type;
	},

	serialize: function () {
		return [
			"NullExpression",
			this._token.serialize(),
			this._type.serialize()
		];
	},

	analyze: function (context, parentExpr) {
		return true;
	},

	getType: function () {
		return this._type;
	}

});

var BooleanLiteralExpression = exports.BooleanLiteralExpression = LeafExpression.extend({

	constructor: function (token) {
		LeafExpression.prototype.constructor.call(this, token);
	},

	serialize: function () {
		return [
			"BooleanLiteralExpression",
			this._token.serialize()
		];
	},

	analyze: function (context, parentExpr) {
		return true;
	},

	getType: function () {
		return Type.booleanType;
	}

});

var IntegerLiteralExpression = exports.IntegerLiteralExpression = LeafExpression.extend({

	constructor: function (token) {
		LeafExpression.prototype.constructor.call(this, token);
	},

	serialize: function () {
		return [
			"IntegerLiteralExpression",
			this._token.serialize()
		];
	},

	analyze: function (context, parentExpr) {
		return true;
	},

	getType: function () {
		return Type.integerType;
	}

});


var NumberLiteralExpression = exports.NumberLiteralExpression = LeafExpression.extend({

	constructor: function (token) {
		LeafExpression.prototype.constructor.call(this, token);
	},

	serialize: function () {
		return [
			"NumberLiteralExpression",
			this._token.serialize()
		];
	},

	analyze: function (context, parentExpr) {
		return true;
	},

	getType: function () {
		return Type.numberType;
	}

});

var StringLiteralExpression = exports.StringLiteralExpression = LeafExpression.extend({

	constructor: function (token) {
		LeafExpression.prototype.constructor.call(this, token);
	},

	serialize: function () {
		return [
			"StringLiteralExpression",
			this._token.serialize()
		];
	},

	analyze: function (context, parentExpr) {
		return true;
	},

	getType: function () {
		return Type.stringType;
	}

});

var RegExpLiteralExpression = exports.RegExpLiteralExpression = LeafExpression.extend({

	constructor: function (token) {
		LeafExpression.prototype.constructor.call(this, token);
		this._type = null;
	},

	serialize: function () {
		return [
			"RegExpLiteralExpression",
			this._token.serialize()
		];
	},

	analyze: function (context, parentExpr) {
		var classDef = context.parser.lookup(context.errors, this._token, "RegExp");
		if (classDef == null)
			throw new Error("could not find definition for RegExp");
		this._type = new ObjectType(classDef);
		return true;
	},

	getType: function () {
		return this._type;
	}

});

var ArrayLiteralExpression = exports.ArrayLiteralExpression = Expression.extend({

	constructor: function (token, exprs, type) {
		Expression.prototype.constructor.call(this, token);
		this._exprs = exprs;
		this._type = type; // optional at this moment
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

	analyze: function (context, parentExpr) {
		// analyze all elements
		var succeeded = true;
		for (var i = 0; i < this._exprs.length; ++i) {
			if (! this._exprs[i].analyze(context, this)) {
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
	},

	forEachCodeElement: function (cb) {
		if (! Util.forEachCodeElement(cb, this._exprs))
			return false;
		return true;
	}

});

var MapLiteralElement = exports.MapLiteralElement = Class.extend({

	constructor: function (key, expr) {
		this._key = key;
		this._expr = expr;
	},

	getKey: function () {
		return this._key;
	},

	getExpr: function () {
		return this._expr;
	},

	serialize: function () {
		return [
			this._key.serialize(),
			this._expr.serialize()
		];
	}

});

var MapLiteralExpression = exports.MapLiteralExpression = Expression.extend({

	constructor: function (token, elements, type) {
		Expression.prototype.constructor.call(this, token);
		this._elements = elements;
		this._type = type; // optional at this moment
	},

	getElements: function () {
		return this._elements;
	},

	getType: function () {
		return this._type;
	},

	serialize: function () {
		return [
			"MapLiteralExpression",
			this._token.serialize(),
			Util.serializeArray(this._elements),
			Util.serializeNullable(this._type)
		];
	},

	analyze: function (context, parentExpr) {
		// analyze all elements
		var succeeded = true;
		for (var i = 0; i < this._elements.length; ++i) {
			if (! this._elements[i].getExpr().analyze(context, this)) {
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
			if (! (classDef instanceof InstantiatedClassDefinition && classDef.getTemplateClassName() == "Map")) {
				context.errors.push(new CompileError(this._token, "specified type is not a hash type"));
				return false;
			}
		} else {
			for (var i = 0; i < this._elements.length; ++i) {
				var elementType = this._elements[i].getExpr().getType();
				if (! elementType.equals(Type.nullType)) {
					if (elementType.equals(Type.integerType))
						elementType = Type.numberType;
					var instantiatedClass = context.instantiateTemplate(context.errors, new TemplateInstantiationRequest(this._token, "Map", [ elementType ]));
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
	},

	forEachCodeElement: function (cb) {
		for (var i = 0; i < this._elements.length; ++i)
			if (! cb(this._elements[i].getExpr()))
				return false;
		return true;
	}

});

var ThisExpression = exports.ThisExpression = Expression.extend({

	constructor: function (token) {
		Expression.prototype.constructor.call(this, token);
		this._classDef = null;
	},

	serialize: function () {
		return [
			"ThisExpression",
			this._token.serialize(),
			Util.serializeNullable(this._classDef)
		];
	},

	analyze: function (context, parentExpr) {
		var rootFuncDef = context.funcDef;
		while (rootFuncDef.getParent() != null)
			rootFuncDef = rootFuncDef.getParent();
		if ((rootFuncDef.flags() & ClassDefinition.IS_STATIC) != 0) {
			context.errors.push(new CompileError(this._token, "cannot use 'this' within a static function"));
			return false;
		}
		this._classDef = rootFuncDef.getClassDef();
		return true;
	},

	getType: function () {
		return new ObjectType(this._classDef);
	},

	forEachCodeElement: function (cb) {
		return true;
	}

});

var FunctionExpression = exports.FunctionExpression = Expression.extend({

	constructor: function (token, funcDef) {
		Expression.prototype.constructor.call(this, token);
		this._funcDef = funcDef;
	},

	getFuncDef: function () {
		return this._funcDef;
	},

	serialize: function () {
		return [
			"FunctionExpression",
			this._funcDef.serialize()
		];
	},

	analyze: function (context, parentExpr) {
		this._funcDef.analyze(context);
		return true; // return true since everything is resolved correctly even if analysis of the function definition failed
	},

	getType: function () {
		return new StaticFunctionType(this._funcDef.getReturnType(), this._funcDef.getArgumentTypes(), false);
	},

	forEachCodeElement: function (cb) {
		return cb(this._funcDef);
	}

});

// unary expressions

var UnaryExpression = exports.UnaryExpression = OperatorExpression.extend({

	constructor: function (operatorToken, expr) {
		OperatorExpression.prototype.constructor.call(this, operatorToken);
		this._expr = expr;
	},

	getExpr: function () {
		return this._expr;
	},

	serialize: function () {
		return [
			"UnaryExpression",
			this._token.serialize(),
			this._expr.serialize()
		];
	},

	_analyze: function (context) {
		if (! this._expr.analyze(context, this))
			return false;
		if (this._expr.getType().equals(Type.voidType)) {
			context.errors.push(new CompileError(this._token, "cannot apply operator '" + this._token.getValue() + "' against void"));
			return false;
		}
		return true;
	},

	forEachCodeElement: function (cb) {
		return cb(this._expr);
	}

});

var BitwiseNotExpression = exports.BitwiseNotExpression = UnaryExpression.extend({

	constructor: function (operatorToken, expr) {
		UnaryExpression.prototype.constructor.call(this, operatorToken, expr);
	},

	analyze: function (context, parentExpr) {
		if (! this._analyze(context))
			return false;
		if (! this.assertIsConvertibleTo(context, this._expr, Type.numberType, false))
			return false;
		return true;
	},

	getType: function () {
		return Type.integerType;
	}

});

var InstanceofExpression = exports.InstanceofExpression = UnaryExpression.extend({

	constructor: function (operatorToken, expr, expectedType) {
		UnaryExpression.prototype.constructor.call(this, operatorToken, expr);
		this._expectedType = expectedType;
	},

	getExpectedType: function () {
		return this._expectedType;
	},

	serialize: function () {
		return [
			"InstanceofExpression",
			this._expr.serialize(),
			this._expectedType.serialize()
		];
	},

	analyze: function (context, parentExpr) {
		if (! this._analyze(context))
			return false;
		if (! (this._expr.getType() instanceof ObjectType)) {
			context.errors.push(new CompileError(this._token, "operator 'instanceof' is only applicable to an object"));
			return false;
		}
		return true;
	},

	getType: function () {
		return Type.booleanType;
	}

});

var AsExpression = exports.AsExpression = UnaryExpression.extend({

	constructor: function (operatorToken, expr, type) {
		UnaryExpression.prototype.constructor.call(this, operatorToken, expr);
		this._type = type;
	},

	serialize: function () {
		return [
			"AsExpression",
			this._expr.serialize(),
			this._type.serialize()
		];
	},

	analyze: function (context, parentExpr) {
		if (! this._analyze(context))
			return false;
		if (this._type instanceof MayBeUndefinedType) {
			context.errors.push(new CompileError(this._token, "right operand of 'as' expression cannot be a MayBeUndefined<T> type"));
			return false;
		}
		// nothing to care if the conversion is allowed by implicit conversion
		if (this._expr.getType().isConvertibleTo(this._type))
			return true;
		// possibly unsafe conversions
		var exprType = this._expr.getType().resolveIfMayBeUndefined();
		var success = false;
		if (exprType.equals(Type.undefinedType)) {
			if (this._type instanceof MayBeUndefinedType || this._type.equals(Type.variantType)) {
				// ok
				success = true;
			}
		} else if (exprType.equals(Type.nullType)) {
			if (this._type instanceof ObjectType || this._type instanceof FunctionType) {
				// ok
				success = true;
			}
		} else if (exprType instanceof PrimitiveType) {
			if (this._type instanceof PrimitiveType) {
				// ok: primitive => primitive
				success = true;
			}
		} else if (exprType.equals(Type.variantType)) {
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
			context.errors.push(new CompileError(this._token, "cannot convert a value of type '" + this._expr.getType().toString() + "' to '" + this._type.toString() + "'"));
			return false;
		}
		return true;
	},

	getType: function () {
		return this._type;
	}

});

var AsNoConvertExpression = exports.AsNoConvertExpression = UnaryExpression.extend({

	constructor: function (operatorToken, expr, type) {
		UnaryExpression.prototype.constructor.call(this, operatorToken, expr);
		this._type = type;
	},

	serialize: function () {
		return [
			"AsNoConvertExpression",
			this._expr.serialize(),
			this._type.serialize()
		];
	},

	analyze: function (context, parentExpr) {
		if (! this._analyze(context))
			return false;
		var srcType = this._expr.getType();
		if ((srcType.equals(Type.undefinedType) && ! (this._type.equals(Type.variantType) || this._type instanceof MayBeUndefinedType))
			|| (srcType.equals(Type.nullType) && ! (this._type instanceof ObjectType || this._type instanceof FunctionType))) {
			context.errors.push(new CompileError(this._token, "'" + srcType.toString() + "' cannot be treated as a value of type '" + this._type.toString() + "'"));
			return false;
		}
		return true;
	},

	getType: function () {
		return this._type;
	}

});

var LogicalNotExpression = exports.LogicalNotExpression = UnaryExpression.extend({

	constructor: function (operatorToken, expr) {
		UnaryExpression.prototype.constructor.call(this, operatorToken, expr);
	},

	analyze: function (context, parentExpr) {
		if (! this._analyze(context))
			return false;
		if (! this.assertIsConvertibleTo(context, this._expr, Type.booleanType, false))
			return false;
		return true;
	},

	getType: function () {
		return Type.booleanType;
	}

});

var IncrementExpression = exports.IncrementExpression = UnaryExpression.extend({

	constructor: function (operatorToken, expr) {
		UnaryExpression.prototype.constructor.call(this, operatorToken, expr);
	},

	serialize: function () {
		return [
			this._getClassName(),
			this._token.serialize(),
			this._expr.serialize()
		];
	},

	analyze: function (context, parentExpr) {
		if (! this._analyze(context))
			return false;
		var exprType = this._expr.getType();
		if (exprType.resolveIfMayBeUndefined().equals(Type.integerType) || exprType.resolveIfMayBeUndefined().equals(Type.numberType)) {
			// ok
		} else {
			context.errors.push(new CompileError(this._token, "cannot apply operator '" + this._token.getValue() + "' to a non-number"));
			return false;
		}
		if (! this._expr.assertIsAssignable(context, this._token, exprType))
			return false;
		return true;
	},

	getType: function () {
		return this._expr.getType().resolveIfMayBeUndefined();
	}

});

var PostIncrementExpression = exports.PostIncrementExpression = IncrementExpression.extend({

	constructor: function (operatorToken, expr) {
		IncrementExpression.prototype.constructor.call(this, operatorToken, expr);
	},

	_getClassName: function() {
		return "PostIncrementExpression";
	}

});

var PreIncrementExpression = exports.PreIncrementExpression = IncrementExpression.extend({

	constructor: function (operatorToken, expr) {
		IncrementExpression.prototype.constructor.call(this, operatorToken, expr);
	},

	_getClassName: function() {
		return "PreIncrementExpression";
	}

});

var PropertyExpression = exports.PropertyExpression = UnaryExpression.extend({

	constructor: function (operatorToken, expr1, identifierToken) {
		UnaryExpression.prototype.constructor.call(this, operatorToken, expr1);
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

	analyze: function (context, parentExpr) {
		// special handling for import ... as
		var imprt;
		if (this._expr instanceof IdentifierExpression
			&& (imprt = context.parser.lookupImportAlias(this._expr.getToken().getValue())) != null) {
			var classDef = imprt.getClass(this._identifierToken.getValue());
			if (classDef == null) {
				context.errors.push(new CompileError(this._identifierToken, "could not resolve class '" + this._expr.getToken().getValue() + "'"));
				return null;
			}
			this._type = new ClassDefType(classDef);
			return true;
		}
		// normal handling
		if (! this._analyze(context))
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
		if (exprType.resolveIfMayBeUndefined().equals(Type.variantType)) {
			context.errors.push(new CompileError(this._identifierToken, "cannot obtain a member of variant, use: (<<expr>> as Map.<type>)[<<name>>]"));
			return false;
		}
		var classDef = exprType.getClassDef();
		if (classDef == null) {
			context.errors.push(new CompileError(this._identifierToken, "cannot determine type due to preceding errors"));
			return false;
		}
		this._type = classDef.getMemberTypeByName(
			this._identifierToken.getValue(),
			exprType instanceof ClassDefType,
			(exprType instanceof ClassDefType) ? ClassDefinition.GET_MEMBER_MODE_CLASS_ONLY : ClassDefinition.GET_MEMBER_MODE_ALL);
		if (this._type == null) {
			context.errors.push(new CompileError(this._identifierToken, "'" + exprType.toString() + "' does not have a property named '" + this._identifierToken.getValue() + "'"));
			return false;
		}
		return true;
	},

	getType: function () {
		return this._type;
	},

	getHolderType: function () {
		if (this._type instanceof ClassDefType)
			return null;
		var type = this._expr.getType();
		if (type instanceof PrimitiveType)
			type = new ObjectType(type.getClassDef());
		return type;
	},

	assertIsAssignable: function (context, token, type) {
		return Expression.assertIsAssignable(context, token, this._type, type);
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

	constructor: function (operatorToken, expr) {
		UnaryExpression.prototype.constructor.call(this, operatorToken, expr);
	},

	analyze: function (context, parentExpr) {
		if (! this._analyze(context))
			return false;
		if (! this._expr.getType().equals(Type.variantType)) {
			context.errors.push(new CompileError(this._token, "cannot apply operator 'typeof' to '" + this._expr.getType().toString() + "'"));
			return false;
		}
		return true;
	},

	getType: function () {
		return Type.stringType;
	}

});

var SignExpression = exports.SignExpression = UnaryExpression.extend({

	constructor: function (operatorToken, expr) {
		UnaryExpression.prototype.constructor.call(this, operatorToken, expr);
	},

	analyze: function (context, parentExpr) {
		if (! this._analyze(context))
			return false;
		if (! this.assertIsConvertibleTo(context, this._expr, Type.numberType, true))
			return false;
		return true;
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

	constructor: function (operatorToken, expr1, expr2) {
		OperatorExpression.prototype.constructor.call(this, operatorToken);
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
			this._token.serialize(),
			this._expr1.serialize(),
			this._expr2.serialize()/*,
			Util.serializeNullable(this.getType())*/
		];
	},

	_analyze: function (context) {
		if (! this._expr1.analyze(context, this))
			return false;
		if (! this._expr2.analyze(context, this))
			return false;
		return true;
	},

	forEachCodeElement: function (cb) {
		if (! cb(this._expr1))
			return false;
		if (! cb(this._expr2))
			return false;
		return true;
	}

});

var AdditiveExpression = exports.AdditiveExpression = BinaryExpression.extend({

	constructor: function (operatorToken, expr1, expr2) {
		BinaryExpression.prototype.constructor.call(this, operatorToken, expr1, expr2);
		this._type = null;
	},

	analyze: function (context, parentExpr) {
		if (! this._analyze(context))
			return false;
		var expr1Type = this._expr1.getType().resolveIfMayBeUndefined();
		var expr2Type = this._expr2.getType().resolveIfMayBeUndefined();
		if ((expr1Type.isConvertibleTo(Type.numberType) || (expr1Type instanceof ObjectType && expr1Type.getClassDef() == Type.numberType.getClassDef()))
			&& (expr2Type.isConvertibleTo(Type.numberType) || (expr2Type instanceof ObjectType && expr2Type.getClassDef() == Type.numberType.getClassDef()))) {
			// ok
			this._type = (expr1Type instanceof NumberType) || (expr2Type instanceof NumberType)
				? Type.numberType : Type.integerType;
		} else if ((expr1Type.equals(Type.stringType) || (expr1Type instanceof ObjectType && expr1Type.getClassDef() == Type.stringType.getClassDef()))
			&& (expr2Type.equals(Type.stringType) || (expr2Type instanceof ObjectType && expr2Type.getClassDef() == Type.stringType.getClassDef()))) {
			// ok
			this._type = expr1Type;
		} else {
			context.errors.push(new CompileError(this._token, "cannot apply operator '+' to '" + expr1Type.toString() + "' and '" + expr2Type.toString() + "'"));
			return false;
		}
		return true;
	},

	getType: function () {
		return this._type;
	}
});

var ArrayExpression = exports.ArrayExpression = BinaryExpression.extend({

	constructor: function (operatorToken, expr1, expr2) {
		BinaryExpression.prototype.constructor.call(this, operatorToken, expr1, expr2);
		this._type = null;
	},

	analyze: function (context, parentExpr) {
		if (! this._analyze(context))
			return false;
		if (this._expr1.getType() == null) {
			context.errors.push(new CompileError(this._token, "cannot determine type due to preceding errors"));
			return false;
		}
		// obtain classDef
		var expr1Type = this._expr1.getType().resolveIfMayBeUndefined();
		if (! (expr1Type instanceof ObjectType)) {
			context.errors.push(new CompileError(this._token, "cannot apply operator[] against a non-object"));
			return false;
		}
		var expr1ClassDef = expr1Type.getClassDef();;
		// obtain type of operator []
		var accessorType = expr1ClassDef.getMemberTypeByName("__native_index_operator__", false, ClassDefinition.GET_MEMBER_MODE_ALL);
		if (accessorType == null) {
			context.errors.push(new CompileError(this._token, "cannot apply operator[] on an instance of class '" + expr1ClassDef.className() + "'"));
			return false;
		}
		if (accessorType instanceof FunctionChoiceType) {
			context.errors.push(new CompileError(this._token, "override of '__native_index_operator__' is not supported"));
			return false;
		}
		if (accessorType.getArgumentTypes().length != 1) {
			context.errors.push(new CompileError(this._token, "unexpected number of arguments taken by '__native_index_operator__'"));
			return false;
		}
		// check type of expr2
		if (! this._expr2.getType().isConvertibleTo(accessorType.getArgumentTypes()[0])) {
			context.errors.push(new CompileError(this._token, "index type is incompatible (expected '" + accessorType.getArgumentTypes()[0].toString() + "', got '" + this._expr2.getType().toString() + "'"));
			return false;
		}
		// set type of the expression
		this._type = accessorType.getReturnType();
		return true;
	},

	getType: function () {
		return this._type;
	},

	assertIsAssignable: function (context, token, type) {
		return Expression.assertIsAssignable(context, token, this._type, type);
	}

});

var AssignmentExpression = exports.AssignmentExpression = BinaryExpression.extend({

	constructor: function (operatorToken, expr1, expr2) {
		BinaryExpression.prototype.constructor.call(this, operatorToken, expr1, expr2);
	},

	analyze: function (context, parentExpr) {
		if (! this._analyze(context))
			return false;
		var rhsType = this._expr2.getType();
		if (rhsType == null)
			return false;
		if (rhsType.equals(Type.voidType)) {
			context.errors.push(new CompileError(this._token, "cannot assign void"));
			return false;
		}
		if (rhsType instanceof ClassDefType) {
			context.errors.push(new CompileError(this._token, "cannot assign a class"));
			return false;
		}
		if (rhsType.resolveIfMayBeUndefined().equals(Type.nullType) && this._expr1.getType() == null) {
			context.errors.push(new CompileError(this._token, "cannot assign null to an unknown type"));
			return false;
		}
		if (rhsType instanceof FunctionChoiceType) {
			var lhsType = this._expr1.getType();
			if (lhsType != null) {
				if (! (lhsType instanceof ResolvedFunctionType)) {
					context.errors.push(new CompileError(this._token, "cannot assign a function reference to '" + this._expr1.getType().toString() + "'"));
					return false;
				}
				if ((rhsType = this._expr2.deduceByArgumentTypes(context, this._token, lhsType.getArgumentTypes(), lhsType instanceof StaticFunctionType)) == null)
					return false;
			} else {
				context.errors.push(new CompileError(this._token, "function reference is ambigous"));
				return false;
			}
		}
		if (! this._expr1.assertIsAssignable(context, this._token, rhsType))
			return false;
		return true;
	},

	getType: function () {
		return this._expr1.getType();
	}

});

// + - * / % < <= > >= & | ^
var BinaryNumberExpression = exports.BinaryNumberExpression = BinaryExpression.extend({

	constructor: function (operatorToken, expr1, expr2) {
		BinaryExpression.prototype.constructor.call(this, operatorToken, expr1, expr2);
	},

	analyze: function (context, parentExpr) {
		if (! this._analyze(context))
			return false;
		var expr1Type = this._expr1.getType().resolveIfMayBeUndefined();
		if (! this.assertIsConvertibleTo(context, this._expr1, Type.numberType, true))
			return false;
		var expr2Type = this._expr2.getType().resolveIfMayBeUndefined();
		if (! this.assertIsConvertibleTo(context, this._expr2, Type.numberType, true))
			return false;
		return true;
	},

	getType: function () {
		switch (this._token.getValue()) {
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
			throw new Error("unexpected operator:" + this._token.getValue());
		}
	}

});

var EqualityExpression = exports.EqualityExpression = BinaryExpression.extend({

	constructor: function (operatorToken, expr1, expr2) {
		BinaryExpression.prototype.constructor.call(this, operatorToken, expr1, expr2);
	},

	analyze: function (context, parentExpr) {
		if (! this._analyze(context))
			return false;
		var expr1Type = this._expr1.getType();
		var expr2Type = this._expr2.getType();
		if (expr1Type.resolveIfMayBeUndefined().equals(expr2Type.resolveIfMayBeUndefined())) {
			// ok
		} else if (expr1Type.isConvertibleTo(expr2Type) || expr2Type.isConvertibleTo(expr1Type)) {
			// ok
		} else if ((expr1Type instanceof ObjectType) + (expr2Type instanceof ObjectType) == 1
			&& expr1Type.getClassDef() == expr2Type.getClassDef()) {
			// ok, either side is an object and the other is the primitive counterpart
		} else {
			context.errors.push(new CompileError(this._token, "either side of operator == should be convertible from the other"));
			return false;
		}
		return true;
	},

	getType: function () {
		return Type.booleanType;
	}

});

var InExpression = exports.InExpression = BinaryExpression.extend({

	constructor: function (operatorToken, expr1, expr2) {
		BinaryExpression.prototype.constructor.call(this, operatorToken, expr1, expr2);
	},

	analyze: function (context, parentExpr) {
		if (! this._analyze(context))
			return false;
		if (! this._expr1.getType().resolveIfMayBeUndefined().equals(Type.stringType)) {
			context.errors.push(new CompileError(this._token, "left operand of 'in' expression should be a string"));
			return false;
		}
		var expr2Type;
		var expr2ClassDef;
		if ((expr2Type = this._expr2.getType().resolveIfMayBeUndefined()) instanceof ObjectType
			&& (expr2ClassDef = expr2Type.getClassDef()) instanceof InstantiatedClassDefinition
			&& expr2ClassDef.getTemplateClassName() == "Map") {
			// ok
		} else {
			context.errors.push(new CompileError(this._token, "right operand of 'in' expression should be a map"));
			return false;
		}
		return true;
	},

	getType: function () {
		return Type.booleanType;
	}

});

var LogicalExpression = exports.LogicalExpression = BinaryExpression.extend({

	constructor: function (operatorToken, expr1, expr2) {
		BinaryExpression.prototype.constructor.call(this, operatorToken, expr1, expr2);
	},

	analyze: function (context, parentExpr) {
		if (! this._analyze(context))
			return false;
		if (! this.assertIsConvertibleTo(context, this._expr1, Type.booleanType, false))
			return false;
		if (! this.assertIsConvertibleTo(context, this._expr2, Type.booleanType, false))
			return false;
		return true;
	},

	getType: function () {
		return Type.booleanType;
	}

});

var ShiftExpression = exports.ShiftExpression = BinaryExpression.extend({

	constructor: function (operatorToken, expr1, expr2) {
		BinaryExpression.prototype.constructor.call(this, operatorToken, expr1, expr2);
	},

	analyze: function (context, parentExpr) {
		if (! this._analyze(context))
			return false;
		if (! this.assertIsConvertibleTo(context, this._expr1, Type.integerType, true))
			return false;
		if (! this.assertIsConvertibleTo(context, this._expr2, Type.integerType, true))
			return false;
		return true;
	},

	getType: function () {
		return Type.integerType;
	}

});

// (the only) tertary expression

var ConditionalExpression = exports.ConditionalExpression = OperatorExpression.extend({

	constructor: function (operatorToken, condExpr, ifTrueExpr, ifFalseExpr) {
		OperatorExpression.prototype.constructor.call(this, operatorToken);
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
			this._token.serialize(),
			this._condExpr.serialize(),
			Util.serializeNullable(this._ifTrueExpr),
			this._ifFalseExpr.serialize()
		];
	},

	analyze: function (context, parentExpr) {
		if (! this._condExpr.analyze(context, this))
			return false;
		var condExprType = this._condExpr.getType();
		if (! condExprType.isConvertibleTo(Type.booleanType)) {
			context.errors.push(new CompileError(this._token, "condition should be convertible to bool"));
			return false;
		}
		var typeIfTrue;
		if (this._ifTrueExpr != null) {
			if (! this._ifTrueExpr.analyze(context, this))
				return false;
			typeIfTrue = this._ifTrueExpr.getType();
		} else {
			typeIfTrue = condExprType;
		}
		if (! this._ifFalseExpr.analyze(context, this))
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
			context.errors.push(new CompileError(this._token, "returned types should be the same for operator ?: but got '" + typeIfTrue.toString() + "' and '" + typeIfFalse.toString() + "'"));
			return false;
		}
		return true;
	},

	getType: function () {
		return this._type;
	},

	forEachCodeElement: function (cb) {
		if (! cb(this._condExpr))
			return false;
		if (this._ifTrueExpr != null && ! cb(this._ifTrueExpr))
			return false;
		if (! cb(this._ifFalseExpr))
			return false;
		return true;
	}

});

// invocation expressions

var CallExpression = exports.CallExpression = OperatorExpression.extend({

	constructor: function (operatorToken, expr, args) {
		OperatorExpression.prototype.constructor.call(this, operatorToken);
		this._expr = expr;
		this._args = args;
		this._callingFuncDef = null; // should become an interface, see ConstructorInvocationStatement
	},

	getExpr: function () {
		return this._expr;
	},

	getArguments: function () {
		return this._args;
	},

	getCallingFuncDef: function () {
		return this._callingFuncDef;
	},

	setCallingFuncDef: function (funcDef) {
		this._callingFuncDef = funcDef;
	},

	serialize: function () {
		return [
			"CallExpression",
			this._token.serialize(),
			this._expr.serialize(),
			Util.serializeArray(this._args)
		];
	},

	analyze: function (context, parentExpr) {
		if (! this._expr.analyze(context, this))
			return false;
		var argTypes = Util.analyzeArgs(context, this._args, this);
		if (argTypes == null)
			return false;
		var exprType = this._expr.getType().resolveIfMayBeUndefined();
		if (! (exprType instanceof FunctionType)) {
			context.errors.push(new CompileError(this._token, "cannot call a non-function"));
			return false;
		}
		if (this._expr instanceof PropertyExpression
			&& ! exprType.isAssignable()
			&& this._expr.deduceByArgumentTypes(context, this._token, argTypes, (this._expr.getHolderType() instanceof ClassDefType)) == null)
			return false;
		return true;
	},

	getType: function () {
		return this._expr.getType().getReturnType();
	},

	forEachCodeElement: function (cb) {
		if (! cb(this._expr))
			return false;
		if (! Util.forEachCodeElement(this._args))
			return false;
		return true;
	}

});

var SuperExpression = exports.SuperExpression = OperatorExpression.extend({

	constructor: function (operatorToken, name, args) {
		OperatorExpression.prototype.constructor.call(this, operatorToken);
		this._name = name;
		this._args = args;
		this._funcType = null;
	},

	getName: function () {
		return this._name;
	},

	getArguments: function () {
		return this._args;
	},

	getFunctionType: function () {
		return this._funcType;
	},
		
	serialize: function () {
		return [
			"SuperExpression",
			this._token.serialize(),
			this._name.serialize(),
			Util.serializeArray(this._args),
			Util.serializeNullable(this._classDef),
		];
	},

	analyze: function (context, parentExpr) {
		// obtain class definition
		if ((context.funcDef.flags() & ClassDefinition.IS_STATIC) != 0) {
			context.errors.push(new CompileError(this._token, "cannot use 'super' keyword in a static function"));
			return false;
		}
		var classDef = context.funcDef.getClassDef();
		// analyze args
		var argTypes = Util.analyzeArgs(context, this._args, this);
		if (argTypes == null)
			return false;
		// lookup function
		var funcType = null;
		if ((funcType = classDef.getMemberTypeByName(this._name.getValue(), false, ClassDefinition.GET_MEMBER_MODE_SUPER)) == null) {
			context.errors.push(new CompileError(this._token, "could not find a member function with given name in super classes of class '" + classDef.className() + "'"));
			return false;
		}
		if ((funcType = funcType.deduceByArgumentTypes(context, this._token, argTypes, false)) == null)
			return false;
		// success
		this._funcType = funcType;
		return true;
	},

	getType: function () {
		return this._funcType.getReturnType();
	},

	forEachCodeElement: function (cb) {
		if (! Util.forEachCodeElement(this._args))
			return false;
		return true;
	}

});

var NewExpression = exports.NewExpression = OperatorExpression.extend({

	constructor: function (operatorToken, qualifiedName, args) {
		OperatorExpression.prototype.constructor.call(this, operatorToken);
		this._qualifiedName = qualifiedName;
		this._args = args;
		this._constructor = null; // may be null if zero constructors exist for the class
		this._type = null;
	},

	getQualifiedName: function () {
		return this._name;
	},

	getArguments: function () {
		return this._args;
	},

	serialize: function () {
		return [
			"NewExpression",
			this._token.serialize(),
			this._qualifiedName.serialize(),
			Util.serializeArray(this._args)
		];
	},

	analyze: function (context, parentExpr) {
		var classDef = this._qualifiedName.getClass(context);
		if (classDef == null)
			return false;
		if ((classDef.flags() & (ClassDefinition.IS_INTERFACE | ClassDefinition.IS_MIXIN)) != 0) {
			context.errors.push(new CompileError(this._qualifiedName.getToken(), "cannot instantiate an interface or a mixin"));
			return false;
		}
		if ((classDef.flags() & ClassDefinition.IS_ABSTRACT) != 0) {
			context.errors.push(new CompileError(this._qualifiedName.getToken(), "cannot instantiate an abstract class"));
			return false;
		}
		var argTypes = Util.analyzeArgs(context, this._args);
		if (argTypes == null)
			return false;
		var ctors = classDef.getMemberTypeByName("constructor", false, ClassDefinition.GET_MEMBER_MODE_CLASS_ONLY);
		if (ctors != null) {
			if ((this._constructor = ctors.deduceByArgumentTypes(context, this._token, argTypes, false)) == null) {
				context.errors.push(new CompileError(this._token, "cannot create an object of type '" + this._qualifiedName.getToken().getValue() + "', arguments mismatch"));
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
	},

	forEachCodeElement: function (cb) {
		if (! Util.forEachCodeElement(this._args))
			return false;
		return true;
	}

});

// comma expression is not treated as a binary expression (why? it should be)

var CommaExpression = exports.CommaExpression = Expression.extend({

	constructor: function (token, expr1, expr2) {
		Expression.prototype.constructor.call(this, token);
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

	analyze: function (context, parentExpr) {
		return this._expr1.analyze(context, this)
			&& this._expr2.analyze(context, this);
	},

	getType: function () {
		return this._expr2.getType();
	},

	forEachCodeElement: function (cb) {
		if (! cb(this._expr1))
			return false;
		if (! cb(this._expr2))
			return false;
		return true;
	}

});
// vim: set noexpandtab:
