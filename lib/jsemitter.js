var Class = require("./Class");
eval(Class.$import("./classdef"));
eval(Class.$import("./type"));
eval(Class.$import("./expression"));
eval(Class.$import("./statement"));
eval(Class.$import("./emitter"));
eval(Class.$import("./util"));

var _Util = exports._Util = Class.extend({

	$toClosureType: function (type) {
		if (type.equals(Type.booleanType)) {
			return "!boolean";
		} else if (type.equals(Type.integerType) || type.equals(Type.numberType)) {
			return "!number";
		} else if (type.equals(Type.stringType)) {
			return "?string";
		} else if (type instanceof MayBeUndefinedType) {
			return "undefined|" + this.toClosureType(type.getBaseType());
		} else if (type instanceof ObjectType) {
			var classDef = type.getClassDef();
			if (classDef instanceof InstantiatedClassDefinition && classDef.getTemplateClassName() == "Array") {
				return "Array.<undefined|" + this.toClosureType(classDef.getTypeArguments()[0]) + ">";
			} else if (classDef instanceof InstantiatedClassDefinition && classDef.getTemplateClassName() == "Hash") {
				return "Object.<undefined|" + this.toClosureType(classDef.getTypeArguments()[0]) + ">";
			} else {
				return classDef.className();
			}
		}
		return null;
	},

	$buildAnnotation: function (template, type) {
		var closureType = this.toClosureType(type);
		if (closureType == null)
			return "";
		return Util.format(template, [closureType]);
	}

});

// statement emitter

var _StatementEmitter = exports._StatementEmitter = Class.extend({

	initialize: function (emitter) {
		this._emitter = emitter;
	}

});

var _ConstructorInvocationStatementEmitter = exports._ConstructorInvocationStatementEmitter = _StatementEmitter.extend({

	initialize: function (emitter, statement) {
		_StatementEmitter.prototype.initialize.call(this, emitter);
		this._statement = statement;
	},

	emit: function () {
		var ctorType = this._statement.getConstructorType();
		var ctorName = this._emitter._mangleConstructorName(this._statement.getConstructingClassDef(), ctorType != null ? ctorType.getArgumentTypes() : []);
		this._emitter._emit(ctorName + ".call(this", this._statement.getToken());
		var args = this._statement.getArguments();
		for (var i = 0; i < args.length; ++i) {
			this._emitter._emit(", ", null);
			this._emitter._getExpressionEmitterFor(args[i]).emit(0);
		}
		this._emitter._emit(");\n", this._statement.getToken());
	}

});

var _ExpressionStatementEmitter = exports._ExpressionStatementEmitter = _StatementEmitter.extend({

	initialize: function (emitter, statement) {
		_StatementEmitter.prototype.initialize.call(this, emitter);
		this._statement = statement;
	},

	emit: function () {
		this._emitter._getExpressionEmitterFor(this._statement.getExpr()).emit(0);
		this._emitter._emit(";\n", null);
	}

});

var _ReturnStatementEmitter = exports._ReturnStatementEmitter = _StatementEmitter.extend({

	initialize: function (emitter, statement) {
		_StatementEmitter.prototype.initialize.call(this, emitter);
		this._statement = statement;
	},

	emit: function () {
		var expr = this._statement.getExpr();
		if (expr != null) {
			this._emitter._emit("return ", null);
			this._emitter._getExpressionEmitterFor(this._statement.getExpr()).emit(0);
			this._emitter._emit(";\n", null);
		} else {
			this._emitter._emit("return;\n", this._statement.getToken());
		}
	}

});

var _DeleteStatementEmitter = exports._DeleteStatementEmitter = _StatementEmitter.extend({

	initialize: function (emitter, statement) {
		_StatementEmitter.prototype.initialize.call(this, emitter);
		this._statement = statement;
	},

	emit: function () {
		this._emitter._emit("delete ", this._statement.getToken());
		this._emitter._getExpressionEmitterFor(this._statement.getExpr()).emit(0);
		this._emitter._emit(";\n", null);
	}

});

var _BreakStatementEmitter = exports._BreakStatementEmitter = _StatementEmitter.extend({

	initialize: function (emitter, statement) {
		_StatementEmitter.prototype.initialize.call(this, emitter);
		this._statement = statement;
	},

	emit: function () {
		if (this._statement.getLabel() != null)
			throw new Error("FIXME _BreakStatementEmitter.emit (no support for labels)");
		this._emitter._emit("break;\n", this._statement.getToken());
	}

});

var _ContinueStatementEmitter = exports._ContinueStatementEmitter = _StatementEmitter.extend({

	initialize: function (emitter, statement) {
		_StatementEmitter.prototype.initialize.call(this, emitter);
		this._statement = statement;
	},

	emit: function () {
		if (this._statement.getLabel() != null)
			throw new Error("FIXME _ContinueStatementEmitter.emit (no support for labels)");
		this._emitter._emit("continue;\n", this._statement.getToken());
	}

});

var _LabelStatementEmitter = exports._LabelStatementEmitter = _StatementEmitter.extend({

	initialize: function (emitter, statement) {
		_StatementEmitter.prototype.initialize.call(this, emitter);
		this._statement = statement;
	},

	emit: function () {
		throw new Error("FIXME _LabelStatementEmitter.emit");
	}

});

var _DoWhileStatementEmitter = exports._DoWhileStatementEmitter = _StatementEmitter.extend({

	initialize: function (emitter, statement) {
		_StatementEmitter.prototype.initialize.call(this, emitter);
		this._statement = statement;
	},

	emit: function () {
		this._emitter._emit("do {\n", null);
		this._emitter._emitStatements(this._statement.getStatements());
		this._emitter._emit("} while (", null);
		this._emitter._getExpressionEmitterFor(this._statement.getExpr()).emit(0);
		this._emitter._emit(");\n", null);
	}

});

var _ForInStatementEmitter = exports._ForInStatementEmitter = _StatementEmitter.extend({

	initialize: function (emitter, statement) {
		_StatementEmitter.prototype.initialize.call(this, emitter);
		this._statement = statement;
	},

	emit: function () {
		throw new Error("FIXME _ForInStatementEmitter.emit");
	}

});

var _ForStatementEmitter = exports._ForStatementEmitter = _StatementEmitter.extend({

	initialize: function (emitter, statement) {
		_StatementEmitter.prototype.initialize.call(this, emitter);
		this._statement = statement;
	},

	emit: function () {
		this._emitter._emit("for (", null);
		var initExpr = this._statement.getInitExpr();
		if (initExpr != null)
			this._emitter._getExpressionEmitterFor(initExpr).emit(0);
		this._emitter._emit("; ", null);
		var condExpr = this._statement.getCondExpr();
		if (condExpr != null)
			this._emitter._getExpressionEmitterFor(condExpr).emit(0);
		this._emitter._emit("; ", null);
		var postExpr = this._statement.getPostExpr();
		if (postExpr != null)
			this._emitter._getExpressionEmitterFor(postExpr).emit(0);
		this._emitter._emit(") {\n", null);
		this._emitter._emitStatements(this._statement.getStatements());
		this._emitter._emit("}\n", null);
	}

});

var _IfStatementEmitter = exports._IfStatementEmitter = _StatementEmitter.extend({

	initialize: function (emitter, statement) {
		_StatementEmitter.prototype.initialize.call(this, emitter);
		this._statement = statement;
	},

	emit: function () {
		this._emitter._emit("if (", null);
		this._emitter._getExpressionEmitterFor(this._statement.getExpr()).emit(0);
		this._emitter._emit(") {\n", null);
		this._emitter._emitStatements(this._statement.getOnTrueStatements());
		var ifFalseStatements = this._statement.getOnFalseStatements();
		if (ifFalseStatements != null) {
			this._emitter._emit("} else {\n", null);
			this._emitter._emitStatements(ifFalseStatements);
		}
		this._emitter._emit("}\n", null);
	}

});

var _SwitchStatementEmitter = exports._SwitchStatementEmitter = _StatementEmitter.extend({

	initialize: function (emitter, statement) {
		_StatementEmitter.prototype.initialize.call(this, emitter);
		this._statement = statement;
	},

	emit: function () {
		this._emitter._emit("switch (", null);
		this._emitter._getExpressionEmitterFor(this._statement.getExpr()).emit(0);
		this._emitter._emit(") {\n", null);
		this._emitter._emitStatements(this._statement.getStatements());
		this._emitter._emit("}\n", null);
	}

});

var _CaseStatementEmitter = exports._CaseStatementEmitter = _StatementEmitter.extend({

	initialize: function (emitter, statement) {
		_StatementEmitter.prototype.initialize.call(this, emitter);
		this._statement = statement;
	},

	emit: function () {
		this._emitter._reduceIndent();
		this._emitter._emit("case ", null);
		this._emitter._getExpressionEmitterFor(this._statement.getExpr()).emit(0);
		this._emitter._emit(":\n", null);
		this._emitter._advanceIndent();
	}

});

var _DefaultStatementEmitter = exports._DefaultStatementEmitter = _StatementEmitter.extend({

	initialize: function (emitter, statement) {
		_StatementEmitter.prototype.initialize.call(this, emitter);
		this._statement = statement;
	},

	emit: function () {
		this._emitter._reduceIndent();
		this._emitter._emit("default:\n", null);
		this._emitter._advanceIndent();
	}

});

var _WhileStatementEmitter = exports._WhileStatementEmitter = _StatementEmitter.extend({

	initialize: function (emitter, statement) {
		_StatementEmitter.prototype.initialize.call(this, emitter);
		this._statement = statement;
	},

	emit: function () {
		this._emitter._emit("while (", null);
		this._emitter._getExpressionEmitterFor(this._statement.getExpr()).emit(0);
		this._emitter._emit(") {\n", null);
		this._emitter._emitStatements(this._statement.getStatements());
		this._emitter._emit("}\n", null);
	}

});

var _TryStatementEmitter = exports._TryStatementEmitter = _StatementEmitter.extend({

	initialize: function (emitter, statement) {
		_StatementEmitter.prototype.initialize.call(this, emitter);
		this._statement = statement;
	},

	emit: function () {
		throw new Error("FIXME _TryStatementEmitter.emit");
	}

});

var _AssertStatementEmitter = exports._AssertStatementEmitter = _StatementEmitter.extend({

	initialize: function (emitter, statement) {
		_StatementEmitter.prototype.initialize.call(this, emitter);
		this._statement = statement;
	},

	emit: function () {
		throw new Error("FIXME _AssertStatementEmitter.emit");
	}

});

var _LogStatementEmitter = exports._LogStatementEmitter = _StatementEmitter.extend({

	initialize: function (emitter, statement) {
		_StatementEmitter.prototype.initialize.call(this, emitter);
		this._statement = statement;
	},

	emit: function () {
		this._emitter._emit("console.log(", null);
		var exprs = this._statement.getExprs();
		for (var i = 0; i < exprs.length; ++i) {
			if (i != 0)
				this._emitter._emit(", ", null);
			this._emitter._getExpressionEmitterFor(exprs[i]).emit(0);
		}
		this._emitter._emit(");\n", null);
	}

});

// expression emitter

var _ExpressionEmitter = exports._ExpressionEmitter = Class.extend({

	initialize: function (emitter) {
		this._emitter = emitter;
	}

});

var _IdentifierExpressionEmitter = exports._IdentifierExpressionEmitter = _ExpressionEmitter.extend({

	initialize: function (emitter, expr) {
		_ExpressionEmitter.prototype.initialize.call(this, emitter);
		this._expr = expr;
	},

	emit: function (outerOpPrecedence) {
		var ident = this._expr._identifierToken.getValue();
		this._emitter._emit(ident, null);
	}

});

var _UndefinedExpressionEmitter = exports._UndefinedExpressionEmitter = _ExpressionEmitter.extend({

	initialize: function (emitter, expr) {
		_ExpressionEmitter.prototype.initialize.call(this, emitter);
		this._expr = expr;
	},

	emit: function (outerOpPrecedence) {
		var token = this._expr.getToken();
		this._emitter._emit("undefined", token);
	}

});

var _NullExpressionEmitter = exports._NullExpressionEmitter = _ExpressionEmitter.extend({

	initialize: function (emitter, expr) {
		_ExpressionEmitter.prototype.initialize.call(this, emitter);
		this._expr = expr;
	},

	emit: function (outerOpPrecedence) {
		var token = this._expr.getToken();
		this._emitter._emit("null", token);
	}

});

var _BooleanLiteralExpressionEmitter = exports._BooleanLiteralExpressionEmitter = _ExpressionEmitter.extend({

	initialize: function (emitter, expr) {
		_ExpressionEmitter.prototype.initialize.call(this, emitter);
		this._expr = expr;
	},

	emit: function (outerOpPrecedence) {
		var token = this._expr.getToken();
		this._emitter._emit(token.getValue(), token);
	}

});

var _IntegerLiteralExpressionEmitter = exports._IntegerLiteralExpressionEmitter = _ExpressionEmitter.extend({

	initialize: function (emitter, expr) {
		_ExpressionEmitter.prototype.initialize.call(this, emitter);
		this._expr = expr;
	},

	emit: function (outerOpPrecedence) {
		var token = this._expr.getToken();
		this._emitter._emit("" + token.getValue(), token);
	}

});

var _NumberLiteralExpressionEmitter = exports._NumberLiteralExpressionEmitter = _ExpressionEmitter.extend({

	initialize: function (emitter, expr) {
		_ExpressionEmitter.prototype.initialize.call(this, emitter);
		this._expr = expr;
	},

	emit: function (outerOpPrecedence) {
		var token = this._expr.getToken();
		this._emitter._emit("" + token.getValue(), token);
	}

});

var _StringLiteralExpressionEmitter = exports._StringLiteralExpressionEmitter = _ExpressionEmitter.extend({

	initialize: function (emitter, expr) {
		_ExpressionEmitter.prototype.initialize.call(this, emitter);
		this._expr = expr;
	},

	emit: function (outerOpPrecedence) {
		var token = this._expr.getToken();
		// FIXME escape
		this._emitter._emit(token.getValue(), token);
	}

});

var _RegExpLiteralExpressionEmitter = exports._RegExpLiteralExpressionEmitter = _ExpressionEmitter.extend({

	initialize: function (emitter, expr) {
		_ExpressionEmitter.prototype.initialize.call(this, emitter);
		this._expr = expr;
	},

	emit: function (outerOpPrecedence) {
		var token = this._expr.getToken();
		this._emitter._emit(token.getValue(), token);
	}

});

var _ArrayLiteralExpressionEmitter = exports._ArrayLiteralExpressionEmitter = _ExpressionEmitter.extend({

	initialize: function (emitter, expr) {
		_ExpressionEmitter.prototype.initialize.call(this, emitter);
		this._expr = expr;
	},

	emit: function (outerOpPrecedence) {
		this._emitter._emit("[ ", null);
		var exprs = this._expr.getExprs();
		for (var i = 0; i < exprs.length; ++i) {
			if (i != 0)
				this._emitter._emit(", ", null);
			this._emitter._getExpressionEmitterFor(exprs[i]).emit(0);
		}
		this._emitter._emit(" ]", null);
	}

});

var _HashLiteralExpressionEmitter = exports._HashLiteralExpressionEmitter = _ExpressionEmitter.extend({

	initialize: function (emitter, expr) {
		_ExpressionEmitter.prototype.initialize.call(this, emitter);
		this._expr = expr;
	},

	emit: function (outerOpPrecedence) {
		this._emitter._emit("{ ", null);
		var elements = this._expr.getElements();
		for (var i = 0; i < elements.length; ++i) {
			var element = elements[i];
			if (i != 0)
				this._emitter._emit(", ", null);
			this._emitter._emit(element.getKey().getValue(), element.getKey());
			this._emitter._emit(": ", null);
			this._emitter._getExpressionEmitterFor(element.getExpr()).emit(0);
		}
		this._emitter._emit(" }", null);
	}

});

var _ThisExpressionEmitter = exports._ThisExpressionEmitter = _ExpressionEmitter.extend({

	initialize: function (emitter, expr) {
		_ExpressionEmitter.prototype.initialize.call(this, emitter);
		this._expr = expr;
	},

	emit: function (outerOpPrecedence) {
		var emittingFunction = this._emitter._emittingFunction;
		if ((emittingFunction.flags() & ClassDefinition.IS_STATIC) != 0)
			this._emitter._emit("$this", this._expr.getToken());
		else
			this._emitter._emit("this", this._expr.getToken());
	}

});

var _AsExpressionEmitter = exports._AsExpressionEmitter = _ExpressionEmitter.extend({

	initialize: function (emitter, expr) {
		_ExpressionEmitter.prototype.initialize.call(this, emitter);
		this._expr = expr;
	},

	emit: function (outerOpPrecedence) {
		var srcType = this._expr.getExpr().getType();
		var destType = this._expr.getType();
		if (srcType.resolveIfMayBeUndefined() instanceof ObjectType && destType instanceof ObjectType) {
			// downcast
			this._emitter._emit("$__jsx_downcast(", this._expr.getOperatorToken());
			this._emitter._getExpressionEmitterFor(this._expr.getExpr()).emit(0);
			this._emitter._emit(", " + destType.toString() + ")", this._expr.getOperatorToken());
			return true;
		}
		if (srcType.equals(Type.booleanType)) {
			// from boolean
			if (destType.equals(Type.integerType) || destType.equals(Type.numberType)) {
				var prec = _UnaryExpressionEmitter._operatorPrecedence["+"];
				this._emitWithParens(outerOpPrecedence, prec, prec, "+", null);
				return true;
			}
			if (destType.equals(Type.stringType)) {
				var prec = _BinaryExpressionEmitter._operatorPrecedence["+"];
				this._emitWithParens(outerOpPrecedence, prec, prec, null, " + \"\"");
				return true;
			}
		}
		if (srcType instanceof MayBeUndefinedType && srcType.getBaseType().equals(Type.booleanType)) {
			// from MayBeUndefined.<boolean>
			if (destType.equals(Type.booleanType)) {
				var prec = _BinaryExpressionEmitter._operatorPrecedence["||"];
				this._emitWithParens(outerOpPrecedence, prec, prec, null, " || false");
				return true;
			}
			if (destType.equals(Type.integerType) || destType.equals(Type.numberType)) {
				this._emitWithParens(
					outerOpPrecedence,
					_BinaryExpressionEmitter._operatorPrecedence["-"],
					_UnaryExpressionEmitter._operatorPrecedence["!"],
					"1 - ! ",
					null);
				return true;
			}
			if (destType.equals(Type.stringType)) {
				this._emitWithParens(
					outerOpPrecedence,
					_BinaryExpressionEmitter._operatorPrecedence["+"],
					_BinaryExpressionEmitter._operatorPrecedence["||"],
					"(",
					" || false) + \"\"");
				return true;
			}
		}
		if (srcType.equals(Type.integerType)) {
			// from integer
			if (destType.equals(Type.booleanType)) {
				var prec = _UnaryExpressionEmitter._operatorPrecedence["!"];
				this._emitWithParens(outerOpPrecedence, prec, prec, "!! ", null);
				return true;
			}
			if (destType.equals(Type.numberType)) {
				this._emitter._getExpressionEmitterFor(this._expr.getExpr()).emit(outerOpPrecedence);
				return true;
			}
			if (destType.equals(Type.stringType)) {
				var prec = _BinaryExpressionEmitter._operatorPrecedence["+"];
				this._emitWithParens(outerOpPrecedence, prec, prec, null, " + \"\"");
				return true;
			}
		}
		if (srcType instanceof MayBeUndefinedType && srcType.getBaseType().equals(Type.integerType)) {
			// from MayBeUndefined.<int>
			if (destType.equals(Type.booleanType)) {
				var prec = _UnaryExpressionEmitter._operatorPrecedence["!"];
				this._emitWithParens(outerOpPrecedence, prec, prec, "!! ", null);
				return true;
			}
			if (destType.equals(Type.integerType) || destType.equals(Type.numberType)) {
				var prec = _BinaryExpressionEmitter._operatorPrecedence["|"];
				this._emitWithParens(outerOpPrecedence, prec, prec, null, " | 0");
				return true;
			}
			if (destType.equals(Type.stringType)) {
				this._emitWithParens(
					outerOpPrecedence,
					_BinaryExpressionEmitter._operatorPrecedence["+"],
					_BinaryExpressionEmitter._operatorPrecedence["|"],
					"(",
					" | 0) + \"\"");
				return true;
			}
		}
		if (srcType.equals(Type.numberType)) {
			// from number
			if (destType.equals(Type.booleanType)) {
				var prec = _UnaryExpressionEmitter._operatorPrecedence["!"];
				this._emitWithParens(outerOpPrecedence, prec, prec, "!! ", null);
				return true;
			}
			if (destType.equals(Type.integerType)) {
				var prec = _BinaryExpressionEmitter._operatorPrecedence["|"];
				this._emitWithParens(outerOpPrecedence, prec, prec, null, " | 0");
				return true;
			}
			if (destType.equals(Type.stringType)) {
				var prec = _BinaryExpressionEmitter._operatorPrecedence["+"];
				this._emitWithParens(outerOpPrecedence, prec, prec, null, " + \"\"");
				return true;
			}
		}
		if (srcType instanceof MayBeUndefinedType && srcType.getBaseType().equals(Type.numberType)) {
			// from MayBeUndefined.<number>
			if (destType.equals(Type.booleanType)) {
				var prec = _UnaryExpressionEmitter._operatorPrecedence["!"];
				this._emitWithParens(outerOpPrecedence, prec, prec, "!! ", null);
				return true;
			}
			if (destType.equals(Type.integerType)) {
				var prec = _BinaryExpressionEmitter._operatorPrecedence["|"];
				this._emitWithParens(outerOpPrecedence, prec, prec, null, " | 0");
				return true;
			}
			if (destType.equals(Type.numberType)) {
				var prec = _UnaryExpressionEmitter._operatorPrecedence["+"];
				this._emitWithParens(outerOpPrecedence, prec, prec, "+", null);
				return true;
			}
			if (destType.equals(Type.stringType)) {
				var prec = _BinaryExpressionEmitter._operatorPrecedence["+"];
				this._emitWithParens(outerOpPrecedence, prec, prec, "+", " + \"\"");
				return true;
			}
		}
		if (srcType.equals(Type.stringType)) {
			// from String
			if (destType.equals(Type.booleanType)) {
				var prec = _UnaryExpressionEmitter._operatorPrecedence["!"];
				this._emitWithParens(outerOpPrecedence, prec, prec, "!! ", null);
				return true;
			}
			if (destType.equals(Type.integerType)) {
				var prec = _BinaryExpressionEmitter._operatorPrecedence["|"];
				this._emitWithParens(outerOpPrecedence, prec, prec, null, " | 0");
				return true;
			}
			if (destType.equals(Type.numberType)) {
				var prec = _UnaryExpressionEmitter._operatorPrecedence["+"];
				this._emitWithParens(outerOpPrecedence, prec, prec, "+", null);
				return true;
			}
		}
		if (srcType instanceof MayBeUndefinedType && srcType.getBaseType().equals(Type.stringType)) {
			// from MayBeUndefined.<String>
			if (destType.equals(Type.booleanType)) {
				var prec = _UnaryExpressionEmitter._operatorPrecedence["!"];
				this._emitWithParens(outerOpPrecedence, prec, prec, "!! ", null);
				return true;
			}
			if (destType.equals(Type.integerType)) {
				var prec = _BinaryExpressionEmitter._operatorPrecedence["|"];
				this._emitWithParens(outerOpPrecedence, prec, prec, null, " | 0");
				return true;
			}
			if (destType.equals(Type.numberType)) {
				var prec = _UnaryExpressionEmitter._operatorPrecedence["+"];
				this._emitWithParens(outerOpPrecedence, prec, prec, "+", null);
				return true;
			}
			if (destType.equals(Type.stringType)) {
				var prec = _BinaryExpressionEmitter._operatorPrecedence["+"];
				this._emitWithParens(outerOpPrecedence, prec, prec, null, " + \"\"");
				return true;
			}
		}
		if (srcType.equals(Type.variantType)) {
			// from variant
			if (destType.equals(Type.booleanType)) {
				var prec = _UnaryExpressionEmitter._operatorPrecedence["!"];
				this._emitWithParens(outerOpPrecedence, prec, prec, "!! ", null);
				return true;
			}
			if (destType.equals(Type.integerType)) {
				var prec = _BinaryExpressionEmitter._operatorPrecedence["|"];
				this._emitWithParens(outerOpPrecedence, prec, prec, null, " | 0");
				return true;
			}
			if (destType.equals(Type.numberType)) {
				var prec = _UnaryExpressionEmitter._operatorPrecedence["+"];
				this._emitWithParens(outerOpPrecedence, prec, prec, "+", null);
				return true;
			}
			if (destType.equals(Type.stringType)) {
				var prec = _BinaryExpressionEmitter._operatorPrecedence["+"];
				this._emitWithParens(outerOpPrecedence, prec, prec, null, " + \"\"");
				return true;
			}
		}
		if (srcType.isConvertibleTo(destType)) {
			// can perform implicit conversion
			this._emitter._getExpressionEmitterFor(this._expr.getExpr()).emit(outerOpPrecedence);
			return true;
		}
		throw new Error("explicit conversion logic unknown from " + srcType.toString() + " to " + destType.toString());
	},

	_emitWithParens: function (outerOpPrecedence, opPrecedence, innerOpPrecedence, prefix, postfix) {
		if (opPrecedence > outerOpPrecedence)
			this._emitter._emit("(", null);
		if (prefix != null)
			this._emitter._emit(prefix, this._expr.getOperatorToken());
		this._emitter._getExpressionEmitterFor(this._expr.getExpr()).emit(innerOpPrecedence);
		if (postfix != null)
			this._emitter._emit(postfix, this._expr.getOperatorToken());
		if (opPrecedence > outerOpPrecedence)
			this._emitter._emit(")", null);
	}

});

var _AsNoCheckExpressionEmitter = exports._AsNoCheckExpressionEmitter = _ExpressionEmitter.extend({

	initialize: function (emitter, expr) {
		_ExpressionEmitter.prototype.initialize.call(this, emitter);
		this._expr = expr;
	},

	emit: function (outerOpPrecedence) {
		return this._emitter._getExpressionEmitterFor(this._expr.getExpr()).emit(outerOpPrecedence);
	}

});

var _OperatorExpressionEmitter = exports._OperatorExpressionEmitter = _ExpressionEmitter.extend({

	initialize: function (emitter) {
		_ExpressionEmitter.prototype.initialize.call(this, emitter);
	},

	emit: function (outerOpPrecedence) {
		var opPrecedence = this._getPrecedence();
		if (opPrecedence > outerOpPrecedence) {
			this._emitter._emit("(", null);
			this._emit();
			this._emitter._emit(")", null);
		} else {
			this._emit();
		}
	},

	_emit: null, // void emit()

	_getPrecedence: null // int _getPrecedence()

});

var _UnaryExpressionEmitter = exports._UnaryExpressionEmitter = _OperatorExpressionEmitter.extend({

	initialize: function (emitter, expr) {
		_OperatorExpressionEmitter.prototype.initialize.call(this, emitter);
		this._expr = expr;
	},

	_emit: function () {
		var opToken = this._expr.getOperatorToken();
		this._emitter._emit(opToken.getValue(), opToken);
		this._emitter._getExpressionEmitterFor(this._expr.getExpr()).emit(this._getPrecedence());
	},

	_getPrecedence: function () {
		return _UnaryExpressionEmitter._operatorPrecedence[this._expr.getOperatorToken().getValue()];
	},

	$_operatorPrecedence: {},

	$_setOperatorPrecedence: function (op, precedence) {
		_UnaryExpressionEmitter._operatorPrecedence[op] = precedence;
	}

});

var _PostfixExpressionEmitter = exports._PostfixExpressionEmitter = _UnaryExpressionEmitter.extend({

	initialize: function (emitter, expr) {
		_UnaryExpressionEmitter.prototype.initialize.call(this, emitter, expr);
	},

	_emit: function () {
		var opToken = this._expr.getOperatorToken();
		this._emitter._getExpressionEmitterFor(this._expr.getExpr()).emit(this._getPrecedence());
		this._emitter._emit(opToken.getValue(), opToken);
	},

	_getPrecedence: function () {
		return _PostfixExpressionEmitter._operatorPrecedence[this._expr.getOperatorToken().getValue()];
	},

	$_operatorPrecedence: {},

	$_setOperatorPrecedence: function (op, precedence) {
		_PostfixExpressionEmitter._operatorPrecedence[op] = precedence;
	}

});

var _InstanceofExpressionEmitter = exports._InstanceofExpressionEmitter = _UnaryExpressionEmitter.extend({

	initialize: function (emitter, expr) {
		_UnaryExpressionEmitter.prototype.initialize.call(this, emitter, expr);
	},

	_emit: function () {
		this._emitter._getExpressionEmitterFor(this._expr.getExpr()).emit(this._getPrecedence());
		this._emitter._emit(" instanceof ", opToken);
		var expectedType = this._expr.getExpectedType();
		this._emitter._emit(expectedType.toString(), expectedType);
	},

	_getPrecedence: function () {
		return _InstanceofExpressionEmitter._operatorPrecedence;
	},

	$_operatorPrecedence: 0,

	$_setOperatorPrecedence: function (op, precedence) {
		_InstanceofExpressionEmitter._operatorPrecedence = precedence;
	}

});

var _PropertyExpressionEmitter = exports._PropertyExpressionEmitter = _UnaryExpressionEmitter.extend({

	initialize: function (emitter, expr) {
		_UnaryExpressionEmitter.prototype.initialize.call(this, emitter, expr);
	},

	_emit: function () {
		var expr = this._expr;
		var exprType = expr.getType();
		var identifierToken = this._expr.getIdentifierToken();
		// replace methods to global function (e.g. Number.isNaN to isNaN)
		// FIXME: refer to the global object instead of non-qualified name
		//        to allow `var parseInt = 0` in JSX
		if (expr.getExpr()._classDefType instanceof ClassDefType
			&& expr.getExpr()._classDefType.getClassDef() === Type.numberType.getClassDef()) {
			switch (identifierToken.getValue()) {
			case "parseInt":
			case "parseFloat":
			case "isNaN":
			case "isFinite":
				this._emitter._emit('$__jsx_' + identifierToken.getValue(), identifierToken);
				return;
			}
		}
		this._emitter._getExpressionEmitterFor(expr.getExpr()).emit(this._getPrecedence());
		this._emitter._emit(".", identifierToken);
		// mangle the name if necessary
		if (exprType instanceof FunctionType && ! exprType.isAssignable()
			&& (expr.getHolderType().getClassDef().flags() & ClassDefinition.IS_NATIVE) == 0)
			this._emitter._emit(this._emitter._mangleFunctionName(identifierToken.getValue(), exprType.getArgumentTypes()), identifierToken);
		else
			this._emitter._emit(identifierToken.getValue(), identifierToken);
	},

	_getPrecedence: function () {
		return _PropertyExpressionEmitter._operatorPrecedence;
	},

	$_operatorPrecedence: 0,

	$_setOperatorPrecedence: function (op, precedence) {
		_PropertyExpressionEmitter._operatorPrecedence = precedence;
	}

});

var _FunctionExpressionEmitter = exports._FunctionExpressionEmitter = _UnaryExpressionEmitter.extend({

	initialize: function (emitter, expr) {
		_UnaryExpressionEmitter.prototype.initialize.call(this, emitter, expr);
	},

	_emit: function () {
		var funcDef = this._expr.getFuncDef();
		this._emitter._emit("function (", funcDef.getToken());
		var args = funcDef.getArguments();
		for (var i = 0; i < args.length; ++i) {
			if (i != 0)
				this._emitter._emit(", ", funcDef.getToken());
			this._emitter._emit(args[i].getName().getValue(), funcDef.getToken());
		}
		this._emitter._emit(") {\n", funcDef.getToken());
		this._emitter._advanceIndent();
		this._emitter._emitFunctionBody(funcDef);
		this._emitter._reduceIndent();
		this._emitter._emit("}", funcDef.getToken())
	},

	_getPrecedence: function () {
		return _FunctionExpressionEmitter._operatorPrecedence;
	},

	$_operatorPrecedence: 0,

	$_setOperatorPrecedence: function (op, precedence) {
		_FunctionExpressionEmitter._operatorPrecedence = precedence;
	}

});

var _BinaryExpressionEmitter = exports._BinaryExpressionEmitter = _OperatorExpressionEmitter.extend({

	initialize: function (emitter, expr) {
		_OperatorExpressionEmitter.prototype.initialize.call(this, emitter);
		this._expr = expr;
		this._precedence = _BinaryExpressionEmitter._operatorPrecedence[this._expr.getOperatorToken().getValue()];
	},

	_emit: function () {
		var opToken = this._expr.getOperatorToken();
		var firstExpr = this._expr.getFirstExpr();
		var firstExprType = firstExpr.getType();
		var secondExpr = this._expr.getSecondExpr();
		var secondExprType = secondExpr.getType();
		var op = opToken.getValue();
		switch (op) {
		case "+":
			// special handling: (undefined as MayBeUndefined<String>) + (undefined as MayBeUndefined<String>) should produce "undefinedundefined", not NaN
			if (firstExprType.equals(secondExprType) && firstExprType.equals(Type.stringType.toMayBeUndefinedType()))
				this._emitter._emit("\"\" + ", null);
			break;
		case "==":
		case "!=":
			// equality operators of JSX are strict equality ops in JS (expect if either operand is an object and the other is the primitive counterpart)
			if ((firstExprType instanceof ObjectType) + (secondExprType instanceof ObjectType) != 1)
				op += "=";
			break;
		}
		this._emitter._getExpressionEmitterFor(firstExpr).emit(this._precedence);
		this._emitter._emit(" " + op + " ", opToken);
		// special handling for assignment to int
		if (op == "=" && firstExprType.equals(Type.integerType) && secondExprType.equals(Type.numberType)) {
			this._emitter._getExpressionEmitterFor(secondExpr).emit(_BinaryExpressionEmitter._operatorPrecedence["|"]);
			this._emitter._emit(" | 0", opToken);
		} else {
			this._emitter._getExpressionEmitterFor(secondExpr).emit(this._precedence);
		}
	},

	_getPrecedence: function () {
		return this._precedence;
	},

	$_operatorPrecedence: {},

	$_setOperatorPrecedence: function (op, precedence) {
		_BinaryExpressionEmitter._operatorPrecedence[op] = precedence;
	}

});

var _ArrayExpressionEmitter = exports._ArrayExpressionEmitter = _OperatorExpressionEmitter.extend({

	initialize: function (emitter, expr) {
		_OperatorExpressionEmitter.prototype.initialize.call(this, emitter);
		this._expr = expr;
	},

	_emit: function () {
		this._emitter._getExpressionEmitterFor(this._expr.getFirstExpr()).emit(_ArrayExpressionEmitter._operatorPrecedence);
		this._emitter._emit("[", this._expr.getOperatorToken());
		this._emitter._getExpressionEmitterFor(this._expr.getSecondExpr()).emit(_ArrayExpressionEmitter._operatorPrecedence);
		this._emitter._emit("]", null);
	},

	_getPrecedence: function () {
		return _ArrayExpressionEmitter._operatorPrecedence;
	},

	$_operatorPrecedence: 0,

	$_setOperatorPrecedence: function (op, precedence) {
		_ArrayExpressionEmitter._operatorPrecedence = precedence;
	}

});

var _ConditionalExpressionEmitter = exports._ConditionalExpressionEmitter = _OperatorExpressionEmitter.extend({

	initialize: function (emitter, expr) {
		_OperatorExpressionEmitter.prototype.initialize.call(this, emitter);
		this._expr = expr;
	},

	_emit: function () {
		var precedence = this._getPrecedence();
		var ifTrueExpr = this._expr.getIfTrueExpr();
		if (ifTrueExpr != null) {
			this._emitter._getExpressionEmitterFor(this._expr.getCondExpr()).emit(precedence);
			this._emitter._emit(" ? ", null);
			this._emitter._getExpressionEmitterFor(ifTrueExpr).emit(precedence);
			this._emitter._emit(" : ", null);
			this._emitter._getExpressionEmitterFor(this._expr.getIfFalseExpr()).emit(precedence);
		} else {
			this._emitter._getExpressionEmitterFor(this._expr.getCondExpr()).emit(precedence);
			this._emitter._emit(" || ", null);
			this._emitter._getExpressionEmitterFor(this._expr.getIfFalseExpr()).emit(precedence);
		}
	},

	_getPrecedence: function () {
		return this._expr.getIfTrueExpr() != null ? _ConditionalExpressionEmitter._operatorPrecedence : _BinaryExpressionEmitter._operatorPrecedence["||"];
	},

	$_operatorPrecedence: 0,

	$_setOperatorPrecedence: function (op, precedence) {
		_ConditionalExpressionEmitter._operatorPrecedence = precedence;
	}

});

var _CallExpressionEmitter = exports._CallExpressionEmitter = _OperatorExpressionEmitter.extend({

	initialize: function (emitter, expr) {
		_OperatorExpressionEmitter.prototype.initialize.call(this, emitter);
		this._expr = expr;
	},

	_emit: function () {
		this._emitter._getExpressionEmitterFor(this._expr.getExpr()).emit(_CallExpressionEmitter._operatorPrecedence);
		this._emitter._emit("(", this._expr.getOperatorToken());
		var args = this._expr.getArguments();
		for (var i = 0; i < args.length; ++i) {
			if (i != 0)
				this._emitter._emit(", ", null);
			this._emitter._getExpressionEmitterFor(args[i]).emit(0);
		}
		this._emitter._emit(")", this._expr.getOperatorToken());
	},

	_getPrecedence: function () {
		return _CallExpressionEmitter._operatorPrecedence;
	},

	$_operatorPrecedence: 0,

	$_setOperatorPrecedence: function (op, precedence) {
		_CallExpressionEmitter._operatorPrecedence = precedence;
	}

});

var _SuperExpressionEmitter = exports._SuperExpressionEmitter = _OperatorExpressionEmitter.extend({

	initialize: function (emitter, expr) {
		_OperatorExpressionEmitter.prototype.initialize.call(this, emitter);
		this._expr = expr;
	},

	_emit: function () {
		var funcType = this._expr.getFunctionType();
		var className = funcType.getObjectType().getClassDef().className();
		var mangledFuncName = this._emitter._mangleFunctionName(this._expr.getName().getValue(), funcType.getArgumentTypes());
		this._emitter._emit(className + ".prototype." + mangledFuncName + ".call(this", this._expr.getOperatorToken());
		var args = this._expr.getArguments();
		for (var i = 0; i < args.length; ++i) {
			this._emitter._emit(", ", null);
			this._emitter._getExpressionEmitterFor(args[i]).emit(0);
		}
		this._emitter._emit(")", this._expr.getOperatorToken());
	},

	_getPrecedence: function () {
		return _CallExpressionEmitter._operatorPrecedence;
	},

	$_operatorPrecedence: 0,

	$_setOperatorPrecedence: function (op, precedence) {
		_SuperExpressionEmitter._operatorPrecedence = precedence;
	}

});

var _NewExpressionEmitter = exports._NewExpressionEmitter = _OperatorExpressionEmitter.extend({

	initialize: function (emitter, expr) {
		_OperatorExpressionEmitter.prototype.initialize.call(this, emitter);
		this._expr = expr;
	},

	emit: function (outerOpPrecedence) {
		var classDef = this._expr.getType().getClassDef();
		var ctor = this._expr.getConstructor();
		this._emitter._emit("new " + this._emitter._mangleConstructorName(classDef, ctor != null ? ctor.getArgumentTypes() : []) + "(", this._expr.getOperatorToken());
		var args = this._expr.getArguments();
		for (var i = 0; i < args.length; ++i) {
			if (i != 0)
				this._emitter._emit(", ", null);
			this._emitter._getExpressionEmitterFor(args[i]).emit(0);
		}
		this._emitter._emit(")", this._expr.getOperatorToken());
	},

	_getPrecedence: function () {
		return _NewExpressionEmitter._operatorPrecedence;
	},

	$_operatorPrecedence: 0,

	$_setOperatorPrecedence: function (op, precedence) {
		_NewExpressionEmitter._operatorPrecedence = precedence;
	}

});

var _CommaExpressionEmitter = exports._CommaExpressionEmitter = _ExpressionEmitter.extend({

	initialize: function (emitter, expr) {
		_ExpressionEmitter.prototype.initialize.call(this, emitter);
		this._expr = expr;
	},

	emit: function (outerOpPrecedence) {
		// comma operations should be surrounded by brackets unless within a comma expression, since "," might get considered as an argument separator (of function calls, etc.)
		var useBrackets = outerOpPrecedence != _CommaExpressionEmitter._operatorPrecedence;
		if (useBrackets)
			this._emitter._emit("(", null);
		this._emitter._getExpressionEmitterFor(this._expr.getFirstExpr()).emit(_CommaExpressionEmitter._operatorPrecedence);
		this._emitter._emit(", ", null);
		this._emitter._getExpressionEmitterFor(this._expr.getSecondExpr()).emit(_CommaExpressionEmitter._operatorPrecedence);
		if (useBrackets)
			this._emitter._emit(")", null);
	},

	$_operatorPrecedence: 0,

	$_setOperatorPrecedence: function (op, precedence) {
		_CommaExpressionEmitter._operatorPrecedence = precedence;
	}

});

// the global emitter

var JavaScriptEmitter = exports.JavaScriptEmitter = Class.extend({

	initialize: function (platform) {
		this._output = platform.load("lib/js/bootstrap.js") + "\n";
		this._indent = 0;
		this._emittingClass = null;
		this._emittingFunction = null;
	},

	emitClassDefinition: function (classDef) {

		try {
			this._emittingClass = classDef;

			// emit class object
			this._emitClassObject(classDef);

			// emit constructors
			var ctors = this._findFunctions(classDef, "initialize", false);
			if (ctors.length == 0)
				this._emitConstructor(classDef, null);
			else
				for (var i = 0; i < ctors.length; ++i)
					this._emitConstructor(classDef, ctors[i]);

			// emit functions
			var members = classDef.members();
			for (var i = 0; i < members.length; ++i) {
				var member = members[i];
				if (member instanceof MemberFunctionDefinition) {
					if (! (member.name() == "initialize" && (member.flags() & ClassDefinition.IS_STATIC) == 0) && member.getStatements() != null) {
						this._emitFunction(member);
					}
				}
			}

		} finally {
			this._emittingClass = null;
		}

	},

	emitStaticInitializationCode: function (classDef) {
		if ((classDef.flags() & ClassDefinition.IS_NATIVE) != 0)
			return;
		var members = classDef.members();
		// FIXME can we (should we?) automatically resolve dependencies? isn't it impossible?
		for (var i = 0; i < members.length; ++i) {
			var member = members[i];
			if ((member instanceof MemberVariableDefinition)
				&& (member.flags() & (ClassDefinition.IS_STATIC | ClassDefinition.IS_NATIVE)) == ClassDefinition.IS_STATIC)
				this._emitMemberVariable(classDef.className(), member);
		}
	},

	getOutput: function () {
		return this._output;
	},

	_emitClassObject: function (classDef) {
		this._emit(
			"/**\n" +
			" * class " + classDef.className() +
			" extends " + classDef.extendClassDef().className() + "\n" +
			" * @constructor\n" +
			" */\n" +
			"function " + classDef.className() + "() {\n" +
			"}\n" +
			"\n",
			null);
		this._emit(classDef.className() + ".prototype = new " + classDef.extendClassDef().className() + ";\n", null);
		if (classDef.implementClassDefs().length != 0) {
			var interfaceDefs = classDef.implementClassDefs();
			for (var i = 0; i < interfaceDefs.length; ++i)
				this._emit("$__jsx_merge_interface(" + classDef.className() + ", " + interfaceDefs[i].className() + ");\n", null);
			this._emit("\n", null);
		}
	},

	_emitConstructor: function (classDef, funcDef) {
		var funcName = this._mangleConstructorName(classDef, funcDef != null ? funcDef.getArgumentTypes() : []);
		// emit prologue
		this._emit("/**\n", null);
		this._emit(" * @constructor\n", null);
		if (funcDef != null)
			this._emitFunctionArgumentAnnotations(funcDef);
		this._emit(" */\n", null);
		this._emit("function " + funcName + "(", null);
		if (funcDef != null)
			this._emitFunctionArguments(funcDef);
		this._emit(") {\n", null);
		this._advanceIndent();
		// emit constructor invocation statements
		this._emitConstructorCalls(classDef, funcDef);
		// emit member variable initialization code
		var members = classDef.members();
		for (var i = 0; i < members.length; ++i) {
			var member = members[i];
			if ((member instanceof MemberVariableDefinition) && (member.flags() & (ClassDefinition.IS_STATIC | ClassDefinition.IS_ABSTRACT)) == 0)
				this._emitMemberVariable("this", member);
		}
		// emit function body
		if (funcDef != null)
			this._emitFunctionBody(funcDef);
		// emit epilogue
		this._reduceIndent();
		this._emit("};\n\n", null);
		this._emit(funcName + ".prototype = new " + classDef.className() + ";\n\n", null);
	},

	_emitFunction: function (funcDef) {
		this._emit("/**\n", null);
		this._emitFunctionArgumentAnnotations(funcDef);
		this._emit(_Util.buildAnnotation(" * @return {%1}\n", funcDef.getReturnType()), null);
		this._emit(" */\n", null);
		this._emit(funcDef.getClassDef().className(), null);
		if ((funcDef.flags() & ClassDefinition.IS_STATIC) == 0)
			this._emit(".prototype", null);
		this._emit("." + this._mangleFunctionName(funcDef.name(), funcDef.getArgumentTypes()) + " = function (", null);
		this._emitFunctionArguments(funcDef);
		this._emit(") {\n", null);
		this._advanceIndent();
		this._emitFunctionBody(funcDef);
		this._reduceIndent();
		this._emit("};\n\n", null);
	},

	_emitFunctionArgumentAnnotations: function (funcDef) {
		var args = funcDef.getArguments();
		for (var i = 0; i < args.length; ++i)
			this._emit(_Util.buildAnnotation(" * @param {%1} " + args[i].getName().getValue() + "\n", args[i].getType()), null);
	},

	_emitFunctionArguments: function (funcDef) {
		var args = funcDef.getArguments();
		for (var i = 0; i < args.length; ++i) {
			if (i != 0)
				this._emit(", ");
			this._emit(args[i].getName().getValue());
		}
	},

	_emitConstructorCalls: function (classDef, funcDef) {
		try {
			this._emittingFunction = funcDef;

			var statementIndex = 0;
			if (classDef.extendClassDef() != null) {
				if (this._emitConstructorCallForClass(classDef.extendClassDef(), funcDef, statementIndex))
					++statementIndex;
			}
			for (var i = 0; i < classDef.implementClassDefs().length; ++i)
				if (this._emitConstructorCallForClass(classDef.implementClassDefs()[i], funcDef, statementIndex))
					++statementIndex;

		} finally {
			this._emittingFunction = null;
		}
	},

	_emitConstructorCallForClass: function (classDef, funcDef, statementIndex) {
		// emit the custom ctor call if exists
		var statements = funcDef != null ? funcDef.getStatements() : null;
		if (statements != null
			&& statementIndex < statements.length
			&& statements[statementIndex] instanceof ConstructorInvocationStatement
			&& statements[statementIndex].getConstructingClassDef() == classDef) {
			this._getStatementEmitterFor(statements[statementIndex]).emit();
			return true;
		}
		// emit call to the zero-argument ctor
		if (classDef.className() != "Object")
			this._emit(this._mangleConstructorName(classDef, []) + ".call(this);\n", null);
		return false;
	},

	_emitFunctionBody: function (funcDef) {
		try {
			this._emittingFunction = funcDef;

			// emit reference to this for closures
			if (funcDef.getClosures().length != 0)
				this._emit("var $this = this;\n", null);
			// emit local variable declarations
			var locals = funcDef.getLocals();
			for (var i = 0; i < locals.length; ++i) {
				this._emit(_Util.buildAnnotation("/** @type {%1} */\n", locals[i].getType()), null);
				this._emit("var " + locals[i].getName().getValue() + " = ");
				this._emitDefaultValueOf(locals[i].getType());
				this._emit(";\n", null)
			}
			// emit code
			var statements = funcDef.getStatements();
			for (var i = 0; i < statements.length; ++i)
				if (! (statements[i] instanceof ConstructorInvocationStatement))
					this._getStatementEmitterFor(statements[i]).emit();

		} finally {
			this._emittingFunction = null;
		}
	},

	_emitMemberVariable: function (holder, variable) {
		this._emit(holder + "." + variable.name() + " = ", null);
		var initialValue = variable.getInitialValue();
		if (initialValue != null)
			this._getExpressionEmitterFor(initialValue).emit(0);
		else
			this._emitDefaultValueOf(variable.getType());
		this._emit(";\n", null);
	},

	_emitDefaultValueOf: function (type) {
		if (type.equals(Type.booleanType))
			this._emit("false", null);
		else if (type.equals(Type.integerType) || type.equals(Type.numberType))
			this._emit("0", null);
		else if (type.equals(Type.stringType))
			this._emit("\"\"", null);
		else if (type instanceof MayBeUndefinedType)
			this._emit("undefined", null);
		else
			this._emit("null", null);
	},

	_emitStatements: function (statements) {
		this._advanceIndent();
		for (var i = 0; i < statements.length; ++i)
			this._getStatementEmitterFor(statements[i]).emit();
		this._reduceIndent();
	},

	_emit: function (str, token) {
		if (str == "")
			return;
		if (this._output.match(/\n$/))
			this._output += this._getIndent();
		this._output += str.replace(/\n(.)/g, (function (a, m) { return "\n" + this._getIndent() + m; }).bind(this));
	},

	_advanceIndent: function () {
		++this._indent;
	},

	_reduceIndent: function () {
		if (--this._indent < 0)
			throw new Error("indent mistach");
	},

	_getIndent: function () {
		var s = "";
		for (var i = 0; i < this._indent; ++i)
			s += "\t";
		return s;
	},

	_getStatementEmitterFor: function (statement) {
		if (statement instanceof ConstructorInvocationStatement)
			return new _ConstructorInvocationStatementEmitter(this, statement);
		else if (statement instanceof ExpressionStatement)
			return new _ExpressionStatementEmitter(this, statement);
		else if (statement instanceof ReturnStatement)
			return new _ReturnStatementEmitter(this, statement);
		else if (statement instanceof DeleteStatement)
			return new _DeleteStatementEmitter(this, statement);
		else if (statement instanceof BreakStatement)
			return new _BreakStatementEmitter(this, statement);
		else if (statement instanceof ContinueStatement)
			return new _ContinueStatementEmitter(this, statement);
		else if (statement instanceof LabelStatement)
			return new _LabelStatementEmitter(this, statement);
		else if (statement instanceof DoWhileStatement)
			return new _DoWhileStatementEmitter(this, statement);
		else if (statement instanceof ForInStatement)
			return new _ForInStatementEmitter(this, statement);
		else if (statement instanceof ForStatement)
			return new _ForStatementEmitter(this, statement);
		else if (statement instanceof IfStatement)
			return new _IfStatementEmitter(this, statement);
		else if (statement instanceof SwitchStatement)
			return new _SwitchStatementEmitter(this, statement);
		else if (statement instanceof CaseStatement)
			return new _CaseStatementEmitter(this, statement);
		else if (statement instanceof DefaultStatement)
			return new _DefaultStatementEmitter(this, statement);
		else if (statement instanceof WhileStatement)
			return new _WhileStatementEmitter(this, statement);
		else if (statement instanceof TryStatement)
			return new _TryStatementEmitter(this, statement);
		else if (statement instanceof AssertStatement)
			return new _AssertStatementEmitter(this, statement);
		else if (statement instanceof LogStatement)
			return new _LogStatementEmitter(this, statement);
		throw new Error("got unexpected type of statement: " + JSON.stringify(statement.serialize()));
	},

	_getExpressionEmitterFor: function (expr) {
		if (expr instanceof IdentifierExpression)
			return new _IdentifierExpressionEmitter(this, expr);
		else if (expr instanceof UndefinedExpression)
			return new _UndefinedExpressionEmitter(this, expr);
		else if (expr instanceof NullExpression)
			return new _NullExpressionEmitter(this, expr);
		else if (expr instanceof BooleanLiteralExpression)
			return new _BooleanLiteralExpressionEmitter(this, expr);
		else if (expr instanceof IntegerLiteralExpression)
			return new _IntegerLiteralExpressionEmitter(this, expr);
		else if (expr instanceof NumberLiteralExpression)
			return new _NumberLiteralExpressionEmitter(this, expr);
		else if (expr instanceof StringLiteralExpression)
			return new _StringLiteralExpressionEmitter(this, expr);
		else if (expr instanceof RegExpLiteralExpression)
			return new _RegExpLiteralExpressionEmitter(this, expr);
		else if (expr instanceof ArrayLiteralExpression)
			return new _ArrayLiteralExpressionEmitter(this, expr);
		else if (expr instanceof HashLiteralExpression)
			return new _HashLiteralExpressionEmitter(this, expr);
		else if (expr instanceof ThisExpression)
			return new _ThisExpressionEmitter(this, expr);
		else if (expr instanceof BitwiseNotExpression)
			return new _UnaryExpressionEmitter(this, expr);
		else if (expr instanceof InstanceofExpression)
			return new _InstanceofExpressionEmitter(this, expr);
		else if (expr instanceof AsExpression)
			return new _AsExpressionEmitter(this, expr);
		else if (expr instanceof AsNoCheckExpression)
			return new _AsNoCheckExpressionEmitter(this, expr);
		else if (expr instanceof LogicalNotExpression)
			return new _UnaryExpressionEmitter(this, expr);
		else if (expr instanceof PostIncrementExpression)
			return new _PostfixExpressionEmitter(this, expr);
		else if (expr instanceof PreIncrementExpression)
			return new _UnaryExpressionEmitter(this, expr);
		else if (expr instanceof PropertyExpression)
			return new _PropertyExpressionEmitter(this, expr);
		else if (expr instanceof SignExpression)
			return new _UnaryExpressionEmitter(this, expr);
		else if (expr instanceof AdditiveExpression)
			return new _BinaryExpressionEmitter(this, expr);
		else if (expr instanceof ArrayExpression)
			return new _ArrayExpressionEmitter(this, expr);
		else if (expr instanceof AssignmentExpression)
			return new _BinaryExpressionEmitter(this, expr);
		else if (expr instanceof BinaryNumberExpression)
			return new _BinaryExpressionEmitter(this, expr);
		else if (expr instanceof EqualityExpression)
			return new _BinaryExpressionEmitter(this, expr);
		else if (expr instanceof InExpression)
			return new _BinaryExpressionEmitter(this, expr);
		else if (expr instanceof LogicalExpression)
			return new _BinaryExpressionEmitter(this, expr);
		else if (expr instanceof ShiftExpression)
			return new _BinaryExpressionEmitter(this, expr);
		else if (expr instanceof ConditionalExpression)
			return new _ConditionalExpressionEmitter(this, expr);
		else if (expr instanceof CallExpression)
			return new _CallExpressionEmitter(this, expr);
		else if (expr instanceof SuperExpression)
			return new _SuperExpressionEmitter(this, expr);
		else if (expr instanceof NewExpression)
			return new _NewExpressionEmitter(this, expr);
		else if (expr instanceof FunctionExpression)
			return new _FunctionExpressionEmitter(this, expr);
		else if (expr instanceof CommaExpression)
			return new _CommaExpressionEmitter(this, expr);
		throw new Error("got unexpected type of expression: " + JSON.stringify(expr.serialize()));
	},

	_mangleConstructorName: function (classDef, argTypes) {
		if ((classDef.flags() & ClassDefinition.IS_NATIVE) != 0)
			return classDef.className();
		return classDef.className() + this._mangleFunctionArguments(argTypes);
	},

	_mangleFunctionName: function (name, argTypes) {
		// NOTE: how mangling of "toString" is omitted is very hacky, but it seems like the easiest way, taking the fact into consideration that it is the only function in Object
		if (name != "toString")
			name += this._mangleFunctionArguments(argTypes);
		return name;
	},

	_mangleTypeName: function (type) {
		if (type.equals(Type.voidType))
			return "V";
		else if (type.equals(Type.booleanType))
			return "B";
		else if (type.equals(Type.integerType))
			return "I";
		else if (type.equals(Type.numberType))
			return "N";
		else if (type.equals(Type.stringType))
			return "S";
		else if (type instanceof ObjectType) {
			var classDef = type.getClassDef();
			if (classDef instanceof InstantiatedClassDefinition) {
				var typeArgs = classDef.getTypeArguments();
				var s = "T" + classDef.getTemplateClassName() + "$";
				for (var i = 0; i < typeArgs.length; ++i)
					s += this._mangleTypeName(typeArgs[i]);
				s += "$";
				return s;
			}
			return "L" + type.toString() + "$";
		} else if (type instanceof StaticFunctionType)
			return "F" + this._mangleFunctionArguments(type.getArgumentTypes()) + "$";
		else if (type instanceof MemberFunctionType)
			return "M" + this._mangleTypeName(type.getObjectType()) + this._mangleFunctionArguments(type.getArgumentTypes()) + "$";
		else if (type instanceof MayBeUndefinedType)
			return "U" + this._mangleTypeName(type.getBaseType());
		else
			throw new Error("FIXME " + type.toString());
	},

	_mangleFunctionArguments: function (argTypes) {
		var s = "$";
		for (var i = 0; i < argTypes.length; ++i)
			s += this._mangleTypeName(argTypes[i]);
		return s;
	},

	_mangleTypeString: function (s) {
		return s.length + s;
	},

	_findFunctions: function (classDef, name, isStatic) {
		var functions = [];
		var members = classDef.members();
		for (var i = 0; i < members.length; ++i) {
			var member = members[i];
			if ((member instanceof MemberFunctionDefinition) && member.name() == name
				&& (member.flags() & ClassDefinition.IS_STATIC) == (isStatic ? ClassDefinition.IS_STATIC : 0))
				functions.push(member);
		}
		return functions;
	},

	$initialize: function () {
		var precedence = [
			[
				[ "new",        _NewExpressionEmitter._setOperatorPrecedence ],
				[ "[",          _ArrayExpressionEmitter._setOperatorPrecedence ],
				[ ".",          _PropertyExpressionEmitter._setOperatorPrecedence ],
				[ "(",          _CallExpressionEmitter._setOperatorPrecedence ],
				[ "super",      _SuperExpressionEmitter._setOperatorPrecedence ],
				[ "function",   _FunctionExpressionEmitter._setOperatorPrecedence ],
			], [
				[ "++",         _PostfixExpressionEmitter._setOperatorPrecedence ],
				[ "--",         _PostfixExpressionEmitter._setOperatorPrecedence ]
			], [
				// delete is not used by JSX
				[ "void",       _UnaryExpressionEmitter._setOperatorPrecedence ],
				// typeof is not used by JSX
				[ "++",         _UnaryExpressionEmitter._setOperatorPrecedence ],
				[ "--",         _UnaryExpressionEmitter._setOperatorPrecedence ],
				[ "+",          _UnaryExpressionEmitter._setOperatorPrecedence ],
				[ "-",          _UnaryExpressionEmitter._setOperatorPrecedence ],
				[ "~",          _UnaryExpressionEmitter._setOperatorPrecedence ],
				[ "!",          _UnaryExpressionEmitter._setOperatorPrecedence ]
			], [
				[ "*",          _BinaryExpressionEmitter._setOperatorPrecedence ],
				[ "/",          _BinaryExpressionEmitter._setOperatorPrecedence ],
				[ "%",          _BinaryExpressionEmitter._setOperatorPrecedence ]
			], [
				[ "+",          _BinaryExpressionEmitter._setOperatorPrecedence ],
				[ "-",          _BinaryExpressionEmitter._setOperatorPrecedence ]
			], [
				[ "<<",         _BinaryExpressionEmitter._setOperatorPrecedence ],
				[ ">>",         _BinaryExpressionEmitter._setOperatorPrecedence ],
				[ ">>>",        _BinaryExpressionEmitter._setOperatorPrecedence ],
			], [
				[ "<",          _BinaryExpressionEmitter._setOperatorPrecedence ],
				[ ">",          _BinaryExpressionEmitter._setOperatorPrecedence ],
				[ "<=",         _BinaryExpressionEmitter._setOperatorPrecedence ],
				[ ">=",         _BinaryExpressionEmitter._setOperatorPrecedence ],
				[ "instanceof", _InstanceofExpressionEmitter._setOperatorPrecedence ],
				[ "in",         _BinaryExpressionEmitter._setOperatorPrecedence ]
			], [
				[ "==",         _BinaryExpressionEmitter._setOperatorPrecedence ],
				[ "!=",         _BinaryExpressionEmitter._setOperatorPrecedence ]
			], [
				[ "&",          _BinaryExpressionEmitter._setOperatorPrecedence ]
			], [
				[ "^",          _BinaryExpressionEmitter._setOperatorPrecedence ]
			], [
				[ "|",          _BinaryExpressionEmitter._setOperatorPrecedence ]
			], [
				[ "&&",         _BinaryExpressionEmitter._setOperatorPrecedence ]
			], [
				[ "||",         _BinaryExpressionEmitter._setOperatorPrecedence ]
			], [
				[ "=",          _BinaryExpressionEmitter._setOperatorPrecedence ],
				[ "*=",         _BinaryExpressionEmitter._setOperatorPrecedence ],
				[ "/=",         _BinaryExpressionEmitter._setOperatorPrecedence ],
				[ "%=",         _BinaryExpressionEmitter._setOperatorPrecedence ],
				[ "+=",         _BinaryExpressionEmitter._setOperatorPrecedence ],
				[ "-=",         _BinaryExpressionEmitter._setOperatorPrecedence ],
				[ "<<=",        _BinaryExpressionEmitter._setOperatorPrecedence ],
				[ ">>=",        _BinaryExpressionEmitter._setOperatorPrecedence ],
				[ ">>>=",       _BinaryExpressionEmitter._setOperatorPrecedence ],
				[ "&=",         _BinaryExpressionEmitter._setOperatorPrecedence ],
				[ "^=",         _BinaryExpressionEmitter._setOperatorPrecedence ],
				[ "|=",         _BinaryExpressionEmitter._setOperatorPrecedence ]
			], [
				[ "?",          _ConditionalExpressionEmitter._setOperatorPrecedence ]
			], [
				[ ",",          _CommaExpressionEmitter._setOperatorPrecedence ]
			]
		];
		for (var i = 0; i < precedence.length; ++i) {
			var opTypeList = precedence[i];
			for (var j = 0; j < opTypeList.length; ++j)
				opTypeList[j][1](opTypeList[j][0], -(precedence.length - i));
		}
	}

});
// vim: set noexpandtab:
