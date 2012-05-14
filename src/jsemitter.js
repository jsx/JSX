var Class = require("./Class");
eval(Class.$import("./classdef"));
eval(Class.$import("./type"));
eval(Class.$import("./expression"));
eval(Class.$import("./statement"));
eval(Class.$import("./emitter"));
eval(Class.$import("./jssourcemap"));
eval(Class.$import("./util"));

"use strict";

var _Util = exports._Util = Class.extend({

	$toClosureType: function (type) {
		if (type.equals(Type.booleanType)) {
			return "!boolean";
		} else if (type.equals(Type.integerType) || type.equals(Type.numberType)) {
			return "!number";
		} else if (type.equals(Type.stringType)) {
			return "!string";
		} else if (type instanceof MayBeUndefinedType) {
			return "undefined|" + this.toClosureType(type.getBaseType());
		} else if (type instanceof ObjectType) {
			var classDef = type.getClassDef();
			if (classDef instanceof InstantiatedClassDefinition && classDef.getTemplateClassName() == "Array") {
				return "Array.<undefined|" + this.toClosureType(classDef.getTypeArguments()[0]) + ">";
			} else if (classDef instanceof InstantiatedClassDefinition && classDef.getTemplateClassName() == "Map") {
				return "Object.<string, undefined|" + this.toClosureType(classDef.getTypeArguments()[0]) + ">";
			} else {
				return classDef.getOutputClassName();
			}
		} else if (type instanceof VariantType) {
			return "*";
		}
		return null;
	},

	$getInstanceofNameFromClassDef: function (classDef) {
		if (classDef instanceof InstantiatedClassDefinition) {
			var name = classDef.getTemplateClassName();
			if (name == "Map")
				name = "Object";
		} else {
			name = classDef.getOutputClassName();
		}
		return name;
	},

	$buildAnnotation: function (template, type) {
		var closureType = this.toClosureType(type);
		if (closureType == null)
			return "";
		return Util.format(template, [closureType]);
	},

	$emitLabelOfStatement: function (emitter, statement) {
		var label = statement.getLabel();
		if (label != null) {
			emitter._reduceIndent();
			emitter._emit(label.getValue() + ":\n", label);
			emitter._advanceIndent();
		}
	}

});

// statement emitter

var _StatementEmitter = exports._StatementEmitter = Class.extend({

	constructor: function (emitter) {
		this._emitter = emitter;
	}

});

var _ConstructorInvocationStatementEmitter = exports._ConstructorInvocationStatementEmitter = _StatementEmitter.extend({

	constructor: function (emitter, statement) {
		_StatementEmitter.prototype.constructor.call(this, emitter);
		this._statement = statement;
	},

	emit: function () {
		var ctorType = this._statement.getConstructorType();
		var argTypes = ctorType != null ? ctorType.getArgumentTypes() : [];
		var ctorName = this._emitter._mangleConstructorName(this._statement.getConstructingClassDef(), argTypes);
		var token = this._statement.getQualifiedName().getToken();
		if (ctorName == "Error" && this._statement.getArguments().length == 1) {
			/*
				At least v8 does not support "Error.call(this, message)"; it not only does not setup the stacktrace but also does
				not set the message property.  So we set the message property.
				We continue to call "Error" hoping that it would have some positive effect on other platforms (like setting the
				stacktrace, etc.).

				FIXME check that doing  "Error.call(this);" does not have any negative effect on other platforms
			*/
			this._emitter._emit("Error.call(this);\n", token);
			this._emitter._emit("this.message = ", token);
			this._emitter._getExpressionEmitterFor(this._statement.getArguments()[0]).emit(_BinaryExpressionEmitter._operatorPrecedence["="]);
		} else {
			this._emitter._emitCallArguments(token, ctorName + ".call(this", this._statement.getArguments(), argTypes);
			this._emitter._emit(";\n", token);
		}
	}

});

var _ExpressionStatementEmitter = exports._ExpressionStatementEmitter = _StatementEmitter.extend({

	constructor: function (emitter, statement) {
		_StatementEmitter.prototype.constructor.call(this, emitter);
		this._statement = statement;
	},

	emit: function () {
		this._emitter._getExpressionEmitterFor(this._statement.getExpr()).emit(0);
		this._emitter._emit(";\n", null);
	}

});

var _ReturnStatementEmitter = exports._ReturnStatementEmitter = _StatementEmitter.extend({

	constructor: function (emitter, statement) {
		_StatementEmitter.prototype.constructor.call(this, emitter);
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

	constructor: function (emitter, statement) {
		_StatementEmitter.prototype.constructor.call(this, emitter);
		this._statement = statement;
	},

	emit: function () {
		this._emitter._emit("delete ", this._statement.getToken());
		this._emitter._getExpressionEmitterFor(this._statement.getExpr()).emit(0);
		this._emitter._emit(";\n", null);
	}

});

var _BreakStatementEmitter = exports._BreakStatementEmitter = _StatementEmitter.extend({

	constructor: function (emitter, statement) {
		_StatementEmitter.prototype.constructor.call(this, emitter);
		this._statement = statement;
	},

	emit: function () {
		if (this._statement.getLabel() != null)
			this._emitter._emit("break " + this._statement.getLabel().getValue() + ";\n", this._statement.getToken());
		else
			this._emitter._emit("break;\n", this._statement.getToken());
	}

});

var _ContinueStatementEmitter = exports._ContinueStatementEmitter = _StatementEmitter.extend({

	constructor: function (emitter, statement) {
		_StatementEmitter.prototype.constructor.call(this, emitter);
		this._statement = statement;
	},

	emit: function () {
		if (this._statement.getLabel() != null)
			this._emitter._emit("continue " + this._statement.getLabel().getValue() + ";\n", this._statement.getToken());
		else
			this._emitter._emit("continue;\n", this._statement.getToken());
	}

});

var _DoWhileStatementEmitter = exports._DoWhileStatementEmitter = _StatementEmitter.extend({

	constructor: function (emitter, statement) {
		_StatementEmitter.prototype.constructor.call(this, emitter);
		this._statement = statement;
	},

	emit: function () {
		_Util.emitLabelOfStatement(this._emitter, this._statement);
		this._emitter._emit("do {\n", null);
		this._emitter._emitStatements(this._statement.getStatements());
		this._emitter._emit("} while (", null);
		this._emitter._getExpressionEmitterFor(this._statement.getExpr()).emit(0);
		this._emitter._emit(");\n", null);
	}

});

var _ForInStatementEmitter = exports._ForInStatementEmitter = _StatementEmitter.extend({

	constructor: function (emitter, statement) {
		_StatementEmitter.prototype.constructor.call(this, emitter);
		this._statement = statement;
	},

	emit: function () {
		_Util.emitLabelOfStatement(this._emitter, this._statement);
		this._emitter._emit("for (", null);
		this._emitter._getExpressionEmitterFor(this._statement.getLHSExpr()).emit(0);
		this._emitter._emit(" in ", null);
		this._emitter._getExpressionEmitterFor(this._statement.getListExpr()).emit(0);
		this._emitter._emit(") {\n", null);
		this._emitter._emitStatements(this._statement.getStatements());
		this._emitter._emit("}\n", null);
	}

});

var _ForStatementEmitter = exports._ForStatementEmitter = _StatementEmitter.extend({

	constructor: function (emitter, statement) {
		_StatementEmitter.prototype.constructor.call(this, emitter);
		this._statement = statement;
	},

	emit: function () {
		_Util.emitLabelOfStatement(this._emitter, this._statement);
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

	constructor: function (emitter, statement) {
		_StatementEmitter.prototype.constructor.call(this, emitter);
		this._statement = statement;
	},

	emit: function () {
		this._emitter._emit("if (", null);
		this._emitter._getExpressionEmitterFor(this._statement.getExpr()).emit(0);
		this._emitter._emit(") {\n", null);
		this._emitter._emitStatements(this._statement.getOnTrueStatements());
		var ifFalseStatements = this._statement.getOnFalseStatements();
		if (ifFalseStatements.length != 0) {
			this._emitter._emit("} else {\n", null);
			this._emitter._emitStatements(ifFalseStatements);
		}
		this._emitter._emit("}\n", null);
	}

});

var _SwitchStatementEmitter = exports._SwitchStatementEmitter = _StatementEmitter.extend({

	constructor: function (emitter, statement) {
		_StatementEmitter.prototype.constructor.call(this, emitter);
		this._statement = statement;
	},

	emit: function () {
		_Util.emitLabelOfStatement(this._emitter, this._statement);
		this._emitter._emit("switch (", null);
		var expr = this._statement.getExpr();
		if (this._emitter._enableRunTimeTypeCheck && expr.getType() instanceof MayBeUndefinedType) {
			this._emitter._emitExpressionWithUndefinedAssertion(expr);
		} else {
			this._emitter._getExpressionEmitterFor(expr).emit(0);
		}
		this._emitter._emit(") {\n", null);
		this._emitter._emitStatements(this._statement.getStatements());
		this._emitter._emit("}\n", null);
	}

});

var _CaseStatementEmitter = exports._CaseStatementEmitter = _StatementEmitter.extend({

	constructor: function (emitter, statement) {
		_StatementEmitter.prototype.constructor.call(this, emitter);
		this._statement = statement;
	},

	emit: function () {
		this._emitter._reduceIndent();
		this._emitter._emit("case ", null);
		var expr = this._statement.getExpr();
		if (this._emitter._enableRunTimeTypeCheck && expr.getType() instanceof MayBeUndefinedType) {
			this._emitter._emitExpressionWithUndefinedAssertion(expr);
		} else {
			this._emitter._getExpressionEmitterFor(expr).emit(0);
		}
		this._emitter._emit(":\n", null);
		this._emitter._advanceIndent();
	}

});

var _DefaultStatementEmitter = exports._DefaultStatementEmitter = _StatementEmitter.extend({

	constructor: function (emitter, statement) {
		_StatementEmitter.prototype.constructor.call(this, emitter);
		this._statement = statement;
	},

	emit: function () {
		this._emitter._reduceIndent();
		this._emitter._emit("default:\n", null);
		this._emitter._advanceIndent();
	}

});

var _WhileStatementEmitter = exports._WhileStatementEmitter = _StatementEmitter.extend({

	constructor: function (emitter, statement) {
		_StatementEmitter.prototype.constructor.call(this, emitter);
		this._statement = statement;
	},

	emit: function () {
		_Util.emitLabelOfStatement(this._emitter, this._statement);
		this._emitter._emit("while (", null);
		this._emitter._getExpressionEmitterFor(this._statement.getExpr()).emit(0);
		this._emitter._emit(") {\n", null);
		this._emitter._emitStatements(this._statement.getStatements());
		this._emitter._emit("}\n", null);
	}

});

var _TryStatementEmitter = exports._TryStatementEmitter = _StatementEmitter.extend({

	constructor: function (emitter, statement) {
		_StatementEmitter.prototype.constructor.call(this, emitter);
		this._statement = statement;
		var outerCatchStatements = 0;
		for (var i = 0; i < this._emitter._emittingStatementStack.length; ++i) {
			if (this._emitter._emittingStatementStack[i] instanceof _TryStatementEmitter)
				++outerCatchStatements;
		}
		this._emittingLocalName = "$__jsx_catch_" + outerCatchStatements;
	},

	emit: function () {
		this._emitter._emit("try {\n", this._statement.getToken());
		this._emitter._emitStatements(this._statement.getTryStatements());
		this._emitter._emit("}", null);
		var catchStatements = this._statement.getCatchStatements();
		if (catchStatements.length != 0) {
			this._emitter._emit(" catch (" + this._emittingLocalName + ") {\n", null);
			this._emitter._emitStatements(catchStatements);
			if (! catchStatements[catchStatements.length - 1].getLocal().getType().equals(Type.variantType)) {
				this._emitter._advanceIndent();
				this._emitter._emit("{\n", null);
				this._emitter._advanceIndent();
				this._emitter._emit("throw " + this._emittingLocalName + ";\n", null);
				this._emitter._reduceIndent();
				this._emitter._emit("}\n", null);
				this._emitter._reduceIndent();
			}
			this._emitter._emit("}", null);
		}
		var finallyStatements = this._statement.getFinallyStatements();
		if (finallyStatements.length != 0) {
			this._emitter._emit(" finally {\n", null);
			this._emitter._emitStatements(finallyStatements);
			this._emitter._emit("}", null);
		}
		this._emitter._emit("\n", null);
	},

	getEmittingLocalName: function () {
		return this._emittingLocalName;
	}

});

var _CatchStatementEmitter = exports._CatchStatementEmitter = _StatementEmitter.extend({

	constructor: function (emitter, statement) {
		_StatementEmitter.prototype.constructor.call(this, emitter);
		this._statement = statement;
	},

	emit: function () {
		var localType = this._statement.getLocal().getType();
		if (localType instanceof ObjectType) {
			var tryStatement = this._emitter._emittingStatementStack[this._emitter._emittingStatementStack.length - 2];
			var localName = tryStatement.getEmittingLocalName();
			this._emitter._emit("if (" + localName + " instanceof " + localType.getClassDef().getOutputClassName() + ") {\n", this._statement.getToken());
			this._emitter._emitStatements(this._statement.getStatements());
			this._emitter._emit("} else ", null);
		} else {
			this._emitter._emit("{\n", null);
			this._emitter._emitStatements(this._statement.getStatements());
			this._emitter._emit("}\n", null);
		}
	},

	$getLocalNameFor: function (emitter, name) {
		for (var i = emitter._emittingStatementStack.length - 1; i >= 0; --i) {
			if (! (emitter._emittingStatementStack[i] instanceof _CatchStatementEmitter))
				continue;
			var catchStatement = emitter._emittingStatementStack[i];
			if (catchStatement._statement.getLocal().getName().getValue() == name) {
				var tryEmitter = emitter._emittingStatementStack[i - 1];
				if (! (tryEmitter instanceof _TryStatementEmitter))
					throw new Error("logic flaw");
				return tryEmitter.getEmittingLocalName();
			}
		}
		throw new Error("logic flaw");
	}

});

var _ThrowStatementEmitter = exports._ThrowStatementEmitter = _StatementEmitter.extend({

	constructor: function (emitter, statement) {
		_StatementEmitter.prototype.constructor.call(this, emitter);
		this._statement = statement;
	},

	emit: function () {
		this._emitter._emit("throw ", this._statement.getToken());
		this._emitter._getExpressionEmitterFor(this._statement.getExpr()).emit(0);
		this._emitter._emit(";\n", null);
	}

});

var _AssertStatementEmitter = exports._AssertStatementEmitter = _StatementEmitter.extend({

	constructor: function (emitter, statement) {
		_StatementEmitter.prototype.constructor.call(this, emitter);
		this._statement = statement;
	},

	emit: function () {
		if (! this._emitter._enableAssertion)
			return;
		var condExpr = this._statement._expr;
		this._emitter._emitAssertion(function () {
			this._emitter._getExpressionEmitterFor(condExpr).emit(0);
		}.bind(this), this._statement.getToken(), "assertion failure");
	}

});

var _LogStatementEmitter = exports._LogStatementEmitter = _StatementEmitter.extend({

	constructor: function (emitter, statement) {
		_StatementEmitter.prototype.constructor.call(this, emitter);
		this._statement = statement;
	},

	emit: function () {
		if (! this._emitter._enableLogging)
			return;
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

var _DebuggerStatementEmitter = exports._DebuggerStatementEmitter = _StatementEmitter.extend({

	constructor: function (emitter, statement) {
		_StatementEmitter.prototype.constructor.call(this, emitter);
		this._statement = statement;
	},

	emit: function () {
		this._emitter._emit("debugger;\n", this._statement.getToken());
	}

});

// expression emitter

var _ExpressionEmitter = exports._ExpressionEmitter = Class.extend({

	constructor: function (emitter) {
		this._emitter = emitter;
	},

	emitWithPrecedence: function (outerOpPrecedence, precedence, callback) {
		if (precedence > outerOpPrecedence) {
			this._emitter._emit("(", null);
			callback();
			this._emitter._emit(")", null);
		} else {
			callback();
		}
	}

});

var _IdentifierExpressionEmitter = exports._IdentifierExpressionEmitter = _ExpressionEmitter.extend({

	constructor: function (emitter, expr) {
		_ExpressionEmitter.prototype.constructor.call(this, emitter);
		this._expr = expr;
	},

	emit: function (outerOpPrecedence) {
		var type = this._expr.getType();
		if (type instanceof ClassDefType) {
			this._emitter._emit(type.getClassDef().getOutputClassName(), null);
		} else {
			var local = this._expr.getLocal();
			var localName = local.getName().getValue();
			if (local instanceof CaughtVariable) {
				localName = _CatchStatementEmitter.getLocalNameFor(this._emitter, localName);
			}
			this._emitter._emit(localName, this._expr.getToken());
		}
	}

});

var _UndefinedExpressionEmitter = exports._UndefinedExpressionEmitter = _ExpressionEmitter.extend({

	constructor: function (emitter, expr) {
		_ExpressionEmitter.prototype.constructor.call(this, emitter);
		this._expr = expr;
	},

	emit: function (outerOpPrecedence) {
		var token = this._expr.getToken();
		this._emitter._emit("undefined", token);
	}

});

var _NullExpressionEmitter = exports._NullExpressionEmitter = _ExpressionEmitter.extend({

	constructor: function (emitter, expr) {
		_ExpressionEmitter.prototype.constructor.call(this, emitter);
		this._expr = expr;
	},

	emit: function (outerOpPrecedence) {
		var token = this._expr.getToken();
		this._emitter._emit("null", token);
	}

});

var _BooleanLiteralExpressionEmitter = exports._BooleanLiteralExpressionEmitter = _ExpressionEmitter.extend({

	constructor: function (emitter, expr) {
		_ExpressionEmitter.prototype.constructor.call(this, emitter);
		this._expr = expr;
	},

	emit: function (outerOpPrecedence) {
		var token = this._expr.getToken();
		this._emitter._emit(token.getValue(), token);
	}

});

var _IntegerLiteralExpressionEmitter = exports._IntegerLiteralExpressionEmitter = _ExpressionEmitter.extend({

	constructor: function (emitter, expr) {
		_ExpressionEmitter.prototype.constructor.call(this, emitter);
		this._expr = expr;
	},

	emit: function (outerOpPrecedence) {
		var token = this._expr.getToken();
		this._emitter._emit("" + token.getValue(), token);
	}

});

var _NumberLiteralExpressionEmitter = exports._NumberLiteralExpressionEmitter = _ExpressionEmitter.extend({

	constructor: function (emitter, expr) {
		_ExpressionEmitter.prototype.constructor.call(this, emitter);
		this._expr = expr;
	},

	emit: function (outerOpPrecedence) {
		var token = this._expr.getToken();
		this._emitter._emit("" + token.getValue(), token);
	}

});

var _StringLiteralExpressionEmitter = exports._StringLiteralExpressionEmitter = _ExpressionEmitter.extend({

	constructor: function (emitter, expr) {
		_ExpressionEmitter.prototype.constructor.call(this, emitter);
		this._expr = expr;
	},

	emit: function (outerOpPrecedence) {
		var token = this._expr.getToken();
		// FIXME escape
		this._emitter._emit(token.getValue(), token);
	}

});

var _RegExpLiteralExpressionEmitter = exports._RegExpLiteralExpressionEmitter = _ExpressionEmitter.extend({

	constructor: function (emitter, expr) {
		_ExpressionEmitter.prototype.constructor.call(this, emitter);
		this._expr = expr;
	},

	emit: function (outerOpPrecedence) {
		var token = this._expr.getToken();
		this._emitter._emit(token.getValue(), token);
	}

});

var _ArrayLiteralExpressionEmitter = exports._ArrayLiteralExpressionEmitter = _ExpressionEmitter.extend({

	constructor: function (emitter, expr) {
		_ExpressionEmitter.prototype.constructor.call(this, emitter);
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

var _MapLiteralExpressionEmitter = exports._MapLiteralExpressionEmitter = _ExpressionEmitter.extend({

	constructor: function (emitter, expr) {
		_ExpressionEmitter.prototype.constructor.call(this, emitter);
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

	constructor: function (emitter, expr) {
		_ExpressionEmitter.prototype.constructor.call(this, emitter);
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

	constructor: function (emitter, expr) {
		_ExpressionEmitter.prototype.constructor.call(this, emitter);
		this._expr = expr;
	},

	emit: function (outerOpPrecedence) {
		var srcType = this._expr.getExpr().getType();
		var destType = this._expr.getType();
		if (srcType.resolveIfMayBeUndefined() instanceof ObjectType || srcType.equals(Type.variantType)) {
			if (srcType.resolveIfMayBeUndefined().isConvertibleTo(destType)) {
				if (srcType instanceof MayBeUndefinedType) {
					var prec = _BinaryExpressionEmitter._operatorPrecedence["||"];
					this._emitter._emitWithParens(outerOpPrecedence, prec, prec, null, "|| null");
				} else {
					this._emitter._getExpressionEmitterFor(this._expr.getExpr()).emit(outerOpPrecedence);
				}
				return true;
			}
			if (destType instanceof ObjectType) {
				// unsafe cast
				if ((destType.getClassDef().flags() & (ClassDefinition.IS_INTERFACE | ClassDefinition.IS_MIXIN)) == 0) {
					this.emitWithPrecedence(outerOpPrecedence, _CallExpressionEmitter._operatorPrecedence, (function () {
						this._emitter._emit("(function (o) { return o instanceof " + _Util.getInstanceofNameFromClassDef(destType.getClassDef()) + " ? o : null; })(", this._expr.getToken());
						this._emitter._getExpressionEmitterFor(this._expr.getExpr()).emit(0);
						this._emitter._emit(")", this._expr.getToken());
					}).bind(this));
				} else {
					this.emitWithPrecedence(outerOpPrecedence, _CallExpressionEmitter._operatorPrecedence, (function () {
						this._emitter._emit("(function (o) { return o && o.$__jsx_implements_" + destType.getClassDef().getOutputClassName() + " ? o : null; })(", this._expr.getToken());
						this._emitter._getExpressionEmitterFor(this._expr.getExpr()).emit(0);
						this._emitter._emit(")", this._expr.getToken());
					}).bind(this));
				}
				return true;
			}
			if (destType instanceof FunctionType) {
				// cast to function
				this._emitter._emit("(function (o) { return typeof(o) === \"function\" ? o : null; })(", this._expr.getToken());
				this._emitter._getExpressionEmitterFor(this._expr.getExpr()).emit(0);
				this._emitter._emit(")", this._expr.getToken());
				return true;
			}
		}
		if (srcType.equals(Type.nullType)) {
			// from null
			if (destType.equals(Type.booleanType)) {
				this._emitter._emit("false", this._expr.getToken());
				return true;
			}
			if (destType.equals(Type.integerType) || destType.equals(Type.numberType)) {
				this._emitter._emit("0", this._expr.getToken());
				return true;
			}
			if (destType.equals(Type.stringType)) {
				this._emitter._emit("\"null\"", this._expr.getToken());
				return true;
			}
			if (destType instanceof ObjectType || destType instanceof FunctionType) {
				this._emitter._emit("null", this._expr.getToken());
				return true;
			}
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
				var prec = _BinaryExpressionEmitter._operatorPrecedence["+"];
				this._emitWithParens(outerOpPrecedence, prec, prec, null, " + \"\"");
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
				var prec = _BinaryExpressionEmitter._operatorPrecedence["+"];
				this._emitWithParens(outerOpPrecedence, prec, prec, null, " + \"\"");
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
				this._emitWithParens(outerOpPrecedence, prec, prec, null, " + \"\"");
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
		// in contrast to _ExpressionEmitter#emitWithPrecedence the comparison op. is >=, since the conversion should have higher precedence than the outer op. (see t/run/110)
		if (opPrecedence >= outerOpPrecedence)
			this._emitter._emit("(", null);
		if (prefix != null)
			this._emitter._emit(prefix, this._expr.getToken());
		this._emitter._getExpressionEmitterFor(this._expr.getExpr()).emit(innerOpPrecedence);
		if (postfix != null)
			this._emitter._emit(postfix, this._expr.getToken());
		if (opPrecedence >= outerOpPrecedence)
			this._emitter._emit(")", null);
	}

});

var _AsNoConvertExpressionEmitter = exports._AsNoConvertExpressionEmitter = _ExpressionEmitter.extend({

	constructor: function (emitter, expr) {
		_ExpressionEmitter.prototype.constructor.call(this, emitter);
		this._expr = expr;
	},

	emit: function (outerOpPrecedence) {
		if (this._emitter._enableRunTimeTypeCheck) {
			var emitWithAssertion = function (emitCheckExpr, message) {
				var token = this._expr.getToken();
				this._emitter._emit("(function (v) {\n", token);
				this._emitter._advanceIndent();
				this._emitter._emitAssertion(emitCheckExpr, token, message);
				this._emitter._emit("return v;\n", token);
				this._emitter._reduceIndent();
				this._emitter._emit("}(", token);
				this._emitter._getExpressionEmitterFor(this._expr.getExpr()).emit(0);
				this._emitter._emit("))", token);
			}.bind(this);
			var srcType = this._expr.getExpr().getType();
			var destType = this._expr.getType();
			if (srcType.equals(destType) || srcType.equals(destType.resolveIfMayBeUndefined)) {
				// skip
			} else if (destType instanceof VariantType) {
				// skip
			} else if (srcType instanceof ObjectType && srcType.isConvertibleTo(destType)) {
				// skip
			} else if (destType.equals(Type.booleanType)) {
				emitWithAssertion(function () {
					this._emitter._emit("typeof v === \"boolean\"", this._expr.getToken());
				}.bind(this), "detected invalid cast, value is not a boolean");
				return;
			} else if (destType.equals(Type.integerType) || destType.equals(Type.numberType)) {
				emitWithAssertion(function () {
					this._emitter._emit("typeof v === \"number\"", this._expr.getToken());
				}.bind(this), "detected invalid cast, value is not a number");
				return;
			} else if (destType.equals(Type.stringType)) {
				emitWithAssertion(function () {
					this._emitter._emit("typeof v === \"string\"", this._expr.getToken());
				}.bind(this), "detected invalid cast, value is not a string");
				return;
			} else if (destType instanceof FunctionType) {
				emitWithAssertion(function () {
					this._emitter._emit("v === null || typeof v === \"function\"", this._expr.getToken());
				}.bind(this), "detected invalid cast, value is not a function or null");
				return;
			} else if (destType instanceof ObjectType) {
				var destClassDef = destType.getClassDef();
				if ((destClassDef.flags() & ClassDefinition.IS_FAKE) != 0) {
					// skip
				} else if (destClassDef instanceof InstantiatedClassDefinition && destClassDef.getTemplateClassName() == "Array") {
					emitWithAssertion(function () {
						this._emitter._emit("v === null || v instanceof Array", this._expr.getToken());
					}.bind(this), "detected invalid cast, value is not an Array or null");
					return;
				} else if (destClassDef instanceof InstantiatedClassDefinition && destClassDef.getTemplateClassName() == "Map") {
					emitWithAssertion(function () {
						this._emitter._emit("v === null || typeof v === \"object\"", this._expr.getToken());
					}.bind(this), "detected invalid cast, value is not a Map or null");
					return;
				} else {
					emitWithAssertion(function () {
						this._emitter._emit("v === null || v instanceof " + destClassDef.getOutputClassName(), this._expr.getToken());
					}.bind(this), "detected invalid cast, value is not an instance of the designated type or null");
					return;
				}
			}
		}
		this._emitter._getExpressionEmitterFor(this._expr.getExpr()).emit(outerOpPrecedence);
		return;
	}

});

var _OperatorExpressionEmitter = exports._OperatorExpressionEmitter = _ExpressionEmitter.extend({

	constructor: function (emitter) {
		_ExpressionEmitter.prototype.constructor.call(this, emitter);
	},

	emit: function (outerOpPrecedence) {
		this.emitWithPrecedence(outerOpPrecedence, this._getPrecedence(), this._emit.bind(this));
	},

	_emit: null, // void emit()

	_getPrecedence: null // int _getPrecedence()

});

var _UnaryExpressionEmitter = exports._UnaryExpressionEmitter = _OperatorExpressionEmitter.extend({

	constructor: function (emitter, expr) {
		_OperatorExpressionEmitter.prototype.constructor.call(this, emitter);
		this._expr = expr;
	},

	_emit: function () {
		var opToken = this._expr.getToken();
		this._emitter._emit(opToken.getValue() + " ", opToken);
		this._emitter._getExpressionEmitterFor(this._expr.getExpr()).emit(this._getPrecedence());
	},

	_getPrecedence: function () {
		return _UnaryExpressionEmitter._operatorPrecedence[this._expr.getToken().getValue()];
	},

	$_operatorPrecedence: {},

	$_setOperatorPrecedence: function (op, precedence) {
		_UnaryExpressionEmitter._operatorPrecedence[op] = precedence;
	}

});

var _PostfixExpressionEmitter = exports._PostfixExpressionEmitter = _UnaryExpressionEmitter.extend({

	constructor: function (emitter, expr) {
		_UnaryExpressionEmitter.prototype.constructor.call(this, emitter, expr);
	},

	_emit: function () {
		var opToken = this._expr.getToken();
		this._emitter._getExpressionEmitterFor(this._expr.getExpr()).emit(this._getPrecedence());
		this._emitter._emit(opToken.getValue(), opToken);
	},

	_getPrecedence: function () {
		return _PostfixExpressionEmitter._operatorPrecedence[this._expr.getToken().getValue()];
	},

	$_operatorPrecedence: {},

	$_setOperatorPrecedence: function (op, precedence) {
		_PostfixExpressionEmitter._operatorPrecedence[op] = precedence;
	}

});

var _InstanceofExpressionEmitter = exports._InstanceofExpressionEmitter = _ExpressionEmitter.extend({

	constructor: function (emitter, expr) {
		_ExpressionEmitter.prototype.constructor.call(this, emitter);
		this._expr = expr;
	},

	emit: function (outerOpPrecedence) {
		var expectedType = this._expr.getExpectedType();
		if ((expectedType.getClassDef().flags() & (ClassDefinition.IS_INTERFACE | ClassDefinition.IS_MIXIN)) == 0) {
			this.emitWithPrecedence(outerOpPrecedence, _InstanceofExpressionEmitter._operatorPrecedence, (function () {
				this._emitter._getExpressionEmitterFor(this._expr.getExpr()).emit(_InstanceofExpressionEmitter._operatorPrecedence);
				this._emitter._emit(" instanceof " + _Util.getInstanceofNameFromClassDef(expectedType.getClassDef()), null);
			}).bind(this));
		} else {
			this.emitWithPrecedence(outerOpPrecedence, _CallExpressionEmitter._operatorPrecedence, (function () {
				this._emitter._emit("(function (o) { return !! (o && o.$__jsx_implements_" + expectedType.getClassDef().getOutputClassName() + "); })(", this._expr.getToken());
				this._emitter._getExpressionEmitterFor(this._expr.getExpr()).emit(0);
				this._emitter._emit(")", this._expr.getToken());
			}).bind(this));
		}
	},

	$_operatorPrecedence: 0,

	$_setOperatorPrecedence: function (op, precedence) {
		_InstanceofExpressionEmitter._operatorPrecedence = precedence;
	}

});

var _PropertyExpressionEmitter = exports._PropertyExpressionEmitter = _UnaryExpressionEmitter.extend({

	constructor: function (emitter, expr) {
		_UnaryExpressionEmitter.prototype.constructor.call(this, emitter, expr);
	},

	_emit: function () {
		var expr = this._expr;
		var exprType = expr.getType();
		var identifierToken = this._expr.getIdentifierToken();
		// special handling for import ... as
		if (exprType instanceof ClassDefType) {
			this._emitter._emit(exprType.getClassDef().getOutputClassName(), identifierToken);
			return;
		}
		// replace methods to global function (e.g. Number.isNaN to isNaN)
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

	constructor: function (emitter, expr) {
		_UnaryExpressionEmitter.prototype.constructor.call(this, emitter, expr);
	},

	_emit: function () {
		var funcDef = this._expr.getFuncDef();
		this._emitter._emit("(function (", funcDef.getToken());
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
		this._emitter._emit("})", funcDef.getToken())
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

	constructor: function (emitter, expr) {
		_OperatorExpressionEmitter.prototype.constructor.call(this, emitter);
		this._expr = expr;
		this._precedence = _BinaryExpressionEmitter._operatorPrecedence[this._expr.getToken().getValue()];
	},

	_emit: function () {
		var opToken = this._expr.getToken();
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
			if (this._expr instanceof AssignmentExpression
				&& this._emitter._enableRunTimeTypeCheck
				&& ! (firstExprType instanceof MayBeUndefinedType || firstExprType.equals(Type.variantType))
				&& secondExprType instanceof MayBeUndefinedType) {
				this._emitter._emitExpressionWithUndefinedAssertion(secondExpr);
			} else {
				this._emitter._getExpressionEmitterFor(secondExpr).emit(this._precedence);
			}
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

	constructor: function (emitter, expr) {
		_OperatorExpressionEmitter.prototype.constructor.call(this, emitter);
		this._expr = expr;
	},

	_emit: function () {
		this._emitter._getExpressionEmitterFor(this._expr.getFirstExpr()).emit(_ArrayExpressionEmitter._operatorPrecedence);
		this._emitter._emit("[", this._expr.getToken());
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

	constructor: function (emitter, expr) {
		_OperatorExpressionEmitter.prototype.constructor.call(this, emitter);
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

	constructor: function (emitter, expr) {
		_OperatorExpressionEmitter.prototype.constructor.call(this, emitter);
		this._expr = expr;
	},

	_emit: function () {
		var calleeExpr = this._expr.getExpr();
		if (this._emitter._enableRunTimeTypeCheck && calleeExpr.getType() instanceof MayBeUndefinedType)
			this._emitter._emitExpressionWithUndefinedAssertion(calleeExpr);
		else
			this._emitter._getExpressionEmitterFor(calleeExpr).emit(_CallExpressionEmitter._operatorPrecedence);
		this._emitter._emitCallArguments(this._expr.getToken(), "(", this._expr.getArguments(), this._expr.getExpr().getType().resolveIfMayBeUndefined().getArgumentTypes());
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

	constructor: function (emitter, expr) {
		_OperatorExpressionEmitter.prototype.constructor.call(this, emitter);
		this._expr = expr;
	},

	_emit: function () {
		var funcType = this._expr.getFunctionType();
		var className = funcType.getObjectType().getClassDef().getOutputClassName();
		var argTypes = funcType.getArgumentTypes();
		var mangledFuncName = this._emitter._mangleFunctionName(this._expr.getName().getValue(), argTypes);
		this._emitter._emitCallArguments(this._expr.getToken(), className + ".prototype." + mangledFuncName + ".call(this", this._expr.getArguments(), argTypes);
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

	constructor: function (emitter, expr) {
		_OperatorExpressionEmitter.prototype.constructor.call(this, emitter);
		this._expr = expr;
	},

	emit: function (outerOpPrecedence) {
		var classDef = this._expr.getType().getClassDef();
		var ctor = this._expr.getConstructor();
		var argTypes = ctor != null ? ctor.getArgumentTypes() : [];
		this._emitter._emitCallArguments(
			this._expr.getToken(),
			"new " + this._emitter._mangleConstructorName(classDef, argTypes) + "(",
			this._expr.getArguments(),
			argTypes);
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

	constructor: function (emitter, expr) {
		_ExpressionEmitter.prototype.constructor.call(this, emitter);
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

	constructor: function (platform) {
		this._platform = platform;
		this._output = this._platform.load(platform.getRoot() + "/src/js/bootstrap.js") + "\n";
		this._outputFile = null;
		this._indent = 0;
		this._emittingClass = null;
		this._emittingFunction = null;
		this._emittingStatementStack = [];
		this._enableAssertion = true;
		this._enableLogging = true;
		this._enableRunTimeTypeCheck = true;
	},

	getSearchPaths: function () {
		return [ this._platform.getRoot() + "/lib/js" ];
	},

	setOutputFile: function (name) {
		this._outputFile = name;
		// FIXME: set correct sourceRoot
		var sourceRoot = null;
		this._sourceMapGen = new SourceMapGenerator(name, sourceRoot);
	},

	saveSourceMappingFile: function (platform) {
		var gen = this._sourceMapGen;
		if(gen != null) {
			platform.save(this._sourceMapGen.getSourceMappingFile(),
								this._sourceMapGen.generate());
		}
	},

	setSourceMapGenerator: function (gen) {
		this._sourceMapGen = gen;
	},

	setEnableAssertion: function (enable) {
		this._enableAssertion = enable;
	},

	setEnableLogging: function (enable) {
		this._enableLogging = enable;
	},

	setEnableRunTimeTypeCheck: function (enable) {
		this._enableRunTimeTypeCheck = enable;
	},

	emit: function (classDefs) {
		for (var i = 0; i < classDefs.length; ++i) {
			if ((classDefs[i].flags() & ClassDefinition.IS_NATIVE) == 0)
				this._emitClassDefinition(classDefs[i]);
		}
		for (var i = 0; i < classDefs.length; ++i)
			this._emitStaticInitializationCode(classDefs[i]);
		this._emitClassMap(classDefs);
	},

	_emitClassDefinition: function (classDef) {

		try {
			this._emittingClass = classDef;

			// emit class object
			this._emitClassObject(classDef);

			// emit constructors
			var ctors = this._findFunctions(classDef, "constructor", false);
			for (var i = 0; i < ctors.length; ++i)
				this._emitConstructor(ctors[i]);

			// emit functions
			var members = classDef.members();
			for (var i = 0; i < members.length; ++i) {
				var member = members[i];
				if (member instanceof MemberFunctionDefinition) {
					if (! (member.name() == "constructor" && (member.flags() & ClassDefinition.IS_STATIC) == 0) && member.getStatements() != null) {
						this._emitFunction(member);
					}
				}
			}

		}
		catch (e) {
			console.error(e);
		}
		finally {
			this._emittingClass = null;
		}

	},

	_emitStaticInitializationCode: function (classDef) {
		if ((classDef.flags() & ClassDefinition.IS_NATIVE) != 0)
			return;
		// special handling for js.jsx
		if (classDef.getToken().getFilename() == this._platform.getRoot() + "/lib/js/js.jsx") {
			this._emit("js.global = (function () { return this; })();\n\n", null);
			return;
		}
		// normal handling
		var members = classDef.members();
		// FIXME can we (should we?) automatically resolve dependencies? isn't it impossible?
		for (var i = 0; i < members.length; ++i) {
			var member = members[i];
			if ((member instanceof MemberVariableDefinition)
				&& (member.flags() & (ClassDefinition.IS_STATIC | ClassDefinition.IS_NATIVE)) == ClassDefinition.IS_STATIC)
				this._emitStaticMemberVariable(classDef.getOutputClassName(), member);
		}
	},

	_emitClassMap: function (classDefs) {
		classDefs = classDefs.concat([]); // shallow clone
		// remove the classDefs wo. source token or native
		for (var i = 0; i < classDefs.length;) {
			if (classDefs[i].getToken() == null || (classDefs[i].flags() & ClassDefinition.IS_NATIVE) != 0)
				classDefs.splice(i, 1);
			else
				++i;
		}
		// start emitting
		this._emit("var $__jsx_classMap = {\n", null);
		this._advanceIndent();
		while (classDefs.length != 0) {
			// fetch the first classDef, and others that came from the same file
			var list = [];
			var pushClass = (function (classDef) {
				var push = function (suffix) {
					list.push([ classDef.className() + suffix, classDef.getOutputClassName() + suffix ]);
				};
				var ctors = this._findFunctions(classDef, "constructor", false);
				push("");
				if (ctors.length == 0) {
					push(this._mangleFunctionArguments([]));
				} else {
					for (var i = 0; i < ctors.length; ++i)
						push(this._mangleFunctionArguments(ctors[i].getArgumentTypes()));
				}
			}).bind(this);
			var filename = classDefs[0].getToken().getFilename();
			pushClass(classDefs.shift());
			for (var i = 0; i < classDefs.length;) {
				if (classDefs[i].getToken().getFilename() == filename) {
					pushClass(classDefs[i]);
					classDefs.splice(i, 1);
				} else {
					++i;
				}
			}
			// emit the map
			this._emit("\"" + this._encodeFilename(filename) + "\": ", null); // FIXME escape
			this._emit("{\n", null);
			this._advanceIndent();
			for (var i = 0; i < list.length; ++i) {
				this._emit(list[i][0] + ": " + list[i][1], null);
				if (i != list.length - 1)
					this._emit(",", null);
				this._emit("\n", null);
			}
			this._reduceIndent();
			this._emit("}", null);
			if (classDefs.length != 0)
				this._emit(",", null);
			this._emit("\n", null);
		}
		this._reduceIndent();
		this._emit("};\n\n", null);
	},

	_encodeFilename: function (filename) {
		if (filename.indexOf(this._platform.getRoot() + "/") == 0)
			filename = "system:" + filename.substring(this._platform.getRoot().length + 1);
		return filename;
	},

	getOutput: function (sourceFile, entryPoint) {
		var output = entryPoint != null
			? this._platform.addLauncher(this, this._encodeFilename(sourceFile), this._output, entryPoint)
			: this._output;
		if (this._sourceMapGen)
			return output + this._sourceMapGen.magicToken();
		else
			return output;
	},

	_emitClassObject: function (classDef) {
		this._emit(
			"/**\n" +
			" * class " + classDef.getOutputClassName() +
			" extends " + classDef.extendClassDef().getOutputClassName() + "\n" +
			" * @constructor\n" +
			" */\n" +
			"function ", null);
		this._emit(classDef.getOutputClassName() + "() {\n" +
			"}\n" +
			"\n",
			classDef.getToken());
		this._emit(classDef.getOutputClassName() + ".prototype = new " + classDef.extendClassDef().getOutputClassName() + ";\n", null);
		if (classDef.implementClassDefs().length != 0) {
			var interfaceDefs = classDef.implementClassDefs();
			for (var i = 0; i < interfaceDefs.length; ++i)
				this._emit("$__jsx_merge_interface(" + classDef.getOutputClassName() + ", " + interfaceDefs[i].getOutputClassName() + ");\n", null);
			this._emit("\n", null);
		}
		if ((classDef.flags() & (ClassDefinition.IS_INTERFACE | ClassDefinition.IS_MIXIN)) != 0)
			this._emit(classDef.getOutputClassName() + ".prototype.$__jsx_implements_" + classDef.getOutputClassName() + " = true;\n\n", null);
	},

	_emitConstructor: function (funcDef) {
		var funcName = this._mangleConstructorName(funcDef.getClassDef(), funcDef.getArgumentTypes());

		// emit prologue
		this._emit("/**\n", null);
		this._emit(" * @constructor\n", null);
		this._emitFunctionArgumentAnnotations(funcDef);
		this._emit(" */\n", null);
		this._emit("function ", null);
		this._emit(funcName + "(", funcDef.getClassDef().getToken());
		this._emitFunctionArguments(funcDef);
		this._emit(") {\n", null);
		this._advanceIndent();

		// emit constructor calls and member initializers
		this._emittingFunction = funcDef;
		try {
			var statements = funcDef.getStatements();
			if (statements.length != 0 && statements[0] instanceof ConstructorInvocationStatement) {
				// slow path
				// emit member variable initialization code to default values
				funcDef.getClassDef().forEachMemberVariable(function (member) {
					if ((member.flags() & (ClassDefinition.IS_STATIC | ClassDefinition.IS_ABSTRACT)) == 0) {
						this._emit("this." + member.name() + " = ", member.getNameToken());
						this._emitDefaultValueOf(member.getType());
						this._emit(";\n", null);
					}
					return true;
				}.bind(this));
				// emit super class constructor invocation statements
				for (var i = 0; i < statements.length; ++i) {
					if (! (statements[i] instanceof ConstructorInvocationStatement))
						break;
					this._emitStatement(statements[i]);
				}
				// emit member variable initialzation code with initialization expressions
				funcDef.getClassDef().forEachMemberVariable(function (member) {
					var initialValue;
					if ((member.flags() & (ClassDefinition.IS_STATIC | ClassDefinition.IS_ABSTRACT)) == 0
						&& (initialValue = member.getInitialValue()) != null) {
						this._emit("this." + member.name() + " = ", member.getNameToken());
						this._getExpressionEmitterFor(initialValue).emit(_BinaryExpressionEmitter._operatorPrecedence["="]);
						this._emit(";\n", null);
					}
					return true;
				}.bind(this));
			} else {
				/*
					fast path (FIXME better optimization)

					The algorithm tries to find initialization statements of member properties so as to eliminate dead
					stores (of initial values), by looking for assignments to the properties, only for the first expression
					statements, and only until first use of "this" (other than assignment to the properties) appears.
				*/
				var initProperties = {};
				funcDef.getClassDef().forEachMemberVariable(function (member) {
					if ((member.flags() & (ClassDefinition.IS_STATIC | ClassDefinition.IS_ABSTRACT)) == 0)
						initProperties[member.name()] = true;
					return true;
				}.bind(this));
				for (var i = 0; i < statements.length; ++i) {
					if (! (statements[i] instanceof ExpressionStatement))
						break;
					var canContinue = statements[i].forEachCodeElement(function onElement(element) {
						var lhsExpr;
						if (element instanceof AssignmentExpression
							&& element.getToken().getValue() == "="
							&& (lhsExpr = element.getFirstExpr()) instanceof PropertyExpression
							&& lhsExpr.getExpr() instanceof ThisExpression) {
							initProperties[lhsExpr.getIdentifierToken().getValue()] = false;
							return true;
						} else if (element instanceof ThisExpression) {
							return false;
						}
						return element.forEachCodeElement(onElement.bind(this));
					}.bind(this));
					if (! canContinue)
						break;
				}
				// emit the initializers
				funcDef.getClassDef().forEachMemberVariable(function (member) {
					if ((member.flags() & (ClassDefinition.IS_STATIC | ClassDefinition.IS_ABSTRACT)) == 0) {
						if (initProperties[member.name()]) {
							this._emit("this." + member.name() + " = ", member.getNameToken());
							var initialValue = member.getInitialValue();
							if (initialValue != null) {
								this._getExpressionEmitterFor(initialValue).emit(_BinaryExpressionEmitter._operatorPrecedence["="]);
							} else {
								this._emitDefaultValueOf(member.getType());
							}
							this._emit(";\n", null);
						}
					}
					return true;
				}.bind(this));
			}
		} finally {
			this._emittingFunction = null;
		}

		// emit body
		this._emitFunctionBody(funcDef);
		// emit epilogue
		this._reduceIndent();
		this._emit("};\n\n", null);
		this._emit(funcName + ".prototype = new " + funcDef.getClassDef().getOutputClassName() + ";\n\n", null);
	},

	_emitFunction: function (funcDef) {
		this._emit("/**\n", null);
		this._emitFunctionArgumentAnnotations(funcDef);
		this._emit(_Util.buildAnnotation(" * @return {%1}\n", funcDef.getReturnType()), null);
		this._emit(" */\n", null);
		this._emit(funcDef.getClassDef().getOutputClassName() + ".", null);
		if ((funcDef.flags() & ClassDefinition.IS_STATIC) == 0)
			this._emit("prototype.", null);
		this._emit(this._mangleFunctionName(funcDef.name(), funcDef.getArgumentTypes()) + " = ", funcDef.getNameToken());
		this._emit("function (", funcDef.getToken());
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
			var name = args[i].getName();
			this._emit(name.getValue(), name);
		}
	},

	_emitFunctionBody: function (funcDef) {
		var prevEmittingFunction = this._emittingFunction;
		try {
			this._emittingFunction = funcDef;

			// emit reference to this for closures
			// if funDef is NOT in another closure
			if (funcDef.getClosures().length != 0 && (funcDef.flags() & ClassDefinition.IS_STATIC) == 0)
				this._emit("var $this = this;\n", null);
			// emit local variable declarations
			var locals = funcDef.getLocals();
			for (var i = 0; i < locals.length; ++i) {
				// FIXME unused variables should never be emitted by the compiler
				var type = locals[i].getType();
				if (type == null)
					continue;
				this._emit(_Util.buildAnnotation("/** @type {%1} */\n", type), null);
				var name = locals[i].getName();
				this._emit("var " + name.getValue() + ";\n", name);
			}
			// emit code
			var statements = funcDef.getStatements();
			for (var i = 0; i < statements.length; ++i)
				if (! (statements[i] instanceof ConstructorInvocationStatement))
					this._emitStatement(statements[i]);

		} finally {
			this._emittingFunction = prevEmittingFunction;
		}
	},

	_emitStaticMemberVariable: function (holder, variable) {
		var initialValue = variable.getInitialValue();
		if (initialValue != null
			&& ! (initialValue instanceof UndefinedExpression
				|| initialValue instanceof NullExpression
				|| initialValue instanceof BooleanLiteralExpression
				|| initialValue instanceof IntegerLiteralExpression
				|| initialValue instanceof NumberLiteralExpression
				|| initialValue instanceof StringLiteralExpression
				|| initialValue instanceof RegExpLiteralExpression)) {
			// use deferred initialization
			this._emit("$__jsx_lazy_init(" + holder + ", \"" + variable.name() + "\", function () {\n", variable.getNameToken());
			this._advanceIndent();
			this._emit("return ", variable.getNameToken());
			this._getExpressionEmitterFor(initialValue).emit(0);
			this._emit(";\n", variable.getNameToken());
			this._reduceIndent();
			this._emit("});\n", variable.getNameToken());
		} else {
			this._emit(holder + "." + variable.name() + " = ", variable.getNameToken());
			if (initialValue != null)
				this._getExpressionEmitterFor(initialValue).emit(_BinaryExpressionEmitter._operatorPrecedence["="]);
			else
				this._emitDefaultValueOf(variable.getType());
			this._emit(";\n", null);
		}
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
			this._emitStatement(statements[i]);
		this._reduceIndent();
	},

	_emitStatement: function (statement) {
		var emitter = this._getStatementEmitterFor(statement);
		this._emittingStatementStack.push(emitter);
		try {
			emitter.emit();
		} finally {
			this._emittingStatementStack.pop();
		}
	},

	_emit: function (str, token) {
		if (str == "")
			return;
		if (this._output.match(/\n$/))
			this._output += this._getIndent();
		// optional source map
		if(this._sourceMapGen != null && token != null) {
			var outputLines = this._output.split(/^/m);
			var genPos = {
				line: outputLines.length,
				column: outputLines[outputLines.length-1].length - 1,
			};
			// XXX: 'line' of original pos seems zero-origin (gfx suspects it's a bug of mozilla/source-map)
			var origPos = {
				line: token.getLineNumber() - 1,
				column: token.getColumnNumber()
			};
			var tokenValue = token.isIdentifier()
				? token.getValue()
				: null;
			this._sourceMapGen.add(genPos, origPos,
								   token.getFilename(), tokenValue);
		}
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
		else if (statement instanceof CatchStatement)
			return new _CatchStatementEmitter(this, statement);
		else if (statement instanceof ThrowStatement)
			return new _ThrowStatementEmitter(this, statement);
		else if (statement instanceof AssertStatement)
			return new _AssertStatementEmitter(this, statement);
		else if (statement instanceof LogStatement)
			return new _LogStatementEmitter(this, statement);
		else if (statement instanceof DebuggerStatement)
			return new _DebuggerStatementEmitter(this, statement);
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
		else if (expr instanceof MapLiteralExpression)
			return new _MapLiteralExpressionEmitter(this, expr);
		else if (expr instanceof ThisExpression)
			return new _ThisExpressionEmitter(this, expr);
		else if (expr instanceof BitwiseNotExpression)
			return new _UnaryExpressionEmitter(this, expr);
		else if (expr instanceof InstanceofExpression)
			return new _InstanceofExpressionEmitter(this, expr);
		else if (expr instanceof AsExpression)
			return new _AsExpressionEmitter(this, expr);
		else if (expr instanceof AsNoConvertExpression)
			return new _AsNoConvertExpressionEmitter(this, expr);
		else if (expr instanceof LogicalNotExpression)
			return new _UnaryExpressionEmitter(this, expr);
		else if (expr instanceof TypeofExpression)
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
		return classDef.getOutputClassName() + this._mangleFunctionArguments(argTypes);
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
				switch (classDef.getTemplateClassName()) {
				case "Array":
					return "A" + this._mangleTypeName(typeArgs[0]);
				case "Map":
					return "H" + this._mangleTypeName(typeArgs[0]);
				default:
					throw new Error("unexpected template type: " + classDef.getTemplateClassName());
				}
			}
			return "L" + type.getClassDef().getOutputClassName() + "$";
		} else if (type instanceof StaticFunctionType)
			return "F" + this._mangleFunctionArguments(type.getArgumentTypes()) + this._mangleTypeName(type.getReturnType()) + "$";
		else if (type instanceof MemberFunctionType)
			return "M" + this._mangleTypeName(type.getObjectType()) + this._mangleFunctionArguments(type.getArgumentTypes()) + this._mangleTypeName(type.getReturnType()) + "$";
		else if (type instanceof MayBeUndefinedType)
			return "U" + this._mangleTypeName(type.getBaseType());
		else if (type.equals(Type.variantType))
			return "X";
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

	_emitCallArguments: function (token, prefix, args, argTypes) {
		this._emit(prefix, token);
		for (var i = 0; i < args.length; ++i) {
			if (i != 0 || prefix[prefix.length - 1] != '(')
				this._emit(", ", null);
			if (this._enableRunTimeTypeCheck
				&& args[i].getType() instanceof MayBeUndefinedType
				&& ! (argTypes[i] instanceof MayBeUndefinedType || argTypes[i] instanceof VariantType)) {
				this._emitExpressionWithUndefinedAssertion(args[i]);
			} else {
				this._getExpressionEmitterFor(args[i]).emit(0);
			}
		}
		this._emit(")", token);
	},

	_emitAssertion: function (emitTestExpr, token, message) {
		this._emit("if (! (", token);
		emitTestExpr();
		this._emit(")) {\n", null);
		this._advanceIndent();
		this._emit("debugger;\n", null);
		// FIXME make the expression source and throw a fit exception class
		var err = Util.format('throw new Error("[%1:%2] %3");\n',
							  [token.getFilename(), token.getLineNumber(), message]);
		this._emit(err, null);
		this._reduceIndent();
		this._emit("}\n", null);
	},

	_emitExpressionWithUndefinedAssertion: function (expr) {
		var token = expr.getToken();
		this._emit("(function (v) {\n", token);
		this._advanceIndent();
		this._emitAssertion(function () {
			this._emit("typeof v !== \"undefined\"", token);
		}.bind(this), token, "detected misuse of 'undefined' as type '" + expr.getType().resolveIfMayBeUndefined().toString() + "'");
		this._emit("return v;\n", token);
		this._reduceIndent();
		this._emit("}(", token);
		this._getExpressionEmitterFor(expr).emit(0);
		this._emit("))", token);
	},

	$constructor: function () {
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
				opTypeList[j][1](opTypeList[j][0], -(precedence.length - i));
		}
	}

});
// vim: set noexpandtab:
