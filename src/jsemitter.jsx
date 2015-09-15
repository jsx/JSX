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

import "./meta.jsx";
import "./analysis.jsx";
import "./classdef.jsx";
import "./type.jsx";
import "./expression.jsx";
import "./statement.jsx";
import "./emitter.jsx";
import "./jssourcemap.jsx";
import "./util.jsx";
import "./parser.jsx";
import "./platform.jsx";
import _UnclassifyOptimizationCommand,
	   _NoDebugCommand from "./optimizer.jsx";


// utilify functions specific to jsemitter
class _Util {

	static const OUTPUTNAME_IDENTIFIER = "emitter.outputname";

	class OutputNameStash extends Stash {
		var outputName : string;
		function constructor(outputName : string) {
			this.outputName = outputName;
		}
		override function clone() : Stash {
			throw new Error("not supported");
		}
	}

	static function getOutputClassName(classDef : ClassDefinition) : string {
		var stash = classDef.getStash(_Util.OUTPUTNAME_IDENTIFIER) as _Util.OutputNameStash;
		assert stash != null, classDef.className();
		return stash.outputName;
	}

	static function getOutputConstructorName(classDef : ClassDefinition, argTypes : Type[]) : string {
		if ((classDef.flags() & ClassDefinition.IS_NATIVE) != 0) {
			return _Util.getNameOfNativeConstructor(classDef);
		}
		var ctor = Util.findFunctionInClass(classDef, "constructor", argTypes, false);
		assert ctor, "could not find constructor for class: " + classDef.className();
		var stash = ctor.getStash(_Util.OUTPUTNAME_IDENTIFIER) as _Util.OutputNameStash;
		assert stash != null, ctor.getNotation();
		return stash.outputName;
	}

	static function getNameOfNativeConstructor(classDef : ClassDefinition) : string {
		if (classDef.getNativeSource() != null || classDef.getOuterClassDef() != null) {
			return _Util.getOutputClassName(classDef);
		}
		if (classDef instanceof InstantiatedClassDefinition) {
			if ((classDef as InstantiatedClassDefinition).getTemplateClass().getNativeSource() != null) {
				return _Util.getOutputClassName((classDef as InstantiatedClassDefinition).getTemplateClass());
			}
			if ((classDef as InstantiatedClassDefinition).getTemplateClassName() == "Map") {
				return "Object";
			} else {
				return (classDef as InstantiatedClassDefinition).getTemplateClassName();
			}
		}
		return classDef.className();
	}

	static function setOutputClassNames(classDefs : ClassDefinition[]) : void {
		function setOutputName(stashable : Stashable, name : string) : void {
			stashable.setStash(_Util.OUTPUTNAME_IDENTIFIER, new _Util.OutputNameStash(name));
		}
		function escapeClassName(name : string) : string {
			return name.replace(/[^A-Za-z0-9_\$]/g, (matched) -> {
				return "$x" + matched.charCodeAt(0).toString(16).toUpperCase();
			});
		}

		var countByName = new Map.<number>;
		function newUniqueName(className : string) : string {
			if (countByName[className]) {
				var name = className + "$" + (countByName[className] - 1) as string;
				++countByName[className];
			} else {
				name = className;
				countByName[className] = 1;
			}
			return escapeClassName(name);
		}
		// rename the classes with conflicting names
		for (var i = 0; i < classDefs.length; ++i) {
			var classDef = classDefs[i];
			if ((classDef.flags() & ClassDefinition.IS_NATIVE) != 0) {
				var className = classDef.className();
				if (! countByName.hasOwnProperty(className)) {
					// FIXME t/run/264
					setOutputName(classDef, escapeClassName(className));
					countByName[className] = 1;
				}
			}
		}
		for (var i = 0; i < classDefs.length; ++i) {
			var classDef = classDefs[i];
			if ((classDef.flags() & ClassDefinition.IS_NATIVE) == 0) {
				var className = classDef.classFullName();

				// list the constructors
				var ctors = _Util.findFunctions(classDef, "constructor", false);
				if (ctors.length != 0) {
					// move exported ctor to the top (so that it would not get mangled)
					for (var j = 0; j < ctors.length; ++j) {
						if ((ctors[j].flags() & ClassDefinition.IS_EXPORT) != 0) {
							var exportedCtor = ctors[j];
							ctors.splice(j, 1);
							ctors.unshift(exportedCtor);
							break;
						}
					}
					var n = newUniqueName(className);
					setOutputName(classDef, n);
					setOutputName(ctors[0], n);
					for (var j = 1; j < ctors.length; ++j) {
						setOutputName(ctors[j], newUniqueName(className));
					}
				} else {
					setOutputName(classDef, newUniqueName(className));
				}
			}
			else { // native class
				if (classDef.getOuterClassDef() != null) {
					// native inner class
					var className = _Util.getOutputClassName(classDef.getOuterClassDef()) + "." + classDef.className();
					setOutputName(classDef, className);
				}
				else if (classDef.getNativeSource() != null) {
					// with in-line natie definition
					setOutputName(classDef, newUniqueName(classDef.classFullName()));
				}
				else {
					// with in-line natie definition
					if (classDef instanceof InstantiatedClassDefinition) {
						var instantiated = classDef as InstantiatedClassDefinition;
						var className = instantiated.getTemplateClassName()
							+ newUniqueName(".<" + instantiated.getTypeArguments().map.<string>( (type) -> type.toString() ).join(",") + ">");
						setOutputName(classDef, escapeClassName(className));
					}
					else {
						setOutputName(classDef, escapeClassName(classDef.classFullName()));
					}
				}
			}
		}
	}

	static function encodeObjectLiteralKey(s : string) : string {
		if (s.length == 0 || s.match(/^[A-Za-z_$][A-Za-z0-9_$]*$/)) {
			return s;
		}
		return Util.encodeStringLiteral(s);
	}

	static function findFunctions(classDef : ClassDefinition, name : string, isStatic : boolean) : MemberFunctionDefinition[] {
		var functions = new MemberFunctionDefinition[];
		var members = classDef.members();
		for (var i = 0; i < members.length; ++i) {
			var member = members[i];
			if ((member instanceof MemberFunctionDefinition) && member.name() == name
				&& (member.flags() & ClassDefinition.IS_STATIC) == (isStatic ? ClassDefinition.IS_STATIC : 0))
				functions.push(member as MemberFunctionDefinition);
		}
		return functions;
	}

	static function nameIsValidAsProperty(name : string) : boolean {
		return /^[\$_A-Za-z][\$_0-9A-Za-z]*$/.test(name) && !_Util.isECMA262Reserved(name);
	}

	static const _ecma262reserved = Util.asSet([
		"break", "do", "instanceof", "typeof",
		"case", "else", "new", "var",
		"catch", "finally", "return", "void",
		"continue", "for", "switch", "while",
		"debugger", "function", "this", "with",
		"default", "if", "throw",
		"delete", "in", "try",
		"class", "enum", "extends", "super",
		"const", "export", "import",
		"implements", "let", "private", "public", "yield",
		"interface", "package", "protected", "static",
		"null",
		"true", "false"
	]);

	/**
	 * @see ECMA 262 5th, 7.6.1 Reserved Words
	 */
	static function isECMA262Reserved(word : string) : boolean {
		return _Util._ecma262reserved.hasOwnProperty(word);
	}

	static function getECMA262ReservedWords() : string[] {
		return _Util._ecma262reserved.keys();
	}

	static function getECMA262NumberLiteral(expr : NumberLiteralExpression) : string {
		if (expr.tokenIsECMA262Conformant()) {
			// path for preserving the original representation (do not decode => encode)
			return expr.getToken().getValue();
		} else {
			return expr.getDecoded() as string;
		}
	}

	static function getECMA262StringLiteral(expr : StringLiteralExpression) : string {
		if (expr.tokenIsECMA262Conformant()) {
			// path for preserving the original representation (do not decode => encode)
			return expr.getToken().getValue();
		} else {
			return Util.encodeStringLiteral(expr.getDecoded());
		}
	}

	static function isArrayType(type : Type) : boolean {
		return type.getClassDef() instanceof InstantiatedClassDefinition && (type.getClassDef() as InstantiatedClassDefinition).getTemplateClassName() == "Array";
	}

	static function emitWithPrecedence(emitter : JavaScriptEmitter, outerOpPrecedence : number, precedence : number, callback : function():void) : void {
		if (precedence > outerOpPrecedence) {
			emitter._emit("(", null);
			callback();
			emitter._emit(")", null);
		} else {
			callback();
		}
	}

	static function emitFusedIntOpWithSideEffects(emitter : JavaScriptEmitter, helperFunc : string, expr : Expression, otherExprEmitter : function (outerOpPrecedence : number) : void, outerOpPrecedence : number) : void {
		emitter._emit(helperFunc + "(", expr.getToken());
		if (expr instanceof PropertyExpression) {
			var propertyExpr = expr as PropertyExpression;
			emitter._getExpressionEmitterFor(propertyExpr.getExpr()).emit(0);
			emitter._emit(", ", expr.getToken());
			var name : string;
			if (propertyExpr.getExpr().isClassSpecifier()) {
				var classDef = propertyExpr.getHolderType().getClassDef();
				name = emitter.getNamer().getNameOfStaticVariable(classDef, propertyExpr.getIdentifierToken().getValue());
			} else {
				name = emitter.getNamer().getNameOfProperty(propertyExpr.getHolderType().getClassDef(), propertyExpr.getIdentifierToken().getValue());
			}
			emitter._emit(Util.encodeStringLiteral(name), propertyExpr.getIdentifierToken());
		} else {
			emitter._getExpressionEmitterFor((expr as ArrayExpression).getFirstExpr()).emit(0);
			emitter._emit(", ", expr.getToken());
			emitter._getExpressionEmitterFor((expr as ArrayExpression).getSecondExpr()).emit(0);
		}
		if (otherExprEmitter != null) {
			emitter._emit(", ", expr.getToken());
			otherExprEmitter(0);
		}
		emitter._emit(")", expr.getToken());
	}

	static function getNewExpressionInliner(expr : NewExpression) : function(:NewExpression):Expression[] {
		var classDef = expr.getType().getClassDef();
		var ctor = expr.getConstructor();
		var argTypes = ctor.getArgumentTypes();
		var callingFuncDef = Util.findFunctionInClass(classDef, "constructor", argTypes, false);
		assert callingFuncDef != null, "logic flow for " + expr.getType().toString();

		var stash = callingFuncDef.getStash("unclassify");
		return stash ? (stash as _UnclassifyOptimizationCommand.Stash).inliner : null;
	}

	static function getElementTypeOfCompoundType(type : Type) : Type {
		if (type.equals(Type.variantType)) {
			return Type.variantType;
		}
		var classDef = type.getClassDef();
		assert ! classDef.className().match(/^(Array|Map)\.$/);
		return (classDef as InstantiatedClassDefinition).getTypeArguments()[0];
	}

}

class _TempVarLister {

	var _varNameMap = new Map.<boolean>;

	function finalize() : Array.<string> {
		var varNames = new string[];
		for (var k in this._varNameMap) {
			varNames.push(k);
		}
		return varNames;
	}

	function update(funcDef : MemberFunctionDefinition) : _TempVarLister {
		function onStmt(stmt : Statement) : boolean {
			stmt.forEachExpression(function (expr) {
				this.update(expr);
				return true;
			});
			stmt.forEachStatement(onStmt);
			return true;
		}
		Util.forEachStatement(onStmt, funcDef.getStatements());
		return this;
	}

	function update(expr : Expression) : _TempVarLister {
		function onExpr(expr : Expression) : boolean {
			expr.forEachExpression(onExpr);
			if (expr instanceof PostIncrementExpression) {
				if (this._varNameMap[_PostIncrementExpressionEmitter.TEMP_VAR_NAME] == null
					&& _PostIncrementExpressionEmitter.needsTempVarFor(expr as PostIncrementExpression)) {
					this._varNameMap[_PostIncrementExpressionEmitter.TEMP_VAR_NAME] = true;
				}
			}
			return true;
		}
		onExpr(expr);
		return this;
	}

}

class _Mangler {

	function mangleFunctionName (name : string, argTypes : Type[]) : string {
		return name + this.mangleFunctionArguments(argTypes);
	}

	function mangleTypeName (type : Type) : string {
		if (type.equals(Type.voidType))
			return "V";
		else if (type.equals(Type.booleanType))
			return "B";
		else if (type.equals(Type.integerType))
			return "I";
		else if (type.equals(Type.numberType))
			return "N";
		else if (type.equals(Type.stringType))
			return "S";
		else if (type instanceof ObjectType) {
			var classDef = type.getClassDef();
			if (classDef instanceof InstantiatedClassDefinition) {
				var typeArgs = (classDef as InstantiatedClassDefinition).getTypeArguments();
				switch ((classDef as InstantiatedClassDefinition).getTemplateClassName()) {
				case "Array":
					return "A" + this.mangleTypeName(typeArgs[0]);
				case "Map":
					return "H" + this.mangleTypeName(typeArgs[0]);
				default:
					// fall through
				}
			}
			// the name may include "." if the classDef is a native class with
			// native source.
			return "L" + _Util.getOutputClassName(type.getClassDef()).replace(/\./g, (c) -> "$x" + c.charCodeAt(0).toString(16).toUpperCase()) + "$";
		} else if (type instanceof StaticFunctionType)
			return "F" + this.mangleFunctionArguments((type as StaticFunctionType).getArgumentTypes()) + this.mangleTypeName((type as StaticFunctionType).getReturnType()) + "$";
		else if (type instanceof MemberFunctionType)
			return "M" + this.mangleTypeName((type as MemberFunctionType).getObjectType()) + this.mangleFunctionArguments((type as MemberFunctionType).getArgumentTypes()) + this.mangleTypeName((type as MemberFunctionType).getReturnType()) + "$";
		else if (type instanceof NullableType)
			return "U" + this.mangleTypeName((type as NullableType).getBaseType());
		else if (type.equals(Type.variantType))
			return "X";
		else
			throw new Error("FIXME " + type.toString());
	}

	function mangleFunctionArguments (argTypes : Type[]) : string {
		var s = "$";
		for (var i = 0; i < argTypes.length; ++i)
			s += this.mangleTypeName(argTypes[i]);
		return s;
	}

	function requiresMangling(classDef : ClassDefinition, name : string, argTypes : Type[], isStatic : boolean) : boolean {
		assert argTypes != null;
		return ! Util.memberRootIsNative(classDef, name, argTypes, isStatic);
	}

	function requiresMangling(expr : PropertyExpression) : boolean {
		if (! Util.isReferringToFunctionDefinition(expr)) {
			return false;
		}
		return ! Util.propertyRootIsNative(expr);
	}

	function requiresMangling(member : MemberFunctionDefinition) : boolean {
		return this.requiresMangling(member.getClassDef(), member.name(), member.getArgumentTypes(), (member.flags() & ClassDefinition.IS_STATIC) != 0);
	}

}

class _Namer {

	static const IDENTIFIER = "namer";

	class _TryStash extends Stash {
		var catchName : string;
		function constructor(catchName : string) {
			this.catchName = catchName;
		}
		override function clone() : Stash {
			throw new Error("operation not supported");
		}
	}

	class _CatchTargetStash extends Stash {
		var tryStmt : TryStatement;
		function constructor(tryStmt : TryStatement) {
			this.tryStmt = tryStmt;
		}
		override function clone() : Stash {
			throw new Error("operation not supported");
		}
	}

	var _emitter : JavaScriptEmitter;
	var _catchLevel = -1;

	function setup(emitter : JavaScriptEmitter) : _Namer {
		this._emitter = emitter;
		return this;
	}

	function getNameOfProperty(classDef : ClassDefinition, name : string) : string {
		return name;
	}

	function getNameOfMethod(classDef : ClassDefinition, name : string, argTypes : Type[]) : string {
		if (Util.memberRootIsNative(classDef, name, argTypes, false)) {
			return name;
		}
		return this._emitter.getMangler().mangleFunctionName(name, argTypes);
	}

	function getNameOfStaticVariable(classDef : ClassDefinition, name : string) : string {
		return name;
	}

	function getNameOfStaticFunction(classDef : ClassDefinition, name : string, argTypes : Type[]) : string {
		var className = _Util.getOutputClassName(classDef);
		if (Util.memberRootIsNative(classDef, name, argTypes, true)) {
			return className + "." + name;
		}
		return className + "$" + this._emitter.getMangler().mangleFunctionName(name, argTypes);
	}

	function getNameOfConstructor(classDef : ClassDefinition, argTypes : Type[]) : string {
		return _Util.getOutputConstructorName(classDef, argTypes);
	}

	function getNameOfClass(classDef : ClassDefinition) : string {
		return _Util.getOutputClassName(classDef);
	}

	function enterScope(local : LocalVariable, cb : function () : void) : void {
		cb();
	}

	function enterFunction(funcDef : MemberFunctionDefinition, cb : function () : void) : void {
		cb();
	}

	function enterCatch(tryStmt : TryStatement, cb : function (getCatchName : function () : string) : void) : void {
		// adjust level
		++this._catchLevel;
		// doit
		this._enterCatch(tryStmt, cb, "$__jsx_catch_" + this._catchLevel as string);
		// exit
		--this._catchLevel;
	}

	function _enterCatch(tryStmt : TryStatement, cb : function (getCatchName : function () : string) : void, catchName : string) : void {
		tryStmt.setStash(_Namer.IDENTIFIER, new _Namer._TryStash(catchName));
		var catchStmts = tryStmt.getCatchStatements();
		for (var i in catchStmts) {
			catchStmts[i].getLocal().setStash(_Namer.IDENTIFIER, new _Namer._CatchTargetStash(tryStmt));
		}
		cb(function () { return this._getCatchName(tryStmt); });
	}

	function getNameOfLocalVariable(local : LocalVariable) : string {
		if (local instanceof CaughtVariable) {
			return this._getCatchName(local as CaughtVariable);
		} else {
			return local.getName().getValue();
		}
	}

	function _getCatchName(caught : CaughtVariable) : string {
		return this._getCatchName((caught.getStash(_Namer.IDENTIFIER) as _Namer._CatchTargetStash).tryStmt);
	}

	function _getCatchName(tryStmt : TryStatement) : string {
		return (tryStmt.getStash(_Namer.IDENTIFIER) as _Namer._TryStash).catchName;
	}

}

class _MinifiedNameGenerator {

	static const _MINIFY_CHARS = "$_ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

	/// ECMA 262 global objects
	static const GLOBALS = (
		"NaN Infinity undefined eval"
		+ "parseInt parseFloat isNaN isFinite decodeURI decodeURIComponent encodeURI encodeURIComponent"
		+ " Object Function Array String Boolean Number Date RegExp Error EvalError RangeError ReferenceError SyntaxError TypeError URIError Math"
		).split(/\s+/);

	var _skipWords = new Map.<boolean>;
	var _memo = new string[];
	var _counter = 0;

	function constructor(skipWords : string[]) {
		for (var i in skipWords) {
			this._skipWords[skipWords[i]] = true;
		}
	}

	function get(n : number) : string {
		while (this._memo.length <= n) {
			do {
				var candidate = _MinifiedNameGenerator._stringify(this._counter++);
			} while (this._skipWords.hasOwnProperty(candidate) || candidate.match(/^[0-9$]/));
			this._memo.push(candidate);
		}
		return this._memo[n];
	}

	static function _stringify(n : number) : string {
		var name = "";
		do {
			var colIndex = n % _MinifiedNameGenerator._MINIFY_CHARS.length;
			name += _MinifiedNameGenerator._MINIFY_CHARS.charAt(colIndex);
			n = (n - colIndex) / _MinifiedNameGenerator._MINIFY_CHARS.length;
		} while (n != 0);
		return name;
	}

}

class _Minifier {

	static const CLASSSTASH_IDENTIFIER = "minifier.class";
	static const SCOPESTASH_IDENTIFIER = "minifier.scope";
	static const LOCALSTASH_IDENTIFIER = "minifier.local";

	class _ClassStash extends Stash {
		var staticVariableUseCount = new Map.<number>;
		var staticVariableConversionTable = new Map.<string>;
		override function clone() : Stash {
			throw new Error("operation not supported");
		}
	}

	class _ScopeStash extends Stash {
		var usedGlobals = new Map.<boolean>;
		var usedOuterLocals = new LocalVariable[];
		override function clone() : Stash {
			throw new Error("operation not supported");
		}
	}

	class _LocalStash extends Stash {
		var useCount = 0;
		var minifiedName : Nullable.<string>;
		override function clone() : Stash {
			throw new Error("operation not supported");
		}
	}

	var _emitter : JavaScriptEmitter;
	var _classDefs : ClassDefinition[];

	var _propertyUseCount = new Map.<number>();
	var _propertyConversionTable : Map.<string>;
	var _globalUseCount = new Map.<number>();
	var _globalConversionTable : Map.<string>;

	var _outerLocals = new LocalVariable[];

	class _MinifyingNamer extends _Namer {
		var _minifier : _Minifier;
		function setup(minifier : _Minifier) : _Minifier._MinifyingNamer {
			this._minifier = minifier;
			super.setup(minifier._emitter);
			return this;
		}
		function _getMangler() : _Mangler {
			return this._minifier._emitter.getMangler();
		}
		function _isCounting() : boolean {
			return this._minifier._isCounting();
		}
		override function getNameOfProperty(classDef : ClassDefinition, name : string) : string {
			if (Util.memberRootIsNative(classDef, name, null, false)
				|| Util.memberIsExported(classDef, name, null, false)) {
				return name;
			}
			if (this._isCounting()) {
				_Minifier._incr(this._minifier._propertyUseCount, name);
			} else {
				name = this._minifier._propertyConversionTable[name];
			}
			return name;
		}
		override function getNameOfMethod(classDef : ClassDefinition, name : string, argTypes : Type[]) : string {
			if (Util.memberRootIsNative(classDef, name, argTypes, false)) {
				return name;
			}
			var mangledName = this._getMangler().mangleFunctionName(name, argTypes);
			if (this._isCounting()) {
				_Minifier._incr(this._minifier._propertyUseCount, mangledName);
			} else {
				mangledName = this._minifier._propertyConversionTable[mangledName];
			}
			return mangledName;
		}
		override function getNameOfStaticVariable(classDef : ClassDefinition, name : string) : string {
			if (Util.memberRootIsNative(classDef, name, null, true)
				|| Util.memberIsExported(classDef, name, null, true)) {
				return name;
			}
			if (this._isCounting()) {
				_Minifier._incr(_Minifier._getClassStash(classDef).staticVariableUseCount, name);
			} else {
				name = _Minifier._getClassStash(classDef).staticVariableConversionTable[name];
			}
			return name;
		}
		override function getNameOfStaticFunction(classDef : ClassDefinition, name : string, argTypes : Type[]) : string {
			if (Util.memberRootIsNative(classDef, name, argTypes, true)) {
				return this.getNameOfClass(classDef) + "." + name;
			}
			var mangledName = _Util.getOutputClassName(classDef) + "$" + this._getMangler().mangleFunctionName(name, argTypes);
			if (this._isCounting()) {
				_Minifier._incr(this._minifier._globalUseCount, mangledName);
			} else {
				mangledName = this._minifier._globalConversionTable[mangledName];
			}
			return mangledName;
		}
		override function getNameOfConstructor(classDef : ClassDefinition, argTypes : Type[]) : string {
			if ((classDef.flags() & ClassDefinition.IS_NATIVE) != 0) {
				var name = _Util.getNameOfNativeConstructor(classDef);
				if (this._isCounting()) {
					_Minifier._incr(this._minifier._globalUseCount, name);
				}
				return name;
			}
			var mangledName = _Util.getOutputConstructorName(classDef, argTypes);
			if (this._isCounting()) {
				_Minifier._incr(this._minifier._globalUseCount, mangledName);
			} else {
				mangledName = this._minifier._globalConversionTable[mangledName];
			}
			return mangledName;
		}
		override function getNameOfClass(classDef : ClassDefinition) : string {
			var name = _Util.getOutputClassName(classDef);
			if (this._isCounting()) {
				_Minifier._incr(this._minifier._globalUseCount, name);
			}
			if ((classDef.flags() & (ClassDefinition.IS_NATIVE | ClassDefinition.IS_FAKE)) == 0
				&& ! this._isCounting()) {
				return this._minifier._globalConversionTable[name];
			}
			return name;
		}
		override function enterScope(local : LocalVariable, cb : function () : void) : void {
			if (local == null) {
				// to support unnamed function expressions
				cb();
			} else {
				if (this._isCounting()) {
					this._minifier._recordUsedIdentifiers(local, function () {
						this._minifier._outerLocals.push(local);
						cb();
						this._minifier._outerLocals.pop();
					});
				} else {
					this._minifier._buildConversionTable([ local ], _Minifier._getScopeStash(local));
					cb();
				}
			}
		}
		override function enterFunction(funcDef : MemberFunctionDefinition, cb : function () : void) : void {
			if (this._isCounting()) {
				this._minifier._recordUsedIdentifiers(funcDef, function () {
					this._minifier._outerLocals = this._minifier._outerLocals.concat(_Minifier._getArgsAndLocals(funcDef));
					cb();
					this._minifier._outerLocals.length -= funcDef.getArguments().length + funcDef.getLocals().length;
				});
			} else {
				this._minifier._buildConversionTable(_Minifier._getArgsAndLocals(funcDef), _Minifier._getScopeStash(funcDef));
				cb();
			}
		}
		override function getNameOfLocalVariable(local : LocalVariable) : string {
			if (local instanceof CaughtVariable) {
				return this._getCatchName(local as CaughtVariable);
			}
			if (this._isCounting()) {
				++_Minifier._getLocalStash(local).useCount;
				return local.getName().getValue();
			} else {
				return _Minifier._getLocalStash(local).minifiedName;
			}
		}
	}

	function constructor(emitter : JavaScriptEmitter, classDefs : ClassDefinition[]) {
		this._emitter = emitter;
		this._classDefs = classDefs;
	}

	function getCountingNamer() : _Namer {
		assert this._isCounting();
		return (new _Minifier._MinifyingNamer).setup(this);
	}

	function getMinifyingNamer() : _Namer {
		// build minification tables
		this._minifyProperties();
		this._minifyStaticVariables();
		this._minifyGlobals();
		// and return
		return (new _Minifier._MinifyingNamer).setup(this);
	}

	function _isCounting() : boolean {
		return this._propertyConversionTable == null;
	}

	function _recordUsedIdentifiers(stashable : Stashable, cb : function () : void) : void {
		assert this._isCounting();
		// prepare
		var globalUseCountBackup = new Map.<number>;
		for (var k in this._globalUseCount) {
			globalUseCountBackup[k] = this._globalUseCount[k];
		}
		var outerLocalUseCount = new number[];
		for (var i in this._outerLocals) {
			outerLocalUseCount[i] = _Minifier._getLocalStash(this._outerLocals[i]).useCount;
		}
		// execute
		cb();
		assert outerLocalUseCount.length == this._outerLocals.length;
		// collect and store info
		var scopeStash = _Minifier._getScopeStash(stashable);
		for (var k in this._globalUseCount) {
			if (this._globalUseCount[k] != globalUseCountBackup[k]) {
				scopeStash.usedGlobals[k] = true;
			}
		}
		for (var i in this._outerLocals) {
			if (outerLocalUseCount[i] != _Minifier._getLocalStash(this._outerLocals[i]).useCount) {
				scopeStash.usedOuterLocals.push(this._outerLocals[i]);
			}
		}
	}

	function _minifyProperties() : void {
		this._log("minifying properties");
		var exportedPropertyNames = new string[];
		this._classDefs.forEach(function (classDef) {
			classDef.forEachMember(function (member) {
				// check if it is an exported property (or member function)
				if ((member.flags() & (ClassDefinition.IS_STATIC | ClassDefinition.IS_EXPORT)) == ClassDefinition.IS_EXPORT
					&& ! (member instanceof MemberFunctionDefinition && member.name() == "constructor")) {
					exportedPropertyNames.push(member.name());
				}
				return true;
			});
		});
		this._propertyConversionTable = _Minifier._buildConversionTable(
			this._propertyUseCount,
			new _MinifiedNameGenerator(
				_Util.getECMA262ReservedWords().concat(
					(function () : string[] {
						var nativePropertyNames = new Map.<boolean>;
						this._classDefs.forEach(function (classDef) {
							classDef.forEachMember(function (member) {
								if ((member.flags() & ClassDefinition.IS_STATIC) == 0
									&& ((member.flags() | classDef.flags()) & ClassDefinition.IS_NATIVE) != 0) {
									nativePropertyNames[member.name()] = true;
								}
								return true;
							});
						});
						return nativePropertyNames.keys();
					})()
				).concat(exportedPropertyNames)));
		for (var k in this._propertyConversionTable) {
			this._log(" " + k + " => " + this._propertyConversionTable[k]);
		}
	}

	function _minifyStaticVariables() : void {
		this._log("minifying static variables");
		this._classDefs.forEach(function (classDef) {
			if ((classDef.flags() & (ClassDefinition.IS_NATIVE | ClassDefinition.IS_FAKE)) == 0) {
				var exportedStaticVarNames = new string[];
				classDef.forEachMemberVariable(function (member) {
					if ((member.flags() & (ClassDefinition.IS_STATIC | ClassDefinition.IS_EXPORT)) == (ClassDefinition.IS_STATIC | ClassDefinition.IS_EXPORT)) {
						exportedStaticVarNames.push(member.name());
					}
					return true;
				});
				var stash = _Minifier._getClassStash(classDef);
				stash.staticVariableConversionTable = _Minifier._buildConversionTable(
					stash.staticVariableUseCount,
					new _MinifiedNameGenerator(_Util.getECMA262ReservedWords().concat(exportedStaticVarNames)));
			}
		});
	}

	function _minifyGlobals() : void {
		this._log("minifying classes and static functions");
		// build useCount list wo. native class names
		var useCount = new Map.<number>;
		for (var k in this._globalUseCount) {
			useCount[k] = this._globalUseCount[k];
		}
		this._classDefs.forEach(function (classDef) {
			if ((classDef.flags() & (ClassDefinition.IS_NATIVE | ClassDefinition.IS_FAKE)) != 0) {
				delete useCount[classDef.className()];
			}
		});
		// build conversion table
		this._globalConversionTable = _Minifier._buildConversionTable(
			useCount,
			new _MinifiedNameGenerator(
				_Util.getECMA262ReservedWords().concat(
					_MinifiedNameGenerator.GLOBALS,
					(function () : string[] {
						var nativeClassNames = new string[];
						this._classDefs.forEach(function (classDef) {
							if ((classDef.flags() & ClassDefinition.IS_NATIVE) != 0) {
								nativeClassNames.push(classDef.className());
							}
						});
						return nativeClassNames;
					})()
				)));
		for (var k in this._globalConversionTable) {
			this._log(" " + k + " => " + this._globalConversionTable[k]);
		}
	}

	function _log(message : string) : void {
		// log message;
	}

	function _buildConversionTable(locals : LocalVariable[], scopeStash : _Minifier._ScopeStash) : void {
		// build useCount
		var useCount = new Map.<number>;
		locals.forEach(function (local) {
			useCount[local.getName().getValue()] = _Minifier._getLocalStash(local).useCount;
		});
		// build list of reserved words
		var reserved = [] : string[];
		for (var k in scopeStash.usedGlobals) {
			// if k does not exist in globalConversionTable then it is a native class name
			reserved.push(this._globalConversionTable.hasOwnProperty(k) ? this._globalConversionTable[k] : k);
		}
		for (var i in scopeStash.usedOuterLocals) {
			reserved.push(_Minifier._getLocalStash(scopeStash.usedOuterLocals[i]).minifiedName);
		}
		this._log("local minification, preserving: " + reserved.join(","));
		reserved = reserved.concat(_Util.getECMA262ReservedWords());
		// doit
		var conversionTable = _Minifier._buildConversionTable(useCount, new _MinifiedNameGenerator(reserved));
		// store the result
		locals.forEach(function (local) {
			_Minifier._getLocalStash(local).minifiedName = conversionTable[local.getName().getValue()];
		});
	}

	static function _buildConversionTable(useCount : Map.<number>, nameGenerator : _MinifiedNameGenerator) : Map.<string> {
		// sort property names by use count (in descending order)
		var propertyNames = useCount.keys().sort(function (x, y) {
			var delta = useCount[y] - useCount[x];
			if (delta != 0) {
				return delta;
			}
			if (x < y) {
				return -1;
			} else {
				return 1;
			}
		});
		// build conversion map
		var conversionTable = new Map.<string>();
		for (var i = 0; i < propertyNames.length; ++i) {
			conversionTable[propertyNames[i]] = nameGenerator.get(i);
		}
		return conversionTable;
	}

	static function _getClassStash(classDef : ClassDefinition) : _Minifier._ClassStash {
		var stash = classDef.getStash(_Minifier.CLASSSTASH_IDENTIFIER);
		if (stash == null) {
			stash = classDef.setStash(_Minifier.CLASSSTASH_IDENTIFIER, new _Minifier._ClassStash());
		}
		return stash as _Minifier._ClassStash;
	}

	static function _getScopeStash(stashable : Stashable) : _Minifier._ScopeStash {
		var stash = stashable.getStash(_Minifier.SCOPESTASH_IDENTIFIER);
		if(stash == null) {
			stash = stashable.setStash(_Minifier.SCOPESTASH_IDENTIFIER, new _Minifier._ScopeStash());
		}
		return stash as _Minifier._ScopeStash;
	}

	static function _getLocalStash(local : LocalVariable) : _Minifier._LocalStash {
		var stash = local.getStash(_Minifier.LOCALSTASH_IDENTIFIER);
		if(stash == null) {
			stash = local.setStash(_Minifier.LOCALSTASH_IDENTIFIER, new _Minifier._LocalStash());
		}
		return stash as _Minifier._LocalStash;
	}

	static function _incr(useCount : Map.<number>, name : string) : void {
		if (useCount.hasOwnProperty(name)) {
			++useCount[name];
		} else {
			useCount[name] = 1;
		}
	}

	static function _getArgsAndLocals(funcDef : MemberFunctionDefinition) : LocalVariable[] {
		var list = new LocalVariable[];
		funcDef.getArguments().forEach(function (a) { list.push(a); });
		return list.concat(funcDef.getLocals());
	}

	static function minifyJavaScript(src : string) : string {
		var ast = esprima.parse(src);
		ast = esmangle.mangle(ast, { destructive: true } : Map.<variant>);
		return escodegen.generate(ast,
			{
				format: {
					renumber: true,
					hexadecimal: true,
					escapeless: true,
					compact: true,
					semicolons: false,
					parentheses: false
				},
				directive: true
			});
	}

}

native class esprima {
	static function parse(src : string) : variant;
} = "require('esprima')";

native class esmangle {
	static function mangle(ast : variant, opts : Map.<variant>) : variant;
} = "require('esmangle')";

native class escodegen {
	static function generate(ast : variant, opts : Map.<variant>) : string;
} = "require('escodegen')";


// statement emitter

abstract class _StatementEmitter {

	var _emitter : JavaScriptEmitter;

	function constructor (emitter : JavaScriptEmitter) {
		this._emitter = emitter;
	}

	abstract function emit () : void;

	function emitLabelOfStatement (statement : LabellableStatement) : void {
		var label = statement.getLabel();
		if (label != null) {
			this._emitter._reduceIndent();
			this._emitter._emit(label.getValue() + ":\n", label);
			this._emitter._advanceIndent();
		}
	}

}

class _ConstructorInvocationStatementEmitter extends _StatementEmitter {

	var _statement : ConstructorInvocationStatement;

	function constructor (emitter : JavaScriptEmitter, statement : ConstructorInvocationStatement) {
		super(emitter);
		this._statement = statement;
	}

	override function emit () : void {
		var ctorType = this._statement.getConstructorType() as ResolvedFunctionType;
		var argTypes = ctorType != null ? ctorType.getArgumentTypes() : new Type[];
		var ctorName = this._emitter.getNamer().getNameOfConstructor(this._statement.getConstructingClassDef(), argTypes);
		var token = this._statement.getToken();
		var thisVar = this._emitter._emittingFunction.getParent() != null ?  "$this" : "this";

		this._emitter._emitCallArguments(token, ctorName + ".call(" + thisVar, this._statement.getArguments(), argTypes);
		this._emitter._emit(";\n", token);

		if (ctorName == "Error") {
			/*
				At least v8 does not support "Error.call(this, message)"; it not only does not setup the stacktrace but also does
				not set the message property.  So we set the message property.
				We continue to call "Error" hoping that it would have some positive effect on other platforms (like setting the
				stacktrace, etc.).

				FIXME check that doing  "Error.call(this);" does not have any negative effect on other platforms
			*/
			if (this._statement.getArguments().length == 1) {
				this._emitter._emit("this.message = ", token);
				this._emitter._getExpressionEmitterFor(this._statement.getArguments()[0]).emit(_AssignmentExpressionEmitter._operatorPrecedence["="]);
				this._emitter._emit(";\n", token);
			}

			// Althought it's not in the standard, the name property is used as the prefix of the error message,
			// so we set it for convinience.
			this._emitter._emit("this.name = \"" + this._emitter._emittingFunction.getClassDef().classFullName() + "\";\n", token);

			// V8 has an API to set up stacktrace, so call it for convinience if available.
			// https://code.google.com/p/v8/wiki/JavaScriptStackTraceApi
			this._emitter._emit("if (Error.captureStackTrace) Error.captureStackTrace(this, ", null);
			this._emitter._emit(this._emitter.getNamer().getNameOfClass(this._emitter._emittingFunction.getClassDef()) , null);
			this._emitter._emit(");\n", null);
		}
	}

}

class _ExpressionStatementEmitter extends _StatementEmitter {

	var _statement : ExpressionStatement;

	function constructor (emitter : JavaScriptEmitter, statement : ExpressionStatement) {
		super(emitter);
		this._statement = statement;
	}

	override function emit () : void {
		this._emitter._getExpressionEmitterFor(this._statement.getExpr()).emit(0);
		this._emitter._emit(";\n", null);
	}

}

class _FunctionStatementEmitter extends _StatementEmitter {

	var _statement : FunctionStatement;

	function constructor (emitter : JavaScriptEmitter, statement : FunctionStatement) {
		super(emitter);
		this._statement = statement;
	}

	override function emit () : void {
		var funcDef = this._statement.getFuncDef();
		assert funcDef.getFuncLocal() != null;
		this._emitter._emit("function " + (funcDef.isGenerator() ? "* " : "") + this._emitter.getNamer().getNameOfLocalVariable(funcDef.getFuncLocal()) + "(", funcDef.getToken());
		this._emitter.getNamer().enterFunction(funcDef, function () {
			var args = funcDef.getArguments();
			for (var i = 0; i < args.length; ++i) {
				if (i != 0)
					this._emitter._emit(", ", funcDef.getToken());
				this._emitter._emit(this._emitter.getNamer().getNameOfLocalVariable(args[i]), funcDef.getToken());
			}
			this._emitter._emit(") {\n", funcDef.getToken());
			this._emitter._advanceIndent();
			this._emitter._emitFunctionBody(funcDef);
			this._emitter._reduceIndent();
			this._emitter._emit("}\n", funcDef.getToken());
		});
	}

}

class _ReturnStatementEmitter extends _StatementEmitter {

	var _statement : ReturnStatement;

	function constructor (emitter : JavaScriptEmitter, statement : ReturnStatement) {
		super(emitter);
		this._statement = statement;
	}

	override function emit () : void {
		var expr = this._statement.getExpr();
		if (expr != null) {
			this._emitter._emit("return ", null);
			if (this._emitter._enableProfiler) {
				this._emitter._emit("$__jsx_profiler.exit(", null);
			}
			this._emitter._emitRHSOfAssignment(this._statement.getExpr(), this._emitter._emittingFunction.getReturnType());
			if (this._emitter._enableProfiler) {
				this._emitter._emit(")", null);
			}
			this._emitter._emit(";\n", null);
		} else {
			if (this._emitter._enableProfiler) {
				this._emitter._emit("return $__jsx_profiler.exit();\n", this._statement.getToken());
			} else {
				this._emitter._emit("return;\n", this._statement.getToken());
			}
		}
	}

}

class _DeleteStatementEmitter extends _StatementEmitter {

	var _statement : DeleteStatement;

	function constructor (emitter : JavaScriptEmitter, statement : DeleteStatement) {
		super(emitter);
		this._statement = statement;
	}

	override function emit () : void {
		this._emitter._emit("delete ", this._statement.getToken());
		this._emitter._getExpressionEmitterFor(this._statement.getExpr()).emit(0);
		this._emitter._emit(";\n", null);
	}

}

class _BreakStatementEmitter extends _StatementEmitter {

	var _statement : BreakStatement;

	function constructor (emitter : JavaScriptEmitter, statement : BreakStatement) {
		super(emitter);
		this._statement = statement;
	}

	override function emit () : void {
		if (this._statement.getLabel() != null)
			this._emitter._emit("break " + this._statement.getLabel().getValue() + ";\n", this._statement.getToken());
		else
			this._emitter._emit("break;\n", this._statement.getToken());
	}

}

class _ContinueStatementEmitter extends _StatementEmitter {

	var _statement : ContinueStatement;

	function constructor (emitter : JavaScriptEmitter, statement : ContinueStatement) {
		super(emitter);
		this._statement = statement;
	}

	override function emit () : void {
		if (this._statement.getLabel() != null)
			this._emitter._emit("continue " + this._statement.getLabel().getValue() + ";\n", this._statement.getToken());
		else
			this._emitter._emit("continue;\n", this._statement.getToken());
	}

}

class _DoWhileStatementEmitter extends _StatementEmitter {

	var _statement : DoWhileStatement;

	function constructor (emitter : JavaScriptEmitter, statement : DoWhileStatement) {
		super(emitter);
		this._statement = statement;
	}

	override function emit () : void {
		this.emitLabelOfStatement(this._statement);
		this._emitter._emit("do {\n", null);
		this._emitter._emitStatements(this._statement.getStatements());
		this._emitter._emit("} while (", null);
		this._emitter._getExpressionEmitterFor(this._statement.getExpr()).emit(0);
		this._emitter._emit(");\n", null);
	}

}

class _ForInStatementEmitter extends _StatementEmitter {

	var _statement : ForInStatement;

	function constructor (emitter : JavaScriptEmitter, statement : ForInStatement) {
		super(emitter);
		this._statement = statement;
	}

	override function emit () : void {
		this.emitLabelOfStatement(this._statement);
		this._emitter._emit("for (", null);
		this._emitter._getExpressionEmitterFor(this._statement.getLHSExpr()).emit(0);
		this._emitter._emit(" in ", null);
		this._emitter._getExpressionEmitterFor(this._statement.getListExpr()).emit(0);
		this._emitter._emit(") {", null);
		if (_Util.isArrayType(this._statement.getListExpr().getType())) {
			// force numify because it's a string
			this._emitter._emit(" ", null);
			this._emitter._getExpressionEmitterFor(this._statement.getLHSExpr()).emit(0);
			this._emitter._emit(" |= 0;", null);
		}
		this._emitter._emit("\n", null);
		this._emitter._emitStatements(this._statement.getStatements());
		this._emitter._emit("}\n", null);
	}

}

class _ForStatementEmitter extends _StatementEmitter {

	var _statement : ForStatement;

	function constructor (emitter : JavaScriptEmitter, statement : ForStatement) {
		super(emitter);
		this._statement = statement;
	}

	override function emit () : void {
		this.emitLabelOfStatement(this._statement);
		this._emitter._emit("for (", this._statement.getToken());
		var initExpr = this._statement.getInitExpr();
		if (initExpr != null)
			this._emitter._getExpressionEmitterFor(initExpr).emit(0);
		this._emitter._emit("; ", null);
		var condExpr = this._statement.getCondExpr();
		if (condExpr != null)
			this._emitter._getExpressionEmitterFor(condExpr).emit(0);
		this._emitter._emit("; ", null);
		var postExpr = this._statement.getPostExpr();
		if (postExpr != null)
			this._emitter._getExpressionEmitterFor(postExpr).emit(0);
		this._emitter._emit(") {\n", null);
		this._emitter._emitStatements(this._statement.getStatements());
		this._emitter._emit("}\n", null);
	}

}

class _IfStatementEmitter extends _StatementEmitter {

	var _statement : IfStatement;

	function constructor (emitter : JavaScriptEmitter, statement : IfStatement) {
		super(emitter);
		this._statement = statement;
	}

	override function emit () : void {
		this._emitter._emit("if (", this._statement.getToken());
		this._emitter._getExpressionEmitterFor(this._statement.getExpr()).emit(0);
		this._emitter._emit(") {\n", null);
		this._emitter._emitStatements(this._statement.getOnTrueStatements());
		var ifFalseStatements = this._statement.getOnFalseStatements();

		if (ifFalseStatements.length == 1 && ifFalseStatements[0] instanceof IfStatement) {
			this._emitter._emit("} else ", null);
			this._emitter._emitStatement(ifFalseStatements[0]);
			ifFalseStatements = (ifFalseStatements[0] as IfStatement).getOnTrueStatements();
		}
		else {
			if (ifFalseStatements.length != 0) {
				this._emitter._emit("} else {\n", null);
				this._emitter._emitStatements(ifFalseStatements);
			}
			this._emitter._emit("}\n", null);
		}
	}

}

class _SwitchStatementEmitter extends _StatementEmitter {

	var _statement : SwitchStatement;

	function constructor (emitter : JavaScriptEmitter, statement : SwitchStatement) {
		super(emitter);
		this._statement = statement;
	}

	override function emit () : void {
		this.emitLabelOfStatement(this._statement);
		this._emitter._emit("switch (", this._statement.getToken());
		this._emitter._emitWithNullableGuard(this._statement.getExpr(), 0);
		this._emitter._emit(") {\n", null);
		this._emitter._emitStatements(this._statement.getStatements());
		this._emitter._emit("}\n", null);
	}

}

class _CaseStatementEmitter extends _StatementEmitter {

	var _statement : CaseStatement;

	function constructor (emitter : JavaScriptEmitter, statement : CaseStatement) {
		super(emitter);
		this._statement = statement;
	}

	override function emit () : void {
		this._emitter._reduceIndent();
		this._emitter._emit("case ", null);
		this._emitter._emitWithNullableGuard(this._statement.getExpr(), 0);
		this._emitter._emit(":\n", null);
		this._emitter._advanceIndent();
	}

}

class _DefaultStatementEmitter extends _StatementEmitter {

	var _statement : DefaultStatement;

	function constructor (emitter : JavaScriptEmitter, statement : DefaultStatement) {
		super(emitter);
		this._statement = statement;
	}

	override function emit () : void {
		this._emitter._reduceIndent();
		this._emitter._emit("default:\n", null);
		this._emitter._advanceIndent();
	}

}

class _WhileStatementEmitter extends _StatementEmitter {

	var _statement : WhileStatement;

	function constructor (emitter : JavaScriptEmitter, statement : WhileStatement) {
		super(emitter);
		this._statement = statement;
	}

	override function emit () : void {
		this.emitLabelOfStatement(this._statement);
		this._emitter._emit("while (", this._statement.getToken());
		this._emitter._getExpressionEmitterFor(this._statement.getExpr()).emit(0);
		this._emitter._emit(") {\n", null);
		this._emitter._emitStatements(this._statement.getStatements());
		this._emitter._emit("}\n", null);
	}

}

class _TryStatementEmitter extends _StatementEmitter {

	var _statement : TryStatement;

	function constructor (emitter : JavaScriptEmitter, statement : TryStatement) {
		super(emitter);
		this._statement = statement;
	}

	override function emit () : void {
		this._emitter._emit("try {\n", this._statement.getToken());
		this._emitter._emitStatements(this._statement.getTryStatements());
		this._emitter._emit("}", null);
		var catchStatements = this._statement.getCatchStatements();
		if (catchStatements.length != 0) {
			this._emitter.getNamer().enterCatch(this._statement, function (getCatchName) {
				this._emitter._emit(" catch (" + getCatchName() + ") {\n", null);
				if (this._emitter._enableProfiler) {
					this._emitter._advanceIndent();
					this._emitter._emit("$__jsx_profiler.resume($__jsx_profiler_ctx);\n", null);
					this._emitter._reduceIndent();
				}
				this._emitter._emitStatements(catchStatements.map.<Statement>((s) -> { return s; }));
				if (! catchStatements[catchStatements.length - 1].getLocal().getType().equals(Type.variantType)) {
					this._emitter._advanceIndent();
					this._emitter._emit("{\n", null);
					this._emitter._advanceIndent();
					this._emitter._emit("throw " + getCatchName() + ";\n", null);
					this._emitter._reduceIndent();
					this._emitter._emit("}\n", null);
					this._emitter._reduceIndent();
				}
				this._emitter._emit("}", null);
			});
		}
		var finallyStatements = this._statement.getFinallyStatements();
		if (finallyStatements.length != 0 || catchStatements.length == 0) {
			this._emitter._emit(" finally {\n", null);
			this._emitter._emitStatements(finallyStatements);
			this._emitter._emit("}", null);
		}
		this._emitter._emit("\n", null);
	}

}

class _CatchStatementEmitter extends _StatementEmitter {

	var _statement : CatchStatement;

	function constructor (emitter : JavaScriptEmitter, statement : CatchStatement) {
		super(emitter);
		this._statement = statement;
	}

	override function emit () : void {
		var localType = this._statement.getLocal().getType();
		if (localType instanceof ObjectType) {
			this._emitter._emit("if (" + this._emitter.getNamer().getNameOfLocalVariable(this._statement.getLocal()) + " instanceof " + this._emitter.getNamer().getNameOfClass(localType.getClassDef()) + ") {\n", this._statement.getToken());
			this._emitter._emitStatements(this._statement.getStatements());
			this._emitter._emit("} else ", null);
		} else {
			this._emitter._emit("{\n", null);
			this._emitter._emitStatements(this._statement.getStatements());
			this._emitter._emit("}\n", null);
		}
	}

}

class _ThrowStatementEmitter extends _StatementEmitter {

	var _statement : ThrowStatement;

	function constructor (emitter : JavaScriptEmitter, statement : ThrowStatement) {
		super(emitter);
		this._statement = statement;
	}

	override function emit () : void {
		this._emitter._emit("throw ", this._statement.getToken());
		this._emitter._getExpressionEmitterFor(this._statement.getExpr()).emit(0);
		this._emitter._emit(";\n", null);
	}

}

class _AssertStatementEmitter extends _StatementEmitter {

	var _statement : AssertStatement;

	function constructor (emitter : JavaScriptEmitter, statement : AssertStatement) {
		super(emitter);
		this._statement = statement;
	}

	override function emit () : void {
		var condExpr = this._statement._expr;
		if (this._statement._msgExpr != null) {
			this._emitter._emitAssertionWithMsg(function () {
				this._emitter._getExpressionEmitterFor(condExpr).emit(0);
			}, condExpr.getToken(), "assertion failure", this._statement._msgExpr);
		} else {
			this._emitter._emitAssertion(function () {
				this._emitter._getExpressionEmitterFor(condExpr).emit(0);
			}, condExpr.getToken(), "assertion failure");
		}
	}

}

class _LogStatementEmitter extends _StatementEmitter {

	var _statement : LogStatement;

	function constructor (emitter : JavaScriptEmitter, statement : LogStatement) {
		super(emitter);
		this._statement = statement;
	}

	override function emit () : void {
		this._emitter._emit("console.log(", this._statement.getToken());
		var exprs = this._statement.getExprs();
		for (var i = 0; i < exprs.length; ++i) {
			if (i != 0)
				this._emitter._emit(", ", null);
			this._emitter._getExpressionEmitterFor(exprs[i]).emit(0);
		}
		this._emitter._emit(");\n", null);
	}

}

class _DebuggerStatementEmitter extends _StatementEmitter {

	var _statement : DebuggerStatement;

	function constructor (emitter : JavaScriptEmitter, statement : DebuggerStatement) {
		super(emitter);
		this._statement = statement;
	}

	override function emit () : void {
		this._emitter._emit("debugger;\n", this._statement.getToken());
	}

}

// expression emitter

abstract class _ExpressionEmitter {

	var _emitter : JavaScriptEmitter;

	function constructor (emitter : JavaScriptEmitter) {
		this._emitter = emitter;
	}

	abstract function emit (outerOpPrecedence : number) : void;

	function emitWithPrecedence (outerOpPrecedence : number, precedence : number, callback : function():void) : void {
		_Util.emitWithPrecedence(this._emitter, outerOpPrecedence, precedence, callback);
	}

}

class _LocalExpressionEmitter extends _ExpressionEmitter {

	var _expr : LocalExpression;

	function constructor (emitter : JavaScriptEmitter, expr : LocalExpression) {
		super(emitter);
		this._expr = expr;
	}

	override function emit (outerOpPrecedence : number) : void {
		var local = this._expr.getLocal();
		this._emitter._emit(this._emitter.getNamer().getNameOfLocalVariable(local), this._expr.getToken());
	}

}

class _ClassExpressionEmitter extends _ExpressionEmitter {

	var _expr : ClassExpression;

	function constructor (emitter : JavaScriptEmitter, expr : ClassExpression) {
		super(emitter);
		this._expr = expr;
	}

	override function emit (outerOpPrecedence : number) : void {
		var type = this._expr.getType();
		this._emitter._emit(this._emitter.getNamer().getNameOfClass(type.getClassDef()), null);
	}

}

class _NullExpressionEmitter extends _ExpressionEmitter {

	var _expr : NullExpression;

	function constructor (emitter : JavaScriptEmitter, expr : NullExpression) {
		super(emitter);
		this._expr = expr;
	}

	override function emit (outerOpPrecedence : number) : void {
		var token = this._expr.getToken();
		this._emitter._emit("null", token);
	}

}

class _BooleanLiteralExpressionEmitter extends _ExpressionEmitter {

	var _expr : BooleanLiteralExpression;

	function constructor (emitter : JavaScriptEmitter, expr : BooleanLiteralExpression) {
		super(emitter);
		this._expr = expr;
	}

	override function emit (outerOpPrecedence : number) : void {
		var token = this._expr.getToken();
		this._emitter._emit(token.getValue(), token);
	}

}

class _IntegerLiteralExpressionEmitter extends _ExpressionEmitter {

	var _expr : IntegerLiteralExpression;

	function constructor (emitter : JavaScriptEmitter, expr : IntegerLiteralExpression) {
		super(emitter);
		this._expr = expr;
	}

	override function emit (outerOpPrecedence : number) : void {
		var token = this._expr.getToken();
		this._emitter._emit("" + token.getValue(), token);
	}

}

// also emits LineMacroExpression
class _NumberLiteralExpressionEmitter extends _ExpressionEmitter {

	var _expr : NumberLiteralExpression;

	function constructor (emitter : JavaScriptEmitter, expr : NumberLiteralExpression) {
		super(emitter);
		this._expr = expr;
	}

	override function emit (outerOpPrecedence : number) : void {
		var str = _Util.getECMA262NumberLiteral(this._expr);
		if (outerOpPrecedence == _PropertyExpressionEmitter._operatorPrecedence && str.indexOf(".") == -1) {
			this._emitter._emit("(" + str + ")", this._expr.getToken());
		} else {
			this._emitter._emit("" + str, this._expr.getToken());
		}
	}

}

// also emits FileMacroExpression
class _StringLiteralExpressionEmitter extends _ExpressionEmitter {

	var _expr : StringLiteralExpression;

	function constructor (emitter : JavaScriptEmitter, expr : StringLiteralExpression) {
		super(emitter);
		this._expr = expr;
	}

	override function emit (outerOpPrecedence : number) : void {
		var token = this._expr.getToken();
		this._emitter._emit(_Util.getECMA262StringLiteral(this._expr), token);
	}

}

class _RegExpLiteralExpressionEmitter extends _ExpressionEmitter {

	var _expr : RegExpLiteralExpression;

	function constructor (emitter : JavaScriptEmitter, expr : RegExpLiteralExpression) {
		super(emitter);
		this._expr = expr;
	}

	override function emit (outerOpPrecedence : number) : void {
		var token = this._expr.getToken();
		this._emitter._emit(token.getValue(), token);
	}

}

class _ArrayLiteralExpressionEmitter extends _ExpressionEmitter {

	var _expr : ArrayLiteralExpression;

	function constructor (emitter : JavaScriptEmitter, expr : ArrayLiteralExpression) {
		super(emitter);
		this._expr = expr;
	}

	override function emit (outerOpPrecedence : number) : void {
		this._emitter._emit("[ ", null);
		var exprs = this._expr.getExprs();
		var exprType = _Util.getElementTypeOfCompoundType(this._expr.getType());
		for (var i = 0; i < exprs.length; ++i) {
			if (i != 0)
				this._emitter._emit(", ", null);
			this._emitter._emitRHSOfAssignment(exprs[i], exprType);
		}
		this._emitter._emit(" ]", null);
	}

}

class _MapLiteralExpressionEmitter extends _ExpressionEmitter {

	var _expr : MapLiteralExpression;

	function constructor (emitter : JavaScriptEmitter, expr : MapLiteralExpression) {
		super(emitter);
		this._expr = expr;
	}

	override function emit (outerOpPrecedence : number) : void {
		this._emitter._emit("({ ", null);
		var elements = this._expr.getElements();
		var elementType = _Util.getElementTypeOfCompoundType(this._expr.getType());
		for (var i = 0; i < elements.length; ++i) {
			var element = elements[i];
			if (i != 0)
				this._emitter._emit(", ", null);
			this._emitter._emit(element.getKey().getValue(), element.getKey());
			this._emitter._emit(": ", null);
			this._emitter._emitRHSOfAssignment(element.getExpr(), elementType);
		}
		this._emitter._emit(" })", null);
	}

}

class _ThisExpressionEmitter extends _ExpressionEmitter {

	var _expr : ThisExpression;

	function constructor (emitter : JavaScriptEmitter, expr : ThisExpression) {
		super(emitter);
		this._expr = expr;
	}

	override function emit (outerOpPrecedence : number) : void {
		var emittingFunction = this._emitter._emittingFunction;
		if (emittingFunction.getParent() != null)
			this._emitter._emit("$this", this._expr.getToken());
		else
			this._emitter._emit("this", this._expr.getToken());
	}

}

class _AsExpressionEmitter extends _ExpressionEmitter {

	var _expr : AsExpression;

	function constructor (emitter : JavaScriptEmitter, expr : AsExpression) {
		super(emitter);
		this._expr = expr;
	}

	override function emit (outerOpPrecedence : number) : void {
		var srcType = this._expr.getExpr().getType();
		var destType = this._expr.getType();
		if (srcType instanceof ObjectType || srcType.equals(Type.variantType)) {
			if (srcType.isConvertibleTo(destType)) {
				this._emitter._getExpressionEmitterFor(this._expr.getExpr()).emit(outerOpPrecedence);
				return;
			}
			if (destType instanceof ObjectType || destType instanceof FunctionType) {
				// unsafe cast
				new _AsNoConvertExpressionEmitter(this._emitter, new AsNoConvertExpression(this._expr.getToken(), this._expr.getExpr(), this._expr.getType())).emit(outerOpPrecedence);
				return;
			}
		}
		if (srcType.resolveIfNullable().equals(Type.booleanType)) {
			// from boolean
			if (destType.equals(Type.integerType) || destType.equals(Type.numberType)) {
				var prec = _UnaryExpressionEmitter._operatorPrecedence["+"];
				this._emitWithParens(outerOpPrecedence, prec, prec, "+", null);
				return;
			}
			if (destType.equals(Type.stringType)) {
				var prec = _AdditiveExpressionEmitter._operatorPrecedence;
				this._emitWithParens(outerOpPrecedence, prec, prec, null, " + \"\"");
				return;
			}
		}
		if (srcType.resolveIfNullable().equals(Type.integerType)) {
			// from integer
			if (destType.equals(Type.booleanType)) {
				var prec = _UnaryExpressionEmitter._operatorPrecedence["!"];
				this._emitWithParens(outerOpPrecedence, prec, prec, "!! ", null);
				return;
			}
			if (destType.equals(Type.numberType)) {
				this._emitter._getExpressionEmitterFor(this._expr.getExpr()).emit(outerOpPrecedence);
				return;
			}
			if (destType.equals(Type.stringType)) {
				var prec = _AdditiveExpressionEmitter._operatorPrecedence;
				this._emitWithParens(outerOpPrecedence, prec, prec, null, " + \"\"");
				return;
			}
		}
		if (srcType.resolveIfNullable().equals(Type.numberType)) {
			// from number
			if (destType.equals(Type.booleanType)) {
				var prec = _UnaryExpressionEmitter._operatorPrecedence["!"];
				this._emitWithParens(outerOpPrecedence, prec, prec, "!! ", null);
				return;
			}
			if (destType.equals(Type.integerType)) {
				var prec = _BinaryNumberExpressionEmitter._operatorPrecedence["|"];
				this._emitWithParens(outerOpPrecedence, prec, prec, null, " | 0");
				return;
			}
			if (destType.equals(Type.stringType)) {
				var prec = _AdditiveExpressionEmitter._operatorPrecedence;
				this._emitWithParens(outerOpPrecedence, prec, prec, null, " + \"\"");
				return;
			}
		}
		if (srcType.resolveIfNullable().equals(Type.stringType)) {
			// from string
			if (destType.equals(Type.booleanType)) {
				var prec = _UnaryExpressionEmitter._operatorPrecedence["!"];
				this._emitWithParens(outerOpPrecedence, prec, prec, "!! ", null);
				return;
			}
			if (destType.equals(Type.integerType)) {
				var prec = _BinaryNumberExpressionEmitter._operatorPrecedence["|"];
				this._emitWithParens(outerOpPrecedence, prec, prec, null, " | 0");
				return;
			}
			if (destType.equals(Type.numberType)) {
				var prec = _UnaryExpressionEmitter._operatorPrecedence["+"];
				this._emitWithParens(outerOpPrecedence, prec, prec, "+", null);
				return;
			}
		}
		if (srcType.equals(Type.variantType)) {
			// from variant
			if (destType.equals(Type.booleanType)) {
				var prec = _UnaryExpressionEmitter._operatorPrecedence["!"];
				this._emitWithParens(outerOpPrecedence, prec, prec, "!! ", null);
				return;
			}
			if (destType.equals(Type.integerType)) {
				var prec = _BinaryNumberExpressionEmitter._operatorPrecedence["|"];
				this._emitWithParens(outerOpPrecedence, prec, prec, null, " | 0");
				return;
			}
			if (destType.equals(Type.numberType)) {
				var prec = _UnaryExpressionEmitter._operatorPrecedence["+"];
				this._emitWithParens(outerOpPrecedence, prec, prec, "+", null);
				return;
			}
			if (destType.equals(Type.stringType)) {
				var prec = _AdditiveExpressionEmitter._operatorPrecedence;
				this._emitWithParens(outerOpPrecedence, prec, prec, null, " + \"\"");
				return;
			}
		}
		if (srcType.isConvertibleTo(destType)) {
			// can perform implicit conversion
			if (srcType instanceof NullableType) {
				this._emitter._emitWithNullableGuard(this._expr.getExpr(), outerOpPrecedence);
			} else {
				this._emitter._getExpressionEmitterFor(this._expr.getExpr()).emit(outerOpPrecedence);
			}
			return;
		}
		throw new Error("explicit conversion logic unknown from " + srcType.toString() + " to " + destType.toString());
	}

	function _emitWithParens (outerOpPrecedence : number, opPrecedence : number, innerOpPrecedence : number, prefix : Nullable.<string>, postfix : Nullable.<string>) : void {
		// in contrast to _ExpressionEmitter#emitWithPrecedence the comparison op. is >=, since the conversion should have higher precedence than the outer op. (see t/run/110)
		if (opPrecedence >= outerOpPrecedence)
			this._emitter._emit("(", null);
		if (prefix != null)
			this._emitter._emit(prefix, this._expr.getToken());
		this._emitter._emitWithNullableGuard(this._expr.getExpr(), innerOpPrecedence);
		if (postfix != null)
			this._emitter._emit(postfix, this._expr.getToken());
		if (opPrecedence >= outerOpPrecedence)
			this._emitter._emit(")", null);
	}

}

class _AsNoConvertExpressionEmitter extends _ExpressionEmitter {

	var _expr : AsNoConvertExpression;

	function constructor (emitter : JavaScriptEmitter, expr : AsNoConvertExpression) {
		super(emitter);
		this._expr = expr;
	}

	override function emit (outerOpPrecedence : number) : void {
		if (this._emitter._enableRunTimeTypeCheck) {
			var emitWithAssertion = function (emitCheckExpr : () -> void, message : string) : void {
				var token = this._expr.getToken();
				this._emitter._emit("(function ($v) {\n", token);
				this._emitter._advanceIndent();
				this._emitter._emitAssertion(emitCheckExpr, token, message);
				this._emitter._emit("return $v;\n", token);
				this._emitter._reduceIndent();
				this._emitter._emit("}(", token);
				this._emitter._getExpressionEmitterFor(this._expr.getExpr()).emit(0);
				this._emitter._emit("))", token);
			};
			var srcType = this._expr.getExpr().getType();
			var destType = this._expr.getType();
			if (srcType.equals(destType) || srcType.equals(destType.resolveIfNullable())) {
				// skip
			} else if (destType instanceof VariantType) {
				// skip
			} else if (srcType instanceof ObjectType && srcType.isConvertibleTo(destType)) {
				// skip
			} else if (destType.equals(Type.booleanType)) {
				emitWithAssertion(function () {
					this._emitter._emit("typeof $v === \"boolean\"", this._expr.getToken());
				}, "detected invalid cast, value is not a boolean");
				return;
			} else if (destType.resolveIfNullable().equals(Type.booleanType)) {
				emitWithAssertion(function () {
					this._emitter._emit("$v == null || typeof $v === \"boolean\"", this._expr.getToken());
				}, "detected invalid cast, value is not a boolean nor null");
				return;
			} else if (destType.equals(Type.numberType)) {
				emitWithAssertion(function () {
					this._emitter._emit("typeof $v === \"number\"", this._expr.getToken());
				}, "detected invalid cast, value is not a number");
				return;
			} else if (destType.resolveIfNullable().equals(Type.numberType)) {
				emitWithAssertion(function () {
					this._emitter._emit("$v == null || typeof $v === \"number\"", this._expr.getToken());
				}, "detected invalid cast, value is not a number nor nullable");
				return;
			} else if (destType.equals(Type.integerType)) {
				emitWithAssertion(function () {
					this._emitter._emit("typeof $v === \"number\" && (! $__jsx_isFinite($v) || $v % 1 === 0)", this._expr.getToken());
				}, "detected invalid cast, value is not an int");
				return;
			} else if (destType.resolveIfNullable().equals(Type.integerType)) {
				emitWithAssertion(function () {
					this._emitter._emit("$v == null || typeof $v === \"number\" && (! $__jsx_isFinite($v) || $v % 1 === 0)", this._expr.getToken());
				}, "detected invalid cast, value is not an int nor null");
				return;
			} else if (destType.equals(Type.stringType)) {
				emitWithAssertion(function () {
					this._emitter._emit("typeof $v === \"string\"", this._expr.getToken());
				}, "detected invalid cast, value is not a string");
				return;
			} else if (destType.resolveIfNullable().equals(Type.stringType)) {
				emitWithAssertion(function () {
					this._emitter._emit("$v == null || typeof $v === \"string\"", this._expr.getToken());
				}, "detected invalid cast, value is not a string nor null");
				return;
			} else if (destType instanceof FunctionType) {
				emitWithAssertion(function () {
					this._emitter._emit("$v == null || typeof $v === \"function\"", this._expr.getToken());
				}, "detected invalid cast, value is not a function or null");
				return;
			} else if (destType instanceof ObjectType) {
				var destClassDef = destType.getClassDef();
				if ((destClassDef.flags() & ClassDefinition.IS_FAKE) != 0) {
					// skip
				} else if (_Util.isArrayType(destType)) {
					emitWithAssertion(function () {
						this._emitter._emit("$v == null || $v instanceof Array", this._expr.getToken());
					}, "detected invalid cast, value is not an Array or null");
					return;
				} else if (destClassDef instanceof InstantiatedClassDefinition && (destClassDef as InstantiatedClassDefinition).getTemplateClassName() == "Map") {
					if (srcType.equals(Type.variantType)) {
						// variant which is "typeof function" may be converted to a Map.<variant> ("function" cannot be rejected, since the origin of the object may be javascript code)
						emitWithAssertion(function () {
							this._emitter._emit("$v == null || typeof $v === \"object\" || typeof $v === \"function\"", this._expr.getToken());
						}, "detected invalid cast, value is not a Map or null");
					} else {
						emitWithAssertion(function () {
							this._emitter._emit("$v == null || typeof $v === \"object\"", this._expr.getToken());
						}, "detected invalid cast, value is not a Map or null");
					}
					return;
				} else if ((destClassDef.flags() & (ClassDefinition.IS_INTERFACE | ClassDefinition.IS_MIXIN)) == 0) {
					emitWithAssertion(function () {
						this._emitter._emit("$v == null || $v instanceof " + this._emitter.getNamer().getNameOfClass(destClassDef), this._expr.getToken());
					}, "detected invalid cast, value is not an instance of the designated type or null");
					return;
				} else {
					emitWithAssertion(function () {
						this._emitter._emit("$v == null || $v.$__jsx_implements_" + this._emitter.getNamer().getNameOfClass(destClassDef), this._expr.getToken());
					}, "detected invalid cast, value is not an instance of the designated type or null");
					return;
				}
			} else {
				throw new Error("Hmm");
			}
		}
		this._emitter._getExpressionEmitterFor(this._expr.getExpr()).emit(outerOpPrecedence);
		return;
	}

}

abstract class _OperatorExpressionEmitter extends _ExpressionEmitter {

	function constructor (emitter : JavaScriptEmitter) {
		super(emitter);
	}

	override function emit (outerOpPrecedence : number) : void {
		this.emitWithPrecedence(outerOpPrecedence, this._getPrecedence(), function () { this._emit(); });
	}

	function _emit () : void {
	}

	abstract function _getPrecedence () : number;

}

class _UnaryExpressionEmitter extends _OperatorExpressionEmitter {

	var _expr : UnaryExpression;

	function constructor (emitter : JavaScriptEmitter, expr : UnaryExpression) {
		super(emitter);
		this._expr = expr;
	}

	override function _emit () : void {
		var opToken = this._expr.getToken();
		this._emitter._emit(opToken.getValue() + " ", opToken);
		this._emitter._getExpressionEmitterFor(this._expr.getExpr()).emit(this._getPrecedence());
	}

	override function _getPrecedence () : number {
		return _UnaryExpressionEmitter._operatorPrecedence[this._expr.getToken().getValue()];
	}

	static const _operatorPrecedence = new Map.<number>;

	static function _setOperatorPrecedence (op : string, precedence : number) : void {
		_UnaryExpressionEmitter._operatorPrecedence[op] = precedence;
	}

}

class _PreIncrementExpressionEmitter extends _UnaryExpressionEmitter {

	function constructor(emitter : JavaScriptEmitter, expr : PreIncrementExpression) {
		super(emitter, expr);
	}

	override function emit(outerOpPrecedence : number) : void {
		var opToken = this._expr.getToken();
		if (this._expr.getType().resolveIfNullable().equals(Type.integerType)) {
			if (this._expr.getExpr().hasSideEffects()) {
				_Util.emitFusedIntOpWithSideEffects(this._emitter, opToken.getValue() == "++" ? "$__jsx_ipadd" : "$__jsx_ipsub", this._expr.getExpr(), function (outerPred) {
					this._emitter._emit("1", opToken);
				}, 0);
			} else {
				this.emitWithPrecedence(outerOpPrecedence, _AssignmentExpressionEmitter._operatorPrecedence["="], function () {
					this._emitter._getExpressionEmitterFor(this._expr.getExpr()).emit(_AssignmentExpressionEmitter._operatorPrecedence["="]);
					this._emitter._emit(" = (", this._expr.getToken());
					this._emitter._getExpressionEmitterFor(this._expr.getExpr()).emit(_AdditiveExpressionEmitter._operatorPrecedence);
					this._emitter._emit(" " + opToken.getValue().charAt(0) + " 1) | 0", this._expr.getToken());
				});
			}
		} else {
			this.emitWithPrecedence(outerOpPrecedence, this._getPrecedence(), function () {
				this._emitter._emit(opToken.getValue(), opToken);
				this._emitter._getExpressionEmitterFor(this._expr.getExpr()).emit(this._getPrecedence());
			});
		}
	}

	override function _getPrecedence() : number {
		return _PreIncrementExpressionEmitter._operatorPrecedence[this._expr.getToken().getValue()];
	}

	static const _operatorPrecedence = new Map.<number>;

	static function _setOperatorPrecedence(op : string, precedence : number) : void {
		_PreIncrementExpressionEmitter._operatorPrecedence[op] = precedence;
	}

}

class _PostIncrementExpressionEmitter extends _UnaryExpressionEmitter {

	function constructor (emitter : JavaScriptEmitter, expr : PostIncrementExpression) {
		super(emitter, expr);
	}

	override function emit (outerOpPrecedence : number) : void {
		var opToken = this._expr.getToken();
		if (this._expr.getType().resolveIfNullable().equals(Type.integerType)) {
			if (this._expr.getExpr().hasSideEffects()) {
				_Util.emitFusedIntOpWithSideEffects(this._emitter, opToken.getValue() == "++" ? "$__jsx_ippostinc" : "$__jsx_ippostdec", this._expr.getExpr(), function (outerPred) {
					this._emitter._emit("1", opToken);
				}, 0);
			} else {
				this._emitter._emit("(" + _PostIncrementExpressionEmitter.TEMP_VAR_NAME + " = ", this._expr.getToken());
				this._emitter._getExpressionEmitterFor(this._expr.getExpr()).emit(_AssignmentExpressionEmitter._operatorPrecedence["="]);
				this._emitter._emit(", ", this._expr.getToken());
				this._emitter._getExpressionEmitterFor(this._expr.getExpr()).emit(_AssignmentExpressionEmitter._operatorPrecedence["="]);
				this._emitter._emit(" = (" + _PostIncrementExpressionEmitter.TEMP_VAR_NAME + " " + opToken.getValue().charAt(0) + " 1) | 0, " + _PostIncrementExpressionEmitter.TEMP_VAR_NAME + ")", this._expr.getToken());
			}
		} else {
			this.emitWithPrecedence(outerOpPrecedence, this._getPrecedence(), function () {
				this._emitter._getExpressionEmitterFor(this._expr.getExpr()).emit(this._getPrecedence());
				this._emitter._emit(opToken.getValue(), opToken);
			});
		}
	}

	override function _getPrecedence () : number {
		return _PostIncrementExpressionEmitter._operatorPrecedence[this._expr.getToken().getValue()];
	}

	static const _operatorPrecedence = new Map.<number>;

	static function _setOperatorPrecedence (op : string, precedence : number) : void {
		_PostIncrementExpressionEmitter._operatorPrecedence[op] = precedence;
	}

	static const TEMP_VAR_NAME = "$__jsx_postinc_t";

	static function needsTempVarFor(expr : PostIncrementExpression) : boolean {
		return expr.getType().resolveIfNullable().equals(Type.integerType)
			&& ! expr.getExpr().hasSideEffects();
	}

}

class _InstanceofExpressionEmitter extends _ExpressionEmitter {

	var _expr : InstanceofExpression;

	function constructor (emitter : JavaScriptEmitter, expr : InstanceofExpression) {
		super(emitter);
		this._expr = expr;
	}

	override function emit (outerOpPrecedence : number) : void {
		var expectedType = this._expr.getExpectedType();
		assert expectedType.getClassDef() != null;
		if (_Util.isArrayType(expectedType)) {
			this.emitWithPrecedence(outerOpPrecedence, _InstanceofExpressionEmitter._operatorPrecedence, function () {
				this._emitter._getExpressionEmitterFor(this._expr.getExpr()).emit(_InstanceofExpressionEmitter._operatorPrecedence);
				this._emitter._emit(" instanceof Array", this._expr.getToken());
			});
		} else if (expectedType.getClassDef() instanceof InstantiatedClassDefinition && (expectedType.getClassDef() as InstantiatedClassDefinition).getTemplateClassName() == "Map") {
			this.emitWithPrecedence(outerOpPrecedence, _InstanceofExpressionEmitter._operatorPrecedence, function () {
				this._emitter._emit("(typeof(", this._expr.getToken());
				this._emitter._getExpressionEmitterFor(this._expr.getExpr()).emit(_InstanceofExpressionEmitter._operatorPrecedence);
				this._emitter._emit(") === \"object\")", this._expr.getToken());
			});
		} else if ((expectedType.getClassDef().flags() & (ClassDefinition.IS_INTERFACE | ClassDefinition.IS_MIXIN)) == 0) {
			this.emitWithPrecedence(outerOpPrecedence, _InstanceofExpressionEmitter._operatorPrecedence, (function () {
				this._emitter._getExpressionEmitterFor(this._expr.getExpr()).emit(_InstanceofExpressionEmitter._operatorPrecedence);
				this._emitter._emit(" instanceof " + this.getInstanceofNameFromClassDef(expectedType.getClassDef()), this._expr.getToken());
			}));
		} else {
			this.emitWithPrecedence(outerOpPrecedence, _CallExpressionEmitter._operatorPrecedence, (function () {
				this._emitter._emit("(function (o) { return !! (o && o.$__jsx_implements_" + this._emitter.getNamer().getNameOfClass(expectedType.getClassDef()) + "); })(", this._expr.getToken());
				this._emitter._getExpressionEmitterFor(this._expr.getExpr()).emit(0);
				this._emitter._emit(")", this._expr.getToken());
			}));
		}
	}

	function getInstanceofNameFromClassDef (classDef : ClassDefinition) : string {
		if (classDef instanceof InstantiatedClassDefinition) {
			var name = (classDef as InstantiatedClassDefinition).getTemplateClassName();
			if (name == "Map")
				name = "Object";
		} else {
			// NOTE: uses namer, thus the emission is counted for minification
			name = this._emitter.getNamer().getNameOfClass(classDef);
		}
		return name;
	}

	static var _operatorPrecedence = 0;

	static function _setOperatorPrecedence (op : string, precedence : number) : void {
		_InstanceofExpressionEmitter._operatorPrecedence = precedence;
	}

}

class _PropertyExpressionEmitter extends _UnaryExpressionEmitter {

	function constructor (emitter : JavaScriptEmitter, expr : PropertyExpression) {
		super(emitter, expr);
	}

	override function _emit () : void {
		var expr = this._expr as PropertyExpression;
		var exprType = expr.getType();
		var identifierToken = expr.getIdentifierToken();
		// replace methods to global function (e.g. Number.isNaN to isNaN)
		if (expr.getExpr().isClassSpecifier()
			&& expr.getExpr().getType().getClassDef() == Type.numberType.getClassDef()) {
			switch (identifierToken.getValue()) {
			case "parseInt":
			case "parseFloat":
			case "isNaN":
			case "isFinite":
				this._emitter._emit('$__jsx_' + identifierToken.getValue(), identifierToken);
				return;
			}
		}
		else if (expr.getExpr().isClassSpecifier()
			&& expr.getExpr().getType().getClassDef() == Type.stringType.getClassDef()) {
			switch (identifierToken.getValue()) {
			case "encodeURIComponent":
			case "decodeURIComponent":
			case "encodeURI":
			case "decodeURI":
				this._emitter._emit('$__jsx_' + identifierToken.getValue(), identifierToken);
				return;
			}
		}

		// emit, depending on the type
		var classDef = expr.getHolderType().getClassDef();
		if (expr.getExpr().isClassSpecifier()) {
			var name = identifierToken.getValue();
			if (Util.isReferringToFunctionDefinition(expr)) {
				name = this._emitter.getNamer().getNameOfStaticFunction(classDef, name, (exprType as ResolvedFunctionType).getArgumentTypes());
			} else {
				name = this._emitter.getNamer().getNameOfClass(classDef) + "." + this._emitter.getNamer().getNameOfStaticVariable(classDef, name);
			}
			this._emitter._emit(name, identifierToken);
		} else {
			var name = identifierToken.getValue();
			if (Util.isReferringToFunctionDefinition(expr)) {
				assert exprType instanceof ResolvedFunctionType, exprType.toString();
				name = this._emitter.getNamer().getNameOfMethod(classDef, name, (exprType as ResolvedFunctionType).getArgumentTypes());
			} else {
				name = this._emitter.getNamer().getNameOfProperty(classDef, name);
			}
			this._emitter._getExpressionEmitterFor(expr.getExpr()).emit(this._getPrecedence());
			this._emitter._emit("." + name, identifierToken);
		}
	}

	override function _getPrecedence () : number {
		return _PropertyExpressionEmitter._operatorPrecedence;
	}

	static var _operatorPrecedence = 0;

	static function _setOperatorPrecedence (op : string, precedence : number) : void {
		_PropertyExpressionEmitter._operatorPrecedence = precedence;
	}

}

class _FunctionExpressionEmitter extends _OperatorExpressionEmitter {

	var _expr : FunctionExpression;

	function constructor (emitter : JavaScriptEmitter, expr : FunctionExpression) {
		super(emitter);
		this._expr = expr;
	}

	override function _emit () : void {
		var funcDef = this._expr.getFuncDef();
		this._emitter._emit("(", funcDef.getToken());
		var funcLocal = funcDef.getFuncLocal();
		this._emitter.getNamer().enterScope(funcLocal, function () {
			this._emitter._emit("function " + (funcDef.isGenerator() ? "* " : "") + (funcLocal != null ? this._emitter.getNamer().getNameOfLocalVariable(funcLocal) : "") + "(", funcDef.getToken());
			this._emitter.getNamer().enterFunction(funcDef, function () {
				var args = funcDef.getArguments();
				for (var i = 0; i < args.length; ++i) {
					if (i != 0)
						this._emitter._emit(", ", funcDef.getToken());
					this._emitter._emit(this._emitter.getNamer().getNameOfLocalVariable(args[i]), funcDef.getToken());
				}
				this._emitter._emit(") {\n", funcDef.getToken());
				this._emitter._advanceIndent();
				this._emitter._emitFunctionBody(funcDef);
				this._emitter._reduceIndent();
				this._emitter._emit("}", funcDef.getToken());
			});
		});
		this._emitter._emit(")", funcDef.getToken());
	}

	override function _getPrecedence () : number {
		return _FunctionExpressionEmitter._operatorPrecedence;
	}

	static var _operatorPrecedence = 0;

	static function _setOperatorPrecedence (op : string, precedence : number) : void {
		_FunctionExpressionEmitter._operatorPrecedence = precedence;
	}

}

class _AdditiveExpressionEmitter extends _OperatorExpressionEmitter {

	var _expr : AdditiveExpression;

	function constructor (emitter : JavaScriptEmitter, expr : AdditiveExpression) {
		super(emitter);
		this._expr = expr;
	}

	override function _emit () : void {
		var isInt = this._expr.getType().resolveIfNullable().equals(Type.integerType);
		if (isInt) {
			this._emitter._emit("((", this._expr.getToken());
		}
		this._emitter._emitWithNullableGuard(this._expr.getFirstExpr(), _AdditiveExpressionEmitter._operatorPrecedence);
		this._emitter._emit(" + ", this._expr.getToken());
		this._emitter._emitWithNullableGuard(this._expr.getSecondExpr(), _AdditiveExpressionEmitter._operatorPrecedence - 1);
		if (isInt) {
			this._emitter._emit(") | 0)", this._expr.getToken());
		}
	}

	override function _getPrecedence () : number {
		return _AdditiveExpressionEmitter._operatorPrecedence;
	}

	static var _operatorPrecedence = 0;

	static function _setOperatorPrecedence (op : string, precedence : number) : void {
		_AdditiveExpressionEmitter._operatorPrecedence = precedence;
	}

}

class _AssignmentExpressionEmitter extends _OperatorExpressionEmitter {

	var _expr : AssignmentExpression;

	function constructor (emitter : JavaScriptEmitter, expr : AssignmentExpression) {
		super(emitter);
		this._expr = expr;
	}

	override function _emit () : void {
		var op = this._expr.getToken().getValue();
		this._emitter._getExpressionEmitterFor(this._expr.getFirstExpr()).emit(this._getPrecedence());
		this._emitter._emit(" " + op + " ", this._expr.getToken());
		this._emitter._emitRHSOfAssignment(this._expr.getSecondExpr(), this._expr.getFirstExpr().getType());
	}

	override function _getPrecedence () : number {
		return _AssignmentExpressionEmitter._operatorPrecedence[this._expr.getToken().getValue()];
	}

	static const _operatorPrecedence = new Map.<number>;

	static function _setOperatorPrecedence (op : string, precedence : number) : void {
		_AssignmentExpressionEmitter._operatorPrecedence[op] = precedence;
	}

}

class _FusedAssignmentExpressionEmitter extends _OperatorExpressionEmitter {

	static const _fusedIntHelpers = {
		"+": "$__jsx_ipadd",
		"-": "$__jsx_ipsub",
		"*": "$__jsx_ipmul",
		"/": "$__jsx_ipdiv",
		"%": "$__jsx_ipmod"
	};

	var _expr : FusedAssignmentExpression;

	function constructor (emitter : JavaScriptEmitter, expr : FusedAssignmentExpression) {
		super(emitter);
		this._expr = expr;
	}

	override function emit (outerOpPrecedence : number) : void {
		var coreOp = this._expr.getToken().getValue().charAt(0);
		if (_FusedAssignmentExpressionEmitter._fusedIntHelpers[coreOp] != null
			&& this._expr.getFirstExpr().getType().resolveIfNullable().equals(Type.integerType)) {
			if (this._expr.getFirstExpr().hasSideEffects()) {
				_Util.emitFusedIntOpWithSideEffects(this._emitter, _FusedAssignmentExpressionEmitter._fusedIntHelpers[coreOp], this._expr.getFirstExpr(), function (outerPred) {
					this._emitter._emitWithNullableGuard(this._expr.getSecondExpr(), outerPred);
				}, outerOpPrecedence);
			} else {
				// dealt as l = (l op r) | 0, or use imul
				_Util.emitWithPrecedence(this._emitter, outerOpPrecedence, _AssignmentExpressionEmitter._operatorPrecedence["="], function () {
					this._emitter._getExpressionEmitterFor(this._expr.getFirstExpr()).emit(_AssignmentExpressionEmitter._operatorPrecedence["="]);
					if (coreOp == "*") {
						this._emitter._emit(" = $__jsx_imul(", this._expr.getToken());
						this._emitter._emitWithNullableGuard(this._expr.getFirstExpr(), 0);
						this._emitter._emit(", ", this._expr.getToken());
						this._emitter._emitWithNullableGuard(this._expr.getSecondExpr(), 0);
						this._emitter._emit(")", this._expr.getToken());
					} else {
						var coreOpPrecedence = coreOp == "+" ? _AdditiveExpressionEmitter._operatorPrecedence : _BinaryNumberExpressionEmitter._operatorPrecedence[coreOp];
						this._emitter._emit(" = (", this._expr.getToken());
						this._emitter._emitWithNullableGuard(this._expr.getFirstExpr(), coreOpPrecedence);
						this._emitter._emit(" " + coreOp + " ", this._expr.getToken());
						this._emitter._emitWithNullableGuard(this._expr.getSecondExpr(), coreOpPrecedence - 1);
						this._emitter._emit(") | 0", this._expr.getToken());
					}
				});
			}
			return;
		}
		// normal handling
		super.emit(outerOpPrecedence);
	}

	override function _emit () : void {
		var op = this._expr.getToken().getValue();
		this._emitter._getExpressionEmitterFor(this._expr.getFirstExpr()).emit(this._getPrecedence());
		this._emitter._emit(" " + op + " ", this._expr.getToken());
		this._emitter._emitRHSOfAssignment(this._expr.getSecondExpr(), this._expr.getFirstExpr().getType());
	}

	override function _getPrecedence () : number {
		return _FusedAssignmentExpressionEmitter._operatorPrecedence[this._expr.getToken().getValue()];
	}

	static const _operatorPrecedence = new Map.<number>;

	static function _setOperatorPrecedence (op : string, precedence : number) : void {
		_FusedAssignmentExpressionEmitter._operatorPrecedence[op] = precedence;
	}

}

class _EqualityExpressionEmitter extends _OperatorExpressionEmitter {

	var _expr : EqualityExpression;

	function constructor (emitter : JavaScriptEmitter, expr : EqualityExpression) {
		super(emitter);
		this._expr = expr;
	}

	override function _emit () : void {
		var op = this._expr.getToken().getValue();
		var emitOp = op;
		// NOTE: works for cases where one side is an object and the other is the primitive counterpart
		var lhs = this._expr.getFirstExpr();
		var rhs = this._expr.getSecondExpr();
		if (lhs.getType() instanceof PrimitiveType && rhs.getType() instanceof PrimitiveType) {
			emitOp += "=";
		}
		else if (lhs.getType().resolveIfNullable() instanceof PrimitiveType && lhs.getType().resolveIfNullable().equals(rhs.getType().resolveIfNullable())) {
			// both are primitive types but either lhs or rhs is nullable
			emitOp += "=";
		}
		this._emitter._getExpressionEmitterFor(lhs).emit(_EqualityExpressionEmitter._operatorPrecedence[op] - 1);
		this._emitter._emit(" " + emitOp + " ", this._expr.getToken());
		this._emitter._getExpressionEmitterFor(rhs).emit(_EqualityExpressionEmitter._operatorPrecedence[op] - 1);
	}

	override function _getPrecedence () : number {
		return _EqualityExpressionEmitter._operatorPrecedence[this._expr.getToken().getValue()];
	}

	static const _operatorPrecedence = new Map.<number>;

	static function _setOperatorPrecedence (op : string, precedence : number) : void {
		_EqualityExpressionEmitter._operatorPrecedence[op] = precedence;
	}

}

class _InExpressionEmitter extends _OperatorExpressionEmitter {

	var _expr : InExpression;

	function constructor (emitter : JavaScriptEmitter, expr : InExpression) {
		super(emitter);
		this._expr = expr;
	}

	override function _emit () : void {
		this._emitter._emitWithNullableGuard(this._expr.getFirstExpr(), _InExpressionEmitter._operatorPrecedence);
		this._emitter._emit(" in ", this._expr.getToken());
		this._emitter._getExpressionEmitterFor(this._expr.getSecondExpr()).emit(_InExpressionEmitter._operatorPrecedence);
	}

	override function _getPrecedence () : number {
		return _InExpressionEmitter._operatorPrecedence;
	}

	static var _operatorPrecedence = 0;

	static function _setOperatorPrecedence (op : string, precedence : number) : void {
		_InExpressionEmitter._operatorPrecedence = precedence;
	}

}

class _LogicalExpressionEmitter extends _OperatorExpressionEmitter {

	var _expr : LogicalExpression;

	function constructor (emitter : JavaScriptEmitter, expr : LogicalExpression) {
		super(emitter);
		this._expr = expr;
	}

	override function emit (outerOpPrecedence : number) : void {
		if (this._emitter.shouldBooleanize(this._expr)) {
			// !! is faster than Boolean, see http://jsperf.com/boolean-vs-notnot
			this._emitter._emit("!! (", this._expr.getToken());
			super.emit(0);
			this._emitter._emit(")", this._expr.getToken());
			return;
		}
		// normal handling
		super.emit(outerOpPrecedence);
	}

	override function _emit () : void {
		var op = this._expr.getToken().getValue();
		this._emitter._getExpressionEmitterFor(this._expr.getFirstExpr()).emit(_LogicalExpressionEmitter._operatorPrecedence[op]);
		this._emitter._emit(" " + op + " ", this._expr.getToken());
		this._emitter._getExpressionEmitterFor(this._expr.getSecondExpr()).emit(_LogicalExpressionEmitter._operatorPrecedence[op] - 1);
	}

	override function _getPrecedence () : number {
		return _LogicalExpressionEmitter._operatorPrecedence[this._expr.getToken().getValue()];
	}

	static const _operatorPrecedence = new Map.<number>;

	static function _setOperatorPrecedence (op : string, precedence : number) : void {
		_LogicalExpressionEmitter._operatorPrecedence[op] = precedence;
	}

}

class _ShiftExpressionEmitter extends _OperatorExpressionEmitter {

	var _expr : ShiftExpression;

	function constructor (emitter : JavaScriptEmitter, expr : ShiftExpression) {
		super(emitter);
		this._expr = expr;
	}

	override function _emit () : void {
		var op = this._expr.getToken().getValue();
		this._emitter._emitWithNullableGuard(this._expr.getFirstExpr(), _ShiftExpressionEmitter._operatorPrecedence[op]);
		this._emitter._emit(" " + op + " ", this._expr.getToken());
		this._emitter._emitWithNullableGuard(this._expr.getSecondExpr(), _ShiftExpressionEmitter._operatorPrecedence[op] - 1);
	}

	override function _getPrecedence () : number {
		return _ShiftExpressionEmitter._operatorPrecedence[this._expr.getToken().getValue()];
	}

	static const _operatorPrecedence = new Map.<number>;

	static function _setOperatorPrecedence (op : string, precedence : number) : void {
		_ShiftExpressionEmitter._operatorPrecedence[op] = precedence;
	}

}

class _BinaryNumberExpressionEmitter extends _OperatorExpressionEmitter {

	static const _OPS_RETURNING_INT = {
		'&' : true,
		'|' : true,
		'^' : true
	};

	var _expr : BinaryNumberExpression;

	function constructor (emitter : JavaScriptEmitter, expr : BinaryNumberExpression) {
		super(emitter);
		this._expr = expr;
	}

	override function _emit () : void {
		var op = this._expr.getToken().getValue();
		var isInt = this._expr.getType().resolveIfNullable().equals(Type.integerType);
		// int*int requires special handling
		if (isInt && op == "*") {
			this._emitter._emit("$__jsx_imul(", this._expr.getToken());
			this._emitter._emitWithNullableGuard(this._expr.getFirstExpr(), 0);
			this._emitter._emit(", ", this._expr.getToken());
			this._emitter._emitWithNullableGuard(this._expr.getSecondExpr(), 0);
			this._emitter._emit(")", this._expr.getToken());
			return;
		}
		// normal handling
		var needsBitOr = isInt && ! _BinaryNumberExpressionEmitter._OPS_RETURNING_INT[op];
		if (needsBitOr) {
			this._emitter._emit("((", this._expr.getToken());
		}
		this._emitter._emitWithNullableGuard(this._expr.getFirstExpr(), _BinaryNumberExpressionEmitter._operatorPrecedence[op]);
		this._emitter._emit(" " + op + " ", this._expr.getToken());
		this._emitter._emitWithNullableGuard(this._expr.getSecondExpr(), _BinaryNumberExpressionEmitter._operatorPrecedence[op] - 1);
		if (needsBitOr) {
			this._emitter._emit(") | 0)", this._expr.getToken());
		}
	}

	function _emitIfEitherIs (outerOpPrecedence : number, cb : function(:Expression,:Expression):Expression) : boolean {
		var outcomeExpr;
		if ((outcomeExpr = cb(this._expr.getFirstExpr(), this._expr.getSecondExpr())) != null
			|| (outcomeExpr = cb(this._expr.getSecondExpr(), this._expr.getFirstExpr())) != null) {
			this._emitter._getExpressionEmitterFor(outcomeExpr).emit(outerOpPrecedence);
			return true;
		} else {
			return false;
		}
	}

	override function _getPrecedence () : number {
		return _BinaryNumberExpressionEmitter._operatorPrecedence[this._expr.getToken().getValue()];
	}

	static const _operatorPrecedence = new Map.<number>;

	static function _setOperatorPrecedence (op : string, precedence : number) : void {
		_BinaryNumberExpressionEmitter._operatorPrecedence[op] = precedence;
	}

}

class _ArrayExpressionEmitter extends _OperatorExpressionEmitter {

	var _expr : ArrayExpression;

	function constructor (emitter : JavaScriptEmitter, expr : ArrayExpression) {
		super(emitter);
		this._expr = expr;
	}

	override function _emit () : void {
		this._emitter._getExpressionEmitterFor(this._expr.getFirstExpr()).emit(_ArrayExpressionEmitter._operatorPrecedence);
		var secondExpr = this._expr.getSecondExpr();
		// property access using . is 4x faster on safari than using [], see http://jsperf.com/access-using-dot-vs-array
		var emitted = false;
		if (secondExpr instanceof StringLiteralExpression) {
			var propertyName = (secondExpr as StringLiteralExpression).getDecoded();
			if (_Util.nameIsValidAsProperty(propertyName)) {
				this._emitter._emit(".", this._expr.getToken());
				this._emitter._emit(propertyName, secondExpr.getToken());
				emitted = true;
			}
		}
		if (! emitted) {
			this._emitter._emit("[", this._expr.getToken());
			this._emitter._getExpressionEmitterFor(secondExpr).emit(0);
			this._emitter._emit("]", null);
		}
	}

	override function _getPrecedence () : number {
		return _ArrayExpressionEmitter._operatorPrecedence;
	}

	static var _operatorPrecedence = 0;

	static function _setOperatorPrecedence (op : string, precedence : number) : void {
		_ArrayExpressionEmitter._operatorPrecedence = precedence;
	}

}

class _ConditionalExpressionEmitter extends _OperatorExpressionEmitter {

	var _expr : ConditionalExpression;

	function constructor (emitter : JavaScriptEmitter, expr : ConditionalExpression) {
		super(emitter);
		this._expr = expr;
	}

	override function _emit () : void {
		var precedence = this._getPrecedence();
		var ifTrueExpr = this._expr.getIfTrueExpr();
		if (ifTrueExpr != null) {
			this._emitter._getExpressionEmitterFor(this._expr.getCondExpr()).emit(precedence - 1);
			this._emitter._emit(" ? ", null);
			this._emitter._getExpressionEmitterFor(ifTrueExpr).emit(precedence);
			this._emitter._emit(" : ", null);
			this._emitter._getExpressionEmitterFor(this._expr.getIfFalseExpr()).emit(precedence);
		} else {
			this._emitter._getExpressionEmitterFor(this._expr.getCondExpr()).emit(precedence - 1);
			this._emitter._emit(" || ", null);
			this._emitter._getExpressionEmitterFor(this._expr.getIfFalseExpr()).emit(precedence - 1);
		}
	}

	override function _getPrecedence () : number {
		return this._expr.getIfTrueExpr() != null ? _ConditionalExpressionEmitter._operatorPrecedence : _LogicalExpressionEmitter._operatorPrecedence["||"] as number;
	}

	static var _operatorPrecedence = 0;

	static function _setOperatorPrecedence (op : string, precedence : number) : void {
		_ConditionalExpressionEmitter._operatorPrecedence = precedence;
	}

}

class _CallExpressionEmitter extends _OperatorExpressionEmitter {

	var _expr : CallExpression;

	function constructor (emitter : JavaScriptEmitter, expr : CallExpression) {
		super(emitter);
		this._expr = expr;
	}

	override function _emit () : void {
		if (this._emitSpecial())
			return;
		// normal case
		var calleeExpr = this._expr.getExpr();
		this._emitter._getExpressionEmitterFor(calleeExpr).emit(_CallExpressionEmitter._operatorPrecedence);
		this._emitter._emitCallArguments(this._expr.getToken(), "(", this._expr.getArguments(), (this._expr.getExpr().getType().resolveIfNullable() as ResolvedFunctionType).getArgumentTypes());
	}

	override function _getPrecedence () : number {
		return _CallExpressionEmitter._operatorPrecedence;
	}

	static var _operatorPrecedence = 0;

	static function _setOperatorPrecedence (op : string, precedence : number) : void {
		_CallExpressionEmitter._operatorPrecedence = precedence;
	}

	function _emitSpecial () : boolean {
		// return false if is not js.apply
		var calleeExpr = this._expr.getExpr();
		if (! (calleeExpr instanceof PropertyExpression))
			return false;
		if (this._emitIfJsInvoke(calleeExpr as PropertyExpression))
			return true;
		if (this._emitIfJsEval(calleeExpr as PropertyExpression))
			return true;
		if (this._emitCallsToMap(calleeExpr as PropertyExpression))
			return true;
		if (this._emitCallsToArray(calleeExpr as PropertyExpression))
			return true;
		return false;
	}

	function _emitIfJsEval(calleeExpr : PropertyExpression) : boolean {
		if (! (calleeExpr.getType() instanceof StaticFunctionType))
			return false;
		if (calleeExpr.getIdentifierToken().getValue() != "eval")
			return false;
		var classDef = calleeExpr.getExpr().getType().getClassDef();
		if (! this._emitter.isJsModule(classDef))
			return false;

		// emit
		// In NodeJS, "require" and "__dirname" are defined in lexical context,
		// so the function must be "eval", not "new Function"
		var args = this._expr.getArguments();
		this._emitter._emit("eval(", calleeExpr.getToken());
		this._emitter._getExpressionEmitterFor(args[0]).emit(0);
		this._emitter._emit(")", calleeExpr.getToken());

		return true;
	}

	function _emitIfJsInvoke (calleeExpr : PropertyExpression) : boolean {
		if (! (calleeExpr.getType() instanceof StaticFunctionType))
			return false;
		if (calleeExpr.getIdentifierToken().getValue() != "invoke")
			return false;
		var classDef = calleeExpr.getExpr().getType().getClassDef();
		if (! this._emitter.isJsModule(classDef))
			return false;

		// emit
		var args = this._expr.getArguments();
		if (args[2] instanceof ArrayLiteralExpression) {
			this._emitter._getExpressionEmitterFor(args[0]).emit(_PropertyExpressionEmitter._operatorPrecedence);
			if (args[1] instanceof StringLiteralExpression && _Util.nameIsValidAsProperty((args[1] as StringLiteralExpression).getDecoded())) {
				this._emitter._emit(".", calleeExpr.getToken());
				this._emitter._emit((args[1] as StringLiteralExpression).getDecoded(), args[1].getToken());
			}
			else {
				this._emitter._emit("[", calleeExpr.getToken());
				this._emitter._getExpressionEmitterFor(args[1]).emit(0);
				this._emitter._emit("]", calleeExpr.getToken());
			}
			this._emitter._emitCallArguments(this._expr.getToken(), "(", (args[2] as ArrayLiteralExpression).getExprs(), null);
		} else {
			this._emitter._emit("(function (o, p, a) { return o[p].apply(o, a); }(", calleeExpr.getToken());
			this._emitter._getExpressionEmitterFor(args[0]).emit(0);
			this._emitter._emit(", ", this._expr.getToken());
			this._emitter._getExpressionEmitterFor(args[1]).emit(0);
			this._emitter._emit(", ", this._expr.getToken());
			this._emitter._getExpressionEmitterFor(args[2]).emit(0);
			this._emitter._emit("))", this._expr.getToken());
		}
		return true;
	}

	function _emitCallsToMap (calleeExpr : PropertyExpression) : boolean {
		// NOTE once we support member function references, we need to add special handling in _PropertyExpressionEmitter as well
		if (calleeExpr.getType() instanceof StaticFunctionType)
			return false;
		var classDef = calleeExpr.getExpr().getType().getClassDef();
		if (! (classDef instanceof InstantiatedClassDefinition))
			return false;
		if ((classDef as InstantiatedClassDefinition).getTemplateClassName() != "Map")
			return false;
		switch (calleeExpr.getIdentifierToken().getValue()) {
		case "toString":
			this._emitter._emitCallArguments(
				calleeExpr.getToken(), "$__jsx_ObjectToString.call(", [ calleeExpr.getExpr() ], [ new ObjectType(classDef) as Type ]);
			return true;
		case "hasOwnProperty":
			this._emitter._emitCallArguments(
				calleeExpr.getToken(), "$__jsx_ObjectHasOwnProperty.call(",
				[ calleeExpr.getExpr(), this._expr.getArguments()[0] ],
				[ new ObjectType(classDef) as Type, Type.stringType as Type ]);
			return true;
		case "keys":
			this._emitter._emitCallArguments(
				calleeExpr.getToken(), "Object.keys(",
				[ calleeExpr.getExpr() ],
				[ new ObjectType(classDef) as Type ]);
			return true;
		default:
			return false;
		}
	}

	function _emitCallsToArray(calleeExpr : PropertyExpression) : boolean {
		if (calleeExpr.getType() instanceof StaticFunctionType)
			return false;
		var classDef = calleeExpr.getExpr().getType().getClassDef();
		if (! (classDef instanceof InstantiatedClassDefinition))
			return false;
		if ((classDef as InstantiatedClassDefinition).getTemplateClassName() != "Array")
			return false;
		switch (calleeExpr.getIdentifierToken().getValue()) {
		case "_forEach":
			assert this._expr.getArguments().length == 1;
			this._emitter._emitCallArguments(
				calleeExpr.getToken(), "$__jsx_forEach(", [ calleeExpr.getExpr(), this._expr.getArguments()[0] ], null);
			return true;
		default:
			return false;
		}
	}

}

class _SuperExpressionEmitter extends _OperatorExpressionEmitter {

	var _expr : SuperExpression;

	function constructor (emitter : JavaScriptEmitter, expr : SuperExpression) {
		super(emitter);
		this._expr = expr;
	}

	override function _emit () : void {
		var funcType = this._expr.getFunctionType();
		var classDef = funcType.getObjectType().getClassDef();
		var methodName = this._expr.getName().getValue();
		var argTypes = funcType.getArgumentTypes();
		var mangledFuncName = this._emitter.getNamer().getNameOfMethod(classDef, methodName, argTypes);
		var thisVar = this._emitter._emittingFunction.getParent() != null ? "$this" : "this";
		this._emitter._emitCallArguments(this._expr.getToken(), this._emitter.getNamer().getNameOfClass(classDef) + ".prototype." + mangledFuncName + ".call(" + thisVar, this._expr.getArguments(), argTypes);
	}

	override function _getPrecedence () : number {
		return _CallExpressionEmitter._operatorPrecedence;
	}

	static var _operatorPrecedence = 0;

	static function _setOperatorPrecedence (op : string, precedence : number) : void {
		_SuperExpressionEmitter._operatorPrecedence = precedence;
	}

}

class _NewExpressionEmitter extends _OperatorExpressionEmitter {

	var _expr : NewExpression;

	function constructor (emitter : JavaScriptEmitter, expr : NewExpression) {
		super(emitter);
		this._expr = expr;
	}

	override function emit (outerOpPrecedence : number) : void {
		assert this._expr.getConstructor() != null, "logic flow: new " + this._expr.getType().toString(); // didn't call analize()?
		var inliner = _Util.getNewExpressionInliner(this._expr);
		var classDef = this._expr.getType().getClassDef();
		if (inliner) {
			this._emitAsObjectLiteral(classDef, inliner(this._expr));
		} else if (_Util.isArrayType(this._expr.getType())
			&& this._expr.getArguments().length == 0) {
			this._emitter._emit("[]", this._expr.getToken());
		} else if (
			classDef instanceof InstantiatedClassDefinition
			&& (classDef as InstantiatedClassDefinition).getTemplateClassName() == "Map") {
			this._emitter._emit("{}", this._expr.getToken());
		} else {
			var argTypes = this._expr.getConstructor().getArgumentTypes();
			this._emitter._emitCallArguments(
				this._expr.getToken(),
				"new " + this._emitter.getNamer().getNameOfConstructor(classDef, argTypes) + "(",
				this._expr.getArguments(),
				argTypes);
		}
	}

	function _emitAsObjectLiteral (classDef : ClassDefinition, propertyExprs : Expression[]) : void {
		this._emitter._emit("({", this._expr.getToken());
		var propertyIndex = 0;
		classDef.forEachMemberVariable(function (member) {
			if ((member.flags() & ClassDefinition.IS_STATIC) == 0) {
				if (propertyIndex != 0) {
					this._emitter._emit(", ", this._expr.getToken());
				}
				this._emitter._emit(this._emitter.getNamer().getNameOfProperty(classDef, member.name()) + ": ", this._expr.getToken());
				this._emitter._getExpressionEmitterFor(propertyExprs[propertyIndex++]).emit(_AssignmentExpressionEmitter._operatorPrecedence["="]);
			}
			return true;
		});
		this._emitter._emit("})", this._expr.getToken());
	}

	override function _getPrecedence () : number {
		return _NewExpressionEmitter._operatorPrecedence;
	}

	static var _operatorPrecedence = 0;

	static function _setOperatorPrecedence (op : string, precedence : number) : void {
		_NewExpressionEmitter._operatorPrecedence = precedence;
	}

}

class _CommaExpressionEmitter extends _ExpressionEmitter {

	var _expr : CommaExpression;

	function constructor (emitter : JavaScriptEmitter, expr : CommaExpression) {
		super(emitter);
		this._expr = expr;
	}

	override function emit (outerOpPrecedence : number) : void {
		// comma operations should be surrounded by brackets unless within a comma expression, since "," might get considered as an argument separator (of function calls, etc.)
		var useBrackets = outerOpPrecedence != _CommaExpressionEmitter._operatorPrecedence;
		if (useBrackets)
			this._emitter._emit("(", null);
		this._emitter._getExpressionEmitterFor(this._expr.getFirstExpr()).emit(_CommaExpressionEmitter._operatorPrecedence);
		this._emitter._emit(", ", null);
		this._emitter._getExpressionEmitterFor(this._expr.getSecondExpr()).emit(_CommaExpressionEmitter._operatorPrecedence);
		if (useBrackets)
			this._emitter._emit(")", null);
	}

	static var _operatorPrecedence = 0;

	static function _setOperatorPrecedence (op : string, precedence : number) : void {
		_CommaExpressionEmitter._operatorPrecedence = precedence;
	}

}

class _JSEmitterStash extends Stash {
	var shouldBooleanize = false;
	var returnsBoolean   = false;

	override function clone() : _JSEmitterStash {
		throw new Error("logic flaw");
	}
}

abstract class _BootstrapBuilder {

	var _emitter : JavaScriptEmitter;
	var _entrySourceFile : string;
	var _executableFor : string;

	function init(emitter : JavaScriptEmitter, entrySourceFile : string, executableFor : string) : void {
		this._emitter = emitter;
		this._entrySourceFile = entrySourceFile;
		this._executableFor = executableFor;
	}

	function addBootstrap(code : string) : string {
		code += this._emitter._platform.load(this._emitter._platform.getRoot() + "/lib/js/rt/launcher.js");

		var args;
		switch (this._executableFor) {
			case "node":
				args = "process.argv.slice(2)";
				break;
			case "commonjs":
				args = "require('system').args.slice(1)";
				break;
			default:
				args = "[]";
				break;
		}
		var callEntryPoint = Util.format("JSX.%1(%2, %3);",
				[this._getLauncher(), JSON.stringify(this._emitter._platform.encodeFilename(this._entrySourceFile)), args]);

		if (this._executableFor == "web") {
			callEntryPoint = this._wrapOnLoad(callEntryPoint);
		}

		return code + callEntryPoint + "\n";
	}

	abstract function _getLauncher() : string;

	function _wrapOnLoad(code : string) : string {
		var wrapper = this._emitter._platform.load(this._emitter._platform.getRoot() + "/lib/js/rt/web-launcher.js");
		return wrapper.replace(/\/\/--CODE--\/\//, code);
	}

}

class _ExecutableBootstrapBuilder extends _BootstrapBuilder {

	override function _getLauncher() : string {
		return "runMain";
	}

}

class _TestBootstrapBuilder extends _BootstrapBuilder {

	override function _getLauncher() : string {
		return "runTests";
	}

}

// the global emitter

class JavaScriptEmitter implements Emitter {

	static const BOOTSTRAP_NONE = 0;
	static const BOOTSTRAP_EXECUTABLE = 1;
	static const BOOTSTRAP_TEST = 2;

	var _fileHeader = "var JSX = {};\n" + "(function (JSX) {\n";
	var _fileFooter =                     "})(JSX);\n";

	var _platform : Platform;
	var _runenv : string;

	// properties setup by _emitInit
	var _output : string;
	var _outputEndsWithReturn : boolean;
	var _outputFile : Nullable.<string>;
	var _indent : number;
	var _emittingClass : ClassDefinition;
	var _emittingFunction : MemberFunctionDefinition;
	var _usesGenerator = false;

	// modes
	var _enableProfiler : boolean;
	var _enableMinifier : boolean;
	var _enableRunTimeTypeCheck = true;

	var _bootstrapBuilder : _BootstrapBuilder;
	var _sourceMapper : SourceMapper;
	var _mangler = new _Mangler();
	var _namer : _Namer;

	function constructor (platform : Platform) {
		JavaScriptEmitter._initialize();
		this._platform = platform;
	}

	override function isSpecialCall (callExpr : CallExpression) : boolean {
		var calleeExpr = callExpr.getExpr();
		if (! (calleeExpr instanceof PropertyExpression))
			return false;
		var propExpr = calleeExpr as PropertyExpression;
		return this._isJsEval(propExpr) || this._isJsInvoke(propExpr) || this._isCallToMap(propExpr);
	}

	function isJsModule(classDef : ClassDefinition) : boolean {
		return classDef.className() == "js"
			&& classDef.getToken().getFilename() == Util.resolvePath(this._platform.getRoot() + "/lib/js/js.jsx");
	}

	function _isJsEval (calleeExpr : PropertyExpression) : boolean {
		if (! (calleeExpr.getType() instanceof StaticFunctionType))
			return false;
		if (calleeExpr.getIdentifierToken().getValue() != "eval")
			return false;
		var classDef = calleeExpr.getExpr().getType().getClassDef();
		if (! this.isJsModule(classDef))
			return false;
		return true;
	}

	function _isJsInvoke (calleeExpr : PropertyExpression) : boolean {
		if (! (calleeExpr.getType() instanceof StaticFunctionType))
			return false;
		if (calleeExpr.getIdentifierToken().getValue() != "invoke")
			return false;
		var classDef = calleeExpr.getExpr().getType().getClassDef();
		if (! this.isJsModule(classDef))
			return false;
		return true;
	}

	function _isCallToMap (calleeExpr : PropertyExpression) : boolean {
		if (calleeExpr.getType() instanceof StaticFunctionType)
			return false;
		var classDef = calleeExpr.getExpr().getType().getClassDef();
		if (! (classDef instanceof InstantiatedClassDefinition))
			return false;
		if ((classDef as InstantiatedClassDefinition).getTemplateClassName() != "Map")
			return false;
		switch (calleeExpr.getIdentifierToken().getValue()) {
		case "toString":
		case "hasOwnProperty":
		case "keys":
			return true;
		default:
			return false;
		}
	}

	override function setRunEnv (runenv : string) : void {
		this._runenv = runenv;
	}

	override function getSearchPaths () : string[] {
		return [ this._platform.getRoot() + "/lib/js" ];
	}

	override function setOutputFile (name : Nullable.<string>) : void {
		if (name == null) return;

		this._outputFile = Util.resolvePath(name);
	}

	override function getSourceMappingFiles() : Map.<string> {
		var files = new Map.<string>;
		var sourceMapper = this._sourceMapper;
		if(sourceMapper != null && this._outputFile != null) {
			sourceMapper.getSourceFiles().forEach((filename) -> {
				try {
					sourceMapper.setSourceContent(filename, this._platform.load(filename));
				}
				catch (e : Error) {
					if (JSX.DEBUG) {
						this._platform.error("XXX: " + e.toString());
					}
				}
			});
			files[sourceMapper.getSourceMappingFile()] = sourceMapper.generate();
		}
		return files;
	}

	function getMangler() : _Mangler {
		return this._mangler;
	}

	function getNamer() : _Namer {
		return this._namer;
	}

	override function setEnableRunTimeTypeCheck (enable : boolean) : void {
		this._enableRunTimeTypeCheck = enable;
	}

	override function getEnableSourceMap() : boolean {
		return this._sourceMapper != null;
	}

	override function setEnableSourceMap (enable : boolean) : void {
		this._sourceMapper = enable
			? new SourceMapper(this._platform.getRoot(), this._outputFile, this._runenv)
			: null;
	}

	override function setEnableProfiler (enable : boolean) : void {
		this._enableProfiler = enable;
	}

	override function getEnableMinifier() : boolean {
		return this._enableMinifier;
	}

	override function setEnableMinifier(enable : boolean) : void {
		this._enableMinifier = enable;
	}

	override function emit (classDefs : ClassDefinition[]) : void {

		// current impl. of _Minifier.minifyJavaScript does not support transforming source map
		assert ! (this._enableMinifier && this._sourceMapper);

		_Util.setOutputClassNames(classDefs);

		if (this._enableMinifier) {
			var minifier = new _Minifier(this, classDefs);
			// emit using counting namer to collect stats for minification
			this._namer = minifier.getCountingNamer();
			this._emitInit();
			this._emitCore(classDefs);
			// re-emit using minifying namer
			this._namer = minifier.getMinifyingNamer();
			this._emitInit();
			this._emitCore(classDefs);
		} else {
			this._namer = (new _Namer).setup(this);
			this._emitInit();
			this._emitCore(classDefs);
		}
		this._emitClassMap(classDefs);
	}

	function _emitInit() : void {
		this._output = "";
		this._outputEndsWithReturn = true;
		this._indent = 0;
		this._emittingClass = null;
		this._emittingFunction = null;

		// headers
		this._output += "// generated by JSX compiler " + Meta.IDENTIFIER + "\n";
		this._output += this._fileHeader;
		this._output += this._platform.load(this._platform.getRoot() + "/lib/js/rt/bootstrap.js");

		var stash = (this.getStash(_NoDebugCommand.IDENTIFIER) as _NoDebugCommand.Stash);
		this._emit("JSX.DEBUG = "+(stash == null || stash.debugValue ? "true" : "false")+";\n", null);
	}

	function _emitCore(classDefs : ClassDefinition[]) : void {
		for (var i = 0; i < classDefs.length; ++i) {
			classDefs[i].forEachMemberFunction(function onFuncDef(funcDef) {
				funcDef.forEachClosure(onFuncDef);
				if (funcDef.isGenerator()) {
					this._usesGenerator = true;
				}
				this._setupBooleanizeFlags(funcDef);
				return true;
			});
			classDefs[i].forEachMemberVariable(function (varDef) {
				if ((varDef.flags() & ClassDefinition.IS_STATIC) != 0 && varDef.getInitialValue() != null) {
					// only handle static vars, initializer of non-static properties are compiled into member function defs.
					this._setupBooleanizeFlags(varDef.getInitialValue());
				}
				return true;
			});
		}
		for (var i = 0; i < classDefs.length; ++i) {
			this._emitClassDefinition(classDefs[i]);
		}
		for (var i = 0; i < classDefs.length; ++i)
			this._emitStaticInitializationCode(classDefs[i]);
	}

	function setBootstrapMode(mode : number, sourceFile : string, executableFor : string) : void {
		switch (mode) {
		case JavaScriptEmitter.BOOTSTRAP_NONE:
			this._bootstrapBuilder = null;
			break;
		case JavaScriptEmitter.BOOTSTRAP_EXECUTABLE:
			this._bootstrapBuilder = new _ExecutableBootstrapBuilder;
			break;
		case JavaScriptEmitter.BOOTSTRAP_TEST:
			this._bootstrapBuilder = new _TestBootstrapBuilder;
			break;
		default:
			throw new Error("unexpected bootstrap mode:" + mode as string);
		}
		if (this._bootstrapBuilder != null) {
			this._bootstrapBuilder.init(this, sourceFile, executableFor);
		}
	}

	function getStash (stashable : Stashable) : _JSEmitterStash {
		var stash = stashable.getStash("jsemitter");
		if (stash == null) {
			stash = stashable.setStash("jsemitter", new _JSEmitterStash);
		}
		return stash as _JSEmitterStash;
	}

	// the function does not take care of function statements / expressions (in other words the caller should use forEachClosure)
	function _setupBooleanizeFlags (expr : Expression) : void {
		var exprReturnsBoolean = function (expr : Expression) : boolean {
			if (expr instanceof LogicalExpression) {
				return this.getStash(expr).returnsBoolean;
			} else {
				return expr.getType().equals(Type.booleanType);
			}
		};
		var parentExpr = new Expression[]; // [0] is stack top
		var onExpr = function (expr : Expression) : boolean {
			// handle children
			parentExpr.unshift(expr);
			expr.forEachExpression(onExpr);
			parentExpr.shift();
			// check
			if (expr instanceof LogicalExpression) {
				var shouldBooleanize = true;
				var returnsBoolean = false;
				if (exprReturnsBoolean((expr as LogicalExpression).getFirstExpr()) && exprReturnsBoolean((expr as LogicalExpression).getSecondExpr())) {
					returnsBoolean = true;
					shouldBooleanize = false;
				} else if (parentExpr.length == 0) {
					// caller should disable the shouldBooleanize flag if necessary
				} else if (parentExpr[0] instanceof LogicalExpression
					|| parentExpr[0] instanceof LogicalNotExpression) {
					shouldBooleanize = false;
				} else if (parentExpr[0] instanceof ConditionalExpression && (parentExpr[0] as ConditionalExpression).getCondExpr() == expr) {
					shouldBooleanize = false;
				}
				this.getStash(expr).shouldBooleanize = shouldBooleanize;
				this.getStash(expr).returnsBoolean   = returnsBoolean;
			}
			return true;
		};
		onExpr(expr);
	}

	function _setupBooleanizeFlags (funcDef : MemberFunctionDefinition) : void {
		funcDef.forEachStatement(function onStatement(statement : Statement) : boolean {
			statement.forEachExpression(function (expr) {
				this._setupBooleanizeFlags(expr);
				if (statement instanceof ExpressionStatement
					|| statement instanceof IfStatement
					|| statement instanceof DoWhileStatement
					|| statement instanceof WhileStatement
					|| statement instanceof ForStatement) {
					this.getStash(expr).shouldBooleanize = false;
				}
				return true;
			});
			return statement.forEachStatement(onStatement);
		});
	}

	function shouldBooleanize (logicalExpr : Expression) : boolean {
		return this.getStash(logicalExpr).shouldBooleanize;
	}


	function _emitClassDefinition (classDef : ClassDefinition) : void {
		if ((classDef.flags() & ClassDefinition.IS_NATIVE) != 0) {
			// bind native object to JSX class
			if (classDef.getNativeSource() != null) {
				this._emit("var " + this._namer.getNameOfClass(classDef) + " = " + Util.decodeStringLiteral(classDef.getNativeSource().getValue()) + ";\n", classDef.getNativeSource());
			}
			return;
		}

		this._emittingClass = classDef;
		try {

			// emit constructors
			var ctors = _Util.findFunctions(classDef, "constructor", false);
			for (var i = 0; i < ctors.length; ++i)
				this._emitConstructor(ctors[i]);
			// emit the amendments
			this._emitClassObjectAmendments(classDef, ctors);
			// emit functions
			var members = classDef.members();
			for (var i = 0; i < members.length; ++i) {
				var member = members[i];
				if (member instanceof MemberFunctionDefinition) {
					if (! (member.name() == "constructor" && (member.flags() & ClassDefinition.IS_STATIC) == 0) && (member as MemberFunctionDefinition).getStatements() != null) {
						if (member instanceof TemplateFunctionDefinition) {
						} else {
							this._emitFunction(member as MemberFunctionDefinition);
						}
					}
				}
			}

		} finally {
			this._emittingClass = null;
		}

	}

	function _emitStaticInitializationCode (classDef : ClassDefinition) : void {
		if ((classDef.flags() & ClassDefinition.IS_NATIVE) != 0)
			return;
		// normal handling
		var members = classDef.members();
		// FIXME can we (should we?) automatically resolve dependencies? isn't it impossible?
		for (var i = 0; i < members.length; ++i) {
			var member = members[i];
			if ((member instanceof MemberVariableDefinition)
				&& (member.flags() & (ClassDefinition.IS_STATIC | ClassDefinition.IS_NATIVE)) == ClassDefinition.IS_STATIC) {
				this._emitStaticMemberVariable(member as MemberVariableDefinition);
			}
		}
	}

	function _emitClassMap (classDefs : ClassDefinition[]) : void {
		classDefs = classDefs.concat(new ClassDefinition[]); // shallow clone
		// remove the classDefs wo. source token or native
		for (var i = 0; i < classDefs.length;) {
			if (classDefs[i].getToken() == null || (classDefs[i].flags() & ClassDefinition.IS_NATIVE) != 0)
				classDefs.splice(i, 1);
			else
				++i;
		}
		// start emitting
		this._emit("\n" + "var $__jsx_classMap = {", null);
		var isFirstEntry = true;
		while (classDefs.length != 0) {
			// fetch the first classDef, and others that came from the same file
			var list = new string[][];
			var pushClass = (function (classDef : ClassDefinition) : void {
				var ctors = _Util.findFunctions(classDef, "constructor", false);
				if ((classDef.flags() & ClassDefinition.IS_EXPORT) != 0) {
					if (ctors.length != 0) {
						var exportedCtor = null : MemberFunctionDefinition;
						for (var i = 0; i < ctors.length; ++i) {
							if ((ctors[i].flags() & ClassDefinition.IS_EXPORT) != 0) {
								assert exportedCtor == null;
								exportedCtor = ctors[i];
							}
						}
						if (exportedCtor == null) {
							exportedCtor = ctors[0]; // any ctor will do
						}
						list.push([ classDef.classFullName(), this._namer.getNameOfConstructor(classDef, exportedCtor.getArgumentTypes()) ]);
					} else {
						list.push([ classDef.classFullName(), this._namer.getNameOfClass(classDef) ]);
					}
				}
				if (! this._enableMinifier) {
					if ((classDef.flags() & ClassDefinition.IS_EXPORT) == 0) {
						list.push([ classDef.classFullName(), this._namer.getNameOfClass(classDef) ]);
					}
					var push = function (argTypes : Type[]) : void {
						list.push([ classDef.classFullName() + this._mangler.mangleFunctionArguments(argTypes), this._namer.getNameOfConstructor(classDef, argTypes) ]);
					};
					for (var i = 0; i < ctors.length; ++i)
						push(ctors[i].getArgumentTypes());
				}
			});
			var filename = classDefs[0].getToken().getFilename();
			pushClass(classDefs.shift());
			for (var i = 0; i < classDefs.length;) {
				if (classDefs[i].getToken().getFilename() == filename) {
					pushClass(classDefs[i]);
					classDefs.splice(i, 1);
				} else {
					++i;
				}
			}
			if (list.length != 0 || ! this._enableMinifier) {
				// emit the map
				if (isFirstEntry) {
					this._emit("\n", null);
					this._advanceIndent();
					isFirstEntry = false;
				} else {
					this._emit(",\n", null);
				}
				var escapedFilename = JSON.stringify(this._platform.encodeFilename(filename));
				this._emit(escapedFilename  + ": ", null);
				this._emit("{\n", null);
				this._advanceIndent();
				for (var i = 0; i < list.length; ++i) {
					this._emit(_Util.encodeObjectLiteralKey(list[i][0]) + ": " + list[i][1], null);
					if (i != list.length - 1)
						this._emit(",", null);
					this._emit("\n", null);
				}
				this._reduceIndent();
				this._emit("}", null);
			}
		}
		if (! isFirstEntry) {
			this._emit("\n", null);
			this._reduceIndent();
		}
		this._emit("};\n\n", null);
	}

	override function getOutput () : string {
		var output = "";
		// do not add any lines except source-map header before this._output for source-map
		if (this._sourceMapper) {
			output += this._sourceMapper.getSourceMapHeader();
		}
		output += this._output + "\n";
		if (this._enableProfiler) {
			output += this._platform.load(this._platform.getRoot() + "/lib/js/rt/profiler.js");
		}
		if (this._bootstrapBuilder != null) {
			output = this._bootstrapBuilder.addBootstrap(output);
		}
		output += this._fileFooter;
		if (this._sourceMapper) {
			output += this._sourceMapper.getSourceMapFooter();
		}
		if (this._enableMinifier) {
			if (! this._usesGenerator) { // TODO: disabling js minifier components until they support es6 generators.
				output = _Minifier.minifyJavaScript(output);
			}
		}
		return output;
	}

	function _emitClassObjectAmendments (classDef : ClassDefinition, constructors : MemberFunctionDefinition[]) : void {
		// extends
		if (classDef.extendType() != null) {
			var extendClassDef = classDef.extendType().getClassDef();
		} else {
			extendClassDef = null;
		}
		if (constructors.length != 0) {
			this._emit("$__jsx_extend([", null);
			for (var i = 0; i < constructors.length; ++i) {
				if (i != 0) {
					this._emit(", ", null);
				}
				this._emit(this._namer.getNameOfConstructor(classDef, constructors[i].getArgumentTypes()), null);
			}
			this._emit("], " + (extendClassDef != null ? this._namer.getNameOfClass(extendClassDef) : "Object") + ");\n", null);
		} else {
			this._emit("function " + this._namer.getNameOfClass(classDef) + "() {}\n", null);
			this._emit("$__jsx_extend([" + this._namer.getNameOfClass(classDef) + "], " + (extendClassDef != null ? this._namer.getNameOfClass(extendClassDef) : "Object") + ");\n", null);
		}
		// implements
		var implementTypes = classDef.implementTypes();
		if (implementTypes.length != 0) {
			// merge
			for (var i = 0; i < implementTypes.length; ++i)
				this._emit("$__jsx_merge_interface(" + this._namer.getNameOfClass(classDef) + ", " + this._namer.getNameOfClass(implementTypes[i].getClassDef()) + ");\n", null);
			// emit exported mappings
			var unresolvedExports = new Map.<Type[] /* argTypes */>;
			(function buildUnresolvedExports(baseClassDef : ClassDefinition) : void {
				if (baseClassDef.extendType() != null) {
					buildUnresolvedExports(baseClassDef.extendType().getClassDef());
				}
				baseClassDef.implementTypes().forEach(function (implType) { buildUnresolvedExports(implType.getClassDef()); });
				baseClassDef.forEachMemberFunction(function (funcDef) {
					if ((funcDef.flags() & (ClassDefinition.IS_STATIC | ClassDefinition.IS_EXPORT)) == ClassDefinition.IS_EXPORT
						&& funcDef.name() != "constructor") {
						if (classDef == baseClassDef && funcDef.getStatements() != null) {
							// examining current class and the function as its definition, no need to merge!
							delete unresolvedExports[funcDef.name()];
						} else {
							unresolvedExports[funcDef.name()] = funcDef.getArgumentTypes();
						}
					}
					return true;
				});
			})(classDef);
			for (var i = implementTypes.length - 1; i >= 0 && unresolvedExports.keys().length != 0; --i) {
				implementTypes[i].getClassDef().forEachClassToBase(function (baseClassDef) {
					for (var name in unresolvedExports) {
						unresolvedExports[name];
						if (Util.findFunctionInClass(baseClassDef, name, unresolvedExports[name], false)) {
							this._emit(
								this._namer.getNameOfClass(classDef) + ".prototype." + name +
								" = " +
								this._namer.getNameOfClass(classDef) + ".prototype." + this._namer.getNameOfMethod(classDef, name, unresolvedExports[name])
								+ ";\n",
								null);
							delete unresolvedExports[name];
						}
					}
					return unresolvedExports.keys().length != 0;
				});
			}
			this._emit("\n", null);
		}
		if ((classDef.flags() & (ClassDefinition.IS_INTERFACE | ClassDefinition.IS_MIXIN)) != 0)
			this._emit(this._namer.getNameOfClass(classDef) + ".prototype.$__jsx_implements_" + this._namer.getNameOfClass(classDef) + " = true;\n\n", null);
	}

	function _emitConstructor (funcDef : MemberFunctionDefinition) : void {
		var funcName = this._namer.getNameOfConstructor(funcDef.getClassDef(), funcDef.getArgumentTypes());

		// emit prologue
		this._emit("function ", null);
		this._emit(funcName + "(", funcDef.getClassDef().getToken());
		this._namer.enterFunction(funcDef, function () {
			this._emitFunctionArguments(funcDef);
			this._emit(") {\n", null);
			this._advanceIndent();
			// emit body
			this._emitFunctionBody(funcDef);
			// emit epilogue
			this._reduceIndent();
			this._emit("};\n\n", null);
		});
	}

	function _emitFunction (funcDef : MemberFunctionDefinition) : void {
		var isStatic = (funcDef.flags() & ClassDefinition.IS_STATIC) != 0;
		// emit
		if (isStatic) {
			this._emit(
				"function " + this._namer.getNameOfStaticFunction(funcDef.getClassDef(), funcDef.name(), funcDef.getArgumentTypes()) + "(",
				funcDef.getNameToken());
		} else {
			this._emit(
				this._namer.getNameOfClass(funcDef.getClassDef()) + ".prototype." + this._namer.getNameOfMethod(funcDef.getClassDef(), funcDef.name(), funcDef.getArgumentTypes())
				+ " = function (",
				funcDef.getNameToken());
		}
		this._namer.enterFunction(funcDef, function () {
			this._emitFunctionArguments(funcDef);
			this._emit(") {\n", null);
			this._advanceIndent();
			this._emitFunctionBody(funcDef);
			this._reduceIndent();
			this._emit("};\n\n", null);
		});
		if (isStatic) {
			if (Util.memberIsExported(funcDef.getClassDef(), funcDef.name(), funcDef.getArgumentTypes(), true)) {
				this._emit(
					this._namer.getNameOfClass(funcDef.getClassDef()) + "." + funcDef.name()
					+ " = "
					+ this._namer.getNameOfStaticFunction(funcDef.getClassDef(), funcDef.name(), funcDef.getArgumentTypes())
					+ ";\n",
					null);
			}
			if (! this._enableMinifier) {
				this._emit(
					this._namer.getNameOfClass(funcDef.getClassDef()) + "." + funcDef.name() + this._mangler.mangleFunctionArguments(funcDef.getArgumentTypes())
					+ " = "
					+ this._namer.getNameOfStaticFunction(funcDef.getClassDef(), funcDef.name(), funcDef.getArgumentTypes())
					+ ";\n",
					null);
			}
		} else {
			if (Util.memberIsExported(funcDef.getClassDef(), funcDef.name(), funcDef.getArgumentTypes(), false)) {
				this._emit(
					this._namer.getNameOfClass(funcDef.getClassDef()) + ".prototype." + funcDef.name()
					+ " = "
					+ this._namer.getNameOfClass(funcDef.getClassDef()) + ".prototype." + this._namer.getNameOfMethod(funcDef.getClassDef(), funcDef.name(), funcDef.getArgumentTypes())
					+ ";\n",
					null);
			}
		}
		this._emit("\n", null);
	}

	function _emitFunctionArguments (funcDef : MemberFunctionDefinition) : void {
		var args = funcDef.getArguments();
		for (var i = 0; i < args.length; ++i) {
			if (i != 0)
				this._emit(", ", null);
			this._emit(this._namer.getNameOfLocalVariable(args[i]), args[i].getName());
		}
	}

	function _emitFunctionBody (funcDef : MemberFunctionDefinition) : void {
		var prevEmittingFunction = this._emittingFunction;
		try {
			this._emittingFunction = funcDef;

			if (this._enableProfiler) {
				this._emit(
					"var $__jsx_profiler_ctx = $__jsx_profiler.enter("
					+ Util.encodeStringLiteral(funcDef.getNotation())
					+ ");\n",
					null);
			}

			// emit reference to this for closures
			// if funDef is NOT in another closure
			if (funcDef.getParent() == null && (funcDef.flags() & ClassDefinition.IS_STATIC) == 0 && funcDef.getClosures().length != 0)
				this._emit("var $this = this;\n", null);
			// emit local variable declarations
			var locals = funcDef.getLocals();
			for (var i = 0; i < locals.length; ++i) {
				// FIXME unused variables should never be emitted by the compiler
				var type = locals[i].getType();
				if (type == null)
					continue;
				// do not pass the token for declaration
				this._emit("var " + this._namer.getNameOfLocalVariable(locals[i]) + ";\n", null);
			}

			// emit definition of $__jsx_t if it is to be used
			var tempVars = new _TempVarLister().update(funcDef).finalize();
			for (var i = 0; i != tempVars.length; ++i) {
				this._emit("var " + tempVars[i] + ";\n", null);
			}

			// emit code
			var statements = funcDef.getStatements();
			for (var i = 0; i < statements.length; ++i)
				this._emitStatement(statements[i]);

			if (this._enableProfiler) {
				if (statements.length == 0 || ! (statements[statements.length - 1] instanceof ReturnStatement)) {
					this._emit("$__jsx_profiler.exit();\n", null);
				}
			}

		} finally {
			this._emittingFunction = prevEmittingFunction;
		}
	}

	function _emitStaticMemberVariable (variable : MemberVariableDefinition) : void {
		var initialValue = variable.getInitialValue();
		// static vars that refer to other static vars should be initialized lazily
		if (initialValue != null && initialValue.hasSideEffects(function (expr) {
			if (expr instanceof PropertyExpression) {
				var holderExpr = (expr as PropertyExpression).getExpr();
				if (holderExpr instanceof ClassExpression
					|| (holderExpr instanceof PropertyExpression && (holderExpr as PropertyExpression).isClassSpecifier())) {
					return true;
				}
			} else if (expr instanceof NewExpression) {
				if (_Util.getNewExpressionInliner(expr as NewExpression) != null) {
					return false;
				}
			}
			return null;
		})) {
			// use deferred initialization
			this._emit("$__jsx_lazy_init(", variable.getNameToken());
			this._emit(this._namer.getNameOfClass(variable.getClassDef()) + ", \"" + this._namer.getNameOfStaticVariable(variable.getClassDef(), variable.name()) + "\", function () {\n", variable.getNameToken());
			this._advanceIndent();
			var tempVars = new _TempVarLister().update(initialValue).finalize();
			for (var i = 0; i != tempVars.length; ++i) {
				this._emit("var " + tempVars[i] + ";\n", variable.getNameToken());
			}
			this._emit("return ", variable.getNameToken());
			this._emitRHSOfAssignment(initialValue, variable.getType());
			this._emit(";\n", variable.getNameToken());
			this._reduceIndent();
			this._emit("});\n", variable.getNameToken());
		} else {
			this._emit(this._namer.getNameOfClass(variable.getClassDef()) + "." + this._namer.getNameOfStaticVariable(variable.getClassDef(), variable.name()) + " = ", variable.getNameToken());
			this._emitRHSOfAssignment(initialValue, variable.getType());
			this._emit(";\n", initialValue.getToken());
		}
	}

	function _emitStatements (statements : Statement[]) : void {
		this._advanceIndent();
		for (var i = 0; i < statements.length; ++i)
			this._emitStatement(statements[i]);
		this._reduceIndent();
	}

	function _emitStatement (statement : Statement) : void {
		var emitter = this._getStatementEmitterFor(statement);
		emitter.emit();
	}

	function _addSourceMapping(token : Token) : void {
		this._sourceMapper.add(this._output, token.getLineNumber(), token.getColumnNumber(), token.isIdentifier() ? token.getValue() : null, token.getFilename());
	}

	function _emit (str : string, token : Token) : void {
		if (str == "")
			return;

		if (this._outputEndsWithReturn && this._indent != 0) {
			this._output += this._getIndent();
			this._outputEndsWithReturn = false;
		}

		if(this._sourceMapper != null && token != null) {
			this._addSourceMapping(token);
		}

		str = str.replace(/\n(.)/g, function (m) {
			return "\n" + this._getIndent() + m.substring(1);
		});
		this._output += str;
		this._outputEndsWithReturn = str.charAt(str.length - 1) == "\n";
	}

	function _advanceIndent () : void {
		++this._indent;
	}

	function _reduceIndent () : void {
		if (--this._indent < 0)
			throw new Error("indent mistach");
	}

	function _getIndent () : string {
		var s = "";
		for (var i = 0; i < this._indent; ++i)
			s += "\t";
		return s;
	}

	function _getStatementEmitterFor (statement : Statement) : _StatementEmitter {
		if (statement instanceof ConstructorInvocationStatement)
			return new _ConstructorInvocationStatementEmitter(this, statement as ConstructorInvocationStatement);
		else if (statement instanceof ExpressionStatement)
			return new _ExpressionStatementEmitter(this, statement as ExpressionStatement);
		else if (statement instanceof FunctionStatement)
			return new _FunctionStatementEmitter(this, statement as FunctionStatement);
		else if (statement instanceof ReturnStatement)
			return new _ReturnStatementEmitter(this, statement as ReturnStatement);
		else if (statement instanceof DeleteStatement)
			return new _DeleteStatementEmitter(this, statement as DeleteStatement);
		else if (statement instanceof BreakStatement)
			return new _BreakStatementEmitter(this, statement as BreakStatement);
		else if (statement instanceof ContinueStatement)
			return new _ContinueStatementEmitter(this, statement as ContinueStatement);
		else if (statement instanceof DoWhileStatement)
			return new _DoWhileStatementEmitter(this, statement as DoWhileStatement);
		else if (statement instanceof ForInStatement)
			return new _ForInStatementEmitter(this, statement as ForInStatement);
		else if (statement instanceof ForStatement)
			return new _ForStatementEmitter(this, statement as ForStatement);
		else if (statement instanceof IfStatement)
			return new _IfStatementEmitter(this, statement as IfStatement);
		else if (statement instanceof SwitchStatement)
			return new _SwitchStatementEmitter(this, statement as SwitchStatement);
		else if (statement instanceof CaseStatement)
			return new _CaseStatementEmitter(this, statement as CaseStatement);
		else if (statement instanceof DefaultStatement)
			return new _DefaultStatementEmitter(this, statement as DefaultStatement);
		else if (statement instanceof WhileStatement)
			return new _WhileStatementEmitter(this, statement as WhileStatement);
		else if (statement instanceof TryStatement)
			return new _TryStatementEmitter(this, statement as TryStatement);
		else if (statement instanceof CatchStatement)
			return new _CatchStatementEmitter(this, statement as CatchStatement);
		else if (statement instanceof ThrowStatement)
			return new _ThrowStatementEmitter(this, statement as ThrowStatement);
		else if (statement instanceof AssertStatement)
			return new _AssertStatementEmitter(this, statement as AssertStatement);
		else if (statement instanceof LogStatement)
			return new _LogStatementEmitter(this, statement as LogStatement);
		else if (statement instanceof DebuggerStatement)
			return new _DebuggerStatementEmitter(this, statement as DebuggerStatement);
		throw new Error("got unexpected type of statement: " + JSON.stringify(statement.serialize()));
	}

	function _getExpressionEmitterFor (expr : Expression) : _ExpressionEmitter {
		if (expr instanceof LocalExpression)
			return new _LocalExpressionEmitter(this, expr as LocalExpression);
		else if (expr instanceof ClassExpression)
			return new _ClassExpressionEmitter(this, expr as ClassExpression);
		else if (expr instanceof NullExpression)
			return new _NullExpressionEmitter(this, expr as NullExpression);
		else if (expr instanceof BooleanLiteralExpression)
			return new _BooleanLiteralExpressionEmitter(this, expr as BooleanLiteralExpression);
		else if (expr instanceof IntegerLiteralExpression)
			return new _IntegerLiteralExpressionEmitter(this, expr as IntegerLiteralExpression);
		else if (expr instanceof NumberLiteralExpression)
			return new _NumberLiteralExpressionEmitter(this, expr as NumberLiteralExpression);
		else if (expr instanceof StringLiteralExpression)
			return new _StringLiteralExpressionEmitter(this, expr as StringLiteralExpression);
		else if (expr instanceof RegExpLiteralExpression)
			return new _RegExpLiteralExpressionEmitter(this, expr as RegExpLiteralExpression);
		else if (expr instanceof ArrayLiteralExpression)
			return new _ArrayLiteralExpressionEmitter(this, expr as ArrayLiteralExpression);
		else if (expr instanceof MapLiteralExpression)
			return new _MapLiteralExpressionEmitter(this, expr as MapLiteralExpression);
		else if (expr instanceof ThisExpression)
			return new _ThisExpressionEmitter(this, expr as ThisExpression);
		else if (expr instanceof BitwiseNotExpression)
			return new _UnaryExpressionEmitter(this, expr as BitwiseNotExpression);
		else if (expr instanceof InstanceofExpression)
			return new _InstanceofExpressionEmitter(this, expr as InstanceofExpression);
		else if (expr instanceof AsExpression)
			return new _AsExpressionEmitter(this, expr as AsExpression);
		else if (expr instanceof AsNoConvertExpression)
			return new _AsNoConvertExpressionEmitter(this, expr as AsNoConvertExpression);
		else if (expr instanceof LogicalNotExpression)
			return new _UnaryExpressionEmitter(this, expr as LogicalNotExpression);
		else if (expr instanceof TypeofExpression)
			return new _UnaryExpressionEmitter(this, expr as TypeofExpression);
		else if (expr instanceof PostIncrementExpression)
			return new _PostIncrementExpressionEmitter(this, expr as PostIncrementExpression);
		else if (expr instanceof PreIncrementExpression)
			return new _PreIncrementExpressionEmitter(this, expr as PreIncrementExpression);
		else if (expr instanceof PropertyExpression)
			return new _PropertyExpressionEmitter(this, expr as PropertyExpression);
		else if (expr instanceof SignExpression)
			return new _UnaryExpressionEmitter(this, expr as SignExpression);
		else if (expr instanceof YieldExpression)
			return new _UnaryExpressionEmitter(this, expr as YieldExpression);
		else if (expr instanceof AdditiveExpression)
			return new _AdditiveExpressionEmitter(this, expr as AdditiveExpression);
		else if (expr instanceof ArrayExpression)
			return new _ArrayExpressionEmitter(this, expr as ArrayExpression);
		else if (expr instanceof AssignmentExpression)
			return new _AssignmentExpressionEmitter(this, expr as AssignmentExpression);
		else if (expr instanceof FusedAssignmentExpression)
			return new _FusedAssignmentExpressionEmitter(this, expr as FusedAssignmentExpression);
		else if (expr instanceof BinaryNumberExpression)
			return new _BinaryNumberExpressionEmitter(this, expr as BinaryNumberExpression);
		else if (expr instanceof EqualityExpression)
			return new _EqualityExpressionEmitter(this, expr as EqualityExpression);
		else if (expr instanceof InExpression)
			return new _InExpressionEmitter(this, expr as InExpression);
		else if (expr instanceof LogicalExpression)
			return new _LogicalExpressionEmitter(this, expr as LogicalExpression);
		else if (expr instanceof ShiftExpression)
			return new _ShiftExpressionEmitter(this, expr as ShiftExpression);
		else if (expr instanceof ConditionalExpression)
			return new _ConditionalExpressionEmitter(this, expr as ConditionalExpression);
		else if (expr instanceof CallExpression)
			return new _CallExpressionEmitter(this, expr as CallExpression);
		else if (expr instanceof SuperExpression)
			return new _SuperExpressionEmitter(this, expr as SuperExpression);
		else if (expr instanceof NewExpression)
			return new _NewExpressionEmitter(this, expr as NewExpression);
		else if (expr instanceof FunctionExpression)
			return new _FunctionExpressionEmitter(this, expr as FunctionExpression);
		else if (expr instanceof CommaExpression)
			return new _CommaExpressionEmitter(this, expr as CommaExpression);
		throw new Error("got unexpected type of expression: " + (expr != null ? JSON.stringify(expr.serialize()) : expr.toString()));
	}

	function _emitCallArguments (token : Token, prefix : string, args : Expression[], argTypes : Type[]) : void {
		this._emit(prefix, token);
		for (var i = 0; i < args.length; ++i) {
			if (i != 0 || prefix.charAt(prefix.length - 1) != '(')
				this._emit(", ", null);
			// determine the argument type (FIXME make this a separate function)
			var argType : Type = null;
			if (argTypes != null) {
				if (i < argTypes.length) {
					argType = argTypes[i];
				} else if (argTypes.length != 0 && argTypes[argTypes.length - 1] instanceof VariableLengthArgumentType) {
					argType = argTypes[argTypes.length - 1];
				}
				if (argType instanceof VariableLengthArgumentType) {
					argType = (argType as VariableLengthArgumentType).getBaseType();
				}
			}
			// emit with nullable guard if the formal argument is not nullable
			if (argType != null && ! Type.nullType.isConvertibleTo(argType)) {
				this._emitRHSOfAssignment(args[i], argType);
			} else {
				this._getExpressionEmitterFor(args[i]).emit(0);
			}
		}
		this._emit(")", token);
	}

	function _emitAssertion (emitTestExpr : function():void, token : Token, message : string) : void {
		this._emit("if (! (", token);
		emitTestExpr();
		this._emit(")) {\n", null);
		this._advanceIndent();
		this._emit("debugger;\n", null);
		var s = Util.makeErrorMessage(this._platform, message, token.getFilename(), token.getLineNumber(), token.getColumnNumber(), token.getValue().length);
		var err = Util.format('throw new Error(%1);\n', [Util.encodeStringLiteral(s)]);
		this._emit(err, token);
		this._reduceIndent();
		this._emit("}\n", null);
	}

	function _emitAssertionWithMsg (emitTestExpr : function():void, token : Token, message : string, msgExpr : Expression) : void {
		this._emit("if (! (", token);
		emitTestExpr();
		this._emit(")) {\n", null);
		this._advanceIndent();
		this._emit("debugger;\n", null);
		// any other better way?
		var s = Util.makeErrorMessage(this._platform, message + ": {MSG}", token.getFilename(), token.getLineNumber(), token.getColumnNumber(), token.getValue().length).split("{MSG}");
		this._emit(Util.format('throw new Error(%1 + ', [Util.encodeStringLiteral(s[0])]), token);
		this._getExpressionEmitterFor(msgExpr).emit(0);
		this._emit(Util.format(' + %1);\n', [Util.encodeStringLiteral(s[1])]), token);
		this._reduceIndent();
		this._emit("}\n", null);
	}

	function _emitWithNullableGuard (expr : Expression, outerOpPrecedence : number) : void {
		if (this._enableRunTimeTypeCheck && expr.getType() instanceof NullableType) {
			var token = expr.getToken();
			this._emit("(function (v) {\n", token);
			this._advanceIndent();
			this._emitAssertion(function () {
				this._emit("v != null", token);
			}, token, "null access");
			this._emit("return v;\n", token);
			this._reduceIndent();
			this._emit("}(", token);
			this._getExpressionEmitterFor(expr).emit(0);
			this._emit("))", token);
		} else {
			this._getExpressionEmitterFor(expr).emit(outerOpPrecedence);
		}
	}

	function _emitRHSOfAssignment (expr : Expression, lhsType : Type) : void {
		var exprType = expr.getType();
		// FIXME what happens if the op is /= or %= ?
		if (lhsType.resolveIfNullable().equals(Type.integerType) && exprType.equals(Type.numberType)) {
			if (expr instanceof NumberLiteralExpression) {
				this._emit((expr as NumberLiteralExpression).getDecoded() as int as string, expr.getToken());
			} else if (expr instanceof IntegerLiteralExpression) {
				this._emit((expr as IntegerLiteralExpression).getDecoded() as string, expr.getToken());
			} else {
				this._emit("(", expr.getToken());
				this._getExpressionEmitterFor(expr).emit(_BinaryNumberExpressionEmitter._operatorPrecedence["|"]);
				this._emit(" | 0)", expr.getToken());
			}
			return;
		}
		if (lhsType.equals(Type.integerType) && exprType.resolveIfNullable().equals(Type.numberType)) {
			this._emit("(", expr.getToken());
			this._emitWithNullableGuard(expr, _BinaryNumberExpressionEmitter._operatorPrecedence["|"]);
			this._emit(" | 0)", expr.getToken());
			return;
		}
		if ((lhsType instanceof NullableType && (lhsType as NullableType).getBaseType().equals(Type.integerType))
			&& (exprType instanceof NullableType && (exprType as NullableType).getBaseType().equals(Type.numberType))) {
			// NOTE this is very slow, but such an operation would practically not be found
			this._emit("(function (v) { return v != null ? v | 0 : v; })(", expr.getToken());
			this._getExpressionEmitterFor(expr).emit(0);
			this._emit(")", expr.getToken());
			return;
		}
		// normal mode
		if (lhsType.equals(Type.variantType) || lhsType instanceof NullableType) {
			this._getExpressionEmitterFor(expr).emit(_AssignmentExpressionEmitter._operatorPrecedence["="]);
		} else {
			this._emitWithNullableGuard(expr, _AssignmentExpressionEmitter._operatorPrecedence["="]);
		}
	}

	static var _initialized = false;
	static function _initialize () : void {
		if (JavaScriptEmitter._initialized) {
			return;
		}
		JavaScriptEmitter._initialized = true;

		var precedence = [
			[
				{ "new":        _NewExpressionEmitter._setOperatorPrecedence },
				{ "[":          _ArrayExpressionEmitter._setOperatorPrecedence },
				{ ".":          _PropertyExpressionEmitter._setOperatorPrecedence },
				{ "(":          _CallExpressionEmitter._setOperatorPrecedence },
				{ "super":      _SuperExpressionEmitter._setOperatorPrecedence },
				{ "function":   _FunctionExpressionEmitter._setOperatorPrecedence }
			], [
				{ "++":         _PostIncrementExpressionEmitter._setOperatorPrecedence },
				{ "--":         _PostIncrementExpressionEmitter._setOperatorPrecedence }
			], [
				// delete is not used by JSX
				{ "void":       _UnaryExpressionEmitter._setOperatorPrecedence },
				{ "typeof":     _UnaryExpressionEmitter._setOperatorPrecedence },
				{ "++":         _PreIncrementExpressionEmitter._setOperatorPrecedence },
				{ "--":         _PreIncrementExpressionEmitter._setOperatorPrecedence },
				{ "+":          _UnaryExpressionEmitter._setOperatorPrecedence },
				{ "-":          _UnaryExpressionEmitter._setOperatorPrecedence },
				{ "~":          _UnaryExpressionEmitter._setOperatorPrecedence },
				{ "!":          _UnaryExpressionEmitter._setOperatorPrecedence }
			], [
				{ "*":          _BinaryNumberExpressionEmitter._setOperatorPrecedence },
				{ "/":          _BinaryNumberExpressionEmitter._setOperatorPrecedence },
				{ "%":          _BinaryNumberExpressionEmitter._setOperatorPrecedence }
			], [
				{ "+":          _AdditiveExpressionEmitter._setOperatorPrecedence },
				{ "-":          _BinaryNumberExpressionEmitter._setOperatorPrecedence }
			], [
				{ "<<":         _ShiftExpressionEmitter._setOperatorPrecedence },
				{ ">>":         _ShiftExpressionEmitter._setOperatorPrecedence },
				{ ">>>":        _ShiftExpressionEmitter._setOperatorPrecedence }
			], [
				{ "<":          _BinaryNumberExpressionEmitter._setOperatorPrecedence },
				{ ">":          _BinaryNumberExpressionEmitter._setOperatorPrecedence },
				{ "<=":         _BinaryNumberExpressionEmitter._setOperatorPrecedence },
				{ ">=":         _BinaryNumberExpressionEmitter._setOperatorPrecedence },
				{ "instanceof": _InstanceofExpressionEmitter._setOperatorPrecedence },
				{ "in":         _InExpressionEmitter._setOperatorPrecedence }
			], [
				{ "==":         _EqualityExpressionEmitter._setOperatorPrecedence },
				{ "!=":         _EqualityExpressionEmitter._setOperatorPrecedence }
			], [
				{ "&":          _BinaryNumberExpressionEmitter._setOperatorPrecedence }
			], [
				{ "^":          _BinaryNumberExpressionEmitter._setOperatorPrecedence }
			], [
				{ "|":          _BinaryNumberExpressionEmitter._setOperatorPrecedence }
			], [
				{ "&&":         _LogicalExpressionEmitter._setOperatorPrecedence }
			], [
				{ "||":         _LogicalExpressionEmitter._setOperatorPrecedence }
			], [
				{ "=":          _AssignmentExpressionEmitter._setOperatorPrecedence },
				{ "*=":         _FusedAssignmentExpressionEmitter._setOperatorPrecedence },
				{ "/=":         _FusedAssignmentExpressionEmitter._setOperatorPrecedence },
				{ "%=":         _FusedAssignmentExpressionEmitter._setOperatorPrecedence },
				{ "+=":         _FusedAssignmentExpressionEmitter._setOperatorPrecedence },
				{ "-=":         _FusedAssignmentExpressionEmitter._setOperatorPrecedence },
				{ "<<=":        _FusedAssignmentExpressionEmitter._setOperatorPrecedence },
				{ ">>=":        _FusedAssignmentExpressionEmitter._setOperatorPrecedence },
				{ ">>>=":       _FusedAssignmentExpressionEmitter._setOperatorPrecedence },
				{ "&=":         _FusedAssignmentExpressionEmitter._setOperatorPrecedence },
				{ "^=":         _FusedAssignmentExpressionEmitter._setOperatorPrecedence },
				{ "|=":         _FusedAssignmentExpressionEmitter._setOperatorPrecedence }
			], [
				{ "?":          _ConditionalExpressionEmitter._setOperatorPrecedence }
			], [
				{ "yield":	_UnaryExpressionEmitter._setOperatorPrecedence }
			], [
				{ ",":          _CommaExpressionEmitter._setOperatorPrecedence }
			]
		];
		for (var i = 0; i < precedence.length; ++i) {
			var opTypeList = precedence[i];
			for (var j = 0; j < opTypeList.length; ++j)
				for (var key in opTypeList[j])
					opTypeList[j][key](key, -(precedence.length - i));
		}
	}

}
// vim: set noexpandtab:
