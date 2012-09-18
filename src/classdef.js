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
var Type = require("./type");
eval(Class.$import("./util"));

"use strict";

var _Util = exports._Util = Class.extend({

	$buildInstantiationContext: function (errors, token, formalTypeArgs, actualTypeArgs) {
		// check number of type arguments
		if (formalTypeArgs.length != actualTypeArgs.length) {
			errors.push(new CompileError(token, "wrong number of template arguments (expected " + formalTypeArgs.length + ", got " + actualTypeArgs.length));
			return null;
		}
		// build context
		var instantiationContext = {
			errors: errors,
			typemap: {}, // string => Type
			objectTypesUsed: []
		};
		for (var i = 0; i < formalTypeArgs.length; ++i) {
			instantiationContext.typemap[formalTypeArgs[i].getValue()] = actualTypeArgs[i];
		}
		return instantiationContext;
	}

});

var BlockContext = exports.BlockContext = Class.extend({

	constructor: function (localVariableStatuses, statement) {
		this.localVariableStatuses = localVariableStatuses;
		this.statement = statement;
	}

});

var AnalysisContext = exports.AnalysisContext = Class.extend({

	constructor: function (errors, parser, postInstantiationCallback) {
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
	},

	clone: function () {
		// NOTE: does not clone the blockStack (call setBlockStack)
		return new AnalysisContext(this.errors, this.parser, this.postInstantiationCallback).setFuncDef(this.funcDef);
	},

	setFuncDef: function (funcDef) {
		this.funcDef = funcDef;
		return this;
	},

	setBlockStack: function (stack) {
		this.blockStack = stack;
		return this;
	},

	getTopBlock: function () {
		return this.blockStack[this.blockStack.length - 1];
	}

});

var ClassDefinition = exports.ClassDefinition = Class.extend({

	$IS_CONST: 1,
	$IS_ABSTRACT: 2,
	$IS_FINAL: 4,
	$IS_STATIC: 8,
	$IS_NATIVE: 16,
	$IS_OVERRIDE: 32,
	$IS_INTERFACE: 64,
	$IS_MIXIN: 128,
	$IS_FAKE: 256, // used for marking a JS non-class object that should be treated like a JSX class instance (e.g. window)
	$IS_READONLY: 512,
	$IS_INLINE: 1024,
	$IS_PURE: 2048, // constexpr (intended for for native functions)
	$IS_DELETE: 4096, // used for disabling the default constructor

	constructor: function (token, className, flags, extendType, implementTypes, members, objectTypesUsed, docComment) {
		this._parser = null;
		this._token = token;
		this._className = className;
		this._outputClassName = null;
		this._flags = flags;
		this._extendType = extendType; // null for interfaces, mixins, and Object class only
		this._implementTypes = implementTypes;
		this._members = members;
		this._objectTypesUsed = objectTypesUsed;
		this._docComment = docComment;
		this._optimizerStash = {};
		for (var i = 0; i < this._members.length; ++i) {
			this._members[i].setClassDef(this);
			if (this._members[i] instanceof MemberFunctionDefinition) {
				this._members[i].forEachClosure(function setClassDef(funcDef) {
					funcDef.setClassDef(this);
					return funcDef.forEachClosure(setClassDef.bind(this));
				}.bind(this));
			}
		}
	},

	serialize: function () {
		// FIXME implement in a way that is compatible with JSX
		return {
			"token"      : this._token,
			"name"       : this._className,
			"flags"      : this._flags,
			"extends"    : Util.serializeNullable(this._extendType),
			"implements" : Util.serializeArray(this._implementTypes),
			"members"    : Util.serializeArray(this._members)
		};
	},

	$serialize: function (classDefs) {
		var s = [];
		for (var i = 0; i < classDefs.length; ++i)
			s[i] = classDefs[i].serialize();
		return JSON.stringify(s, null, 2);
	},

	getParser: function () {
		return this._parser;
	},

	setParser: function (parser) {
		this._parser = parser;
	},

	getToken: function () {
		return this._token;
	},

	className: function () {
		return this._className;
	},

	setOutputClassName: function (name) {
		this._outputClassName = name;
	},

	getOutputClassName: function () {
		return this._outputClassName;
	},

	flags: function () {
		return this._flags;
	},

	setFlags: function (flags) {
		this._flags = flags;
	},

	extendType: function () {
		return this._extendType;
	},

	implementTypes: function () {
		return this._implementTypes;
	},

	members: function () {
		return this._members;
	},

	getDocComment: function () {
		return this._docComment;
	},

	setDocComment: function (docComment) {
		this._docComment = docComment;
	},

	forEachClassToBase: function (cb) {
		if (! cb(this))
			return false;
		for (var i = this._implementTypes.length - 1; i >= 0; --i) {
			if (! cb(this._implementTypes[i].getClassDef()))
				return false;
		}
		if (this._extendType != null)
			if (! this._extendType.getClassDef().forEachClassToBase(cb))
				return false;
		return true;
	},

	forEachClassFromBase: function (cb) {
		if (this._extendType != null)
			if (! this._extendType.getClassDef().forEachClassFromBase(cb))
				return false;
		for (var i = 0; i < this._implementTypes.length; ++i) {
			if (! cb(this._implementTypes[i]))
				return false;
		}
		if (! cb(this))
			return false;
		return true;
	},

	forEachMember: function (cb) {
		for (var i = 0; i < this._members.length; ++i) {
			if (! cb(this._members[i]))
				return false;
		}
		return true;
	},

	forEachMemberVariable: function (cb) {
		for (var i = 0; i < this._members.length; ++i) {
			if (this._members[i] instanceof MemberVariableDefinition) {
				if (! cb(this._members[i]))
					return false;
			}
		}
		return true;
	},

	forEachMemberFunction: function (cb) {
		for (var i = 0; i < this._members.length; ++i) {
			if (this._members[i] instanceof MemberFunctionDefinition) {
				if (! cb(this._members[i]))
					return false;
			}
		}
		return true;
	},

	$GET_MEMBER_MODE_ALL: 0, // looks for functions or variables from the class and all super classes
	$GET_MEMBER_MODE_CLASS_ONLY: 1, // looks for functions or variables within the class
	$GET_MEMBER_MODE_SUPER: 2, // looks for functions with body in super classes
	$GET_MEMBER_MODE_FUNCTION_WITH_BODY: 3, // looks for function with body
	
	getMemberTypeByName: function (errors, token, name, isStatic, typeArgs, mode) {
		// returns an array to support function overloading
		var types = [];
		function pushMatchingMember(classDef) {
			if (mode != ClassDefinition.GET_MEMBER_MODE_SUPER) {
				for (var i = 0; i < classDef._members.length; ++i) {
					var member = classDef._members[i];
					if ((member.flags() & ClassDefinition.IS_DELETE) != 0) {
						// skip
					} else if (isStatic == ((member.flags() & ClassDefinition.IS_STATIC) != 0)
						&& name == member.name()) {
						if (member instanceof MemberVariableDefinition) {
							if ((member.flags() & ClassDefinition.IS_OVERRIDE) == 0) {
								var type = member.getType();
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
									if ((member = member.instantiateTemplateFunction(errors, token, typeArgs)) == null) {
										return null;
									}
								}
								if (member.getStatements() != null || mode != ClassDefinition.GET_MEMBER_MODE_NOT_ABSTRACT) {
									for (var j = 0; j < types.length; ++j) {
										if (Util.typesAreEqual(member.getArgumentTypes(), types[j].getArgumentTypes())) {
											break;
										}
									}
									if (j == types.length) {
										types.push(member.getType());
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
			return new Type.FunctionChoiceType(types);
		}
	},

	resolveTypes: function (context) {
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
			var Parser = require("./parser");
			var isNative = (this.flags() & ClassDefinition.IS_NATIVE) != 0;
			var func = new MemberFunctionDefinition(
				this._token,
				new Parser.Token("constructor", true),
				ClassDefinition.IS_FINAL | (this.flags() & ClassDefinition.IS_NATIVE),
				Type.Type.voidType,
				[],
				isNative ? null : [],
				isNative ? null : [],
				isNative ? null : [],
				this._token /* FIXME */);
			func.setClassDef(this);
			this._members.push(func);
		}
	},

	setAnalysisContextOfVariables: function (context) {
		for (var i = 0; i < this._members.length; ++i) {
			var member = this._members[i];
			if (member instanceof MemberVariableDefinition)
				member.setAnalysisContext(context);
		}
	},

	analyze: function (context) {
		try {
			this._analyzeClassDef(context);
		} catch (e) {
			var Parser = require("./parser");
			var token = this.getToken();
			console.error("fatal error while analyzing class " + this.className());
			throw e;
		}
		this._analyzeMemberFunctions(context);
	},

	_analyzeClassDef: function (context) {
		var extendClassDef = this.extendType() != null ? this.extendType().getClassDef() : null;
		var implementClassDefs = this.implementTypes().map(function (type) {
			return type.getClassDef();
		});
		// check that inheritance is not in loop, and that classes are extended, and interfaces / mixins are implemented
		if ((this.flags() & (ClassDefinition.IS_INTERFACE | ClassDefinition.IS_MIXIN)) == 0) {
			if (extendClassDef != null) {
				if ((extendClassDef.flags() & ClassDefinition.IS_FINAL) != 0) {
					context.errors.push(new CompileError(this.getToken(), "cannot extend final class '" + extendClassDef.className() + "'"));
					return false;
				}
				if ((extendClassDef.flags() & (ClassDefinition.IS_INTERFACE | ClassDefinition.IS_MIXIN)) != 0) {
					context.errors.push(new CompileError(this.getToken(), "interfaces (or mixins) should be implemented, not extended"));
					return false;
				}
				if (! extendClassDef.forEachClassToBase(function (classDef) {
					if (this == classDef) {
						context.errors.push(new CompileError(this.getToken(), "class inheritance is in loop"));
						return false;
					}
					return true;
				}.bind(this))) {
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
				}.bind(this))) {
					return false;
				}
			}
		}
		// check that none of the mixins are implemented twice
		var allMixins = [];
		if (! this.forEachClassToBase(function (classDef) {
			if ((classDef.flags() & ClassDefinition.IS_MIXIN) != 0) {
				if (allMixins.indexOf(classDef) != -1) {
					context.errors.push(new CompileError(this.getToken(), "mixin '" + classDef.className() + "' is implemented twice"));
					return false;
				}
				allMixins.push(classDef);
			}
			return true;
		}.bind(this))) {
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
					if (this._assertFunctionIsOverridableInBaseClasses(context, this._members[i]) === null)
						context.errors.push(new CompileError(this._members[i].getToken(), "could not find function definition in base classes / mixins to be overridden"));
			for (var i = 0; i < this._implementTypes.length; ++i) {
				if ((this._implementTypes[i].getClassDef().flags & ClassDefinition.IS_MIXIN) == 0)
					continue;
				var overrideFunctions = [];
				this._implementTypes[i].getClassDef()._getMembers(overrideFunctions, true, ClassDefinition.IS_OVERRIDE, ClassDefinition.IS_OVERRIDE);
				for (var j = 0; j < overrideFunctions.length; ++j) {
					var done = false;
					if (this._baseClassDef != null)
						if (this._baseClassDef._assertFunctionIsOverridable(context, overrideFunctions[j]) !== null)
							done = true;
					for (var k = 0; k < i; ++k) {
						if (this._implementTypes[k].getClassDef()._assertFunctionIsOverridable(context, overrideFunctions[j]) !== null) {
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
			var abstractMembers = [];
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
				}.bind(this));
			}.bind(this));
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
				}.bind(this));
			}.bind(this));
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
	},

	_analyzeMemberFunctions: function (context) {
		// analyze the member functions, analysis of member variables is performed lazily (and those that where never analyzed will be removed by dead code elimination)
		for (var i = 0; i < this._members.length; ++i) {
			var member = this._members[i];
			if (member instanceof MemberFunctionDefinition
				&& ! (member instanceof TemplateFunctionDefinition)) {
				member.analyze(context, this);
			}
		}
	},

	analyzeUnusedVariables: function () {
		for (var i = 0; i < this._members.length; ++i) {
			var member = this._members[i];
			if (member instanceof MemberVariableDefinition)
				member.getType();
		}
	},

	isConvertibleTo: function (classDef) {
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
	},

	_assertMemberIsDefinable: function (context, member, memberClassDef, token) {
		if ((member.flags() & ClassDefinition.IS_STATIC) != 0)
			return true;
		for (var numImplementsToCheck = 0; numImplementsToCheck < this._implementTypes.length; ++numImplementsToCheck)
			if (memberClassDef == this._implementTypes[numImplementsToCheck].getClassDef())
				break;
		var isCheckingSibling = numImplementsToCheck != this._implementTypes.length;
		if (member instanceof MemberVariableDefinition) {
			if (this._extendType != null && ! this._extendType.getClassDef()._assertMemberVariableIsDefinable(context, member, memberClassDef, token))
				return false;
			for (var i = 0; i < numImplementsToCheck; ++i) {
				if (! this._implementTypes[i].getClassDef()._assertMemberVariableIsDefinable(context, member, memberClassDef, token))
					return false;
			}
		} else { // function
			if (this._extendType != null && ! this._extendType.getClassDef()._assertMemberFunctionIsDefinable(context, member, memberClassDef, token, false))
				return false;
			for (var i = 0; i < numImplementsToCheck; ++i) {
				if (memberClassDef != this._implementTypes[i].getClassDef() && ! this._implementTypes[i].getClassDef()._assertMemberFunctionIsDefinable(context, member, memberClassDef, token, isCheckingSibling))
					return false;
			}
		}
		return true;
	},

	_assertMemberVariableIsDefinable: function (context, member, memberClassDef, token) {
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
	},

	_assertMemberFunctionIsDefinable: function (context, member, memberClassDef, token, reportOverridesAsWell) {
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
			if (! Util.typesAreEqual(this._members[i].getArgumentTypes(), member.getArgumentTypes()))
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
	},

	_assertFunctionIsOverridable: function (context, overrideDef) {
		for (var i = 0; i < this._members.length; ++i) {
			if (this._members[i].name() == overrideDef.name()
				&& this._members[i] instanceof MemberFunctionDefinition
				&& (this._members[i] & ClassDefinition.IS_STATIC) == 0
				&& Util.typesAreEqual(this._members[i].getArgumentTypes(), overrideDef.getArgumentTypes())) {
				if ((this._members[i].flags() & ClassDefinition.IS_FINAL) != 0) {
					context.errors.push(new CompileError(overrideDef.getToken(), "cannot override final function defined in class '" + this.className() + "'"));
					return false;
				}
				var overrideReturnType = overrideDef.getReturnType();
				var memberReturnType = this._members[i].getReturnType();
				if (! (overrideReturnType.equals(memberReturnType) || overrideReturnType.isConvertibleTo(memberReturnType))
					|| (memberReturnType instanceof Type.NullableType && ! (overrideReturnType instanceof Type.NullableType))) {
					// only allow narrowing the return type
					context.errors.push(new CompileError(overrideDef.getToken(), "return type '" + overrideReturnType.toString() + "' is not convertible to '" + memberReturnType.toString() + "'"));
					return false;
				} else {
					return true;
				}
			}
		}
		return this._assertFunctionIsOverridableInBaseClasses(context, overrideDef);
	},

	_assertFunctionIsOverridableInBaseClasses: function (context, member) {
		if (this._extendType != null) {
			var ret = this._extendType.getClassDef()._assertFunctionIsOverridable(context, member);
			if (ret !== null)
				return ret;
		}
		for (var i = 0; i < this._implementTypes.length; ++i) {
			var ret = this._implementTypes[i].getClassDef()._assertFunctionIsOverridable(context, member);
			if (ret !== null)
				return ret;
		}
		return null;
	},

	_getMembers: function (list, functionOnly, flagsMask, flagsMaskMatch) {
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
					if ((list[j] instanceof MemberVariableDefinition) || Util.typesAreEqual(list[j].getArgumentTypes(), this._members[j].getArgumentTypes()))
						break;
			if (j == list.length)
				list.push(this._members[i]);
		}
	},

	hasDefaultConstructor: function () {
		var hasCtorWithArgs = false;
		for (var i = 0; i < this._members.length; ++i) {
			var member = this._members[i];
			if (member.name() == "constructor" && (member.flags() & ClassDefinition.IS_STATIC) == 0 && member instanceof MemberFunctionDefinition) {
				if (member.getArguments().length == 0)
					return true;
				hasCtorWithArgs = true;
			}
		}
		return ! hasCtorWithArgs;
	},

	getOptimizerStash: function () {
		return this._optimizerStash;
	},

	$membersAreEqual: function (x, y) {
		if (x.name() != y.name())
			return false;
		if (x instanceof MemberFunctionDefinition) {
			if (! (y instanceof MemberFunctionDefinition))
				return false;
			if (! Util.typesAreEqual(x.getArgumentTypes(), y.getArgumentTypes()))
				return false;
		} else {
			if (! (y instanceof MemberVariableDefinition))
				return false;
		}
		return true;
	}

});

// abstract class deriving Member(Function|Variable)Definition
var MemberDefinition = exports.MemberDefinition = Class.extend({

	constructor: function (token, nameToken, flags, docComment) {
		this._token = token;
		this._nameToken = nameToken; // may be null
		if(typeof(nameToken) === "string") throw new Error("nameToken must be a Token object or null!");
		this._flags = flags;
		this._docComment = docComment;
		this._classDef = null;
		this._optimizerStash = {};
	},

	// token of "function" or "var"
	getToken: function () {
		return this._token;
	},

	getNameToken: function () {
		return this._nameToken;
	},

	name: function () {
		return this._nameToken.getValue();
	},

	flags: function () {
		return this._flags;
	},

	setFlags: function (flags) {
		this._flags = flags;
	},

	getDocComment: function () {
		return this._docComment;
	},

	setDocComment: function (docComment) {
		this._docComment = docComment;
	},

	getClassDef: function () {
		return this._classDef;
	},

	setClassDef: function (classDef) {
		this._classDef = classDef;
	},

	getOptimizerStash: function () {
		return this._optimizerStash;
	}

});

var MemberVariableDefinition = exports.MemberVariableDefinition = MemberDefinition.extend({

	$NOT_ANALYZED: 0,
	$IS_ANALYZING: 1,
	$ANALYZE_SUCEEDED: 2,
	$ANALYZE_FAILED: 3,

	constructor: function (token, name, flags, type, initialValue, docComment) {
		MemberDefinition.call(this, token, name, flags, docComment);
		this._type = type; // may be null
		this._initialValue = initialValue; // may be null
		this._analyzeState = MemberVariableDefinition.NOT_ANALYZED;
		this._analysisContext = null;
	},

	instantiate: function (instantiationContext) {
		var Expression = require("./expression");
		var type = this._type != null ? this._type.instantiate(instantiationContext) : null;
		if (this._initialValue != null) {
			var initialValue = this._initialValue.clone();
			initialValue.instantiate(instantiationContext);
		} else {
			initialValue = Expression.Expression.getDefaultValueExpressionOf(type);
		}
		return new MemberVariableDefinition(this._token, this._nameToken, this._flags, type, initialValue);
	},

	toString: function () {
		return this.name() + " : " + this._type.toString();
	},

	serialize: function () {
		return {
			"name"         : this.name(),
			"flags"        : this.flags(),
			"type"         : Util.serializeNullable(this._type),
			"initialValue" : Util.serializeNullable(this._initialValue)
		};
	},

	setAnalysisContext: function (context) {
		this._analysisContext = context.clone();
	},

	getType: function () {
		switch (this._analyzeState) {
		case MemberVariableDefinition.NOT_ANALYZED:
			try {
				this._analyzeState = MemberVariableDefinition.IS_ANALYZING;
				if (this._initialValue != null) {
					if (! this._initialValue.analyze(this._analysisContext))
						return;
					var ivType = this._initialValue.getType();
					if (this._type == null) {
						if (ivType.equals(Type.Type.nullType)) {
							this._analysisContext.errors.push(new CompileError(this._initialValue.getToken(), "cannot assign null to an unknown type"));
							return;
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
	},

	getInitialValue: function () {
		return this._initialValue;
	},

	setInitialValue: function (initialValue) {
		this._initialValue = initialValue;
	}

});

var MemberFunctionDefinition = exports.MemberFunctionDefinition = MemberDefinition.extend({

	constructor: function (token, name, flags, returnType, args, locals, statements, closures, lastTokenOfBody, docComment) {
		MemberDefinition.prototype.constructor.call(this, token, name, flags, docComment);
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
	},

	toString: function () {
		var argsText = this._args.map(function (arg) {
				return arg.getName().getValue() + " : " + arg.getType().toString();
			}.bind(this)).join(", ");
		return "function " +
			this.name() +
			"(" + argsText + ") : " +
			this._returnType.toString();
	},

	instantiate: function (instantiationContext) {
		return this._instantiateCore(
			instantiationContext,
			function (token, name, flags, returnType, args, locals, statements, closures, lastTokenOfBody, docComment) {
				return new MemberFunctionDefinition(token, name, flags, returnType, args, locals, statements, closures, lastTokenOfBody, docComment);
			});
	},

	_instantiateCore: function (instantiationContext, constructCallback) {
		var Expression = require("./expression.js");
		var Statement = require("./statement.js");
		// rewrite arguments (and push the instantiated args)
		var args = [];
		for (var i = 0; i < this._args.length; ++i) {
			args[i] = this._args[i].instantiateAndPush(instantiationContext);
		}
		// rewrite function body
		if (this._statements != null) {
			// clone and rewrite the types of local variables
			var locals = [];
			for (var i = 0; i < this._locals.length; ++i) {
				locals[i] = this._locals[i].instantiateAndPush(instantiationContext);
			}
			var caughtVariables = []; // stored by the order they are defined, and 'shift'ed
			Util.forEachStatement(function onStatement(statement) {
				if (statement instanceof Statement.CatchStatement) {
					caughtVariables.push(statement.getLocal().instantiateAndPush(instantiationContext));
				}
				return statement.forEachStatement(onStatement);
			}, this._statements);
			// clone and rewrite the types of the statements
			var statements = [];
			for (var i = 0; i < this._statements.length; ++i) {
				if (this._statements[i] instanceof Statement.ConstructorInvocationStatement) {
					// ConstructorInvocationStatement only appears at the top level of the function
					statements[i] = this._statements[i].instantiate(instantiationContext);
				} else {
					statements[i] = this._statements[i].clone();
				}
			}
			Util.forEachStatement(function onStatement(statement) {
				if (statement instanceof Statement.CatchStatement) {
					if (caughtVariables.length == 0)
						throw new Error("logic flaw");
					statement.setLocal(caughtVariables.shift());
				}
				statement.forEachExpression(function (expr) {
					return expr.instantiate(instantiationContext);
				});
				return statement.forEachStatement(onStatement.bind(this));
			}.bind(this), statements);
			// clone and rewrite the types of closures
			var closures = [];
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
			Util.forEachStatement(function onStatement(statement) {
				if (statement instanceof Statement.CatchStatement) {
					statement.getLocal().popInstantiated();
				}
				return statement.forEachStatement(onStatement);
			}, this._statements);
			// update the link from function expressions to closures
			Util.forEachStatement(function onStatement(statement) {
				statement.forEachExpression(function onExpr(expr) {
					if (expr instanceof Expression.FunctionExpression) {
						for (var i = 0; i < this._closures.length; ++i) {
							if (this._closures[i] == expr.getFuncDef())
								break;
						}
						if (i == this._closures.length)
							throw new Error("logic flaw, cannot find the closure");
						expr.setFuncDef(closures[i]);
					}
					return expr.forEachExpression(onExpr.bind(this));
				}.bind(this));
				return statement.forEachStatement(onStatement.bind(this));
			}.bind(this), statements);
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
	},

	serialize: function () {
		return {
			"token"      : this._token.serialize(),
			"nameToken"  : Util.serializeNullable(this._nameToken),
			"flags"      : this.flags(),
			"returnType" : Util.serializeNullable(this._returnType),
			"args"       : Util.serializeArray(this._args),
			"locals"     : Util.serializeArray(this._locals),
			"statements" : Util.serializeArray(this._statements)
		};
	},

	analyze: function (outerContext) {
		// return if is abtract (wo. function body) or is native
		if (this._statements == null)
			return;

		// setup context
		var context = outerContext.clone().setFuncDef(this);
		if (this._parent == null) {
			context.setBlockStack([ new BlockContext(new LocalVariableStatuses(this, null), this) ]);
		} else {
			context.setBlockStack(outerContext.blockStack);
			context.blockStack.push(new BlockContext(new LocalVariableStatuses(this, outerContext.getTopBlock().localVariableStatuses), this));
		}

		try {

			// do the checks
			for (var i = 0; i < this._statements.length; ++i)
				if (! this._statements[i].analyze(context))
					break;
			if (! this._returnType.equals(Type.Type.voidType) && context.getTopBlock().localVariableStatuses != null)
				context.errors.push(new CompileError(this._lastTokenOfBody, "missing return statement"));

			if (this.getNameToken() != null && this.name() == "constructor") {
				this._fixupConstructor(context);
			}

		} finally {
			context.blockStack.pop();
		}

	},

	_fixupConstructor: function (context) {
		var Parser = require("./parser");
		var Expression = require("./expression");
		var Statement = require("./statement");

		var success = true;
		var isAlternate = false;

		// make implicit calls to default constructor explicit as well as checking the invocation order
		var stmtIndex = 0;
		if (stmtIndex < this._statements.length
			&& this._statements[stmtIndex] instanceof Statement.ConstructorInvocationStatement
			&& this._statements[stmtIndex].getConstructingClassDef() == this._classDef) {
			// alternate constructor invocation
			isAlternate = true;
			++stmtIndex;
		} else {
			for (var baseIndex = 0; baseIndex <= this._classDef.implementTypes().length; ++baseIndex) {
				var baseClassType = baseIndex == 0 ? this._classDef.extendType() : this._classDef.implementTypes()[baseIndex - 1];
				if (baseClassType != null) {
					if (stmtIndex < this._statements.length
						&& this._statements[stmtIndex] instanceof Statement.ConstructorInvocationStatement
						&& baseClassType.getClassDef() == this._statements[stmtIndex].getConstructingClassDef()) {
						// explicit call to the base class, no need to complement
						if (baseClassType.getToken() == "Object")
							this._statements.splice(stmtIndex, 1);
						else
							++stmtIndex;
					} else {
						// insert call to the default constructor
						if (baseClassType.getClassDef().className() == "Object") {
							// we can omit the call
						} else if (baseClassType.getClassDef().hasDefaultConstructor()) {
							var ctorStmt = new Statement.ConstructorInvocationStatement(this._token, baseClassType, []);
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
			if (! (this._statements[stmtIndex] instanceof Statement.ConstructorInvocationStatement))
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
		var initProperties = {};
		this._classDef.forEachMemberVariable(function (member) {
			if ((member.flags() & (ClassDefinition.IS_STATIC | ClassDefinition.IS_ABSTRACT)) == 0)
				initProperties[member.name()] = true;
			return true;
		}.bind(this));
		for (var i = normalStatementFromIndex; i < this._statements.length; ++i) {
			if (! (this._statements[i] instanceof Statement.ExpressionStatement))
				break;
			var canContinue = this._statements[i].forEachExpression(function onExpr(expr) {
				var lhsExpr;
				/*
					FIXME if the class is extending a native class and the expression is setting a property of the native class,
					then we should break, since it might have side effects (e.g. the property might be defined as a setter)
				*/
				if (expr instanceof Expression.AssignmentExpression
					&& expr.getToken().getValue() == "="
					&& (lhsExpr = expr.getFirstExpr()) instanceof Expression.PropertyExpression
					&& lhsExpr.getExpr() instanceof Expression.ThisExpression) {
					initProperties[lhsExpr.getIdentifierToken().getValue()] = false;
					return true;
				} else if (expr instanceof Expression.ThisExpression
					|| expr instanceof Expression.FunctionExpression) {
					return false;
				}
				return expr.forEachExpression(onExpr.bind(this));
			}.bind(this));
			if (! canContinue)
				break;
		}
		// insert the initializers
		var insertStmtAt = normalStatementFromIndex;
		this._classDef.forEachMemberVariable(function (member) {
			if ((member.flags() & (ClassDefinition.IS_STATIC | ClassDefinition.IS_ABSTRACT)) == 0) {
				if (initProperties[member.name()]) {
					var stmt = new Statement.ExpressionStatement(
						new Expression.AssignmentExpression(new Parser.Token("=", false),
							new Expression.PropertyExpression(new Parser.Token(".", false),
								new Expression.ThisExpression(new Parser.Token("this", false), this._classDef),
								member.getNameToken(), [], member.getType()),
							member.getInitialValue()));
					this._statements.splice(insertStmtAt++, 0, stmt);
				}
			}
			return true;
		}.bind(this));
	},

	getReturnType: function () {
		return this._returnType;
	},

	getArguments: function () {
		return this._args;
	},

	getArgumentTypes: function () {
		var argTypes = [];
		for (var i = 0; i < this._args.length; ++i)
			argTypes[i] = this._args[i].getType();
		return argTypes;
	},

	getParent: function () {
		return this._parent;
	},

	setParent: function (parent) {
		this._parent = parent;
	},

	// return list of local variables (omitting arguments)
	getLocals: function () {
		return this._locals;
	},

	getStatements: function () {
		return this._statements;
	},

	getClosures: function () {
		return this._closures;
	},

	// return an argument or a local variable
	getLocal: function (context, name) {
		var Statement = require("./statement");
		// for the current function, check the caught variables
		for (var i = context.blockStack.length - 1; i >= 0; --i) {
			var block = context.blockStack[i].statement;
			if (block instanceof MemberFunctionDefinition) {
				// function scope
				for (var j = 0; j < block._locals.length; ++j) {
					var local = block._locals[j];
					if (local.getName().getValue() == name)
						return local;
				}
				for (var j = 0; j < block._args.length; ++j) {
					var arg = block._args[j];
					if (arg.getName().getValue() == name)
						return arg;
				}
			} else if (block instanceof Statement.CatchStatement) {
				// catch statement
				var local = block.getLocal();
				if (local.getName().getValue() == name)
					return local;
			}
		}
		return null;
	},

	getType: function () {
		return (this._flags & ClassDefinition.IS_STATIC) != 0
			? new Type.StaticFunctionType(this._returnType, this.getArgumentTypes(), false)
			: new Type.MemberFunctionType(new Type.ObjectType(this._classDef), this._returnType, this.getArgumentTypes(), false);
	},

	deductTypeIfUnknown: function (context, type) {
		var Type = require("./type");
		// first, check if there are any unresolved types
		for (var i = 0; i < this._args.length; ++i) {
			if (this._args[i].getType() == null)
				break;
		}
		if (i == this._args.length && this._returnType != null)
			return true;
		// resolve!
		if (type.getArgumentTypes().length != this._args.length) {
			context.errors.push(new CompileError(this.getToken(), "expected the function to have " + type.getArgumentTypes().length + " arguments, but found " + this._args.length));
			return false;
		} else if (this._args.length != 0 && type.getArgumentTypes()[this._args.length - 1] instanceof Type.VariableLengthArgumentType) {
			context.errors.push(new CompileError(this.getToken(), "could not deduct function argument (left hand expression is a function with an variable-length argument)"));
			return false;
		}
		for (var i = 0; i < this._args.length; ++i) {
			if (this._args[i].getType() != null) {
				if (! this._args[i].getType().equals(type.getArgumentTypes()[i])) {
					context.errors.push(new CompileError(this.getToken(), "detected type conflict for argument '" + this._args[i].getName().getValue() + "' (expected '" + type.getArgumentTypes[i].toString() + "' but found '" + this._args[i].getType().toString() + "'"));
					return false;
				}
			} else {
				this._args[i].setTypeForced(type.getArgumentTypes()[i]);
			}
		}
		if (this._returnType != null) {
			if (! this._returnType.equals(type.getReturnType())) {
				context.errors.push(new CompileError(this.getToken(), "detected return type conflict, expected '" + type.getReturnType() + "' but found '" + this._returnType.toString() + "'"));
				return false;
			}
		} else {
			this._returnType = type.getReturnType();
		}
		return true;
	},

	forEachStatement: function (cb) {
		return Util.forEachStatement(cb, this._statements);
	},

	forEachClosure: function (cb) {
		if (this._closures != null)
			for (var i = 0; i < this._closures.length; ++i)
				if (! cb(this._closures[i]))
					return false;
		return true;
	}

});

var InstantiatedMemberFunctionDefinition = exports.InstantiatedMemberFunctionDefinition = MemberFunctionDefinition.extend({

	constructor: function (token, name, flags, returnType, args, locals, statements, closures, lastTokenOfBody, docComment) {
		MemberFunctionDefinition.prototype.constructor.call(this, token, name, flags, returnType, args, locals, statements, closures, lastTokenOfBody, docComment);
	}

});

var TemplateFunctionDefinition = exports.TemplateFunctionDefinition = MemberFunctionDefinition.extend({

	constructor: function (token, name, flags, typeArgs, returnType, args, locals, statements, closures, lastTokenOfBody, docComment) {
		MemberFunctionDefinition.prototype.constructor.call(this, token, name, flags, returnType, args, locals, statements, closures, lastTokenOfBody, docComment);
		this._typeArgs = typeArgs.concat([]);
		this._instantiatedDefs = new TypedMap(function (x, y) {
			for (var i = 0; i < x.length; ++i) {
				if (! x[i].equals(y[i])) {
					return false;
				}
			}
			return true;
		});
		this._resolvedTypemap = {};
	},

	getTypeArguments: function () {
		return this._typeArgs;
	},

	instantiate: function (instantiationContext) {
		var instantiated = new TemplateFunctionDefinition(
			this._token, this.getNameToken(), this.flags(), this._typeArgs.concat([]), this._returnType, this._args.concat([]),
			this._locals, this._statements, this._closures, this._lastTokenOfBody);
		for (var k in this._resolvedTypemap) {
			instantiated._resolvedTypemap[k] = this._resolvedTypemap[k];
		}
		for (var k in instantiationContext.typemap) {
			instantiated._resolvedTypemap[k] = instantiationContext.typemap[k];
		}
		return instantiated;
	},

	instantiateTemplateFunction: function (errors, token, typeArgs) {
		// return the already-instantiated one, if exists
		var instantiated = this._instantiatedDefs.get(typeArgs);
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
		instantiated.analyze(analysisContext, this._classDef);
		// register, and return
		this._instantiatedDefs.set(typeArgs.concat([]), instantiated);
		return instantiated;
	}

});

var LocalVariable = exports.LocalVariable = Class.extend({

	constructor: function (name, type) {
		this._name = name;
		this._type = type;
		this._instantiated = [];
	},

	serialize: function () {
		return [
			this._name,
			Util.serializeNullable(this._type)
		];
	},

	getName: function () {
		return this._name;
	},

	getType: function () {
		return this._type;
	},

	setType: function (type) {
		if (this._type != null)
			throw Error("type is already set");
		// implicit declarations of "int" is not supported
		if (type.equals(Type.Type.integerType))
			type = Type.Type.numberType;
		this._type = type;
	},

	setTypeForced: function (type) {
		this._type = type;
	},

	touchVariable: function (context, token, isAssignment) {
		if (isAssignment) {
			context.getTopBlock().localVariableStatuses.setStatus(this, LocalVariableStatuses.ISSET);
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
	},

	toString: function () {
		return this._name.getValue() + " : " + this._type.toString();
	},

	popInstantiated: function () {
		this._instantiated.pop();
	},

	getInstantiated: function () {
		if (this._instantiated.length == 0) {
			throw new Error("logic flaw, no instantiation for " + this._name.getValue() + "," + this.isInstantiated);
		}
		return this._instantiated[this._instantiated.length - 1];
	},

	instantiateAndPush: function (instantiationContext) {
		var instantiated = this._instantiate(instantiationContext);
		instantiated.isInstantiated = true;
		this._instantiated.push(instantiated);
		return instantiated;
	},

	_instantiate: function (instantiationContext) {
		var type = this._type != null ? this._type.instantiate(instantiationContext) : null;
		return new LocalVariable(this._name, type);
	}

});

var CaughtVariable = exports.CaughtVariable = LocalVariable.extend({

	constructor: function (name, type) {
		LocalVariable.prototype.constructor.call(this, name, type);
	},

	clone: function () {
		return new CaughtVariable(this._name, this._type);
	},

	touchVariable: function (context, token, isAssignment) {
		return true;
	},

	_instantiate: function (instantiationContext) {
		return new CaughtVariable(this._name, this._type.instantiate(instantiationContext));
	}

});

var ArgumentDeclaration = exports.ArgumentDeclaration = LocalVariable.extend({

	constructor: function (name, type) {
		LocalVariable.prototype.constructor.call(this, name, type);
	},

	clone: function () {
		return new ArgumentDeclaration(this._name, this._type);
	},

	_instantiate: function (instantiationContext) {
		var type = this._type != null ? this._type.instantiate(instantiationContext) : null;
		return new ArgumentDeclaration(this._name, type);
	}

});

var LocalVariableStatuses = exports.LocalVariableStatuses = Class.extend({

	$UNSET: 0,
	$ISSET: 1,
	$MAYBESET: 2,

	constructor: function () {
		this._statuses = {};

		switch (arguments.length) {

		case 2: // (funcDef : MemberFunctionDefinition, baseStatuses : LocalVariableStatuses)
			var funcDef = arguments[0];
			var base = arguments[1];
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
			break;

		case 1: // (srcStatus : LocalVariableStatus)
			this._copyFrom(arguments[0]);
			break;

		default:
			throw new Error("logic flaw");
		}
	},

	clone: function () {
		return new LocalVariableStatuses(this);
	},

	merge: function (that) {
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
	},

	setStatus: function (local) {
		var name = local.getName().getValue();
		if (this._statuses[name] === undefined)
			throw new Error("logic flaw, could not find status for local variable: " + name);
		this._statuses[name] = LocalVariableStatuses.ISSET;
	},

	getStatus: function (local) {
		var name = local.getName().getValue();
		if (this._statuses[name] === undefined)
			throw new Error("logic flaw, could not find status for local variable: " + name);
		return this._statuses[name];
	},

	_copyFrom: function (that) {
		for (var k in that._statuses)
			this._statuses[k] = that._statuses[k];
	}

});

var TemplateClassDefinition = exports.TemplateClassDefinition = Class.extend({

	constructor: function (token, className, flags, typeArgs, extendType, implementTypes, members, objectTypesUsed, docComment) {
		this._token = token;
		this._className = className;
		this._flags = flags;
		this._typeArgs = typeArgs.concat([]);
		this._extendType = extendType;
		this._implementTypes = implementTypes;
		this._members = members;
		this._objectTypesUsed = objectTypesUsed;
		this._docComment = docComment;
		for (var i = 0; i < this._members.length; ++i) {
			this._members[i].setClassDef(this);
			if (this._members[i] instanceof MemberFunctionDefinition) {
				this._members[i].forEachClosure(function setClassDef(funcDef) {
					funcDef.setClassDef(this);
					return funcDef.forEachClosure(setClassDef.bind(this));
				}.bind(this));
			}
		}
	},

	getToken: function () {
		return this._token;
	},

	className: function () {
		return this._className;
	},

	flags: function () {
		return this._flags;
	},

	getTypeArguments: function () {
		return this._typeArgs;
	},

	getDocComment: function () {
		return this._docComment;
	},

	setDocComment: function (docComment) {
		this._docComment = docComment;
	},

	instantiate: function (errors, request) {
		// prepare
		var instantiationContext = _Util.buildInstantiationContext(errors, request.getToken(), this._typeArgs, request.getTypeArguments());
		if (instantiationContext == null) {
			return null;
		}
		// instantiate the members
		var succeeded = true;
		var members = [];
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
			this._extendType != null ? this._extendType.instantiate(instantiationContext): null,
			this._implementTypes.map(function (t) { return t.instantiate(instantiationContext); }),
			members,
			instantiationContext.objectTypesUsed);
		return instantiatedDef;
	},

	forEachMember: function (cb) {
		for (var i = 0; i < this._members.length; ++i) {
			if (! cb(this._members[i]))
				return false;
		}
		return true;
	},

	forEachMemberVariable: function (cb) {
		for (var i = 0; i < this._members.length; ++i) {
			if (this._members[i] instanceof MemberVariableDefinition) {
				if (! cb(this._members[i]))
					return false;
			}
		}
		return true;
	},

	forEachMemberFunction: function (cb) {
		for (var i = 0; i < this._members.length; ++i) {
			if (this._members[i] instanceof MemberFunctionDefinition) {
				if (! cb(this._members[i]))
					return false;
			}
		}
		return true;
	}

});

var InstantiatedClassDefinition = exports.InstantiatedClassDefinition = ClassDefinition.extend({

	constructor: function (templateClassDef, typeArguments, extendType, implementTypes, members, objectTypesUsed) {
		ClassDefinition.prototype.constructor.call(
			this,
			null,
			Type.Type.templateTypeToString(templateClassDef.className(), typeArguments),
			templateClassDef.flags(),
			extendType,
			implementTypes,
			members,
			objectTypesUsed,
			null /* docComment is not used for instantiated class */);
		this._templateClassDef = templateClassDef;
		this._typeArguments = typeArguments;
	},

	getTemplateClass: function () {
		return this._templateClassDef;
	},

	getTemplateClassName: function () {
		return this._templateClassDef.className();
	},

	getTypeArguments: function () {
		return this._typeArguments;
	},

	typeArgumentsAreEqual: function (typeArgs) {
		if (! this._typeArguments.length == typeArgs.length)
			return false;
		for (var i = 0; i < typeArgs.length; ++i) {
			if (! this._typeArguments[i].equals(typeArgs[i]))
				return false;
		}
		return true;
	}

});
