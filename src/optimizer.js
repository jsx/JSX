var Class = require("./Class");
eval(Class.$import("./classdef"));
eval(Class.$import("./expression"));
eval(Class.$import("./statement"));
eval(Class.$import("./type"));
eval(Class.$import("./util"));

"use strict";

var Optimizer = exports.Optimizer = Class.extend({

	constructor: function (compiler) {
		this._compiler = compiler;
	},

	performOptimization: null, // function performOptimization() : void

	$handleSubStatements: function (cb, statement) {
		if (statement instanceof ContinuableStatement) {
			cb(statement.getStatements());
		} else if (statement instanceof IfStatement) {
			cb(statement.getOnTrueStatements());
			cb(statement.getOnFalseStatements());
		} else if (statement instanceof SwitchStatement) {
			cb(statement.getStatements());
		} else if (statement instanceof TryStatement) {
			cb(statement.getTryStatements());
			cb(statement.getCatchStatements());
			cb(statement.getFinallyStatements());
		} else if (statement instanceof CatchStatement) {
			cb(statement.getStatements());
		}
	}

});

var InlineOptimizer = exports.InlineOptimizer = Optimizer.extend({

	$IDENTIFIER: "inline",

	constructor: function (compiler) {
		Optimizer.prototype.constructor.call(this, compiler);
	},

	performOptimization: function () {
		this._compiler.forEachClassDef(function (parser, classDef) {
			if ((classDef.flags() & ClassDefinition.IS_NATIVE) == 0) {
				classDef.forEachMemberFunction(function (funcDef) {
					this._optimizeFunction(funcDef);
					return true;
				}.bind(this));
			}
			return true;
		}.bind(this));
	},

	_getStash: function (funcDef) {
		var stash = funcDef.getOptimizerStash();
		if (stash[InlineOptimizer.IDENTIFIER] == null) {
			stash[InlineOptimizer.IDENTIFIER] = {
				isOptimized: false, // boolean
				isInlineable: undefined, // tri-state
			};
		}
		return stash[InlineOptimizer.IDENTIFIER];
	},

	_optimizeFunction: function (funcDef) {
		if (this._getStash(funcDef).isOptimized)
			return;
		this._getStash(funcDef).isOptimized = true;

		if ((funcDef.flags() & (ClassDefinition.IS_NATIVE | ClassDefinition.IS_ABSTRACT)) != 0)
			return;
		try {
			this._handleStatements(funcDef.getStatements());
		} catch (e) {
			console.error("fatal error occured while optimizing function " + funcDef.getClassDef().className() + "#" + funcDef.name());
			throw e;
		}
	},

	_handleStatements: function (statements) {
		for (var i = 0; i < statements.length; ++i) {
			var left = statements.length - i;
			this._handleStatement(statements, i);
			i = statements.length - left;
		}
	},

	_handleStatement: function (statements, stmtIndex) {
		var statement = statements[stmtIndex];
		if (statement instanceof ExpressionStatement) {
			var expr = statement.getExpr();
			if (expr instanceof CallExpression) {
				// inline if the entire statement is a single call expression
				var args = this._getArgumentsIfCallExpressionIsInlineable(expr);
				if (args != null) {
					statements.splice(stmtIndex, 1);
					stmtIndex = this._expandCallingFunction(statements, stmtIndex, expr.getCallingFuncDef(), args);
					if (expr.getCallingFuncDef().getStatements().length != 0
						&& statements[stmtIndex - 1] instanceof ReturnStatement)
						statements[stmtIndex - 1] = new ExpressionStatement(statements[stmtIndex - 1].getExpr());
				}
			} else if (expr instanceof AssignmentExpression
				&& this._lhsHasNoSideEffects(expr.getFirstExpr())
				&& expr.getSecondExpr() instanceof CallExpression) {
				// inline if the statement is an assignment of a single call expression into a local variable
				var args = this._getArgumentsIfCallExpressionIsInlineable(expr.getSecondExpr());
				if (args != null) {
					statements.splice(stmtIndex, 1);
					stmtIndex = this._expandCallingFunction(statements, stmtIndex, expr.getSecondExpr().getCallingFuncDef(), args);
					statements[stmtIndex - 1] = new ExpressionStatement(
						new AssignmentExpression(
							expr.getToken(),
							expr.getFirstExpr(),
							statements[stmtIndex - 1].getExpr()));
				}
			}
		} else {
			Optimizer.handleSubStatements(this._handleStatement.bind(this), statement);
		}
	},

	_lhsHasNoSideEffects: function (lhsExpr) {
		// FIXME may have side effects if is a native type (or extends a native type)
		if (lhsExpr instanceof IdentifierExpression)
			return true;
		if (lhsExpr instanceof PropertyExpression) {
			var holderExpr = lhsExpr.getExpr();
			if (holderExpr instanceof ThisExpression)
				return true;
			if (holderExpr instanceof IdentifierExpression)
				return true;
		}
		return false;
	},

	_getArgumentsIfCallExpressionIsInlineable: function (callExpr) {
		// determine the function that will be called
		var callingFuncDef = callExpr.getCallingFuncDef();
		if (callingFuncDef == null)
			return null;
		// optimize the calling function prior to testing the conditions
		this._optimizeFunction(callingFuncDef);
		// only allow static function or member function using "this" as the receiver (FIXME we can easily handle receiver being a local variable as well?)
		if ((callingFuncDef.flags() & ClassDefinition.IS_STATIC) != 0) {
			// ok
		} else {
			var calleeExpr = callExpr.getExpr();
			if (! (calleeExpr instanceof PropertyExpression))
				throw new Error("unexpected type of expression");
			if (! (calleeExpr.getExpr() instanceof ThisExpression))
				return null;
		}
		// check that the function may be inlined
		if (! this._canInlineFunction(callingFuncDef))
			return null;
		// and the args passed can be inlined (types should match exactly (or emitters may insert additional code))
		var args = callExpr.getArguments();
		for (var i = 0; i < args.length; ++i) {
			if (! (args[i] instanceof LeafExpression))
				return null;
			if (! args[i].getType().equals(callingFuncDef.getArgumentTypes()[i]))
				return null;
		}
		return args;
	},

	_canInlineFunction: function (funcDef) {
		if (typeof this._getStash(funcDef).isInlineable != "boolean") {
			this._getStash(funcDef).isInlineable = function () {
				// only inline function that are short, has no branches (last statement may be a return), has no local variables (excluding arguments)
				var statements = funcDef.getStatements();
				if (statements == null)
					return false;
				if (statements.length >= 5)
					return false;
				if (funcDef.getLocals().length != 0)
					return false;
				for (var i = 0; i < statements.length; ++i) {
					if (! (statements[i] instanceof ExpressionStatement))
						break;
				}
				if (! (i == statements.length || (i == statements.length - 1 && statements[i] instanceof ReturnStatement)))
					return false;
				// no function expression
				var hasFuncExpr = ! Util.forEachCodeElement(function onElement(element) {
					if (element instanceof FunctionExpression)
						return false;
					return element.forEachCodeElement(onElement.bind(this));
				}.bind(this), statements);
				if (hasFuncExpr) {
					return false;
				}
				return true;
			}.call(this);
		}
		return this._getStash(funcDef).isInlineable;
	},

	_expandCallingFunction: function (statements, stmtIndex, callingFuncDef, args) {
		// clone statements of the calling function, while rewriting the identifiers with actual arguments
		var callingStatements = callingFuncDef.getStatements();
		for (var i = 0; i < callingStatements.length; ++i) {
			// clone the statement
			var statement = new ExpressionStatement(callingStatements[i].getExpr().clone());
			// replace the arguments with actual arguments
			statement.forEachCodeElement(function onExpr(expr, replaceCb) {
				if (expr instanceof IdentifierExpression && expr.getLocal() != null) {
					for (var j = 0; j < args.length; ++j) {
						if (callingFuncDef.getArguments()[j].getName().getValue() == expr.getToken().getValue())
							break;
					}
					if (j == args.length)
						throw new Error("logic flaw, could not find formal parameter named " + expr.getToken().getValue());
					replaceCb(args[j].clone());
				}
				expr.forEachCodeElement(onExpr.bind(this));
				return true;
			}.bind(this));
			// insert the statement
			statements.splice(stmtIndex++, 0, statement);
		}
	}

});
