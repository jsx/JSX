var Class = require("./Class");
eval(Class.$import("./classdef"));
eval(Class.$import("./parser"));
eval(Class.$import("./expression"));
eval(Class.$import("./statement"));
eval(Class.$import("./type"));
eval(Class.$import("./util"));

"use strict";

var _Util = exports._Util = Class.extend({

	$numberOfStatements: function (statements) {
		var n = 0;
		Util.forEachStatement(function onStatement(statement) {
			++n;
			return statement.forEachStatement(onStatement.bind(this));
		});
		return n;
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
			} else if (cmd == "fold-const") {
				this._commands.push(new _FoldConstantCommand());
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
						this.log("starting optimization of " + _Util.getFuncName(funcDef));
						this.optimizeFunction(funcDef);
						this.log("finished optimization of " + _Util.getFuncName(funcDef));
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
				_Util.handleSubStatements(this._optimizeStatements.bind(this), statements[i]);
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
				_Util.handleSubStatements(this._optimizeStatements.bind(this), statements[i]);
				++i;
			}
		}
	}

});

// propagates constants
var _FoldConstantCommand = exports.__FoldConstantCommand = _FunctionOptimizeCommand.extend({

	constructor: function () {
		_FunctionOptimizeCommand.prototype.constructor.call(this, "fold-const");
	},

	_createStash: function () {
		return {
			isOptimized: false // boolean
		};
	},

	optimizeFunction: function (funcDef) {
		funcDef.forEachStatement(function onStatement(statement) {
			statement.forEachStatement(onStatement.bind(this));
			statement.forEachExpression(this._optimizeExpression.bind(this));
			return true;
		}.bind(this));
		funcDef.forEachClosure(function (funcDef) {
			this.optimizeFunction(funcDef);
			return true;
		}.bind(this));
	},

	_optimizeExpression: function (expr, replaceCb) {

		// optimize subexprs
		expr.forEachExpression(this._optimizeExpression.bind(this));

		// propagate const

		if (expr instanceof PropertyExpression) {

			// property expression
			var holderType = expr.getHolderType();
			if (holderType instanceof ClassDefType) {
				var member = null;
				holderType.getClassDef().forEachMemberVariable(function (m) {
					if (m instanceof MemberVariableDefinition && m.name() == expr.getIdentifierToken().getValue())
						member = m;
					return member == null;
				});
				if (member != null && (member.flags() & ClassDefinition.IS_CONST) != 0) {
					this._foldStaticConst(member);
					var foldedExpr = this._toFoldedExpr(member.getInitialValue(), member.getType());
					if (foldedExpr != null) {
						foldedExpr = this._toFoldedExpr(foldedExpr, expr.getType());
						if (foldedExpr != null) {
							replaceCb(foldedExpr);
						}
					}
				}
			}

		} else if (expr instanceof SignExpression) {

			// sign expression
			var calculateCb;
			switch (expr.getToken().getValue()) {
			case "+": calculateCb = function (x) { return +x; }; break;
			case "-": calculateCb = function (x) { return -x; }; break;
			default:
				return;
			}
			this.log("folding operator '" + expr.getToken().getValue() + "' at '" + expr.getToken().getFilename() + ":" + expr.getToken().getLineNumber());
			var baseExpr = expr.getExpr();
			if (baseExpr instanceof IntegerLiteralExpression) {
				replaceCb(new IntegerLiteralExpression(new Token(calculateCb(+baseExpr.getToken().getValue()), null)));
			} else if (baseExpr instanceof NumberLiteralExpression) {
				replaceCb(new NumberLiteralExpression(new Token(calculateCb(+baseExpr.getToken().getValue()), null)));
			}

		} else if (expr instanceof AdditiveExpression) {

			// additive expression
			var firstExpr = expr.getFirstExpr();
			var secondExpr = expr.getSecondExpr();
			if (this._isIntegerOrNumberLiteralExpression(firstExpr)) {
				// type of second expr is checked by the callee
				this._foldNumericBinaryExpression(expr, replaceCb);
			} else if (firstExpr instanceof StringLiteralExpression && secondExpr instanceof StringLiteralExpression) {
				replaceCb(
					new StringLiteralExpression(
						new Token(
							Util.encodeStringLiteral(
								Util.decodeStringLiteral(firstExpr.getToken().getValue()) +
								Util.decodeStringLiteral(secondExpr.getToken().getValue())),
							null)));
			}

		} else if (expr instanceof BinaryNumberExpression || expr instanceof ShiftExpression) {

			// binary number (or shift) expression
			this._foldNumericBinaryExpression(expr, replaceCb);

		} else if (expr instanceof AsExpression) {

			// convert "literal as string"
			if (expr.getType().equals(Type.stringType)) {
				var baseExpr = expr.getExpr();
				if (baseExpr instanceof BooleanLiteralExpression || baseExpr instanceof NumberLiteralExpression || baseExpr instanceof IntegerLiteralExpression) {
					replaceCb(
						new StringLiteralExpression(
							new Token(Util.encodeStringLiteral(baseExpr.getToken().getValue()), null)));
				}
			}

		}

		return true;
	},

	_foldNumericBinaryExpression: function (expr, replaceCb) {
		// handles BinaryNumberExpression _and_ AdditiveExpression of numbers or integers
		if (this._isIntegerOrNumberLiteralExpression(expr.getFirstExpr())
			&& this._isIntegerOrNumberLiteralExpression(expr.getSecondExpr())) {
			// ok
		} else {
			return;
		}

		switch (expr.getToken().getValue()) {

		// expressions that return number or integer depending on their types
		case "*": this._foldNumericBinaryExpressionAsNumeric(expr, replaceCb, function (x, y) { return x * y; }); break;
		case "+": this._foldNumericBinaryExpressionAsNumeric(expr, replaceCb, function (x, y) { return x + y; }); break;
		case "-": this._foldNumericBinaryExpressionAsNumeric(expr, replaceCb, function (x, y) { return x - y; }); break;

		// expressions that always return number
		case "/": this._foldNumericBinaryExpressionAsNumber(expr, replaceCb, function (x, y) { return x / y; }); break;
		case "%": this._foldNumericBinaryExpressionAsNumber(expr, replaceCb, function (x, y) { return x % y; }); break;

		// expressions that always return integer
		case ">>>": this._foldNumericBinaryExpressionAsInteger(expr, replaceCb, function (x, y) { return x >>> y; }); break;
		case ">>": this._foldNumericBinaryExpressionAsInteger(expr, replaceCb, function (x, y) { return x >> y; }); break;
		case "<<": this._foldNumericBinaryExpressionAsInteger(expr, replaceCb, function (x, y) { return x << y; }); break;
		case "&": this._foldNumericBinaryExpressionAsInteger(expr, replaceCb, function (x, y) { return x & y; }); break;
		case "|": this._foldNumericBinaryExpressionAsInteger(expr, replaceCb, function (x, y) { return x | y; }); break;
		case "^": this._foldNumericBinaryExpressionAsInteger(expr, replaceCb, function (x, y) { return x ^ y; }); break;

		}
	},

	_foldNumericBinaryExpressionAsNumeric: function (expr, replaceCb, calcCb) {
		if (expr.getFirstExpr() instanceof IntegerLiteralExpression && expr.getSecondExpr() instanceof IntegerLiteralExpression) {
			return this._foldNumericBinaryExpressionAsInteger(expr, replaceCb, calcCb);
		} else {
			return this._foldNumericBinaryExpressionAsNumber(expr, replaceCb, calcCb);
		}
	},

	_foldNumericBinaryExpressionAsInteger: function (expr, replaceCb, calcCb) {
		var value = calcCb(+expr.getFirstExpr().getToken().getValue(), +expr.getSecondExpr().getToken().getValue());
		this.log(
			"folding operator '" + expr.getToken().getValue() + "' at " + expr.getToken().getFilename() + ":" + expr.getToken().getLineNumber() +
			" to int: " + value);
		if (value % 1 != 0)
			throw new Error("value is not an integer");
		replaceCb(new IntegerLiteralExpression(new Token(value + "", null)));
	},

	_foldNumericBinaryExpressionAsNumber: function (expr, replaceCb, calcCb) {
		var value = calcCb(+expr.getFirstExpr().getToken().getValue(), +expr.getSecondExpr().getToken().getValue());
		this.log(
			"folding operator '" + expr.getToken().getValue() + "' at " + expr.getToken().getFilename() + ":" + expr.getToken().getLineNumber() +
			" to number: " + value);
		replaceCb(new NumberLiteralExpression(new Token(value + "", null)));
	},

	_isIntegerOrNumberLiteralExpression: function (expr) {
		return expr instanceof NumberLiteralExpression || expr instanceof IntegerLiteralExpression;
	},

	_foldStaticConst: function (member) {
		// optimize only once
		if (this.getStash(member).isOptimized)
			return;
		this.getStash(member).isOptimized = true;
		// optimize
		var initialValue = member.getInitialValue();
		if (initialValue != null)
			this._optimizeExpression(initialValue, function (expr) { member.setInitialValue(expr); });
	},

	_toFoldedExpr: function (expr, type) {
		if (expr instanceof UndefinedExpression) {
			return expr;
		} else if (expr instanceof NullExpression) {
			return expr;
		} else if (expr instanceof BooleanLiteralExpression) {
			return expr;
		} else if (expr instanceof IntegerLiteralExpression) {
			return expr;
		} else if (expr instanceof NumberLiteralExpression) {
			if (type.resolveIfMayBeUndefined().equals(Type.integerType)) {
				// cast to integer
				return new IntegerLiteralExpression(new Token((expr.getToken().getValue() | 0).toString(), null));
			}
			return expr;
		} else if (expr instanceof StringLiteralExpression) {
			return expr;
		}
		return null;
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
		this.log("* starting optimization of " + _Util.getFuncName(funcDef));
		var altered = false;
		while (true) {
			if (! this._handleStatements(funcDef.getStatements()))
				break;
			altered = true;
			if (! this.setupCommand(new _ReturnIfOptimizeCommand()).optimizeFunction(funcDef))
				break;
		}
		this.log("* finished optimization of " + _Util.getFuncName(funcDef));
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

		if (statement instanceof ConstructorInvocationStatement) {

			var callingFuncDef = statement.getCallingFuncDef();
			this.optimizeFunction(callingFuncDef);
			if (this._functionIsInlineable(callingFuncDef) && this._argsAreInlineable(callingFuncDef, statement.getArguments())) {
				statements.splice(stmtIndex, 1);
				this._expandCallingFunction(statements, stmtIndex, callingFuncDef, statement.getArguments().concat([ new ThisExpression(null) ]));
			}

		} else if (statement instanceof ExpressionStatement || statement instanceof ReturnStatement) {

			var expr = statement.getExpr();
			if (expr instanceof CallExpression) {
				// inline if the entire statement is a single call expression
				var args = this._getArgsAndThisIfCallExprIsInlineable(expr);
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
				var args = this._getArgsAndThisIfCallExprIsInlineable(expr.getSecondExpr());
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

			altered = _Util.handleSubStatements(this._handleStatements.bind(this), statement);

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

	_getArgsAndThisIfCallExprIsInlineable: function (callExpr) {
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
			var receiverExpr = calleeExpr.getExpr();
			if (receiverExpr instanceof IdentifierExpression
				|| receiverExpr instanceof ThisExpression) {
				// ok
			} else {
				return null;
			}
		}
		// check that the function may be inlined
		if (! this._functionIsInlineable(callingFuncDef))
			return null;
		// and the args passed can be inlined (types should match exactly (or emitters may insert additional code))
		if (! this._argsAreInlineable(callingFuncDef, callExpr.getArguments()))
			return null;
		// build list of arguments (and this)
		var argsAndThis = callExpr.getArguments().concat([]);
		if ((callingFuncDef.flags() & ClassDefinition.IS_STATIC) == 0)
			argsAndThis.push(receiverExpr);
		return argsAndThis;
	},

	_argsAreInlineable: function (callingFuncDef, actualArgs) {
		var formalArgs = callingFuncDef.getArgumentTypes();
		if (actualArgs.length != formalArgs.length)
			throw new "number of arguments mismatch";
		for (var i = 0; i < actualArgs.length; ++i) {
			if (! (actualArgs[i] instanceof LeafExpression))
				return false;
			if (! actualArgs[i].getType().equals(formalArgs[i]))
				return false;
		}
		return true;
	},

	_functionIsInlineable: function (funcDef) {
		if (typeof this.getStash(funcDef).isInlineable != "boolean") {
			this.getStash(funcDef).isInlineable = function () {
				// only inline function that are short, has no branches (last statement may be a return), has no local variables (excluding arguments)
				var statements = funcDef.getStatements();
				if (statements == null)
					return false;
				if (_Util.numberOfStatements(statements) >= 5)
					return false;
				if (funcDef.getLocals().length != 0)
					return false;
				for (var i = 0; i < statements.length; ++i) {
					if (! (statements[i] instanceof ExpressionStatement))
						break;
				}
				if (! (i == statements.length || (i == statements.length - 1 && statements[i] instanceof ReturnStatement)))
					return false;
				// no modification of arguments
				var modifiesArgs = ! Util.forEachStatement(function onStatement(statement) {
					var onExpr = function onExpr(expr) {
						if (expr instanceof AssignmentExpression && expr.getFirstExpr() instanceof IdentifierExpression)
							return false;
						return expr.forEachExpression(onExpr.bind(this));
					};
					return statement.forEachExpression(onExpr.bind(this));
				}, statements);
				if (modifiesArgs) {
					return false;
				}
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
			this.log(_Util.getFuncName(funcDef) + (this.getStash(funcDef).isInlineable ? " is" : " is not") + " inlineable");
		}
		return this.getStash(funcDef).isInlineable;
	},

	_expandCallingFunction: function (statements, stmtIndex, callingFuncDef, argsAndThis) {
		// clone statements of the calling function, while rewriting the identifiers with actual arguments
		this.log("expanding " + _Util.getFuncName(callingFuncDef));
		var callingStatements = callingFuncDef.getStatements();
		for (var i = 0; i < callingStatements.length; ++i) {
			// clone the statement
			var statement = new ExpressionStatement(callingStatements[i].getExpr().clone());
			// replace the arguments with actual arguments
			statement.forEachExpression(function onExpr(expr, replaceCb) {
				if (expr instanceof IdentifierExpression && expr.getLocal() != null) {
					var formalArgs = callingFuncDef.getArguments();
					for (var j = 0; j < formalArgs.length; ++j) {
						if (formalArgs[j].getName().getValue() == expr.getToken().getValue())
							break;
					}
					if (j == formalArgs.length)
						throw new Error("logic flaw, could not find formal parameter named " + expr.getToken().getValue());
					replaceCb(argsAndThis[j].clone());
				} else if (expr instanceof ThisExpression) {
					replaceCb(argsAndThis[argsAndThis.length - 1].clone());
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
		_FunctionOptimizeCommand.prototype.constructor.call(this, "return-if");
	},

	optimizeFunction: function (funcDef) {
		if (funcDef.getReturnType().equals(Type.voidType))
			return;

		this._altered = false;
		this._optimizeStatements(funcDef.getStatements());
		this.log(_Util.getFuncName(funcDef) + " " + (this._altered ? "Y" : "N"));
		return this._altered;
	},

	_statementsCanBeReturnExpr: function (statements) {
		if (statements.length == 1 && statements[0] instanceof ReturnStatement) {
			return true;
		}
		this._optimizeStatements(statements);
		if (statements.length == 1 && statements[0] instanceof ReturnStatement) {
			return true;
		}
		return false;
	},

	_optimizeStatements: function (statements) {
		if (statements.length >= 1
			&& statements[statements.length - 1] instanceof IfStatement) {
			// optimize: if (x) return y; else return z;
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
			if (this._statementsCanBeReturnExpr(ifStatement.getOnTrueStatements())) {
				// optimize: if (x) return y; return z;
				var onFalseStatements = ifStatement.getOnFalseStatements();
				if (onFalseStatements.length == 0) {
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
				} else if (onFalseStatements.length == 1
						&& onFalseStatements[0] instanceof IfStatement
						&& onFalseStatements[0].getOnFalseStatements().length == 0) {
					/*
						handles the case below, by moving the last return statement into the (unseen) else clause
							if (x) {
								return 0;
							} else if (y) {
								return 1;
							}
							return 2;
					*/
					onFalseStatements[0].getOnFalseStatements().push(statements[statements.length - 1]);
					statements.pop();
					this._altered = true;
					this._optimizeStatements(statements);
				}
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
