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

import "./classdef.jsx";
import "./parser.jsx";
import "./type.jsx";
import "./platform.jsx";
import "./statement.jsx";
import "./expression.jsx";
import "./util.jsx";

class InstantiationContext {

	var errors : CompileError[];
	var typemap : Map.<Type>;
	var objectTypesUsed : ParsedObjectType[];

	function constructor (errors : CompileError[], typemap : Map.<Type>) {
		this.errors = errors;
		this.typemap = typemap;
		this.objectTypesUsed = new ParsedObjectType[];
	}

	function clone() : InstantiationContext {
		return new InstantiationContext(this.errors, this.typemap);
	}
}

class TemplateInstantiationRequest {

	var _token : Token;
	var _className : string;
	var _typeArgs : Type[];

	function constructor (token : Token, className : string, typeArgs : Type[]) {
		this._token = token;
		this._className = className;
		this._typeArgs = typeArgs;
	}

	function getToken () : Token {
		return this._token;
	}

	function getClassName () : string {
		return this._className;
	}

	function getTypeArguments () : Type[] {
		return this._typeArgs;
	}

}

interface Block {

}

class BlockContext {

	var localVariableStatuses : LocalVariableStatuses;
	var block : Block;

	function constructor (localVariableStatuses : LocalVariableStatuses, block : Block) {
		this.localVariableStatuses = localVariableStatuses;
		this.block = block;
	}

}

class AnalysisContext {

	var errors : CompileError[];
	var parser : Parser;
	var postInstantiationCallback : function(:Parser,:ClassDefinition):ClassDefinition;
	var funcDef : MemberFunctionDefinition;
	var blockStack : BlockContext[];
	var statement : Statement;

	function constructor (errors : CompileError[], parser : Parser, postInstantiationCallback : function(:Parser,:ClassDefinition):ClassDefinition) {
		this.errors = errors;
		this.parser = parser;
		this.postInstantiationCallback = postInstantiationCallback;
		this.funcDef = null;
		/*
			blockStack is a stack of blocks:

			function f() { // pushes [ localVariableStatutes, funcDef ]
				...
				for (...) { // pushes [ localVariableStatuses, forStatement ]
					...
				}
				try { // pushes [ localVariableStatuses, tryStatement ]
					...
				} catch (e : Error) { // pushes [ localVariableStatuses, catchStatement ]
					...
					function () { // pushes [ localVariableStatuses, funcDef ]
						...
					}
				}
			}
		*/
		this.blockStack = null;
		this.statement = null;
	}

	function clone () : AnalysisContext {
		// NOTE: does not clone the blockStack (call setBlockStack)
		return new AnalysisContext(this.errors, this.parser, this.postInstantiationCallback).setFuncDef(this.funcDef);
	}

	function setFuncDef (funcDef : MemberFunctionDefinition) : AnalysisContext {
		this.funcDef = funcDef;
		return this;
	}

	function setBlockStack (stack : BlockContext[]) : AnalysisContext {
		this.blockStack = stack;
		return this;
	}

	function getTopBlock () : BlockContext {
		return this.blockStack[this.blockStack.length - 1];
	}

}

// stash to hold meta data used by code transformation, optimization, and emission

abstract class Stash {
	abstract function clone () : Stash;
}

mixin Stashable {

	var _stash = new Map.<Stash>;

	function setStash (id : string, stash : Stash) : Stash {
		return this._stash[id] = stash;
	}

	function getStash (id : string) : Stash {
		return this._stash[id];
	}

}

class LocalVariable implements Stashable {

	var _name : Token;
	var _type : Type;
	var _instantiated = new LocalVariable[];
	var isInstantiated = false;
	var _isUsedAsRHS = false;
	var _isConstant : boolean;

	function constructor (name : Token, type : Type, isConst : boolean) {
		this._name = name;
		this._type = type;
		this._isConstant = isConst;
	}

	function serialize () : variant {
		return [
			this._name,
			Util.serializeNullable(this._type)
		] : variant[];
	}

	function getName () : Token {
		return this._name;
	}

	function getType () : Type {
		return this._type;
	}

	function isUsedAsRHS() : boolean {
		return this._isUsedAsRHS;
	}

	function isConstant () : boolean {
		return this._isConstant;
	}

	function setType (type : Type) : void {
		if (this._type != null)
			throw new Error("type is already set for " + this.toString());
		// implicit declarations of "int" is not supported
		if (type.equals(Type.integerType))
			type = Type.numberType;
		this._type = type;
	}

	function setTypeForced (type : Type) : void {
		this._type = type;
	}

	function _findVarTokenFromFuncDef(context : AnalysisContext) : Token {
		// the local variable token may refers outer scope, so find the correct
		// one for error messages
		var locals = context.funcDef.getLocals();
		for (var i = 0; i < locals.length; ++i) {
			if (this.getName().getValue() == locals[i].getName().getValue()) {
				return locals[i].getName();
			}
		}
		return this.getName(); // fall back to itself
	}

	function touchVariable (context : AnalysisContext, token : Token, isAssignment : boolean) : boolean {
		if (isAssignment) {
			if (this._isConstant && context.getTopBlock().localVariableStatuses.getStatus(this) != LocalVariableStatuses.UNSET) {
				context.errors.push(new CompileError(token, "assignment of read-only variable"));
				return false;
			}
			context.getTopBlock().localVariableStatuses.setStatus(this);
		} else {
			switch (context.getTopBlock().localVariableStatuses.getStatus(this)) {
			case LocalVariableStatuses.UNTYPED_RECURSIVE_FUNCTION:
				context.errors.push(new CompileError(token, "the return type of recursive function needs to be explicitly declared"));
				return false;
			case LocalVariableStatuses.ISSET:
				this._isUsedAsRHS = true;
				break;
			case LocalVariableStatuses.UNSET:
				var error = new CompileError(token, "variable is not initialized");
				error.addCompileNote(new CompileNote(this._findVarTokenFromFuncDef(context), "declared here"));
				context.errors.push(error);
				return false;
			case LocalVariableStatuses.MAYBESET:
				var error = new CompileError(token, "variable may not be initialized");
				error.addCompileNote(new CompileNote(this._findVarTokenFromFuncDef(context), "declared here"));
				context.errors.push(error);
				return false;
			default:
				throw new Error("logic flaw");
			}
		}
		return true;
	}

	override function toString () : string {
		return this._name.getValue() + " : " + this._type.toString();
	}

	function popInstantiated () : void {
		this._instantiated.pop();
	}

	function getInstantiated () : LocalVariable {
		if (this._instantiated.length == 0) {
			throw new Error("logic flaw, no instantiation for " + this._name.getValue() + "," + this.isInstantiated as string);
		}
		return this._instantiated[this._instantiated.length - 1];
	}

	function instantiateAndPush (instantiationContext : InstantiationContext) : LocalVariable {
		var instantiated = this._instantiate(instantiationContext);
		instantiated.isInstantiated = true;
		this._instantiated.push(instantiated);
		return instantiated;
	}

	function _instantiate (instantiationContext : InstantiationContext) : LocalVariable {
		var type = this._type != null ? this._type.instantiate(instantiationContext, false) : null;
		return new LocalVariable(this._name, type, this._isConstant);
	}

}

class CaughtVariable extends LocalVariable {

	function constructor (name : Token, type : Type) {
		super(name, type, false);
	}

	function clone () : CaughtVariable {
		return new CaughtVariable(this._name, this._type);
	}

	override function touchVariable (context : AnalysisContext, token : Token, isAssignment : boolean) : boolean {
		return true;
	}

	override function _instantiate (instantiationContext : InstantiationContext) : CaughtVariable {
		return new CaughtVariable(this._name, this._type.instantiate(instantiationContext, false));
	}

	override function instantiateAndPush (instantiationContext : InstantiationContext) : CaughtVariable {
		return super.instantiateAndPush(instantiationContext) as CaughtVariable;
	}
}

class ArgumentDeclaration extends LocalVariable {

	var _defaultValue : Expression = null;

	function constructor (name : Token, type : Type) {
		super(name, type, false);
	}

	function constructor (name : Token, type : Type, defaultValue : Expression) {
		super(name, type, false);
		this._defaultValue = defaultValue;
	}

	function clone () : ArgumentDeclaration {
		return new ArgumentDeclaration(this._name, this._type, Util.cloneNullable(this._defaultValue));
	}

	function getDefaultValue() : Expression {
		return this._defaultValue;
	}

	override function _instantiate (instantiationContext : InstantiationContext) : ArgumentDeclaration {
		var type = this._type != null ? this._type.instantiate(instantiationContext, false) : null;
		return new ArgumentDeclaration(this._name, type, this._defaultValue);
	}

	override function instantiateAndPush (instantiationContext : InstantiationContext) : ArgumentDeclaration {
		return super.instantiateAndPush(instantiationContext) as ArgumentDeclaration;
	}

}

class LocalVariableStatuses {

	static const UNTYPED_RECURSIVE_FUNCTION = -1;

	static const UNSET = 0;
	static const ISSET = 1;
	static const MAYBESET = 2;

	var _statuses : Map.<number>;
	var _isReachable : boolean;

	function constructor (funcDef : MemberFunctionDefinition, base : LocalVariableStatuses) {
		this._statuses = new Map.<number>;

		if (base != null) {
			// FIXME the analysis of the closures should be delayed to either of: first being used, or return is called, to minimize the appearance of the "not initialized" error
			for (var k in base._statuses)
				this._statuses[k] = base._statuses[k] == LocalVariableStatuses.UNSET ? LocalVariableStatuses.MAYBESET : base._statuses[k];
		}
		var args = funcDef.getArguments();
		for (var i = 0; i < args.length; ++i)
			this._statuses[args[i].getName().getValue()] = LocalVariableStatuses.ISSET;
		var locals = funcDef.getLocals();
		for (var i = 0; i < locals.length; ++i)
			this._statuses[locals[i].getName().getValue()] = LocalVariableStatuses.UNSET;

		this._isReachable = true;
	}

	function constructor (srcStatus : LocalVariableStatuses) {
		this._statuses = new Map.<number>;
		this._copyFrom(srcStatus);
		this._isReachable = srcStatus._isReachable;
	}

	function clone () : LocalVariableStatuses {
		return new LocalVariableStatuses(this);
	}

	function merge (that : LocalVariableStatuses) : LocalVariableStatuses {
		if (this._isReachable != that._isReachable) {
			if (this._isReachable) {
				return this.clone();
			} else {
				return that.clone();
			}
		}
		var ret = this.clone();
		for (var k in ret._statuses) {
			if (ret._statuses[k] == LocalVariableStatuses.UNSET && that._statuses[k] == LocalVariableStatuses.UNSET) {
				// UNSET
			} else if (ret._statuses[k] == LocalVariableStatuses.ISSET && that._statuses[k] == LocalVariableStatuses.ISSET) {
				// ISSET
			} else {
				// MAYBESET
				ret._statuses[k] = LocalVariableStatuses.MAYBESET;
			}
		}
		return ret;
	}

	function mergeFinally (postFinallyStats : LocalVariableStatuses) : LocalVariableStatuses {
		var ret = this.clone();
		for (var k in ret._statuses) {
			switch (postFinallyStats._statuses[k]) {
			case LocalVariableStatuses.ISSET:
				ret._statuses[k] = LocalVariableStatuses.ISSET;
				break;
			case LocalVariableStatuses.MAYBESET:
				if (ret._statuses[k] != LocalVariableStatuses.ISSET) {
					ret._statuses[k] = LocalVariableStatuses.MAYBESET;
				}
				break;
			}
		}
		if (! postFinallyStats._isReachable) {
			ret._isReachable = false;
		}
		return ret;
	}

	function setStatus (local : LocalVariable) : void {
		var name = local.getName().getValue();
		if (this._statuses[name] == null)
			throw new Error("logic flaw, could not find status for local variable: " + name);
		this._statuses[name] = LocalVariableStatuses.ISSET;
	}

	function getStatus (local : LocalVariable) : number {
		var name = local.getName().getValue();
		if (this._statuses[name] == null)
			throw new Error("logic flaw, could not find status for local variable: " + name);
		return this._statuses[name];
	}

	function isReachable() : boolean {
		return this._isReachable;
	}

	function setIsReachable(isReachable : boolean) : void {
		this._isReachable = isReachable;
	}

	function _copyFrom (that : LocalVariableStatuses) : void {
		for (var k in that._statuses)
			this._statuses[k] = that._statuses[k];
	}

}

abstract class CompileIssue {

	var _filename : Nullable.<string>;
	var _lineNumber : number;
	var _columnNumber : number;
	var _message : string;
	var _size : number;

	function constructor (token : Token, message : string) {
		if(token != null) {
			this._filename = token.getFilename();
			this._lineNumber = token.getLineNumber();
			this._columnNumber = token.getColumnNumber();
			// FIXME: deal with visual width
			this._size = token.getValue().length;
			this._message = message;
		}
		else {
			this._filename = null;
			this._lineNumber = 0;
			this._columnNumber = -1;
			this._message = message;
			this._size = 1;
		}
	}

	function constructor (filename : string, lineNumber : number, columnNumber : number, message : string) {
		this._filename = filename;
		this._lineNumber = lineNumber;
		this._columnNumber = columnNumber;
		this._message = message;
		this._size = 1;
	}

	function format (platform : Platform) : string {
		return Util.makeErrorMessage(platform, this.getPrefix() + this._message, this._filename, this._lineNumber, this._columnNumber, this._size);
	}

	abstract function getPrefix () : string;

}

class CompileError extends CompileIssue {

	var _notes : CompileNote[];

	function constructor (token : Token, message : string) {
		super(token, message);
		this._notes = new CompileNote[];
	}

	function constructor (filename : string, lineNumber : number, columnNumber : number, message : string) {
		super(filename, lineNumber, columnNumber, message);
		this._notes = new CompileNote[];
	}

	function addCompileNote (note : CompileNote) : CompileError {
		this._notes.push(note);
		return this;
	}

	function addCompileNotes (notes : CompileNote[]) : void {
		notes.forEach( (note) -> {
			this.addCompileNote(note);
		});
	}

	function getCompileNotes () : CompileNote[] {
		return this._notes;
	}

	override function getPrefix () : string {
		return "";
	}

}

class CompileWarning extends CompileError {

	function constructor (token : Token, message : string) {
		super(token, message);
	}

	function constructor (filename : string, lineNumber : number, columnNumber : number, message : string) {
		super(filename, lineNumber, columnNumber, message);
	}

	override function getPrefix () : string {
		return "Warning: ";
	}

}

class UnusedWarning extends CompileWarning {

	function constructor (token : Token, message : string) {
		super(token, message);
	}

	function constructor (filename : string, lineNumber : number, columnNumber : number, message : string) {
		super(filename, lineNumber, columnNumber, message);
	}

}

class DeprecatedWarning extends CompileWarning {

	function constructor (token : Token, message : string) {
		super(token, message);
	}

	function constructor (filename : string, lineNumber : number, columnNumber : number, message : string) {
		super(filename, lineNumber, columnNumber, message);
	}

}

class ExperimentalWarning extends CompileWarning {

	function constructor (token : Token, feature: string) {
		super(token, "'" + feature + "' is experimental");
	}

	function constructor (filename : string, lineNumber : number, columnNumber : number, feature : string) {
		super(filename, lineNumber, columnNumber, "'" + feature + "' is experimental");
	}

}


class CompileNote extends CompileIssue {

	function constructor (token : Token, message : string) {
		super(token, message);
	}

	function constructor (filename : string, lineNumber : number, columnNumber : number, message : string) {
		super(filename, lineNumber, columnNumber, message);
	}

	override function getPrefix () : string {
		return "Note: ";
	}

}

// vim: set noexpandtab:
