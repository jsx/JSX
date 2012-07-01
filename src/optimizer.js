/*
 * Copyright (c) 2012 DeNA Co., Ltd.
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to
 * deal in the Software without restriction, including without limitation the
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 * sell copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 * IN THE SOFTWARE.
 */

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
		this._enableRunTimeTypeCheck = true;
	},

	setup: function (cmds) {

		for (var i = 0; i < cmds.length; ++i) {
			var cmd = cmds[i];
			if (cmd == "lto") {
				this._commands.push(new _LinkTimeOptimizationCommand());
			} else if (cmd == "no-assert") {
				this._commands.push(new _NoAssertCommand());
			} else if (cmd == "no-log") {
				this._commands.push(new _NoLogCommand());
			} else if (cmd == "fold-const") {
				this._commands.push(new _FoldConstantCommand());
			} else if (cmd == "inline") {
				this._commands.push(new _DetermineCalleeCommand());
				this._commands.push(new _InlineOptimizeCommand());
			} else if (cmd == "return-if") {
				this._commands.push(new _ReturnIfOptimizeCommand());
			} else if (cmd == "array-length") {
				this._commands.push(new _ArrayLengthOptimizeCommand());
			} else if (cmd == "dump-logs") {
				this._dumpLogs = true;
			} else {
				return "unknown optimization command: " + cmd;
			}
		}

		// move lto to top
		for (var i = 0; i < this._commands.length; ++i)
			if (this._commands[i] instanceof _LinkTimeOptimizationCommand)
				break;
		if (i != this._commands.length)
			this._commands.unshift(this._commands.splice(i, 1)[0]);

		return null;
	},

	enableRuntimeTypeCheck: function () {
		return this._enableRunTimeTypeCheck;
	},

	setEnableRunTimeTypeCheck: function (mode) {
		this._enableRunTimeTypeCheck = mode;
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
		if (stash[this._identifier] == null) {
			stash[this._identifier] = this._createStash();
		}
		return stash[this._identifier];
	},

	_createStash: function () {
		throw new Error("if you are going to use the stash, you need to override this function");
	},

	createVar: function (funcDef, type, baseName) {
		var locals = funcDef.getLocals();
		var nameExists = function (n) {
			for (var i = 0; i < locals.length; ++i)
				if (locals[i].getName().getValue() == n)
					return true;
			return false;
		}
		for (var i = 0; nameExists(baseName + "$" + i); ++i)
			;
		var newLocal = new LocalVariable(new Token(baseName + "$" + i, true), type);
		locals.push(newLocal);
		this.log("rewriting " + baseName + " to " + newLocal.getName().getValue());
		return newLocal;
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
		var doit = function (funcDef) {
			this.log("starting optimization of " + _Util.getFuncName(funcDef));
			this.optimizeFunction(funcDef);
			this.log("finished optimization of " + _Util.getFuncName(funcDef));
		}.bind(this);
		this.getCompiler().forEachClassDef(function (parser, classDef) {
			classDef.forEachMemberFunction(function (funcDef) {
				if (funcDef.getStatements() != null) {
					doit(funcDef);
				}
				funcDef.forEachClosure(function (funcDef) {
					doit(funcDef);
					return true;
				});
				return true;
			}.bind(this));
			return true;
		}.bind(this));
	},

	optimizeFunction: null // function (:MemberFunctionDefinition) : void

});

var _LinkTimeOptimizationCommandStash = exports._LinkTimeOptimizationCommandStash = Class.extend({

	constructor: function () {
		this.extendedBy = [];
	},

	clone: function () {
		throw new Error("not supported");
	}

});

var _LinkTimeOptimizationCommand = exports._LinkTimeOptimizationCommand = _OptimizeCommand.extend({

	$IDENTIFIER: "lto",

	constructor: function () {
		_OptimizeCommand.prototype.constructor.call(this, _LinkTimeOptimizationCommand.IDENTIFIER);
	},

	_createStash: function () {
		return new _LinkTimeOptimizationCommandStash();
	},

	performOptimization: function () {
		// set extendedBy for every class
		this.getCompiler().forEachClassDef(function (parser, classDef) {
			if (classDef.extendType() != null)
				this.getStash(classDef.extendType().getClassDef()).extendedBy.push(classDef);
			for (var i = 0; i < classDef.implementTypes().length; ++i)
				this.getStash(classDef.implementTypes()[i].getClassDef()).extendedBy.push(classDef);
			return true;
		}.bind(this));
		// mark classes / functions that are not derived / overridden as final
		this.getCompiler().forEachClassDef(function (parser, classDef) {

			if ((classDef.flags() & (ClassDefinition.IS_INTERFACE | ClassDefinition.IS_MIXIN | ClassDefinition.IS_NATIVE | ClassDefinition.IS_FINAL)) == 0
				&& this.getStash(classDef).extendedBy.length == 0) {

				// found a class that is not extended, mark it and its functions as final
				this.log("marking class as final: " + classDef.className());
				classDef.setFlags(classDef.flags() | ClassDefinition.IS_FINAL);
				classDef.forEachMemberFunction(function (funcDef) {
					if ((funcDef.flags() & (ClassDefinition.IS_STATIC | ClassDefinition.IS_FINAL)) == 0)
						funcDef.setFlags(funcDef.flags() | ClassDefinition.IS_FINAL);
					return true;
				}.bind(this));

			} else if ((classDef.flags() & (ClassDefinition.IS_NATIVE | ClassDefinition.IS_FINAL)) == 0) {

				// adjust flags of functions
				classDef.forEachMemberFunction(function (funcDef) {
					if ((funcDef.flags() & (ClassDefinition.IS_STATIC | ClassDefinition.IS_NATIVE | ClassDefinition.IS_FINAL)) != 0) {
						// ignore static, native, or final functions
					} else if ((funcDef.flags() & ClassDefinition.IS_ABSTRACT) == 0) {
						// mark functions that are not being overridden as final
						if (funcDef.getStatements() == null)
							throw new Error("a non-native, non-abstract function with out function body?");
						var overrides = this._getOverrides(classDef, this.getStash(classDef).extendedBy, funcDef.name(), funcDef.getArgumentTypes());
						if (overrides.length == 0) {
							this.log("marking function as final: " + classDef.className() + "#" + funcDef.name());
							funcDef.setFlags(funcDef.flags() | ClassDefinition.IS_FINAL);
						} else {
							this.log("function has overrides, not marking as final: " + classDef.className() + "#" + funcDef.name());
						}
					} else if ((funcDef.flags() & ClassDefinition.IS_ABSTRACT) != 0) {
						/*
							FIXME determine if there is only one implementation, and if so, inline the calls to the function.
							Note that  the implementation of the function may exist in the base classes of one of the classes that
							implement the interface, or in the mixins that are implemented by the extending class.
						*/
					}
					return true;
				}.bind(this));
			}

			return true;

		}.bind(this));
	},

	_getOverrides: function (srcClassDef, classDefs, name, argTypes) {
		var overrides = [];
		for (var i = 0; i < classDefs.length; ++i)
			overrides = overrides.concat(this._getOverridesByClass(srcClassDef, classDefs[i], name, argTypes));
		return overrides;
	},

	_getOverridesByClass: function (srcClassDef, classDef, name, argTypes) {
		var overrides = this._getOverrides(srcClassDef, this.getStash(classDef).extendedBy, name, argTypes);
		var addOverride = function (funcDef) {
			if (funcDef.name() == name
				&& (funcDef.flags() & ClassDefinition.IS_ABSTRACT) == 0
				&& Util.typesAreEqual(funcDef.getArgumentTypes(), argTypes)) {
				overrides.push(funcDef);
				return false; // finish looking into the class
			}
			return true;
		}.bind(this);
		classDef.forEachMemberFunction(addOverride);
		var implementClassDefs = classDef.implementTypes().map(function (type) { return type.getClassDef(); });
		for (var i = 0; i < implementClassDefs.length; ++i) {
			if (srcClassDef != implementClassDefs[i]) {
				implementClassDefs[i].forEachClassToBase(function (classDef) {
					return classDef.forEachMemberFunction(addOverride);
				});
			}
		}
		return overrides;
	}

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

var _DetermineCalleeCommandStash = exports._DetermineCalleeCommandStash = Class.extend({

	constructor: function (that /* optional */) {
		this.callingFuncDef = that ? that.callingFuncDef : null;
	},

	clone: function () {
		return new _DetermineCalleeCommandStash(this);
	}

});

var _DetermineCalleeCommand = exports._DetermineCalleeCommand = _FunctionOptimizeCommand.extend({

	$IDENTIFIER: "determine-callee",

	constructor: function () {
		_FunctionOptimizeCommand.prototype.constructor.call(this, _DetermineCalleeCommand.IDENTIFIER);
	},

	_createStash: function () {
		return new _DetermineCalleeCommandStash();
	},

	optimizeFunction: function (funcDef) {
		funcDef.forEachStatement(function onStatement(statement) {

			if (statement instanceof ConstructorInvocationStatement) {
				// invocation of super-class ctor
				var callingFuncDef = _DetermineCalleeCommand.findCallingFunctionInClass(
					statement.getConstructingClassDef(),
					"constructor",
					statement.getConstructorType().getArgumentTypes(),
					false);
				if (callingFuncDef == null)
					throw new Error("could not determine the associated parent ctor");
				this._setCallingFuncDef(statement, callingFuncDef);
			}

			statement.forEachExpression(function onExpr(expr) {
				if (expr instanceof CallExpression) {
					// call expression
					var calleeExpr = expr.getExpr();
					if (calleeExpr instanceof PropertyExpression && ! calleeExpr.getType().isAssignable()) {
						// is referring to function (not a value of function type)
						var holderType = calleeExpr.getHolderType();
						var callingFuncDef = _DetermineCalleeCommand.findCallingFunction(
								holderType.getClassDef(),
								calleeExpr.getIdentifierToken().getValue(),
								calleeExpr.getType().getArgumentTypes(),
								calleeExpr.getExpr() instanceof ClassExpression);
						this._setCallingFuncDef(expr, callingFuncDef);
					} else if (calleeExpr instanceof FunctionExpression) {
						this._setCallingFuncDef(expr, calleeExpr.getFuncDef());
					} else {
						this._setCallingFuncDef(expr, null);
					}
				} else if (expr instanceof NewExpression) {
					/*
						For now we do not do anything here, since all objects should be created by the JS new operator,
						or will fail in operations like obj.func().
					*/
				}
				return expr.forEachExpression(onExpr.bind(this));
			}.bind(this));

			return statement.forEachStatement(onStatement.bind(this));
		}.bind(this));
	},

	_setCallingFuncDef: function (stashable, funcDef) {
		this.getStash(stashable).callingFuncDef = funcDef;
	},

	$findCallingFunctionInClass: function (classDef, funcName, argTypes, isStatic) {
		var found = null;
		classDef.forEachMemberFunction(function (funcDef) {
			if (isStatic == ((funcDef.flags() & ClassDefinition.IS_STATIC) != 0)
				&& funcDef.name() == funcName
				&& Util.typesAreEqual(funcDef.getArgumentTypes(), argTypes)) {
				found = funcDef;
				return false;
			}
			return true;
		});
		// only return if the found function is final
		if (found != null) {
			if ((found.flags() & (ClassDefinition.IS_STATIC | ClassDefinition.IS_FINAL)) == 0)
				found = null;
		}
		return found;
	},

	$findCallingFunction: function (classDef, funcName, argTypes, isStatic) {
		var found = null;
		// find the first declaration
		classDef.forEachClassToBase(function (classDef) {
			if ((found = _DetermineCalleeCommand.findCallingFunctionInClass(classDef, funcName, argTypes, isStatic)) != null)
				return false;
			return true;
		});
		return found;
	},

	$getCallingFuncDef: function (stashable) {
		var stash = stashable.getOptimizerStash()[_DetermineCalleeCommand.IDENTIFIER];
		if (stash === undefined)
			throw new Error("callee not searched");
		return stash.callingFuncDef;
	}

});

// propagates constants

var _FoldConstantCommandStash = exports._FoldConstantCommandStash = Class.extend({

	constructor: function (that /* optional */) {
		this.isOptimized = that ? that.isOptimized : false; // boolean
	},

	clone: function () {
		return new _FoldConstantCommandStash(this);
	}

});

var _FoldConstantCommand = exports._FoldConstantCommand = _FunctionOptimizeCommand.extend({

	constructor: function () {
		_FunctionOptimizeCommand.prototype.constructor.call(this, "fold-const");
	},

	_createStash: function () {
		return new _FoldConstantCommandStash();
	},

	optimizeFunction: function (funcDef) {
		funcDef.forEachStatement(function onStatement(statement) {
			statement.forEachStatement(onStatement.bind(this));
			statement.forEachExpression(this._optimizeExpression.bind(this));
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
			if (expr.getExpr() instanceof ClassExpression) {
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

		} else if (expr instanceof EqualityExpression) {

			this._foldEqualityExpression(expr, replaceCb);

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

	_foldEqualityExpression: function (expr, replaceCb) {
		var firstExpr = expr.getFirstExpr();
		var secondExpr = expr.getSecondExpr();
		var isEqual = undefined; // tri-state
		if (firstExpr instanceof StringLiteralExpression && secondExpr instanceof StringLiteralExpression) {
			isEqual = Util.decodeStringLiteral(firstExpr.getToken().getValue()) == Util.decodeStringLiteral(secondExpr.getToken().getValue());
		} else if (this._isIntegerOrNumberLiteralExpression(firstExpr) && this._isIntegerOrNumberLiteralExpression(secondExpr)) {
			isEqual = +firstExpr.getToken().getValue() == +secondExpr.getToken().getValue();
		}
		if (isEqual !== undefined) {
			var result = expr.getToken().getValue() == "==" ? isEqual : ! isEqual;
			replaceCb(new BooleanLiteralExpression(new Token(result ? "true" : "false", false)));
		}
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
		case "%": this._foldNumericBinaryExpressionAsNumeric(expr, replaceCb, function (x, y) { return x % y; }); break;

		// expressions that always return number
		case "/": this._foldNumericBinaryExpressionAsNumber(expr, replaceCb, function (x, y) { return x / y; }); break;

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
		if (expr instanceof NullExpression) {
			return expr;
		} else if (expr instanceof BooleanLiteralExpression) {
			return expr;
		} else if (expr instanceof IntegerLiteralExpression) {
			return expr;
		} else if (expr instanceof NumberLiteralExpression) {
			if (type.resolveIfNullable().equals(Type.integerType)) {
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

var _InlineOptimizeCommandStash = exports._InlineOptimizeCommandStash = Class.extend({

	constructor: function (that /* optional */) {
		this.isOptimized = that ? that.isOptimized : false; // boolean
		this.isInlineable = that ? that.isInlineable : null; // tri-state (null, false, true)
	},

	clone: function () {
		return new _InlineOptimizeCommandStash(this);
	}

});

var _InlineOptimizeCommand = exports._InlineOptimizeCommand = _FunctionOptimizeCommand.extend({

	constructor: function () {
		_FunctionOptimizeCommand.prototype.constructor.call(this, "inline");
	},

	_createStash: function () {
		return new _InlineOptimizeCommandStash();
	},

	optimizeFunction: function (funcDef) {
		// use flag, since functions might recurse
		if (this.getStash(funcDef).isOptimized)
			return;
		this.getStash(funcDef).isOptimized = true;

		// we need to the check here since functions might recurse
		if (funcDef.getStatements() == null)
			return;
		this.log("* starting optimization of " + _Util.getFuncName(funcDef));
		while (true) {
			while (true) {
				if (! this._handleStatements(funcDef, funcDef.getStatements()))
					break;
				this.setupCommand(new _DetermineCalleeCommand()).optimizeFunction(funcDef);
			}
			if (! this.setupCommand(new _ReturnIfOptimizeCommand()).optimizeFunction(funcDef))
				break;
		}
		this.log("* finished optimization of " + _Util.getFuncName(funcDef));
	},

	_handleStatements: function (funcDef, statements) {
		var altered = false;
		for (var i = 0; i < statements.length; ++i) {
			var left = statements.length - i;
			if (this._handleStatement(funcDef, statements, i))
				altered = true;
			i = statements.length - left;
		}
		return altered;
	},

	_handleStatement: function (funcDef, statements, stmtIndex) {
		var altered = false;
		var statement = statements[stmtIndex];

		// expand single-statement functions that return a value
		statement.forEachExpression(function onExpr(expr, replaceCb) {
			expr.forEachExpression(onExpr.bind(this));
			if (expr instanceof CallExpression) {
				var args = this._getArgsAndThisIfCallExprIsInlineable(expr, true);
				if (args != null) {
					var callingFuncDef = _DetermineCalleeCommand.getCallingFuncDef(expr);
					this.log("expanding " + _Util.getFuncName(callingFuncDef) + " as expression");
					var clonedExpr = callingFuncDef.getStatements()[0].getExpr().clone();
					this._rewriteExpression(
						clonedExpr,
						function (expr) { clonedExpr = expr; },
						args,
						callingFuncDef);
					replaceCb(clonedExpr);
				}
			}
			return true;
		}.bind(this));

		// expand more complicated functions
		if (statement instanceof ConstructorInvocationStatement) {

			var callingFuncDef = _DetermineCalleeCommand.getCallingFuncDef(statement);
			this.optimizeFunction(callingFuncDef);
			if (this._functionIsInlineable(callingFuncDef) && this._argsAreInlineable(callingFuncDef, statement.getArguments(), false)) {
				statements.splice(stmtIndex, 1);
				this._expandCallingFunction(funcDef, statements, stmtIndex, callingFuncDef, statement.getArguments().concat([ new ThisExpression(null, funcDef.getClassDef()) ]));
			}

		} else if (statement instanceof ExpressionStatement) {

			if (this._expandStatementExpression(funcDef, statements, stmtIndex, statement.getExpr(), function (stmtIndex) {
				statements.splice(stmtIndex, 1);
			}.bind(this))) {
				altered = true;
			}

		} else if (statement instanceof ReturnStatement) {

			if (this._expandStatementExpression(funcDef, statements, stmtIndex, statement.getExpr(), function (stmtIndex) {
				statements.splice(stmtIndex, 1);
				statements[stmtIndex - 1] = new ReturnStatement(statement.getToken(), statements[stmtIndex - 1].getExpr());
			}.bind(this))) {
				altered = true;
			}

		} else if (statement instanceof IfStatement) {

			if (this._expandStatementExpression(funcDef, statements, stmtIndex, statement.getExpr(), function (stmtIndex) {
				statement.setExpr(statements[stmtIndex - 1].getExpr());
				statements.splice(stmtIndex - 1, 1);
			}.bind(this))) {
				altered = true;
			}
			if (this._handleSubStatements(funcDef, statement)) {
				altered = true;
			}

		} else {

			if (this._handleSubStatements(funcDef, statement)) {
				altered = true;
			}

		}

		return altered;
	},

	_handleSubStatements: function (funcDef, statement) {
		return _Util.handleSubStatements(function (statements) {
			return this._handleStatements(funcDef, statements);
		}.bind(this), statement);
	},

	// expands an expression at given location, if possible
	_expandStatementExpression: function (funcDef, statements, stmtIndex, expr, cb) {

		if (expr instanceof CallExpression) {

			// inline if the entire statement is a single call expression
			var args = this._getArgsAndThisIfCallExprIsInlineable(expr, false);
			if (args != null) {
				stmtIndex = this._expandCallingFunction(funcDef, statements, stmtIndex, _DetermineCalleeCommand.getCallingFuncDef(expr), args);
				cb(stmtIndex);
				return true;
			}

		} else if (expr instanceof AssignmentExpression
			&& this._lhsHasNoSideEffects(expr.getFirstExpr())
			&& expr.getSecondExpr() instanceof CallExpression) {

			// inline if the statement is an assignment of a single call expression into a local variable
			var args = this._getArgsAndThisIfCallExprIsInlineable(expr.getSecondExpr(), false);
			if (args != null) {
				stmtIndex = this._expandCallingFunction(funcDef, statements, stmtIndex, _DetermineCalleeCommand.getCallingFuncDef(expr.getSecondExpr()), args);
				var lastExpr = new AssignmentExpression(
					expr.getToken(),
					expr.getFirstExpr(),
					statements[stmtIndex - 1].getExpr());
				statements[stmtIndex - 1] = new ExpressionStatement(lastExpr);
				cb(stmtIndex);
				return true;
			}

		}

		return false;
	},

	_lhsHasNoSideEffects: function (lhsExpr) {
		// FIXME may have side effects if is a native type (or extends a native type)
		if (lhsExpr instanceof LocalExpression)
			return true;
		if (lhsExpr instanceof PropertyExpression) {
			var holderExpr = lhsExpr.getExpr();
			if (holderExpr instanceof ThisExpression)
				return true;
			if (holderExpr instanceof LocalExpression || holderExpr instanceof ClassExpression)
				return true;
		} else if (lhsExpr instanceof ArrayExpression) {
			if (lhsExpr.getFirstExpr() instanceof LocalExpression
				&& (lhsExpr.getSecondExpr() instanceof NumberLiteralExpression
					|| lhsExpr.getSecondExpr() instanceof StringLiteralExpression
					|| lhsExpr.getSecondExpr() instanceof LocalExpression))
				return true;
		}
		return false;
	},

	_getArgsAndThisIfCallExprIsInlineable: function (callExpr, asExpression) {
		// determine the function that will be called
		var callingFuncDef = _DetermineCalleeCommand.getCallingFuncDef(callExpr);
		if (callingFuncDef == null)
			return null;
		// optimize the calling function prior to testing the conditions
		this.optimizeFunction(callingFuncDef);
		// obtain receiver expression
		var receiverExpr = null;
		if ((callingFuncDef.flags() & ClassDefinition.IS_STATIC) == 0) {
			var calleeExpr = callExpr.getExpr();
			if (! (calleeExpr instanceof PropertyExpression))
				throw new Error("unexpected type of expression");
			receiverExpr = calleeExpr.getExpr();
			if (asExpression) {
				// receiver should not have side effecets
				if (! (receiverExpr instanceof LocalExpression || receiverExpr instanceof ThisExpression)) {
					return null;
				}
			}
		}
		// check that the function may be inlined
		if (! this._functionIsInlineable(callingFuncDef))
			return null;
		// FIXME we could handle statements.length == 0 as well
		if (asExpression) {
			if (callingFuncDef.getStatements().length != 1)
				return null;
			if (callingFuncDef.getLocals().length != 0)
				return null;
			var modifiesArgs = ! Util.forEachStatement(function onStatement(statement) {
				var onExpr = function onExpr(expr) {
					if (expr instanceof AssignmentExpression && expr.getFirstExpr() instanceof LocalExpression)
						return false;
					return expr.forEachExpression(onExpr.bind(this));
				};
				return statement.forEachExpression(onExpr.bind(this));
			}, callingFuncDef.getStatements());
			if (modifiesArgs)
				return null;
		}
		// and the args passed can be inlined (types should match exactly (or emitters may insert additional code))
		if (! this._argsAreInlineable(callingFuncDef, callExpr.getArguments(), asExpression))
			return null;
		// build list of arguments (and this)
		var argsAndThis = callExpr.getArguments().concat([]);
		if (this._functionHasThis(callingFuncDef)) {
			if (receiverExpr != null) {
				argsAndThis.push(receiverExpr);
			} else {
				// in case of a closure
				argsAndThis.push(new ThisExpression(null, callingFuncDef.getClassDef()));
			}
		} else {
			argsAndThis.push(null);
		}
		return argsAndThis;
	},

	_argsAreInlineable: function (callingFuncDef, actualArgs, asExpression) {
		var formalArgsTypes = callingFuncDef.getArgumentTypes();
		if (actualArgs.length != formalArgsTypes.length)
			throw new "number of arguments mismatch";
		for (var i = 0; i < actualArgs.length; ++i) {
			if (asExpression && ! (actualArgs[i] instanceof LeafExpression))
				return false;
			if (! this._argIsInlineable(actualArgs[i].getType(), formalArgsTypes[i]))
				return false;
		}
		return true;
	},

	_argIsInlineable: function (actualType, formalType) {
		if (this._optimizer.enableRuntimeTypeCheck()) {
			if (actualType instanceof NullableType && ! (formalType instanceof NullableType)) {
				return false;
			}
		}
		// strip the Nullable wrapper and continue the comparison, or return
		actualType = actualType.resolveIfNullable();
		formalType = formalType.resolveIfNullable();
		if (actualType instanceof ObjectType && formalType instanceof ObjectType) {
			// if both types are object types, allow upcast
			return actualType.isConvertibleTo(formalType);
		} else {
			// perform strict type comparison, since implicit cast change their meaning (while being substituted)
			return actualType.equals(formalType);
		}
	},

	_functionIsInlineable: function (funcDef) {
		if (this.getStash(funcDef).isInlineable === null) {
			this.getStash(funcDef).isInlineable = function () {
				// only inline function that are short, has no branches (last statement may be a return)
				var statements = funcDef.getStatements();
				if (statements == null)
					return false;
				var requestsInline = (funcDef.flags() & ClassDefinition.IS_INLINE) != 0;
				if (requestsInline) {
					// ok
				} else if (_Util.numberOfStatements(statements) >= 5) {
					return false;
				}
				// no return in the middle, no function expression or super invocation expression
				return funcDef.forEachStatement(function onStatement(statement) {
					if (statement instanceof ExpressionStatement) {
						// ok
					} else if (requestsInline
						&& (statement instanceof ForStatement
							|| statement instanceof ForInStatement
							|| statement instanceof DoWhileStatement
							|| statement instanceof WhileStatement
							|| statement instanceof IfStatement
							|| statement instanceof SwitchStatement)) {
						// ok
					} else if (statement instanceof ReturnStatement && statement == funcDef.getStatements()[funcDef.getStatements().length - 1]) {
						// ok
					} else {
						return false;
					}
					if (! statement.forEachExpression(function onExpr(expr) {
						if (expr instanceof FunctionExpression)
							return false;
						if (expr instanceof SuperExpression)
							return false;
						return expr.forEachExpression(onExpr.bind(this));
					}.bind(this))) {
						return false;
					}
					return statement.forEachStatement(onStatement.bind(this));
				}.bind(this));
			}.call(this);
			this.log(_Util.getFuncName(funcDef) + (this.getStash(funcDef).isInlineable ? " is" : " is not") + " inlineable");
		}
		return this.getStash(funcDef).isInlineable;
	},

	_expandCallingFunction: function (callerFuncDef, statements, stmtIndex, calleeFuncDef, argsAndThis) {
		// clone statements of the calling function, while rewriting the identifiers with actual arguments
		this.log("expanding " + _Util.getFuncName(calleeFuncDef));
		var argsAndThisAndLocals = argsAndThis.concat([]);
		stmtIndex = this._createVars(callerFuncDef, statements, stmtIndex, calleeFuncDef, argsAndThisAndLocals);
		var calleeStatements = calleeFuncDef.getStatements();
		for (var i = 0; i < calleeStatements.length; ++i) {
			// clone the statement (while rewriting last return statement to an expression statement)
			var statement = calleeStatements[i] instanceof ReturnStatement
				? new ExpressionStatement(calleeStatements[i].getExpr().clone())
				: calleeStatements[i].clone();
			// replace the arguments with actual arguments
			var onExpr = function onExpr(expr, replaceCb) {
				return this._rewriteExpression(expr, replaceCb, argsAndThisAndLocals, calleeFuncDef);
			}.bind(this);
			statement.forEachExpression(onExpr);
			statement.forEachStatement(function onStatement(statement) {
				statement.forEachStatement(onStatement.bind(this));
				return statement.forEachExpression(onExpr);
			}.bind(this));
			// insert the statement
			statements.splice(stmtIndex++, 0, statement);
		}
		return stmtIndex;
	},

	_createVars: function (callerFuncDef, statements, stmtIndex, calleeFuncDef, argsAndThisAndLocals) {
		// handle "this" first
		if ((calleeFuncDef.flags() & ClassDefinition.IS_STATIC) == 0) {
			var tempVar = this._createVarForArgOrThis(callerFuncDef, statements, stmtIndex, argsAndThisAndLocals[argsAndThisAndLocals.length - 1], new ObjectType(calleeFuncDef.getClassDef()), "this");
			if (tempVar != null) {
				argsAndThisAndLocals[argsAndThisAndLocals.length - 1] = tempVar;
				++stmtIndex;
			}
		}
		// handle other arguments
		var formalArgs = calleeFuncDef.getArguments();
		for (var i = 0; i < formalArgs.length; ++i) {
			if (argsAndThisAndLocals[i] instanceof FunctionExpression && this._getNumberOfTimesArgIsUsed(calleeFuncDef, formalArgs[i]) <= 1) {
				// if the argument is a function expression that is referred only once, directly spill the function into the inlined function
				// of if it is never referred to, the function expression will disappear
			} else {
				var tempVar = this._createVarForArgOrThis(callerFuncDef, statements, stmtIndex, argsAndThisAndLocals[i], formalArgs[i].getType(), formalArgs[i].getName().getValue());
				if (tempVar != null) {
					argsAndThisAndLocals[i] = tempVar;
					++stmtIndex;
				}
			}
		}
		// handle locals
		var locals = calleeFuncDef.getLocals();
		for (var i = 0; i < locals.length; ++i) {
			var tempVar = this.createVar(callerFuncDef, locals[i].getType(), locals[i].getName().getValue());
			argsAndThisAndLocals.push(new LocalExpression(tempVar.getName(), tempVar));
		}
		return stmtIndex;
	},

	_getNumberOfTimesArgIsUsed: function (funcDef, local) {
		var count = 0;
		funcDef.forEachStatement(function onStatement(statement) {
			statement.forEachStatement(onStatement.bind(this));
			statement.forEachExpression(function onExpr(expr) {
				expr.forEachExpression(onExpr.bind(this));
				if (expr instanceof LocalExpression && expr.getLocal() == local) {
					++count;
				}
				return true;
			}.bind(this));
			return true;
		}.bind(this));
		return count;
	},

	_createVarForArgOrThis: function (callerFuncDef, statements, stmtIndex, expr, type, baseName) {
		// just pass through the expressions that do not have side effects
		if (expr instanceof ThisExpression || expr instanceof LeafExpression) {
			return null;
		}
		// create a local variable based on the given name
		var newLocal = this.createVar(callerFuncDef, type, baseName);
		// insert a statement that initializes the temporary
		statements.splice(stmtIndex, 0,
			new ExpressionStatement(
				new AssignmentExpression(
					new Token("=", false),
					new LocalExpression(newLocal.getName(), newLocal),
					expr)));
		// return an expression referring the the local
		return new LocalExpression(newLocal.getName(), newLocal);
	},

	_rewriteExpression: function (expr, replaceCb, argsAndThisAndLocals, calleeFuncDef) {
		var formalArgs = calleeFuncDef.getArguments();
		if (expr instanceof LocalExpression) {
			for (var j = 0; j < formalArgs.length; ++j) {
				if (formalArgs[j].getName().getValue() == expr.getToken().getValue())
					break;
			}
			if (j == formalArgs.length) {
				++j; // skip this
				var locals = calleeFuncDef.getLocals();
				if (locals.length != argsAndThisAndLocals.length - j)
					throw new Error("logic flaw");
				for (var k = 0; k < locals.length; ++k, ++j) {
					if (locals[k].getName().getValue() == expr.getToken().getValue())
						break;
				}
			}
			// replace the local expression (function expression need not (and cannot) be cloned, so it is guaranteed to appear only once, in _createVars)
			if (j != argsAndThisAndLocals.length) {
				if (argsAndThisAndLocals[j] instanceof FunctionExpression) {
					replaceCb(argsAndThisAndLocals[j]);
					argsAndThisAndLocals[j] = null; // just in case
				} else {
					replaceCb(argsAndThisAndLocals[j].clone());
				}
			} else {
				// closure referring to a local variable of outer scope
			}
		} else if (expr instanceof ThisExpression) {
			replaceCb(argsAndThisAndLocals[formalArgs.length].clone());
		}
		expr.forEachExpression(function (expr, replaceCb) {
			return this._rewriteExpression(expr, replaceCb, argsAndThisAndLocals, calleeFuncDef);
		}.bind(this));
		return true;
	},

	_functionHasThis: function (funcDef) {
		do {
			if ((funcDef.flags() & ClassDefinition.IS_STATIC) == 0)
				return true;
		} while ((funcDef = funcDef.getParent()) != null);
		return false;
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
				falseExpr,
				falseExpr.getType()));
	}

});

var _ArrayLengthOptimizeCommand = exports._ArrayLengthOptimizeCommand = _FunctionOptimizeCommand.extend({

	constructor: function () {
		_FunctionOptimizeCommand.prototype.constructor.call(this, "array-length");
	},

	optimizeFunction: function (funcDef) {
		funcDef.forEachStatement(function onStatement(statement) {
			statement.forEachStatement(onStatement.bind(this));
			if (statement instanceof ForStatement) {
				var arrayLocal = this._hasLengthExprOfLocalArray(statement.getCondExpr());
				if (arrayLocal != null) {
					if (this._lengthIsUnmodifiedInExpr(statement.getCondExpr())
						&& this._lengthIsUnmodifiedInExpr(statement.getPostExpr())
						&& statement.forEachStatement(this._lengthIsUnmodifiedInStatement.bind(this))) {
						// optimize!
						this.log(_Util.getFuncName(funcDef) + " optimizing .length at line " + statement.getToken().getLineNumber());
						// create local
						var lengthLocal = this.createVar(funcDef, Type.integerType, arrayLocal.getName().getValue() + "$len");
						// assign to the local
						statement.setInitExpr(
							new CommaExpression(
								new Token(",", false),
								statement.getInitExpr(),
								new AssignmentExpression(
									new Token("=", false),
									new LocalExpression(new Token(lengthLocal.getName(), true), lengthLocal),
									new PropertyExpression(
										new Token(".", false),
										new LocalExpression(new Token(arrayLocal.getName(), true), arrayLocal),
										new Token("length", true),
										lengthLocal.getType()))));
						// rewrite
						var onExpr = function (expr, replaceCb) {
							if (expr instanceof PropertyExpression
								&& expr.getIdentifierToken().getValue() == "length"
								&& expr.getExpr() instanceof LocalExpression
								&& expr.getExpr().getLocal() == arrayLocal) {
								replaceCb(new LocalExpression(new Token(lengthLocal.getName(), true), lengthLocal));
							} else {
								expr.forEachExpression(onExpr.bind(this));
							}
							return true;
						}.bind(this);
						statement.getCondExpr().forEachExpression(onExpr);
						statement.getPostExpr().forEachExpression(onExpr);
						statement.forEachStatement(function onStatement(statement) {
							statement.forEachStatement(onStatement.bind(this));
							statement.forEachExpression(onExpr);
							return true;
						}.bind(this));
					}
				}
			}
			return true;
		}.bind(this));
	},

	_hasLengthExprOfLocalArray: function (expr) {
		var local = null;
		expr.forEachExpression(function onExpr(expr) {
			if (expr instanceof PropertyExpression
				&& expr.getIdentifierToken().getValue() == "length"
				&& expr.getExpr() instanceof LocalExpression
				&& this._typeIsArray(expr.getExpr().getType().resolveIfNullable())) {
				local = expr.getExpr().getLocal();
				return false;
			}
			return expr.forEachExpression(onExpr.bind(this));
		}.bind(this));
		return local;
	},

	_lengthIsUnmodifiedInStatement: function (statement) {
		if (! statement.forEachStatement(this._lengthIsUnmodifiedInStatement.bind(this)))
			return false;
		return statement.forEachExpression(this._lengthIsUnmodifiedInExpr.bind(this));
	},

	_lengthIsUnmodifiedInExpr: function (expr) {
		if (expr instanceof AssignmentExpression) {
			if (this._lhsMayModifyLength(expr.getFirstExpr())) {
				return false;
			}
		} else if (expr instanceof CallExpression || expr instanceof SuperExpression) {
			return false;
		} else if (expr instanceof IncrementExpression) {
			if (this._lhsMayModifyLength(expr.getExpr())) {
				return false;
			}
		}
		return true;
	},

	_lhsMayModifyLength: function (expr) {
		if (expr instanceof PropertyExpression && expr.getIdentifierToken().getValue() == "length")
			return true;
		if (expr instanceof ArrayExpression)
			return true;
		var exprType = expr.getType().resolveIfNullable();
		if (exprType.equals(Type.variantType))
			return true;
		if (this._typeIsArray(exprType))
			return true;
		return false;
	},

	_typeIsArray: function (type) {
		if (! (type instanceof ObjectType))
			return false;
		var classDef = type.getClassDef();
		if (! (classDef instanceof InstantiatedClassDefinition))
			return false;
		return classDef.getTemplateClassName() == "Array";
	}

});
