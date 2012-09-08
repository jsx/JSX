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
	},

	$classIsNative: function (classDef) {
		return ! classDef.forEachClassToBase(function (classDef) {
			if (classDef.className() == "Object"
				|| (classDef.flags() & ClassDefinition.IS_NATIVE) == 0) {
				return true;
			}
			return false;
		});
	},

	$exprHasSideEffects: function (expr) {
		// FIXME native array access may have side effects
		var onExpr = function (expr) {
			if (expr instanceof FunctionExpression
				|| expr instanceof NewExpression
				|| expr instanceof AssignmentExpression
				|| expr instanceof PreIncrementExpression
				|| expr instanceof PostIncrementExpression
				|| expr instanceof SuperExpression) {
				return false;
			} else if (expr instanceof CallExpression) {
				var callingFuncDef = _DetermineCalleeCommand.getCallingFuncDef(expr);
				if (callingFuncDef != null && (callingFuncDef.flags() & ClassDefinition.IS_PURE) != 0) {
					// fall through (check receiver and arguments)
				} else {
					return false;
				}
			}
			return expr.forEachExpression(onExpr);
		};
		return ! onExpr(expr);
	},

	$optimizeBasicBlock: function (funcDef, optimizeExpressions) {
		function optimizeStatements(statements) {
			var statementIndex = 0;
			while (statementIndex < statements.length) {
				var exprsToOptimize = [];
				var setOptimizedExprs = [];
				while (statementIndex < statements.length) {
					var statement = statements[statementIndex++];
					if (statement instanceof ExpressionStatement) {
						exprsToOptimize.push(statement.getExpr());
						setOptimizedExprs.push(function (statement) {
							return function (expr) {
								statement.setExpr(expr);
							}
						}(statement));
					} else if (statement instanceof ReturnStatement) {
						var expr = statement.getExpr();
						if (expr != null) {
							exprsToOptimize.push(statement.getExpr());
							setOptimizedExprs.push(function (statement) {
								return function (expr) {
									statement.setExpr(expr);
								}
							}(statement));
						}
						break;
					} else {
						statement.handleStatements(function (statements) {
							optimizeStatements(statements);
							return true;
						});
						if (statement instanceof IfStatement) {
							exprsToOptimize.push(statement.getExpr());
							setOptimizedExprs.push(function (statement) {
								return function (expr) {
									statement.setExpr(expr);
								};
							}(statement));
						} else if (statement instanceof SwitchStatement) {
							exprsToOptimize.push(statement.getExpr());
							setOptimizedExprs.push(function (statement) {
								return function (expr) {
									statement.setExpr(expr);
								};
							}(statement));
						} else {
							// TODO implement
						}
						break;
					}
				}
				// optimize basic block
				if (exprsToOptimize.length != 0) {
					optimizeExpressions(exprsToOptimize);
					for (var i = 0; i < exprsToOptimize.length; ++i) {
						setOptimizedExprs[i](exprsToOptimize[i]);
					}
				}
			}
		}
		var statements = funcDef.getStatements();
		if (statements != null) {
			optimizeStatements(statements);
		}
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

		var calleesAreDetermined = false;
		var determineCallee = function () {
			if (! calleesAreDetermined) {
				this._commands.push(new _DetermineCalleeCommand());
				calleesAreDetermined = true;
			}
		}.bind(this);

		for (var i = 0; i < cmds.length; ++i) {
			var cmd = cmds[i];
			if (cmd == "lto") {
				this._commands.push(new _LinkTimeOptimizationCommand());
			} else if (cmd == "no-assert") {
				this._commands.push(new _NoAssertCommand());
			} else if (cmd == "no-log") {
				this._commands.push(new _NoLogCommand());
			} else if (cmd == "unclassify") {
				this._commands.push(new _UnclassifyOptimizationCommand());
				calleesAreDetermined = false;
			} else if (cmd == "fold-const") {
				this._commands.push(new _FoldConstantCommand());
			} else if (cmd == "dce") {
				determineCallee();
				this._commands.push(new _DeadCodeEliminationOptimizeCommand());
			} else if (cmd == "inline") {
				determineCallee();
				this._commands.push(new _InlineOptimizeCommand());
			} else if (cmd == "return-if") {
				this._commands.push(new _ReturnIfOptimizeCommand());
			} else if (cmd == "lcse") {
				this._commands.push(new _LCSEOptimizeCommand());
			} else if (cmd == "unbox") {
				determineCallee();
				this._commands.push(new _UnboxOptimizeCommand());
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
		this._excludeNative = false;
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
					var callingFuncDef = _DetermineCalleeCommand.findCallingFunctionInClass(
						expr.getType().getClassDef(), "constructor", expr.getConstructor().getArgumentTypes(), false);
					if (callingFuncDef == null) {
						throw new Error("could not find matching constructor for " + expr.getConstructor().toString());
					}
					this._setCallingFuncDef(expr, callingFuncDef);
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
		var found = Util.findFunctionInClass(classDef, funcName, argTypes, isStatic);
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

var _UnclassifyOptimizationCommandStash = exports._UnclassifyOptimizationCommandStash = Class.extend({

	constructor: function (that /* optional */) {
		this.inliner = that ? that.inliner : false;
	},

	clone: function () {
		return new _DetermineCalleeCommandStash(this);
	}

});

var _UnclassifyOptimizationCommand = exports._UnclassifyOptimizationCommand = _OptimizeCommand.extend({

	$IDENTIFIER: "unclassify",

	constructor: function () {
		_OptimizeCommand.prototype.constructor.call(this, _UnclassifyOptimizationCommand.IDENTIFIER);
	},

	_createStash: function () {
		return new _UnclassifyOptimizationCommandStash();
	},

	performOptimization: function () {
		var classDefs = this._getClassesToUnclassify();
		classDefs.forEach(function (classDef) {
			// convert function definitions (expect constructor) to static
			this.log("unclassifying class: " + classDef.className());
			classDef.forEachMemberFunction(function onFunction(funcDef) {
				if ((funcDef.flags() & ClassDefinition.IS_STATIC) == 0 && funcDef.name() != "constructor") {
					this.log("rewriting method to static function: " + funcDef.name());
					this._rewriteFunctionAsStatic(funcDef);
				}
				return true;
			}.bind(this));
			return true;
		}.bind(this));
		// rewrite member method invocations to static function calls
		this.getCompiler().forEachClassDef(function (parser, classDef) {
			this.log("rewriting member method calls in class: " + classDef.className());
			// rewrite member functions
			var onFunction = function (funcDef) {
				var onStatement = function (statement) {
					statement.forEachExpression(function (expr, replaceCb) {
						this._rewriteMethodCallsToStatic(expr, replaceCb, classDefs);
						return true;
					}.bind(this));
					return statement.forEachStatement(onStatement);
				}.bind(this);
				funcDef.forEachStatement(onStatement);
				return funcDef.forEachClosure(onFunction);
			}.bind(this);
			classDef.forEachMemberFunction(onFunction);
			// rewrite static variable initialization
			classDef.forEachMemberVariable(function (varDef) {
				if ((varDef.flags() & ClassDefinition.IS_STATIC) != 0) {
					if (varDef.getInitialValue() != null) {
						this._rewriteMethodCallsToStatic(
							varDef.getInitialValue(),
							function (expr) {
								varDef.setInitialValue(expr);
							},
							classDefs);
					}
				}
				return true;
			}.bind(this));
			return true;
		}.bind(this));
	},

	_getClassesToUnclassify: function () {
		var candidates = [];
		// list final classes extended from Object that has no overrides
		this.getCompiler().forEachClassDef(function (parser, classDef) {
			if ((classDef.flags() & (ClassDefinition.IS_FINAL | ClassDefinition.IS_NATIVE)) == ClassDefinition.IS_FINAL
				&& classDef.extendType().getClassDef().className() == "Object"
				&& classDef.implementTypes().length == 0
				&& classDef.forEachMemberFunction(function (funcDef) {
					return (funcDef.flags() & ClassDefinition.IS_OVERRIDE) == 0;
				})) {
				candidates.push(classDef);
			}
			return true;
		}.bind(this));
		// mark constructors that are inlineable
		for (var candidateIndex = candidates.length - 1; candidateIndex >= 0; --candidateIndex) {
			var hasInlineableCtor = false;
			candidates[candidateIndex].forEachMemberFunction(function (funcDef) {
				if ((funcDef.flags() & ClassDefinition.IS_STATIC) == 0 && funcDef.name() == "constructor") {
					var inliner = this._createInliner(funcDef);
					this.log(funcDef.getClassDef().className() + "#constructor(" + funcDef.getArgumentTypes().map(function (arg) { return ":" + arg.toString(); }).join(",") + ") is" + (inliner ? "" : " not") + " inlineable");
					if (inliner) {
						this.getStash(funcDef).inliner = inliner;
						hasInlineableCtor = true;
					}
				}
				return true;
			}.bind(this));
			if (! hasInlineableCtor) {
				candidates.splice(candidateIndex, 1);
			}
		}
		if (candidates.length == 0) {
			return candidates;
		}
		// check that the class is not referred to by: instanceof
		this.getCompiler().forEachClassDef(function (parser, classDef) {
			if (candidates.length == 0) {
				return false;
			}
			function onExpr(expr) {
				if (expr instanceof InstanceofExpression) {
					var foundClassDefIndex = candidates.indexOf(expr.getExpectedType().getClassDef());
					if (foundClassDefIndex != -1) {
						candidates.splice(foundClassDefIndex, 1);
						if (candidates.length == 0) {
							return false;
						}
					}
				}
				return expr.forEachExpression(onExpr);
			}
			classDef.forEachMemberFunction(function onFunction(funcDef) {
				funcDef.forEachStatement(function onStatement(statement) {
					statement.forEachExpression(onExpr);
					return statement.forEachStatement(onStatement);
				});
				return funcDef.forEachClosure(onFunction);
			});
			classDef.forEachMemberVariable(function (varDef) {
				if ((varDef.flags() & ClassDefinition.IS_STATIC) != 0) {
					if (varDef.getInitialValue() != null) {
						onExpr(varDef.getInitialValue());
					}
				}
				return true;
			});
			return true;
		});
		return candidates;
	},

	_createInliner: function (funcDef) {
		if (funcDef.getLocals().length != 0) {
			return null;
		}
		var propertyNames = [];
		funcDef.getClassDef().forEachMemberVariable(function (member) {
			if ((member.flags() & ClassDefinition.IS_STATIC) == 0) {
				propertyNames.push(member.name());
			}
			return true;
		});
		// only optimize the most simple form, the repetition of "this.foo = argN" that can be arranged to the order of properties (and in the order of arguments)
		var propertyExprs = [];
		var initializePropertyIndex = 0;
		var expectedArgIndex = 0;
		var statements = funcDef.getStatements();
		if (statements.length != propertyNames.length) {
			return null;
		}
		for (var statementIndex = 0; statementIndex < statements.length; ++statementIndex) {
			if (! (statements[statementIndex] instanceof ExpressionStatement)) {
				return null;
			}
			// check that lhs is this.X and rhs conforms to our requirement
			var statementExpr = statements[statementIndex].getExpr();
			if (! (statementExpr instanceof AssignmentExpression)) {
				return null;
			}
			var lhsExpr = statementExpr.getFirstExpr();
			if (! (lhsExpr instanceof PropertyExpression && lhsExpr.getExpr() instanceof ThisExpression)) {
				return null;
			}
			var onRHSExpr = function (expr) {
				if (expr instanceof AssignmentExpression
					|| expr instanceof PreIncrementExpression
					|| expr instanceof PostIncrementExpression) {
					// has side effects
					return false;
				} else if (expr instanceof FunctionExpression) {
					// environment of the closure would change
					return false;
				} else if (expr instanceof LocalExpression) {
					var argIndex = funcDef.getArguments().indexOf(expr.getLocal());
					if (argIndex == -1) {
						throw new Error("logic flaw; could not find argument: " + expr.getLocal().getName().getValue());
					}
					if (expectedArgIndex != argIndex) {
						return false;
					}
					++expectedArgIndex;
				}
				return expr.forEachExpression(onRHSExpr);
			};
			if (! onRHSExpr(statementExpr.getSecondExpr())) {
				return null;
			}
			// determine if the property is assignable
			var propertyIndex = propertyNames.indexOf(lhsExpr.getIdentifierToken().getValue());
			if (propertyIndex == -1) {
				throw new Error("logic flaw; could not find property: " + lhsExpr.getIdentifierToken().getValue());
			}
			if (propertyExprs[propertyIndex]) {
				// the property is already initialized
				return null;
			}
			for (var i = propertyExprs + 1; i < propertyNames.length; ++i) {
				// one of the properties that need to be initialized laterwards has already been initialized with an expression that has side effects
				if (propertyExprs[i] != null
					&& Util.exprHasSideEffects(propertyExprs[i])) {
					return null;
				}
			}
			propertyExprs[propertyIndex] = statementExpr.getSecondExpr().clone();
		}
		// build expression converter
		return function (newExpr) {
			// return list of expressions that should be used to initialize the properties
			return propertyExprs.map(function (expr) {
				function onExpr(expr, replaceCb) {
					if (expr instanceof LocalExpression) {
						var argIndex = funcDef.getArguments().indexOf(expr.getLocal());
						if (argIndex == -1) {
							throw new Error("logic flaw");
						}
						replaceCb(newExpr.getArguments()[argIndex]);
						return true;
					}
					return expr.forEachExpression(onExpr);
				}
				expr = expr.clone();
				onExpr(expr, function (newExpr) { expr = newExpr; });
				return expr;
			});
		};
	},

	_rewriteFunctionAsStatic: function (funcDef) {
		// first argument should be this
		var thisArg = new ArgumentDeclaration(new Token("$this", true), new ObjectType(funcDef.getClassDef()));
		funcDef.getArguments().unshift(thisArg);
		// rewrite this
		funcDef.forEachStatement(function onStatement(statement) {
			return statement.forEachExpression(function onExpr(expr, replaceCb) {
				if (expr instanceof ThisExpression) {
					replaceCb(new LocalExpression(thisArg.getName(), thisArg));
				} else if (expr instanceof FunctionExpression) {
					return expr.getFuncDef().forEachStatement(onStatement);
				}
				return expr.forEachExpression(onExpr);
			}) && statement.forEachStatement(onStatement);
		});
		// update flags
		funcDef.setFlags(funcDef.flags() | ClassDefinition.IS_STATIC);
	},

	_rewriteMethodCallsToStatic: function (expr, replaceCb, unclassifyingClassDefs) {
		var onExpr = function (expr, replaceCb) {
			if (expr instanceof CallExpression) {
				var calleeExpr = expr.getExpr();
				if (calleeExpr instanceof PropertyExpression
					&& ! (calleeExpr.getExpr() instanceof ClassExpression)
					&& ! calleeExpr.getType().isAssignable()) {
					// is a member method call
					var receiverType = calleeExpr.getExpr().getType().resolveIfNullable();
					var receiverClassDef = receiverType.getClassDef();
					if (unclassifyingClassDefs.indexOf(receiverClassDef) != -1) {
						// found, rewrite
						onExpr(calleeExpr.getExpr(), function (expr) {
							calleeExpr.setExpr(expr);
						});
						Util.forEachExpression(onExpr, expr.getArguments());
						var funcType = calleeExpr.getType();
						replaceCb(
							new CallExpression(
								expr.getToken(),
								new PropertyExpression(
									calleeExpr.getToken(),
									new ClassExpression(new Token(receiverClassDef.className(), true), receiverType),
									calleeExpr.getIdentifierToken(),
									calleeExpr.getTypeArguments(),
									new StaticFunctionType(
										funcType.getReturnType(),
										[ receiverType ].concat(funcType.getArgumentTypes()),
										false)),
								[ calleeExpr.getExpr() ].concat(expr.getArguments())));
						return true;
					}
				}
			}
			return expr.forEachExpression(onExpr);
		}.bind(this);
		onExpr(expr, replaceCb);
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
			if (this._foldNumericBinaryExpression(expr, replaceCb)) {
				// done
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

		// if both operands are constant, then...
		if (this._isIntegerOrNumberLiteralExpression(expr.getFirstExpr())
			&& this._isIntegerOrNumberLiteralExpression(expr.getSecondExpr())) {
			return this._foldNumericBinaryExpressionOfConstants(expr, replaceCb);
		}

		// if either operand is zero, then...
		function exprIsZero(expr) {
			return expr instanceof NumberLiteralExpression && +expr.getToken().getValue() === 0;
		}
		switch (expr.getToken().getValue()) {
		case "+":
			if (exprIsZero(expr.getFirstExpr())) {
				replaceCb(expr.getSecondExpr());
				return true;
			} else if (exprIsZero(expr.getSecondExpr())) {
				replaceCb(expr.getFirstExpr());
				return true;
			}
			break;
		case "-":
			// TODO should we rewrite "0 - n"?
			if (exprIsZero(expr.getSecondExpr())) {
				replaceCb(expr.getFirstExpr());
				return true;
			}
			break;
		}

		return false;
	},

	_foldNumericBinaryExpressionOfConstants: function (expr, replaceCb) {
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

		default:
			return false;
		}
		return true;
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

var _DeadCodeEliminationOptimizeCommand = exports._DeadCodeEliminationOptimizeCommand = _FunctionOptimizeCommand.extend({

	constructor: function () {
		_FunctionOptimizeCommand.prototype.constructor.call(this, "dce");
	},

	optimizeFunction: function (funcDef) {
		if (funcDef.getStatements() == null) {
			return null;
		}
		while (this._optimizeFunction(funcDef)
			 || this._removeExpressionStatementsWithoutSideEffects(funcDef))
			;
	},

	_removeExpressionStatementsWithoutSideEffects: function (funcDef) {
		var shouldRetry = false;
		(function onStatements(statements) {
			for (var i = 0; i < statements.length;) {
				if (statements[i] instanceof ExpressionStatement && ! _Util.exprHasSideEffects(statements[i].getExpr())) {
					shouldRetry = true;
					statements.splice(i, 1);
				} else {
					statements[i++].handleStatements(onStatements.bind(this));
				}
			}
		}.bind(this))(funcDef.getStatements());
		return shouldRetry;
	},

	_optimizeFunction: function (funcDef) {
		var shouldRetry = false;
		// use the assignment source, if possible
		_Util.optimizeBasicBlock(funcDef, function (exprs) {
			this._eliminateDeadStoresToProperties(funcDef, exprs);
			this._delayAssignmentsBetweenLocals(funcDef, exprs);
			this._eliminateDeadStores(funcDef, exprs);
		}.bind(this));
		// remove statements without side-effects
		(function onStatements(statements) {
			for (var i = statements.length - 1; i >= 0; --i) {
				var statement = statements[i];
				if (statement instanceof ExpressionStatement) {
					if (! _Util.exprHasSideEffects(statement.getExpr())) {
						statements.splice(i, 1);
					}
				}
				statement.handleStatements(onStatements);
			}
			return true;
		}).call(null, funcDef.getStatements());
		// mark the variables that are used (as RHS)
		var locals = funcDef.getLocals();
		var localsUsed = new Array(locals.length); // booleans
		funcDef.forEachStatement(function onStatement(statement) {
			statement.forEachExpression(function onExpr(expr) {
				if (expr instanceof AssignmentExpression
					&& expr.getFirstExpr() instanceof LocalExpression
					&& expr.getFirstExpr().getType().equals(expr.getSecondExpr().getType())) {
					// skip lhs of assignment to local that has no effect
					return onExpr(expr.getSecondExpr());
				} else if (expr instanceof LocalExpression) {
					for (var i = 0; i < locals.length; ++i) {
						if (locals[i] == expr.getLocal()) {
							break;
						}
					}
					if (i != locals.length) {
						localsUsed[i] = true;
					}
				} else if (expr instanceof FunctionExpression) {
					expr.getFuncDef().forEachStatement(onStatement);
				}
				return expr.forEachExpression(onExpr);
			});
			return statement.forEachStatement(onStatement);
		});
		// remove locals that are not used
		var altered = false;
		for (var localIndex = localsUsed.length - 1; localIndex >= 0; --localIndex) {
			if (localsUsed[localIndex]) {
				continue;
			}
			// remove assignment to the variable
			funcDef.forEachStatement(function onStatement(statement) {
				statement.forEachExpression(function onExpr(expr, replaceCb) {
					if (expr instanceof AssignmentExpression
						&& expr.getFirstExpr() instanceof LocalExpression
						&& expr.getFirstExpr().getLocal() == locals[localIndex]) {
						var rhsExpr = expr.getSecondExpr();
						replaceCb(rhsExpr);
						shouldRetry = true;
						return onExpr(rhsExpr);
					} else if (expr instanceof LocalExpression && expr.getLocal() == locals[localIndex]) {
						throw new Error("logic flaw, found a variable going to be removed being used");
					} else if (expr instanceof FunctionExpression) {
						expr.getFuncDef().forEachStatement(onStatement);
					}
					return expr.forEachExpression(onExpr);
				});
				return statement.forEachStatement(onStatement);
			});
			// remove from locals array
			locals.splice(localIndex, 1);
		}
		return shouldRetry;
	},

	_delayAssignmentsBetweenLocals: function (funcDef, exprs) {
		// find forms localA = localB, and rewrite the use of localA to localB
		function setLocal(list, key, value) {
			for (var i = 0; i < list.length; ++i) {
				if (list[i][0] == key) {
					list[i][1] = value;
					return;
				}
			}
			list.push([key, value]);
		}
		function getLocal(list, key) {
			for (var i = 0; i < list.length; ++i) {
				if (list[i][0] == key) {
					return list[i][1];
				}
			}
			return null;
		}
		function deleteLocal(list, key) {
			for (var i = 0; i < list.length; ++i) {
				if (list[i][0] == key) {
					list.splice(i, 1);
					return;
				}
			}
		}
		function clearLocals(list) {
			list.splice(0, list.length);
		}
		var localsUntouchable = []; // list of [local, boolean]
		var locals = []; // list of [local, expr]
		// mark the locals that uses op= (cannot be eliminated by the algorithm applied laterwards)
		var onExpr = function (expr) {
			if (expr instanceof AssignmentExpression
				&& expr.getToken().getValue() != "="
				&& expr.getFirstExpr() instanceof LocalExpression) {
				this.log("local variable " + expr.getFirstExpr().getLocal().getName().getValue() + " cannot be rewritten (has fused op)");
				setLocal(localsUntouchable, expr.getFirstExpr().getLocal(), true);
			} else if ((expr instanceof PreIncrementExpression || expr instanceof PostIncrementExpression)
				&& expr.getExpr() instanceof LocalExpression) {
				this.log("local variable " + expr.getExpr().getLocal().getName().getValue() + " cannot be rewritten (has increment)");
				setLocal(localsUntouchable, expr.getExpr().getLocal(), true);
			}
			return expr.forEachExpression(onExpr);
		}.bind(this);
		Util.forEachExpression(onExpr, exprs);
		// rewrite the locals
		var onExpr = function (expr, replaceCb) {
			if (expr instanceof AssignmentExpression) {
				if (expr.getFirstExpr() instanceof LocalExpression) {
					onExpr(expr.getSecondExpr(), function (assignExpr) {
						return function (expr) {
							assignExpr.setSecondExpr(expr);
						};
					}(expr));
					if (! getLocal(localsUntouchable, expr.getFirstExpr().getLocal())
						&& expr.getFirstExpr().getType().equals(expr.getSecondExpr().getType())) {
						var lhsLocal = expr.getFirstExpr().getLocal();
						this.log("resetting cache for: " + lhsLocal.getName().getValue());
						for (var i = locals.length - 1; i >= 0; --i) {
							if (locals[i][0] == lhsLocal) {
								this.log("  clearing itself");
								locals.splice(i, 1);
							} else if (locals[i][1] instanceof LocalExpression && locals[i][1].getLocal() == lhsLocal) {
								this.log("  clearing " + locals[i][0].getName().getValue());
								locals.splice(i, 1);
							}
						}
						if (expr.getToken().getValue() == "=") {
							var rhsExpr = expr.getSecondExpr();
							if (rhsExpr instanceof LocalExpression) {
								var rhsLocal = rhsExpr.getLocal();
								if (lhsLocal != rhsLocal && ! getLocal(localsUntouchable, rhsLocal)) {
									this.log("  set to: " + rhsLocal.getName().getValue());
									setLocal(locals, lhsLocal, rhsExpr);
								}
							} else if (rhsExpr instanceof NullExpression
								|| rhsExpr instanceof NumberLiteralExpression
								|| rhsExpr instanceof IntegerLiteralExpression
								|| rhsExpr instanceof StringLiteralExpression) {
								this.log("  set to: " + rhsExpr.getToken().getValue());
								setLocal(locals, lhsLocal, rhsExpr);
							}
						}
					}
					return true;
				}
			} else if (expr instanceof LocalExpression) {
				var cachedExpr = getLocal(locals, expr.getLocal());
				if (cachedExpr) {
					replaceCb(cachedExpr.clone());
					return true;
				}
			} else if (expr instanceof CallExpression) {
				var callingFuncDef = _DetermineCalleeCommand.getCallingFuncDef(expr);
				if (callingFuncDef != null && (callingFuncDef.flags() & ClassDefinition.IS_PURE) != 0) {
					// fall through
				} else {
					expr.forEachExpression(onExpr);
					if (funcDef.getParent() != null || funcDef.getClosures().length != 0) {
						clearLocals(locals);
					}
					return true;
				}
			} else if (expr instanceof NewExpression) {
				expr.forEachExpression(onExpr);
				clearLocals(locals);
				return true;
			}
			return expr.forEachExpression(onExpr);
		}.bind(this);
		Util.forEachExpression(onExpr, exprs);
	},

	_eliminateDeadStores: function (funcDef, exprs) {
		var lastAssignExpr = []; // array of [local, assignExpr, rewriteCb]
		var onExpr = function (expr, rewriteCb) {
			if (expr instanceof AssignmentExpression) {
				if (expr.getToken().getValue() == "="
					&& expr.getFirstExpr() instanceof LocalExpression) {
					onExpr(expr.getSecondExpr(), function (assignExpr) {
						return function (expr) {
							assignExpr.setSecondExpr(expr);
						};
					}(expr));
					var lhsLocal = expr.getFirstExpr().getLocal();
					for (var i = 0; i < lastAssignExpr.length; ++i) {
						if (lastAssignExpr[i][0] == lhsLocal) {
							break;
						}
					}
					if (i != lastAssignExpr.length) {
						this.log("eliminating dead store to: " + lhsLocal.getName().getValue());
						lastAssignExpr[i][2](lastAssignExpr[i][1].getSecondExpr());
					}
					lastAssignExpr[i] = [lhsLocal, expr, rewriteCb];
					return true;
				}
			} else if (expr instanceof LocalExpression) {
				for (var i = 0; i < lastAssignExpr.length; ++i) {
					if (lastAssignExpr[i][0] == expr.getLocal()) {
						lastAssignExpr.splice(i, 1);
						break;
					}
				}
			} else if (expr instanceof CallExpression) {
				onExpr(expr.getExpr(), function (callExpr) {
					return function (expr) {
						callExpr.setExpr(expr);
					};
				}(expr));
				Util.forEachExpression(onExpr, expr.getArguments());
				var callingFuncDef = _DetermineCalleeCommand.getCallingFuncDef(expr);
				if (callingFuncDef != null && (callingFuncDef.flags() & ClassDefinition.IS_PURE) != 0) {
					// ok
				} else {
					lastAssignExpr.splice(0, lastAssignExpr.length);
				}
				return true;
			} else if (expr instanceof NewExpression) {
				Util.forEachExpression(onExpr, expr.getArguments());
				lastAssignExpr.splice(0, lastAssignExpr.length);
				return true;
			}
			return expr.forEachExpression(onExpr);
		}.bind(this);
		Util.forEachExpression(onExpr, exprs);
	},

	_eliminateDeadStoresToProperties: function (funcDef, exprs) {
		function isFirstLevelPropertyAccess(expr) {
			if (! (expr instanceof PropertyExpression)) {
				return false;
			}
			var baseExpr = expr.getExpr();
			if (baseExpr instanceof LocalExpression
				|| baseExpr instanceof ThisExpression
				|| baseExpr instanceof ClassExpression) {
				return true;
			} else {
				return false;
			}
		}
		function baseExprsAreEqual(x, y) {
			if (x instanceof LocalExpression && y instanceof LocalExpression) {
				return x.getLocal() == y.getLocal();
			} else if (x instanceof ThisExpression && y instanceof ThisExpression) {
				return true;
			} else if (x instanceof ClassExpression && y instanceof ClassExpression) {
				return x.getType().equals(y.getType());
			}
			return false;
		}
		var lastAssignExpr = {}; // array of propertyName => [assignExpr, rewriteCb]
		var onExpr = function (expr, rewriteCb) {
			if (expr instanceof AssignmentExpression) {
				if (expr.getToken().getValue() == "="
					&& isFirstLevelPropertyAccess(expr.getFirstExpr())
					&& ! _Util.classIsNative(expr.getFirstExpr().getExpr().getType().getClassDef())) {
					var propertyName = expr.getFirstExpr().getIdentifierToken().getValue();
					onExpr(expr.getSecondExpr());
					if (lastAssignExpr[propertyName]
						&& baseExprsAreEqual(expr.getFirstExpr().getExpr(), lastAssignExpr[propertyName][0].getFirstExpr().getExpr())) {
						lastAssignExpr[propertyName][1](lastAssignExpr[propertyName][0].getSecondExpr());
					}
					lastAssignExpr[propertyName] = [expr, rewriteCb];
					return true;
				} else if (expr.getFirstExpr() instanceof LocalExpression) {
					onExpr(expr.getSecondExpr());
					for (var k in lastAssignExpr) {
						var baseExpr = lastAssignExpr[k][0].getFirstExpr().getExpr();
						if (baseExpr instanceof LocalExpression
							&& baseExpr.getLocal() == expr.getFirstExpr().getLocal()) {
							delete lastAssignExpr[k];
						}
					}
					return true;
				}
			} else if (isFirstLevelPropertyAccess(expr)) {
				var propertyName = expr.getIdentifierToken().getValue();
				delete lastAssignExpr[propertyName];
			} else if (expr instanceof CallExpression) {
				onExpr(expr.getExpr());
				Util.forEachExpression(onExpr, expr.getArguments());
				lastAssignExpr = {};
				return true;
			} else if (expr instanceof NewExpression) {
				Util.forEachExpression(onExpr, expr.getArguments());
				lastAssignExpr = {};
				return true;
			}
			return expr.forEachExpression(onExpr);
		}.bind(this);
		Util.forEachExpression(onExpr, exprs);
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

var _LCSECachedExpression = exports._LCSECachedExpression = Class.extend({

	constructor: function (origExpr, replaceCb) {
		this._origExpr = origExpr;
		this._replaceCb = replaceCb;
		this._localExpr = null;
	},

	getOrigExpr: function () {
		return this._origExpr;
	},

	getLocalExpr: function (createVarCb /* (type, baseName) -> LocalExpression */) {
		if (this._localExpr == null) {
			// rewrite the first occurence of the expression and update cache entry
			this._localExpr = createVarCb(this._origExpr.getType(), this._origExpr.getIdentifierToken().getValue());
			this._replaceCb(new AssignmentExpression(new Token("=", false), this._localExpr, this._origExpr));
		}
		return this._localExpr;
	}

});

var _LCSEOptimizeCommand = exports._LCSEOptimizeCommand = _FunctionOptimizeCommand.extend({

	constructor: function () {
		_FunctionOptimizeCommand.prototype.constructor.call(this, "lcse");
	},

	optimizeFunction: function (funcDef) {
		_Util.optimizeBasicBlock(funcDef, function (exprs) {
			this._optimizeExpressions(funcDef, exprs);
		}.bind(this));
	},

	_optimizeExpressions: function (funcDef, exprs) {
		this.log("optimizing expressions starting");

		var cachedExprs = {};

		var getCacheKey = function (expr) {
			if (expr instanceof PropertyExpression) {
				var receiverType = expr.getExpr().getType();
				if (receiverType instanceof ObjectType && _Util.classIsNative(receiverType.getClassDef())) {
					return null;
				}
				var base = getCacheKey(expr.getExpr());
				if (base == null) {
					return null;
				}
				return base + "." + expr.getIdentifierToken().getValue();
			} else if (expr instanceof LocalExpression) {
				return expr.getLocal().getName().getValue();
			} else if (expr instanceof ThisExpression) {
				return "this";
			}
			return null;
		}.bind(this);

		var registerCacheable = function (key, expr, replaceCb) {
			this.log("registering lcse entry for: " + key);
			cachedExprs[key] = new _LCSECachedExpression(expr, replaceCb);
		}.bind(this);

		var clearCacheByLocalName = function (name) {
			this.log("clearing lcse entry for local name: " + name);
			for (var k in cachedExprs) {
				if (k.substring(0, name.length + 1) == name + ".") {
					this.log("  removing: " + k);
					delete cachedExprs[k];
				}
			}
		}.bind(this);

		var clearCacheByPropertyName = function (name) {
			this.log("clearing lcse entry for property name: " + name);
			for (var k in cachedExprs) {
				var mayPreserve = function onExpr(expr) {
					if (expr instanceof LocalExpression
						|| expr instanceof ThisExpression) {
						return true;
					}
					// is PropertyExpression
					if (expr.getIdentifierToken().getValue() == name) {
						return false;
					}
					return onExpr(expr.getExpr());
				}(cachedExprs[k].getOrigExpr());
				if (! mayPreserve) {
					this.log("  removing: " + k);
					delete cachedExprs[k];
				}
			}
		}.bind(this);

		var clearCache = function () {
			this.log("clearing lcse cache");
			cachedExprs = {};
		}.bind(this);

		// add an expression to cache
		var onExpr = function (expr, replaceCb) {
			// handle special cases first
			if (expr instanceof AssignmentExpression) {
				var lhsExpr = expr.getFirstExpr();
				if (lhsExpr instanceof LocalExpression) {
					onExpr(expr.getSecondExpr(), function (receiver) {
						return function (expr) {
							receiver.setSecondExpr(expr);
						};
					}(expr));
					clearCacheByLocalName(lhsExpr.getLocal().getName().getValue());
				} else if (lhsExpr instanceof PropertyExpression) {
					onExpr(lhsExpr.getExpr(), function (receiver) {
						return function (expr) {
							receiver.setExpr(expr);
						};
					}(lhsExpr));
					onExpr(expr.getSecondExpr(), function (receiver) {
						return function (expr) {
							receiver.setSecondExpr(expr);
						};
					}(expr));
					if (lhsExpr.getIdentifierToken().getValue() == "length") {
						// once we support caching array elements, we need to add special care
					} else {
						var cacheKey = getCacheKey(lhsExpr);
						if (cacheKey) {
							registerCacheable(cacheKey, lhsExpr, function (receiver) {
								return function (expr) {
									receiver.setFirstExpr(expr);
								}
							}(expr));
						}
					}
				} else {
					clearCache();
				}
				return true;
			} else if (expr instanceof PreIncrementExpression
				|| expr instanceof PostIncrementExpression) {
				// optimize the receiver of LHS, and clear (for now)
				if (expr.getExpr() instanceof PropertyExpression) {
					onExpr(expr.getExpr().getExpr(), function (receiver) {
						return function (expr) {
							receiver.setExpr(expr);
						};
					}(expr.getExpr()));
				}
				clearCache();
				return true;
			} else if (expr instanceof ConditionalExpression) {
				// only optimize the condExpr, then clear (for now)
				onExpr(expr.getCondExpr(), function (receiver) {
					return function (expr) {
						receiver.setCondExpr(expr);
					};
				}(expr));
				clearCache();
				return true;
			} else if (expr instanceof FunctionExpression) {
				clearCache();
				return true;
			} else if (expr instanceof CallExpression) {
				// optimize the receiver (not the function) and args, and clear
				var funcExpr = expr.getExpr();
				if (funcExpr instanceof LocalExpression) {
					// nothing to do
				} else if (funcExpr instanceof PropertyExpression) {
					onExpr(expr.getExpr().getExpr(), function (receiver) {
						return function (expr) {
							receiver.setExpr(expr);
						}
					}(expr.getExpr()));
				} else {
					clearCache();
				}
				var args = expr.getArguments();
				for (var i = 0; i < args.length; ++i) {
					onExpr(args[i], function (args, index) {
						return function (expr) {
							args[index] = expr;
						};
					}(args, i));
				}
				clearCache();
				return true;
			} else if (expr instanceof NewExpression) {
				// optimize the args, and clear
				var args = expr.getArguments();
				this.log("new expression");
				for (var i = 0; i < args.length; ++i) {
					onExpr(args[i], function (args, index) {
						return function (expr) {
							args[index] = expr;
						};
					}(args, i));
				}
				clearCache();
				return true;
			}
			// normal path
			if (expr instanceof PropertyExpression) {
				if (expr.getIdentifierToken().getValue() == "length") {
					// ditto as above comment for "length"
				} else {
					var cacheKey = getCacheKey(expr);
					if (cacheKey) {
						this.log("rewriting cse for: " + cacheKey);
						if (cachedExprs[cacheKey]) {
							replaceCb(
								cachedExprs[cacheKey].getLocalExpr(function (type, baseName) {
									var localVar = this.createVar(funcDef, type, baseName);
									return new LocalExpression(localVar.getName(), localVar);
								}.bind(this)
							).clone());
						} else {
							registerCacheable(cacheKey, expr, replaceCb);
						}
					}
				}
			}
			// recursive
			return expr.forEachExpression(onExpr);
		}.bind(this);
		Util.forEachExpression(onExpr, exprs);
	}

});

var _UnboxOptimizeCommandStash = exports._UnboxOptimizeCommandStash = Class.extend({

	constructor: function () {
		this.canUnbox = null;
	}

});

var _UnboxOptimizeCommand = exports._UnboxOptimizeCommand = _FunctionOptimizeCommand.extend({

	constructor: function () {
		_FunctionOptimizeCommand.prototype.constructor.call(this, "unbox");
	},

	_createStash: function () {
		return new _UnboxOptimizeCommandStash();
	},

	optimizeFunction: function (funcDef) {
		if (funcDef.getStatements() == null) {
			return;
		}
		var locals = funcDef.getLocals();
		// check all the locals that exist _now_, and remove ones that have been optimized
		for (var i = 0, iMax = locals.length; i < locals.length;) {
			if (this._optimizeLocal(funcDef, locals[i])) {
				locals.splice(i, 1);
			} else {
				++i;
			}
		}
	},

	_optimizeLocal: function (funcDef, local) {
		// preconditions
		if (! (local.getType() instanceof ObjectType)) {
			return;
		}
		var classDef = local.getType().getClassDef();
		if (_Util.classIsNative(classDef)) {
			return;
		}
		// determine if the local can be unboxed
		var foundNew = false;
		var onStatement = function (statement) {
			var onExpr = function (expr) {
				if (expr instanceof PropertyExpression) {
					var baseExpr = expr.getExpr();
					if (baseExpr instanceof LocalExpression && baseExpr.getLocal() == local) {
						if (! expr.getType().isAssignable()) {
							// is a call to member function
							return false;
						}
						// a property of the variable has been accessed, OK!
						return true;
					}
				} else if (expr instanceof LocalExpression) {
					if (expr.getLocal() == local) {
						// the variable has been accessed in a way other than those allowed above, FAIL!
						return false;
					}
				} else if (expr instanceof FunctionExpression) {
					// we need to look into the closure
					return expr.getFuncDef().forEachStatement(onStatement);
				}
				return expr.forEachExpression(onExpr);
			}.bind(this);
			// first check the local = new ...
			var newExpr = this._statementIsConstructingTheLocal(statement, local);
			if (newExpr != null) {
				if (! newExpr.getType().equals(local.getType())) {
					return false;
				}
				if (! this._newExpressionCanUnbox(newExpr)) {
					return false;
				}
				if (! newExpr.forEachExpression(onExpr)) {
					return false;
				}
				if (! Util.forEachExpression(function (expr) {
					return ! _Util.exprHasSideEffects(expr);
				}, newExpr.getArguments())) {
					return false;
				}
				foundNew = true;
				return true;
			}
			// check the rest
			if (! statement.forEachExpression(onExpr)) {
				return false;
			}
			return statement.forEachStatement(onStatement);
		}.bind(this);
		var canUnbox = funcDef.forEachStatement(onStatement);
		// doit
		if (canUnbox && foundNew) {
			this._unboxVariable(funcDef, local);
			return true;
		} else {
			return false;
		}
	},

	_newExpressionCanUnbox: function (newExpr) {
		var ctor = _DetermineCalleeCommand.getCallingFuncDef(newExpr);
		if (this.getStash(ctor).canUnbox != null) {
			return this.getStash(ctor).canUnbox;
		}
		return this.getStash(ctor).canUnbox = function () {
			if (ctor.getLocals().length != 0) {
				return false;
			}
			return ctor.forEachStatement(function (statement) {
				// only allow list of this.X = ...
				var assigned = {};
				if (! (statement instanceof ExpressionStatement)) {
					return false;
				}
				var expr = statement.getExpr();
				if (! (expr instanceof AssignmentExpression)) {
					return false;
				}
				var lhsExpr = expr.getFirstExpr();
				if (! (lhsExpr instanceof PropertyExpression && lhsExpr.getExpr() instanceof ThisExpression)) {
					return false;
				}
				var propertyName = lhsExpr.getIdentifierToken().getValue();
				if (assigned[propertyName]) {
					return false;
				}
				assigned[propertyName] = true;
				// check rhs
				return expr.getSecondExpr(function (expr) {
					if (expr instanceof ThisExpression) {
						return false;
					} else if (expr instanceof FunctionExpression) {
						return false;
					}
					return expr.forEachExpression(expr);
				});
			}.bind(this));
		}.call(this);
	},

	_unboxVariable: function (funcDef, local) {
		this.log("unboxing " + local.getName().getValue());

		// build map of propetyName => LocalVariable
		var variableMap = {};
		local.getType().getClassDef().forEachClassFromBase(function (classDef) {
			classDef.forEachMemberVariable(function (member) {
				if ((member.flags() & (ClassDefinition.IS_STATIC | ClassDefinition.IS_ABSTRACT)) == 0) {
					variableMap[member.name()] = this.createVar(funcDef, member.getType(), local.getName().getValue() + "$" + member.name());
				}
				return true;
			}.bind(this));
			return true;
		}.bind(this));
		var createLocalExpressionFor = function (propertyName) {
			if (! variableMap[propertyName]) {
				throw new Error("could not find local variable for property name: " + propertyName);
			}
			return new LocalExpression(variableMap[propertyName].getName(), variableMap[propertyName]);
		}.bind(this);

		var buildConstructingStatements = function (dstStatements, dstStatementIndex, newExpr) {
			var ctor = _DetermineCalleeCommand.getCallingFuncDef(newExpr);
			ctor.forEachStatement(function (statement) {
				var propertyName = statement.getExpr().getFirstExpr().getIdentifierToken().getValue();
				var rhsExpr = statement.getExpr().getSecondExpr().clone();
				var onExpr = function (expr, replaceCb) {
					if (expr instanceof LocalExpression) {
						for (var argIndex = 0; argIndex < ctor.getArguments().length; ++argIndex) {
							if (expr.getLocal() == ctor.getArguments()[argIndex]) {
								// found
								break;
							}
						}
						if (argIndex == ctor.getArguments().length) {
							throw new Error("logic flaw, could not find the local in arguments");
						}
						replaceCb(newExpr.getArguments()[argIndex].clone());
					}
					return expr.forEachExpression(onExpr);
				}.bind(this);
				onExpr(rhsExpr, function (expr) {
					rhsExpr = expr;
				});
				dstStatements.splice(dstStatementIndex++, 0, new ExpressionStatement(
					new AssignmentExpression(new Token("=", false), createLocalExpressionFor(propertyName), rhsExpr)));
				return true;
			}.bind(this));
			return dstStatementIndex;
		}.bind(this);

		// rewrite the code
		var onStatements = function (statements) {
			for (var statementIndex = 0; statementIndex < statements.length;) {
				var onExpr = function (expr, replaceCb) {
					if (expr instanceof PropertyExpression
						&& expr.getExpr() instanceof LocalExpression
						&& expr.getExpr().getLocal() == local) {
						// rewrite local.prop
						replaceCb(createLocalExpressionFor(expr.getIdentifierToken().getValue()));
						return true;
					} else if (expr instanceof FunctionExpression) {
						return onStatements(expr.getFuncDef().getStatements());
					} else if (expr instanceof LocalExpression && expr.getLocal() == local) {
						throw new Error("logic flaw, unexpected pattern");
					}
					expr.forEachExpression(onExpr);
					return true;
				}.bind(this);
				var newExpr = this._statementIsConstructingTheLocal(statements[statementIndex], local);
				if (newExpr != null) {
					statements.splice(statementIndex, 1);
					statementIndex = buildConstructingStatements(statements, statementIndex, newExpr);
				} else {
					statements[statementIndex].forEachExpression(onExpr);
					statements[statementIndex].handleStatements(onStatements);
					++statementIndex;
				}
			}
			return true;
		}.bind(this);
		onStatements(funcDef.getStatements());
	},

	_statementIsConstructingTheLocal: function (statement, local) {
		if (! (statement instanceof ExpressionStatement)) {
			return null;
		}
		var expr = statement.getExpr();
		if (! (expr instanceof AssignmentExpression)) {
			return null;
		}
		var lhsExpr = expr.getFirstExpr();
		if (! (lhsExpr instanceof LocalExpression)) {
			return null;
		}
		if (lhsExpr.getLocal() != local) {
			return null;
		}
		var rhsExpr = expr.getSecondExpr();
		if (! (rhsExpr instanceof NewExpression)) {
			return null;
		}
		return rhsExpr;
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
				var condExpr = statement.getCondExpr();
				var arrayLocal = condExpr != null ? this._hasLengthExprOfLocalArray(condExpr) : null;
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
										[],
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
