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
import "./type.jsx";
import "./util.jsx";
import "./statement.jsx";
import "./expression.jsx";
import "./parser.jsx";
import "./doc.jsx";

mixin TemplateDefinition {

	function buildInstantiationContext (errors : CompileError[], token : Token, formalTypeArgs : Token[], actualTypeArgs : Type[]) : InstantiationContext {
		// check number of type arguments
		if (formalTypeArgs.length != actualTypeArgs.length) {
			errors.push(new CompileError(token, "wrong number of template arguments (expected " + formalTypeArgs.length as string + ", got " + actualTypeArgs.length as string + ")"));
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
	static const IS_GENERATOR = 8192;
	static const IS_EXPORT = 16384; // no overloading, no minification of method / variable names
	static const IS_GENERATED = 32768;

	var _parser		: Parser;
	var _token		: Token;
	var _className		: string;
	var _flags		: number;
	var _extendType		: ParsedObjectType; // null for interfaces, mixins, and Object class only
	var _implementTypes	: ParsedObjectType[];
	var _members		: MemberDefinition[];
	var _inners		: ClassDefinition[];
	var _templateInners	: TemplateClassDefinition[];
	var _objectTypesUsed	: ParsedObjectType[];
	var _docComment		: DocComment;

	var _baseClassDef  : ClassDefinition = null;
	var _outerClassDef : ClassDefinition = null;

	var _nativeSource : Token = null;

	var _analized = false;

	function constructor (token : Token, className : string, flags : number, extendType : ParsedObjectType, implementTypes : ParsedObjectType[], members : MemberDefinition[], inners : ClassDefinition[], templateInners : TemplateClassDefinition[], objectTypesUsed : ParsedObjectType[], docComment : DocComment) {
		this._parser = null;
		this._token = token;
		this._className = className;
		this._flags = flags;
		this._extendType = extendType;
		this._implementTypes = implementTypes;
		this._members = members;
		this._inners = inners;
		this._templateInners = templateInners;
		this._objectTypesUsed = objectTypesUsed;
		this._docComment = docComment;

		this._resetMembersClassDef();

		if (! (this instanceof TemplateClassDefinition || this instanceof InstantiatedClassDefinition)) {
			this._generateWrapperFunctions();
		}
	}

	function _generateWrapperFunctions() : void {
		this.forEachMemberFunction((funcDef) -> {
			funcDef.generateWrappersForDefaultParameters();
			return true;
		});
		this.forEachTemplateFunction((funcDef) -> {
			funcDef.generateWrappersForDefaultParameters();
			return true;
		});
	}

	function serialize () : variant {
		// FIXME implement in a way that is compatible with JSX
		return {
			"token"      : this._token,
			"name"       : this._className,
			"flags"      : this._flags,
			"extends"    : Util.serializeNullable(this._extendType),
			"implements" : Util.serializeArray(this._implementTypes),
			"members"    : Util.serializeArray(this._members),
			"inners"    : Util.serializeArray(this._inners),
			"templateInners"    : Util.serializeArray(this._templateInners)
		} : Map.<variant>;
	}

	static function serialize (classDefs : ClassDefinition[]) : variant {
		var s = new variant[];
		for (var i = 0; i < classDefs.length; ++i)
			s[i] = classDefs[i].serialize();
		return s;
	}

	function getParser () : Parser {
		return this._parser;
	}

	function setParser (parser : Parser) : void {
		this._parser = parser;
	}

	function getNativeSource () : Token {
		return this._nativeSource;
	}

	function setNativeSource (nativeSource : Token) : void {
		this._nativeSource = nativeSource;
	}

	function getToken () : Token {
		return this._token;
	}

	function className () : string {
		return this._className;
	}

	function classFullName () : string {
		return this._outerClassDef != null ? this._outerClassDef.classFullName() + "." + this._className : this.className();
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

	function setOuterClassDef (outer : ClassDefinition) : void {
		this._outerClassDef = outer;
	}

	function getOuterClassDef () : ClassDefinition {
		return this._outerClassDef;
	}

	function getInnerClasses () : ClassDefinition[] {
		return this._inners;
	}

	function getTemplateInnerClasses () : TemplateClassDefinition[] {
		return this._templateInners;
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
			var member = this._members[i];
			if (member instanceof MemberFunctionDefinition && !(member instanceof TemplateFunctionDefinition)) {
				if (! cb(member as MemberFunctionDefinition))
					return false;
			}
		}
		return true;
	}

	function forEachTemplateFunction (cb : function(:TemplateFunctionDefinition):boolean) : boolean {
		for (var i = 0; i < this._members.length; ++i) {
			if (this._members[i] instanceof TemplateFunctionDefinition) {
				if (! cb(this._members[i] as TemplateFunctionDefinition))
					return false;
			}
		}
		return true;
	}

	function forEachInnerClass (cb : function(:ClassDefinition):boolean) : boolean {
		for (var i = 0; i < this._inners.length; ++i) {
			if (! cb(this._inners[i]))
				return false;
		}
		return true;
	}

	function forEachTemplateInnerClass (cb : function(:TemplateClassDefinition):boolean) : boolean {
		for (var i = 0; i < this._templateInners.length; ++i) {
			if (! cb(this._templateInners[i]))
				return false;
		}
		return true;
	}

	function _resetMembersClassDef () : void {
		// member defintions
		for (var i = 0; i < this._members.length; ++i) {
			this._members[i].setClassDef(this);
			this._members[i].forEachClosure(function setClassDef(funcDef) {
				funcDef.setClassDef(this);
				return funcDef.forEachClosure(setClassDef);
			});
		}

		// member classes
		for (var i = 0; i < this._inners.length; ++i) {
			this._inners[i].setOuterClassDef(this);
			this._inners[i]._resetMembersClassDef();
		}
		for (var i = 0; i < this._templateInners.length; ++i) {
			this._templateInners[i].setOuterClassDef(this);
		}
	}

	static const GET_MEMBER_MODE_ALL = 0; // looks for functions or variables from the class and all super classes
	static const GET_MEMBER_MODE_CLASS_ONLY = 1; // looks for functions or variables within the class
	static const GET_MEMBER_MODE_SUPER = 2; // looks for functions with body in super classes
	static const GET_MEMBER_MODE_FUNCTION_WITH_BODY = 3; // looks for function with body

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
								// explicitly passed type parameters. instantiate the member here
								if (member instanceof TemplateFunctionDefinition && typeArgs.length != 0) {
									if ((member = (member as TemplateFunctionDefinition).instantiateTemplateFunction(errors, token, typeArgs)) == null) {
										return;
									}
								}
								if ((member as MemberFunctionDefinition).getStatements() != null || mode != ClassDefinition.GET_MEMBER_MODE_FUNCTION_WITH_BODY
									|| (member.flags() & (ClassDefinition.IS_NATIVE | ClassDefinition.IS_ABSTRACT)) == ClassDefinition.IS_NATIVE) {
									for (var j = 0; j < types.length; ++j) {
										// FIXME check types of template functions are equal
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
				// for searching super classes, change mode GET_MEMBER_MODE_SUPER to GET_MEMBER_MODE_FUNCTION_WITH_BODY
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

	function lookupInnerClass (className : string) : ClassDefinition {
		for (var i = 0; i < this._inners.length; ++i) {
			var inner = this._inners[i];
			if (inner.className() == className)
				return inner;
		}
		return null;
	}

	function lookupTemplateInnerClass (errors : CompileError[], request : TemplateInstantiationRequest, postInstantiationCallback : (Parser,ClassDefinition)->ClassDefinition) : ClassDefinition {
		var instantiateCallback = this.createGetTemplateClassCallback(errors, request, postInstantiationCallback);
		if (instantiateCallback != null)
			return instantiateCallback(errors, request, postInstantiationCallback);
		return null;
	}

	function createGetTemplateClassCallback (errors : CompileError[], request : TemplateInstantiationRequest, postInstantiationCallback : (Parser,ClassDefinition)->ClassDefinition) : (CompileError[],TemplateInstantiationRequest,(Parser,ClassDefinition)->ClassDefinition)->ClassDefinition {
		// lookup the already-instantiated class
		for (var i = 0; i < this._inners.length; ++i) {
			var classDef = this._inners[i];
			if (classDef instanceof InstantiatedClassDefinition
				&& (classDef as InstantiatedClassDefinition).getTemplateClassName() == request.getClassName()
				&& Util.typesAreEqual((classDef as InstantiatedClassDefinition).getTypeArguments(), request.getTypeArguments())) {
				return function (_ : CompileError[], __ : TemplateInstantiationRequest, ___ : (Parser,ClassDefinition)->ClassDefinition) : ClassDefinition {
					return classDef;
				};
			}
		}
		// create instantiation callback
		for (var i = 0; i < this._templateInners.length; ++i) {
			var templateDef = this._templateInners[i];
			if (templateDef.className() == request.getClassName()) {
				return function (_ : CompileError[], __ : TemplateInstantiationRequest, ___ : (Parser,ClassDefinition)->ClassDefinition) : ClassDefinition {
					var classDef = templateDef.instantiateTemplateClass(errors, request);
					if (classDef == null) {
						return null;
					}
					this._inners.push(classDef);
					classDef.setParser(this._parser);
					classDef.resolveTypes(new AnalysisContext(errors, this._parser, null));
					postInstantiationCallback(this._parser, classDef);
					return classDef;
				};
			}
		}
		return null;
	}

	function instantiate (instantiationContext : InstantiationContext) : ClassDefinition {
		var context = instantiationContext.clone();

		// instantiate the members
		var succeeded = true;
		var members = new MemberDefinition[];
		for (var i = 0; i < this._members.length; ++i) {
			var member = this._members[i].instantiate(context);
			if (member == null)
				succeeded = false;
			members[i] = member;
		}
		var inners = new ClassDefinition[];
		for (var i = 0; i < this._inners.length; ++i) {
			var inner = this._inners[i].instantiate(context);
			if (inner == null)
				succeeded = false;
			inners[i] = inner;
		}
		var templateInners = new TemplateClassDefinition[];
		for (var i = 0; i < this._templateInners.length; ++i) {
			var templateInner = this._templateInners[i].instantiate(context);
			if (templateInner == null)
				succeeded = false;
			templateInners[i] = templateInner;
		}

		// done
		if (! succeeded)
			return null;

		var extendType = null : ParsedObjectType;
		if (this._extendType != null) {
			var type = this._extendType.instantiate(instantiationContext, false);
			if (! (type instanceof ParsedObjectType)) {
				instantiationContext.errors.push(new CompileError(this._extendType.getToken(), "non-object type is not extensible"));
				return null;
			}
			extendType = type as ParsedObjectType;
		}

		var implementTypes = new ParsedObjectType[];
		for (var i = 0; i < this._implementTypes.length; ++i) {
			var type = this._implementTypes[i].instantiate(instantiationContext, false);
			if (! (type instanceof ParsedObjectType)) {
				instantiationContext.errors.push(new CompileError(this._implementTypes[i].getToken(), "non-object type is not extensible"));
				return null;
			}
			implementTypes[i] = type as ParsedObjectType;
		}

		return new ClassDefinition(
			this._token,
			this._className,
			this._flags,
			extendType,
			implementTypes,
			members,
			inners,
			templateInners,
			context.objectTypesUsed,
			this._docComment
		);
	}

	function normalizeClassDefs (errors : CompileError[]) : void {
		for (var x = 0; x < this._members.length; ++x) {
			for (var y = 0; y < x; ++y) {
				if (this._members[x].name() == this._members[y].name()
					&& (this._members[x].flags() & ClassDefinition.IS_STATIC) == (this._members[y].flags() & ClassDefinition.IS_STATIC)) {
					var errorMsg : Nullable.<string> = null;
					if (this._members[x] instanceof MemberFunctionDefinition && this._members[y] instanceof MemberFunctionDefinition) {
						if (Util.typesAreEqual((this._members[x] as MemberFunctionDefinition).getArgumentTypes(), (this._members[y] as MemberFunctionDefinition).getArgumentTypes())) {
							errorMsg = "a " + ((this._members[x].flags() & ClassDefinition.IS_STATIC) != 0 ? "static" : "member")
								+ " function with same name and arguments is already defined";
							errorMsg += ":" + x as string + ":" + (this._members[x] as MemberFunctionDefinition).getArgumentTypes().length as string;
							errorMsg += ":" + y as string + ":" + (this._members[y] as MemberFunctionDefinition).getArgumentTypes().length as string;
						}
					} else {
						errorMsg = "a property with same name already exists (note: only functions may be overloaded)";
					}
					if (errorMsg != null) {
						var error = new CompileError(this._members[x].getNameToken(), errorMsg);
						error.addCompileNote(new CompileNote(this._members[y].getNameToken(), "conflicting definition found here"));
						errors.push(error);
						break;
					}
				}
			}
		}
	}

	function resolveTypes (context : AnalysisContext) : void {
		// resolve types used
		for (var i = 0; i < this._objectTypesUsed.length; ++i)
			this._objectTypesUsed[i].resolveType(context);
		for (var i = 0; i < this._inners.length; ++i)
			this._inners[i].resolveTypes(context);
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
				ClassDefinition.IS_FINAL | (this.flags() & (ClassDefinition.IS_NATIVE | ClassDefinition.IS_EXPORT)),
				Type.voidType,
				new ArgumentDeclaration[],
				isNative ? (null) : new LocalVariable[],
				isNative ? (null) : new Statement[],
				new MemberFunctionDefinition[],
				this._token, /* FIXME */
			        null);
			func.setClassDef(this);
			this._members.push(func);
		}
		// remove the deleted constructor
		for (var i = 0; i != this._members.length; ++i) {
			if (this._members[i] instanceof MemberFunctionDefinition
				&& this._members[i].name() == "constructor"
				&& (this._members[i].flags() & (ClassDefinition.IS_STATIC | ClassDefinition.IS_DELETE)) == ClassDefinition.IS_DELETE) {
				this._members.splice(i, 1);
				break;
			}
		}
	}

	function setAnalysisContextOfVariables (context : AnalysisContext) : void {
		this.forEachMemberVariable((member) -> {
			member.setAnalysisContext(context);
			return true;
		});
	}

	function analyze (context : AnalysisContext) : void {
		if (this._analized) return;
		this._analized = true;

		try {
			this._analyzeClassDef(context);
		} catch (e : Error) {
			var token = this.getToken();
			var srcPos = token != null ? Util.format(" at file %1, line %2", [token.getFilename(), token.getLineNumber() as string]) : "";
			e.message = Util.format("fatal error while analyzing class %1%2\n%3", [this.classFullName(), srcPos, e.message]);

			throw e;
		}
		this._analyzeMembers(context);
	}

	function _analyzeClassDef (context : AnalysisContext) : void {
		this._baseClassDef = this.extendType() != null ? this.extendType().getClassDef() : null;
		var implementClassDefs = this.implementTypes().map.<ClassDefinition>(function (type) {
			return type.getClassDef();
		});
		// check that inheritance is not in loop, and that classes are extended, and interfaces / mixins are implemented
		if ((this.flags() & (ClassDefinition.IS_INTERFACE | ClassDefinition.IS_MIXIN)) == 0) {
			if (this._baseClassDef != null) {
				if ((this._baseClassDef.flags() & ClassDefinition.IS_FINAL) != 0) {
					context.errors.push(new CompileError(this.getToken(), "cannot extend final class '" + this._baseClassDef.classFullName() + "'"));
					return;
				}
				if ((this._baseClassDef.flags() & (ClassDefinition.IS_INTERFACE | ClassDefinition.IS_MIXIN)) != 0) {
					context.errors.push(new CompileError(this.getToken(), "interfaces (or mixins) should be implemented, not extended"));
					return;
				}
				if (! this._baseClassDef.forEachClassToBase(function (classDef : ClassDefinition) : boolean {
					if (this == classDef) {
						context.errors.push(new CompileError(this.getToken(), "class inheritance is in loop"));
						return false;
					}
					return true;
				})) {
					return;
				}
			}
		} else {
			for (var i = 0; i < implementClassDefs.length; ++i) {
				if ((implementClassDefs[i].flags() & (ClassDefinition.IS_INTERFACE | ClassDefinition.IS_MIXIN)) == 0) {
					context.errors.push(new CompileError(this.getToken(), "class '" + implementClassDefs[i].classFullName() + "' can only be extended, not implemented"));
					return;
				}
				if (! implementClassDefs[i].forEachClassToBase(function (classDef) {
					if (this == classDef) {
						context.errors.push(new CompileError(this.getToken(), "class inheritance is in loop"));
						return false;
					}
					return true;
				})) {
					return;
				}
			}
		}
		// check that none of the mixins are implemented twice
		var allMixins = new ClassDefinition[];
		if (! this.forEachClassToBase(function (classDef) {
			if ((classDef.flags() & ClassDefinition.IS_MIXIN) != 0) {
				if (allMixins.indexOf(classDef) != -1) {
					context.errors.push(new CompileError(this.getToken(), "mixin '" + classDef.classFullName() + "' is implemented twice"));
					return false;
				}
				allMixins.push(classDef);
			}
			return true;
		})) {
			return;
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
						context.errors.push(new CompileError(this._members[i].getNameToken(), "could not find function definition in base classes / mixins to be overridden"));
			for (var i = 0; i < this._implementTypes.length; ++i) {
				if ((this._implementTypes[i].getClassDef().flags() & ClassDefinition.IS_MIXIN) == 0)
					continue;
				var theMixin = this._implementTypes[i].getClassDef();
				var overrideFunctions = new MemberDefinition[];
				theMixin._getMembers(overrideFunctions, true, ClassDefinition.IS_OVERRIDE, ClassDefinition.IS_OVERRIDE);
				for (var j = 0; j < overrideFunctions.length; ++j) {
					var done = false;
					if (this._baseClassDef != null)
						if (this._baseClassDef._assertFunctionIsOverridable(context, overrideFunctions[j] as MemberFunctionDefinition) != null)
							done = true;
					// check sibling interfaces / mixins
					for (var k = 0; k < i; ++k) {
						if (this._implementTypes[k].getClassDef()._assertFunctionIsOverridable(context, overrideFunctions[j] as MemberFunctionDefinition) != null) {
							done = true;
							break;
						}
					}
					// check parent interfaces / mixins of the mixin
					for (var k = 0; k < theMixin._implementTypes.length; ++k) {
						if (theMixin._implementTypes[k].getClassDef()._assertFunctionIsOverridable(context, overrideFunctions[j] as MemberFunctionDefinition) != null) {
							done = true;
							break;
						}
					}
					if (! done)
						context.errors.push(new CompileError(this.getToken(), "could not find function definition to be overridden by '" + overrideFunctions[j].getNotation() + "'"));
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
					msg += abstractMembers[i].getNotation();
				}
				context.errors.push(new CompileError(this.getToken(), msg));
			}
		}
		// check that there are no conflicting exports (note: conflict names bet. var defs and functions are prohibited anyways)
		var usedNames = new Map.<MemberDefinition>;
		this._getMembers([], function (member) {
			if (! (member instanceof MemberFunctionDefinition)) {
				return false;
			}
			if ((member.flags() & (ClassDefinition.IS_STATIC | ClassDefinition.IS_EXPORT)) != ClassDefinition.IS_EXPORT
				|| member.name() == "constructor") {
				return false;
			}
			if (! usedNames.hasOwnProperty(member.name())) {
				usedNames[member.name()] = member;
				return false;
			}
			var existingDef = usedNames[member.name()];
			if (existingDef.getType().equals(member.getType())) {
				return false;
			}
			context.errors.push(
				new CompileError(member.getToken(), "methods with __export__ attribute cannot be overloaded")
				.addCompileNote(new CompileNote(usedNames[member.name()].getToken(), "previously defined here")));
			return false;
		});
		// check constructor conflicts
		var existingExportedCtor = null : MemberFunctionDefinition;
		this.forEachMemberFunction(function (funcDef) {
			if ((funcDef.flags() & (ClassDefinition.IS_EXPORT | ClassDefinition.IS_STATIC)) == ClassDefinition.IS_EXPORT
				&& funcDef.name() == "constructor") {
				if (existingExportedCtor != null) {
					context.errors.push(
						new CompileError(funcDef.getToken(), "only one constructor is exportable per class (or interface or mixin), pleaose mark others using the __noexport__ attribute")
						.addCompileNote(new CompileNote(existingExportedCtor.getToken(), "previously defined here")));
				} else {
					existingExportedCtor = funcDef;
				}
			}
			return true;
		});
	}

	function _analyzeMembers (context : AnalysisContext) : void {
		for (var i = 0; i < this._members.length; ++i) {
			var member = this._members[i];
			if (member instanceof MemberFunctionDefinition) {
				if (! (member instanceof TemplateFunctionDefinition)) {
					(member as MemberFunctionDefinition).analyze(context);
				}
			} else {
				(member as MemberVariableDefinition).analyze(context);
			}
		}
	}

	function analyzeUnusedVariables () : void {
		this.forEachMemberVariable((member) -> {
			member.getType();
			return true;
		});
	}

	function isConvertibleTo (classDef : ClassDefinition) : boolean {
		assert classDef != null;
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
			var isCheckingInterface = (memberClassDef.flags() & ClassDefinition.IS_INTERFACE) != 0;
			if (this._extendType != null && ! this._extendType.getClassDef()._assertMemberFunctionIsDefinable(context, member as MemberFunctionDefinition, memberClassDef, token, false, isCheckingInterface))
				return false;
			for (var i = 0; i < numImplementsToCheck; ++i) {
				if (memberClassDef != this._implementTypes[i].getClassDef() && ! this._implementTypes[i].getClassDef()._assertMemberFunctionIsDefinable(context, member as MemberFunctionDefinition, memberClassDef, token, isCheckingSibling, isCheckingInterface))
					return false;
			}
		}
		return true;
	}

	function _assertMemberVariableIsDefinable (context : AnalysisContext, member : MemberVariableDefinition, memberClassDef : ClassDefinition, token : Token) : boolean {
		for (var i = 0; i < this._members.length; ++i) {
			if (this._members[i].name() == member.name()) {
				if ((this._members[i].flags() & ClassDefinition.IS_ABSTRACT) == 0) {
					context.errors.push(new CompileError(member.getNameToken(), Util.format("cannot define property '%1', the name is already used in class '%2'", [member.getNotation(), this.classFullName()])));
					return false;
				}
				if (! this._members[i].getType().equals(member.getType())) {
					context.errors.push(new CompileError(member.getNameToken(), Util.format("cannot override property '%1' of type '%2' with different type '%3'", [member.getNotation(), this._members[i].getType().toString(), member.getType().toString() ])));
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

	function _assertMemberFunctionIsDefinable (context : AnalysisContext, member : MemberFunctionDefinition, memberClassDef : ClassDefinition, token : Token, reportOverridesAsWell : boolean, isCheckingInterface : boolean) : boolean {
		if (member.name() == "constructor")
			return true;
		for (var i = 0; i < this._members.length; ++i) {
			if (this._members[i].name() != member.name())
				continue;
			if (this._members[i] instanceof MemberVariableDefinition) {
				var error = new CompileError(member.getNameToken(), "definition of the function conflicts with property '" + this._members[i].getNameToken().getValue() + "'");
				error.addCompileNote(new CompileNote(this._members[i].getNameToken(), "property with the same name has been found here"));
				context.errors.push(error);
				return false;
			}
			if (! Util.typesAreEqual((this._members[i] as MemberFunctionDefinition).getArgumentTypes(), member.getArgumentTypes()))
				continue;
			if ((! isCheckingInterface) && ((member.flags() | this._members[i].flags()) & ClassDefinition.IS_STATIC) == 0 && (member.flags() & ClassDefinition.IS_OVERRIDE) == 0) {
				var error = new CompileError(member.getNameToken(), "overriding functions must have 'override' attribute set");
				error.addCompileNote(new CompileNote(this._members[i].getNameToken(), Util.format("defined in base class '%1'", [this.classFullName()])));
				context.errors.push(error);
				return false;
			}
			if (reportOverridesAsWell && (this._members[i].flags() & ClassDefinition.IS_OVERRIDE) != 0) {
				var error = new CompileError(member.getNameToken(), "definition of the function conflicts with sibling mix-in '" + this.classFullName() + "'");
				context.errors.push(error);
				return false;
			}
			// assertion of function being overridden does not have 'final' attribute is done by assertFunctionIsOverridable
			return true;
		}
		// delegate to base classes
		if (this._extendType != null && ! this._extendType.getClassDef()._assertMemberFunctionIsDefinable(context, member, memberClassDef, token, false, isCheckingInterface))
			return false;
		for (var i = 0; i < this._implementTypes.length; ++i)
			if (! this._implementTypes[i].getClassDef()._assertMemberFunctionIsDefinable(context, member, memberClassDef, token, false, isCheckingInterface))
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
					context.errors.push(new CompileError(overrideDef.getToken(), "cannot override final function defined in class '" + this.classFullName() + "'"));
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

	function _getMembers(list : MemberDefinition[], cb : function (member : MemberDefinition) : boolean) : void {
		// fill in the definitions of base classes
		if (this._baseClassDef != null)
			this._baseClassDef._getMembers(list, cb);
		for (var i = 0; i < this._implementTypes.length; ++i)
			this._implementTypes[i].getClassDef()._getMembers(list, cb);
		// fill in the definitions of members
		for (var i = 0; i < this._members.length; ++i) {
			if (cb(this._members[i]))
				list.push(this._members[i]);
		}
	}

	function _getMembers (list : MemberDefinition[], functionOnly : boolean, flagsMask : number, flagsMaskMatch : number) : void {
		this._getMembers(list, function (member) {
			if (functionOnly && ! (member instanceof MemberFunctionDefinition))
				return false;
			if ((member.flags() & flagsMask) != flagsMaskMatch)
				return false;
			for (var j = 0; j < list.length; ++j)
				if (list[j].name() == member.name())
					if ((list[j] instanceof MemberVariableDefinition) || Util.typesAreEqual((list[j] as MemberFunctionDefinition).getArgumentTypes(), (member as MemberFunctionDefinition).getArgumentTypes()))
						return false;
			return true;
		});
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
	var _closures : MemberFunctionDefinition[];
	var _docComment : DocComment;
	var _classDef : ClassDefinition;

	function constructor (token : Token, nameToken : Token, flags : number, closures : MemberFunctionDefinition[], docComment : DocComment) {
		this._token = token;
		this._nameToken = nameToken; // may be null
		this._flags = flags;
		assert closures != null;
		this._closures = closures;
		this._docComment = docComment;
		this._classDef = null;
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

	function getClosures () : MemberFunctionDefinition[] {
		return this._closures;
	}

	function forEachClosure (cb : function(:MemberFunctionDefinition):boolean) : boolean {
		if (this._closures != null)
			for (var i = 0; i < this._closures.length; ++i)
				if (! cb(this._closures[i]))
					return false;
		return true;
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

	abstract function getNotation() : string;

	function _instantiateClosures(instantiationContext : InstantiationContext) : MemberFunctionDefinition[] {
		var closures = new MemberFunctionDefinition[];
		for (var i = 0; i < this._closures.length; ++i) {
			closures[i] = this._closures[i].instantiate(instantiationContext);
		}
		return closures;
	}

	function _updateLinkFromExpressionToClosuresUponInstantiation(instantiatedExpr : Expression, instantiatedClosures : MemberFunctionDefinition[]) : void {
		(function onExpr(expr : Expression) : boolean {
			if (expr instanceof FunctionExpression) {
				var idx = this._closures.indexOf((expr as FunctionExpression).getFuncDef());

				if (idx == -1)
					throw new Error("logic flaw, cannot find the closure for " + this.getNotation());
				(expr as FunctionExpression).setFuncDef(instantiatedClosures[idx]);
			}
			return expr.forEachExpression(onExpr);
		})(instantiatedExpr);
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

	function constructor (token : Token, name : Token, flags : number, type : Type, initialValue : Expression, closures : MemberFunctionDefinition[], docComment : DocComment) {
		super(token, name, flags, closures, docComment);
		this._type = type;
		this._initialValue = initialValue;
		this._analyzeState = MemberVariableDefinition.NOT_ANALYZED;
		this._analysisContext = null;
	}

	override function instantiate (instantiationContext : InstantiationContext) : MemberDefinition {
		var type = this._type != null ? this._type.instantiate(instantiationContext, false) : null;
		var initialValue : Expression = null;
		if (this._initialValue != null) {
			initialValue = this._initialValue.clone();
			initialValue.instantiate(instantiationContext);
			var closures = this._instantiateClosures(instantiationContext);
			this._updateLinkFromExpressionToClosuresUponInstantiation(initialValue, closures);
		} else {
			closures = [] : MemberFunctionDefinition[];
		}
		return new MemberVariableDefinition(this._token, this._nameToken, this._flags, type, initialValue, closures, null);
	}

	override function toString () : string {
		return this.name() + " : " + this._type.toString();
	}

	override function serialize () : variant {
		return {
			"token"      : Util.serializeNullable(this._token),
			"nameToken"  : Util.serializeNullable(this._nameToken),
			"flags"        : this.flags(),
			"type"         : Util.serializeNullable(this._type),
			"initialValue" : Util.serializeNullable(this._initialValue)
		} : Map.<variant>;
	}

	function analyze (context : AnalysisContext) : void {
		// Just sets the initial values and simple left-to-right type deduction; analysis of member variables is performed lazily (and those that where never analyzed will be removed by dead code elimination)
		if (this.getInitialValue() == null && (this.getClassDef().flags() & ClassDefinition.IS_NATIVE) != ClassDefinition.IS_NATIVE) {
			this.setInitialValue(Expression.getDefaultValueExpressionOf(this.getType()));
		}

		// left-to-right type deduction
		if (this.getInitialValue() != null) {
			var rhs = this.getInitialValue();
			// handles v = [] or v = {}
			if (((rhs instanceof ArrayLiteralExpression && (rhs as ArrayLiteralExpression).getExprs().length == 0) || (rhs instanceof MapLiteralExpression && (rhs as MapLiteralExpression).getElements().length == 0)) && rhs.getType() == null) {
				if (! AssignmentExpression.analyzeEmptyLiteralAssignment(context, rhs.getToken(), this._type, rhs)) {
					return;
				}
				// ok
			}
		}
	}

	function setAnalysisContext (context : AnalysisContext) : void {
		this._analysisContext = context.clone();
	}

	override function getType () : Type {
		switch (this._analyzeState) {
		case MemberVariableDefinition.NOT_ANALYZED:
			this._lazyAnalyze();
			break;
		case MemberVariableDefinition.IS_ANALYZING:
			this._analysisContext.errors.push(new CompileError(this.getNameToken(),
				"please declare type of variable '" + this.name() + "' (detected recursion while trying to reduce type)"));
			break;
		default:
			break;
		}
		return this._type;
	}

	function _lazyAnalyze() : void {
		try {
			this._analyzeState = MemberVariableDefinition.IS_ANALYZING;
			var rhs = this._initialValue;
			if (rhs != null) {
				if (! rhs.analyze(this._analysisContext, null))
					return;
				if (rhs.isClassSpecifier()) {
					this._analysisContext.errors.push(new CompileError(rhs._token, "cannot assign a class"));
					return;
				}
				var ivType = rhs.getType();
				if (this._type == null) {
					if (ivType.equals(Type.nullType)) {
						this._analysisContext.errors.push(new CompileError(rhs.getToken(), "cannot assign null to an unknown type"));
						return;
					}
					if (ivType.equals(Type.voidType)) {
						this._analysisContext.errors.push(new CompileError(rhs.getToken(), "cannot assign void"));
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
	}

	function getInitialValue () : Expression {
		return this._initialValue;
	}

	function setInitialValue (initialValue : Expression) : void {
		this._initialValue = initialValue;
	}

	override function getNotation() : string {
		var classDef = this.getClassDef();
		var s = (classDef != null ? classDef.classFullName(): "<<unknown:"+(this._token.getFilename() ?: "?")+">>");
		s += (this.flags() & ClassDefinition.IS_STATIC) != 0 ? "." : "#";
		s += this.name();
		return s;
	}
}

class MemberFunctionDefinition extends MemberDefinition implements Block {

	var _returnType : Type;
	var _args : ArgumentDeclaration[];
	var _locals : LocalVariable[];
	var _statements : Statement[];
	var _lastTokenOfBody : Token;
	var _parent : MemberFunctionDefinition; // null for the outermost closure of static variable initialization expression
	var _funcLocal : LocalVariable;

	function constructor (token : Token, name : Token, flags : number, returnType : Type, args : ArgumentDeclaration[], locals : LocalVariable[], statements : Statement[], closures : MemberFunctionDefinition[], lastTokenOfBody : Token, docComment : DocComment) {
		super(token, name, flags, closures, docComment);
		this._returnType = returnType;
		this._args = args;
		this._locals = locals;
		this._statements = statements;
		this._lastTokenOfBody = lastTokenOfBody;
		this._parent = null;
		this._funcLocal = null;
		this._classDef = null;
		for (var i = 0; i < this._closures.length; ++i)
			this._closures[i].setParent(this);
	}

	function isAnonymous() : boolean { // for anonymous function expression
		return this._nameToken == null;
	}

	function isGenerator() : boolean {
		return (this._flags & ClassDefinition.IS_GENERATOR) != 0;
	}

	/**
	 * Returns a simple notation of the function like "Class.classMethod(:string):void" or "Class.instanceMethod(:string):void".
	 */
	override function getNotation() : string {
		var classDef = this.getClassDef();
		var s = (classDef != null ? classDef.classFullName(): "<<unknown:"+(this._token.getFilename() ?: "?")+">>");
		s += (this.flags() & ClassDefinition.IS_STATIC) != 0 ? "." : "#";
		s += this.getNameToken() != null ? this.name() : "$" +  this.getToken().getLineNumber() + "_" + this.getToken().getColumnNumber();
		s += "(";
		s += this._args.map.<string>(function (arg) {
				return ":" + (arg.getType() ? arg.getType().toString() : "null");
			}).join(",");
		s += ")";
		return s;
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

	class _CloneStash extends Stash {

		var newLocal : LocalVariable;
		var newFuncDef : MemberFunctionDefinition;

		function constructor () {
			this.newLocal = null;
			this.newFuncDef = null;
		}

		function constructor (that : MemberFunctionDefinition._CloneStash) {
			this.newLocal = that.newLocal;
			this.newFuncDef = that.newFuncDef;
		}

		override function clone () : MemberFunctionDefinition._CloneStash {
			return new MemberFunctionDefinition._CloneStash(this);
		}

	}

	function clone () : MemberFunctionDefinition {

		var stashesUsed = new MemberFunctionDefinition._CloneStash[];

		function getStash(stashable : Stashable) : MemberFunctionDefinition._CloneStash {
			var stash = stashable.getStash("CLONE-FUNC-DEF");
			if (stash == null) {
				stash = stashable.setStash("CLONE-FUNC-DEF", new MemberFunctionDefinition._CloneStash);
			}
			stashesUsed.push(stash as MemberFunctionDefinition._CloneStash);
			return stash as MemberFunctionDefinition._CloneStash;
		}

		function cloneFuncDef (funcDef : MemberFunctionDefinition) : MemberFunctionDefinition {

			// at this moment, all locals and closures are not cloned yet
			var statements = Util.cloneArray(funcDef.getStatements());

			var closures = funcDef.getClosures().map.<MemberFunctionDefinition>((funcDef) -> {
				var newFuncDef = cloneFuncDef(funcDef);
				getStash(funcDef).newFuncDef = newFuncDef;
				return newFuncDef;
			});
			// rewrite funcDefs
			Util.forEachStatement(function onStatement(statement : Statement) : boolean {
				if (statement instanceof FunctionStatement) {
					var newFuncDef;
					if ((newFuncDef = getStash((statement as FunctionStatement).getFuncDef()).newFuncDef) != null) {
						(statement as FunctionStatement).setFuncDef(newFuncDef);
					}
					return true;
				}
				return statement.forEachExpression(function onExpr(expr : Expression, replaceCb : function(:Expression):void) : boolean {
					if (expr instanceof FunctionExpression) {
						var newFuncDef;
						if ((newFuncDef = getStash((expr as FunctionExpression).getFuncDef()).newFuncDef) != null) {
							(expr as FunctionExpression).setFuncDef(newFuncDef);
						}
						return true;
					}
					return expr.forEachExpression(onExpr);
				}) && statement.forEachStatement(onStatement);
			}, statements);

			var funcLocal = funcDef.getFuncLocal();
			if (funcLocal != null) {
				var newFuncLocal;
				if ((newFuncLocal = getStash(funcLocal).newLocal) != null) { // funcDef is defined as a function statement
					// ok
				} else {
					// clone
					newFuncLocal = new LocalVariable(funcLocal.getName(), funcLocal.getType(), funcLocal.isConstant());
					getStash(funcLocal).newLocal = newFuncLocal;
				}
				funcLocal = newFuncLocal;
			}
			var args = funcDef.getArguments().map.<ArgumentDeclaration>((arg) -> {
				var newArg = arg.clone();
				getStash(arg).newLocal = newArg;
				return newArg;
			});
			var locals = funcDef.getLocals().map.<LocalVariable>((local) -> {
				var newLocal;
				if ((newLocal = getStash(local).newLocal) != null) {
					// in case local is a name of a function statement and the function statement already cloned
					return newLocal;
				}
				newLocal = new LocalVariable(local.getName(), local.getType(), local.isConstant());
				getStash(local).newLocal = newLocal;
				return newLocal;
			});

			// FIXME special hack: CatchStatement#clone does not clone and rewrite its caught variable
			Util.forEachStatement(function onStatement(statement : Statement) : boolean {
				if (statement instanceof CatchStatement) {
					var caughtVar = (statement as CatchStatement).getLocal().clone();
					getStash((statement as CatchStatement).getLocal()).newLocal = caughtVar;
					(statement as CatchStatement).setLocal(caughtVar);
				} else if (statement instanceof FunctionStatement) {
					(statement as FunctionStatement).getFuncDef().forEachStatement(onStatement);
				}
				return statement.forEachExpression(function onExpr(expr, replaceCb) {
					if (expr instanceof FunctionExpression) {
						return (expr as FunctionExpression).getFuncDef().forEachStatement(onStatement);
					}
					return expr.forEachExpression(onExpr);
				}) && statement.forEachStatement(onStatement);
			}, statements);

			// rewrite locals
			Util.forEachStatement(function onStatement(statement : Statement) : boolean {
				if (statement instanceof FunctionStatement) {
					(statement as FunctionStatement).getFuncDef().forEachStatement(onStatement);
				}
				return statement.forEachExpression(function onExpr(expr : Expression, replaceCb : function(:Expression):void) : boolean {
					if (expr instanceof LocalExpression) {
						var newLocal;
						if ((newLocal = getStash((expr as LocalExpression).getLocal()).newLocal) != null) {
							(expr as LocalExpression).setLocal(newLocal);
						}
					} else if (expr instanceof FunctionExpression) {
						return (expr as FunctionExpression).getFuncDef().forEachStatement(onStatement);
					}
					return expr.forEachExpression(onExpr);
				}) && statement.forEachStatement(onStatement);
			}, statements);

			var clonedFuncDef = new MemberFunctionDefinition(
				funcDef.getToken(),
				funcDef.getNameToken(),
				funcDef.flags(),
				funcDef.getReturnType(),
				args,
				locals,
				statements,
				closures,
				funcDef._lastTokenOfBody,
				null
			);
			clonedFuncDef.setFuncLocal(funcLocal);
			clonedFuncDef.setClassDef(this.getClassDef());

			return clonedFuncDef;
		}

		var clonedFuncDef = cloneFuncDef(this);

		// erase stashes of original funcDef
		for (var i = 0; i < stashesUsed.length; ++i) {
			var stash = stashesUsed[i];
			stash.newLocal = null;
			stash.newFuncDef = null;
		}

		if (this._parent == null) {
			var classDef = this._classDef;
			if (classDef == null) {
				// an orphan funcDef
			}
			else {
				// register to the classDef
				classDef.members().splice(classDef.members().indexOf(this)+1, 0, clonedFuncDef); // insert right after the original function
			}
		} else {
			this._parent.getClosures().push(clonedFuncDef);
			clonedFuncDef.setParent(this._parent);
		}

		return clonedFuncDef;
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
			var closures = this._instantiateClosures(instantiationContext);
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
				if (statement instanceof FunctionStatement) {
					var idx = this._closures.indexOf((statement as FunctionStatement).getFuncDef());
					if (i == -1)
						throw new Error("logic flaw, cannot find the closure for " + this.getNotation());
					(statement as FunctionStatement).setFuncDef(closures[idx]);
					return true;
				}
				statement.forEachExpression(function (expr) {
					this._updateLinkFromExpressionToClosuresUponInstantiation(expr, closures);
					return true;
				});
				return statement.forEachStatement(onStatement);
			}, statements);
		} else {
			locals = null;
			statements = null;
			closures = new MemberFunctionDefinition[];
		}
		// pop the instantiated args
		for (var i = 0; i < this._args.length; ++i)
			this._args[i].popInstantiated();
		// do the rest
		if (this._returnType != null) {
			var returnType = this._returnType.instantiate(instantiationContext, true);
			if (returnType == null)
				return null;
		} else {
			returnType = null;
		}
		return constructCallback(this._token, this._nameToken, this._flags, returnType, args, locals, statements, closures, this._lastTokenOfBody, this._docComment);
	}

	override function serialize () : variant {
		return {
			"token"      : Util.serializeNullable(this._token),
			"nameToken"  : Util.serializeNullable(this._nameToken),
			"flags"      : this.flags(),
			"returnType" : Util.serializeNullable(this._returnType),
			"args"       : Util.serializeArray(this._args),
			"locals"     : Util.serializeArray(this._locals),
			"statements" : Util.serializeArray(this._statements)
		} : Map.<variant>;
	}

	var _analyzed = false;

	function analyze (outerContext : AnalysisContext) : void {
		if (this._analyzed == true) {
			return;
		}
		this._analyzed = true;

		// validate jsxdoc comments
		if ((this.flags() & ClassDefinition.IS_GENERATED) == 0) {
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
		}

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
			// make this function visible inside it
			if (! this.isAnonymous()) {
				if (this._returnType != null) {
					context.getTopBlock().localVariableStatuses._statuses[this.name()] = LocalVariableStatuses.ISSET;
				} else {
					// ban on recursive function without the return type declared
					context.getTopBlock().localVariableStatuses._statuses[this.name()] = LocalVariableStatuses.UNTYPED_RECURSIVE_FUNCTION;
				}
			}
		}

		try {

			// do the checks
			for (var i = 0; i < this._statements.length; ++i)
				if (! this._statements[i].analyze(context))
					break;

			if (this._returnType == null) // no return statement in body
				this._returnType = Type.voidType;

			if (this.isGenerator()) {
				// ok
			} else {
				if (! this._returnType.equals(Type.voidType) && context.getTopBlock().localVariableStatuses.isReachable())
					context.errors.push(new CompileError(this._lastTokenOfBody, "missing return statement"));
			}

			if (this._parent == null && this.getNameToken() != null && this.name() == "constructor") {
				this._fixupConstructor(context);
			}

		} finally {
			context.blockStack.pop();
		}

		if (this._funcLocal != null) {
			this._funcLocal.setTypeForced(this.getType());
		}

		this.getLocals().forEach((local) -> {
			if (! local.isUsedAsRHS()) {
				context.errors.push(new UnusedWarning(local.getName(), "unused variable " + local.getName().getValue()));
			}
		});
	}

	function generateWrappersForDefaultParameters() : void {
		// `function f(a, b = x)` makes `f(a) { f(a, x) }`

		function createObjectType(classDef : ClassDefinition) : ObjectType {
			if (classDef instanceof TemplateClassDefinition) {
				var typeArgs = (classDef as TemplateClassDefinition).getTypeArguments().map.<Type>((token) -> {
					return new ParsedObjectType(new QualifiedName(token), new Type[]);
				});
				return new ParsedObjectType(new QualifiedName(classDef.getToken()), typeArgs);
			}
			else {
				return new ObjectType(classDef);
			}
		}

		// skip arguments wo. default parameters
		for (var origArgIndex = 0; origArgIndex != this.getArguments().length; ++origArgIndex) {
			if (this.getArguments()[origArgIndex].getDefaultValue() != null) {
				break;
			}
		}
		// generate
		for (; origArgIndex != this.getArguments().length; ++origArgIndex) {
			// build list of formal args (of the generated function)
			var formalArgs = this.getArguments().slice(0, origArgIndex).map.<ArgumentDeclaration>((arg) -> {
				return new ArgumentDeclaration(arg.getName(), arg.getType());
			});
			// build function body
			var argExprs = formalArgs.map.<Expression>((arg) -> {
				return new LocalExpression(arg.getName(), arg);
			});
			for (var i = origArgIndex; i != this.getArguments().length; ++i) {
				var defVal = this.getArguments()[i].getDefaultValue();
				assert defVal != null;
				argExprs.push(defVal.clone());
			}
			var statement : Statement;
			if (this.name() == "constructor") {
				statement = new ConstructorInvocationStatement(new Token("this", false), createObjectType(this.getClassDef()), argExprs);
			}
			else {
				var invocant = (this.flags() & ClassDefinition.IS_STATIC) == 0
					? new ThisExpression(new Token("this", false), this.getClassDef())
					: new ClassExpression(new Token(this.getClassDef().className(), true), createObjectType(this.getClassDef()));

				var methodRef = new PropertyExpression(new Token(".", false), invocant, this.getNameToken(), this.getArgumentTypes());
				var callExpression = new CallExpression(new Token("(", false), methodRef, argExprs);
				statement = new ReturnStatement(new Token("return", false), callExpression);
			}
			// build function
			if (!(this instanceof TemplateFunctionDefinition)) {
				var wrapper = new MemberFunctionDefinition(
					this.getToken(),
					this.getNameToken(),
					this.flags() | ClassDefinition.IS_INLINE | ClassDefinition.IS_GENERATED,
					this.getReturnType(),
					formalArgs,
					new LocalVariable[],
					[statement],
					this.getClosures().slice(0),
					this._lastTokenOfBody,
					this._docComment);
			}
			else {
				throw new Error("TODO: template function with default parameters in " + this.getNotation() + " is not yet supported");
			}
			wrapper.setClassDef(this.getClassDef());
			// register
			this.getClassDef().members().splice(this.getClassDef().members().indexOf(this)+1, 0, wrapper); // insert right after the original function
			// fix up function links inside defVal
			Util.forEachExpression(function onExpr(expr) {
				if (expr instanceof FunctionExpression) {
					var newFuncDef = (expr as FunctionExpression).getFuncDef().clone();
					Util.unlinkFunction(newFuncDef, this);
					Util.linkFunction(newFuncDef, wrapper);
					(expr as FunctionExpression).setFuncDef(newFuncDef);
					return true;
				}
				return expr.forEachExpression(onExpr);;
			}, argExprs);
		}
	}

	function _fixupConstructor (context : AnalysisContext) : void {
		var success = true;
		var isAlternate = false;

		if ((this._flags & ClassDefinition.IS_GENERATOR) != 0) {
			context.errors.push(new CompileError(this._token, "constructor must not be a generator"));
			return;
		}

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
				/*
					FIXME if the class is extending a native class and the expression is setting a property of the native class,
					then we should break, since it might have side effects (e.g. the property might be defined as a setter)
				*/
				if (expr instanceof AssignmentExpression) {
					var assignExpr = expr as AssignmentExpression;
					if (! onExpr(assignExpr.getSecondExpr())) {
						return false;
					}
					var lhsExpr = assignExpr.getFirstExpr();
					if (lhsExpr instanceof PropertyExpression
						&& (lhsExpr as PropertyExpression).getExpr() instanceof ThisExpression) {
						initProperties[(lhsExpr as PropertyExpression).getIdentifierToken().getValue()] = false;
						return true;
					}
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

	function setReturnType (type : Type) : void {
		this._returnType = type;
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

	function getFuncLocal () : LocalVariable {
		return this._funcLocal;
	}

	function setFuncLocal (funcLocal : LocalVariable) : void {
		this._funcLocal = funcLocal;
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

	function setStatements (statements : Statement[]) : void {
		this._statements = statements;
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

	override function getType () : ResolvedFunctionType {
		return (this._flags & ClassDefinition.IS_STATIC) != 0
			? new StaticFunctionType(this._token, this._returnType, this.getArgumentTypes(), false)
			: new MemberFunctionType(this._token, new ObjectType(this._classDef), this._returnType, this.getArgumentTypes(), false);
	}

	function deductTypeIfUnknown (context : AnalysisContext, type : ResolvedFunctionType) : boolean {
		// first, check if there are any unresolved types
		for (var i = 0; i < this._args.length; ++i) {
			if (this._args[i].getType() == null)
				break;
		}
		if (i == this._args.length && this._returnType != null) {
			if (this._funcLocal != null)
				this._funcLocal.setTypeForced(this.getType());
			return true;
		}
		// resolve!
		if (type.getArgumentTypes().length != this._args.length) {
			context.errors.push(new CompileError(this.getToken(), "expected the function to have " + type.getArgumentTypes().length as string + " arguments, but found " + this._args.length as string));
			return false;
		} else if (this._args.length != 0 && type.getArgumentTypes()[this._args.length - 1] instanceof VariableLengthArgumentType) {
			context.errors.push(new CompileError(this.getToken(), "could not deduct function argument (left hand expression is a function with an variable-length argument)"));
			return false;
		}
		for (var i = 0; i < this._args.length; ++i) {
			if (type.getArgumentTypes()[i] != null) {
				if (this._args[i].getType() != null) {
					if (! this._args[i].getType().equals(type.getArgumentTypes()[i])) {
						context.errors.push(new CompileError(this.getToken(), "detected type conflict for argument '" + this._args[i].getName().getValue() + "' (expected '" + type.getArgumentTypes()[i].toString() + "' but found '" + this._args[i].getType().toString() + "'"));
						return false;
					}
				} else {
					this._args[i].setTypeForced(type.getArgumentTypes()[i]);
				}
			}
		}
		if (type.getReturnType() != null) {
			if (this._returnType != null) {
				if (! this._returnType.equals(type.getReturnType())) {
					context.errors.push(new CompileError(this.getToken(), "detected return type conflict, expected '" + type.getReturnType().toString() + "' but found '" + this._returnType.toString() + "'"));
					return false;
				}
			} else {
				this._returnType = type.getReturnType();
			}
		}
		if (this._funcLocal != null)
			this._funcLocal.setTypeForced(this.getType());
		return true;
	}

	function forEachStatement (cb : function(:Statement):boolean) : boolean {
		return Util.forEachStatement(cb, this._statements);
	}

	function forEachStatement (cb : function(:Statement,:function(:Statement):void):boolean) : boolean {
		return Util.forEachStatement(cb, this._statements);
	}
}

class InstantiatedMemberFunctionDefinition extends MemberFunctionDefinition {

	function constructor (token : Token, name : Token, flags : number, returnType : Type, args : ArgumentDeclaration[], locals : LocalVariable[], statements : Statement[], closures : MemberFunctionDefinition[], lastTokenOfBody : Token, docComment : DocComment) {
		super(token, name, flags, returnType, args, locals, statements, closures, lastTokenOfBody, docComment);
	}

}

class TemplateFunctionDefinition extends MemberFunctionDefinition implements TemplateDefinition {

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

	override function getType () : TemplateFunctionType {
		return new TemplateFunctionType(this._token, this);
	}

	function getResolvedTypemap () : Map.<Type> {
		return this._resolvedTypemap;
	}

	function getTypeArguments () : Token[] {
		return this._typeArgs;
	}

	override function instantiate (instantiationContext : InstantiationContext) : MemberFunctionDefinition {
		var instantiated = new TemplateFunctionDefinition(
			this._token, this.getNameToken(), this.flags(), this._typeArgs.concat([]), this._returnType, this._args.concat([]),
			this._locals, this._statements, this._closures, this._lastTokenOfBody, this._docComment);
		for (var k in this._resolvedTypemap) {
			instantiated._resolvedTypemap[k] = this._resolvedTypemap[k];
		}
		for (var k in instantiationContext.typemap) {
			instantiated._resolvedTypemap[k] = instantiationContext.typemap[k];
		}
		return instantiated;
	}

	function instantiateByArgumentTypes (errors : CompileError[], notes : CompileNote[], token : Token, actualArgTypes : Type[], exact : boolean) : MemberFunctionDefinition { // notes is for reporting compiler notes when instantiaiton fails, errors is delegated to semantic analysis in instantiated funcDef
		var typemap = new Map.<Type>;
		for (var i = 0; i < this._typeArgs.length; ++i) {
			typemap[this._typeArgs[i].getValue()] = null;
		}
		for (var k in this._resolvedTypemap) {
			typemap[k] = this._resolvedTypemap[k];
		}

		function unify (formal : Type, actual : Type) : boolean {
			// formal is a type parameter
			if (formal instanceof ParsedObjectType
					&& (formal as ParsedObjectType).getTypeArguments().length == 0
					&& (formal as ParsedObjectType).getQualifiedName().getImport() == null
					&& (formal as ParsedObjectType).getQualifiedName().getEnclosingType() == null
					&& typemap.hasOwnProperty((formal as ParsedObjectType).getToken().getValue())) {
				var expectedType = typemap[(formal as ParsedObjectType).getToken().getValue()];
				if (expectedType != null) { // already unified, check if arg type is the expected one
					if (exact && ! expectedType.equals(actual)) {
						// no need to report a compile note when exact matching
						return false;
					}
					if (! actual.isConvertibleTo(expectedType)) {
						notes.push(new CompileNote(token, "expected " + expectedType.toString() + ", but got " + actual.toString()));
						return false;
					}
				} else {
					typemap[(formal as ParsedObjectType).getToken().getValue()] = actual;
				}
			} else if (formal instanceof ParsedObjectType) {
				if (! (actual instanceof ObjectType)) {
					notes.push(new CompileNote(token, "expected " + formal.toString() + ", but got " + actual.toString()));
					return false;
				}
				// TODO import
				// TODO enclosing types
				assert (formal as ParsedObjectType).getQualifiedName().getImport() == null;
				assert (formal as ParsedObjectType).getQualifiedName().getEnclosingType() == null;
				var parser = this._classDef.getParser();
				if ((formal as ParsedObjectType).getTypeArguments().length == 0) {
					(formal as ParsedObjectType).resolveType(new AnalysisContext(errors, parser, null));
					if (! actual.isConvertibleTo(formal)) {
						notes.push(new CompileNote(token, "expected " + formal.toString() + ", but got " + actual.toString()));
						return false;
					}
				} else {
					var formalClassDef = (formal as ParsedObjectType).getQualifiedName().getTemplateClass(parser);
					assert (! (actual instanceof ParsedObjectType)) || (actual as ParsedObjectType)._classDef != null;
					var actualClassDef = (actual as ObjectType).getClassDef();
					if (formalClassDef == null) {
						notes.push(new CompileNote(token, "not matching class definition " + formal.toString()));
						return false;
					}
					assert actualClassDef != null;
					if (! (actualClassDef instanceof InstantiatedClassDefinition && formalClassDef == (actualClassDef as InstantiatedClassDefinition).getTemplateClass())) {
						notes.push(new CompileNote(token, "expected " + formal.toString() + ", but got " + actual.toString()));
						return false;
					}
					var formalTypeArgs = (formal as ParsedObjectType).getTypeArguments();
					var actualTypeArgs = (actualClassDef as InstantiatedClassDefinition).getTypeArguments();
					assert formalTypeArgs.length == actualTypeArgs.length;
					for (var i = 0; i < formalTypeArgs.length; ++i) {
						if (! unify(formalTypeArgs[i], actualTypeArgs[i])) {
							return false;
						}
					}
				}
			} else if (formal instanceof NullableType) {
				if (! unify((formal as NullableType).getBaseType(), actual)) {
					return false;
				}
			} else if (formal instanceof StaticFunctionType) {
				if (! (actual instanceof StaticFunctionType)) {
					notes.push(new CompileNote(token, "expected " + formal.toString() + ", but got " + actual.toString()));
					return false;
				}
				var formalFuncType = formal as StaticFunctionType;
				var actualFuncType = actual as StaticFunctionType;
				if (formalFuncType.getArgumentTypes().length != actualFuncType.getArgumentTypes().length) {
					notes.push(new CompileNote(token, "expected " + formal.toString() + ", but got " + actual.toString()));
					return false;
				}
				// unify recursively
				for (var i = 0; i < formalFuncType.getArgumentTypes().length; ++i) {
					if (! unify(formalFuncType.getArgumentTypes()[i], actualFuncType.getArgumentTypes()[i]))
						return false;
				}
				if (! unify(formalFuncType.getReturnType(), actualFuncType.getReturnType()))
					return false;
			} else { // formal is a primitive type
				if (exact && ! formal.equals(actual)) {
					// no need to report a compile note when exact matching
					return false;
				}
				if (! actual.isConvertibleTo(formal)) {
					notes.push(new CompileNote(token, "expected " + formal.toString() + ", but got " + actual.toString()));
					return false;
				}
			}
			return true;
		}

		// infer type parameters from actual arguments
		var formalArgTypes = this.getArgumentTypes();
		for (var i = 0; i < formalArgTypes.length; ++i) {
			if (! unify(formalArgTypes[i], actualArgTypes[i]))
				break;
		}
		if (i != formalArgTypes.length)
			return null;

		// run instantiation if typemap satisfies all type parameters
		var typeArgs = new Type[];
		for (var i = 0; i < this._typeArgs.length; ++i) {
			if ((typeArgs[i] = typemap[this._typeArgs[i].getValue()]) == null)
				break;
		}
		if (i != this._typeArgs.length) {
			var remains = new string[];
			this._typeArgs.forEach((typeArg) -> {
				if (typemap[typeArg.getValue()] == null) {
					remains.push(typeArg.getValue());
				}
			});
			notes.push(new CompileNote(token, "cannot decide type parameter(s) from given argument expressions: " + remains.join(", ")));
			return null;
		} else {
			return this.instantiateTemplateFunction(errors, token, typeArgs);
		}
	}

	function instantiateTemplateFunction (errors : CompileError[], token : Token, typeArgs : Type[]) : MemberFunctionDefinition {

		// return the already-instantiated one, if exists
		var instantiated : MemberFunctionDefinition = this._instantiatedDefs.get(typeArgs);
		if (instantiated != null) {
			return instantiated;
		}
		// instantiate
		var instantiationContext = this.buildInstantiationContext(errors, token, this._typeArgs, typeArgs);
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
		var analysisContext = new AnalysisContext(errors, this._classDef.getParser(), function (parser, classDef) { throw new Error("not implemented"); });
		for (var i = 0; i < instantiationContext.objectTypesUsed.length; ++i)
			instantiationContext.objectTypesUsed[i].resolveType(analysisContext);
		instantiated.analyze(analysisContext);
		// register, and return
		this._instantiatedDefs.set(typeArgs.concat(new Type[]), instantiated);
		return instantiated;
	}

}

class TemplateClassDefinition extends ClassDefinition implements TemplateDefinition {

	var _typeArgs : Token[];

	function constructor (token : Token, className : string, flags : number, typeArgs : Token[], extendType : ParsedObjectType, implementTypes : ParsedObjectType[], members : MemberDefinition[], inners : ClassDefinition[], templateInners : TemplateClassDefinition[], objectTypesUsed : ParsedObjectType[], docComment : DocComment) {
		super(token, className, flags, extendType, implementTypes, members, inners, templateInners, objectTypesUsed, docComment);
		this._token = token;
		this._className = className;
		this._flags = flags;
		this._typeArgs = typeArgs.concat(new Token[]);

		this._generateWrapperFunctions();
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

	override function instantiate (instantiationContext : InstantiationContext) : TemplateClassDefinition {
		// shadow type args
		var typemap = new Map.<Type>;
		for (var key in instantiationContext.typemap) {
			typemap[key] = instantiationContext.typemap[key];
		}
		for (var i = 0; i < this._typeArgs.length; ++i) {
			delete typemap[this._typeArgs[i].getValue()];
		}
		var context = new InstantiationContext(instantiationContext.errors, typemap);

		// instantiate the members
		var succeeded = true;
		var members = new MemberDefinition[];
		for (var i = 0; i < this._members.length; ++i) {
			var member = this._members[i].instantiate(context);
			if (member == null)
				succeeded = false;
			members[i] = member;
		}
		var inners = new ClassDefinition[];
		for (var i = 0; i < this._inners.length; ++i) {
			var inner = this._inners[i].instantiate(context);
			if (inner == null)
				succeeded = false;
			inners[i] = inner;
		}
		var templateInners = new TemplateClassDefinition[];
		for (var i = 0; i < this._templateInners.length; ++i) {
			var templateInner = this._templateInners[i].instantiate(context);
			if (templateInner == null)
				succeeded = false;
			templateInners[i] = templateInner;
		}

		// done
		if (! succeeded)
			return null;

		var extendType = null : ParsedObjectType;
		if (this._extendType != null) {
			var type = this._extendType.instantiate(instantiationContext, false);
			if (! (type instanceof ParsedObjectType)) {
				instantiationContext.errors.push(new CompileError(this._extendType.getToken(), "non-object type is not extensible"));
				return null;
			}
			extendType = type as ParsedObjectType;
		}

		var implementTypes = new ParsedObjectType[];
		for (var i = 0; i < this._implementTypes.length; ++i) {
			var type = this._implementTypes[i].instantiate(instantiationContext, false);
			if (! (type instanceof ParsedObjectType)) {
				instantiationContext.errors.push(new CompileError(this._implementTypes[i].getToken(), "non-object type is not extensible"));
				return null;
			}
			implementTypes[i] = type as ParsedObjectType;
		}

		return new TemplateClassDefinition(
			this._token,
			this._className,
			this._flags,
			this._typeArgs,
			extendType,
			implementTypes,
			members,
			inners,
			templateInners,
			context.objectTypesUsed,
			this._docComment
		);
	}

	function instantiateTemplateClass (errors : CompileError[], request : TemplateInstantiationRequest) : InstantiatedClassDefinition {
		// prepare
		var instantiationContext = this.buildInstantiationContext(errors, request.getToken(), this._typeArgs, request.getTypeArguments());
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
		var inners = new ClassDefinition[];
		for (var i = 0; i < this._inners.length; ++i) {
			var inner = this._inners[i].instantiate(instantiationContext);
			if (inner == null)
				succeeded = false;
			inners[i] = inner;
		}
		var templateInners = new TemplateClassDefinition[];
		for (var i = 0; i < this._templateInners.length; ++i) {
			var templateInner = this._templateInners[i].instantiate(instantiationContext);
			if (templateInner == null)
				succeeded = false;
			templateInners[i] = templateInner;
		}

		// done
		if (! succeeded)
			return null;

		var extendType = null : ParsedObjectType;
		if (this._extendType != null) {
			var type = this._extendType.instantiate(instantiationContext, false);
			if (! (type instanceof ParsedObjectType)) {
				instantiationContext.errors.push(new CompileError(this._extendType.getToken(), "non-object type is not extensible"));
				return null;
			}
			extendType = type as ParsedObjectType;
		}

		var implementTypes = new ParsedObjectType[];
		for (var i = 0; i < this._implementTypes.length; ++i) {
			var type = this._implementTypes[i].instantiate(instantiationContext, false);
			if (! (type instanceof ParsedObjectType)) {
				instantiationContext.errors.push(new CompileError(this._implementTypes[i].getToken(), "non-object type is not extensible"));
				return null;
			}
			implementTypes[i] = type as ParsedObjectType;
		}

		var instantiatedDef = new InstantiatedClassDefinition(
			this,
			request.getTypeArguments(),
			extendType,
			implementTypes,
			members,
			inners,
			templateInners,
			instantiationContext.objectTypesUsed);
		return instantiatedDef;
	}

}

class InstantiatedClassDefinition extends ClassDefinition {

	var _templateClassDef : TemplateClassDefinition;
	var _typeArguments : Type[];

	function constructor (templateClassDef : TemplateClassDefinition, typeArguments : Type[], extendType : ParsedObjectType, implementTypes : ParsedObjectType[], members : MemberDefinition[], inners : ClassDefinition[], templateInners : TemplateClassDefinition[], objectTypesUsed : ParsedObjectType[]) {
		super(
			null,
			Type.templateTypeToString(templateClassDef.classFullName(), typeArguments),
			templateClassDef.flags(),
			extendType,
			implementTypes,
			members,
			inners,
			templateInners,
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

	override function instantiate (instantiationContext : InstantiationContext) : InstantiatedClassDefinition {
		throw new Error("logic flaw");
	}

}
