var Class = require("./Class");
eval(Class.$import("./classdef"));
eval(Class.$import("./parser"));
eval(Class.$import("./expression"));
eval(Class.$import("./statement"));
eval(Class.$import("./type"));
eval(Class.$import("./util"));

"use strict";

var Optimizer = exports.Optimizer = Class.extend({

	constructor: function () {
		this._compiler = null;
		this._commands = [];
		this._log = [];
		this._dumpLogs = false;
	},

	setup: function (cmds) {
		for (var i = 0; i < cmds.length; ++i) {
			var cmd = cmds[i];
			if (cmd == "no-assert") {
				this._commands.push(new _NoAssertCommand());
			} else if (cmd == "no-log") {
				this._commands.push(new _NoLogCommand());
			} else if (cmd == "inline") {
				this._commands.push(new _InlineOptimizeCommand());
			} else if (cmd == "return-if") {
				this._commands.push(new _ReturnIfOptimizeCommand());
			} else if (cmd == "dump-logs") {
				this._dumpLogs = true;
			} else {
				return "unknown optimization command: " + cmd;
			}
		}
		return null;
	},

	setCompiler: function (compiler) {
		this._compiler = compiler;
		return this;
	},

	getCompiler: function () {
		return this._compiler;
	},

	performOptimization: function () {
		for (var i = 0; i < this._commands.length; ++i) {
			try {
				this.log("starting optimizer: " + this._commands[i]._identifier);
				this._commands[i].setup(this).performOptimization();
				this.log("finished optimizer: " + this._commands[i]._identifier);
			} catch (e) {
				console.error("optimizer '" + this._identifier + "' died unexpectedly, dumping the logs");
				this.dumpLogs(this._log);
				throw e;
			}
		}
		if (this._dumpLogs)
			this.dumpLogs();
	},

	log: function (message) {
		this._log.push(message);
	},

	dumpLogs: function () {
		for (var i = 0; i < this._log.length; ++i) {
			console.error(this._log[i]);
		}
	}

});

var _OptimizeCommand = exports._OptimizeCommand = Class.extend({

	constructor: function (identifier) {
		this._identifier = identifier;
		this._optimizer = null;
	},

	setup: function (optimizer) {
		this._optimizer = optimizer;
		return this;
	},

	getCompiler: function () {
		return this._optimizer.getCompiler();
	},

	performOptimization: null, // function performOptimization() : void

	getStash: function (stashable) {
		var stash = stashable.getOptimizerStash();
		if (stashable[this._identifier] == null) {
			stashable[this._identifier] = this._createStash();
		}
		return stashable[this._identifier];
	},

	_createStash: function () {
		throw new Error("if you are going to use the stash, you need to override this function");
	},

	log: function (message) {
		this._optimizer.log("[" + this._identifier + "] " + message);
	},

	setupCommand: function (command) {
		command.setup(this._optimizer);
		return command;
	},

	$handleSubStatements: function (cb, statement) {
		var ret = false;
		if (statement instanceof ContinuableStatement) {
			if (cb(statement.getStatements()))
				ret = true;
		} else if (statement instanceof IfStatement) {
			if (cb(statement.getOnTrueStatements()))
				ret = true;
			if (cb(statement.getOnFalseStatements()))
				ret = true;
		} else if (statement instanceof SwitchStatement) {
			if (cb(statement.getStatements()))
				ret = true;
		} else if (statement instanceof TryStatement) {
			if (cb(statement.getTryStatements()))
				ret = true;
			if (cb(statement.getCatchStatements()))
				ret = true;
			if (cb(statement.getFinallyStatements()))
				ret = true;
		} else if (statement instanceof CatchStatement) {
			if (cb(statement.getStatements()))
				ret = true;
		}
		return ret;
	},

	$getFuncName : function (funcDef) {
		var classDef = funcDef.getClassDef();
		var s = (classDef != null ? classDef.className(): "<<unknown>>");
		s += (funcDef.flags() & ClassDefinition.IS_STATIC) != 0 ? "." : "#";
		s += funcDef.getNameToken() != null ? funcDef.name() : "<<unknown>>";
		s += "(";
		var argTypes = funcDef.getArgumentTypes();
		for (var i = 0; i < argTypes.length; ++i) {
			if (i != 0)
				s += ", ";
			s += ":" + argTypes[i].toString();
		}
		s += ")";
		return s;
	}

});

var _FunctionOptimizeCommand = exports._FunctionOptimizeCommand = _OptimizeCommand.extend({

	constructor: function (identifier) {
		_OptimizeCommand.prototype.constructor.call(this, identifier);
	},

	performOptimization: function () {
		this.getCompiler().forEachClassDef(function (parser, classDef) {
			if ((classDef.flags() & ClassDefinition.IS_NATIVE) == 0) {
				classDef.forEachMemberFunction(function (funcDef) {
					if ((funcDef.flags() & (ClassDefinition.IS_NATIVE | ClassDefinition.IS_ABSTRACT)) == 0) {
						this.log("starting optimization of " + _OptimizeCommand.getFuncName(funcDef));
						this.optimizeFunction(funcDef);
						this.log("finished optimization of " + _OptimizeCommand.getFuncName(funcDef));
					}
					return true;
				}.bind(this));
			}
			return true;
		}.bind(this));
	},

	optimizeFunction: null // function (:MemberFunctionDefinition) : void

});

var _NoAssertCommand = exports._NoAssertCommand = _FunctionOptimizeCommand.extend({

	constructor: function () {
		_FunctionOptimizeCommand.prototype.constructor.call(this, "no-assert");
	},

	optimizeFunction: function (funcDef) {
		this._optimizeStatements(funcDef.getStatements());
	},

	_optimizeStatements: function (statements) {
		for (var i = 0; i < statements.length;) {
			if (statements[i] instanceof AssertStatement) {
				statements.splice(i, 1);
			} else {
				_OptimizeCommand.handleSubStatements(this._optimizeStatements.bind(this), statements[i]);
				++i;
			}
		}
	}

});

var _NoLogCommand = exports._NoAssertCommand = _FunctionOptimizeCommand.extend({

	constructor: function () {
		_FunctionOptimizeCommand.prototype.constructor.call(this, "no-log");
	},

	optimizeFunction: function (funcDef) {
		this._optimizeStatements(funcDef.getStatements());
	},

	_optimizeStatements: function (statements) {
		for (var i = 0; i < statements.length;) {
			if (statements[i] instanceof LogStatement) {
				statements.splice(i, 1);
			} else {
				_OptimizeCommand.handleSubStatements(this._optimizeStatements.bind(this), statements[i]);
				++i;
			}
		}
	}

});

var _InlineOptimizeCommand = exports._InlineOptimizeCommand = _FunctionOptimizeCommand.extend({

	constructor: function () {
		_FunctionOptimizeCommand.prototype.constructor.call(this, "inline");
	},

	_createStash: function () {
		return {
			isOptimized: false, // boolean
			isInlineable: undefined, // tri-state
		};
	},

	optimizeFunction: function (funcDef) {
		// use flag, since functions might recurse
		if (this.getStash(funcDef).isOptimized)
			return;
		this.getStash(funcDef).isOptimized = true;

		// we need to the check here since functions might recurse
		if ((funcDef.flags() & (ClassDefinition.IS_NATIVE | ClassDefinition.IS_ABSTRACT)) != 0)
			return;
		this.log("* starting optimization of " + _OptimizeCommand.getFuncName(funcDef));
		var altered = false;
		while (true) {
			if (! this._handleStatements(funcDef.getStatements()))
				break;
			altered = true;
			if (! this.setupCommand(new _ReturnIfOptimizeCommand()).optimizeFunction(funcDef))
				break;
		}
		this.log("* finished optimization of " + _OptimizeCommand.getFuncName(funcDef));
	},

	_handleStatements: function (statements) {
		var altered = false;
		for (var i = 0; i < statements.length; ++i) {
			var left = statements.length - i;
			if (this._handleStatement(statements, i))
				altered = true;
			i = statements.length - left;
		}
		return altered;
	},

	_handleStatement: function (statements, stmtIndex) {
		var altered = false;
		var statement = statements[stmtIndex];
		if (statement instanceof ExpressionStatement || statement instanceof ReturnStatement) {
			var expr = statement.getExpr();
			if (expr instanceof CallExpression) {
				// inline if the entire statement is a single call expression
				var args = this._getArgumentsIfCallExpressionIsInlineable(expr);
				if (args != null) {
					statements.splice(stmtIndex, 1);
					stmtIndex = this._expandCallingFunction(statements, stmtIndex, expr.getCallingFuncDef(), args);
					if (statement instanceof ReturnStatement) {
						statements[stmtIndex - 1] = new ReturnStatement(statement.getToken(), statements[stmtIndex - 1].getExpr());
					}
					altered = true;
				}
			} else if (expr instanceof AssignmentExpression
				&& this._lhsHasNoSideEffects(expr.getFirstExpr())
				&& expr.getSecondExpr() instanceof CallExpression) {
				// inline if the statement is an assignment of a single call expression into a local variable
				var args = this._getArgumentsIfCallExpressionIsInlineable(expr.getSecondExpr());
				if (args != null) {
					statements.splice(stmtIndex, 1);
					stmtIndex = this._expandCallingFunction(statements, stmtIndex, expr.getSecondExpr().getCallingFuncDef(), args);
					var lastExpr = new AssignmentExpression(
						expr.getToken(),
						expr.getFirstExpr(),
						statements[stmtIndex - 1].getExpr());
					statements[stmtIndex - 1] = statement instanceof ExpressionStatement
						? new ExpressionStatement(lastExpr)
						: new ReturnStatement(lastExpr);
					altered = true;
				}
			}
		} else {
			altered = _OptimizeCommand.handleSubStatements(this._handleStatement.bind(this), statement);
		}
		return altered;
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
		this.optimizeFunction(callingFuncDef);
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
		if (typeof this.getStash(funcDef).isInlineable != "boolean") {
			this.getStash(funcDef).isInlineable = function () {
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
				var hasFuncExpr = ! Util.forEachStatement(function onStatement(statement) {
					var onExpr = function onExpr(expr) {
						if (expr instanceof FunctionExpression)
							return false;
						return expr.forEachExpression(onExpr.bind(this));
					};
					return statement.forEachExpression(onExpr.bind(this));
				}.bind(this), statements);
				if (hasFuncExpr) {
					return false;
				}
				return true;
			}.call(this);
			this.log(_OptimizeCommand.getFuncName(funcDef) + (this.getStash(funcDef).isInlineable ? " is" : " is not") + " inlineable");
		}
		return this.getStash(funcDef).isInlineable;
	},

	_expandCallingFunction: function (statements, stmtIndex, callingFuncDef, args) {
		// clone statements of the calling function, while rewriting the identifiers with actual arguments
		this.log("expanding " + _OptimizeCommand.getFuncName(callingFuncDef));
		var callingStatements = callingFuncDef.getStatements();
		for (var i = 0; i < callingStatements.length; ++i) {
			// clone the statement
			var statement = new ExpressionStatement(callingStatements[i].getExpr().clone());
			// replace the arguments with actual arguments
			statement.forEachExpression(function onExpr(expr, replaceCb) {
				if (expr instanceof IdentifierExpression && expr.getLocal() != null) {
					for (var j = 0; j < args.length; ++j) {
						if (callingFuncDef.getArguments()[j].getName().getValue() == expr.getToken().getValue())
							break;
					}
					if (j == args.length)
						throw new Error("logic flaw, could not find formal parameter named " + expr.getToken().getValue());
					replaceCb(args[j].clone());
				}
				return expr.forEachExpression(onExpr.bind(this));
			}.bind(this));
			// insert the statement
			statements.splice(stmtIndex++, 0, statement);
		}
		return stmtIndex;
	}

});

/*
	for the reasoning of this optimization see http://jsperf.com/if-vs-condexpr
*/
var _ReturnIfOptimizeCommand = exports._ReturnIfOptimizeCommand = _FunctionOptimizeCommand.extend({

	constructor: function () {
		_OptimizeCommand.prototype.constructor.call(this, "return-if");
	},

	optimizeFunction: function (funcDef) {
		if (funcDef.getReturnType().equals(Type.voidType))
			return;

		this._altered = false;
		this._optimizeStatements(funcDef.getStatements());
		this.log(_OptimizeCommand.getFuncName(funcDef) + " " + (this._altered ? "Y" : "N"));
		return this._altered;
	},

	_statementsCanBeReturnExpr: function (statements) {
		if (statements.length == 1 && statements[0] instanceof ReturnStatement)
			return true;
		this._optimizeStatements(statements);
		if (statements.length == 1 && statements[0] instanceof ReturnStatement)
			return true;
		return false;
	},

	_optimizeStatements: function (statements) {
		if (statements.length >= 1
			&& statements[statements.length - 1] instanceof IfStatement) {
			var ifStatement = statements[statements.length - 1];
			if (this._statementsCanBeReturnExpr(ifStatement.getOnTrueStatements())
				&& this._statementsCanBeReturnExpr(ifStatement.getOnFalseStatements())) {
				statements[statements.length - 1] = this._createReturnStatement(
					ifStatement.getToken(),
					ifStatement.getExpr(),
					ifStatement.getOnTrueStatements()[0].getExpr(),
					ifStatement.getOnFalseStatements()[0].getExpr());
				this._altered = true;
				this._optimizeStatements(statements);
			}
		} else if (statements.length >= 2
			&& statements[statements.length - 1] instanceof ReturnStatement
			&& statements[statements.length - 2] instanceof IfStatement) {
			var ifStatement = statements[statements.length - 2];
			if (ifStatement.getOnFalseStatements().length == 0
				&& this._statementsCanBeReturnExpr(ifStatement.getOnTrueStatements())) {
				statements.splice(
					statements.length - 2,
					2,
					this._createReturnStatement(
						ifStatement.getToken(),
						ifStatement.getExpr(),
						ifStatement.getOnTrueStatements()[0].getExpr(),
						statements[statements.length - 1].getExpr()));
				this._altered = true;
				this._optimizeStatements(statements);
			}
		}
	},

	_createReturnStatement: function (token, condExpr, trueExpr, falseExpr) {
		return new ReturnStatement(
			token,
			new ConditionalExpression(
				new Token("?", false),
				condExpr,
				trueExpr,
				falseExpr));
	}

});
