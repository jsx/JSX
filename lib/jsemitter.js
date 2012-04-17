var Class = require("./Class");
eval(Class.$import("./classdef"));
eval(Class.$import("./type"));
eval(Class.$import("./expression"));
eval(Class.$import("./statement"));
eval(Class.$import("./emitter"));

// statement emitter

var _StatementEmitter = exports._StatementEmitter = Class.extend({

	initialize: function (emitter) {
		this._emitter = emitter;
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

var _ArrayLiteralExpressionEmitter = exports._ArrayLiteralExpressionEmitter = _ExpressionEmitter.extend({

	initialize: function (emitter, expr) {
		_ExpressionEmitter.prototype.initialize.call(this, emitter);
		this._expr = expr;
	},

	emit: function (outerOpPrecedence) {
		this._emitter._emit("[", null);
		var exprs = this._expr.getExprs();
		for (var i = 0; i < exprs.length; ++i) {
			if (i != 0)
				this._emitter._emit(", ", null);
			this._emitter._getExpressionEmitterFor(exprs[i]).emit(0);
		}
		this._emitter._emit("]", null);
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
			this._emitter._emit(emittingFunction.getClassDef().className(), this._expr.getToken());
		else
			this._emitter._emit("this", this._expr.getToken());
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
		this._emitter._getExpressionEmitterFor(this._expr.getExpr()).emit(this._getPrecedence());
		var identifierToken = this._expr.getIdentifierToken();
		this._emitter._emit(".", identifierToken);
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
		// special handling: (undefined as MayBeUndefined<String>) + (undefined as MayBeUndefined<String>) should produce "undefinedundefined", not NaN
		if (opToken.getValue() == "+" && firstExprType.equals(secondExprType) && firstExprType.equals(new MayBeUndefinedType(Type.stringType)))
			this._emitter._emit("\"\" + ", null);
		this._emitter._getExpressionEmitterFor(firstExpr).emit(this._precedence);
		this._emitter._emit(" " + opToken.getValue() + " ", opToken);
		this._emitter._getExpressionEmitterFor(secondExpr).emit(this._precedence);
		// mangle the name if necessary
		if (secondExprType instanceof FunctionType) {
			if (! secondExprType.isAssignable()
				&& (secondExpr.getHolderType().getClassDef().flags() & ClassDefinition.IS_NATIVE) == 0)
				this._emitter._emit(this._emitter._mangleFunctionArguments(secondExprType.getArgumentTypes()), null);
		} else if (secondExprType instanceof FunctionChoiceType) {
			throw new Error("logic flaw, should be resolved by expression.js");
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
		// append the mangled suffix if the base expression is a property expression specifying a function (that is not assigned to other property)
		var baseExpr = this._expr.getExpr();
		if (baseExpr instanceof PropertyExpression && ! baseExpr.getType().isAssignable()
			&& (baseExpr.getHolderType().getClassDef().flags() & ClassDefinition.IS_NATIVE) == 0) {
			this._emitter._emit(this._emitter._mangleFunctionArguments(baseExpr.getType().getArgumentTypes()), null);
		}
		this._emitter._emit("(", null);
		var args = this._expr.getArguments();
		for (var i = 0; i < args.length; ++i) {
			if (i != 0)
				this._emitter._emit(", ", null);
			this._emitter._getExpressionEmitterFor(args[i]).emit(0);
		}
		this._emitter._emit(")");
	},

	_getPrecedence: function () {
		return _CallExpressionEmitter._operatorPrecedence;
	},

	$_operatorPrecedence: 0,

	$_setOperatorPrecedence: function (op, precedence) {
		_CallExpressionEmitter._operatorPrecedence = precedence;
	}

});

var _NewExpressionEmitter = exports._NewExpressionEmitter = _OperatorExpressionEmitter.extend({

	initialize: function (emitter, expr) {
		_OperatorExpressionEmitter.prototype.initialize.call(this, emitter);
		this._expr = expr;
	},

	emit: function (outerOpPrecedence) {
		this._emitter._emit("new ", null);
		var name = this._expr.getName();
		for (var i = 0; i < name.length; ++i) {
			if (i != 0)
				this._emitter._emit(".", null);
			this._emitter._emit(name[i].getValue(), name[i]);
		}
		this._emitter._emit("(", null);
		var args = this._expr.getArguments();
		for (var i = 0; i < args.length; ++i) {
			if (i != 0)
				this._emitter._emit(", ", null);
			this._emitter._getExpressionEmitterFor(args[i]).emit(0);
		}
		this._emitter._emit(")");
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

	initialize: function () {
		this._output = "";
		this._indent = 0;
		this._emittingClass = null;
		this._emittingFunction = null;
	},

	emitClassDefinition: function (classDef) {

		try {
			this._emittingClass = classDef;

			// emit constructor
			var ctors = this._findFunctions(classDef, "initialize", false);
			switch (ctors.length) {
			case 0:
				this._emitConstructor(classDef, null);
				break;
			case 1:
				this._emitConstructor(classDef, ctors[0]);
				break;
			default:
				throw new Error("FIXME");
			}

			// emit functions
			var members = classDef.members();
			for (var i = 0; i < members.length; ++i) {
				var member = members[i];
				if (member instanceof MemberFunctionDefinition) {
					if (! (member.name() == "initialize" && (member.flags() & ClassDefinition.IS_STATIC) == 0) && member.getStatements() != null) {
						this._emit("\n", null);
						this._emitFunction(member);
					}
				}
			}

		} finally {
			this._emittingClass = null;
		}

	},

	emitStaticInitializationCode: function (classDef) {
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

	_emitConstructor: function (classDef, funcDef) {
		// emit prologue
		this._emit("function " + classDef.className() + "(", null);
		if (funcDef != null)
			this._emitFunctionArguments(funcDef);
		this._emit(") {\n", null);
		this._advanceIndent();
		// emit member variable initialization code
		var members = classDef.members();
		for (var i = 0; i < members.length; ++i) {
			var member = members[i];
			if ((member instanceof MemberVariableDefinition) && (member.flags() & ClassDefinition.IS_STATIC) == 0)
				this._emitMemberVariable("this", member);
		}
		// emit function body
		if (funcDef != null)
			this._emitFunctionBody(funcDef);
		// emit epilogue
		this._reduceIndent();
		this._emit("}\n", null);
	},

	_emitFunction: function (funcDef) {
		this._emit(funcDef.getClassDef().className(), null);
		if ((funcDef.flags() & ClassDefinition.IS_STATIC) == 0)
			this._emit(".prototype", null);
		this._emit("." + this._mangleFunctionName(funcDef) + " = function (", null);
		this._emitFunctionArguments(funcDef);
		this._emit(") {\n", null);
		this._advanceIndent();
		this._emitFunctionBody(funcDef);
		this._reduceIndent();
		this._emit("};\n", null);
	},

	_emitFunctionArguments: function (funcDef) {
		var args = funcDef.getArguments();
		for (var i = 0; i < args.length; ++i) {
			if (i != 0)
				this._emit(", ");
			this._emit(args[i].getName().getValue());
		}
	},

	_emitFunctionBody: function (funcDef) {
		try {
			this._emittingFunction = funcDef;

			// emit local variable declarations
			var locals = funcDef.getLocals();
			for (var i = 0; i < locals.length; ++i) {
				this._emit("var " + locals[i].getName().getValue() + " = ");
				this._emitDefaultValueOf(locals[i].getType());
				this._emit(";\n", null)
			}
			// emit code
			var statements = funcDef.getStatements();
			for (var i = 0; i < statements.length; ++i)
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
		if (this._output.match(/\n$/))
			this._output += this._getIndent();
		this._output += str.replace(/\n(.)/g, function (a, m) { "\n" + this._getIndent() + m; });
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
		if (statement instanceof ExpressionStatement)
			return new _ExpressionStatementEmitter(this, statement);
		else if (statement instanceof ReturnStatement)
			return new _ReturnStatementEmitter(this, statement);
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
		else if (expr instanceof ArrayLiteralExpression)
			return new _ArrayLiteralExpressionEmitter(this, expr);
		else if (expr instanceof ThisExpression)
			return new _ThisExpressionEmitter(this, expr);
		else if (expr instanceof BitwiseNotExpression)
			return new _UnaryExpressionEmitter(this, expr);
		else if (expr instanceof DeleteExpression)
			return new _UnaryExpressionEmitter(this, expr);
		else if (expr instanceof InstanceofExpression)
			return new _InstanceofExpressionEmitter(this);
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
		else if (expr instanceof NewExpression)
			return new _NewExpressionEmitter(this, expr);
		else if (expr instanceof CommaExpression)
			return new _CommaExpressionEmitter(this, expr);
		throw new Error("got unexpected type of expression: " + JSON.stringify(expr.serialize()));
	},

	_mangleFunctionName: function (funcDef) {
		return funcDef.name() + this._mangleFunctionArguments(funcDef.getArgumentTypes());
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
		else if (type instanceof ArrayType)
			return "A" + this._mangleTypeName(type.getElementType());
		else if (type instanceof ObjectType)
			return "L" + this._mangleTypeString(type.toString());
		else if (type instanceof StaticFunctionType)
			return "F" + this._mangleFunctionArguments(type.getArgumentTypes());
		else if (type instanceof MemberFunctionType)
			return "M" + this._mangleTypeName(type.getObjectType()) + this._mangleFunctionArguments(type.getArgumentTypes());
		else
			throw new Error("FIXME " + type.toString());
	},

	_mangleFunctionArguments: function (argTypes) {
		var s = "" + argTypes.length;
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
			], [
				[ "++",         _PostfixExpressionEmitter._setOperatorPrecedence ],
				[ "--",         _PostfixExpressionEmitter._setOperatorPrecedence ]
			], [
				[ "delete",     _UnaryExpressionEmitter._setOperatorPrecedence ],
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
