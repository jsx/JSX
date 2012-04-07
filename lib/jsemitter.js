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
		this._emitter._getExpressionEmitterFor(this._statement.getExpr()).emit();
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
			this._emitter._getExpressionEmitterFor(this._statement.getExpr()).emit();
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
		throw new Error("FIXME _BreakStatementEmitter.emit");
	}

});

var _ContinueStatementEmitter = exports._ContinueStatementEmitter = _StatementEmitter.extend({

	initialize: function (emitter, statement) {
		_StatementEmitter.prototype.initialize.call(this, emitter);
		this._statement = statement;
	},

	emit: function () {
		throw new Error("FIXME _ContinueStatementEmitter.emit");
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
		throw new Error("FIXME _DoWhileStatementEmitter.emit");
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
		throw new Error("FIXME _ForStatementEmitter.emit");
	}

});

var _IfStatementEmitter = exports._IfStatementEmitter = _StatementEmitter.extend({

	initialize: function (emitter, statement) {
		_StatementEmitter.prototype.initialize.call(this, emitter);
		this._statement = statement;
	},

	emit: function () {
		this._emitter._emit("if (", null);
		this._emitter._getExpressionEmitterFor(this._statement.getExpr()).emit();
		this._emitter._emit(") {\n", null);
		this._emitter._emitStatements(this._statement.getIfTrueStatements());
		var ifFalseStatements = this._statement.getIfFalseStatements();
		if (ifFalseStatements != null) {
			this._emitter._emit("} else {", null);
			this._emitter._emitStatements(ifFalseStatements);
		}
		this._emitter.emit("}\n", null);
	}

});

var _SwitchStatementEmitter = exports._SwitchStatementEmitter = _StatementEmitter.extend({

	initialize: function (emitter, statement) {
		_StatementEmitter.prototype.initialize.call(this, emitter);
		this._statement = statement;
	},

	emit: function () {
		throw new Error("FIXME _SwitchStatementEmitter.emit");
	}

});

var _WhileStatementEmitter = exports._WhileStatementEmitter = _StatementEmitter.extend({

	initialize: function (emitter, statement) {
		_StatementEmitter.prototype.initialize.call(this, emitter);
		this._statement = statement;
	},

	emit: function () {
		throw new Error("FIXME _WhileStatementEmitter.emit");
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
			this._emitter._getExpressionEmitterFor(exprs[i]).emit();
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
		var ident = this._expr._identifierToken.identifier;
		this._emitter._emit(ident, null);
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
		this._emitter._emit("\"" + token.string + "\"", token);
	}

});

var _ThisExpressionEmitter = exports._ThisExpressionEmitter = _ExpressionEmitter.extend({

	initialize: function (emitter, expr) {
		_ExpressionEmitter.prototype.initialize.call(this, emitter);
		this._expr = expr;
	},

	emit: function (outerOpPrecedence) {
		throw new Error("FIXME _ThisExpressionEmitter.emit");
	}

});

var _UnaryExpressionEmitter = exports._UnaryExpressionEmitter = _ExpressionEmitter.extend({

	initialize: function (emitter, expr) {
		_ExpressionEmitter.prototype.initialize.call(this, emitter);
		this._expr = expr;
	},

	emit: function (outerOpPrecedence) {
		var opPrecedence = this._getPrecedence();
		if (opPrecedence < outerOpPrecedence) {
			this._emitter._emit("(", null);
			this._emit();
			this._emitter._emit(")", null);
		}
	},

	_emit: function () {
		var opToken = this._expr.getOperatorToken();
		this._emitter._emit(opToken.keyword + " ", opToken);
		this._emitter._getExpressionEmitterFor(this._expr.getExpr()).emit();
	},

	_getPrecedence: function () {
		return _UnaryExpressionEmitter._operatorPrecedence[this._expr.getOperatorToken().keyword];
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
		this._emitter._getExpressionEmitterFor(this._expr.getExpr()).emit();
		this._emitter._emit(opToken.keyword + " ", opToken);
	},

	_getPrecedence: function () {
		return _PostfixExpressionEmitter._operatorPrecedence[this._expr.getOperatorToken().keyword];
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
		this._emitter._getExpressionEmitterFor(this._expr.getExpr()).emit();
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
		this._emitter._getExpressionEmitterFor(this._expr.getExpr()).emit();
		this._emitter._emit(".", opToken);
		var identifierToken = this._expr.getIdentifierToken();
		this._emitter._emit(identifierToken.toString(), identifierToken);
	},

	_getPrecedence: function () {
		return _PropertyExpressionEmitter._operatorPrecedence;
	},

	$_operatorPrecedence: 0,

	$_setOperatorPrecedence: function (op, precedence) {
		_PropertyExpressionEmitter._operatorPrecedence = precedence;
	}

});

var _BinaryExpressionEmitter = exports._BinaryExpressionEmitter = _ExpressionEmitter.extend({

	initialize: function (emitter, expr) {
		_ExpressionEmitter.prototype.initialize.call(this, emitter);
		this._expr = expr;
	},

	emit: function (outerOpPrecedence) {
		var opPrecedence = this._getPrecedence();
		if (opPrecedence < outerOpPrecedence) {
			this._emitter._emit("(", null);
			this._emit();
			this._emitter._emit(")", null);
		} else {
			this._emit();
		}
	},

	_emit: function () {
		var opToken = this._expr.getOperatorToken();
		this._emitter._getExpressionEmitterFor(this._expr.getFirstExpr()).emit();
		this._emitter._emit(" " + opToken.keyword + " ", opToken);
		this._emitter._getExpressionEmitterFor(this._expr.getSecondExpr()).emit();
	},

	_getPrecedence: function () {
		return _BinaryExpressionEmitter._operatorPrecedence[this._expr.getOperatorToken().keyword];
	},

	$_operatorPrecedence: {},

	$_setOperatorPrecedence: function (op, precedence) {
		_BinaryExpressionEmitter._operatorPrecedence[op] = precedence;
	}

});

var _ArrayExpressionEmitter = exports._ArrayExpressionEmitter = _BinaryExpressionEmitter.extend({

	initialize: function (emitter, expr) {
		_BinaryExpressionEmitter.prototype.initialize.call(this, emitter, expr);
		this._expr = expr;
	},

	_emit: function () {
		this._emitter._getExpressionEmitterFor(this._expr.getFirstExpr()).emit();
		this._emitter._emit("[", this._expr.getOperatorToken());
		this._emitter._getExpressionEmitterFor(this._expr.getSecondExpr()).emit();
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

var _ConditionalExpressionEmitter = exports._ConditionalExpressionEmitter = _ExpressionEmitter.extend({

	initialize: function (emitter, expr) {
		_ExpressionEmitter.prototype.initialize.call(this, emitter);
		this._expr = expr;
	},

	emit: function (outerOpPrecedence) {
		throw new Error("FIXME _ConditionalExpressionEmitter.emit");
	},

	$_operatorPrecedence: 0,

	$_setOperatorPrecedence: function (op, precedence) {
		_ConditionalExpressionEmitter._operatorPrecedence = precedence;
	}

});

var _CallExpressionEmitter = exports._CallExpressionEmitter = _ExpressionEmitter.extend({

	initialize: function (emitter, expr) {
		_ExpressionEmitter.prototype.initialize.call(this, emitter);
		this._expr = expr;
	},

	emit: function (outerOpPrecedence) {
		throw new Error("FIXME _CallExpressionEmitter.emit");
	},

	$_operatorPrecedence: 0,

	$_setOperatorPrecedence: function (op, precedence) {
		_CallExpressionEmitter._operatorPrecedence = precedence;
	}

});

var _NewExpressionEmitter = exports._NewExpressionEmitter = _ExpressionEmitter.extend({

	initialize: function (emitter, expr) {
		_ExpressionEmitter.prototype.initialize.call(this, emitter);
		this._expr = expr;
	},

	emit: function (outerOpPrecedence) {
		throw new Error("FIXME _NewExpressionEmitter.emit");
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
		throw new Error("FIXME _CommaExpressionEmitter.emit");
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
	},

	emitClassDefinition: function (classDef) {

		var className = classDef.className().identifier;

		// emit constructor
		var ctors = this._findFunctions(classDef, "initialize");
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
				this._emit("\n", null);
				this._emitFunction(member);
			}
		}

	},

	emitStaticInitializationCode: function (classDef) {
		var members = classDef.members();
		for (var i = 0; i < members.length; ++i) {
			var member = members[i];
			if ((member instanceof MemberVariableDefinition) && (member.flags() & ClassDefinition.IS_STATIC) != 0) {
				throw new Error("FIXME");
			}
		}
	},

	getOutput: function () {
		return this._output;
	},

	_emitConstructor: function (classDef, funcDef) {
		// emit prologue
		this._emit("function " + classDef.className().identifier + "(", null);
		if (funcDef != null)
			this._emitFunctionArguments(funcDef);
		this._emit(") {\n", null);
		this._advanceIndent();
		// emit member variable initialization code
		var members = classDef.members();
		for (var i = 0; i < members.length; ++i) {
			var member = members[i];
			if ((member instanceof MemberVariableDefinition) && (member.flags() & ClassDefinition.IS_STATIC) == 0) {
				this._emit("this." + member.name().identifier + " = ");
				var initialValue = member.getInitialValue();
				if (initialValue != null)
					this._getExpressionEmitterFor(initialValue).emit();
				else
					this._emitDefaultValueOf(member.getType());
				this._emit(";\n", null);
			}
		}
		// emit function body
		if (funcDef != null)
			this._emitFunctionBody(funcDef);
		// emit epilogue
		this._reduceIndent();
		this._emit("}\n", null);
	},

	_emitFunction: function (funcDef) {
		this._emit(funcDef.getClassDef().className().identifier, null);
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
			this._emit(args[i].getName().identifier);
		}
	},

	_emitFunctionBody: function (funcDef) {
		// emit local variable declarations
		var locals = funcDef.getLocals();
		for (var i = 0; i < locals.length; ++i) {
			this._emit("var " + locals[i].getName().identifier + " = ");
			this._emitDefaultValueOf(locals[i].getType());
			this._emit(";\n", null)
		}
		// emit code
		var statements = funcDef.getStatements();
		for (var i = 0; i < statements.length; ++i)
			this._getStatementEmitterFor(statements[i]).emit();
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
			this._output += this._getIdent();
		this._output += str.replace(/\n(.)/g, function (a, m) { "\n" + this._getIdent() + m; });
	},

	_advanceIndent: function () {
		++this._indent;
	},

	_reduceIndent: function () {
		if (--this._indent < 0)
			throw new Error("indent mistach");
	},

	_getIdent: function () {
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
		else if (expr instanceof NumberLiteralExpression)
			return new _NumberLiteralExpressionEmitter(this, expr);
		else if (expr instanceof StringLiteralExpression)
			return new _StringLiteralExpressionEmitter(this, expr);
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
		else if (expr instanceof TypeofExpression)
			return new _UnaryExpressionEmitter(this, expr);
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
		var s = argTypes.length;
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
				&& (member.flags() & IS_STATIC) == (isStatic ? IS_STATIC : 0))
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
			], [
				[ "++",         _PostfixExpressionEmitter._setOperatorPrecedence ],
				[ "--",         _PostfixExpressionEmitter._setOperatorPrecedence ]
			], [
				[ "delete",     _UnaryExpressionEmitter._setOperatorPrecedence ],
				[ "void",       _UnaryExpressionEmitter._setOperatorPrecedence ],
				[ "typeof",     _UnaryExpressionEmitter._setOperatorPrecedence ],
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
				opTypeList[j][1](opTypeList[j][0], -i);
		}
	}

});
// vim: set noexpandtab:
