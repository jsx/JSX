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

import "./type.jsx";
import "./util.jsx";
import "./statement.jsx";
import "./expression.jsx";
import "./parser.jsx";
import "./doc.jsx";
import "./optimizer.jsx";
import "console.jsx";

class InstantiationContext {

	var errors : CompileError[];
	var typemap : Map.<Type>;
	var objectTypesUsed : ParsedObjectType[];

	function constructor (errors : CompileError[], typemap : Map.<Type>) {
		this.errors = errors;
		this.typemap = typemap;
		this.objectTypesUsed = new ParsedObjectType[];
	}

}

class _Util {

	static function buildInstantiationContext (errors : CompileError[], token : Token, formalTypeArgs : Token[], actualTypeArgs : Type[]) : InstantiationContext {
		// check number of type arguments
		if (formalTypeArgs.length != actualTypeArgs.length) {
			errors.push(new CompileError(token, "wrong number of template arguments (expected " + formalTypeArgs.length as string + ", got " + actualTypeArgs.length as string));
			return null;
		}
		// build typemap
		var typemap = new Map.<Type>;
		for (var i = 0; i < formalTypeArgs.length; ++i) {
			typemap[formalTypeArgs[i].getValue()] = actualTypeArgs[i];
		}
		return new InstantiationContext(errors, typemap);
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
	var checkVariableStatus : boolean;

	function constructor (errors : CompileError[], parser : Parser, postInstantiationCallback : function(:Parser,:ClassDefinition):ClassDefinition) {
		this.errors = errors;
		this.parser = parser;
		this.postInstantiationCallback = postInstantiationCallback;
		this.checkVariableStatus = false;
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
	}

	function clone () : Object {
		// NOTE: does not clone the blockStack (call setBlockStack)
		return new AnalysisContext(this.errors, this.parser, this.postInstantiationCallback).setFuncDef(this.funcDef).setCheckVariableStatus(this.checkVariableStatus);
	}

	function setCheckVariableStatus (checkVariableStatus : boolean) : AnalysisContext {
		this.checkVariableStatus = checkVariableStatus;
		return this;
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

class ClassDefinition implements Stashable {

	static const IS_CONST = 1;
	static const IS_ABSTRACT = 2;
	static const IS_FINAL = 4;
	static const IS_STATIC = 8;
	static const IS_NATIVE = 16;
	static const IS_OVERRIDE = 32;
	static const IS_INTERFACE = 64;
	static const IS_MIXIN = 128;
	static const IS_FAKE = 256; // used for marking a JS non-class object that should be treated like a JSX class instance (e.g. window)
	static const IS_READONLY = 512;
	static const IS_INLINE = 1024;
	static const IS_PURE = 2048; // constexpr (intended for for native functions)
	static const IS_DELETE = 4096; // used for disabling the default constructor

	var _parser		: Parser;
	var _token		: Token;
	var _className		: string;
	var _outputClassName	: Nullable.<string>;
	var _flags		: number;
	var _extendType		: ParsedObjectType; // null for interfaces, mixins, and Object class only
	var _implementTypes	: ParsedObjectType[];
	var _members		: MemberDefinition[];
	var _objectTypesUsed	: ParsedObjectType[];
	var _docComment		: DocComment;
	var _optimizerStash	: Map.<OptimizerStash>;

	var _baseClassDef : ClassDefinition = null;

	function constructor (token : Token, className : string, flags : number, extendType : ParsedObjectType, implementTypes : ParsedObjectType[], members : MemberDefinition[], objectTypesUsed : ParsedObjectType[], docComment : DocComment) {
		this._parser = null;
		this._token = token;
		this._className = className;
		this._outputClassName = null;
		this._flags = flags;
		this._extendType = extendType;
		this._implementTypes = implementTypes;
		this._members = members;
		this._objectTypesUsed = objectTypesUsed;
		this._docComment = docComment;
		this._optimizerStash = new Map.<OptimizerStash>;
		for (var i = 0; i < this._members.length; ++i) {
			this._members[i].setClassDef(this);
			if (this._members[i] instanceof MemberFunctionDefinition) {
				function setClassDef(funcDef : MemberFunctionDefinition) : boolean {
					funcDef.setClassDef(this);
					return funcDef.forEachClosure(setClassDef);
				};
				(this._members[i] as MemberFunctionDefinition).forEachClosure(setClassDef);
			}
		}
	}

	function serialize () : variant {
		// FIXME implement in a way that is compatible with JSX
		return {
			"token"      : this._token,
			"name"       : this._className,
			"flags"      : this._flags,
			"extends"    : Serializer.<ParsedObjectType>.serializeNullable(this._extendType),
			"implements" : Serializer.<ParsedObjectType>.serializeArray(this._implementTypes),
			"members"    : Serializer.<MemberDefinition>.serializeArray(this._members)
		} : Map.<variant>;
	}

	static function serialize (classDefs : ClassDefinition[]) : string {
		var s = new variant[];
		for (var i = 0; i < classDefs.length; ++i)
			s[i] = classDefs[i].serialize();
		return JSON.stringify(s, null, 2);
	}

	function getParser () : Parser {
		return this._parser;
	}

	function setParser (parser : Parser) : void {
		this._parser = parser;
	}

	function getToken () : Token {
		return this._token;
	}

	function className () : string {
		return this._className;
	}

	function setOutputClassName (name : string) : void {
		this._outputClassName = name;
	}

	function getOutputClassName () : string {
		return this._outputClassName;
	}

	function flags () : number {
		return this._flags;
	}

	function setFlags (flags : number) : void {
		this._flags = flags;
	}

	function extendType () : ParsedObjectType {
		return this._extendType;
	}

	function implementTypes () : ParsedObjectType[] {
		return this._implementTypes;
	}

	function members () : MemberDefinition[] {
		return this._members;
	}

	function getDocComment () : DocComment {
		return this._docComment;
	}

	function setDocComment (docComment : DocComment) : void {
		this._docComment = docComment;
	}

	function forEachClassToBase (cb : function(:ClassDefinition):boolean) : boolean {
		if (! cb(this))
			return false;
		for (var i = this._implementTypes.length - 1; i >= 0; --i) {
			if (! cb(this._implementTypes[i].getClassDef()))
				return false;
		}
		if (this._extendType != null) {
			if (! this._extendType.getClassDef().forEachClassToBase(cb))
				return false;
		}
		return true;
	}

	function forEachClassFromBase (cb : function(:ClassDefinition):boolean) : boolean {
		if (this._extendType != null)
			if (! this._extendType.getClassDef().forEachClassFromBase(cb))
				return false;
		for (var i = 0; i < this._implementTypes.length; ++i) {
			if (! cb(this._implementTypes[i].getClassDef()))
				return false;
		}
		if (! cb(this))
			return false;
		return true;
	}

	function forEachMember (cb : function(:MemberDefinition):boolean) : boolean {
		for (var i = 0; i < this._members.length; ++i) {
			if (! cb(this._members[i]))
				return false;
		}
		return true;
	}

	function forEachMemberVariable (cb : function(:MemberVariableDefinition):boolean) : boolean {
		for (var i = 0; i < this._members.length; ++i) {
			if (this._members[i] instanceof MemberVariableDefinition) {
				if (! cb(this._members[i] as MemberVariableDefinition))
					return false;
			}
		}
		return true;
	}

	function forEachMemberFunction (cb : function(:MemberFunctionDefinition):boolean) : boolean {
		for (var i = 0; i < this._members.length; ++i) {
			if (this._members[i] instanceof MemberFunctionDefinition) {
				if (! cb(this._members[i] as MemberFunctionDefinition))
					return false;
			}
		}
		return true;
	}

	static const GET_MEMBER_MODE_ALL = 0; // looks for functions or variables from the class and all super classes
	static const GET_MEMBER_MODE_CLASS_ONLY = 1; // looks for functions or variables within the class
	static const GET_MEMBER_MODE_SUPER = 2; // looks for functions with body in super classes
	static const GET_MEMBER_MODE_FUNCTION_WITH_BODY = 3; // looks for function with body

	static const GET_MEMBER_MODE_NOT_ABSTRACT = 4;
	
	function getMemberTypeByName (errors : CompileError[], token : Token, name : string, isStatic : boolean, typeArgs : Type[], mode : number) : Type {
		// returns an array to support function overloading
		var types = new Type[];
		function pushMatchingMember(classDef : ClassDefinition) : void {
			if (mode != ClassDefinition.GET_MEMBER_MODE_SUPER) {
				for (var i = 0; i < classDef._members.length; ++i) {
					var member = classDef._members[i];
					if ((member.flags() & ClassDefinition.IS_DELETE) != 0) {
						// skip
					} else if (((member.flags() & ClassDefinition.IS_STATIC) != 0) == isStatic
						&& name == member.name()) {
						if (member instanceof MemberVariableDefinition) {
							if ((member.flags() & ClassDefinition.IS_OVERRIDE) == 0) {
								var type = (member as MemberVariableDefinition).getType();
								// ignore member variables that failed in type deduction (already reported as a compile error)
								// it is guranteed by _assertMemberVariableIsDefinable that there would not be a property with same name using different type, so we can use the first one (declarations might be found more than once using the "abstract" attribute)
								if (type != null && types.length == 0)
									types[0] = type;
							}
						} else if (member instanceof MemberFunctionDefinition) {
							// member function
							if (member instanceof InstantiatedMemberFunctionDefinition) {
								// skip
							} else {
								if (member instanceof TemplateFunctionDefinition) {
									if ((member = (member as TemplateFunctionDefinition).instantiateTemplateFunction(errors, token, typeArgs)) == null) {
										return;
									}
								}
								if ((member as MemberFunctionDefinition).getStatements() != null || mode != ClassDefinition.GET_MEMBER_MODE_NOT_ABSTRACT) {
									for (var j = 0; j < types.length; ++j) {
										if (Util.typesAreEqual((member as MemberFunctionDefinition).getArgumentTypes(), (types[j] as ResolvedFunctionType).getArgumentTypes())) {
											break;
										}
									}
									if (j == types.length) {
										types.push((member as MemberFunctionDefinition).getType());
									}
								}
							}
						} else {
							throw new Error("logic flaw");
						}
					}
				}
			} else {
				// for searching super classes, change mode GET_MEMBER_MODE_SUPER to GET_MEMBER_MODE_NOT_ABSTRACT
				mode = ClassDefinition.GET_MEMBER_MODE_FUNCTION_WITH_BODY;
			}
			if (mode != ClassDefinition.GET_MEMBER_MODE_CLASS_ONLY) {
				if (classDef._extendType != null) {
					pushMatchingMember(classDef._extendType.getClassDef());
				}
				for (var i = 0; i < classDef._implementTypes.length; ++i) {
					pushMatchingMember(classDef._implementTypes[i].getClassDef());
				}
			}
		}
		pushMatchingMember(this);
		switch (types.length) {
		case 0:
			return null;
		case 1:
			return types[0];
		default:
			return new FunctionChoiceType(types.map.<ResolvedFunctionType>(function(t) { return t as ResolvedFunctionType; }));
		}
	}

	function resolveTypes (context : AnalysisContext) : void {
		// resolve types used
		for (var i = 0; i < this._objectTypesUsed.length; ++i)
			this._objectTypesUsed[i].resolveType(context);
		// resolve base classes
		if (this._extendType != null) {
			var baseClass = this._extendType.getClassDef();
			if (baseClass != null) {
				if ((baseClass.flags() & ClassDefinition.IS_FINAL) != 0)
					context.errors.push(new CompileError(this._extendType.getToken(), "cannot extend a final class"));
				else if ((baseClass.flags() & ClassDefinition.IS_INTERFACE) != 0)
					context.errors.push(new CompileError(this._extendType.getToken(), "cannot extend an interface, use the 'implements' keyword"));
				else if ((baseClass.flags() & ClassDefinition.IS_MIXIN) != 0)
					context.errors.push(new CompileError(this._extendType.getToken(), "cannot extend an mixin, use the 'implements' keyword"));
			}
		}
		for (var i = 0; i < this._implementTypes.length; ++i) {
			var baseClass = this._implementTypes[i].getClassDef();
			if (baseClass != null) {
				if ((baseClass.flags() & (ClassDefinition.IS_INTERFACE | ClassDefinition.IS_MIXIN)) == 0) {
					context.errors.push(new CompileError(this._implementTypes[i].getToken(), "cannot implement a class (only interfaces can be implemented)"));
				} else {
					for (var j = i + 1; j < this._implementTypes.length; ++j) {
						if (this._implementTypes[j].getClassDef() == baseClass) {
							context.errors.push(new CompileError(this._implementTypes[i].getToken(), "cannot implement the same interface more than once"));
							break;
						}
					}
				}
			}
		}
		// create default constructor if no constructors exist
		if (this.forEachMemberFunction(function (funcDef) { return funcDef.name() != "constructor"; })) {
			var isNative = (this.flags() & ClassDefinition.IS_NATIVE) != 0;
			var func = new MemberFunctionDefinition(
				this._token,
				new Token("constructor", true),
				ClassDefinition.IS_FINAL | (this.flags() & ClassDefinition.IS_NATIVE),
				Type.voidType,
				new ArgumentDeclaration[],
				isNative ? null:LocalVariable[] : new LocalVariable[],
				isNative ? null:Statement[] : new Statement[],
				isNative ? null:MemberFunctionDefinition[] : new MemberFunctionDefinition[],
				this._token, /* FIXME */
			        null);
			func.setClassDef(this);
			this._members.push(func);
		}
	}

	function setAnalysisContextOfVariables (context : AnalysisContext) : void {
		for (var i = 0; i < this._members.length; ++i) {
			var member = this._members[i];
			if (member instanceof MemberVariableDefinition)
				(member as MemberVariableDefinition).setAnalysisContext(context);
		}
	}

	function analyze (context : AnalysisContext) : void {
		try {
			this._analyzeClassDef(context);
		} catch (e : Error) {
			var token = this.getToken();
			console.error("fatal error while analyzing class " + this.className());
			throw e;
		}
		this._analyzeMemberFunctions(context);
	}

	function _analyzeClassDef (context : AnalysisContext) : boolean {
		this._baseClassDef = this.extendType() != null ? this.extendType().getClassDef() : null;
		var implementClassDefs = this.implementTypes().map.<ClassDefinition>(function (type) {
			return type.getClassDef();
		});
		// check that inheritance is not in loop, and that classes are extended, and interfaces / mixins are implemented
		if ((this.flags() & (ClassDefinition.IS_INTERFACE | ClassDefinition.IS_MIXIN)) == 0) {
			if (this._baseClassDef != null) {
				if ((this._baseClassDef.flags() & ClassDefinition.IS_FINAL) != 0) {
					context.errors.push(new CompileError(this.getToken(), "cannot extend final class '" + this._baseClassDef.className() + "'"));
					return false;
				}
				if ((this._baseClassDef.flags() & (ClassDefinition.IS_INTERFACE | ClassDefinition.IS_MIXIN)) != 0) {
					context.errors.push(new CompileError(this.getToken(), "interfaces (or mixins) should be implemented, not extended"));
					return false;
				}
				if (! this._baseClassDef.forEachClassToBase(function (classDef : ClassDefinition) : boolean {
					if (this == classDef) {
						context.errors.push(new CompileError(this.getToken(), "class inheritance is in loop"));
						return false;
					}
					return true;
				})) {
					return false;
				}
			}
		} else {
			for (var i = 0; i < implementClassDefs.length; ++i) {
				if ((implementClassDefs[i].flags() & (ClassDefinition.IS_INTERFACE | ClassDefinition.IS_MIXIN)) == 0) {
					context.errors.push(new CompileError(this.getToken(), "class '" + implementClassDefs[i].className() + "' can only be extended, not implemented"));
					return false;
				}
				if (! implementClassDefs[i].forEachClassToBase(function (classDef) {
					if (this == classDef) {
						context.errors.push(new CompileError(this.getToken(), "class inheritance is in loop"));
						return false;
					}
					return true;
				})) {
					return false;
				}
			}
		}
		// check that none of the mixins are implemented twice
		var allMixins = new ClassDefinition[];
		if (! this.forEachClassToBase(function (classDef) {
			if ((classDef.flags() & ClassDefinition.IS_MIXIN) != 0) {
				if (allMixins.indexOf(classDef) != -1) {
					context.errors.push(new CompileError(this.getToken(), "mixin '" + classDef.className() + "' is implemented twice"));
					return false;
				}
				allMixins.push(classDef);
			}
			return true;
		})) {
			return false;
		}
		// check that the properties of the class does not conflict with those in base classes or implemented interfaces
		for (var i = 0; i < this._members.length; ++i) {
			this._assertMemberIsDefinable(context, this._members[i], this, this._members[i].getToken());
		}
		// check that the properties of the implemented interfaces does not conflict with those in base classes or other implement interfaces
		for (var i = 0; i < this._implementTypes.length; ++i) {
			var interfaceDef = this._implementTypes[i].getClassDef();
			for (var j = 0; j < interfaceDef._members.length; ++j)
				this._assertMemberIsDefinable(context, interfaceDef._members[j], interfaceDef, this._implementTypes[i].getToken());
		}
		// check that the member functions with "override" attribute are in fact overridable
		if ((this._flags & (ClassDefinition.IS_INTERFACE | ClassDefinition.IS_MIXIN)) == 0) {
			for (var i = 0; i < this._members.length; ++i)
				if (this._members[i] instanceof MemberFunctionDefinition && (this._members[i].flags() & ClassDefinition.IS_OVERRIDE) != 0)
					if (this._assertFunctionIsOverridableInBaseClasses(context, this._members[i] as MemberFunctionDefinition) == null)
						context.errors.push(new CompileError(this._members[i].getToken(), "could not find function definition in base classes / mixins to be overridden"));
			for (var i = 0; i < this._implementTypes.length; ++i) {
				if ((this._implementTypes[i].getClassDef().flags() & ClassDefinition.IS_MIXIN) == 0)
					continue;
				var overrideFunctions = new MemberDefinition[];
				this._implementTypes[i].getClassDef()._getMembers(overrideFunctions, true, ClassDefinition.IS_OVERRIDE, ClassDefinition.IS_OVERRIDE);
				for (var j = 0; j < overrideFunctions.length; ++j) {
					var done = false;
					if (this._baseClassDef != null)
						if (this._baseClassDef._assertFunctionIsOverridable(context, overrideFunctions[j] as MemberFunctionDefinition) != null)
							done = true;
					for (var k = 0; k < i; ++k) {
						if (this._implementTypes[k].getClassDef()._assertFunctionIsOverridable(context, overrideFunctions[j] as MemberFunctionDefinition) != null) {
							done = true;
							break;
						}
					}
					if (! done)
						context.errors.push(new CompileError(this.getToken(), "could not find function definition to be overridden by '" + overrideFunctions[j].getClassDef().className() + "#" + overrideFunctions[j].name() + "'"));
				}
			}
		}
		// check that there are no "abstract" members for a concrete class
		if ((this._flags & (ClassDefinition.IS_ABSTRACT | ClassDefinition.IS_INTERFACE | ClassDefinition.IS_MIXIN)) == 0) {
			var abstractMembers = new MemberDefinition[];
			this.forEachClassToBase(function (classDef) {
				return classDef.forEachMember(function (member) {
					if ((member.flags() & ClassDefinition.IS_ABSTRACT) != 0) {
						for (var i = 0; i < abstractMembers.length; ++i) {
							if (ClassDefinition.membersAreEqual(abstractMembers[i], member)) {
								break;
							}
						}
						if (i == abstractMembers.length) {
							abstractMembers[i] = member;
						}
					}
					return true;
				});
			});
			this.forEachClassToBase(function (classDef) {
				return classDef.forEachMember(function (member) {
					if (abstractMembers.length == 0) {
						return false;
					}
					if ((member.flags() & ClassDefinition.IS_ABSTRACT) == 0) {
						for (var i = 0; i < abstractMembers.length; ++i) {
							if (ClassDefinition.membersAreEqual(abstractMembers[i], member)) {
								abstractMembers.splice(i, 1);
								break;
							}
						}
					}
					return true;
				});
			});
			if (abstractMembers.length != 0) {
				var msg = "class should be declared as 'abstract' since the following members do not have concrete definition: ";
				for (var i = 0; i < abstractMembers.length; ++i) {
					if (i != 0)
						msg += ", ";
					msg += abstractMembers[i].getClassDef().className() + "#" + abstractMembers[i].name();
				}
				context.errors.push(new CompileError(this.getToken(), msg));
			}
		}
		return false;
	}

	function _analyzeMemberFunctions (context : AnalysisContext) : void {
		// analyze the member functions, analysis of member variables is performed lazily (and those that where never analyzed will be removed by dead code elimination)
		for (var i = 0; i < this._members.length; ++i) {
			var member = this._members[i];
			if (member instanceof MemberFunctionDefinition
				&& ! (member instanceof TemplateFunctionDefinition)) {
				(member as MemberFunctionDefinition).analyze(context);
			}
		}
	}

	function analyzeUnusedVariables () : void {
		for (var i = 0; i < this._members.length; ++i) {
			var member = this._members[i];
			if (member instanceof MemberVariableDefinition)
				(member as MemberVariableDefinition).getType();
		}
	}

	function isConvertibleTo (classDef : ClassDefinition) : boolean {
		if (this == classDef)
			return true;
		if (classDef.className() == "Object")
			return true;
		if (this._extendType != null && this._extendType.getClassDef().isConvertibleTo(classDef))
			return true;
		for (var i = 0; i < this._implementTypes.length; ++i)
			if (this._implementTypes[i].getClassDef().isConvertibleTo(classDef))
				return true;
		return false;
	}

	function _assertMemberIsDefinable (context : AnalysisContext, member : MemberDefinition, memberClassDef : ClassDefinition, token : Token) : boolean {
		if ((member.flags() & ClassDefinition.IS_STATIC) != 0)
			return true;
		for (var numImplementsToCheck = 0; numImplementsToCheck < this._implementTypes.length; ++numImplementsToCheck)
			if (memberClassDef == this._implementTypes[numImplementsToCheck].getClassDef())
				break;
		var isCheckingSibling = numImplementsToCheck != this._implementTypes.length;
		if (member instanceof MemberVariableDefinition) {
			if (this._extendType != null && ! this._extendType.getClassDef()._assertMemberVariableIsDefinable(context, member as MemberVariableDefinition, memberClassDef, token))
				return false;
			for (var i = 0; i < numImplementsToCheck; ++i) {
				if (! this._implementTypes[i].getClassDef()._assertMemberVariableIsDefinable(context, member as MemberVariableDefinition, memberClassDef, token))
					return false;
			}
		} else { // function
			if (this._extendType != null && ! this._extendType.getClassDef()._assertMemberFunctionIsDefinable(context, member as MemberFunctionDefinition, memberClassDef, token, false))
				return false;
			for (var i = 0; i < numImplementsToCheck; ++i) {
				if (memberClassDef != this._implementTypes[i].getClassDef() && ! this._implementTypes[i].getClassDef()._assertMemberFunctionIsDefinable(context, member as MemberFunctionDefinition, memberClassDef, token, isCheckingSibling))
					return false;
			}
		}
		return true;
	}

	function _assertMemberVariableIsDefinable (context : AnalysisContext, member : MemberVariableDefinition, memberClassDef : ClassDefinition, token : Token) : boolean {
		for (var i = 0; i < this._members.length; ++i) {
			if (this._members[i].name() == member.name()) {
				if ((this._members[i].flags() & ClassDefinition.IS_ABSTRACT) == 0) {
					context.errors.push(new CompileError(token, "cannot define property '" + memberClassDef.className() + "#" + member.name() + "', the name is already used in '" + this.className() + "'"));
					return false;
				}
				if (! this._members[i].getType().equals(member.getType())) {
					context.errors.push(new CompileError(token, "cannot override property '" + this.className() + "#" + member.name() + "' of type '" + this._members[i].getType().toString() + "' in class '" + memberClassDef.className() + "' with different type '" + member.getType().toString() + "'"));
					return false;
				}
			}
		}
		if (this._extendType != null && ! this._extendType.getClassDef()._assertMemberVariableIsDefinable(context, member, memberClassDef, token))
			return false;
		for (var i = 0; i < this._implementTypes.length; ++i)
			if (! this._implementTypes[i].getClassDef()._assertMemberVariableIsDefinable(context, member, memberClassDef, token))
				return false;
		return true;
	}

	function _assertMemberFunctionIsDefinable (context : AnalysisContext, member : MemberFunctionDefinition, memberClassDef : ClassDefinition, token : Token, reportOverridesAsWell : boolean) : boolean {
		if (member.name() == "constructor")
			return true;
		for (var i = 0; i < this._members.length; ++i) {
			if (this._members[i].name() != member.name())
				continue;
			// property with the same name has been found, we can tell yes or no now
			if (this._members[i] instanceof MemberVariableDefinition) {
				context.errors.push(new CompileError(token, "cannot define property '" + memberClassDef.className() + "#" + member.name() + "', the name is already used in '" + this.className() + "'"));
				return false;
			}
			if (! Util.typesAreEqual((this._members[i] as MemberFunctionDefinition).getArgumentTypes(), member.getArgumentTypes()))
				continue;
			if ((member.flags() & ClassDefinition.IS_OVERRIDE) == 0) {
				context.errors.push(new CompileError(member.getToken(), "overriding functions must have 'override' attribute set (defined in base class '" + this.className() + "')"));
				return false;
			}
			if (reportOverridesAsWell && (this._members[i].flags() & ClassDefinition.IS_OVERRIDE) != 0) {
				context.errors.push(new CompileError(member.getToken(), "definition of the function conflicts with sibling mix-in '" + this.className() + "'"));
				return false;
			}
			// assertion of function being overridden does not have 'final' attribute is done by assertFunctionIsOverridable
			return true;
		}
		// delegate to base classes
		if (this._extendType != null && ! this._extendType.getClassDef()._assertMemberFunctionIsDefinable(context, member, memberClassDef, token, false))
			return false;
		for (var i = 0; i < this._implementTypes.length; ++i)
			if (! this._implementTypes[i].getClassDef()._assertMemberFunctionIsDefinable(context, member, memberClassDef, token, false))
				return false;
		return true;
	}

	function _assertFunctionIsOverridable (context : AnalysisContext, overrideDef : MemberFunctionDefinition) : Nullable.<boolean> {
		for (var i = 0; i < this._members.length; ++i) {
			if (this._members[i].name() == overrideDef.name()
				&& this._members[i] instanceof MemberFunctionDefinition
				&& ((this._members[i] as MemberFunctionDefinition).flags() & ClassDefinition.IS_STATIC) == 0
				&& Util.typesAreEqual((this._members[i] as MemberFunctionDefinition).getArgumentTypes(), overrideDef.getArgumentTypes())) {
				if ((this._members[i].flags() & ClassDefinition.IS_FINAL) != 0) {
					context.errors.push(new CompileError(overrideDef.getToken(), "cannot override final function defined in class '" + this.className() + "'"));
					return false;
				}
				var overrideReturnType = overrideDef.getReturnType();
				var memberReturnType = (this._members[i] as MemberFunctionDefinition).getReturnType();
				if (! (overrideReturnType.equals(memberReturnType) || overrideReturnType.isConvertibleTo(memberReturnType))
					|| (memberReturnType instanceof NullableType && ! (overrideReturnType instanceof NullableType))) {
					// only allow narrowing the return type
					context.errors.push(new CompileError(overrideDef.getToken(), "return type '" + overrideReturnType.toString() + "' is not convertible to '" + memberReturnType.toString() + "'"));
					return false;
				} else {
					return true;
				}
			}
		}
		return this._assertFunctionIsOverridableInBaseClasses(context, overrideDef);
	}

	function _assertFunctionIsOverridableInBaseClasses (context : AnalysisContext, member : MemberFunctionDefinition) : Nullable.<boolean> {
		if (this._extendType != null) {
			var ret = this._extendType.getClassDef()._assertFunctionIsOverridable(context, member);
			if (ret != null)
				return ret;
		}
		for (var i = 0; i < this._implementTypes.length; ++i) {
			var ret = this._implementTypes[i].getClassDef()._assertFunctionIsOverridable(context, member);
			if (ret != null)
				return ret;
		}
		return null;
	}

	function _getMembers (list : MemberDefinition[], functionOnly : boolean, flagsMask : number, flagsMaskMatch : number) : void {
		// fill in the definitions of base classes
		if (this._baseClassDef != null)
			this._baseClassDef._getMembers(list, functionOnly, flagsMask, flagsMaskMatch);
		for (var i = 0; i < this._implementTypes.length; ++i)
			this._implementTypes[i].getClassDef()._getMembers(list, functionOnly, flagsMask, flagsMaskMatch);
		// fill in the definitions of members
		for (var i = 0; i < this._members.length; ++i) {
			if (functionOnly && ! (this._members[i] instanceof MemberFunctionDefinition))
				continue;
			if ((this._members[i].flags() & flagsMask) != flagsMaskMatch)
				continue;
			for (var j = 0; j < list.length; ++j)
				if (list[j].name() == this._members[i].name())
					if ((list[j] instanceof MemberVariableDefinition) || Util.typesAreEqual((list[j] as MemberFunctionDefinition).getArgumentTypes(), (this._members[j] as MemberFunctionDefinition).getArgumentTypes()))
						break;
			if (j == list.length)
				list.push(this._members[i]);
		}
	}

	function hasDefaultConstructor () : boolean {
		var hasCtorWithArgs = false;
		for (var i = 0; i < this._members.length; ++i) {
			var member = this._members[i];
			if (member.name() == "constructor" && (member.flags() & ClassDefinition.IS_STATIC) == 0 && member instanceof MemberFunctionDefinition) {
				if ((member as MemberFunctionDefinition).getArguments().length == 0)
					return true;
				hasCtorWithArgs = true;
			}
		}
		return ! hasCtorWithArgs;
	}

	override function getOptimizerStash () : Map.<OptimizerStash> {
		return this._optimizerStash;
	}

	static function membersAreEqual (x : MemberDefinition, y : MemberDefinition) : boolean {
		if (x.name() != y.name())
			return false;
		if (x instanceof MemberFunctionDefinition) {
			if (! (y instanceof MemberFunctionDefinition))
				return false;
			if (! Util.typesAreEqual((x as MemberFunctionDefinition).getArgumentTypes(), (y as MemberFunctionDefinition).getArgumentTypes()))
				return false;
		} else {
			if (! (y instanceof MemberVariableDefinition))
				return false;
		}
		return true;
	}

}

// abstract class deriving Member(Function|Variable)Definition
abstract class MemberDefinition implements Stashable {

	var _token : Token;
	var _nameToken : Token;
	var _flags : number;
	var _docComment : DocComment;
	var _classDef : ClassDefinition;
	var _optimizerStash : Map.<OptimizerStash>;

	function constructor (token : Token, nameToken : Token, flags : number, docComment : DocComment) {
		this._token = token;
		this._nameToken = nameToken; // may be null
		this._flags = flags;
		this._docComment = docComment;
		this._classDef = null;
		this._optimizerStash = new Map.<OptimizerStash>;
	}

	abstract function serialize () : variant;

	abstract function instantiate (instantiationContext : InstantiationContext) : MemberDefinition;

	abstract function getType () : Type;

	// token of "function" or "var"
	function getToken () : Token {
		return this._token;
	}

	function getNameToken () : Token {
		return this._nameToken;
	}

	function name () : string {
		return this._nameToken.getValue();
	}

	function flags () : number {
		return this._flags;
	}

	function setFlags (flags : number) : void {
		this._flags = flags;
	}

	function getDocComment () : DocComment {
		return this._docComment;
	}

	function setDocComment (docComment : DocComment) : void {
		this._docComment = docComment;
	}

	function getClassDef () : ClassDefinition {
		return this._classDef;
	}

	function setClassDef (classDef : ClassDefinition) : void {
		this._classDef = classDef;
	}

	override function getOptimizerStash () : Map.<OptimizerStash> {
		return this._optimizerStash;
	}

}

class MemberVariableDefinition extends MemberDefinition {

	static const NOT_ANALYZED = 0;
	static const IS_ANALYZING = 1;
	static const ANALYZE_SUCEEDED = 2;
	static const ANALYZE_FAILED = 3;

	var _type : Type; // may be null
	var _initialValue : Expression; // may be null
	var _analyzeState : number;
	var _analysisContext : AnalysisContext;

	function constructor (token : Token, name : Token, flags : number, type : Type, initialValue : Expression, docComment : DocComment) {
		super(token, name, flags, docComment);
		this._type = type;
		this._initialValue = initialValue;
		this._analyzeState = MemberVariableDefinition.NOT_ANALYZED;
		this._analysisContext = null;
	}

	override function instantiate (instantiationContext : InstantiationContext) : MemberDefinition {
		var type = this._type != null ? this._type.instantiate(instantiationContext) : null;
		if (this._initialValue != null) {
			var initialValue = this._initialValue.clone();
			initialValue.instantiate(instantiationContext);
		} else {
			initialValue = Expression.getDefaultValueExpressionOf(type);
		}
		return new MemberVariableDefinition(this._token, this._nameToken, this._flags, type, initialValue, null);
	}

	override function toString () : string {
		return this.name() + " : " + this._type.toString();
	}

	override function serialize () : variant {
		return {
			"token"      : this._token.serialize(),
			"nameToken"  : Serializer.<Token>.serializeNullable(this._nameToken),
			"flags"        : this.flags(),
			"type"         : Serializer.<Type>.serializeNullable(this._type),
			"initialValue" : Serializer.<Expression>.serializeNullable(this._initialValue)
		} : Map.<variant>;
	}

	function setAnalysisContext (context : AnalysisContext) : void {
		this._analysisContext = context.clone() as AnalysisContext;
	}

	override function getType () : Type {
		switch (this._analyzeState) {
		case MemberVariableDefinition.NOT_ANALYZED:
			try {
				this._analyzeState = MemberVariableDefinition.IS_ANALYZING;
				if (this._initialValue != null) {
					if (! this._initialValue.analyze(this._analysisContext))
						return null;
					var ivType = this._initialValue.getType();
					if (this._type == null) {
						if (ivType.equals(Type.nullType)) {
							this._analysisContext.errors.push(new CompileError(this._initialValue.getToken(), "cannot assign null to an unknown type"));
							return null;
						}
						this._type = ivType.asAssignableType();
					} else if (! ivType.isConvertibleTo(this._type)) {
						this._analysisContext.errors.push(new CompileError(this._nameToken,
							"the variable is declared as '" + this._type.toString() + "' but initial value is '" + ivType.toString() + "'"));
					}
				}
				this._analyzeState = MemberVariableDefinition.ANALYZE_SUCEEDED;
			} finally {
				if (this._analyzeState != MemberVariableDefinition.ANALYZE_SUCEEDED)
					this._analyzeState = MemberVariableDefinition.ANALYZE_FAILED;
			}
			break;
		case MemberVariableDefinition.IS_ANALYZING:
			this._analysisContext.errors.push(new CompileError(this._token,
				"please declare type of variable '" + this.name() + "' (detected recursion while trying to reduce type)"));
			break;
		default:
			break;
		}
		return this._type;
	}

	function getInitialValue () : Expression {
		return this._initialValue;
	}

	function setInitialValue (initialValue : Expression) : void {
		this._initialValue = initialValue;
	}

}

class MemberFunctionDefinition extends MemberDefinition implements Block {

	var _returnType : Type;
	var _args : ArgumentDeclaration[];
	var _locals : LocalVariable[];
	var _statements : Statement[];
	var _closures : MemberFunctionDefinition[];
	var _lastTokenOfBody : Token;
	var _parent : MemberFunctionDefinition;

	function constructor (token : Token, name : Token, flags : number, returnType : Type, args : ArgumentDeclaration[], locals : LocalVariable[], statements : Statement[], closures : MemberFunctionDefinition[], lastTokenOfBody : Token, docComment : DocComment) {
		super(token, name, flags, docComment);
		this._returnType = returnType;
		this._args = args;
		this._locals = locals;
		this._statements = statements;
		this._closures = closures;
		this._lastTokenOfBody = lastTokenOfBody;
		this._parent = null;
		this._classDef = null;
		if (this._closures != null) {
			for (var i = 0; i < this._closures.length; ++i)
				this._closures[i].setParent(this);
		}
	}

	override function toString () : string {
		var argsText = this._args.map.<string>(function (arg) {
				return arg.getName().getValue() + " : " + arg.getType().toString();
			}).join(", ");
		return "function " +
			this.name() +
			"(" + argsText + ") : " +
			this._returnType.toString();
	}

	override function instantiate (instantiationContext : InstantiationContext) : MemberFunctionDefinition {
		return this._instantiateCore(
			instantiationContext,
			function (token, name, flags, returnType, args, locals, statements, closures, lastTokenOfBody, docComment) {
				return new MemberFunctionDefinition(token, name, flags, returnType, args, locals, statements, closures, lastTokenOfBody, docComment);
			});
	}

	function _instantiateCore (instantiationContext : InstantiationContext, constructCallback : function(:Token,:Token,:number,:Type,:ArgumentDeclaration[],:LocalVariable[],:Statement[],:MemberFunctionDefinition[],:Token,:DocComment):MemberFunctionDefinition) : MemberFunctionDefinition {
		// rewrite arguments (and push the instantiated args)
		var args = new ArgumentDeclaration[];
		for (var i = 0; i < this._args.length; ++i) {
			args[i] = this._args[i].instantiateAndPush(instantiationContext);
		}
		// rewrite function body
		if (this._statements != null) {
			// clone and rewrite the types of local variables
			var locals = new LocalVariable[];
			for (var i = 0; i < this._locals.length; ++i) {
				locals[i] = this._locals[i].instantiateAndPush(instantiationContext);
			}
			var caughtVariables = new CaughtVariable[]; // stored by the order they are defined, and 'shift'ed
			Util.forEachStatement(function onStatement(statement : Statement) : boolean {
				if (statement instanceof CatchStatement) {
					caughtVariables.push((statement as CatchStatement).getLocal().instantiateAndPush(instantiationContext));
				}
				return statement.forEachStatement(onStatement);
			}, this._statements);
			// clone and rewrite the types of the statements
			var statements = new Statement[];
			for (var i = 0; i < this._statements.length; ++i) {
				if (this._statements[i] instanceof ConstructorInvocationStatement) {
					// ConstructorInvocationStatement only appears at the top level of the function
					statements[i] = (this._statements[i] as ConstructorInvocationStatement).instantiate(instantiationContext);
				} else {
					statements[i] = this._statements[i].clone();
				}
			}
			Util.forEachStatement(function onStatement(statement : Statement) : boolean {
				if (statement instanceof CatchStatement) {
					if (caughtVariables.length == 0)
						throw new Error("logic flaw");
					(statement as CatchStatement).setLocal(caughtVariables.shift());
				}
				statement.forEachExpression(function (expr : Expression) : boolean {
					return expr.instantiate(instantiationContext);
				});
				return statement.forEachStatement(onStatement);
			}, statements);
			// clone and rewrite the types of closures
			var closures = new MemberFunctionDefinition[];
			for (var i = 0; i < this._closures.length; ++i) {
				closures[i] = this._closures[i].instantiate(instantiationContext);
			}
			// pop the instantiated locals
			for (var i = 0; i < this._locals.length; ++i) {
				if (this._locals[i].isInstantiated)
					throw new Error("logic flaw");
				this._locals[i].popInstantiated();
			}
			if (caughtVariables.length != 0)
				throw new Error("logic flaw");
			Util.forEachStatement(function onStatement(statement : Statement) : boolean {
				if (statement instanceof CatchStatement) {
					(statement as CatchStatement).getLocal().popInstantiated();
				}
				return statement.forEachStatement(onStatement);
			}, this._statements);
			// update the link from function expressions to closures
			Util.forEachStatement(function onStatement(statement : Statement) : boolean {
				function onExpr(expr : Expression) : boolean {
					if (expr instanceof FunctionExpression) {
						for (var i = 0; i < this._closures.length; ++i) {
							if (this._closures[i] == (expr as FunctionExpression).getFuncDef())
								break;
						}
						if (i == this._closures.length)
							throw new Error("logic flaw, cannot find the closure");
						(expr as FunctionExpression).setFuncDef(closures[i]);
					}
					return expr.forEachExpression(onExpr);
				}
				statement.forEachExpression(onExpr);
				return statement.forEachStatement(onStatement);
			}, statements);
		} else {
			locals = null;
			statements = null;
			closures = null;
		}
		// pop the instantiated args
		for (var i = 0; i < this._args.length; ++i)
			this._args[i].popInstantiated();
		// do the rest
		if (this._returnType != null) {
			var returnType = this._returnType.instantiate(instantiationContext);
			if (returnType == null)
				return null;
		} else {
			returnType = null;
		}
		return constructCallback(this._token, this._nameToken, this._flags, returnType, args, locals, statements, closures, this._lastTokenOfBody, this._docComment);
	}

	override function serialize () : variant {
		return {
			"token"      : this._token.serialize(),
			"nameToken"  : Serializer.<Token>.serializeNullable(this._nameToken),
			"flags"      : this.flags(),
			"returnType" : Serializer.<Type>.serializeNullable(this._returnType),
			"args"       : Serializer.<ArgumentDeclaration>.serializeArray(this._args),
			"locals"     : Serializer.<LocalVariable>.serializeArray(this._locals),
			"statements" : Serializer.<Statement>.serializeArray(this._statements)
		} : Map.<variant>;
	}

	function analyze (outerContext : AnalysisContext) : void {
		// validate jsxdoc comments
		var docComment = this.getDocComment();
		if (docComment) {
			var args = this.getArguments();
			docComment.getParams().forEach(function (docParam : DocCommentParameter, i : number) : void {
				for(; i < args.length; ++i) {
					if (args[i].getName().getValue() == docParam.getParamName()) {
						return;
					}
				}
				// invalid @param tag which is not present in the declaration.
				outerContext.errors.push(new CompileError(docParam.getToken(), 'invalid parameter name "' + docParam.getParamName() + '" for ' + this.name() + "()"));
			});
		}

		// return if is abtract (wo. function body) or is native
		if (this._statements == null)
			return;

		// setup context
		var context = (outerContext.clone() as AnalysisContext).setFuncDef(this);
		if (this._parent == null) {
			context.setBlockStack([ new BlockContext(new LocalVariableStatuses(this, null), this) ]);
		} else {
			context.setBlockStack(outerContext.blockStack);
			context.blockStack.push(new BlockContext(new LocalVariableStatuses(this, outerContext.getTopBlock().localVariableStatuses), this));
		}

		// check assignments to local variables
		Util.forEachStatement(function onStatement(statement : Statement) : boolean {
			if (statement instanceof ForInStatement
			    && (statement as ForInStatement).getLHSExpr() instanceof LocalExpression) {
				var forInStmt = statement as ForInStatement;
				var local = forInStmt.getLHSExpr() as LocalExpression;
				local.setLHS(true);
				local.getLocal().registerListExpr(forInStmt.getListExpr());
			}
			statement.forEachExpression(function onExpr(expr : Expression) : boolean {
				if (expr instanceof AssignmentExpression
					&& (expr as AssignmentExpression).getFirstExpr() instanceof LocalExpression
					&& (expr as AssignmentExpression).getToken().getValue() == '=') {
						var assignExpr = expr as AssignmentExpression;
						var local = assignExpr.getFirstExpr() as LocalExpression;
						local.setLHS(true);
						if (! (assignExpr.getSecondExpr() instanceof FunctionExpression)) {
							local.getLocal().registerRHSExpr(assignExpr.getSecondExpr());
						}
				}
				expr.forEachExpression(onExpr);
				return true;
			});
			statement.forEachStatement(onStatement);
			return true;
		}, this._statements);

		// infer types of local variables
		// TODO occur check, common type, local functions
		context.setCheckVariableStatus(false);
		this._locals.forEach(function (local) {
			if (local.getType() == null) {
				var commonType = null : Type;
				var rhsExprTypes = local.getRHSExprs().map.<Type>((expr) -> {
					expr.analyze(context);
					return expr.getType();
				});
				var succ = true;
				var listExprTypes = local.getListExprs().map.<Type>((expr) -> {
					var listTypeName = '';
					expr.analyze(context);
					if (expr.getType() instanceof ObjectType
						&& (expr.getType().getClassDef() instanceof InstantiatedClassDefinition)
						&& ((listTypeName = (expr.getType().getClassDef() as InstantiatedClassDefinition).getTemplateClassName()) == 'Array'
							|| listTypeName == 'Map')) {
						return listTypeName == 'Array' ? Type.numberType : Type.stringType;
					}
					succ = false;
					return null;
				});
				var types : Type[] = rhsExprTypes.concat(listExprTypes).filter.<Type>((t) -> { return t != null; });
				if (succ == false || types.length == 0) {
					context.errors.push(new CompileError(local.getName(), 'could not deduce the type of variable ' + local.getName().getValue()));
					return;
				}
				var type = Type.calcLeastCommonAncestor(types);
				if (type == null) {
					context.errors.push(new CompileError(local.getName(), 'error while deducing variable type ' + local.getName().getValue()));
					return;
				}
				local.setType(type);
			}
		});

		try {

			// do the checks
			context.setCheckVariableStatus(true);
			for (var i = 0; i < this._statements.length; ++i)
				if (! this._statements[i].analyze(context))
					break;
			if (! this._returnType.equals(Type.voidType) && context.getTopBlock().localVariableStatuses != null)
				context.errors.push(new CompileError(this._lastTokenOfBody, "missing return statement"));

			if (this.getNameToken() != null && this.name() == "constructor") {
				this._fixupConstructor(context);
			}

		} finally {
			context.blockStack.pop();
		}

	}

	function _fixupConstructor (context : AnalysisContext) : void {
		var success = true;
		var isAlternate = false;

		// make implicit calls to default constructor explicit as well as checking the invocation order
		var stmtIndex = 0;
		if (stmtIndex < this._statements.length
			&& this._statements[stmtIndex] instanceof ConstructorInvocationStatement
			&& (this._statements[stmtIndex] as ConstructorInvocationStatement).getConstructingClassDef() == this._classDef) {
			// alternate constructor invocation
			isAlternate = true;
			++stmtIndex;
		} else {
			for (var baseIndex = 0; baseIndex <= this._classDef.implementTypes().length; ++baseIndex) {
				var baseClassType = baseIndex == 0 ? this._classDef.extendType() : this._classDef.implementTypes()[baseIndex - 1];
				if (baseClassType != null) {
					if (stmtIndex < this._statements.length
						&& this._statements[stmtIndex] instanceof ConstructorInvocationStatement
						&& baseClassType.getClassDef() == (this._statements[stmtIndex] as ConstructorInvocationStatement).getConstructingClassDef()) {
						// explicit call to the base class, no need to complement
						if (baseClassType.getToken().getValue() == "Object")
							this._statements.splice(stmtIndex, 1);
						else
							++stmtIndex;
					} else {
						// insert call to the default constructor
						if (baseClassType.getClassDef().className() == "Object") {
							// we can omit the call
						} else if (baseClassType.getClassDef().hasDefaultConstructor()) {
							var ctorStmt = new ConstructorInvocationStatement(this._token, baseClassType, new Expression[]);
							this._statements.splice(stmtIndex, 0, ctorStmt);
							if (! ctorStmt.analyze(context))
								throw new Error("logic flaw");
							++stmtIndex;
						} else {
							if (stmtIndex < this._statements.length) {
								context.errors.push(new CompileError(this._statements[stmtIndex].getToken(), "constructor of class '" + baseClassType.toString() + "' should be called prior to the statement"));
							} else {
								context.errors.push(new CompileError(this._token, "super class '" + baseClassType.toString() + "' should be initialized explicitely (no default constructor)"));
							}
							success = false;
						}
					}
				}
			}
		}
		for (; stmtIndex < this._statements.length; ++stmtIndex) {
			if (! (this._statements[stmtIndex] instanceof ConstructorInvocationStatement))
				break;
			context.errors.push(new CompileError(this._statements[stmtIndex].getToken(), "constructors should be invoked in the order they are implemented"));
			success = false;
		}
		// NOTE: it is asserted by the parser that ConstructorInvocationStatements precede other statements
		if (! success)
			return;
		if (isAlternate) {
			return; // all the properties are initialized by the alternate constructor
		}

		var normalStatementFromIndex = stmtIndex;

		// find out the properties that need to be initialized (that are not initialized by the ctor explicitely before completion or being used)
		var initProperties = new Map.<boolean>;
		this._classDef.forEachMemberVariable(function (member) {
			if ((member.flags() & (ClassDefinition.IS_STATIC | ClassDefinition.IS_ABSTRACT)) == 0)
				initProperties[member.name()] = true;
			return true;
		});
		for (var i = normalStatementFromIndex; i < this._statements.length; ++i) {
			if (! (this._statements[i] instanceof ExpressionStatement))
				break;
			function onExpr(expr : Expression) : boolean {
				var lhsExpr;
				/*
					FIXME if the class is extending a native class and the expression is setting a property of the native class,
					then we should break, since it might have side effects (e.g. the property might be defined as a setter)
				*/
				if (expr instanceof AssignmentExpression
					&& expr.getToken().getValue() == "="
					&& (lhsExpr = (expr as AssignmentExpression).getFirstExpr()) instanceof PropertyExpression
					&& (lhsExpr as PropertyExpression).getExpr() instanceof ThisExpression) {
						initProperties[(lhsExpr as PropertyExpression).getIdentifierToken().getValue()] = false;
						return true;
				} else if (expr instanceof ThisExpression
					   || expr instanceof FunctionExpression) {
					return false;
				}
				return expr.forEachExpression(onExpr);
			}
			var canContinue = this._statements[i].forEachExpression(onExpr);
			if (! canContinue)
				break;
		}
		// insert the initializers
		var insertStmtAt = normalStatementFromIndex;
		this._classDef.forEachMemberVariable(function (member) {
			if ((member.flags() & (ClassDefinition.IS_STATIC | ClassDefinition.IS_ABSTRACT)) == 0) {
				if (initProperties[member.name()]) {
					var stmt = new ExpressionStatement(
						new AssignmentExpression(new Token("=", false),
							new PropertyExpression(new Token(".", false),
								new ThisExpression(new Token("this", false), this._classDef),
								member.getNameToken(), new Type[], member.getType()),
							member.getInitialValue()));
					this._statements.splice(insertStmtAt++, 0, stmt);
				}
			}
			return true;
		});
	}

	function getReturnType () : Type {
		return this._returnType;
	}

	function getArguments () : ArgumentDeclaration[] {
		return this._args;
	}

	function getArgumentTypes () : Type[] {
		var argTypes = new Type[];
		for (var i = 0; i < this._args.length; ++i)
			argTypes[i] = this._args[i].getType();
		return argTypes;
	}

	function getParent () : MemberFunctionDefinition {
		return this._parent;
	}

	function setParent (parent : MemberFunctionDefinition) : void {
		this._parent = parent;
	}

	// return list of local variables (omitting arguments)
	function getLocals () : LocalVariable[] {
		return this._locals;
	}

	function getStatements () : Statement[] {
		return this._statements;
	}

	function getClosures () : MemberFunctionDefinition[] {
		return this._closures;
	}

	// return an argument or a local variable
	function getLocal (context : AnalysisContext, name : string) : LocalVariable {
		// for the current function, check the caught variables
		for (var i = context.blockStack.length - 1; i >= 0; --i) {
			var block = context.blockStack[i].block;
			if (block instanceof MemberFunctionDefinition) {
				// function scope
				for (var j = 0; j < (block as MemberFunctionDefinition)._locals.length; ++j) {
					var local = (block as MemberFunctionDefinition)._locals[j];
					if (local.getName().getValue() == name)
						return local;
				}
				for (var j = 0; j < (block as MemberFunctionDefinition)._args.length; ++j) {
					var arg = (block as MemberFunctionDefinition)._args[j];
					if (arg.getName().getValue() == name)
						return arg;
				}
			} else if (block instanceof CatchStatement) {
				// catch statement
				var local = (block as CatchStatement).getLocal();
				if (local.getName().getValue() == name)
					return local;
			}
		}
		return null;
	}

	override function getType () : FunctionType {
		return (this._flags & ClassDefinition.IS_STATIC) != 0
			? (new StaticFunctionType(this._returnType, this.getArgumentTypes(), false) as FunctionType)
			: (new MemberFunctionType(new ObjectType(this._classDef), this._returnType, this.getArgumentTypes(), false) as FunctionType);
	}

	function deductTypeIfUnknown (context : AnalysisContext, type : ResolvedFunctionType) : boolean {
		// first, check if there are any unresolved types
		for (var i = 0; i < this._args.length; ++i) {
			if (this._args[i].getType() == null)
				break;
		}
		if (i == this._args.length && this._returnType != null)
			return true;
		// resolve!
		if (type.getArgumentTypes().length != this._args.length) {
			context.errors.push(new CompileError(this.getToken(), "expected the function to have " + type.getArgumentTypes().length as string + " arguments, but found " + this._args.length as string));
			return false;
		} else if (this._args.length != 0 && type.getArgumentTypes()[this._args.length - 1] instanceof VariableLengthArgumentType) {
			context.errors.push(new CompileError(this.getToken(), "could not deduct function argument (left hand expression is a function with an variable-length argument)"));
			return false;
		}
		for (var i = 0; i < this._args.length; ++i) {
			if (this._args[i].getType() != null) {
				if (! this._args[i].getType().equals(type.getArgumentTypes()[i])) {
					context.errors.push(new CompileError(this.getToken(), "detected type conflict for argument '" + this._args[i].getName().getValue() + "' (expected '" + type.getArgumentTypes()[i].toString() + "' but found '" + this._args[i].getType().toString() + "'"));
					return false;
				}
			} else {
				this._args[i].setTypeForced(type.getArgumentTypes()[i]);
			}
		}
		if (this._returnType != null) {
			if (! this._returnType.equals(type.getReturnType())) {
				context.errors.push(new CompileError(this.getToken(), "detected return type conflict, expected '" + type.getReturnType().toString() + "' but found '" + this._returnType.toString() + "'"));
				return false;
			}
		} else {
			this._returnType = type.getReturnType();
		}
		return true;
	}

	function forEachStatement (cb : function(:Statement):boolean) : boolean {
		return Util.forEachStatement(cb, this._statements);
	}

	function forEachClosure (cb : function(:MemberFunctionDefinition):boolean) : boolean {
		if (this._closures != null)
			for (var i = 0; i < this._closures.length; ++i)
				if (! cb(this._closures[i]))
					return false;
		return true;
	}

}

class InstantiatedMemberFunctionDefinition extends MemberFunctionDefinition {

	function constructor (token : Token, name : Token, flags : number, returnType : Type, args : ArgumentDeclaration[], locals : LocalVariable[], statements : Statement[], closures : MemberFunctionDefinition[], lastTokenOfBody : Token, docComment : DocComment) {
		super(token, name, flags, returnType, args, locals, statements, closures, lastTokenOfBody, docComment);
	}

}

class TemplateFunctionDefinition extends MemberFunctionDefinition {

	var _typeArgs : Token[];
	var _resolvedTypemap : Map.<Type>;
	var _instantiatedDefs : TypedMap.<Type[], MemberFunctionDefinition>;

	function constructor (token : Token, name : Token, flags : number, typeArgs : Token[], returnType : Type, args : ArgumentDeclaration[], locals : LocalVariable[], statements : Statement[], closures : MemberFunctionDefinition[], lastTokenOfBody : Token, docComment : DocComment) {
		super(token, name, flags, returnType, args, locals, statements, closures, lastTokenOfBody, docComment);
		this._typeArgs = typeArgs.concat(new Token[]);
		this._instantiatedDefs = new TypedMap.<Type[], MemberFunctionDefinition>(function (x, y) {
			for (var i = 0; i < x.length; ++i) {
				if (! x[i].equals(y[i])) {
					return false;
				}
			}
			return true;
		});
		this._resolvedTypemap = new Map.<Type>;
	}

	function getTypeArguments () : Token[] {
		return this._typeArgs;
	}

	override function instantiate (instantiationContext : InstantiationContext) : MemberFunctionDefinition {
		var instantiated = new TemplateFunctionDefinition(
			this._token, this.getNameToken(), this.flags(), this._typeArgs.concat(new Token[]), this._returnType, this._args.concat(new ArgumentDeclaration[]),
			this._locals, this._statements, this._closures, this._lastTokenOfBody, this._docComment);
		for (var k in this._resolvedTypemap) {
			instantiated._resolvedTypemap[k] = this._resolvedTypemap[k];
		}
		for (var k in instantiationContext.typemap) {
			instantiated._resolvedTypemap[k] = instantiationContext.typemap[k];
		}
		return instantiated;
	}

	function instantiateTemplateFunction (errors : CompileError[], token : Token, typeArgs : Type[]) : MemberFunctionDefinition {
		// return the already-instantiated one, if exists
		var instantiated : MemberFunctionDefinition = this._instantiatedDefs.get(typeArgs);
		if (instantiated != null) {
			return instantiated;
		}
		// instantiate
		var instantiationContext = _Util.buildInstantiationContext(errors, token, this._typeArgs, typeArgs);
		if (instantiationContext == null) {
			return null;
		}
		for (var k in this._resolvedTypemap) {
			instantiationContext.typemap[k] = this._resolvedTypemap[k];
		}
		instantiated = this._instantiateCore(
			instantiationContext,
			function (token, name, flags, returnType, args, locals, statements, closures, lastTokenOfBody, docComment) {
				return new InstantiatedMemberFunctionDefinition(token, name, flags, returnType, args, locals, statements, closures, lastTokenOfBody, docComment);
			});
		if (instantiated == null) {
			return null;
		}
		instantiated.setClassDef(this._classDef);
		this._classDef._members.push(instantiated);
		// analyze
		var analysisContext = new AnalysisContext(errors, this._classDef.getParser(), function (parser, classDef) { throw new Error("not implemented"); });
		for (var i = 0; i < instantiationContext.objectTypesUsed.length; ++i)
			instantiationContext.objectTypesUsed[i].resolveType(analysisContext);
		instantiated.analyze(analysisContext);
		// register, and return
		this._instantiatedDefs.put(typeArgs.concat(new Type[]), instantiated);
		return instantiated;
	}

}

class LocalVariable {

	var _name : Token;
	var _type : Type;
	var _instantiated : LocalVariable[];
	var _rhsExprs : Expression[];
	var _listExprs : Expression[];
	var isInstantiated = false;

	function constructor (name : Token, type : Type) {
		this._name = name;
		this._type = type;
		this._instantiated = new LocalVariable[];
		this._rhsExprs = new Expression[];
		this._listExprs = new Expression[];
	}

	function serialize () : variant {
		return [
			this._name,
			Serializer.<Type>.serializeNullable(this._type)
		] : variant[];
	}

	function getName () : Token {
		return this._name;
	}

	function getType () : Type {
		return this._type;
	}

	function setType (type : Type) : void {
		if (this._type != null)
			throw new Error("type is already set");
		// implicit declarations of "int" is not supported
		if (type.equals(Type.integerType))
			type = Type.numberType;
		this._type = type;
	}

	function setTypeForced (type : Type) : void {
		this._type = type;
	}

	function getRHSExprs () : Expression[] {
		return this._rhsExprs;
	}

	function registerRHSExpr (expr : Expression) : void {
		this._rhsExprs.push(expr);
	}

	function getListExprs () : Expression[] {
		return this._listExprs;
	}

	function registerListExpr (expr : Expression) : void {
		this._listExprs.push(expr);
	}

	function touchVariable (context : AnalysisContext, token : Token, isAssignment : boolean) : boolean {
		if (isAssignment) {
			context.getTopBlock().localVariableStatuses.setStatus(this);
		} else {
			switch (context.getTopBlock().localVariableStatuses.getStatus(this)) {
			case LocalVariableStatuses.ISSET:
				// ok
				break;
			case LocalVariableStatuses.UNSET:
				context.errors.push(new CompileError(token, "variable is not initialized"));
				return false;
			case LocalVariableStatuses.MAYBESET:
				context.errors.push(new CompileError(token, "variable may not be initialized"));
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
		var type = this._type != null ? this._type.instantiate(instantiationContext) : null;
		return new LocalVariable(this._name, type);
	}

}

class CaughtVariable extends LocalVariable {

	function constructor (name : Token, type : Type) {
		super(name, type);
	}

	function clone () : CaughtVariable {
		return new CaughtVariable(this._name, this._type);
	}

	override function touchVariable (context : AnalysisContext, token : Token, isAssignment : boolean) : boolean {
		return true;
	}

	override function _instantiate (instantiationContext : InstantiationContext) : CaughtVariable {
		return new CaughtVariable(this._name, this._type.instantiate(instantiationContext));
	}

	override function instantiateAndPush (instantiationContext : InstantiationContext) : CaughtVariable {
		return super.instantiateAndPush(instantiationContext) as CaughtVariable;
	}
}

class ArgumentDeclaration extends LocalVariable {

	function constructor (name : Token, type : Type) {
		super(name, type);
	}

	function clone () : Object {
		return new ArgumentDeclaration(this._name, this._type);
	}

	override function _instantiate (instantiationContext : InstantiationContext) : ArgumentDeclaration {
		var type = this._type != null ? this._type.instantiate(instantiationContext) : null;
		return new ArgumentDeclaration(this._name, type);
	}

	override function instantiateAndPush (instantiationContext : InstantiationContext) : ArgumentDeclaration {
		return super.instantiateAndPush(instantiationContext) as ArgumentDeclaration;
	}

}

class LocalVariableStatuses {

	static const UNSET = 0;
	static const ISSET = 1;
	static const MAYBESET = 2;

	var _statuses : Map.<number>;

	function constructor (funcDef : MemberFunctionDefinition, base : LocalVariableStatuses) {
		this._statuses = new Map.<number>;

		if (base != null) {
			// FIXME the analysis of the closures should be delayed to either of: first being used, or return is called, to minimize the appearance of the "not initialized" error
			for (var k in base._statuses)
				this._statuses[k] = base._statuses[k] == LocalVariableStatuses.UNSET ? LocalVariableStatuses.MAYBESET : base._statuses[k] as number;
		}
		var args = funcDef.getArguments();
		for (var i = 0; i < args.length; ++i)
			this._statuses[args[i].getName().getValue()] = LocalVariableStatuses.ISSET;
		var locals = funcDef.getLocals();
		for (var i = 0; i < locals.length; ++i)
			this._statuses[locals[i].getName().getValue()] = LocalVariableStatuses.UNSET;
	}

	function constructor (srcStatus : LocalVariableStatuses) {
		this._statuses = new Map.<number>;
		this._copyFrom(srcStatus);
	}

	function clone () : LocalVariableStatuses {
		return new LocalVariableStatuses(this);
	}

	function merge (that : LocalVariableStatuses) : LocalVariableStatuses {
		var ret = this.clone() as LocalVariableStatuses;
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

	function _copyFrom (that : LocalVariableStatuses) : void {
		for (var k in that._statuses)
			this._statuses[k] = that._statuses[k];
	}

}

class TemplateClassDefinition extends ClassDefinition {

	var _typeArgs : Token[];

	function constructor (token : Token, className : string, flags : number, typeArgs : Token[], extendType : ParsedObjectType, implementTypes : ParsedObjectType[], members : MemberDefinition[], objectTypesUsed : ParsedObjectType[], docComment : DocComment) {
		super(token, className, flags, extendType, implementTypes, members, objectTypesUsed, docComment);
		this._token = token;
		this._className = className;
		this._flags = flags;
		this._typeArgs = typeArgs.concat(new Token[]);
		// reset members' classDef
		for (var i = 0; i < this._members.length; ++i) {
			this._members[i].setClassDef(this);
			if (this._members[i] instanceof MemberFunctionDefinition) {
				function setClassDef(funcDef : MemberFunctionDefinition) : boolean {
					funcDef.setClassDef(this);
					return funcDef.forEachClosure(setClassDef);
				}
				(this._members[i] as MemberFunctionDefinition).forEachClosure(setClassDef);
			}
		}
	}

	override function getToken () : Token {
		return this._token;
	}

	override function className () : string {
		return this._className;
	}

	override function flags () : number {
		return this._flags;
	}

	function getTypeArguments () : Token[] {
		return this._typeArgs;
	}

	function instantiate (errors : CompileError[], request : TemplateInstantiationRequest) : InstantiatedClassDefinition {
		// prepare
		var instantiationContext = _Util.buildInstantiationContext(errors, request.getToken(), this._typeArgs, request.getTypeArguments());
		if (instantiationContext == null) {
			return null;
		}
		// instantiate the members
		var succeeded = true;
		var members = new MemberDefinition[];
		for (var i = 0; i < this._members.length; ++i) {
			var member = this._members[i].instantiate(instantiationContext);
			if (member == null)
				succeeded = false;
			members[i] = member;
		}
		// done
		if (! succeeded)
			return null;
		var instantiatedDef = new InstantiatedClassDefinition(
			this,
			request.getTypeArguments(),
			this._extendType != null ? this._extendType.instantiate(instantiationContext) as ParsedObjectType: null,
			this._implementTypes.map.<ParsedObjectType>(function (t) { return t.instantiate(instantiationContext) as ParsedObjectType; }),
			members,
			instantiationContext.objectTypesUsed);
		return instantiatedDef;
	}

}

class InstantiatedClassDefinition extends ClassDefinition {

	var _templateClassDef : TemplateClassDefinition;
	var _typeArguments : Type[];

	function constructor (templateClassDef : TemplateClassDefinition, typeArguments : Type[], extendType : ParsedObjectType, implementTypes : ParsedObjectType[], members : MemberDefinition[], objectTypesUsed : ParsedObjectType[]) {
		super(
			null,
			Type.templateTypeToString(templateClassDef.className(), typeArguments),
			templateClassDef.flags(),
			extendType,
			implementTypes,
			members,
			objectTypesUsed,
			null /* docComment is not used for instantiated class */);
		this._templateClassDef = templateClassDef;
		this._typeArguments = typeArguments;
	}

	function getTemplateClass () : TemplateClassDefinition {
		return this._templateClassDef;
	}

	function getTemplateClassName () : string {
		return this._templateClassDef.className();
	}

	function getTypeArguments () : Type[] {
		return this._typeArguments;
	}

	function typeArgumentsAreEqual (typeArgs : Type[]) : boolean {
		if (! (this._typeArguments.length == typeArgs.length))
			return false;
		for (var i = 0; i < typeArgs.length; ++i) {
			if (! this._typeArguments[i].equals(typeArgs[i]))
				return false;
		}
		return true;
	}

}
