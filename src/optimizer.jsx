/*
 * Copyright (c) 2012,2013 DeNA Co., Ltd. et al.
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

	static function exprIsAssignment(expr : Expression) : boolean {
		return   expr instanceof AssignmentExpression
			    || expr instanceof FusedAssignmentExpression
			    || expr instanceof PreIncrementExpression
			    || expr instanceof PostIncrementExpression;
	}

	static function exprHasSideEffects (expr : Expression) : boolean {
		return expr.hasSideEffects(function precheck(expr) {
			if (expr instanceof CallExpression) {
				var callingFuncDef = _DetermineCalleeCommand.getCallingFuncDef(expr);
				if (callingFuncDef != null && (callingFuncDef.flags() & ClassDefinition.IS_PURE) != 0) {
					// is calling a pure function, check the arguments
					return ! expr.forEachExpression(function (expr) {
						return ! expr.hasSideEffects(precheck);
					});
				}
			}
			return null;
		});
	}

	static function conditionIsConstant (expr : Expression) : Nullable.<boolean> {
		function leafIsConstant (expr : Expression) : Nullable.<boolean> {
			if (expr instanceof NullExpression) {
				return false;
			} else if (expr instanceof BooleanLiteralExpression) {
				return (expr as BooleanLiteralExpression).getDecoded();
			} else if (expr instanceof StringLiteralExpression) {
				return (expr as StringLiteralExpression).getDecoded() as boolean;
			} else if (expr instanceof NumberLiteralExpression) {
				return (expr as NumberLiteralExpression).getDecoded() as boolean;
			} else if (expr instanceof IntegerLiteralExpression) {
				return (expr as IntegerLiteralExpression).getDecoded() as boolean;
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

	static function decodeNumericLiteral(expr : Expression) : number {
		assert expr instanceof NumberLiteralExpression || expr instanceof IntegerLiteralExpression;
		if (expr instanceof NumberLiteralExpression) {
			return (expr as NumberLiteralExpression).getDecoded();
		} else {
			return (expr as IntegerLiteralExpression).getDecoded();
		}
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
	var _log : string;
	var _dumpLogs : boolean;
	var _enableRunTimeTypeCheck : boolean;

	static function getReleaseOptimizationCommands() : string[] {
		return [
			"lto",
			"no-assert",
			"no-log",
			"no-debug",
			"fold-const",
			"tail-rec",
			"return-if",
			"inline",
			"dce",
			"unbox",
			"fold-const",
			"lcse",
			"dce",
			"fold-const",
			"array-length",
			"unclassify",
			"staticize"
		];
	}

	function constructor () {
		this._compiler = null;
		this._commands = new _OptimizeCommand[];
		this._log = "";
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
				determineCallee();
				this._commands.push(new _LCSEOptimizeCommand());
			} else if (cmd == "unbox") {
				determineCallee();
				this._commands.push(new _UnboxOptimizeCommand());
			} else if (cmd == "array-length") {
				this._commands.push(new _ArrayLengthOptimizeCommand());
			} else if (cmd == "tail-rec") {
				determineCallee();
				this._commands.push(new _TailRecursionOptimizeCommand());
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
				platform.error("fatal error: optimizer '" + this._commands[i]._identifier + "' died unexpectedly, dumping the logs" + this.dumpLogs());
				throw e;
			}
		}
		if (this._dumpLogs) {
			var platform = this._compiler.getPlatform();
			platform.warn(this.dumpLogs());
		}
	}

	function log (message : string) : void {
		this._log += message + "\n";
	}

	function dumpLogs () : string {
		return this._log;
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
		var newLocal = new LocalVariable(new Token(baseName + "$" + i as string, false), type, false);
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

mixin _StructuredStashAccessor.<T> {

	// 20140324 kazuho FIXME - suprisingly this "abstract var" does not work since the property is defined in the base class of the class using the mix-in
	// abstract var _identifier : string;

	function getStash(stashable : Stashable) : T {
		var identifier = (this as Object as _OptimizeCommand)._identifier;
		var stash = stashable.getStash(identifier) as T;
		if (stash == null) {
			stash = new T;
			stashable.setStash(identifier, stash);
		}
		return stash;
	}

	function resetStash(stashable : Stashable) : void {
		var identifier = (this as Object as _OptimizeCommand)._identifier;
		stashable.setStash(identifier, null);
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
				if (member instanceof TemplateFunctionDefinition) {
					return true;
				}

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

class _LinkTimeOptimizationCommand extends _OptimizeCommand implements _StructuredStashAccessor.<_LinkTimeOptimizationCommand.Stash> {
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

	override function performOptimization () : void {
		// set extendedBy for every class
		this.getCompiler().forEachClassDef(function (parser, classDef) {
			if (classDef.extendType() != null)
				this.getStash(classDef.extendType().getClassDef()).extendedBy.push(classDef);
			for (var i = 0; i < classDef.implementTypes().length; ++i)
				this.getStash(classDef.implementTypes()[i].getClassDef()).extendedBy.push(classDef);
			return true;
		});
		// mark classes / functions that are not derived / overridden / exported as final
		this.getCompiler().forEachClassDef(function (parser, classDef) {

			if ((classDef.flags() & (ClassDefinition.IS_INTERFACE | ClassDefinition.IS_MIXIN | ClassDefinition.IS_NATIVE | ClassDefinition.IS_FINAL | ClassDefinition.IS_EXPORT)) == 0
				&& this.getStash(classDef).extendedBy.length == 0) {

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
							var overrides = this._getOverrides(classDef, this.getStash(classDef).extendedBy, funcDef.name(), funcDef.getArgumentTypes());
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
		var overrides = this._getOverrides(srcClassDef, this.getStash(classDef).extendedBy, name, argTypes);
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

class _StripOptimizeCommand extends _OptimizeCommand implements _StructuredStashAccessor.<_StripOptimizeCommand._Stash> {
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

	function _touchStatic(member : MemberDefinition) : void {
		assert (member.flags() & ClassDefinition.IS_STATIC) != 0;
		var stash = this.getStash(member);
		if (stash.touched)
			return;
		this.log("touched " + member.getNotation());
		stash.touched = true;
		this._membersToWalk.push(member);
	}

	function _touchInstance(classDef : ClassDefinition) : void {
		var stash = this.getStash(classDef);
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
		// TODO do not emit member variables that are not used
		classDef.forEachMemberVariable(function (varDef) {
			if ((varDef.flags() & ClassDefinition.IS_STATIC) == 0) {
				this._membersToWalk.push(varDef);
			}
			return true;
		});
		if (classDef.extendType() != null) {
			this._touchInstance(classDef.extendType().getClassDef());
		}
		classDef.implementTypes().forEach(function (implementType) {
			this._touchInstance(implementType.getClassDef());
		});
		if (classDef.getOuterClassDef() != null) {
			this._touchInstance(classDef.getOuterClassDef());
		}
	}

	function _touchConstructor(funcDef : MemberFunctionDefinition) : void {
		assert funcDef.name() == "constructor";
		assert (funcDef.flags() & ClassDefinition.IS_STATIC) == 0;
		var stash = this.getStash(funcDef);
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
			var isTouched = this.getStash(member).touched;
			if ((member.flags() & ClassDefinition.IS_STATIC) != 0) {
				return isTouched;
			} else if (member instanceof MemberFunctionDefinition) {
				if (member.name() == "constructor") {
					return isTouched;
				} else {
					if (this.getStash(member.getClassDef()).touched
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
			// for now, all member variables are preserved, see _touchInstance
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
					&& ! this.getStash(classDefs[i]).touched
					&& classDefs[i].forEachMember(function (member) {
						if ((member.flags() & ClassDefinition.IS_STATIC) == 0)
							return true;
						return ! this.getStash(member).touched;
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
				var propertyExpr = expr as PropertyExpression;
				var holderClassDef = propertyExpr.getHolderType().getClassDef();
				if (propertyExpr.isClassSpecifier()) {
					if ((holderClassDef.flags() & ClassDefinition.IS_NATIVE) != 0) {
						this._touchInstance(holderClassDef);
					}
				}
				else {
					var name = propertyExpr.getIdentifierToken().getValue();
					if (propertyExpr.getExpr().isClassSpecifier()) {
						if (Util.isReferringToFunctionDefinition(propertyExpr)) {
							var member : MemberDefinition = Util.findFunctionInClass(
								holderClassDef,
								name,
								(expr.getType() as ResolvedFunctionType).getArgumentTypes(),
								true);
							assert member != null;
						} else {
							member = Util.findVariableInClass(holderClassDef, name, true);
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


class _DetermineCalleeCommand extends _FunctionOptimizeCommand implements _StructuredStashAccessor.<_DetermineCalleeCommand.Stash> {
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
					var newExpr = expr as NewExpression;
					assert newExpr.getType().getClassDef() != null;
					assert newExpr.getConstructor() != null;

					var callingFuncDef = _DetermineCalleeCommand.findCallingFunctionInClass(
						newExpr.getType().getClassDef(), "constructor", newExpr.getConstructor().getArgumentTypes(), false);
					if (callingFuncDef == null) {
						throw new Error("could not find matching constructor for " + newExpr.getConstructor().toString());
					}
					this._setCallingFuncDef(newExpr, callingFuncDef);
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
		this.getStash(stashable).callingFuncDef = funcDef;
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

class _StaticizeOptimizeCommand extends _OptimizeCommand implements _StructuredStashAccessor.<_StaticizeOptimizeCommand.Stash> {

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

	override function performOptimization () : void {

		function memberCanBeStaticized(funcDef : MemberFunctionDefinition) : boolean {
			// only allow non-override final methods
			if ((funcDef.flags() & (ClassDefinition.IS_OVERRIDE | ClassDefinition.IS_ABSTRACT | ClassDefinition.IS_FINAL | ClassDefinition.IS_STATIC | ClassDefinition.IS_NATIVE)) != ClassDefinition.IS_FINAL) {
				return false;
			}
			// and not constructors
			if (funcDef.name() == "constructor") {
				return false;
			}
			// and not methods using "super"
			function onStatement(statement : Statement) : boolean {
				if (statement instanceof FunctionStatement) {
					return (statement as FunctionStatement).getFuncDef().forEachStatement(onStatement);
				}
				return statement.forEachExpression(function onExpression(expr) {
					if (expr instanceof FunctionExpression) {
						return (expr as FunctionExpression).getFuncDef().forEachStatement(onStatement);
					} else if (expr instanceof SuperExpression) {
						return false;
					}
					return expr.forEachExpression(onExpression);
				}) && statement.forEachStatement(onStatement);
			}
			if (! funcDef.forEachStatement(onStatement)) {
				return false;
			}
			// and the rest can be staticized
			return true;
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

		var classDef = staticFuncDef.getClassDef();

		// rename
		var newName = this._newStaticFunctionName(classDef, funcDef.name(), ([ new ObjectType(classDef) ] : Type[]).concat((funcDef.getType() as ResolvedFunctionType).getArgumentTypes()), true);
		this.getStash(funcDef).altName = newName;
		staticFuncDef._nameToken = new Token(newName, true);

		// update flags
		staticFuncDef.setFlags((funcDef.flags() & ~ClassDefinition.IS_EXPORT) | ClassDefinition.IS_STATIC);

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

	function _newStaticFunctionName (classDef : ClassDefinition, baseName : string, argTypes : Type[], isStatic : boolean) : string {
		var index = 0;
		var newName = baseName;
		// search for a name which does not conflict with existing function
		while (Util.findFunctionInClass(classDef, newName, argTypes, isStatic) != null) {
			var newName = Util.format("%1_%2", [ baseName, index as string ]);
			++index;
		}
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
							if (funcDef != null && (newName = this.getStash(funcDef).altName) != null) {
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
				if (funcDef != null && (newName = this.getStash(funcDef).altName) != null) {
					// found, rewrite
					Util.forEachExpression(onExpr, superExpr.getArguments());
					var thisVar : Expression;
					if ((rewritingFuncDef.flags() & ClassDefinition.IS_STATIC) != 0) {
						// super expression in static function means that the function has been staticized
						var thisArg = rewritingFuncDef.getArguments()[0];
						assert thisArg != null, rewritingFuncDef.getNotation();
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

/**
 * Converts POD objects into Map objects + static methods.
 */
class _UnclassifyOptimizationCommand extends _OptimizeCommand implements _StructuredStashAccessor.<_UnclassifyOptimizationCommand.Stash> {

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
		// check that the class is not referred to by `instanceof` and `as`
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
						this.getStash(funcDef).inliner = inliner;
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
			function onRHSExpr(expr : Expression) : boolean {
				if (_Util.exprIsAssignment(expr)) {
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

class _FoldConstantCommand extends _FunctionOptimizeCommand implements _StructuredStashAccessor.<_FoldConstantCommand.Stash> {
	static const IDENTIFIER = "fold-const";

	static const LONG_STRING_LITERAL = 64;

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

	override function performOptimization () : void {
		super.performOptimization();
		this.getCompiler().forEachClassDef(function (parser, classDef) {
			if (classDef instanceof TemplateClassDefinition
				|| (classDef.flags() & ClassDefinition.IS_NATIVE) != 0) {
				return true;
			}
			classDef.forEachMemberVariable(function (varDef) {
				if ((varDef.flags() & ClassDefinition.IS_STATIC) != 0
					&& varDef.getInitialValue() != null) {
					this.log("starting optimization of " + varDef.getNotation());
					this._optimizeExpression(varDef.getInitialValue(), function (expr) { varDef.setInitialValue(expr); });
					this.log("finished optimization of " + varDef.getNotation());
				}
				return true;
			});
			return true;
		});
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
			var propertyExpr = expr as PropertyExpression;
			var holderType = propertyExpr.getHolderType();
			if (propertyExpr.getExpr().isClassSpecifier()) {
				var member = null : MemberVariableDefinition;
				holderType.getClassDef().forEachMemberVariable(function (m) {
					if (m.name() == propertyExpr.getIdentifierToken().getValue())
						member = m;
					return member == null;
				});
				if (member != null && (member.flags() & ClassDefinition.IS_CONST) != 0) {
					this._foldStaticConst(member);
					var foldedExpr = this._toFoldedExpr(member.getInitialValue(), member.getType());
					if (foldedExpr != null) {
						foldedExpr = this._toFoldedExpr(foldedExpr, propertyExpr.getType());
						if (foldedExpr != null && !(foldedExpr instanceof StringLiteralExpression && (foldedExpr as StringLiteralExpression).getDecoded().length > _FoldConstantCommand.LONG_STRING_LITERAL)) {
							this.log("folding property " + member.getNotation() + " at " + propertyExpr.getToken().getFilename() + ":" + propertyExpr.getToken().getLineNumber() as string);
							replaceCb(foldedExpr);
						}
					}
				}
			}
			else { // object property
				if (propertyExpr.getExpr() instanceof StringLiteralExpression) {
					if (propertyExpr.getIdentifierToken().getValue() == "length") {
						replaceCb(new NumberLiteralExpression(new Token(
							(propertyExpr.getExpr() as StringLiteralExpression).getDecoded().length as string
						)));
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
			var baseExpr = (expr as SignExpression).getExpr();
			if (baseExpr instanceof IntegerLiteralExpression) {
				this.log("folding operator (number) " + expr.getToken().getNotation());
				replaceCb(new IntegerLiteralExpression(new Token(
					calculateCb(_Util.decodeNumericLiteral(baseExpr)) as string
				)));
			} else if (baseExpr instanceof NumberLiteralExpression) {
				this.log("folding operator (number) " + expr.getToken().getNotation());
				replaceCb(new NumberLiteralExpression(new Token(
					calculateCb(_Util.decodeNumericLiteral(baseExpr)) as string
				)));
			}

		} else if (expr instanceof BitwiseNotExpression) {
			assert expr.getToken().getValue() == "~";
			var baseExpr = (expr as BitwiseNotExpression).getExpr();
			if (this._isIntegerOrNumberLiteralExpression(baseExpr)) {
				this.log("folding operator " + expr.getToken().getNotation());
				replaceCb(new IntegerLiteralExpression(new Token(
					(~ _Util.decodeNumericLiteral(baseExpr)) as string
				)));
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
								(firstExpr as StringLiteralExpression).getDecoded() +
								(secondExpr as StringLiteralExpression).getDecoded()),
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
		else if (expr instanceof CallExpression) {
			var callExpr = expr as CallExpression;
			if (callExpr.getExpr() instanceof PropertyExpression) {
				var allArgsAreConstants = true;
				callExpr.getArguments().forEach((expr) -> {
					if (!(     expr instanceof IntegerLiteralExpression
							|| expr instanceof NumberLiteralExpression
							|| expr instanceof BooleanLiteralExpression
							|| expr instanceof StringLiteralExpression
						)) {
						allArgsAreConstants = false;
					}
				});

				if (allArgsAreConstants) {
					this._foldCallExpression(callExpr, replaceCb);
				}
			}
		}

		return true;
	}

	// fold pure native functions
	function _foldCallExpression (callExpr : CallExpression, replaceCb : function(:Expression):void) : void {
		assert callExpr.getExpr() instanceof PropertyExpression;

		var propertyExpr = callExpr.getExpr() as PropertyExpression;
		var holderType = propertyExpr.getHolderType();

		if ((holderType.getClassDef().flags() & ClassDefinition.IS_NATIVE) == 0) {
			return;
		}

		var argExprs = callExpr.getArguments();

		var member = null : MemberFunctionDefinition;
		holderType.getClassDef().forEachMemberFunction(function (m) {
			if (m.name() == propertyExpr.getIdentifierToken().getValue())
				member = m;
			return member == null;
		});

		if (member != null && (member.flags() & ClassDefinition.IS_PURE) == 0) {
			return;
		}

		if (propertyExpr.getExpr().isClassSpecifier()) {
			// class methods

			if (holderType.getClassDef().classFullName() == "Math") {
				// fold pure Math functions
				switch(propertyExpr.getIdentifierToken().getValue()) {
				case "sqrt":
					this.log("folding " + member.getNotation());
					replaceCb(new NumberLiteralExpression(new Token(
						Math.sqrt(_Util.decodeNumericLiteral(argExprs[0])) as string)));
					break;
				case "log":
					this.log("folding " + member.getNotation());
					replaceCb(new NumberLiteralExpression(new Token(
						Math.log(_Util.decodeNumericLiteral(argExprs[0])) as string)));
					break;
				case "pow":
					this.log("folding " + member.getNotation());
					replaceCb(new NumberLiteralExpression(new Token(
						Math.pow(_Util.decodeNumericLiteral(argExprs[0]), _Util.decodeNumericLiteral(argExprs[1])) as string)));
					break;
				case "sin":
					this.log("folding " + member.getNotation());
					replaceCb(new NumberLiteralExpression(new Token(
						Math.sin(_Util.decodeNumericLiteral(argExprs[0])) as string)));
					break;
				case "cos":
					this.log("folding " + member.getNotation());
					replaceCb(new NumberLiteralExpression(new Token(
						Math.cos(_Util.decodeNumericLiteral(argExprs[0])) as string)));
					break;
				}
			}
			if (holderType.getClassDef().classFullName() == "String") {
				switch(propertyExpr.getIdentifierToken().getValue()) {
				case "fromCharCode":
					this.log("folding " + member.getNotation());
					var s = "";
					argExprs.forEach((arg) -> {
						s += String.fromCharCode(_Util.decodeNumericLiteral(arg));
					});
					replaceCb(new StringLiteralExpression(new Token(
						Util.encodeStringLiteral(s))));
					break;
				}
			}
		}
		else if (propertyExpr.getExpr() instanceof StringLiteralExpression) {
			// fold pure String functions
			switch(propertyExpr.getIdentifierToken().getValue()) {
			case "charCodeAt":
				this.log("folding " + member.getNotation());
				var recvStr = (propertyExpr.getExpr() as StringLiteralExpression).getDecoded();
				replaceCb(new NumberLiteralExpression(new Token(
					recvStr.charCodeAt(_Util.decodeNumericLiteral(argExprs[0])) as string)));
				break;
			}
		}
	}

	function _foldEqualityExpression (expr : EqualityExpression, replaceCb : function(:Expression):void) : void {
		var firstExpr = expr.getFirstExpr();
		var secondExpr = expr.getSecondExpr();
		var isEqual = null : Nullable.<boolean>; // tri-state

		// NOTE: such condition is not allowed at source-level, but is generated by the const-folding of JSX.ENV (or maybe by the optimizer itself?)
		function isNullVsPrimitiveLiteral(x : Expression, y : Expression) : boolean {
			return x instanceof NullExpression && y instanceof PrimitiveLiteralExpression;
		}

		if (firstExpr instanceof NullExpression && secondExpr instanceof NullExpression) {
			isEqual = true;
		} else if (isNullVsPrimitiveLiteral(firstExpr, secondExpr) || isNullVsPrimitiveLiteral(secondExpr, firstExpr)) {
			isEqual = false;
		} else if (firstExpr instanceof StringLiteralExpression && secondExpr instanceof StringLiteralExpression) {
			isEqual = (firstExpr as StringLiteralExpression).getDecoded() == (secondExpr as StringLiteralExpression).getDecoded();
		} else if (this._isIntegerOrNumberLiteralExpression(firstExpr) && this._isIntegerOrNumberLiteralExpression(secondExpr)) {
			isEqual = _Util.decodeNumericLiteral(firstExpr) == _Util.decodeNumericLiteral(secondExpr);
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
			return expr instanceof NumberLiteralExpression && (expr as NumberLiteralExpression).getDecoded() == 0;
		}
		function exprIsOne(expr : Expression) : boolean {
			return expr instanceof NumberLiteralExpression && (expr as NumberLiteralExpression).getDecoded() == 1;
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
		case "+": this._foldNumericBinaryExpressionAsNumeric(expr, replaceCb, ((x, y) -> x + y), ((x, y) -> x + y)); break;
		case "-": this._foldNumericBinaryExpressionAsNumeric(expr, replaceCb, ((x, y) -> x - y), ((x, y) -> x - y)); break;
		case "*": this._foldNumericBinaryExpressionAsNumeric(expr, replaceCb, ((x, y) -> x * y), ((x, y) -> x * y)); break;

			// expressions that always return number
		case "/": this._foldNumericBinaryExpressionAsNumber(expr, replaceCb, function (x, y) { return x / y; }); break;
		case "%": this._foldNumericBinaryExpressionAsNumber(expr, replaceCb, ((x, y) -> x % y)); break;

			// expressions that always return integer
		case ">>>": this._foldNumericBinaryExpressionAsInteger(expr, replaceCb, function (x, y) { return x >>> y; }); break;
		case ">>": this._foldNumericBinaryExpressionAsInteger(expr, replaceCb, function (x, y) { return x >> y; }); break;
		case "<<": this._foldNumericBinaryExpressionAsInteger(expr, replaceCb, function (x, y) { return x << y; }); break;
		case "&": this._foldNumericBinaryExpressionAsInteger(expr, replaceCb, function (x, y) { return x & y; }); break;
		case "|": this._foldNumericBinaryExpressionAsInteger(expr, replaceCb, function (x, y) { return x | y; }); break;
		case "^": this._foldNumericBinaryExpressionAsInteger(expr, replaceCb, function (x, y) { return x ^ y; }); break;

		// expressions that always return boolean
		case "<": this._foldNumericBinaryExpressionAsBoolean(expr, replaceCb, function (x, y) { return x < y; }); break;
		case "<=": this._foldNumericBinaryExpressionAsBoolean(expr, replaceCb, function (x, y) { return x <= y; }); break;
		case ">": this._foldNumericBinaryExpressionAsBoolean(expr, replaceCb, function (x, y) { return x > y; }); break;
		case ">=": this._foldNumericBinaryExpressionAsBoolean(expr, replaceCb, function (x, y) { return x >= y; }); break;
		default:
			return false;
		}
		return true;
	}

	function _foldNumericBinaryExpressionAsNumeric (expr : BinaryExpression, replaceCb : function(:Expression):void, calcCbInt : function (:int, :int):int, calcCbNumber : function(:number,:number):number) : void {
		if (expr.getFirstExpr() instanceof IntegerLiteralExpression && expr.getSecondExpr() instanceof IntegerLiteralExpression) {
			this._foldNumericBinaryExpressionAsInteger(expr, replaceCb, calcCbInt);
		} else {
			this._foldNumericBinaryExpressionAsNumber(expr, replaceCb, calcCbNumber);
		}
	}

	function _foldNumericBinaryExpressionAsInteger (expr : BinaryExpression, replaceCb : function(:Expression):void, calcCb : function(:int,:int):int) : void {
		var value : number = calcCb(_Util.decodeNumericLiteral(expr.getFirstExpr()), _Util.decodeNumericLiteral(expr.getSecondExpr()));
		this.log(
			"folding operator " + expr.getToken().getNotation() +
			" to int: " + value as string);
		if (value != (value | 0))
			throw new Error("value is not an integer");
		replaceCb(new IntegerLiteralExpression(new Token(value as string)));
	}

	function _foldNumericBinaryExpressionAsNumber (expr : BinaryExpression, replaceCb : function(:Expression):void, calcCb : function(:number,:number):number) : void {
		var value = calcCb(_Util.decodeNumericLiteral(expr.getFirstExpr()), _Util.decodeNumericLiteral(expr.getSecondExpr()));
		this.log(
			"folding operator " + expr.getToken().getNotation() +
			" to number: " + value as string);
		replaceCb(new NumberLiteralExpression(new Token(value as string)));
	}

	function _foldNumericBinaryExpressionAsBoolean (expr : BinaryExpression, replaceCb : function(:Expression):void, calcCb : function(:number,:number):boolean) : void {
		var value = calcCb(_Util.decodeNumericLiteral(expr.getFirstExpr()), _Util.decodeNumericLiteral(expr.getSecondExpr()));
		this.log(
			"folding operator " + expr.getToken().getNotation() +
			" to boolean: " + value as string);
		replaceCb(new BooleanLiteralExpression(new Token(value as string)));
	}

	function _isIntegerOrNumberLiteralExpression (expr : Expression) : boolean {
		return expr instanceof NumberLiteralExpression || expr instanceof IntegerLiteralExpression;
	}

	function _foldStaticConst (member : MemberVariableDefinition) : void {
		var stash = this.getStash(member);
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
				return new IntegerLiteralExpression(new Token(((expr as NumberLiteralExpression).getDecoded() as int) as string));
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
			else if (baseExpr instanceof PrimitiveLiteralExpression) {
				this.log("folding type cast: primitive literal as string");
				replaceCb(
					new StringLiteralExpression(
						new Token(Util.encodeStringLiteral((baseExpr as PrimitiveLiteralExpression).toNormalizedString()), false)));
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
						new Token((baseExpr as StringLiteralExpression).getDecoded() as number as string, false)));
			}
			else if (baseExpr instanceof IntegerLiteralExpression) {
				this.log("folding type cast: int literal as number");
				replaceCb(
					new NumberLiteralExpression(
						new Token((baseExpr as StringLiteralExpression).getDecoded() as number as string, false)));
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
						new Token((baseExpr as StringLiteralExpression).getDecoded() as int as string, false)));
			}
			else if (baseExpr instanceof NumberLiteralExpression) {
				this.log("folding type cast: number literal as int");
				replaceCb(
					new IntegerLiteralExpression(
						new Token((baseExpr as NumberLiteralExpression).getDecoded() as int as string, false)));
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
						new Token((baseExpr as StringLiteralExpression).getDecoded() as boolean as string, false)));
			}
			else if (baseExpr instanceof NumberLiteralExpression) {
				this.log("folding type cast: number literal as boolean");
				replaceCb(
					new BooleanLiteralExpression(
						new Token((baseExpr as NumberLiteralExpression).getDecoded() ? "true" : "false", false)));
			}
			else if (baseExpr instanceof IntegerLiteralExpression) {
				this.log("folding type cast: integer literal as boolean");
				replaceCb(
					new BooleanLiteralExpression(
						new Token((baseExpr as IntegerLiteralExpression).getDecoded() ? "true" : "false", false)));
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
				if (statements[i] instanceof ExpressionStatement && ! _Util.exprHasSideEffects((statements[i]as ExpressionStatement).getExpr())) {
					shouldRetry = true;
					statements.splice(i, 1);
				}
				else {
					if ((statements[i] instanceof ExpressionStatement)) {
						this._optimizeExprInVoid((statements[i] as ExpressionStatement).getExpr(), function (expr) {
							statements[i] = new ExpressionStatement(expr);
						});
					}
					statements[i++].handleStatements(onStatements);
				}
			}
			return true;
		})(funcDef.getStatements());
		return shouldRetry;
	}

	function _optimizeExprInVoid(expr : Expression, replaceCb : function(:Expression) : void) : void {
		// cond ? iftrue : iffalse; which results in inline expansion
		if(expr instanceof ConditionalExpression) {
			var condExpr = expr as ConditionalExpression;
			var ifTrueHasSideEffect = _Util.exprHasSideEffects(condExpr.getIfTrueExpr());
			var ifFalseHasSideEffect = _Util.exprHasSideEffects(condExpr.getIfFalseExpr());
			if (ifTrueHasSideEffect && ifFalseHasSideEffect) {
				// nothing to do
			}
			else if (ifTrueHasSideEffect && !ifFalseHasSideEffect) {
				// f() : g() : true; -> f() && g();
				var condAndIfTrue = new LogicalExpression(new Token("&&"), condExpr.getCondExpr(), condExpr.getIfTrueExpr());
				replaceCb(condAndIfTrue);
			}
			else if (!ifTrueHasSideEffect && ifFalseHasSideEffect) {
				// f() : true : g(); -> f() || g();
				var condOrIfFalse= new LogicalExpression(new Token("||"), condExpr.getCondExpr(), condExpr.getIfFalseExpr());
				replaceCb(condOrIfFalse);
			}
			else {
				// f() ? true : false; -> f();
				replaceCb(condExpr.getCondExpr());
			}
		}
		// ! expr; which results in inline expansion
		else if (expr instanceof LogicalNotExpression) {
			replaceCb((expr as LogicalNotExpression).getExpr());
		}
	}

	function _optimizeFunction (funcDef : MemberFunctionDefinition) : boolean {
		// use the assignment source, if possible
		_Util.optimizeBasicBlock(funcDef, function (exprs : Expression[]) : void {
			this._eliminateDeadStoresToProperties(funcDef, exprs);
			this._delayAssignmentsBetweenLocals(funcDef, exprs);
			this._eliminateDeadStores(funcDef, exprs);
			this._eliminateDeadConditions(funcDef, exprs);
		});

		return this._eliminateUnusedVariables(funcDef);
	}

	function _eliminateUnusedVariables(funcDef : MemberFunctionDefinition) : boolean {
		var shouldRetry = false;

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
					&& (expr as AssignmentExpression).getFirstExpr().getType().equals((expr as AssignmentExpression).getSecondExpr().getType())
				) {
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
		for (var localIndex = localsUsed.length - 1; localIndex >= 0; --localIndex) {
			if (localsUsed[localIndex]) {
				continue;
			}
			// remove assignment to the variable
			(function onStatements(statements : Statement[]) : boolean {
				for (var i = 0; i < statements.length;) {
					var statement = statements[i];
					if (statement instanceof FunctionStatement) {
						var localFuncDef = (statement as FunctionStatement).getFuncDef();
						onStatements(localFuncDef.getStatements());
						if (localFuncDef.getFuncLocal() == locals[localIndex]) {
							this.log("removing definition of " + locals[localIndex].getName().getNotation());
							funcDef.getClosures().splice(funcDef.getClosures().indexOf(localFuncDef), 1);
							statements.splice(i, 1);
						}
						else {
							i++;
						}
					}
					else {
						i++;
					}
					statement.forEachExpression(function onExpr(expr, replaceCb) {
						if (expr instanceof AssignmentExpression
							&& (expr as AssignmentExpression).getFirstExpr() instanceof LocalExpression
							&& ((expr as AssignmentExpression).getFirstExpr() as LocalExpression).getLocal() == locals[localIndex]
						) {
							this.log("removing assignment to " + locals[localIndex].getName().getNotation());
							var rhsExpr = (expr as AssignmentExpression).getSecondExpr();
							replaceCb(rhsExpr);
							shouldRetry = true;
							return rhsExpr.forEachExpression(onExpr);
						} else if (expr instanceof LocalExpression && (expr as LocalExpression).getLocal() == locals[localIndex]) {
							throw new Error("logic flaw, found a variable going to be removed being used");
						} else if (expr instanceof FunctionExpression) {
							onStatements((expr as FunctionExpression).getFuncDef().getStatements());
						}
						return expr.forEachExpression(onExpr);
					});

					_Util.handleSubStatements(onStatements, statement);
				}
				return true;
			}(funcDef.getStatements()));
			locals.splice(localIndex, 1);
		}
		return shouldRetry;
	}

	function _delayAssignmentsBetweenLocals (funcDef : MemberFunctionDefinition, exprs : Expression[]) : void {
		// find forms localA = localB, and rewrite the use of localA to localB
		var localsUntouchable = new TypedMap.<LocalVariable,boolean>;
		var locals = new TypedMap.<LocalVariable,Expression>;
		// mark the locals that uses op= (cannot be eliminated by the algorithm applied laterwards)
		Util.forEachExpression(function onExpr(expr : Expression) : boolean {
			if (expr instanceof FusedAssignmentExpression
				&& (expr as FusedAssignmentExpression).getFirstExpr() instanceof LocalExpression) {
					var local = ((expr as FusedAssignmentExpression).getFirstExpr() as LocalExpression).getLocal();
					this.log("local variable " + local.getName().getValue() + " cannot be rewritten (has fused assignment)");
					localsUntouchable.set(local, true);
				} else if (expr instanceof IncrementExpression
					&& (expr as IncrementExpression).getExpr() instanceof LocalExpression) {
					var local = ((expr as IncrementExpression).getExpr() as LocalExpression).getLocal();
					this.log("local variable " + local.getName().getValue() + " cannot be rewritten (has increment)");
					localsUntouchable.set(local, true);
				}
			return expr.forEachExpression(onExpr);
		}, exprs);
		// rewrite the locals
		Util.forEachExpression(function onExpr(expr : Expression, replaceCb : function(:Expression):void) : boolean {
			if (expr instanceof AssignmentExpression) {
				var assignmentExpr = expr as AssignmentExpression;
				if (assignmentExpr.getFirstExpr() instanceof LocalExpression) {
					onExpr(assignmentExpr.getSecondExpr(), function (expr) {
						assignmentExpr.setSecondExpr(expr);
					});
					if (! localsUntouchable.get((assignmentExpr.getFirstExpr() as LocalExpression).getLocal())
						&& (assignmentExpr.getFirstExpr() as LocalExpression).getType().equals(assignmentExpr.getSecondExpr().getType())) {
						var lhsLocal = (assignmentExpr.getFirstExpr() as LocalExpression).getLocal();
						this.log("resetting cache for: " + lhsLocal.getName().getNotation());
						locals.reversedForEach(function(local, expr) {
							if (local == lhsLocal) {
								this.log("  clearing itself");
								locals.delete(local);
							} else if (expr instanceof LocalExpression && (expr as LocalExpression).getLocal() == lhsLocal) {
								this.log("  clearing " + local.getName().getNotation());
								locals.delete(local);
							}
							return true;
						});
						if (assignmentExpr.getToken().getValue() == "=") {
							var rhsExpr = assignmentExpr.getSecondExpr();
							if (rhsExpr instanceof LocalExpression) {
								var rhsLocal = (rhsExpr as LocalExpression).getLocal();
								if (lhsLocal != rhsLocal && ! localsUntouchable.get(rhsLocal)) {
									this.log("  set to: " + rhsLocal.getName().getNotation());
									locals.set(lhsLocal, rhsExpr);
								}
							} else if (rhsExpr instanceof LeafExpression) {
								this.log("  set to: " + rhsExpr.getToken().getNotation());
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
		}, exprs);
	}

	function _eliminateDeadStores (funcDef : MemberFunctionDefinition, exprs : Expression[]) : void {
		var lastAssignExpr = new TypedMap.<LocalVariable, Pair.<AssignmentExpression, function(:Expression):void>>;
		function onExpr(expr : Expression, rewriteCb : function(:Expression):void) : boolean {
			if (expr instanceof AssignmentExpression) {
				var assignExpr = expr as AssignmentExpression;
				if (assignExpr.getFirstExpr() instanceof LocalExpression) {
					onExpr(assignExpr.getSecondExpr(), function (assignExpr : AssignmentExpression) : function(:Expression):void {
						return function (expr) {
							assignExpr.setSecondExpr(expr);
						};
					}(assignExpr));
					var lhsLocal = (assignExpr.getFirstExpr() as LocalExpression).getLocal();
					var lastAssign = lastAssignExpr.get(lhsLocal);
					if (lastAssign) {
						this.log("eliminating dead store to: " + lhsLocal.getName().getValue());
						lastAssign.second(lastAssign.first.getSecondExpr());
					}
					lastAssignExpr.set(lhsLocal, Util.makePair(assignExpr, rewriteCb));
					return true;
				}
			} else if (expr instanceof LocalExpression) {
				lastAssignExpr.delete((expr as LocalExpression).getLocal());
			} else if (expr instanceof LogicalExpression || expr instanceof ConditionalExpression) {
				expr.forEachExpression(function (expr, rewriteCb) {
					var result = onExpr(expr, rewriteCb);
					lastAssignExpr.clear();
					return result;
				});
				return true;
			} else if (_Util.exprHasSideEffects(expr)) {
				expr.forEachExpression(onExpr);
				lastAssignExpr.clear();
				return true;
			}
			return expr.forEachExpression(onExpr);
		}
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
				if (isFirstLevelPropertyAccess(firstExpr)
					&& ! Util.rootIsNativeClass((firstExpr as PropertyExpression).getExpr().getType())) {
					var propertyName = (firstExpr as PropertyExpression).getIdentifierToken().getValue();
					onExpr(assignmentExpr.getSecondExpr(), null);
					if (lastAssignExpr[propertyName]
							&& lastAssignExpr[propertyName].second != null
							&& baseExprsAreEqual((firstExpr as PropertyExpression).getExpr(), (lastAssignExpr[propertyName].first.getFirstExpr() as PropertyExpression).getExpr())) {
						lastAssignExpr[propertyName].second(lastAssignExpr[propertyName].first.getSecondExpr());
					}
					lastAssignExpr[propertyName] = Util.makePair(assignmentExpr, rewriteCb);
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

	// handle if statements and conditional operators
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


class _InlineOptimizeCommand extends _FunctionOptimizeCommand implements _StructuredStashAccessor.<_InlineOptimizeCommand.Stash> {
	static const IDENTIFIER = "inline";

	// NOTE: 30-40 looks good according to v8bench
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

	override function optimizeFunction (funcDef : MemberFunctionDefinition) : boolean {
		var stash = this.getStash(funcDef);
		// we need to the check here since functions might recurse
		if (stash.isOptimized)
			return true;
		stash.isOptimized = true;

		if (funcDef.getStatements() == null)
			return true;
		while (true) {
			while (true) {
				if (! this._handleStatements(funcDef, funcDef.getStatements()))
					break;
				(this.setupCommand(new _DetermineCalleeCommand()) as _DetermineCalleeCommand).optimizeFunction(funcDef);
			}
			if (! (this.setupCommand(new _ReturnIfOptimizeCommand()) as _ReturnIfOptimizeCommand).optimizeFunction(funcDef))
				break;
		}
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

		// expand complicated functions
		if (statement instanceof ConstructorInvocationStatement) {

			var callingFuncDef = _DetermineCalleeCommand.getCallingFuncDef(statement);
			this.log("optimizing calling constructor " + callingFuncDef.getNotation());
			this.optimizeFunction(callingFuncDef);
			if (this._functionIsInlineable(callingFuncDef) && this._argsAreInlineable(callingFuncDef, (statement as ConstructorInvocationStatement).getArguments())) {
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
				if (statements[stmtIndex - 1] instanceof ReturnStatement) {
					statements[stmtIndex - 1] = new ReturnStatement(statement.getToken(), (statements[stmtIndex - 1] as ReturnStatement).getExpr());
				} else if (statements[stmtIndex - 1] instanceof ExpressionStatement) {
					statements[stmtIndex - 1] = new ReturnStatement(statement.getToken(), (statements[stmtIndex - 1] as ExpressionStatement).getExpr());
				}
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

		// expand single-statement functions as an expression
		if (! altered) {
			statement.forEachExpression(function onExpr(expr : Expression, replaceCb : function(:Expression):void) : boolean {
				expr.forEachExpression(onExpr);
				if (expr instanceof CallExpression) {
					var callExpr = expr as CallExpression;
					var argsAndThis = this._getArgsAndThisIfCallExprIsInlineable(callExpr);
					if (argsAndThis != null) {
						if (this._expandCallAsExpression(funcDef, expr, argsAndThis, replaceCb)) {
							altered = true;
						}
					}
				}
				return true;
			});
		}

		return altered;
	}

	// returns a map containing the use count for each formal argument (and "this"), or -Infinity if the arg is used as LHS
	function _countNumberOfArgsUsed(funcDef : MemberFunctionDefinition) : Map.<number> {
		var formalArgs = new TypedMap.<LocalVariable, boolean>;
		var map = new Map.<number>;

		funcDef.getArguments().forEach((formalArg) -> {
			formalArgs.set(formalArg, true);
			map[formalArg.getName().getValue()] = 0;
		});
		map["this"] = 0;

		function updateCountOfLocal(local : LocalVariable, delta : number) : void {
			if (formalArgs.has(local)) {
				map[local.getName().getValue()] += delta;
			}
		}

		funcDef.forEachStatement(function onStatement(statement : Statement) : boolean {
			statement.forEachStatement(onStatement);
			statement.forEachExpression(function onExpr(expr : Expression) : boolean {
				expr.forEachExpression(onExpr);
				if (expr instanceof LocalExpression) {
					updateCountOfLocal((expr as LocalExpression).getLocal(), 1);
				} else if (expr instanceof AssignmentExpression
					|| expr instanceof FusedAssignmentExpression) {
					var assignExpr = expr as BinaryExpression;
					if (assignExpr.getFirstExpr() instanceof LocalExpression) {
						updateCountOfLocal((assignExpr.getFirstExpr() as LocalExpression).getLocal(), -Infinity);
					}
				} else if (expr instanceof IncrementExpression) {
					var incrExpr = expr as IncrementExpression;
					if (incrExpr.getExpr() instanceof LocalExpression) {
						updateCountOfLocal((incrExpr.getExpr() as LocalExpression).getLocal(), -Infinity);
					}
				} else if (expr instanceof ThisExpression) {
					map["this"]++;
				}
				return true;
			});
			return true;
		});

		return map;
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
			var args = this._getArgsAndThisIfCallExprIsInlineable(expr as CallExpression);
			if (args != null) {
				stmtIndex = this._expandCallingFunction(funcDef, statements, stmtIndex, _DetermineCalleeCommand.getCallingFuncDef(expr), args);
				cb(stmtIndex);
				return true;
			}

		} else if (expr instanceof AssignmentExpression
			&& ! (expr as AssignmentExpression).getFirstExpr().hasSideEffects()
			&& (expr as AssignmentExpression).getSecondExpr() instanceof CallExpression) {

			// inline if the statement is an assignment of a single call expression into a local variable
			var args = this._getArgsAndThisIfCallExprIsInlineable((expr as AssignmentExpression).getSecondExpr() as CallExpression);
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

	function _getArgsAndThisIfCallExprIsInlineable (callExpr : CallExpression) : Expression[] {
		// determine the function that will be called
		var callingFuncDef = _DetermineCalleeCommand.getCallingFuncDef(callExpr);
		if (callingFuncDef == null)
			return null;
		// optimize the calling function prior to testing the conditions
		this.log("optimizing calling function " + callingFuncDef.getNotation());
		this.optimizeFunction(callingFuncDef);
		// obtain receiver expression
		var receiverExpr = null : Expression;
		if ((callingFuncDef.flags() & ClassDefinition.IS_STATIC) == 0) {
			var calleeExpr = callExpr.getExpr();
			if (! (calleeExpr instanceof PropertyExpression))
				throw new Error("unexpected type of expression");
			receiverExpr = (calleeExpr as PropertyExpression).getExpr();
		}
		// check that the function may be inlined
		if (! this._functionIsInlineable(callingFuncDef))
			return null;
		// and the args passed can be inlined (types should match exactly (or emitters may insert additional code))
		if (! this._argsAreInlineable(callingFuncDef, callExpr.getArguments()))
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

	function _argsAreInlineable (callingFuncDef : MemberFunctionDefinition, actualArgs : Expression[]) : boolean {
		var formalArgsTypes = callingFuncDef.getArgumentTypes();
		if (actualArgs.length != formalArgsTypes.length)
			throw new Error("logic flow, number of arguments mismatch");
		for (var i = 0; i < actualArgs.length; ++i) {
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
		var stash = this.getStash(funcDef);
		if (stash.isInlineable == null) {
			stash.isInlineable = (function () : boolean {
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
					// TODO: support all the types of statements
					if (statement instanceof ExpressionStatement
						|| statement instanceof BreakStatement
						|| statement instanceof ContinueStatement
						|| statement instanceof CaseStatement
						|| statement instanceof DefaultStatement
						|| statement instanceof ThrowStatement
						|| statement instanceof DebuggerStatement
						|| statement instanceof LogStatement
						|| statement instanceof AssertStatement
						|| statement instanceof ForStatement
						|| statement instanceof ForInStatement
						|| statement instanceof DoWhileStatement
						|| statement instanceof WhileStatement
						|| statement instanceof IfStatement
						|| statement instanceof SwitchStatement
						) {
						// ok
					} else if (statement instanceof ReturnStatement && statement == funcDef.getStatements()[funcDef.getStatements().length - 1]) {
						// ok
					} else {
						return false;
					}
					if (! statement.forEachExpression(function onExpr(expr : Expression) : boolean {
						if (expr instanceof FunctionExpression) {
							return false;
						}
						else if (expr instanceof SuperExpression) {
							return false;
						}
						else if (expr instanceof CallExpression && _DetermineCalleeCommand.getCallingFuncDef(expr) == funcDef) {
							// do not expand recursion
							return false;
						}
						else if (expr instanceof LocalExpression) {
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
			}());
			this.log(funcDef.getNotation() + (stash.isInlineable ? " is" : " is not") + " inlineable");
		}
		return stash.isInlineable;
	}

	function _expandCallingFunction (callerFuncDef : MemberFunctionDefinition, statements : Statement[], stmtIndex : number, calleeFuncDef : MemberFunctionDefinition, argsAndThis : Expression[]) : number {
		// clone statements of the calling function, while rewriting the identifiers with actual arguments
		this.log("expanding " + calleeFuncDef.getNotation());
		var argsAndThisAndLocals = argsAndThis.concat([]);
		this._createVarsAndInit(callerFuncDef, calleeFuncDef, argsAndThisAndLocals, (expr) -> {
			// insert a statement that initializes the temporary var
			statements.splice(stmtIndex++, 0, new ExpressionStatement(expr));
		});

		var calleeStatements = calleeFuncDef.getStatements();
		for (var i = 0; i < calleeStatements.length; ++i) {
			// clone the statement (while rewriting last return statement to an expression statement)
			var statement : Statement;
			if (calleeStatements[i] instanceof ReturnStatement) {
				var returnStatement = calleeStatements[i] as ReturnStatement;
				if (returnStatement.getExpr() == null) {
					continue;
				}
				statement = new ExpressionStatement(returnStatement.getExpr().clone());
			}
			else {
				statement = calleeStatements[i].clone();
			}
			// replace the arguments with actual arguments
			function onExpr(expr : Expression, replaceCb : function(:Expression):void) : boolean {
				return this._rewriteExpression(expr, null, replaceCb, argsAndThisAndLocals, calleeFuncDef);
			}
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

	function _expandCallAsExpression(funcDef : MemberFunctionDefinition, expr : Expression, argsAndThisAndLocals : Expression[], replaceCb : (Expression) -> void) : boolean {
		var callingFuncDef = _DetermineCalleeCommand.getCallingFuncDef(expr);

		var statements = callingFuncDef.getStatements();
		if (statements.length == 0) {
			return false;
		}
		else if (statements.length != 1) {
			statements = statements.concat([]); // clone

			if (statements[statements.length - 1] instanceof ReturnStatement) {
				var returnStatement = statements.pop() as ReturnStatement;
				if (returnStatement.getExpr() == null) {
					returnStatement = null;
				}
			}
			else {
				returnStatement = null;
			}
			for (var i = 0; i < statements.length; ++i ) {
				if (!( statements[i] instanceof ExpressionStatement)) {
					return false;
				}
			}

			var singleExpr = statements.reduce.<Expression>((prevExpr, stmt) -> {
				return prevExpr == null
					? (stmt as ExpressionStatement).getExpr()
					: new CommaExpression(new Token(","), prevExpr, (stmt as ExpressionStatement).getExpr());
			}, null);
			if (returnStatement) {
				singleExpr = new CommaExpression(new Token(","),
						singleExpr,
						returnStatement.getExpr());
				statements.splice(0, statements.length, new ReturnStatement(new Token("return"), singleExpr));
			}
			else {
				statements.splice(0, statements.length, new ExpressionStatement(singleExpr));
			}
		}

		var stmt = statements[0];
		if (stmt instanceof ExpressionStatement) {
			var expr = (stmt as ExpressionStatement).getExpr();
		} else if (stmt instanceof ReturnStatement) {
			expr = (stmt as ReturnStatement).getExpr();
		} else {
			return false;
		}
		this.log("expanding " + callingFuncDef.getNotation() + " as expression");

		// setup args (arg0 = arg0expr, arg1 = arg1expr, ...)
		//   for non-leaf expressions used more than once
		var setupArgs = null : Expression;

		this._createVarsAndInit(funcDef, callingFuncDef, argsAndThisAndLocals, (expr) -> {
			if (setupArgs == null) {
				setupArgs = expr;
			}
			else {
				setupArgs = new CommaExpression(new Token(","),
					setupArgs,
					expr);
			}
		});

		var clonedExpr = expr.clone();
		this._rewriteExpression(
			clonedExpr,
			null,
			function (expr) { clonedExpr = expr; },
			argsAndThisAndLocals,
			callingFuncDef);

		if (setupArgs != null) {
			clonedExpr = new CommaExpression(new Token(","),
				setupArgs,
				clonedExpr);
		}

		replaceCb(clonedExpr);
		return true;
	}

	function _createVarsAndInit (callerFuncDef : MemberFunctionDefinition, calleeFuncDef : MemberFunctionDefinition, argsAndThisAndLocals : Expression[], initArgExpr : (Expression) -> void) : void {

		function exprIsInlineableFor(expr : Expression) : number {
			if (expr instanceof LocalExpression) {
				return -1;
			} else if (expr instanceof FunctionExpression) {
				return 1;
			} else if (expr instanceof PropertyExpression
				&& (expr as PropertyExpression).getExpr() instanceof ClassExpression
				&& ! (expr as PropertyExpression).getType().isAssignable()) {
				return Infinity;
			} else if (expr instanceof LeafExpression
				|| expr instanceof LogicalNotExpression
				|| expr instanceof BitwiseNotExpression
				|| expr instanceof SignExpression
				|| expr instanceof AdditiveExpression
				|| expr instanceof EqualityExpression
				|| expr instanceof ShiftExpression
				|| expr instanceof MapLiteralExpression
				|| expr instanceof ArrayLiteralExpression) {
				var min = 1;
				expr.forEachExpression(function (expr) {
					min = Math.min(min, exprIsInlineableFor(expr));
					return min > 0;
				});
				return min;
			} else {
				return -1;
			}
		}

		function createVarWithInit(funcDef : MemberFunctionDefinition, type : Type, baseName : string, initExpr : Expression) : LocalExpression {
			var tempVar = this.createVar(funcDef, type, baseName);
			initArgExpr(new AssignmentExpression(new Token("="),
				new LocalExpression(tempVar.getName(), tempVar),
				initExpr));
			return new LocalExpression(tempVar.getName(), tempVar);
		}

		var argUsed = this._countNumberOfArgsUsed(calleeFuncDef);

		// handle "this" first
		if ((calleeFuncDef.flags() & ClassDefinition.IS_STATIC) == 0) {
			var thisIdx = argsAndThisAndLocals.length - 1;
			var recvExpr = argsAndThisAndLocals[thisIdx];
			if (! (recvExpr instanceof LeafExpression || (argUsed["this"] <= exprIsInlineableFor(recvExpr)))) {
				argsAndThisAndLocals[thisIdx] = createVarWithInit(callerFuncDef, new ObjectType(calleeFuncDef.getClassDef()), "this", recvExpr);
			}
		}
		// handle other arguments
		var formalArgs = calleeFuncDef.getArguments();
		for (var i = 0; i < formalArgs.length; ++i) {
			var numberOfUsed = argUsed[formalArgs[i].getName().getValue()];
			var argExpr = argsAndThisAndLocals[i];
			if (numberOfUsed == -Infinity || ! (argExpr instanceof LeafExpression || (numberOfUsed <= exprIsInlineableFor(argExpr)))) {
				argsAndThisAndLocals[i] = createVarWithInit(callerFuncDef, formalArgs[i].getType(), formalArgs[i].getName().getValue(), argExpr);
			}
		}
		// handle locals
		calleeFuncDef.getLocals().forEach((local) -> {
			var tempVar = this.createVar(callerFuncDef, local.getType(), local.getName().getValue());
			argsAndThisAndLocals.push(new LocalExpression(tempVar.getName(), tempVar));
		});
	}

	function _rewriteExpression (expr : Expression, parentExpr : Expression, replaceCb : function(:Expression):void, argsAndThisAndLocals : Expression[], calleeFuncDef : MemberFunctionDefinition) : boolean {
		var formalArgs = calleeFuncDef.getArguments();
		if (expr instanceof LocalExpression) {
			var localExpr = expr as LocalExpression;
			for (var j = 0; j < formalArgs.length; ++j) {
				if (formalArgs[j].getName().getValue() == localExpr.getLocal().getName().getValue())
					break;
			}
			if (j == formalArgs.length) {
				++j; // skip this
				var locals = calleeFuncDef.getLocals();
				assert locals.length == argsAndThisAndLocals.length - j, locals.length as string + " vs " + (argsAndThisAndLocals.length as string + " - " + j as string) as string + " for " + calleeFuncDef.getNotation();
				for (var k = 0; k < locals.length; ++k, ++j) {
					if (locals[k].getName().getValue() == localExpr.getLocal().getName().getValue())
						break;
				}
			}
			// replace the local expression (function expression need not (and cannot) be cloned, so it is guaranteed to appear only once, in _createVars)
			if (j != argsAndThisAndLocals.length) {
				if (argsAndThisAndLocals[j] instanceof FunctionExpression) {
					replaceCb(argsAndThisAndLocals[j]);
					argsAndThisAndLocals[j] = null; // just in case
				} else {
					// the condition means expr is an assignee value against an argument declaration in callee function.
					/*
					 * function foo (n : number) : void {
					 *     n = 1;     // n declared here must not be inline-expanded
					 * }
					 */
					if (parentExpr != null
						&& parentExpr instanceof AssignmentExpression
						&& (parentExpr as AssignmentExpression).getFirstExpr() == expr
						&& ! (argsAndThisAndLocals[j] instanceof LocalExpression)) {
							return true;
					}
					replaceCb(argsAndThisAndLocals[j].clone());
				}
			} else {
				// closure referring to a local variable of outer scope
			}
		} else if (expr instanceof ThisExpression) {
			assert argsAndThisAndLocals[formalArgs.length] != null;
			replaceCb(argsAndThisAndLocals[formalArgs.length].clone());
		}
		expr.forEachExpression(function (childExpr, replaceCb) {
			return this._rewriteExpression(childExpr, expr, replaceCb, argsAndThisAndLocals, calleeFuncDef);
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
		if (funcDef.getReturnType() == null || funcDef.getReturnType().equals(Type.voidType))
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
 * Local Common Subexpression Elimination
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
				if (Util.rootIsNativeClass(receiverType)) {
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

		/*
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
		*/

		var clearCache = function () : void {
			this.log("clearing lcse cache");
			cachedExprs = new Map.<_LCSECachedExpression>;
		};

		// add an expression to cache
		Util.forEachExpression(function onExpr (expr : Expression, replaceCb : function(:Expression):void) : boolean {
			// handle special cases first
			if (expr instanceof AssignmentExpression || expr instanceof FusedAssignmentExpression) {
				var assignmentExpr = expr as BinaryExpression;
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
			} else if (expr instanceof LogicalExpression) {
				if (! expr.forEachExpression((expr) -> ! _Util.exprHasSideEffects(expr))) {
					// give up further optimization
					clearCache();
					return true;
				}
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
		}, exprs);
	}

}

/**
 * Expands POD objects into local variables
 * e.g. <code>var p = new Point(10, 20); log p.x; log p.y;</code>
 * into <code>var p$x = 10, p$y = 20; log p$x; log p$y;</code>
 */
class _UnboxOptimizeCommand extends _FunctionOptimizeCommand implements _StructuredStashAccessor.<_UnboxOptimizeCommand.Stash> {
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
		if (Util.rootIsNativeClass(local.getType())) {
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
				if (! (statement as FunctionStatement).getFuncDef().forEachStatement(onStatement)) {
					return false;
				}
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
		var stash = this.getStash(ctor);
		if (stash.canUnbox != null) {
			return stash.canUnbox;
		}
		return stash.canUnbox = function () : boolean {
			if (ctor.getLocals().length != 0) {
				return false;
			}
			return ctor.forEachStatement(function (statement) {
				// only allow list of this.X = ...
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
		this.log("unboxing " + local.getName().getNotation());

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
			this.log(funcDef.getNotation() + " optimizing " + statement.getToken().getNotation());
			// create local var for array.length
			var lengthLocal = this.createVar(funcDef, Type.integerType, arrayLocal.getName().getValue() + "$len");
			// assign array.length to the local
			var assignToLocal =  new AssignmentExpression(
						new Token("="),
						new LocalExpression(new Token(lengthLocal.getName().getValue(), true), lengthLocal),
						new PropertyExpression(
							new Token("."),
							new LocalExpression(new Token(arrayLocal.getName().getValue(), true), arrayLocal),
							new Token("length"),
							new Type[],
							lengthLocal.getType()));
			if (statement.getInitExpr() != null) {
				statement.setInitExpr(
					new CommaExpression(
						new Token(","),
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
			if (statement.getCondExpr() != null) {
				statement.getCondExpr().forEachExpression(onExpr);
			}
			if (statement.getPostExpr() != null) {
				statement.getPostExpr().forEachExpression(onExpr);
			}
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
class _NoDebugCommand extends _OptimizeCommand implements _StructuredStashAccessor.<_NoDebugCommand.Stash> {
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

	override function performOptimization () : void {
		var stash = this.getStash(this.getCompiler().getEmitter());
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


class _TailRecursionOptimizeCommand extends _FunctionOptimizeCommand {
	static const IDENTIFIER = "tail-rec";

	static const LABEL = "$TAIL_REC";

	function constructor() {
		super(_TailRecursionOptimizeCommand.IDENTIFIER);
	}

	override function optimizeFunction(funcDef : MemberFunctionDefinition) : boolean {
		if ((funcDef.flags() & (ClassDefinition.IS_OVERRIDE | ClassDefinition.IS_ABSTRACT | ClassDefinition.IS_NATIVE)) != 0 || (funcDef.flags() & (ClassDefinition.IS_STATIC | ClassDefinition.IS_FINAL)) == 0) {
			return false;
		}
		// transform tail recursion into:
		//
		// function f(arg1, arg2, arg3) {
		//   $TAIL_REC: while (true) {
		//     body;
		//     // return f(v1, v2, v3);
		//     ($arg1 = v1, $arg2 = v2, $arg3 = v3);
		//     (arg1 = $arg1, arg2 = $arg2, arg3 = $arg3);
		//     continue $TAIL_REC;
		//   }
		// }

		var altered = false;
		var statements = funcDef.getStatements();
		(function onStatements(statements : Statement[]) : boolean {
			for (var i = 0; i < statements.length; ++i) {
				if (this._isTailCall(funcDef, statements[i])) {
					this._replaceTailCallStatement(funcDef, statements, i);
					altered = true;
				}
				statements[i].handleStatements(onStatements);
			}
			return true;
		}(statements));

		if (altered) {
			this.log("transform " + funcDef.getNotation());
			var body : Statement = new WhileStatement(new Token("while"),
					new Token(_TailRecursionOptimizeCommand.LABEL),
					new BooleanLiteralExpression(new Token("true")), statements);
			funcDef.setStatements([body]);
		}
		return true;
	}

	function _isTailCall(funcDef : MemberFunctionDefinition, statement : Statement) : boolean {
		if (statement instanceof ReturnStatement) {
			var returnStatement = statement as ReturnStatement;
			if (returnStatement.getExpr() != null && returnStatement.getExpr() instanceof CallExpression)  {
				return funcDef == _DetermineCalleeCommand.getCallingFuncDef(returnStatement.getExpr());
			}
		}
		return false;
	}

	function _replaceTailCallStatement(funcDef : MemberFunctionDefinition, statements : Statement[], idx : number) : void {
		var callExpression = (statements[idx] as ReturnStatement).getExpr() as CallExpression;

		var locals = funcDef.getArguments().map.<LocalVariable>((argDecl) -> {
			return this.createVar(funcDef, argDecl.getType(), argDecl.getName().getValue());
		});

		var setupArgs = callExpression.getArguments().reduce.<Expression>((prevExpr, arg, i) -> {
			var assignToArg = new AssignmentExpression(new Token("="),
				new LocalExpression(locals[i].getName(), locals[i]),
				arg
			);
			return prevExpr == null
				? assignToArg
				: new CommaExpression(new Token(","), prevExpr, assignToArg);
		}, null);

		var retry = new ContinueStatement(new Token("continue"),
				new Token(_TailRecursionOptimizeCommand.LABEL));
		if (setupArgs == null) {
			statements.splice(idx, 1, retry);
		}
		else {
			var localsToArgs = locals.reduce.<Expression>((prevExpr, local, i) -> {
				var assignToArg = new AssignmentExpression(new Token("="),
					new LocalExpression(funcDef.getArguments()[i].getName(), funcDef.getArguments()[i]),
					new LocalExpression(local.getName(), local)
				);
				return prevExpr == null
					? assignToArg
					: new CommaExpression(new Token(","), prevExpr, assignToArg);
			}, null);
			statements.splice(idx, 1, new ExpressionStatement(setupArgs), new ExpressionStatement(localsToArgs), retry);
		}
	}
}
