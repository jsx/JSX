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

import "./analysis.jsx";
import "./classdef.jsx";
import "./parser.jsx";
import "./expression.jsx";
import "./statement.jsx";
import "./type.jsx";
import "./util.jsx";
import "./compiler.jsx";

class _Util {

	static function handleSubStatements (cb : function(:Statement[]):boolean, statement : Statement) : boolean {
		var ret = false;
		if (statement instanceof ContinuableStatement) {
			if (cb((statement as ContinuableStatement).getStatements()))
				ret = true;
		} else if (statement instanceof IfStatement) {
			if (cb((statement as IfStatement).getOnTrueStatements()))
				ret = true;
			if (cb((statement as IfStatement).getOnFalseStatements()))
				ret = true;
		} else if (statement instanceof SwitchStatement) {
			if (cb((statement as SwitchStatement).getStatements()))
				ret = true;
		} else if (statement instanceof TryStatement) {
			if (cb((statement as TryStatement).getTryStatements()))
				ret = true;
			if (cb((statement as TryStatement).getCatchStatements().map.<Statement>((s) -> { return s; })))
				ret = true;
			if (cb((statement as TryStatement).getFinallyStatements()))
				ret = true;
		} else if (statement instanceof CatchStatement) {
			if (cb((statement as CatchStatement).getStatements()))
				ret = true;
		}
		return ret;
	}

	static function classIsNative (classDef : ClassDefinition) : boolean {
		return ! classDef.forEachClassToBase(function (classDef) {
			if (classDef.className() == "Object"
				|| (classDef.flags() & ClassDefinition.IS_NATIVE) == 0) {
					return true;
				}
			return false;
		});
	}

	static function exprHasSideEffects (expr : Expression) : boolean {
		// FIXME native array access may have side effects
		function onExpr (expr : Expression, _ : function(:Expression):void) : boolean {
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
		}
		return ! onExpr(expr, null);
	}

	static function conditionIsConstant (expr : Expression) : Nullable.<boolean> {
		function leafIsConstant (expr : Expression) : Nullable.<boolean> {
			if (expr instanceof NullExpression) {
				return false;
			} else if (expr instanceof BooleanLiteralExpression) {
				return expr.getToken().getValue() == "true";
			} else if (expr instanceof StringLiteralExpression) {
				return expr.getToken().getValue().length > 2;
			} else if (expr instanceof NumberLiteralExpression || expr instanceof IntegerLiteralExpression) {
				return (expr.getToken().getValue() as number) as boolean;
			} else if (expr instanceof MapLiteralExpression || expr instanceof ArrayLiteralExpression) {
				return true;
			}
			return null;
		}

		if (expr instanceof LeafExpression) {
			return leafIsConstant(expr);
		} else if (expr instanceof AsExpression) {
			var asExpr = expr as AsExpression;
			if (asExpr.getType().equals(Type.booleanType)) {
				return leafIsConstant(asExpr.getExpr());
			} else {
				// TODO
				return null;
			}
		}
		return null;
	}

	static function optimizeBasicBlock (funcDef : MemberFunctionDefinition, optimizeExpressions : function(:Expression[]):void) : void {
		function optimizeStatements(statements : Statement[]) : void {
			var statementIndex = 0;
			while (statementIndex < statements.length) {
				var exprsToOptimize = new Expression[];
				var setOptimizedExprs = new Array.<function(:Expression):void>;
				while (statementIndex < statements.length) {
					var statement = statements[statementIndex++];
					if (statement instanceof ExpressionStatement) {
						exprsToOptimize.push((statement as ExpressionStatement).getExpr());
						setOptimizedExprs.push(function (statement : ExpressionStatement) : function(:Expression):void {
							return function (expr) {
								statement.setExpr(expr);
							};
						}(statement as ExpressionStatement));
					} else if (statement instanceof ReturnStatement) {
						var expr = (statement as ReturnStatement).getExpr();
						if (expr != null) {
							exprsToOptimize.push((statement as ReturnStatement).getExpr());
							setOptimizedExprs.push(function (statement : ReturnStatement) : function(:Expression):void {
								return function (expr) {
									statement.setExpr(expr);
								};
							}(statement as ReturnStatement));
						}
						break;
					} else {
						statement.handleStatements(function (statements) {
							optimizeStatements(statements);
							return true;
						});
						if (statement instanceof IfStatement) {
							exprsToOptimize.push((statement as IfStatement).getExpr());
							setOptimizedExprs.push(function (statement : IfStatement) : function(:Expression):void {
								return function (expr) {
									statement.setExpr(expr);
								};
							}(statement as IfStatement));
						} else if (statement instanceof SwitchStatement) {
							exprsToOptimize.push((statement as SwitchStatement).getExpr());
							setOptimizedExprs.push(function (statement : SwitchStatement) : function(:Expression):void {
								return function (expr) {
									statement.setExpr(expr);
								};
							}(statement as SwitchStatement));
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

}

class Optimizer {

	var _compiler : Compiler;
	var _commands : _OptimizeCommand[];
	var _log : string[];
	var _dumpLogs : boolean;
	var _enableRunTimeTypeCheck : boolean;

	static function getReleaseOptimizationCommands() : string[] {
		return [
			"lto",
			"no-assert",
			"no-log",
			"no-debug",
			"staticize",
			"fold-const",
			"return-if",
			"inline",
			"dce",
			"unbox",
			"fold-const",
			"lcse",
			"dce",
			"fold-const",
			"array-length",
			"unclassify"
		];
	}

	function constructor () {
		this._compiler = null;
		this._commands = new _OptimizeCommand[];
		this._log = new string[];
		this._dumpLogs = false;
		this._enableRunTimeTypeCheck = true;
	}

	function setup (cmds : string[]) : Nullable.<string> {

		var calleesAreDetermined = false;
		function determineCallee () : void {
			if (! calleesAreDetermined) {
				this._commands.push(new _DetermineCalleeCommand());
				calleesAreDetermined = true;
			}
		}

		for (var i = 0; i < cmds.length; ++i) {
			var cmd = cmds[i];
			if (cmd == "lto") {
				this._commands.push(new _LinkTimeOptimizationCommand());
			} else if (cmd == "no-assert") {
				this._commands.push(new _NoAssertCommand());
			} else if (cmd == "no-log") {
				this._commands.push(new _NoLogCommand());
			} else if (cmd == "no-debug") {
				this._commands.push(new _NoDebugCommand());
			} else if (cmd == "strip") {
				this._commands.push(new _StripOptimizeCommand());
			} else if (cmd == "staticize") {
				this._commands.push(new _StaticizeOptimizeCommand());
				calleesAreDetermined = false;
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
	}

	function enableRuntimeTypeCheck () : boolean {
		return this._enableRunTimeTypeCheck;
	}

	function setEnableRunTimeTypeCheck (mode : boolean) : void {
		this._enableRunTimeTypeCheck = mode;
	}

	function setCompiler (compiler : Compiler) : Optimizer {
		this._compiler = compiler;
		return this;
	}

	function getCompiler () : Compiler {
		return this._compiler;
	}

	function performOptimization () : void {
		for (var i = 0; i < this._commands.length; ++i) {
			try {
				this.log("starting optimizer: " + this._commands[i]._identifier);
				this._commands[i].setup(this).performOptimization();
				this.log("finished optimizer: " + this._commands[i]._identifier);
			} catch (e : Error) {
				var platform = this._compiler.getPlatform();
				platform.error("fatal error: optimizer '" + this._commands[i]._identifier + "' died unexpectedly, dumping the logs");
				this.dumpLogs();
				throw e;
			}
		}
		if (this._dumpLogs)
			this.dumpLogs();
	}

	function log (message : string) : void {
		this._log.push(message);
	}

	function dumpLogs () : void {
		var platform = this._compiler.getPlatform();
		for (var i = 0; i < this._log.length; ++i) {
			platform.error(this._log[i]);
		}
	}

}

abstract class _OptimizeCommand {

	var _identifier : string;
	var _optimizer : Optimizer;

	function constructor (identifier : string) {
		this._identifier = identifier;
		this._optimizer = null;
	}

	function setup (optimizer : Optimizer) : _OptimizeCommand {
		this._optimizer = optimizer;
		return this;
	}

	function getCompiler () : Compiler {
		return this._optimizer.getCompiler();
	}

	abstract function performOptimization () : void;

	function getStash (stashable : Stashable) : Stash {
		var stash = stashable.getStash(this._identifier);
		if (stash == null) {
			stash = stashable.setStash(this._identifier, this._createStash());
		}
		return stash;
	}

	function _createStash () : Stash {
		throw new Error("if you are going to use the stash, you need to override this function");
	}

	function resetStash (stashable : Stashable) : void {
		stashable.setStash(this._identifier, null);
	}

	function createVar (funcDef : MemberFunctionDefinition, type : Type, baseName : string) : LocalVariable {
		var locals = funcDef.getLocals();
		function nameExists (n : string) : boolean {
			for (var i = 0; i < locals.length; ++i)
				if (locals[i].getName().getValue() == n)
					return true;
			return false;
		}
		for (var i = 0; nameExists(baseName + "$" + i as string); ++i)
			;
		var newLocal = new LocalVariable(new Token(baseName + "$" + i as string, false), type);
		locals.push(newLocal);
		this.log("rewriting " + baseName + " to " + newLocal.getName().getValue());
		return newLocal;
	}

	function log (message : string) : void {
		this._optimizer.log("[" + this._identifier + "] " + message);
	}

	function setupCommand (command : _OptimizeCommand) : _OptimizeCommand {
		command.setup(this._optimizer);
		return command;
	}

}

abstract class _FunctionOptimizeCommand extends _OptimizeCommand {

	var _excludeNative : boolean;

	function constructor (identifier : string) {
		super(identifier);
		this._excludeNative = false;
	}

	override function performOptimization () : void {
		function doit (funcDef : MemberFunctionDefinition) : void {
			this.log("starting optimization of " + funcDef.getNotation());
			this.optimizeFunction(funcDef);
			this.log("finished optimization of " + funcDef.getNotation());
		}
		this.getCompiler().forEachClassDef(function (parser, classDef) {
			classDef.forEachMember(function (member) {
				if (member instanceof MemberFunctionDefinition) {
					var funcDef = member as MemberFunctionDefinition;
					if (funcDef.getStatements() != null) {
						doit(funcDef);
					}
				}
				member.forEachClosure(function (funcDef) {
					doit(funcDef);
					return true;
				});
				return true;
			});
			return true;
		});
	}

	abstract function optimizeFunction (funcDef : MemberFunctionDefinition) : boolean ;

}

class _LinkTimeOptimizationCommand extends _OptimizeCommand {
	static const IDENTIFIER = "lto";

	class Stash extends Stash {

		var extendedBy : ClassDefinition[];

		function constructor () {
			this.extendedBy = new ClassDefinition[];
		}

		override function clone () : Stash {
			throw new Error("not supported");
		}

	}

	function constructor () {
		super(_LinkTimeOptimizationCommand.IDENTIFIER);
	}

	override function _createStash () : Stash {
		return new _LinkTimeOptimizationCommand.Stash();
	}

	override function performOptimization () : void {
		// set extendedBy for every class
		this.getCompiler().forEachClassDef(function (parser, classDef) {
			if (classDef.extendType() != null)
				(this.getStash(classDef.extendType().getClassDef()) as _LinkTimeOptimizationCommand.Stash).extendedBy.push(classDef);
			for (var i = 0; i < classDef.implementTypes().length; ++i)
				(this.getStash(classDef.implementTypes()[i].getClassDef()) as _LinkTimeOptimizationCommand.Stash).extendedBy.push(classDef);
			return true;
		});
		// mark classes / functions that are not derived / overridden / exported as final
		this.getCompiler().forEachClassDef(function (parser, classDef) {

			if ((classDef.flags() & (ClassDefinition.IS_INTERFACE | ClassDefinition.IS_MIXIN | ClassDefinition.IS_NATIVE | ClassDefinition.IS_FINAL | ClassDefinition.IS_EXPORT)) == 0
				&& (this.getStash(classDef) as _LinkTimeOptimizationCommand.Stash).extendedBy.length == 0) {

					// found a class that is not extended, mark it and its functions as final
					this.log("marking class as final: " + classDef.className());
					classDef.setFlags(classDef.flags() | ClassDefinition.IS_FINAL);
					classDef.forEachMemberFunction(function (funcDef) {
						if ((funcDef.flags() & (ClassDefinition.IS_STATIC | ClassDefinition.IS_FINAL)) == 0)
							funcDef.setFlags(funcDef.flags() | ClassDefinition.IS_FINAL);
						return true;
					});

				} else if ((classDef.flags() & (ClassDefinition.IS_NATIVE | ClassDefinition.IS_FINAL)) == 0) {

					// adjust flags of functions
					classDef.forEachMemberFunction(function (funcDef) {
						if ((funcDef.flags() & (ClassDefinition.IS_STATIC | ClassDefinition.IS_NATIVE | ClassDefinition.IS_FINAL)) != 0) {
							// ignore static, native, or final functions
						} else if ((funcDef.flags() & ClassDefinition.IS_ABSTRACT) == 0) {
							// mark functions that are not being overridden as final
							if (funcDef.getStatements() == null)
								throw new Error("a non-native, non-abstract function with out function body?");
							var overrides = this._getOverrides(classDef, (this.getStash(classDef) as _LinkTimeOptimizationCommand.Stash).extendedBy, funcDef.name(), funcDef.getArgumentTypes());
							if (overrides.length == 0) {
								this.log("marking function as final: " + funcDef.getNotation());
								funcDef.setFlags(funcDef.flags() | ClassDefinition.IS_FINAL);
							} else {
								this.log("function has overrides, not marking as final: " + funcDef.getNotation());
							}
						} else if ((funcDef.flags() & ClassDefinition.IS_ABSTRACT) != 0) {
							/*
							  FIXME determine if there is only one implementation, and if so, inline the calls to the function.
							  Note that  the implementation of the function may exist in the base classes of one of the classes that
							  implement the interface, or in the mixins that are implemented by the extending class.
							*/
						}
						return true;
					});
				}

			return true;

		});
	}

	function _getOverrides (srcClassDef : ClassDefinition, classDefs : ClassDefinition[], name : string, argTypes : Type[]) : MemberFunctionDefinition[] {
		var overrides = new MemberFunctionDefinition[];
		for (var i = 0; i < classDefs.length; ++i)
			overrides = overrides.concat(this._getOverridesByClass(srcClassDef, classDefs[i], name, argTypes));
		return overrides;
	}

	function _getOverridesByClass (srcClassDef : ClassDefinition, classDef : ClassDefinition, name : string, argTypes : Type[]) : MemberFunctionDefinition[] {
		var overrides = this._getOverrides(srcClassDef, (this.getStash(classDef) as _LinkTimeOptimizationCommand.Stash).extendedBy, name, argTypes);
		function addOverride (funcDef : MemberFunctionDefinition) : boolean {
			if (funcDef.name() == name
				&& (funcDef.flags() & ClassDefinition.IS_ABSTRACT) == 0
				&& Util.typesAreEqual(funcDef.getArgumentTypes(), argTypes)) {
					overrides.push(funcDef);
					return false; // finish looking into the class
				}
			return true;
		}
		classDef.forEachMemberFunction(addOverride);
		var implementClassDefs = classDef.implementTypes().map.<ClassDefinition>(function (type) { return type.getClassDef(); });
		for (var i = 0; i < implementClassDefs.length; ++i) {
			if (srcClassDef != implementClassDefs[i]) {
				implementClassDefs[i].forEachClassToBase(function (classDef) {
					return classDef.forEachMemberFunction(addOverride);
				});
			}
		}
		return overrides;
	}

}

class _StripOptimizeCommand extends _OptimizeCommand {
	static const IDENTIFIER = "strip";

	class _Stash extends Stash {
		var touched = false;
		override function clone() : Stash {
			throw new Error("not supported");
		}
	}

	var _classesInstantiated = new ClassDefinition[];
	var _methodsAlive = new Map.<Type[][]>;
	var _membersToWalk = new MemberDefinition[];

	function constructor() {
		super(_StripOptimizeCommand.IDENTIFIER);
	}

	override function _createStash() : Stash {
		return new _StripOptimizeCommand._Stash();
	}

	function _touchStatic(member : MemberDefinition) : void {
		assert (member.flags() & ClassDefinition.IS_STATIC) != 0;
		var stash = this.getStash(member) as _StripOptimizeCommand._Stash;
		if (stash.touched)
			return;
		this.log("touched " + member.getNotation());
		stash.touched = true;
		this._membersToWalk.push(member);
	}

	function _touchInstance(classDef : ClassDefinition) : void {
		var stash = this.getStash(classDef) as _StripOptimizeCommand._Stash;
		if (stash.touched)
			return;
		this.log("touched " + classDef.className());
		stash.touched = true;
		this._classesInstantiated.push(classDef);
		for (var name in this._methodsAlive) {
			var listOfArgTypes = this._methodsAlive[name];
			for (var i = 0; i != listOfArgTypes.length; ++i) {
				var funcDef = Util.findFunctionInClass(classDef, name, listOfArgTypes[i], false);
				if (funcDef != null) {
					this._membersToWalk.push(funcDef);
				}
			}
		}
		if (classDef.extendType() != null) {
			this._touchInstance(classDef.extendType().getClassDef());
		}
		classDef.implementTypes().forEach(function (implementType) {
			this._touchInstance(implementType.getClassDef());
		});
	}

	function _touchConstructor(funcDef : MemberFunctionDefinition) : void {
		assert funcDef.name() == "constructor";
		assert (funcDef.flags() & ClassDefinition.IS_STATIC) == 0;
		var stash = this.getStash(funcDef) as _StripOptimizeCommand._Stash;
		if (stash.touched)
			return;
		this.log("touched " + funcDef.getNotation());
		stash.touched = true;
		this._membersToWalk.push(funcDef);
		this._touchInstance(funcDef.getClassDef());
	}

	function _touchMethod(name : string, argTypes : Type[]) : void {
		if (this._methodsAlive.hasOwnProperty(name)) {
			var listOfArgTypes = this._methodsAlive[name];
		} else {
			listOfArgTypes = this._methodsAlive[name] = new Type[][];
		}
		for (var i = 0; i < listOfArgTypes.length; ++i) {
			if (Util.typesAreEqual(listOfArgTypes[i], argTypes)) {
				return; // already touched
			}
		}
		// push
		this.log("touched #" + name);
		listOfArgTypes.push(argTypes.concat());
		for (var i = 0; i < this._classesInstantiated.length; ++i) {
			var funcDef = Util.findFunctionInClass(this._classesInstantiated[i], name, argTypes, false);
			if (funcDef != null) {
				this._membersToWalk.push(funcDef);
			}
		}
	}

	override function performOptimization() : void {
		function isEmittedClass(classDef : ClassDefinition) : boolean {
			if (classDef instanceof TemplateClassDefinition) {
				return false;
			}
			if ((classDef.flags() & ClassDefinition.IS_NATIVE) != 0) {
				return false;
			}
			return true;
		}
		// reset stash
		this.getCompiler().forEachClassDef(function (parser, classDef) {
			this.resetStash(classDef);
			return classDef.forEachMember(function (member) {
				this.resetStash(member);
				return true;
			});
		});
		// all non-final native methods should be preserved in the instantiated classes
		this.getCompiler().forEachClassDef(function (parser, classDef) {
			if (! (classDef instanceof TemplateClassDefinition)
				&& (classDef.flags() & ClassDefinition.IS_NATIVE) != 0) {
				classDef.forEachMemberFunction(function (funcDef) {
					if (funcDef.name() == "constructor") {
						// skip
					} else if ((funcDef.flags() & ClassDefinition.IS_FINAL) != 0) {
						// skip
					} else {
						this._touchMethod(funcDef.name(), funcDef.getArgumentTypes());
					}
					return true;
				});
			}
			return true;
		});
		// push all exported members
		this.getCompiler().forEachClassDef(function (parser, classDef) {
			if (isEmittedClass(classDef)) {
				if ((classDef.flags() & ClassDefinition.IS_EXPORT) != 0) {
					this._touchInstance(classDef);
				}
				classDef.forEachMember(function (member) {
					if ((member.flags() & ClassDefinition.IS_EXPORT) != 0) {
						if ((member.flags() & ClassDefinition.IS_STATIC) != 0) {
							this._touchStatic(member);
						} else if (member instanceof MemberFunctionDefinition) {
							var funcDef = member as MemberFunctionDefinition;
							if (funcDef.name() == "constructor") {
								this._touchConstructor(funcDef);
							} else {
								this._touchMethod(funcDef.name(), funcDef.getArgumentTypes());
							}
						}
					}
					return true;
				});
			}
			return true;
		});
		// check all members
		while (this._membersToWalk.length != 0) {
			var member = this._membersToWalk.shift();
			this.log("walking " + member.getNotation());
			if (member instanceof MemberFunctionDefinition) {
				this._walkFunctionDefinition(member as MemberFunctionDefinition);
			} else {
				this._walkVariableDefinition(member as MemberVariableDefinition);
			}
		}
		// remove things that aren't used
		function memberShouldPreserve(member : MemberDefinition) : boolean {
			if ((member.flags() & ClassDefinition.IS_EXPORT) != 0) {
				return true;
			}
			var isTouched = (this.getStash(member) as _StripOptimizeCommand._Stash).touched;
			if ((member.flags() & ClassDefinition.IS_STATIC) != 0) {
				return isTouched;
			} else if (member instanceof MemberFunctionDefinition) {
				if (member.name() == "constructor") {
					return isTouched;
				} else {
					if ((this.getStash(member.getClassDef()) as _StripOptimizeCommand._Stash).touched
						&& this._methodsAlive.hasOwnProperty(member.name())) {
						var listOfArgTypes = this._methodsAlive[member.name()];
						for (var i = 0; i != listOfArgTypes.length; ++i) {
							if (Util.typesAreEqual(listOfArgTypes[i], (member as MemberFunctionDefinition).getArgumentTypes())) {
								return true;
							}
						}
					}
					return false;
				}
			}
			return true;
		}
		this.getCompiler().forEachClassDef(function (parser, classDef) {
			if (isEmittedClass(classDef)) {
				var numConstructors = 0;
				var members = classDef.members();
				for (var memberIndex = 0; memberIndex != members.length;) {
					var member = members[memberIndex];
					if (memberShouldPreserve(member)) {
						if (member instanceof MemberFunctionDefinition
							&& (member.flags() & ClassDefinition.IS_STATIC) == 0
							&& member.name() == "constructor") {
							++numConstructors;
						}
						++memberIndex;
						this.log("preserving used: " + member.getNotation());
					} else {
						this.log("removing unused: " + member.getNotation());
						members.splice(memberIndex, 1);
					}
				}
				if (numConstructors == 0) {
					// create a fake constructor (should never get called; TODO leave as is, emit "{}" in jsemitter upon facing a class wo. any ctors)
					// the reason for not deleting the entire class is because it could be referred to by "instanceof"
					this.log("substituting fake constructor for class: " + classDef.className());
					var ctor = new MemberFunctionDefinition(
						null,
						new Token("constructor", true),
						ClassDefinition.IS_FINAL | (classDef.flags() & ClassDefinition.IS_EXPORT),
						Type.voidType,
						new ArgumentDeclaration[],
						new LocalVariable[],
						new Statement[],
						new MemberFunctionDefinition[],
						classDef.getToken(), /* FIXME */
						null);
					ctor.setClassDef(classDef);
					members.push(ctor);
				}
			}
			return true;
		});
		// remove unused native classes (with nativeSource)
		this.getCompiler().getParsers().forEach(function (parser) {
			var classDefs = parser.getClassDefs();
			for (var i = 0; i != classDefs.length;) {
				var preserve = true;
				if ((classDefs[i].flags() & ClassDefinition.IS_NATIVE) != 0
					&& classDefs[i].getNativeSource() != null
					&& ! (this.getStash(classDefs[i]) as _StripOptimizeCommand._Stash).touched
					&& classDefs[i].forEachMember(function (member) {
						if ((member.flags() & ClassDefinition.IS_STATIC) == 0)
							return true;
						return ! (this.getStash(member) as _StripOptimizeCommand._Stash).touched;
					})) {
					preserve = false;
				}
				if (preserve) {
					++i;
				} else {
					this.log("removing unused native class: " + classDefs[i].className());
					classDefs.splice(i, 1);
				}
			}
		});
	}

	function _walkExpression(expr : Expression) : boolean {
		function onExpr(expr : Expression) : boolean {
			if (expr instanceof NewExpression) {
				var callee = Util.findFunctionInClass(expr.getType().getClassDef(), "constructor", (expr as NewExpression).getConstructor().getArgumentTypes(), false);
				assert callee != null;
				this._touchConstructor(callee);
			} else if (expr instanceof InstanceofExpression) {
				this._touchInstance((expr as InstanceofExpression).getExpectedType().getClassDef());
			} else if (expr instanceof AsExpression) {
				if (expr.getType() instanceof ObjectType) {
					this._touchInstance(expr.getType().getClassDef());
				}
			} else if (expr instanceof AsNoConvertExpression) {
				if (expr.getType() instanceof ObjectType) {
					this._touchInstance(expr.getType().getClassDef());
				}
			} else if (expr instanceof PropertyExpression) {
				if (! expr.isClassSpecifier()) {
					var propertyExpr = expr as PropertyExpression;
					var name = propertyExpr.getIdentifierToken().getValue();
					if (propertyExpr.getExpr().isClassSpecifier()) {
						if (Util.isReferringToFunctionDefinition(propertyExpr)) {
							var member : MemberDefinition = Util.findFunctionInClass(
								propertyExpr.getHolderType().getClassDef(),
								name,
								(expr.getType() as ResolvedFunctionType).getArgumentTypes(),
								true);
							assert member != null;
						} else {
							member = Util.findVariableInClass(propertyExpr.getHolderType().getClassDef(), name, true);
							assert member != null;
						}
						this._touchStatic(member);
					} else {
						if (Util.isReferringToFunctionDefinition(propertyExpr)) {
							this._touchMethod(name, (expr.getType() as ResolvedFunctionType).getArgumentTypes());
						}
					}
				}
			} else if (expr instanceof SuperExpression) {
				var superExpr = expr as SuperExpression;
				this._touchMethod(superExpr.getName().getValue(), (superExpr.getFunctionType() as ResolvedFunctionType).getArgumentTypes());
			}
			return expr.forEachExpression(onExpr);
		}
		return onExpr(expr);
	}

	function _walkStatement(statement : Statement) : boolean {
		function onStatement(statement : Statement) : boolean {
			if (statement instanceof ConstructorInvocationStatement) {
				var ctorStatement = statement as ConstructorInvocationStatement;
				var callee = Util.findFunctionInClass(
					ctorStatement.getConstructingClassDef(),
					"constructor",
					(ctorStatement.getConstructorType() as ResolvedFunctionType).getArgumentTypes(),
					false);
				assert callee != null;
				this._touchConstructor(callee);
			}
			statement.forEachExpression(function (expr) {
				return this._walkExpression(expr);
			});
			return statement.forEachStatement(onStatement);
		}
		return onStatement(statement);
	}

	function _walkFunctionDefinition(funcDef : MemberFunctionDefinition) : boolean {
		if (funcDef.getStatements() != null) {
			funcDef.forEachStatement(function onStatement(statement) {
				return this._walkStatement(statement);
			});
		}
		return funcDef.forEachClosure(function (funcDef) {
			return this._walkFunctionDefinition(funcDef);
		});
	}

	function _walkVariableDefinition(varDef : MemberVariableDefinition) : boolean {
		var initialValue = varDef.getInitialValue();
		if (initialValue != null) {
			this._walkExpression(initialValue);
		}
		return varDef.forEachClosure(function (funcDef) {
			return this._walkFunctionDefinition(funcDef);
		});
	}

}

class _NoAssertCommand extends _FunctionOptimizeCommand {
	static const IDENTIFIER = "no-assert";

	function constructor () {
		super(_NoAssertCommand.IDENTIFIER);
	}

	override function optimizeFunction (funcDef : MemberFunctionDefinition) : boolean {
		this._optimizeStatements(funcDef.getStatements());
		return true;
	}

	function _optimizeStatements (statements : Statement[]) : void {
		function optimize (statements : Statement[]) : boolean {
			for (var i = 0; i < statements.length;) {
				if (statements[i] instanceof AssertStatement) {
					statements.splice(i, 1);
				} else {
					_Util.handleSubStatements(optimize, statements[i]);
					++i;
				}
			}
			return false;
		}
		optimize(statements);
	}

}

// CONVERSION ERROR: wrong name for exporting: _NoLogCommand and _NoAssertCommand
class _NoLogCommand extends _FunctionOptimizeCommand {
	static const IDENTIFIER = "no-log";

	function constructor () {
		super(_NoLogCommand.IDENTIFIER);
	}

	override function optimizeFunction (funcDef : MemberFunctionDefinition) : boolean {
		this._optimizeStatements(funcDef.getStatements());
		return true;
	}

	function _optimizeStatements (statements : Statement[]) : void {
		function optimize (statements : Statement[]) : boolean {
			for (var i = 0; i < statements.length;) {
				if (statements[i] instanceof LogStatement) {
					statements.splice(i, 1);
				} else {
					_Util.handleSubStatements(optimize, statements[i]);
					++i;
				}
			}
			return false;
		}
		optimize(statements);
	}

}


class _DetermineCalleeCommand extends _FunctionOptimizeCommand {
	static const IDENTIFIER = "determine-callee";

	class Stash extends Stash {

		var callingFuncDef : MemberFunctionDefinition;

		function constructor () {
			this.callingFuncDef = null;
		}

		function constructor (that : _DetermineCalleeCommand.Stash) {
			this.callingFuncDef = that.callingFuncDef;
		}

		override function clone () : Stash {
			return new _DetermineCalleeCommand.Stash(this);
		}

	}

	function constructor () {
		super(_DetermineCalleeCommand.IDENTIFIER);
	}

	override function _createStash () : Stash {
		return new _DetermineCalleeCommand.Stash();
	}

	override function optimizeFunction (funcDef : MemberFunctionDefinition) : boolean {
		funcDef.forEachStatement(function onStatement(statement : Statement) : boolean {

			if (statement instanceof ConstructorInvocationStatement) {
				// invocation of super-class ctor
				var callingFuncDef = _DetermineCalleeCommand.findCallingFunctionInClass(
					(statement as ConstructorInvocationStatement).getConstructingClassDef(),
					"constructor",
					((statement as ConstructorInvocationStatement).getConstructorType() as ResolvedFunctionType).getArgumentTypes(),
					false);
				if (callingFuncDef == null)
					throw new Error("could not determine the associated parent ctor");
				this._setCallingFuncDef(statement, callingFuncDef);
			} else if (statement instanceof FunctionStatement) {
				(statement as FunctionStatement).getFuncDef().forEachStatement(onStatement);
			}

			statement.forEachExpression(function onExpr(expr : Expression) : boolean {
				if (expr instanceof CallExpression) {
					// call expression
					var calleeExpr = (expr as CallExpression).getExpr();
					if (calleeExpr instanceof PropertyExpression && ! (calleeExpr as PropertyExpression).getType().isAssignable()) {
						var propertyExpr = calleeExpr as PropertyExpression;
						// is referring to function (not a value of function type)
						var holderType = propertyExpr.getHolderType();
						var callingFuncDef = _DetermineCalleeCommand.findCallingFunction(
							holderType.getClassDef(),
							propertyExpr.getIdentifierToken().getValue(),
							(propertyExpr.getType() as ResolvedFunctionType).getArgumentTypes(),
							propertyExpr.getExpr().isClassSpecifier());
						this._setCallingFuncDef(expr, callingFuncDef);
					} else if (calleeExpr instanceof FunctionExpression) {
						this._setCallingFuncDef(expr, (calleeExpr as FunctionExpression).getFuncDef());
					} else {
						this._setCallingFuncDef(expr, null);
					}
				} else if (expr instanceof NewExpression) {
					var callingFuncDef = _DetermineCalleeCommand.findCallingFunctionInClass(
						(expr as NewExpression).getType().getClassDef(), "constructor", (expr as NewExpression).getConstructor().getArgumentTypes(), false);
					if (callingFuncDef == null) {
						throw new Error("could not find matching constructor for " + (expr as NewExpression).getConstructor().toString());
					}
					this._setCallingFuncDef(expr as NewExpression, callingFuncDef);
				}
				if (expr instanceof FunctionExpression) {
					return (expr as FunctionExpression).getFuncDef().forEachStatement(onStatement);
				} else {
					return expr.forEachExpression(onExpr);
				}
			});

			return statement.forEachStatement(onStatement);
		});
		return true;
	}

	function _setCallingFuncDef (stashable : Stashable, funcDef : MemberFunctionDefinition) : void {
		(this.getStash(stashable) as _DetermineCalleeCommand.Stash).callingFuncDef = funcDef;
	}

	static function findCallingFunctionInClass (classDef : ClassDefinition, funcName : string, argTypes : Type[], isStatic : boolean) : MemberFunctionDefinition {
		var found = Util.findFunctionInClass(classDef, funcName, argTypes, isStatic);
		// only return if the found function is final
		if (found != null) {
			if ((found.flags() & (ClassDefinition.IS_STATIC | ClassDefinition.IS_FINAL)) == 0)
				found = null;
		}
		return found;
	}

	static function findCallingFunction (classDef : ClassDefinition, funcName : string, argTypes : Type[], isStatic : boolean) : MemberFunctionDefinition {
		var found = null : MemberFunctionDefinition;
		// find the first declaration
		classDef.forEachClassToBase(function (classDef) {
			if ((found = _DetermineCalleeCommand.findCallingFunctionInClass(classDef, funcName, argTypes, isStatic)) != null)
				return false;
			return true;
		});
		return found;
	}

	static function getCallingFuncDef (stashable : Stashable) : MemberFunctionDefinition {
		var stash = stashable.getStash(_DetermineCalleeCommand.IDENTIFIER) as _DetermineCalleeCommand.Stash;
		if (stash == null)
			throw new Error("callee not searched");
		return stash.callingFuncDef;
	}

}

class _StaticizeOptimizeCommand extends _OptimizeCommand {

	static const IDENTIFIER = "staticize";

	function constructor () {
		super(_StaticizeOptimizeCommand.IDENTIFIER);
	}

	class Stash extends Stash {

		var altName : Nullable.<string>;

		function constructor () {
			this.altName = null;
		}

		function constructor (that : _StaticizeOptimizeCommand.Stash) {
			this.altName = that.altName;
		}

		override function clone () : _StaticizeOptimizeCommand.Stash {
			return new _StaticizeOptimizeCommand.Stash(this);
		}

	}

	override function _createStash () : Stash {
		return new _StaticizeOptimizeCommand.Stash();
	}

	override function performOptimization () : void {

		function memberCanBeStaticized(funcDef : MemberFunctionDefinition) : boolean {
			return (funcDef.flags() & (ClassDefinition.IS_OVERRIDE | ClassDefinition.IS_ABSTRACT | ClassDefinition.IS_FINAL | ClassDefinition.IS_STATIC | ClassDefinition.IS_NATIVE)) == ClassDefinition.IS_FINAL
				&& funcDef.name() != "constructor";
		}

		this.getCompiler().forEachClassDef(function (parser, classDef) {
			// skip interfaces and mixins
			if ((classDef.flags() & (ClassDefinition.IS_INTERFACE | ClassDefinition.IS_MIXIN)) != 0)
				return true;
			// convert function definitions (expect constructor) to static
			classDef.forEachMemberFunction(function onFunction(funcDef : MemberFunctionDefinition) : boolean {
				if (memberCanBeStaticized(funcDef)) {
					this.log("staticizing method: " + funcDef.name());
					this._staticizeMethod(funcDef);
				}
				return true;
			});
			return true;
		});
		// rewrite member method invocations to static function calls
		this.getCompiler().forEachClassDef(function (parser, classDef) {
			this.log("rewriting member method calls in class: " + classDef.className());
			// rewrite member variables
			classDef.forEachMemberVariable(function (varDef) {
				if (varDef.getInitialValue() == null)
					return true;

				this._rewriteMethodCallsToStatic(varDef.getInitialValue(), function (expr) {
					varDef.setInitialValue(expr);
				}, null);
				return true;
			});
			// rewrite member functions
			function onFunction (funcDef : MemberFunctionDefinition) : boolean {
				function onStatement (statement : Statement) : boolean {
					statement.forEachExpression(function (expr, replaceCb) {
						this._rewriteMethodCallsToStatic(expr, replaceCb, funcDef);
						return true;
					});
					return statement.forEachStatement(onStatement);
				}
				funcDef.forEachStatement(onStatement);
				return funcDef.forEachClosure(onFunction);
			}
			classDef.forEachMemberFunction(onFunction);
			return true;
		});
	}

	function _staticizeMethod (funcDef : MemberFunctionDefinition) : void {
		var staticFuncDef = funcDef.clone();

		// register to the classDef
		var classDef = funcDef.getClassDef();
		staticFuncDef.setClassDef(classDef);
		classDef._members.splice(classDef._members.indexOf(funcDef)+1, 0, staticFuncDef); // insert right after the original function

		// rename
		var newName = this._findFrechFunctionName(classDef, funcDef.name(), ([ new ObjectType(classDef) ] : Type[]).concat((funcDef.getType() as ResolvedFunctionType).getArgumentTypes()), true);
		(this.getStash(funcDef) as _StaticizeOptimizeCommand.Stash).altName = newName;
		staticFuncDef._nameToken = new Token(newName, true);

		// update flags
		staticFuncDef.setFlags(funcDef.flags() | ClassDefinition.IS_STATIC);

		// first argument should be this
		var thisArg = new ArgumentDeclaration(new Token("$this", false), new ObjectType(classDef));
		staticFuncDef.getArguments().unshift(thisArg);
		// rewrite this
		staticFuncDef.forEachStatement(function onStatement(statement : Statement) : boolean {
			if (statement instanceof FunctionStatement) {
				(statement as FunctionStatement).getFuncDef().forEachStatement(onStatement);
			}
			return statement.forEachExpression(function onExpr(expr : Expression, replaceCb : function(:Expression):void) : boolean {
				if (expr instanceof ThisExpression) {
					replaceCb(new LocalExpression(thisArg.getName(), thisArg));
				} else if (expr instanceof FunctionExpression) {
					return (expr as FunctionExpression).getFuncDef().forEachStatement(onStatement);
				}
				return expr.forEachExpression(onExpr);
			}) && statement.forEachStatement(onStatement);
		});
	}

	function _findFrechFunctionName (classDef : ClassDefinition, baseName : string, argTypes : Type[], isStatic : boolean) : string {
		var index = 0;
		// search for a name which does not conflict with existing function
		do {
			var newName = Util.format("%1_%2", [ baseName, index as string ]);
			++index;
		} while (Util.findFunctionInClass(classDef, newName, argTypes, isStatic) != null);

		return newName;
	}

	function _rewriteMethodCallsToStatic (expr : Expression, replaceCb : function(:Expression):void, rewritingFuncDef : MemberFunctionDefinition) : void {
		function onExpr(expr : Expression, replaceCb : function(:Expression):void) : boolean {
			if (expr instanceof CallExpression) {
				var calleeExpr = (expr as CallExpression).getExpr();
				if (calleeExpr instanceof PropertyExpression
				    && ! ((calleeExpr as PropertyExpression).getExpr().isClassSpecifier())
					&& ! (calleeExpr as PropertyExpression).getType().isAssignable()) {
						var propertyExpr = calleeExpr as PropertyExpression;
						// is a member method call
						var receiverType = propertyExpr.getExpr().getType().resolveIfNullable();
						// skip interfaces and mixins
						if ((receiverType.getClassDef().flags() & (ClassDefinition.IS_INTERFACE | ClassDefinition.IS_MIXIN)) == 0) {
							var funcDef = this._findFunctionInClassTree(receiverType.getClassDef(), propertyExpr.getIdentifierToken().getValue(), (propertyExpr.getType() as ResolvedFunctionType).getArgumentTypes(), false);
							// funcDef is staticized
							var newName;
							if (funcDef != null && (newName = (this.getStash(funcDef) as _StaticizeOptimizeCommand.Stash).altName) != null) {
								// found, rewrite
								onExpr(propertyExpr.getExpr(), function (expr) {
									propertyExpr.setExpr(expr);
								});
								Util.forEachExpression(onExpr, (expr as CallExpression).getArguments());
								replaceCb(
									new CallExpression(
										expr.getToken(),
										new PropertyExpression(
											propertyExpr.getToken(),
											new ClassExpression(new Token(funcDef.getClassDef().className(), true), new ObjectType(funcDef.getClassDef())),
											new Token(newName, true),
											propertyExpr.getTypeArguments(),
											new StaticFunctionType(null, (funcDef.getType() as ResolvedFunctionType).getReturnType(), ([ new ObjectType(funcDef.getClassDef()) ] : Type[]).concat((funcDef.getType() as ResolvedFunctionType).getArgumentTypes()), false)),
										[ propertyExpr.getExpr() ].concat((expr as CallExpression).getArguments())));
								return true;
							}
						}
					}
			} else if (expr instanceof SuperExpression) {
				var superExpr = expr as SuperExpression;
				var classDef = superExpr.getFunctionType().getObjectType().getClassDef();
				funcDef = this._findFunctionInClassTree(classDef, superExpr.getName().getValue(), (superExpr.getFunctionType() as ResolvedFunctionType).getArgumentTypes(), false);
				// funcDef is staticized
				if (funcDef != null && (newName = (this.getStash(funcDef) as _StaticizeOptimizeCommand.Stash).altName) != null) {
					// found, rewrite
					Util.forEachExpression(onExpr, superExpr.getArguments());
					var thisVar : Expression;
					if ((rewritingFuncDef.flags() & ClassDefinition.IS_STATIC) != 0) {
						// super expression in static function means that the function has been staticized
						var thisArg = rewritingFuncDef.getArguments()[0];
						thisVar = new LocalExpression(thisArg.getName(), thisArg);
					} else {
						thisVar = new ThisExpression(new Token("this", false), funcDef.getClassDef());
					}
					replaceCb(
						new CallExpression(
							expr.getToken(),
							new PropertyExpression(
								superExpr.getToken(),
								new ClassExpression(new Token(funcDef.getClassDef().className(), true), new ObjectType(funcDef.getClassDef())),
								new Token(newName, true),
								[], // type args
								new StaticFunctionType(null, (funcDef.getType() as ResolvedFunctionType).getReturnType(), ([ new ObjectType(funcDef.getClassDef()) ] : Type[]).concat((funcDef.getType() as ResolvedFunctionType).getArgumentTypes()), false)),
							[ thisVar ].concat(superExpr.getArguments())));
					return true;
				}
			}
			return expr.forEachExpression(onExpr);
		}
		onExpr(expr, replaceCb);
	}

	function _findFunctionInClassTree (classDef : ClassDefinition, name : string, argTypes : Type[], isStatic : boolean) : MemberFunctionDefinition {
		var funcDef;
		while (classDef.className() != "Object") {
			if ((funcDef = Util.findFunctionInClass(classDef, name, argTypes, isStatic)) != null) {
				return funcDef;
			}
			classDef = classDef.extendType().getClassDef();
		}
		return Util.findFunctionInClass(classDef, name, argTypes, isStatic);
	}

}

class _UnclassifyOptimizationCommand extends _OptimizeCommand {

	static const IDENTIFIER = "unclassify";

	function constructor () {
		super(_UnclassifyOptimizationCommand.IDENTIFIER);
	}

	class Stash extends Stash {

		var inliner : function(:NewExpression):Expression[];

		function constructor () {
			this.inliner = null;
		}

		function constructor (that : _UnclassifyOptimizationCommand.Stash) {
			this.inliner = that.inliner;
		}

		override function clone () : _UnclassifyOptimizationCommand.Stash {
			return new _UnclassifyOptimizationCommand.Stash(this);
		}

	}

	override function _createStash () : Stash {
		return new _UnclassifyOptimizationCommand.Stash();
	}

	override function performOptimization () : void {
		var classDefs = this._getClassesToUnclassify();
		classDefs.forEach(function (classDef : ClassDefinition) : void {
			// convert function definitions (expect constructor) to static
			this.log("unclassifying class: " + classDef.className());
			classDef.forEachMemberFunction(function onFunction(funcDef : MemberFunctionDefinition) : boolean {
				if ((funcDef.flags() & ClassDefinition.IS_STATIC) == 0 && funcDef.name() != "constructor") {
					this.log("rewriting method to static function: " + funcDef.name());
					this._rewriteFunctionAsStatic(funcDef);
				}
				return true;
			});
		});
		// rewrite member method invocations to static function calls
		this.getCompiler().forEachClassDef(function (parser, classDef) {
			this.log("rewriting member method calls in class: " + classDef.className());
			// rewrite member functions
			function onFunction (funcDef : MemberFunctionDefinition) : boolean {
				function onStatement (statement : Statement) : boolean {
					statement.forEachExpression(function (expr, replaceCb) {
						this._rewriteMethodCallsToStatic(expr, replaceCb, classDefs);
						return true;
					});
					return statement.forEachStatement(onStatement);
				}
				funcDef.forEachStatement(onStatement);
				return funcDef.forEachClosure(onFunction);
			}
			classDef.forEachMemberFunction(onFunction);
			// rewrite static variable initialization
			classDef.forEachMemberVariable(function (varDef : MemberVariableDefinition) : boolean {
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
				return varDef.forEachClosure(onFunction);
			});
			return true;
		});
	}

	function _getClassesToUnclassify () : ClassDefinition[] {
		var candidates = new ClassDefinition[];
		// list final classes extended from Object that has no overrides
		this.getCompiler().forEachClassDef(function (parser, classDef) {
			if ((classDef.flags() & (ClassDefinition.IS_FINAL | ClassDefinition.IS_NATIVE | ClassDefinition.IS_EXPORT)) == ClassDefinition.IS_FINAL
				&& classDef.extendType().getClassDef().className() == "Object"
				&& classDef.implementTypes().length == 0
				&& classDef.forEachMemberFunction(function (funcDef) {
					return (funcDef.flags() & (ClassDefinition.IS_OVERRIDE | ClassDefinition.IS_EXPORT)) == 0;
				})) {
					candidates.push(classDef);
				}
			return true;
		});
		// check that the class is not referred to by: instanceof
		this.getCompiler().forEachClassDef(function (parser : Parser, classDef : ClassDefinition) : boolean {
			if (candidates.length == 0) {
				return false;
			}
			function onExpr(expr : Expression) : boolean {
				assert expr != null;
				if (expr instanceof InstanceofExpression) {
					var foundClassDefIndex = candidates.indexOf((expr as InstanceofExpression).getExpectedType().getClassDef());
					if (foundClassDefIndex != -1) {
						candidates.splice(foundClassDefIndex, 1);
						if (candidates.length == 0) {
							return false;
						}
					}
				}
				else if (expr instanceof AsExpression && expr.getType() instanceof ObjectType) {
					var foundClassDefIndex = candidates.indexOf(expr.getType().getClassDef());
					if (foundClassDefIndex != -1) {
						candidates.splice(foundClassDefIndex, 1);
						if (candidates.length == 0) {
							return false;
						}
					}
				}
				return expr.forEachExpression(onExpr);
			}
			function onFunction(funcDef : MemberFunctionDefinition) : boolean {
				funcDef.forEachStatement(function onStatement(statement : Statement) : boolean {
					statement.forEachExpression(onExpr);
					return statement.forEachStatement(onStatement);
				});
				return funcDef.forEachClosure(onFunction);
			}
			classDef.forEachMemberFunction(onFunction);
			classDef.forEachMemberVariable(function (varDef : MemberVariableDefinition) : boolean {
				if ((varDef.flags() & ClassDefinition.IS_STATIC) != 0) {
					if (varDef.getInitialValue() != null) {
						onExpr(varDef.getInitialValue());
					}
				}
				return varDef.forEachClosure(onFunction);
			});
			return true;
		});
		// mark constructors that are inlineable
		for (var candidateIndex = candidates.length - 1; candidateIndex >= 0; --candidateIndex) {
			var hasInlineableCtor = false;
			candidates[candidateIndex].forEachMemberFunction(function (funcDef) {
				if ((funcDef.flags() & ClassDefinition.IS_STATIC) == 0 && funcDef.name() == "constructor") {
					var inliner = this._createInliner(funcDef);
					this.log(funcDef.getNotation() + " is" + (inliner ? "" : " not") + " inlineable");
					if (inliner) {
						(this.getStash(funcDef) as _UnclassifyOptimizationCommand.Stash).inliner = inliner;
						hasInlineableCtor = true;
					}
				}
				return true;
			});
			if (! hasInlineableCtor) {
				candidates.splice(candidateIndex, 1);
			}
		}
		if (candidates.length == 0) {
			return candidates;
		}
		return candidates;
	}

	function _createInliner (funcDef : MemberFunctionDefinition) : function(:NewExpression):Expression[] {
		if (funcDef.getLocals().length != 0) {
			return null;
		}
		var propertyNames = new string[];
		funcDef.getClassDef().forEachMemberVariable(function (member) {
			if ((member.flags() & ClassDefinition.IS_STATIC) == 0) {
				propertyNames.push(member.name());
			}
			return true;
		});
		// only optimize the most simple form, the repetition of "this.foo = argN" that can be arranged to the order of properties (and in the order of arguments)
		var propertyExprs = new Expression[];
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
			var statementExpr = (statements[statementIndex] as ExpressionStatement).getExpr();
			if (! (statementExpr instanceof AssignmentExpression)) {
				return null;
			}
			var lhsExpr = (statementExpr as AssignmentExpression).getFirstExpr();
			if (! (lhsExpr instanceof PropertyExpression && (lhsExpr as PropertyExpression).getExpr() instanceof ThisExpression)) {
				return null;
			}
			var onRHSExpr = function (expr : Expression) : boolean {
				if (expr instanceof AssignmentExpression
				    || expr instanceof PreIncrementExpression
				    || expr instanceof PostIncrementExpression) {
					// has side effects
					return false;
				} else if (expr instanceof FunctionExpression) {
					// environment of the closure would change
					return false;
				} else if (expr instanceof ThisExpression) {
					// depends on "this" inside constructors
					return false;
				} else if (expr instanceof LocalExpression) {
					var argIndex = funcDef.getArguments().map.<LocalVariable>((i) -> i).indexOf((expr as LocalExpression).getLocal());
					if (argIndex == -1) {
						throw new Error("logic flaw; could not find argument: " + (expr as LocalExpression).getLocal().getName().getValue());
					}
					if (expectedArgIndex != argIndex) {
						return false;
					}
					++expectedArgIndex;
				}
				return expr.forEachExpression(onRHSExpr);
			};
			if (! onRHSExpr((statementExpr as AssignmentExpression).getSecondExpr())) {
				return null;
			}
			// determine if the property is assignable
			var propertyIndex = propertyNames.indexOf((lhsExpr as PropertyExpression).getIdentifierToken().getValue());
			if (propertyIndex == -1) {
				throw new Error("logic flaw; could not find property: " + (lhsExpr as PropertyExpression).getIdentifierToken().getValue());
			}
			if (propertyExprs[propertyIndex]) {
				// the property is already initialized
				return null;
			}
			for (var i = propertyIndex + 1; i < propertyNames.length; ++i) {
				// one of the properties that need to be initialized laterwards has already been initialized with an expression that has side effects
				if (propertyExprs[i] != null
				    && _Util.exprHasSideEffects(propertyExprs[i])) {
					return null;
				}
			}
			propertyExprs[propertyIndex] = (statementExpr as AssignmentExpression).getSecondExpr().clone();
		}
		// build expression converter
		return function (newExpr) {
			// return list of expressions that should be used to initialize the properties
			return propertyExprs.map.<Expression>(function (expr) {
				function onExpr(expr : Expression, replaceCb : (Expression)->void) : boolean {
					if (expr instanceof LocalExpression) {
						var args = funcDef.getArguments(), argIndex = -1;
						for (var i in args) {
							if (args[i] == (expr as LocalExpression).getLocal()) {
								argIndex = i;
								break;
							}
						}
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
	}

	function _rewriteFunctionAsStatic (funcDef : MemberFunctionDefinition) : void {
		// first argument should be this
		var thisArg = new ArgumentDeclaration(new Token("$this", false), new ObjectType(funcDef.getClassDef()));
		funcDef.getArguments().unshift(thisArg);
		// rewrite this
		funcDef.forEachStatement(function onStatement(statement : Statement) : boolean {
			if (statement instanceof FunctionStatement) {
				(statement as FunctionStatement).getFuncDef().forEachStatement(onStatement);
			}
			return statement.forEachExpression(function onExpr(expr : Expression, replaceCb : function(:Expression):void) : boolean {
				if (expr instanceof ThisExpression) {
					replaceCb(new LocalExpression(thisArg.getName(), thisArg));
				} else if (expr instanceof FunctionExpression) {
					return (expr as FunctionExpression).getFuncDef().forEachStatement(onStatement);
				}
				return expr.forEachExpression(onExpr);
			}) && statement.forEachStatement(onStatement);
		});
		// update flags
		funcDef.setFlags(funcDef.flags() | ClassDefinition.IS_STATIC);
	}

	function _rewriteMethodCallsToStatic (expr : Expression, replaceCb : function(:Expression):void, unclassifyingClassDefs : ClassDefinition[]) : void {
		var onExpr = function (expr : Expression, replaceCb : function(:Expression):void) : boolean {
			if (expr instanceof CallExpression) {
				var calleeExpr = (expr as CallExpression).getExpr();
				if (calleeExpr instanceof PropertyExpression
				    && ! ((calleeExpr as PropertyExpression).getExpr().isClassSpecifier())
					&& ! (calleeExpr as PropertyExpression).getType().isAssignable()
					&& ! ((calleeExpr as PropertyExpression).getIdentifierToken().getValue() == "toString" && (expr as CallExpression).getArguments().length == 0)) {
						var propertyExpr = calleeExpr as PropertyExpression;
						// is a member method call
						var receiverType = propertyExpr.getExpr().getType().resolveIfNullable();
						var receiverClassDef = receiverType.getClassDef();
						if (unclassifyingClassDefs.indexOf(receiverClassDef) != -1) {
							// found, rewrite
							onExpr(propertyExpr.getExpr(), function (expr) {
								propertyExpr.setExpr(expr);
							});
							Util.forEachExpression(onExpr, (expr as CallExpression).getArguments());
							var funcType = propertyExpr.getType();
							replaceCb(
								new CallExpression(
									expr.getToken(),
									new PropertyExpression(
										propertyExpr.getToken(),
										new ClassExpression(new Token(receiverClassDef.className(), true), receiverType),
										propertyExpr.getIdentifierToken(),
										propertyExpr.getTypeArguments(),
										new StaticFunctionType(
											null, // this argument is no longer used in optimization phase
											(funcType as ResolvedFunctionType).getReturnType(),
											[ receiverType ].concat((funcType as ResolvedFunctionType).getArgumentTypes()),
											false)),
									[ propertyExpr.getExpr() ].concat((expr as CallExpression).getArguments())));
							return true;
						}
					}
			}
			return expr.forEachExpression(onExpr);
		};
		onExpr(expr, replaceCb);
	}

}

// propagates constants

class _FoldConstantCommand extends _FunctionOptimizeCommand {
	static const IDENTIFIER = "fold-const";

	class Stash extends Stash {

		var isOptimized : boolean;

		function constructor () {
			this.isOptimized = false;
		}

		function constructor (that : _FoldConstantCommand.Stash) {
			this.isOptimized = that.isOptimized;
		}

		override function clone () : Stash {
			return new _FoldConstantCommand.Stash(this);
		}

	}

	function constructor () {
		super(_FoldConstantCommand.IDENTIFIER);
	}

	override function _createStash () : Stash {
		return new _FoldConstantCommand.Stash();
	}

	override function optimizeFunction (funcDef : MemberFunctionDefinition) : boolean {
		funcDef.forEachStatement(function onStatement(statement : Statement) : boolean {
			statement.forEachStatement(onStatement);
			statement.forEachExpression(function(expr, replaceCb) { return this._optimizeExpression(expr, replaceCb); });
			return true;
		});
		return true;
	}

	function _optimizeExpression (expr : Expression, replaceCb : function(:Expression):void) : boolean {

		// optimize subexprs
		expr.forEachExpression(function(expr, replaceCb) { return this._optimizeExpression(expr, replaceCb); });

		// propagate const

		if (expr instanceof PropertyExpression) {

			// property expression
			var propertyExpr = expr as PropertyExpression;
			var holderType = propertyExpr.getHolderType();
			if (propertyExpr.getExpr().isClassSpecifier()) {
				var member = null : MemberVariableDefinition;
				holderType.getClassDef().forEachMemberVariable(function (m) {
					if (m instanceof MemberVariableDefinition && (m as MemberVariableDefinition).name() == propertyExpr.getIdentifierToken().getValue())
						member = m;
					return member == null;
				});
				if (member != null && (member.flags() & ClassDefinition.IS_CONST) != 0) {
					this._foldStaticConst(member);
					var foldedExpr = this._toFoldedExpr(member.getInitialValue(), member.getType());
					if (foldedExpr != null) {
						foldedExpr = this._toFoldedExpr(foldedExpr, propertyExpr.getType());
						if (foldedExpr != null) {
							this.log("folding property '" + member.toString() + "' at '" + propertyExpr.getToken().getFilename() + ":" + propertyExpr.getToken().getLineNumber() as string);
							replaceCb(foldedExpr);
						}
					}
				}
			}

		} else if (expr instanceof SignExpression) {

			// sign expression
			var calculateCb;
			switch (expr.getToken().getValue()) {
			case "+": calculateCb = function (x : number) : number { return +x; }; break;
			case "-": calculateCb = function (x : number) : number { return -x; }; break;
			default:
				return false;
			}
			this.log("folding operator '" + expr.getToken().getValue() + "' at '" + expr.getToken().getFilename() + ":" + expr.getToken().getLineNumber() as string);
			var baseExpr = (expr as SignExpression).getExpr();
			if (baseExpr instanceof IntegerLiteralExpression) {
				replaceCb(new IntegerLiteralExpression(new Token(calculateCb((baseExpr as IntegerLiteralExpression).getToken().getValue() as number) as string, false)));
			} else if (baseExpr instanceof NumberLiteralExpression) {
				replaceCb(new NumberLiteralExpression(new Token(calculateCb((baseExpr as NumberLiteralExpression).getToken().getValue() as number) as string, false)));
			}

		} else if (expr instanceof AdditiveExpression) {

			// additive expression
			var firstExpr = (expr as AdditiveExpression).getFirstExpr();
			var secondExpr = (expr as AdditiveExpression).getSecondExpr();
			if (this._foldNumericBinaryExpression(expr as AdditiveExpression, replaceCb)) {
				// done
			} else if (firstExpr instanceof StringLiteralExpression && secondExpr instanceof StringLiteralExpression) {
				replaceCb(
					new StringLiteralExpression(
						new Token(
							Util.encodeStringLiteral(
								Util.decodeStringLiteral((firstExpr as StringLiteralExpression).getToken().getValue()) +
								Util.decodeStringLiteral((secondExpr as StringLiteralExpression).getToken().getValue())),
							false)));
			}

		} else if (expr instanceof EqualityExpression) {

			this._foldEqualityExpression(expr as EqualityExpression, replaceCb);

		} else if (expr instanceof BinaryNumberExpression || expr instanceof ShiftExpression) {

			// binary number (or shift) expression
			this._foldNumericBinaryExpression(expr as BinaryExpression, replaceCb);

		} else if (expr instanceof AsExpression) {
			this._foldAsExpression(expr as AsExpression, replaceCb);

		} else if (expr instanceof LogicalNotExpression) {

			var innerExpr = (expr as LogicalNotExpression).getExpr();
			var condition;
			if ((condition = _Util.conditionIsConstant(innerExpr)) != null) {
				replaceCb(new BooleanLiteralExpression(new Token(condition ? "false" : "true", false))); // inverse the result
			}

		} else if (expr instanceof LogicalExpression) {

			firstExpr = (expr as LogicalExpression).getFirstExpr();
			secondExpr = (expr as LogicalExpression).getSecondExpr();

			var condition;
			if ((condition = _Util.conditionIsConstant(firstExpr)) != null) {
				var op = expr.getToken().getValue();
				if (op == "||" && condition) {
					replaceCb(new AsExpression(firstExpr.getToken(), firstExpr, Type.booleanType));
				} else if (op == "||" && (! condition)) {
					replaceCb(new AsExpression(secondExpr.getToken(), secondExpr, Type.booleanType));
				} else if (op == "&&" && condition) {
					replaceCb(new AsExpression(secondExpr.getToken(), secondExpr, Type.booleanType));
				} else if (op == "&&" && (! condition)) {
					replaceCb(new AsExpression(firstExpr.getToken(), firstExpr, Type.booleanType));
				} else {
					throw new Error("logic flaw");
				}
			}

		} else if (expr instanceof ConditionalExpression) {

			var conditionalExpr = expr as ConditionalExpression;
			var condExpr = conditionalExpr.getCondExpr();
			if ((condition = _Util.conditionIsConstant(condExpr)) != null) {
				var ifTrueExpr = conditionalExpr.getIfTrueExpr() ?: condExpr;
				var ifFalseExpr = conditionalExpr.getIfFalseExpr();

				replaceCb(condition ? ifTrueExpr : ifFalseExpr);
			}

		}

		return true;
	}

	function _foldEqualityExpression (expr : EqualityExpression, replaceCb : function(:Expression):void) : void {
		var firstExpr = expr.getFirstExpr();
		var secondExpr = expr.getSecondExpr();
		var isEqual = null : Nullable.<boolean>; // tri-state
		if (firstExpr instanceof StringLiteralExpression && secondExpr instanceof StringLiteralExpression) {
			isEqual = Util.decodeStringLiteral(firstExpr.getToken().getValue()) == Util.decodeStringLiteral(secondExpr.getToken().getValue());
		} else if (this._isIntegerOrNumberLiteralExpression(firstExpr) && this._isIntegerOrNumberLiteralExpression(secondExpr)) {
			isEqual = firstExpr.getToken().getValue() as number == secondExpr.getToken().getValue() as number;
		}
		if (isEqual != null) {
			var result = expr.getToken().getValue() == "==" ? isEqual as boolean : ! isEqual;
			replaceCb(new BooleanLiteralExpression(new Token(result ? "true" : "false", true)));
		}
	}

	function _foldNumericBinaryExpression (expr : BinaryExpression, replaceCb : function(:Expression):void) : boolean {
		// handles BinaryNumberExpression _and_ AdditiveExpression of numbers or integers

		// if both operands are constant, then...
		if (this._isIntegerOrNumberLiteralExpression(expr.getFirstExpr())
			&& this._isIntegerOrNumberLiteralExpression(expr.getSecondExpr())) {
				return this._foldNumericBinaryExpressionOfConstants(expr, replaceCb);
			}

		// if either operand is zero or one, then...
		function exprIsZero(expr : Expression) : boolean {
			return expr instanceof NumberLiteralExpression && expr.getToken().getValue() as number == 0;
		}
		function exprIsOne(expr : Expression) : boolean {
			return expr instanceof NumberLiteralExpression && expr.getToken().getValue() as number == 1;
		}
		switch (expr.getToken().getValue()) {
		case "+":
			if (exprIsZero(expr.getFirstExpr())) { // 0 + x -> x
				replaceCb(expr.getSecondExpr());
				return true;
			} else if (exprIsZero(expr.getSecondExpr())) { // x + 0 -> x
				replaceCb(expr.getFirstExpr());
				return true;
			}
			break;
		case "-": // x - 0 -> x
			if (exprIsZero(expr.getFirstExpr())) { // 0 - x -> -x
				replaceCb(new SignExpression(new Token("-", false), expr.getSecondExpr()));
				return true;
			}
			else if (exprIsZero(expr.getSecondExpr())) { // x - 0 -> x
				replaceCb(expr.getFirstExpr());
				return true;
			}
			break;
		case "*": // x * 1 or 1 * x -> x
			if (exprIsOne(expr.getFirstExpr())) {
				replaceCb(expr.getSecondExpr());
				return true;
			} else if (exprIsOne(expr.getSecondExpr())) {
				replaceCb(expr.getFirstExpr());
				return true;
			}
			break;
		case "/": // x / 1 -> x
			if (exprIsOne(expr.getSecondExpr())) {
				replaceCb(expr.getFirstExpr());
				return true;
			}
			break;
		}

		return false;
	}

	function _foldNumericBinaryExpressionOfConstants (expr : BinaryExpression, replaceCb : function(:Expression):void) : boolean {
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
	}

	function _foldNumericBinaryExpressionAsNumeric (expr : BinaryExpression, replaceCb : function(:Expression):void, calcCb : function(:number,:number):number) : void {
		if (expr.getFirstExpr() instanceof IntegerLiteralExpression && expr.getSecondExpr() instanceof IntegerLiteralExpression) {
			this._foldNumericBinaryExpressionAsInteger(expr, replaceCb, calcCb);
		} else {
			this._foldNumericBinaryExpressionAsNumber(expr, replaceCb, calcCb);
		}
	}

	function _foldNumericBinaryExpressionAsInteger (expr : BinaryExpression, replaceCb : function(:Expression):void, calcCb : function(:number,:number):number) : void {
		var value = calcCb(expr.getFirstExpr().getToken().getValue() as number, expr.getSecondExpr().getToken().getValue() as number);
		this.log(
			"folding operator '" + expr.getToken().getValue() + "' at " + expr.getToken().getFilename() + ":" + expr.getToken().getLineNumber() as string +
			" to int: " + value as string);
		if (value % 1 != 0)
			throw new Error("value is not an integer");
		replaceCb(new IntegerLiteralExpression(new Token(value as string, false)));
	}

	function _foldNumericBinaryExpressionAsNumber (expr : BinaryExpression, replaceCb : function(:Expression):void, calcCb : function(:number,:number):number) : void {
		var value = calcCb(expr.getFirstExpr().getToken().getValue() as number, expr.getSecondExpr().getToken().getValue() as number);
		this.log(
			"folding operator '" + expr.getToken().getValue() + "' at " + expr.getToken().getFilename() + ":" + expr.getToken().getLineNumber() as string +
			" to number: " + value as string);
		replaceCb(new NumberLiteralExpression(new Token(value as string, false)));
	}

	function _isIntegerOrNumberLiteralExpression (expr : Expression) : boolean {
		return expr instanceof NumberLiteralExpression || expr instanceof IntegerLiteralExpression;
	}

	function _foldStaticConst (member : MemberVariableDefinition) : void {
		var stash = this.getStash(member) as _FoldConstantCommand.Stash;
		// optimize only once
		if (stash.isOptimized)
			return;
		stash.isOptimized = true;
		// optimize
		var initialValue = member.getInitialValue();
		if (initialValue != null)
			this._optimizeExpression(initialValue, function (expr) { member.setInitialValue(expr); });
	}

	function _toFoldedExpr (expr : Expression, type : Type) : Expression {
		if (expr instanceof NullExpression) {
			return expr;
		} else if (expr instanceof BooleanLiteralExpression) {
			return expr;
		} else if (expr instanceof IntegerLiteralExpression) {
			return expr;
		} else if (expr instanceof NumberLiteralExpression) {
			if (type.resolveIfNullable().equals(Type.integerType)) {
				// cast to integer
				return new IntegerLiteralExpression(new Token((expr.getToken().getValue() as int).toString(), false));
			}
			return expr;
		} else if (expr instanceof StringLiteralExpression) {
			return expr;
		}
		return null;
	}

	function _foldAsExpression(expr : AsExpression, replaceCb : function(:Expression):void) : void {
		var baseExpr = expr.getExpr();
		if (expr.getType().equals(Type.stringType)) { // as string
			if (baseExpr.getType().equals(Type.stringType)) {
				this.log("folding type cast: string as string");
				replaceCb(baseExpr);
			}
			else if (baseExpr instanceof BooleanLiteralExpression || baseExpr instanceof NumberLiteralExpression || baseExpr instanceof IntegerLiteralExpression) {
				this.log("folding type cast: primitive literal as string");
				replaceCb(
					new StringLiteralExpression(
						new Token(Util.encodeStringLiteral(baseExpr.getToken().getValue()), false)));
			}
		}
		else if (expr.getType().equals(Type.numberType)) { // as number
			if (baseExpr.getType().equals(Type.numberType)) {
				this.log("folding type cast: number as number");
				replaceCb(baseExpr);
			}
			else if (baseExpr instanceof StringLiteralExpression) {
				this.log("folding type cast: string literal as number");
				replaceCb(
					new NumberLiteralExpression(
						new Token(Util.decodeStringLiteral(baseExpr.getToken().getValue()) as number as string, false)));
			}
			else if (baseExpr instanceof IntegerLiteralExpression) {
				this.log("folding type cast: int literal as number");
				replaceCb(
					new NumberLiteralExpression(
						new Token(baseExpr.getToken().getValue() as number as string, false)));
			}
		}
		else if (expr.getType().equals(Type.integerType)) { // as int
			if (baseExpr.getType().equals(Type.integerType)) {
				this.log("folding type cast: int as int");
				replaceCb(baseExpr);
			}
			else if (baseExpr instanceof StringLiteralExpression) {
				this.log("folding type cast: string literal as int");
				replaceCb(
					new IntegerLiteralExpression(
						new Token(Util.decodeStringLiteral(baseExpr.getToken().getValue()) as int as string, false)));
			}
			else if (baseExpr instanceof NumberLiteralExpression) {
				this.log("folding type cast: number literal as int");
				replaceCb(
					new IntegerLiteralExpression(
						new Token(baseExpr.getToken().getValue() as int as string, false)));
			}
		}
		else if (expr.getType().equals(Type.booleanType)) { // as boolean
			if (baseExpr.getType().equals(Type.booleanType)) {
				this.log("folding type cast: boolean as boolean");
				replaceCb(baseExpr);
			}
			else if (baseExpr instanceof StringLiteralExpression) {
				this.log("folding type cast: string literal as boolean");
				replaceCb(
					new BooleanLiteralExpression(
						new Token(Util.decodeStringLiteral(baseExpr.getToken().getValue()) as boolean as string, false)));
			}
			else if (baseExpr instanceof NumberLiteralExpression) {
				this.log("folding type cast: number literal as boolean");
				replaceCb(
					new BooleanLiteralExpression(
						new Token(baseExpr.getToken().getValue() as number ? "true" : "false", false)));
			}
			else if (baseExpr instanceof IntegerLiteralExpression) {
				this.log("folding type cast: integer literal as boolean");
				replaceCb(
					new BooleanLiteralExpression(
						new Token(baseExpr.getToken().getValue() as int ? "true" : "false", false)));
			}
		}
	}
}

class _DeadCodeEliminationOptimizeCommand extends _FunctionOptimizeCommand {
	static const IDENTIFIER = "dce";

	function constructor () {
		super(_DeadCodeEliminationOptimizeCommand.IDENTIFIER);
	}

	override function optimizeFunction (funcDef : MemberFunctionDefinition) : boolean {
		if (funcDef.getStatements() == null) {
			return true;
		}
		while (this._optimizeFunction(funcDef)
			|| this._removeExpressionStatementsWithoutSideEffects(funcDef))
				;
		return true;
	}

	function _removeExpressionStatementsWithoutSideEffects (funcDef : MemberFunctionDefinition) : boolean {
		var shouldRetry = false;
		(function onStatements(statements : Statement[]) : boolean {
			for (var i = 0; i < statements.length;) {
				if (statements[i] instanceof ExpressionStatement && ! _Util.exprHasSideEffects((statements[i] as ExpressionStatement).getExpr())) {
					shouldRetry = true;
					statements.splice(i, 1);
				} else {
					statements[i++].handleStatements(onStatements);
				}
			}
			return true;
		})(funcDef.getStatements());
		return shouldRetry;
	}

	function _optimizeFunction (funcDef : MemberFunctionDefinition) : boolean {
		var shouldRetry = false;
		// use the assignment source, if possible
		_Util.optimizeBasicBlock(funcDef, function (exprs : Expression[]) : void {
			this._eliminateDeadStoresToProperties(funcDef, exprs);
			this._delayAssignmentsBetweenLocals(funcDef, exprs);
			this._eliminateDeadStores(funcDef, exprs);
			this._eliminateDeadConditions(funcDef, exprs);
		});
		// remove statements without side-effects
		(function onStatements(statements : Statement[]) : boolean {
			for (var i = statements.length - 1; i >= 0; --i) {
				var statement = statements[i];
				if (statement instanceof ExpressionStatement) {
					if (! _Util.exprHasSideEffects((statement as ExpressionStatement).getExpr())) {
						statements.splice(i, 1);
					}
				}
				statement.handleStatements(onStatements);
			}
			return true;
		})(funcDef.getStatements());
		// mark the variables that are used (as RHS)
		var locals = funcDef.getLocals();
		var localsUsed = new Array.<boolean>(locals.length);
		funcDef.forEachStatement(function onStatement(statement : Statement) : boolean {
			if (statement instanceof FunctionStatement) {
				(statement as FunctionStatement).getFuncDef().forEachStatement(onStatement);
			}
			statement.forEachExpression(function onExpr(expr : Expression) : boolean {
				if (expr instanceof AssignmentExpression
				    && (expr as AssignmentExpression).getFirstExpr() instanceof LocalExpression
					&& (expr as AssignmentExpression).getFirstExpr().getType().equals((expr as AssignmentExpression).getSecondExpr().getType())) {
						// skip lhs of assignment to local that has no effect
						return onExpr((expr as AssignmentExpression).getSecondExpr());
					} else if (expr instanceof LocalExpression) {
						for (var i = 0; i < locals.length; ++i) {
							if (locals[i] == (expr as LocalExpression).getLocal()) {
								break;
							}
						}
						if (i != locals.length) {
							localsUsed[i] = true;
						}
					} else if (expr instanceof FunctionExpression) {
						(expr as FunctionExpression).getFuncDef().forEachStatement(onStatement);
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
			funcDef.forEachStatement(function onStatement(statement : Statement) : boolean {
				if (statement instanceof FunctionStatement) {
					(statement as FunctionStatement).getFuncDef().forEachStatement(onStatement);
				}
				statement.forEachExpression(function onExpr(expr : Expression, replaceCb : function(:Expression):void) : boolean {
					if (expr instanceof AssignmentExpression
					    && (expr as AssignmentExpression).getFirstExpr() instanceof LocalExpression
						&& ((expr as AssignmentExpression).getFirstExpr() as LocalExpression).getLocal() == locals[localIndex]) {
							var rhsExpr = (expr as AssignmentExpression).getSecondExpr();
							replaceCb(rhsExpr);
							shouldRetry = true;
							return onExpr(rhsExpr, null);
						} else if (expr instanceof LocalExpression && (expr as LocalExpression).getLocal() == locals[localIndex]) {
							throw new Error("logic flaw, found a variable going to be removed being used");
						} else if (expr instanceof FunctionExpression) {
							(expr as FunctionExpression).getFuncDef().forEachStatement(onStatement);
						}
					return expr.forEachExpression(onExpr);
				});
				return statement.forEachStatement(onStatement);
			});
			// remove from locals array
			locals.splice(localIndex, 1);
		}
		return shouldRetry;
	}

	function _delayAssignmentsBetweenLocals (funcDef : MemberFunctionDefinition, exprs : Expression[]) : void {
		// find forms localA = localB, and rewrite the use of localA to localB
		var localsUntouchable = new TypedMap.<LocalVariable,boolean>;
		var locals = new TypedMap.<LocalVariable,Expression>;
		// mark the locals that uses op= (cannot be eliminated by the algorithm applied laterwards)
		var _onExpr = function (expr : Expression) : boolean {
			if (expr instanceof AssignmentExpression
			    && (expr as AssignmentExpression).getToken().getValue() != "="
				&& (expr as AssignmentExpression).getFirstExpr() instanceof LocalExpression) {
					var local = ((expr as AssignmentExpression).getFirstExpr() as LocalExpression).getLocal();
					this.log("local variable " + local.getName().getValue() + " cannot be rewritten (has fused op)");
					localsUntouchable.set(local, true);
				} else if (expr instanceof IncrementExpression
					&& (expr as IncrementExpression).getExpr() instanceof LocalExpression) {
					var local = ((expr as IncrementExpression).getExpr() as LocalExpression).getLocal();
					this.log("local variable " + local.getName().getValue() + " cannot be rewritten (has increment)");
					localsUntouchable.set(local, true);
				}
			return expr.forEachExpression(_onExpr);
		};
		Util.forEachExpression(_onExpr, exprs);
		// rewrite the locals
		var onExpr = function (expr : Expression, replaceCb : function(:Expression):void) : boolean {
			if (expr instanceof AssignmentExpression) {
				var assignmentExpr = expr as AssignmentExpression;
				if (assignmentExpr.getFirstExpr() instanceof LocalExpression) {
					onExpr(assignmentExpr.getSecondExpr(), function (expr) {
						assignmentExpr.setSecondExpr(expr);
					});
					if (! localsUntouchable.get((assignmentExpr.getFirstExpr() as LocalExpression).getLocal())
						&& (assignmentExpr.getFirstExpr() as LocalExpression).getType().equals(assignmentExpr.getSecondExpr().getType())) {
							var lhsLocal = (assignmentExpr.getFirstExpr() as LocalExpression).getLocal();
							this.log("resetting cache for: " + lhsLocal.getName().getValue());
							locals.reversedForEach(function(local, expr) {
								if (local == lhsLocal) {
									this.log("  clearing itself");
									locals.delete(local);
								} else if (expr instanceof LocalExpression && (expr as LocalExpression).getLocal() == lhsLocal) {
									this.log("  clearing " + local.getName().getValue());
									locals.delete(local);
								}
								return true;
							});
							if (assignmentExpr.getToken().getValue() == "=") {
								var rhsExpr = assignmentExpr.getSecondExpr();
								if (rhsExpr instanceof LocalExpression) {
									var rhsLocal = (rhsExpr as LocalExpression).getLocal();
									if (lhsLocal != rhsLocal && ! localsUntouchable.get(rhsLocal)) {
										this.log("  set to: " + rhsLocal.getName().getValue());
										locals.set(lhsLocal, rhsExpr);
									}
								} else if (rhsExpr instanceof NullExpression
									   || rhsExpr instanceof NumberLiteralExpression
									   || rhsExpr instanceof IntegerLiteralExpression
									   || rhsExpr instanceof StringLiteralExpression) {
									this.log("  set to: " + rhsExpr.getToken().getValue());
									locals.set(lhsLocal, rhsExpr);
								}
							}
						}
					return true;
				}
			} else if (expr instanceof LocalExpression) {
				var cachedExpr = locals.get((expr as LocalExpression).getLocal());
				if (cachedExpr) {
					replaceCb(cachedExpr.clone());
					return true;
				}
			} else if (expr instanceof CallExpression) {
				var callingFuncDef = _DetermineCalleeCommand.getCallingFuncDef(expr as CallExpression);
				if (callingFuncDef != null && (callingFuncDef.flags() & ClassDefinition.IS_PURE) != 0) {
					// fall through
				} else {
					(expr as CallExpression).forEachExpression(onExpr);
					if (funcDef.getParent() != null || funcDef.getClosures().length != 0) {
						locals.clear();
					}
					return true;
				}
			} else if (expr instanceof NewExpression) {
				(expr as NewExpression).forEachExpression(onExpr);
				locals.clear();
				return true;
			}
			return expr.forEachExpression(onExpr);
		};
		Util.forEachExpression(onExpr, exprs);
	}

	function _eliminateDeadStores (funcDef : MemberFunctionDefinition, exprs : Expression[]) : void {
		var lastAssignExpr = new Triple.<LocalVariable, AssignmentExpression, function(:Expression):void>[];
		var onExpr = function (expr : Expression, rewriteCb : function(:Expression):void) : boolean {
			if (expr instanceof AssignmentExpression) {
				var assignExpr = expr as AssignmentExpression;
				if (assignExpr.getToken().getValue() == "=" && assignExpr.getFirstExpr() instanceof LocalExpression) {
					onExpr(assignExpr.getSecondExpr(), function (assignExpr : AssignmentExpression) : function(:Expression):void {
						return function (expr) {
							assignExpr.setSecondExpr(expr);
						};
					}(assignExpr));
					var lhsLocal = (assignExpr.getFirstExpr() as LocalExpression).getLocal();
					for (var i = 0; i < lastAssignExpr.length; ++i) {
						if (lastAssignExpr[i].first == lhsLocal) {
							break;
						}
					}
					if (i != lastAssignExpr.length) {
						this.log("eliminating dead store to: " + lhsLocal.getName().getValue());
						lastAssignExpr[i].third(lastAssignExpr[i].second.getSecondExpr());
					}
					lastAssignExpr[i] = new Triple.<LocalVariable, AssignmentExpression, function(:Expression):void>(lhsLocal, expr as AssignmentExpression, rewriteCb);
					return true;
				}
			} else if (expr instanceof LocalExpression) {
				for (var i = 0; i < lastAssignExpr.length; ++i) {
					if (lastAssignExpr[i].first == (expr as LocalExpression).getLocal()) {
						lastAssignExpr.splice(i, 1);
						break;
					}
				}
			} else if (expr instanceof CallExpression) {
				onExpr((expr as CallExpression).getExpr(), function (callExpr : CallExpression) : function(:Expression):void {
					return function (expr) {
						callExpr.setExpr(expr);
					};
				}(expr as CallExpression));
				Util.forEachExpression(onExpr, (expr as CallExpression).getArguments());
				var callingFuncDef = _DetermineCalleeCommand.getCallingFuncDef(expr);
				if (callingFuncDef != null && (callingFuncDef.flags() & ClassDefinition.IS_PURE) != 0) {
					// ok
				} else {
					lastAssignExpr.splice(0, lastAssignExpr.length);
				}
				return true;
			} else if (expr instanceof NewExpression) {
				Util.forEachExpression(onExpr, (expr as NewExpression).getArguments());
				lastAssignExpr.splice(0, lastAssignExpr.length);
				return true;
			} else if (expr instanceof LogicalExpression || expr instanceof ConditionalExpression) {
				expr.forEachExpression(function (expr, rewriteCb) {
					var result = onExpr(expr, rewriteCb);
					lastAssignExpr.splice(0, lastAssignExpr.length);
					return result;
				});
				return true;
			}
			return expr.forEachExpression(onExpr);
		};
		Util.forEachExpression(onExpr, exprs);
	}

	function _eliminateDeadStoresToProperties (funcDef : MemberFunctionDefinition, exprs : Expression[]) : void {
		function isFirstLevelPropertyAccess(expr : Expression) : boolean {
			if (! (expr instanceof PropertyExpression)) {
				return false;
			}
			var baseExpr = (expr as PropertyExpression).getExpr();
			if (baseExpr instanceof LocalExpression
			    || baseExpr instanceof ThisExpression
			    || baseExpr.isClassSpecifier()) {
				return true;
			} else {
				return false;
			}
		}
		function baseExprsAreEqual(x : Expression, y : Expression) : boolean {
			if (x instanceof LocalExpression && y instanceof LocalExpression) {
				return (x as LocalExpression).getLocal() == (y as LocalExpression).getLocal();
			} else if (x instanceof ThisExpression && y instanceof ThisExpression) {
				return true;
			} else if (x.isClassSpecifier() && y.isClassSpecifier()) {
				return (x as ClassExpression).getType().equals((y as ClassExpression).getType());
			}
			return false;
		}
		var lastAssignExpr = new Map.<Pair.<AssignmentExpression, function(:Expression):void>>;
		var onExpr = function (expr : Expression, rewriteCb : function(:Expression):void) : boolean {
			if (expr instanceof AssignmentExpression) {
				var assignmentExpr = expr as AssignmentExpression;
				var firstExpr      = assignmentExpr.getFirstExpr();
				if (expr.getToken().getValue() == "="
					&& isFirstLevelPropertyAccess(firstExpr)
					&& ! _Util.classIsNative((firstExpr as PropertyExpression).getExpr().getType().getClassDef())) {
						var propertyName = (firstExpr as PropertyExpression).getIdentifierToken().getValue();
						onExpr(assignmentExpr.getSecondExpr(), null);
						if (lastAssignExpr[propertyName]
								&& lastAssignExpr[propertyName].second != null
								&& baseExprsAreEqual((firstExpr as PropertyExpression).getExpr(), (lastAssignExpr[propertyName].first.getFirstExpr() as PropertyExpression).getExpr())) {
							lastAssignExpr[propertyName].second(lastAssignExpr[propertyName].first.getSecondExpr());
						}
						lastAssignExpr[propertyName] = new Pair.<AssignmentExpression, function(:Expression):void>(assignmentExpr, rewriteCb);
						return true;
					} else if (assignmentExpr.getFirstExpr() instanceof LocalExpression) {
						onExpr(assignmentExpr.getSecondExpr(), null);
						for (var k in lastAssignExpr) {
							var baseExpr = (lastAssignExpr[k].first.getFirstExpr() as PropertyExpression).getExpr();
							if (baseExpr instanceof LocalExpression
							    && (baseExpr as LocalExpression).getLocal() == ((expr as AssignmentExpression).getFirstExpr() as LocalExpression).getLocal()) {
								delete lastAssignExpr[k];
							}
						}
						return true;
					}
			} else if (isFirstLevelPropertyAccess(expr)) {
				var propertyName = (expr as PropertyExpression).getIdentifierToken().getValue();
				delete lastAssignExpr[propertyName];
			} else if (expr instanceof CallExpression) {
				onExpr((expr as CallExpression).getExpr(), null);
				Util.forEachExpression(onExpr, (expr as CallExpression).getArguments());
				lastAssignExpr = new Map.<Pair.<AssignmentExpression, function(:Expression):void>>;
				return true;
			} else if (expr instanceof NewExpression) {
				Util.forEachExpression(onExpr, (expr as NewExpression).getArguments());
				lastAssignExpr = new Map.<Pair.<AssignmentExpression, function(:Expression):void>>;
				return true;
			}
			return expr.forEachExpression(onExpr);
		};
		Util.forEachExpression(onExpr, exprs);
	}

	function _eliminateDeadConditions (funcDef : MemberFunctionDefinition, exprs : Expression[]) : void {
		function spliceStatements (dest : Statement[], index : number, src : Statement[]) : void {
			dest.splice(index, 1);
			for (var i = 0; i < src.length; ++i) {
				dest.splice(index + i, 0, src[i]);
			}
		}
		(function onStatements(statements : Statement[]) : boolean {
			for (var i = statements.length - 1; i >= 0; --i) {
				var statement = statements[i];
				if (statement instanceof IfStatement) {
					var ifStatement = statement as IfStatement;
					var cond = _Util.conditionIsConstant(ifStatement.getExpr());
					if (cond == null) {
						// nothing to do
					} else if (cond == false && ifStatement.getOnFalseStatements().length == 0) {
						statements.splice(i, 1);
					} else if (cond == false) {
						spliceStatements(statements, i, ifStatement.getOnFalseStatements());
					} else if (cond == true) {
						spliceStatements(statements, i, ifStatement.getOnTrueStatements());
					}
				}
				statement.handleStatements(onStatements);
			}
			return true;
		})(funcDef.getStatements());
	}

}


class _InlineOptimizeCommand extends _FunctionOptimizeCommand {
	static const IDENTIFIER = "inline";

	static const INLINE_THRESHOLD = 30; // TODO: make it configurable (--optimize inline=N)

	class Stash extends Stash {

		var isOptimized : boolean;
		var isInlineable : Nullable.<boolean>;

		function constructor () {
			this.isOptimized  = false;
			this.isInlineable = null;
		}

		function constructor (that: _InlineOptimizeCommand.Stash) {
			this.isOptimized  = that.isOptimized;
			this.isInlineable = that.isInlineable;
		}

		override function clone () : Stash {
			return new _InlineOptimizeCommand.Stash(this);
		}

	}

	function constructor () {
		super(_InlineOptimizeCommand.IDENTIFIER);
	}

	override function _createStash () : Stash {
		return new _InlineOptimizeCommand.Stash();
	}

	override function optimizeFunction (funcDef : MemberFunctionDefinition) : boolean {
		var stash = this.getStash(funcDef) as _InlineOptimizeCommand.Stash;
		// use flag, since functions might recurse
		if (stash.isOptimized)
			return true;
		stash.isOptimized = true;

		// we need to the check here since functions might recurse
		if (funcDef.getStatements() == null)
			return true;
		this.log("* starting optimization of " + funcDef.getNotation());
		while (true) {
			while (true) {
				if (! this._handleStatements(funcDef, funcDef.getStatements()))
					break;
				(this.setupCommand(new _DetermineCalleeCommand()) as _DetermineCalleeCommand).optimizeFunction(funcDef);
			}
			if (! (this.setupCommand(new _ReturnIfOptimizeCommand()) as _ReturnIfOptimizeCommand).optimizeFunction(funcDef))
				break;
		}
		this.log("* finished optimization of " + funcDef.getNotation());
		return true;
	}

	function _handleStatements (funcDef : MemberFunctionDefinition, statements : Statement[]) : boolean {
		var altered = false;
		for (var i = 0; i < statements.length; ++i) {
			var left = statements.length - i;
			if (this._handleStatement(funcDef, statements, i))
				altered = true;
			i = statements.length - left;
		}
		return altered;
	}

	function _handleStatement (funcDef : MemberFunctionDefinition, statements : Statement[], stmtIndex : number) : boolean {
		var altered = false;
		var statement = statements[stmtIndex];

		// expand single-statement functions that return a value
		statement.forEachExpression(function onExpr(expr : Expression, replaceCb : function(:Expression):void) : boolean {
			expr.forEachExpression(onExpr);
			if (expr instanceof CallExpression) {
				var args = this._getArgsAndThisIfCallExprIsInlineable(expr as CallExpression, true);
				if (args != null) {
					var callingFuncDef = _DetermineCalleeCommand.getCallingFuncDef(expr);
					this.log("expanding " + callingFuncDef.getNotation() + " as expression");
					var stmt = callingFuncDef.getStatements()[0];
					if (stmt instanceof ExpressionStatement) {
						var expr = (stmt as ExpressionStatement).getExpr();
					} else if (stmt instanceof ReturnStatement) {
						expr = (stmt as ReturnStatement).getExpr();
					} else {
						throw new Error('logic flaw');
					}
					var clonedExpr = expr.clone();
					this._rewriteExpression(
						clonedExpr,
						function (expr) { clonedExpr = expr; },
						args,
						callingFuncDef);
					replaceCb(clonedExpr);
				}
			}
			return true;
		});

		// expand more complicated functions
		if (statement instanceof ConstructorInvocationStatement) {

			var callingFuncDef = _DetermineCalleeCommand.getCallingFuncDef(statement);
			this.optimizeFunction(callingFuncDef);
			if (this._functionIsInlineable(callingFuncDef) && this._argsAreInlineable(callingFuncDef, (statement as ConstructorInvocationStatement).getArguments(), false)) {
				statements.splice(stmtIndex, 1);
				this._expandCallingFunction(funcDef, statements, stmtIndex, callingFuncDef, (statement as ConstructorInvocationStatement).getArguments().concat([ new ThisExpression(null, funcDef.getClassDef()) as Expression ]));
			}

		} else if (statement instanceof ExpressionStatement) {

			if (this._expandStatementExpression(funcDef, statements, stmtIndex, (statement as ExpressionStatement).getExpr(), function (stmtIndex) {
				statements.splice(stmtIndex, 1);
			})) {
				altered = true;
			}

		} else if (statement instanceof ReturnStatement) {

			if (this._expandStatementExpression(funcDef, statements, stmtIndex, (statement as ReturnStatement).getExpr(), function (stmtIndex) {
				statements.splice(stmtIndex, 1);
				statements[stmtIndex - 1] = new ReturnStatement(statement.getToken(),
					(statements[stmtIndex - 1] instanceof ReturnStatement)
					? (statements[stmtIndex - 1] as ReturnStatement).getExpr()
					: (statements[stmtIndex - 1] as ExpressionStatement).getExpr());
			})) {
				altered = true;
			}

		} else if (statement instanceof IfStatement) {

			if (this._expandStatementExpression(funcDef, statements, stmtIndex, (statement as IfStatement).getExpr(), function (stmtIndex) {
				(statement as IfStatement).setExpr((statements[stmtIndex - 1] instanceof ReturnStatement)
					? (statements[stmtIndex - 1] as ReturnStatement).getExpr()
					: (statements[stmtIndex - 1] as ExpressionStatement).getExpr());
				statements.splice(stmtIndex - 1, 1);
			})) {
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
	}

	function _handleSubStatements (funcDef : MemberFunctionDefinition, statement : Statement) : boolean {
		return _Util.handleSubStatements(function (statements) {
			return this._handleStatements(funcDef, statements);
		}, statement);
	}

	// expands an expression at given location, if possible
	function _expandStatementExpression (funcDef : MemberFunctionDefinition, statements : Statement[], stmtIndex : number, expr : Expression, cb : function(:number):void) : boolean {

		if (expr instanceof CallExpression) {

			// inline if the entire statement is a single call expression
			var args = this._getArgsAndThisIfCallExprIsInlineable(expr as CallExpression, false);
			if (args != null) {
				stmtIndex = this._expandCallingFunction(funcDef, statements, stmtIndex, _DetermineCalleeCommand.getCallingFuncDef(expr), args);
				cb(stmtIndex);
				return true;
			}

		} else if (expr instanceof AssignmentExpression
			   && this._lhsHasNoSideEffects((expr as AssignmentExpression).getFirstExpr())
			&& (expr as AssignmentExpression).getSecondExpr() instanceof CallExpression) {

			// inline if the statement is an assignment of a single call expression into a local variable
			var args = this._getArgsAndThisIfCallExprIsInlineable((expr as AssignmentExpression).getSecondExpr() as CallExpression, false);
			if (args != null) {
				stmtIndex = this._expandCallingFunction(funcDef, statements, stmtIndex, _DetermineCalleeCommand.getCallingFuncDef((expr as AssignmentExpression).getSecondExpr() as CallExpression), args);
				var stmt = statements[stmtIndex - 1];
				if (stmt instanceof ReturnStatement) {
					var rhsExpr = (stmt as ReturnStatement).getExpr();
				} else if (stmt instanceof ExpressionStatement) {
					rhsExpr = (stmt as ExpressionStatement).getExpr();
				} else {
					return false;
				}
				var lastExpr = new AssignmentExpression(
					expr.getToken(),
					(expr as AssignmentExpression).getFirstExpr(),
					rhsExpr);
				statements[stmtIndex - 1] = new ExpressionStatement(lastExpr);
				cb(stmtIndex);
				return true;
			}
		}

		return false;
	}

	function _lhsHasNoSideEffects (lhsExpr : Expression) : boolean {
		// FIXME may have side effects if is a native type (or extends a native type)
		if (lhsExpr instanceof LocalExpression)
			return true;
		if (lhsExpr instanceof PropertyExpression) {
			var holderExpr = (lhsExpr as PropertyExpression).getExpr();
			if (holderExpr instanceof ThisExpression)
				return true;
			if (holderExpr instanceof LocalExpression || holderExpr.isClassSpecifier())
				return true;
		} else if (lhsExpr instanceof ArrayExpression) {
			var arrayExpr = lhsExpr as ArrayExpression;
			if (arrayExpr.getFirstExpr() instanceof LocalExpression
				&& (arrayExpr.getSecondExpr() instanceof NumberLiteralExpression
					|| arrayExpr.getSecondExpr() instanceof StringLiteralExpression
					|| arrayExpr.getSecondExpr() instanceof LocalExpression)) {
						return true;
			}
		}
		return false;
	}

	function _getArgsAndThisIfCallExprIsInlineable (callExpr : CallExpression, asExpression : boolean) : Expression[] {
		// determine the function that will be called
		var callingFuncDef = _DetermineCalleeCommand.getCallingFuncDef(callExpr);
		if (callingFuncDef == null)
			return null;
		// optimize the calling function prior to testing the conditions
		this.optimizeFunction(callingFuncDef);
		// obtain receiver expression
		var receiverExpr = null : Expression;
		if ((callingFuncDef.flags() & ClassDefinition.IS_STATIC) == 0) {
			var calleeExpr = callExpr.getExpr();
			if (! (calleeExpr instanceof PropertyExpression))
				throw new Error("unexpected type of expression");
			receiverExpr = (calleeExpr as PropertyExpression).getExpr();
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
			var modifiesArgs = ! Util.forEachStatement(function onStatement(statement : Statement) : boolean {
				var onExpr = function onExpr(expr : Expression) : boolean {
					if (expr instanceof AssignmentExpression && (expr as AssignmentExpression).getFirstExpr() instanceof LocalExpression)
						return false;
					return expr.forEachExpression(onExpr);
				};
				return statement.forEachExpression(onExpr);
			}, callingFuncDef.getStatements());
			if (modifiesArgs)
				return null;
		}
		// and the args passed can be inlined (types should match exactly (or emitters may insert additional code))
		if (! this._argsAreInlineable(callingFuncDef, callExpr.getArguments(), asExpression))
			return null;
		// build list of arguments (and this)
		var argsAndThis = callExpr.getArguments().concat(new Expression[]);
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
	}

	function _argsAreInlineable (callingFuncDef : MemberFunctionDefinition, actualArgs : Expression[], asExpression : boolean) : boolean {
		var formalArgsTypes = callingFuncDef.getArgumentTypes();
		if (actualArgs.length != formalArgsTypes.length)
			throw new Error("number of arguments mismatch");
		for (var i = 0; i < actualArgs.length; ++i) {
			if (asExpression && ! (actualArgs[i] instanceof LeafExpression))
				return false;
			if (! this._argIsInlineable(actualArgs[i].getType(), formalArgsTypes[i]))
				return false;
		}
		return true;
	}

	function _argIsInlineable (actualType : Type, formalType : Type) : boolean {
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
	}

	function _isWorthInline (funcDef : MemberFunctionDefinition) : boolean {
		if (funcDef.isAnonymous()) {
			return true; // always try to inline for anonymous function expressions
		}
		// count number of expressions
		var n = 0;
		funcDef.forEachStatement(function onStatement(statement : Statement) : boolean {
			var cont = statement.forEachExpression( function onExpr(expr : Expression) : boolean {
				if (++n >= _InlineOptimizeCommand.INLINE_THRESHOLD) {
					return false;
				}
				return expr.forEachExpression(onExpr);
			});
			if (! cont) {
				return false;
			}
			return statement.forEachStatement(onStatement);
		});
		return n < _InlineOptimizeCommand.INLINE_THRESHOLD;
	}

	function _functionIsInlineable (funcDef : MemberFunctionDefinition) : boolean {
		var stash = this.getStash(funcDef) as _InlineOptimizeCommand.Stash;
		if (stash.isInlineable == null) {
			stash.isInlineable = function () : boolean {
				// only inline function that are short, has no branches (last statement may be a return)
				var statements = funcDef.getStatements();
				if (statements == null)
					return false;
				var requestsInline = (funcDef.flags() & ClassDefinition.IS_INLINE) != 0;
				if (requestsInline) {
					// ok
				} else if (! this._isWorthInline(funcDef)) {
					return false;
				}
				// no return in the middle, no function expression or super invocation expression, and no reference to the funciton itself
				return funcDef.forEachStatement(function onStatement(statement : Statement) : boolean {
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
					if (! statement.forEachExpression(function onExpr(expr : Expression) : boolean {
						if (expr instanceof FunctionExpression)
							return false;
						if (expr instanceof SuperExpression)
							return false;
						if (expr instanceof LocalExpression) {
							if (funcDef.getFuncLocal() != null && funcDef.getFuncLocal() == (expr as LocalExpression).getLocal()) {
									return false;
							}
						}
						return expr.forEachExpression(onExpr);
					})) {
						return false;
					}
					return statement.forEachStatement(onStatement);
				});
			}();
			this.log(funcDef.getNotation() + (stash.isInlineable ? " is" : " is not") + " inlineable");
		}
		return stash.isInlineable;
	}

	function _expandCallingFunction (callerFuncDef : MemberFunctionDefinition, statements : Statement[], stmtIndex : number, calleeFuncDef : MemberFunctionDefinition, argsAndThis : Expression[]) : number {
		// clone statements of the calling function, while rewriting the identifiers with actual arguments
		this.log("expanding " + calleeFuncDef.getNotation());
		var argsAndThisAndLocals = argsAndThis.concat(new Expression[]);
		stmtIndex = this._createVars(callerFuncDef, statements, stmtIndex, calleeFuncDef, argsAndThisAndLocals);
		var calleeStatements = calleeFuncDef.getStatements();
		for (var i = 0; i < calleeStatements.length; ++i) {
			// clone the statement (while rewriting last return statement to an expression statement)
			var statement = calleeStatements[i] instanceof ReturnStatement
			? new ExpressionStatement((calleeStatements[i] as ReturnStatement).getExpr().clone()) as Statement
			: calleeStatements[i].clone();
			// replace the arguments with actual arguments
			var onExpr = function onExpr(expr : Expression, replaceCb : function(:Expression):void) : boolean {
				return this._rewriteExpression(expr, replaceCb, argsAndThisAndLocals, calleeFuncDef);
			};
			statement.forEachExpression(onExpr);
			statement.forEachStatement(function onStatement(statement : Statement) : boolean {
				statement.forEachStatement(onStatement);
				return statement.forEachExpression(onExpr);
			});
			// insert the statement
			statements.splice(stmtIndex++, 0, statement);
		}
		return stmtIndex;
	}

	function _createVars (callerFuncDef : MemberFunctionDefinition, statements : Statement[], stmtIndex : number, calleeFuncDef : MemberFunctionDefinition, argsAndThisAndLocals : Expression[]) : number {
		// handle "this" first
		if ((calleeFuncDef.flags() & ClassDefinition.IS_STATIC) == 0) {
			var tempExpr = this._createVarForArgOrThis(callerFuncDef, statements, stmtIndex, argsAndThisAndLocals[argsAndThisAndLocals.length - 1], new ObjectType(calleeFuncDef.getClassDef()), "this");
			if (tempExpr != null) {
				argsAndThisAndLocals[argsAndThisAndLocals.length - 1] = tempExpr;
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
				var tempExpr = this._createVarForArgOrThis(callerFuncDef, statements, stmtIndex, argsAndThisAndLocals[i], formalArgs[i].getType(), formalArgs[i].getName().getValue());
				if (tempExpr != null) {
					argsAndThisAndLocals[i] = tempExpr;
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
	}

	function _getNumberOfTimesArgIsUsed (funcDef : MemberFunctionDefinition, local : ArgumentDeclaration) : number {
		var count = 0;
		funcDef.forEachStatement(function onStatement(statement : Statement) : boolean {
			statement.forEachStatement(onStatement);
			statement.forEachExpression(function onExpr(expr : Expression) : boolean {
				expr.forEachExpression(onExpr);
				if (expr instanceof LocalExpression && (expr as LocalExpression).getLocal() == local) {
					++count;
				}
				return true;
			});
			return true;
		});
		return count;
	}

	function _createVarForArgOrThis (callerFuncDef : MemberFunctionDefinition, statements : Statement[], stmtIndex : number, expr : Expression, type : Type, baseName : string) : LocalExpression {
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
	}

	function _rewriteExpression (expr : Expression, replaceCb : function(:Expression):void, argsAndThisAndLocals : Expression[], calleeFuncDef : MemberFunctionDefinition) : boolean {
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
		});
		return true;
	}

	function _functionHasThis (funcDef : MemberFunctionDefinition) : boolean {
		do {
			if ((funcDef.flags() & ClassDefinition.IS_STATIC) == 0)
				return true;
		} while ((funcDef = funcDef.getParent()) != null);
		return false;
	}

}

/*
  for the reasoning of this optimization see http://jsperf.com/if-vs-condexpr
*/
class _ReturnIfOptimizeCommand extends _FunctionOptimizeCommand {
	static const IDENTIFIER = "return-if";

	var _altered : boolean;

	function constructor () {
		super(_ReturnIfOptimizeCommand.IDENTIFIER);
	}

	override function optimizeFunction (funcDef : MemberFunctionDefinition) : boolean {
		if (funcDef.getReturnType().equals(Type.voidType))
			return false;

		this._altered = false;
		this._optimizeStatements(funcDef.getStatements());
		this.log(funcDef.getNotation() + " " + (this._altered ? "Y" : "N"));
		return this._altered;
	}

	function _statementsCanBeReturnExpr (statements : Statement[]) : boolean {
		if (statements.length == 1 && statements[0] instanceof ReturnStatement) {
			return true;
		}
		this._optimizeStatements(statements);
		if (statements.length == 1 && statements[0] instanceof ReturnStatement) {
			return true;
		}
		return false;
	}

	function _optimizeStatements (statements : Statement[]) : void {
		if (statements.length >= 1
		    && statements[statements.length - 1] instanceof IfStatement) {
			// optimize: if (x) return y; else return z;
			var ifStatement = statements[statements.length - 1] as IfStatement;
			if (this._statementsCanBeReturnExpr(ifStatement.getOnTrueStatements())
				&& this._statementsCanBeReturnExpr(ifStatement.getOnFalseStatements())) {
					statements[statements.length - 1] = this._createReturnStatement(
						ifStatement.getToken(),
						ifStatement.getExpr(),
						(ifStatement.getOnTrueStatements()[0] as ReturnStatement).getExpr(),
						(ifStatement.getOnFalseStatements()[0] as ReturnStatement).getExpr());
					this._altered = true;
					this._optimizeStatements(statements);
				}
		} else if (statements.length >= 2
			   && statements[statements.length - 1] instanceof ReturnStatement
			   && statements[statements.length - 2] instanceof IfStatement) {
			var ifStatement = statements[statements.length - 2] as IfStatement;
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
							(ifStatement.getOnTrueStatements()[0] as ReturnStatement).getExpr(),
							(statements[statements.length - 1] as ReturnStatement).getExpr()));
					this._altered = true;
					this._optimizeStatements(statements);
				} else if (onFalseStatements.length == 1
					   && onFalseStatements[0] instanceof IfStatement
					   && (onFalseStatements[0] as IfStatement).getOnFalseStatements().length == 0) {
					/*
					  handles the case below, by moving the last return statement into the (unseen) else clause
					  if (x) {
					  return 0;
					  } else if (y) {
					  return 1;
					  }
					  return 2;
					*/
					(onFalseStatements[0] as IfStatement).getOnFalseStatements().push(statements[statements.length - 1]);
					statements.pop();
					this._altered = true;
					this._optimizeStatements(statements);
				}
			}
		}
	}

	function _createReturnStatement (token : Token, condExpr : Expression, trueExpr : Expression, falseExpr : Expression) : Statement {
		return new ReturnStatement(
			token,
			new ConditionalExpression(
				new Token("?", false),
				condExpr,
				trueExpr,
				falseExpr,
				falseExpr.getType()));
	}

}

class _LCSECachedExpression {

	var _origExpr : Expression;
	var _replaceCb : function(:Expression):void;
	var _localExpr : LocalExpression;

	function constructor (origExpr : Expression, replaceCb : function(:Expression):void) {
		this._origExpr = origExpr;
		this._replaceCb = replaceCb;
		this._localExpr = null;
	}

	function getOrigExpr () : Expression {
		return this._origExpr;
	}

	function getLocalExpr (createVarCb : function(:Type,:string):LocalExpression) : LocalExpression {
		if (this._localExpr == null) {
			// rewrite the first occurence of the expression and update cache entry
			this._localExpr = createVarCb(this._origExpr.getType(), (this._origExpr as PropertyExpression).getIdentifierToken().getValue());
			this._replaceCb(new AssignmentExpression(new Token("=", false), this._localExpr, this._origExpr));
		}
		return this._localExpr;
	}

}

/**
 * Common Subexpression Elimination
 */
class _LCSEOptimizeCommand extends _FunctionOptimizeCommand {
	static const IDENTIFIER = "lcse";

	function constructor () {
		super(_LCSEOptimizeCommand.IDENTIFIER);
	}

	override function optimizeFunction (funcDef : MemberFunctionDefinition) : boolean {
		_Util.optimizeBasicBlock(funcDef, function (exprs) {
			this._optimizeExpressions(funcDef, exprs);
		});
		return true;
	}

	function _optimizeExpressions (funcDef : MemberFunctionDefinition, exprs : Expression[]) : void {
		this.log("optimizing expressions starting");

		var cachedExprs = new Map.<_LCSECachedExpression>;

		var getCacheKey = function (expr : Expression) : Nullable.<string> {
			if (expr instanceof PropertyExpression) {
                var propertyExpr = expr as PropertyExpression;
				var receiverType = propertyExpr.getExpr().getType();
				if (receiverType instanceof ObjectType && _Util.classIsNative(receiverType.getClassDef())) {
					return null;
				}
				var base = getCacheKey(propertyExpr.getExpr());
				if (base == null) {
					return null;
				}
				return base + "." + propertyExpr.getIdentifierToken().getValue();
			} else if (expr instanceof LocalExpression) {
				return (expr as LocalExpression).getLocal().getName().getValue();
			} else if (expr instanceof ThisExpression) {
				return "this";
			}
			return null;
		};

		var registerCacheable = function (key : string, expr : Expression, replaceCb : function(:Expression):void) : void {
			this.log("registering lcse entry for: " + key);
			cachedExprs[key] = new _LCSECachedExpression(expr, replaceCb);
		};

		var clearCacheByLocalName = function (name : string) : void {
			this.log("clearing lcse entry for local name: " + name);
			for (var k in cachedExprs) {
				if (k.substring(0, name.length + 1) == name + ".") {
					this.log("  removing: " + k);
					delete cachedExprs[k];
				}
			}
		};

		var clearCacheByPropertyName = function (name : string) : void {
			this.log("clearing lcse entry for property name: " + name);
			for (var k in cachedExprs) {
				var mayPreserve = function onExpr(expr : Expression) : boolean {
					if (expr instanceof LocalExpression
					    || expr instanceof ThisExpression) {
						return true;
					}
					// is PropertyExpression
					if ((expr as PropertyExpression).getIdentifierToken().getValue() == name) {
						return false;
					}
					return onExpr((expr as PropertyExpression).getExpr());
				}(cachedExprs[k].getOrigExpr());
				if (! mayPreserve) {
					this.log("  removing: " + k);
					delete cachedExprs[k];
				}
			}
		};

		var clearCache = function () : void {
			this.log("clearing lcse cache");
			cachedExprs = new Map.<_LCSECachedExpression>;
		};

		// add an expression to cache
		var onExpr = function (expr : Expression, replaceCb : function(:Expression):void) : boolean {
			// handle special cases first
			if (expr instanceof AssignmentExpression) {
                var assignmentExpr =expr as AssignmentExpression;
				var lhsExpr = assignmentExpr.getFirstExpr();
				if (lhsExpr instanceof LocalExpression) {
					onExpr(assignmentExpr.getSecondExpr(), function (expr) {
						assignmentExpr.setSecondExpr(expr);
					});
					clearCacheByLocalName((lhsExpr as LocalExpression).getLocal().getName().getValue());
				} else if (lhsExpr instanceof PropertyExpression) {
					var lhsPropertyExpr = lhsExpr as PropertyExpression;
					onExpr((lhsExpr as PropertyExpression).getExpr(), function (expr) {
						lhsPropertyExpr.setExpr(expr);
					});
					onExpr(assignmentExpr.getSecondExpr(), function (expr) {
							assignmentExpr.setSecondExpr(expr);
					});
					if (lhsPropertyExpr.getIdentifierToken().getValue() == "length") {
						// FIXME once we support caching array elements, we need to add special care
					} else {
						var cacheKey = getCacheKey(lhsExpr);
						if (cacheKey) {
							registerCacheable(cacheKey, lhsExpr, function (expr) {
								assignmentExpr.setFirstExpr(expr);
							});
						}
					}
				} else {
					clearCache();
				}
				return true;
			} else if (expr instanceof IncrementExpression) {
				var incrementExpr = expr as IncrementExpression;
				// optimize the receiver of LHS, and clear (for now)
				if (incrementExpr.getExpr() instanceof PropertyExpression) {
					var propertyExpr = incrementExpr.getExpr() as PropertyExpression;
					onExpr(propertyExpr.getExpr(), function (expr) {
						propertyExpr.setExpr(expr);
					});
				}
				clearCache();
				return true;
			} else if (expr instanceof ConditionalExpression) {
				var conditionalExpr = expr as ConditionalExpression;
				// only optimize the condExpr, then clear (for now)
				onExpr(conditionalExpr.getCondExpr(), function (expr) {
					conditionalExpr.setCondExpr(expr);
				});
				clearCache();
				return true;
			} else if (expr instanceof FunctionExpression) {
				clearCache();
				return true;
			} else if (expr instanceof CallExpression) {
				// optimize the receiver (not the function) and args, and clear
				var funcExpr = (expr as CallExpression).getExpr();
				if (funcExpr instanceof LocalExpression) {
					// nothing to do
				} else if (funcExpr instanceof PropertyExpression) {
					var propertyExpr = funcExpr as PropertyExpression;
					onExpr(propertyExpr.getExpr(), function (expr) {
						propertyExpr.setExpr(expr);
					});
				} else {
					clearCache();
				}
				var args = (expr as CallExpression).getArguments();
				for (var i = 0; i < args.length; ++i) {
					onExpr(args[i], function (args: Expression[], index : number) : function(:Expression):void {
						return function (expr) {
							args[index] = expr;
						};
					}(args, i));
				}
				clearCache();
				return true;
			} else if (expr instanceof NewExpression) {
				this.log("new expression");
				// optimize the args, and clear
				var args = (expr as NewExpression).getArguments();
				for (var i = 0; i < args.length; ++i) {
					onExpr(args[i], function (args : Expression[], index : number) : function(:Expression):void {
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
				if ((expr as PropertyExpression).getIdentifierToken().getValue() == "length") {
					// ditto as above comment for "length"
				}
				else {
					var cacheKey = getCacheKey(expr);
					if (cacheKey) {
						this.log("rewriting cse for: " + cacheKey);
						if (cachedExprs[cacheKey]) {
							replaceCb(
								cachedExprs[cacheKey].getLocalExpr(function (type, baseName) {
									var localVar = this.createVar(funcDef, type, baseName);
									return new LocalExpression(localVar.getName(), localVar);
								}
								).clone());
						} else {
							registerCacheable(cacheKey, expr, replaceCb);
						}
					}
				}
			}
			// recursive
			return expr.forEachExpression(onExpr);
		};
		Util.forEachExpression(onExpr, exprs);
	}

}


class _UnboxOptimizeCommand extends _FunctionOptimizeCommand {
	static const IDENTIFIER = "unbox";

	class Stash extends Stash {

		var canUnbox : Nullable.<boolean>;

		function constructor () {
			this.canUnbox = null;
		}

		override function clone () : Stash {
			var tmp = new _UnboxOptimizeCommand.Stash;
			tmp.canUnbox = this.canUnbox;
			return tmp;
		}

	}

	function constructor () {
		super(_UnboxOptimizeCommand.IDENTIFIER);
	}

	override function _createStash () : Stash {
		return new _UnboxOptimizeCommand.Stash();
	}

	override function optimizeFunction (funcDef : MemberFunctionDefinition) : boolean {
		if (funcDef.getStatements() == null) {
			return false;
		}
		var locals = funcDef.getLocals();
		// check all the locals that exist _now_, and remove ones that have been optimized
		for (var i = 0, iMax = locals.length; i < iMax;) {
			if (this._optimizeLocal(funcDef, locals[i])) {
				locals.splice(i, 1);
			} else {
				++i;
			}
		}
		return true;
	}

	function _optimizeLocal (funcDef : MemberFunctionDefinition, local : LocalVariable) : boolean {
		// preconditions
		if (! (local.getType() instanceof ObjectType)) {
			return false;
		}
		var classDef = local.getType().getClassDef();
		if (_Util.classIsNative(classDef)) {
			return false;
		}
		// determine if the local can be unboxed
		var foundNew = false;
		var onStatement = function (statement : Statement) : boolean {
			var onExpr = function (expr : Expression) : boolean {
				if (expr instanceof PropertyExpression) {
					var baseExpr = (expr as PropertyExpression).getExpr();
					if (baseExpr instanceof LocalExpression && (baseExpr as LocalExpression).getLocal() == local) {
						if (! (expr as PropertyExpression).getType().isAssignable()) {
							// is a call to member function
							return false;
						}
						// a property of the variable has been accessed, OK!
						return true;
					}
				} else if (expr instanceof LocalExpression) {
					if ((expr as LocalExpression).getLocal() == local) {
						// the variable has been accessed in a way other than those allowed above, FAIL!
						return false;
					}
				} else if (expr instanceof FunctionExpression) {
					// we need to look into the closure
					return (expr as FunctionExpression).getFuncDef().forEachStatement(onStatement);
				}
				return expr.forEachExpression(onExpr);
			};
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
			if (statement instanceof FunctionStatement) {
				(statement as FunctionStatement).getFuncDef().forEachStatement(onStatement);
			}
			if (! statement.forEachExpression(onExpr)) {
				return false;
			}
			return statement.forEachStatement(onStatement);
		};
		var canUnbox = funcDef.forEachStatement(onStatement);
		// doit
		if (canUnbox && foundNew) {
			this._unboxVariable(funcDef, local);
			return true;
		} else {
			return false;
		}
	}

	function _newExpressionCanUnbox (newExpr : Expression) : boolean {
		if ((newExpr.getType().getClassDef().flags() & ClassDefinition.IS_NATIVE) != 0) {
			return false;
		}
		var ctor = _DetermineCalleeCommand.getCallingFuncDef(newExpr);
		var stash = this.getStash(ctor) as _UnboxOptimizeCommand.Stash;
		if (stash.canUnbox != null) {
			return stash.canUnbox;
		}
		return stash.canUnbox = function () : boolean {
			if (ctor.getLocals().length != 0) {
				return false;
			}
			return ctor.forEachStatement(function (statement) {
				// only allow list of this.X = ...
				var assigned = new Map.<boolean>;
				if (! (statement instanceof ExpressionStatement)) {
					return false;
				}
				var expr = (statement as ExpressionStatement).getExpr();
				if (! (expr instanceof AssignmentExpression)) {
					return false;
				}
				var lhsExpr = (expr as AssignmentExpression).getFirstExpr();
				if (! (lhsExpr instanceof PropertyExpression && (lhsExpr as PropertyExpression).getExpr() instanceof ThisExpression)) {
					return false;
				}
				var propertyName = (lhsExpr as PropertyExpression).getIdentifierToken().getValue();
				if (assigned[propertyName]) {
					return false;
				}
				assigned[propertyName] = true;
				// check rhs
				return function onExpr(expr : Expression) : boolean {
					if (expr instanceof ThisExpression) {
						return false;
					} else if (expr instanceof FunctionExpression) {
						return false;
					}
					return expr.forEachExpression(onExpr);
				}((expr as AssignmentExpression).getSecondExpr());
			});
		}();
	}

	function _unboxVariable (funcDef : MemberFunctionDefinition, local : LocalVariable) : void {
		this.log("unboxing " + local.getName().getValue());

		// build map of propetyName => LocalVariable
		var variableMap = new Map.<LocalVariable>;
		local.getType().getClassDef().forEachClassFromBase(function (classDef) {
			classDef.forEachMemberVariable(function (member) {
				if ((member.flags() & (ClassDefinition.IS_STATIC | ClassDefinition.IS_ABSTRACT)) == 0) {
					variableMap[member.name()] = this.createVar(funcDef, member.getType(), local.getName().getValue() + "$" + member.name());
				}
				return true;
			});
			return true;
		});
		var createLocalExpressionFor = function (propertyName : string) : LocalExpression {
			if (! variableMap[propertyName]) {
				throw new Error("could not find local variable for property name: " + propertyName);
			}
			return new LocalExpression(variableMap[propertyName].getName(), variableMap[propertyName]);
		};

		var buildConstructingStatements = function (dstStatements : Statement[], dstStatementIndex : number, newExpr : NewExpression) : number {
			var ctor = _DetermineCalleeCommand.getCallingFuncDef(newExpr);
			ctor.forEachStatement(function (statement) {
				var propertyName = (((statement as ExpressionStatement).getExpr() as AssignmentExpression).getFirstExpr() as PropertyExpression).getIdentifierToken().getValue();
				var rhsExpr = ((statement as ExpressionStatement).getExpr() as AssignmentExpression).getSecondExpr().clone();
				var onExpr = function (expr : Expression, replaceCb : function(:Expression):void) : boolean {
					if (expr instanceof LocalExpression) {
						for (var argIndex = 0; argIndex < ctor.getArguments().length; ++argIndex) {
							if ((expr as LocalExpression).getLocal() == ctor.getArguments()[argIndex]) {
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
				};
				onExpr(rhsExpr, function (expr) {
					rhsExpr = expr;
				});
				dstStatements.splice(dstStatementIndex++, 0, new ExpressionStatement(
					new AssignmentExpression(new Token("=", false), createLocalExpressionFor(propertyName), rhsExpr)));
				return true;
			});
			return dstStatementIndex;
		};

		// rewrite the code
		var onStatements = function (statements : Statement[]) : boolean {
			for (var statementIndex = 0; statementIndex < statements.length;) {
				var onExpr = function (expr : Expression, replaceCb : function(:Expression):void) : boolean {
					if (expr instanceof PropertyExpression
					    && (expr as PropertyExpression).getExpr() instanceof LocalExpression
						&& ((expr as PropertyExpression).getExpr() as LocalExpression).getLocal() == local) {
							// rewrite local.prop
							replaceCb(createLocalExpressionFor((expr as PropertyExpression).getIdentifierToken().getValue()));
							return true;
						} else if (expr instanceof FunctionExpression) {
							return onStatements((expr as FunctionExpression).getFuncDef().getStatements());
						} else if (expr instanceof LocalExpression && (expr as LocalExpression).getLocal() == local) {
							throw new Error("logic flaw, unexpected pattern");
						}
					expr.forEachExpression(onExpr);
					return true;
				};
				if (statements[statementIndex] instanceof FunctionStatement) {
					onStatements((statements[statementIndex] as FunctionStatement).getFuncDef().getStatements());
					++statementIndex;
				} else {
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
			}
			return true;
		};
		onStatements(funcDef.getStatements());
	}

	function _statementIsConstructingTheLocal (statement : Statement, local : LocalVariable) : NewExpression {
		if (! (statement instanceof ExpressionStatement)) {
			return null;
		}
		var expr = (statement as ExpressionStatement).getExpr();
		if (! (expr instanceof AssignmentExpression)) {
			return null;
		}
		var lhsExpr = (expr as AssignmentExpression).getFirstExpr();
		if (! (lhsExpr instanceof LocalExpression)) {
			return null;
		}
		if ((lhsExpr as LocalExpression).getLocal() != local) {
			return null;
		}
		var rhsExpr = (expr as AssignmentExpression).getSecondExpr();
		if (! (rhsExpr instanceof NewExpression)) {
			return null;
		}
		return rhsExpr as NewExpression;
	}

}

class _ArrayLengthOptimizeCommand extends _FunctionOptimizeCommand {
	static const IDENTIFIER = "array-length";

	function constructor () {
		super(_ArrayLengthOptimizeCommand.IDENTIFIER);
	}

	override function optimizeFunction (funcDef : MemberFunctionDefinition) : boolean {
		funcDef.forEachStatement(function onStatement(statement : Statement) : boolean {
			statement.forEachStatement(onStatement);
			if (statement instanceof ForStatement) {
				var condExpr = (statement as ForStatement).getCondExpr();
				var arrayLocal = condExpr != null ? this._hasLengthExprOfLocalArray(condExpr) : null;
				if (arrayLocal != null) {
					this._optimizeArrayLength(funcDef, statement as ForStatement, arrayLocal);
				}
			}
			return true;
		});
		return true;
	}

	function _optimizeArrayLength(funcDef : MemberFunctionDefinition, statement : ForStatement, arrayLocal : LocalVariable)  : void {
		if (this._lengthIsUnmodifiedInExpr(statement.getCondExpr())
			&& this._lengthIsUnmodifiedInExpr(statement.getPostExpr())
			&& statement.forEachStatement(function (statement) { return this._lengthIsUnmodifiedInStatement(statement); })) {

			// optimize!
			this.log(funcDef.getNotation() + " optimizing .length at line " + statement.getToken().getLineNumber() as string);
			// create local var for array.length
			var lengthLocal = this.createVar(funcDef, Type.integerType, arrayLocal.getName().getValue() + "$len");
			// assign array.length to the local
			var assignToLocal =  new AssignmentExpression(
						new Token("=", false),
						new LocalExpression(new Token(lengthLocal.getName().getValue(), true), lengthLocal),
						new PropertyExpression(
							new Token(".", false),
							new LocalExpression(new Token(arrayLocal.getName().getValue(), true), arrayLocal),
							new Token("length", true),
							new Type[],
							lengthLocal.getType()));
			if (statement.getInitExpr() != null) {
				statement.setInitExpr(
					new CommaExpression(
						new Token(",", false),
						statement.getInitExpr(),
						assignToLocal));
			}
			else {
				statement.setInitExpr(assignToLocal);
			}

			// rewrite
			var onExpr = function (expr : Expression, replaceCb : function(:Expression):void) : boolean {
				if (expr instanceof PropertyExpression
					&& (expr as PropertyExpression).getIdentifierToken().getValue() == "length"
					&& (expr as PropertyExpression).getExpr() instanceof LocalExpression
					&& ((expr as PropertyExpression).getExpr() as LocalExpression).getLocal() == arrayLocal) {
						replaceCb(new LocalExpression(new Token(lengthLocal.getName().getValue(), true), lengthLocal));
					} else {
						expr.forEachExpression(onExpr);
					}
				return true;
			};
			statement.getCondExpr().forEachExpression(onExpr);
			statement.getPostExpr().forEachExpression(onExpr);
			statement.forEachStatement(function onStatement2(statement : Statement) : boolean {
				statement.forEachStatement(onStatement2);
				statement.forEachExpression(onExpr);
				return true;
			});
		}
	}

	function _hasLengthExprOfLocalArray (expr : Expression) : LocalVariable {
		var local = null : LocalVariable;
		expr.forEachExpression(function onExpr(expr : Expression) : boolean {
			if (expr instanceof PropertyExpression
			    && (expr as PropertyExpression).getIdentifierToken().getValue() == "length"
				&& (expr as PropertyExpression).getExpr() instanceof LocalExpression
				&& this._typeIsArray((expr as PropertyExpression).getExpr().getType().resolveIfNullable())) {
					local = ((expr as PropertyExpression).getExpr() as LocalExpression).getLocal();
					return false;
				}
			return expr.forEachExpression(onExpr);
		});
		return local;
	}

	function _lengthIsUnmodifiedInStatement (statement : Statement) : boolean {
		if (! statement.forEachStatement(function (statement) { return this._lengthIsUnmodifiedInStatement(statement); }))
			return false;
		return statement.forEachExpression(function (expr) { return this._lengthIsUnmodifiedInExpr(expr); });
	}

	function _lengthIsUnmodifiedInExpr (expr : Expression) : boolean {
		if (expr instanceof AssignmentExpression) {
			if (this._lhsMayModifyLength((expr as AssignmentExpression).getFirstExpr())) {
				return false;
			}
		} else if (expr instanceof CallExpression || expr instanceof SuperExpression) {
			return false;
		} else if (expr instanceof IncrementExpression) {
			if (this._lhsMayModifyLength((expr as IncrementExpression).getExpr())) {
				return false;
			}
		}
		return true;
	}

	function _lhsMayModifyLength (expr : Expression) : boolean {
		if (expr instanceof PropertyExpression && (expr as PropertyExpression).getIdentifierToken().getValue() == "length")
			return true;
		if (expr instanceof ArrayExpression)
			return true;
		var exprType = expr.getType().resolveIfNullable();
		if (exprType.equals(Type.variantType))
			return true;
		if (this._typeIsArray(exprType))
			return true;
		return false;
	}

	function _typeIsArray (type : Type) : boolean {
		if (! (type instanceof ObjectType))
			return false;
		var classDef = type.getClassDef();
		if (! (classDef instanceof InstantiatedClassDefinition))
			return false;
		return (classDef as InstantiatedClassDefinition).getTemplateClassName() == "Array";
	}

}

/**
 * Set JSX.DEBUG = false, where `if (JSX.DEBUG) { ... }` blocks will be
 * removed by "dce" optimization command.
 */
class _NoDebugCommand extends _OptimizeCommand {
	static const IDENTIFIER = "no-debug";

	class Stash extends Stash {
		var debugValue = true;

		override function clone () : Stash {
			var tmp = new _NoDebugCommand.Stash;
			tmp.debugValue = this.debugValue;
			return tmp;
		}
	}

	function constructor() {
		super(_NoDebugCommand.IDENTIFIER);
	}

	override function _createStash () : _NoDebugCommand.Stash {
		return new _NoDebugCommand.Stash();
	}

	override function performOptimization () : void {
		var stash = this.getStash(this.getCompiler().getEmitter()) as _NoDebugCommand.Stash;
		stash.debugValue = false;

		this.getCompiler().forEachClassDef(function (parser, classDef) {
			if (classDef.className() == "JSX") {
				classDef.forEachMemberVariable(function (memberVariable) {
					if (memberVariable.name() == "DEBUG"
							&& (memberVariable.flags() & ClassDefinition.IS_STATIC) != 0) {

						this.log("set JSX.DEBUG = " + stash.debugValue as  string);
						var falseExpr = new BooleanLiteralExpression(new Token(stash.debugValue as string, true));
						memberVariable.setInitialValue(falseExpr);
						return false;
					}
					return true;
				});
				return false;
			}
			return true;
		});
	}
}
