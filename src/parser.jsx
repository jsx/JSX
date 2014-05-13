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

import "./type.jsx";
import "./analysis.jsx";
import "./classdef.jsx";
import "./statement.jsx";
import "./expression.jsx";
import "./doc.jsx";
import "./util.jsx";
import "./completion.jsx";
import _CompletionCandidatesWithLocal, _CompletionCandidatesOfProperty, _CompletionCandidatesOfNamespace from "completion.jsx";


class Token {

	var _value : string;
	var _isIdentifier : boolean;
	var _filename : Nullable.<string>;
	var _lineNumber : number;
	var _columnNumber : number;

	function constructor (value : string, isIdentifier : boolean = false, filename : Nullable.<string> = null, lineNumber : number = NaN, columnNumber : number = NaN) {
		this._value = value;
		this._isIdentifier = isIdentifier;
		this._filename = filename;
		this._lineNumber = lineNumber;
		this._columnNumber = columnNumber;
	}

	function getValue () : string {
		return this._value;
	}

	function isIdentifier () : boolean {
		return this._isIdentifier;
	}

	function getFilename () : Nullable.<string> {
		return this._filename;
	}

	function getLineNumber () : number {
		return this._lineNumber;
	}

	function getColumnNumber () : number {
		return this._columnNumber;
	}

	function serialize () : variant {
		return [
			this._value,
			this._isIdentifier,
			this._filename,
			this._lineNumber,
			this._columnNumber
		] : variant[];
	}

	// "'x' at filename:linenumber" for debugging purpose
	function getNotation() : string {
		return "'" + this._value + "'"
				+ " at " + (this._filename ?: "<<unknown>>")  + ":" + this._lineNumber as string + ":" + this._columnNumber as string;
	}
}

class _Lexer {

	static const ident         = " [a-zA-Z_] [a-zA-Z0-9_]* ";
	static const doubleQuoted  = ' "  [^"\\\\]* (?: \\\\. [^"\\\\]* )* " ';
	static const singleQuoted  = " '  [^'\\\\]* (?: \\\\. [^'\\\\]* )* ' ";
	static const stringLiteral = _Lexer.makeAlt([_Lexer.singleQuoted, _Lexer.doubleQuoted]);
	static const regexpLiteral = _Lexer.doubleQuoted.replace(/"/g, "/") + "[mgi]*";

	static const heredocStartDoubleQuoted = '"""';
	static const heredocStartSingleQuoted = "'''";
	static const heredocStart = _Lexer.makeAlt([ _Lexer.heredocStartDoubleQuoted, _Lexer.heredocStartSingleQuoted ]);
	static const heredocEndDoubleQuoted = ' (?:^|.*?[^\\\\]) (?:\\\\\\\\)* """ ';
	static const heredocEndSingleQuoted = " (?:^|.*?[^\\\\]) (?:\\\\\\\\)* ''' ";

	// ECMA 262 compatible,
	// see also ECMA 262 5th (7.8.3) Numeric Literals
	static const decimalIntegerLiteral = "(?: 0 | [1-9][0-9]* )";
	static const exponentPart = "(?: [eE] [+-]? [0-9]+ )";
	static const numberLiteral = _Lexer.makeAlt([
		"(?: " + _Lexer.decimalIntegerLiteral + " \\. " +
		"[0-9]* " + _Lexer.exponentPart + "? )",
		"(?: \\. [0-9]+ " + _Lexer.exponentPart + "? )",
		"(?: " + _Lexer.decimalIntegerLiteral + _Lexer.exponentPart + " )",
		"NaN",
		"Infinity"
		]) + "\\b";
	static const integerLiteral = _Lexer.makeAlt([
		"(?: 0 [xX] [0-9a-fA-F]+ )", // hex
		_Lexer.decimalIntegerLiteral
		]) + "(?![\\.0-9eE])\\b";

	// regular expressions
	static const rxIdent          = _Lexer.rx("^" + _Lexer.ident);
	static const rxStringLiteral  = _Lexer.rx("^" + _Lexer.stringLiteral);
	static const rxNumberLiteral  = _Lexer.rx("^" + _Lexer.numberLiteral);
	static const rxIntegerLiteral = _Lexer.rx("^" + _Lexer.integerLiteral);
	static const rxRegExpLiteral  = _Lexer.rx("^" + _Lexer.regexpLiteral);
	static const rxHeredocStart   = _Lexer.rx("^" + _Lexer.heredocStart);
	static const rxHeredocEndDoubleQuoted = _Lexer.rx(_Lexer.heredocEndDoubleQuoted);
	static const rxHeredocEndSingleQuoted = _Lexer.rx(_Lexer.heredocEndSingleQuoted);
	static const rxNewline        = /(?:\r\n?|\n)/;

	// blacklists of identifiers
	static const keywords = Util.asSet([
		// literals shared with ECMA 262
		"null",     "true",     "false",
		"NaN",      "Infinity",
		// keywords shared with ECMA 262
		"break",    "do",       "instanceof", "typeof",
		"case",     "else",     "new",        "var",
		/*"catch",*/ // contextual
		"finally",  "return",     "void",
		"const",
		/*"continue",*/ // contextual
		"for",      "switch",     "while",
		"function", "this",
		/* "default", */ // contextual keywords
		"if",       "throw",
		/* "assert",    "log", // contextual keywords */
		/*"delete",*/ // contextual
		"in",       "try",
		// keywords of JSX
		"class",	 "extends", "super",
		"import",    "implements",
		// "interface", // contextual keywords
		"static",
		"__FILE__",  "__LINE__",
		"undefined"
		]);
	static const reserved = Util.asSet([
		// literals of ECMA 262 but not used by JSX
		"debugger", "with",
		// future reserved words of ECMA 262
		"export",
		// future reserved words within strict mode of ECMA 262
		"let",   "private",   "public", "yield",
		"protected",

		// JSX specific reserved words
		"extern", "native", "as", "operator"
		]);

	static function makeAlt (patterns : string[]) : string {
		return "(?: \n" + patterns.join("\n | \n") + "\n)\n";
	}

	static function quoteMeta (pattern : string) : string {
		return pattern.replace(/([^0-9A-Za-z_])/g, '\\$1');
	}

	/// compile a regular expression
	static function rx (pat : string) : RegExp {
		return new RegExp(pat.replace(/[ \t\r\n]/g, ""));
	}
}

class Import {

	var _filenameToken : Token;
	var _aliasToken : Token;
	var _classNames : Token[];
	var _sourceParsers : Parser[];

	function constructor(parser : Parser) {
		// for built-in classes
		this._filenameToken = null;
		this._aliasToken = null;
		this._classNames = null;
		this._sourceParsers = [ parser ];
	}

	function constructor (filenameToken : Token, aliasToken : Token, classNames : Token[]) {
		this._filenameToken = filenameToken;
		this._aliasToken = aliasToken;
		this._classNames = classNames;
		this._sourceParsers = [] : Parser[];
	}

	function getFilenameToken () : Token {
		return this._filenameToken;
	}

	function getAlias () : Nullable.<string> {
		if (this._aliasToken) {
			return this._aliasToken.getValue();
		}
		else {
			return null;
		}
	}

	function getClassNames () : string[] {
		if (this._classNames == null)
			return null;
		var names = new string[];
		for (var i = 0; i < this._classNames.length; ++i)
			names[i] = this._classNames[i].getValue();
		return names;
	}

	function serialize () : variant {
		return [
			"Import",
			Util.serializeNullable(this._filenameToken),
			Util.serializeNullable(this._aliasToken),
			Util.serializeArray(this._classNames)
		] : variant[];
	}

	function checkNameConflict (errors : CompileError[], nameToken : Token) : boolean {
		if (this._aliasToken != null) {
			if (this._aliasToken.getValue() == nameToken.getValue()) {
				errors.push(new CompileError(nameToken, "an alias with the same name is already declared"));
				return false;
			}
		} else {
			if (this._classNames != null) {
				for (var i = 0; i < this._classNames.length; ++i) {
					if (this._classNames[i].getValue() == nameToken.getValue()) {
						errors.push(new CompileError(nameToken, "a class with the same name has already been explicitely imported"));
						return false;
					}
				}
			}
		}
		return true;
	}

	function addSource (parser : Parser) : void {
		this._sourceParsers.push(parser);
	}

	function getSources () : Parser[] {
		return this._sourceParsers;
	}

	function assertExistenceOfNamedClasses (errors : CompileError[]) : void {
		if (this._classNames == null) {
			// no named classes
			return;
		}

		// list all classses
		var allClassNames = new string[];
		for (var i = 0; i < this._sourceParsers.length; ++i) {
			allClassNames = allClassNames.concat(this._sourceParsers[i].getClassDefs().map.<string>(function (classDef) {
				return classDef.className();
			}));
			allClassNames = allClassNames.concat(this._sourceParsers[i].getTemplateClassDefs().map.<string>(function (classDef) {
				return classDef.className();
			}));
		}
		function countNumberOfClassesByName(className : string) : number {
			var num = 0;
			for (var i = 0; i < allClassNames.length; ++i) {
				if (allClassNames[i] == className) {
					++num;
				}
			}
			return num;
		}
		for (var i = 0; i < this._classNames.length; ++i) {
			switch (countNumberOfClassesByName(this._classNames[i].getValue())) {
			case 0:
				errors.push(new CompileError(this._classNames[i], "no definition for class '" + this._classNames[i].getValue() + "'"));
				break;
			case 1:
				// ok
				break;
			default:
				errors.push(new CompileError(this._classNames[i], "multiple candidates for class '" + this._classNames[i].getValue() + "'"));
				break;
			}
		}
	}

	function getClasses (name : string) : ClassDefinition[] {
		if (! this._classIsImportable(name)) {
			return [] : ClassDefinition[];
		}
		var found = [] : ClassDefinition[];
		for (var i = 0; i < this._sourceParsers.length; ++i) {
			var classDefs = this._sourceParsers[i].getClassDefs();
			for (var j = 0; j < classDefs.length; ++j) {
				var classDef = classDefs[j];
				if (classDef.className() == name) {
					found.push(classDef);
					break;
				}
			}
		}
		return found;
	}

	function createGetTemplateClassCallbacks (errors : CompileError[], request : TemplateInstantiationRequest, postInstantiationCallback : function(:Parser,:ClassDefinition):ClassDefinition) : Array.<function(:CompileError[],:TemplateInstantiationRequest,:function(:Parser,:ClassDefinition):ClassDefinition):ClassDefinition> {
		if (! this._classIsImportable(request.getClassName())) {
			return new Array.<function(:CompileError[],:TemplateInstantiationRequest,:function(:Parser,:ClassDefinition):ClassDefinition):ClassDefinition>;
		}
		var callbacks = new Array.<function(:CompileError[],:TemplateInstantiationRequest,:function(:Parser,:ClassDefinition):ClassDefinition):ClassDefinition>;
		for (var i = 0; i < this._sourceParsers.length; ++i) {
			var callback = this._sourceParsers[i].createGetTemplateClassCallback(errors, request, postInstantiationCallback);
			if (callback != null) {
				callbacks.push(callback);
			}
		}
		return callbacks;
	}

	function _classIsImportable (name : string) : boolean {
		if (this._classNames != null) {
			for (var i = 0; i < this._classNames.length; ++i)
				if (this._classNames[i].getValue() == name)
					break;
			if (i == this._classNames.length)
				return false;
		} else {
			if (name.charAt(0) == '_')
				return false;
		}
		return true;
	}

	static function create (errors : CompileError[], filenameToken : Token, aliasToken : Token, classNames : Token[]) : Import {
		var filename = Util.decodeStringLiteral(filenameToken.getValue());
		if (filename.indexOf("*") != -1) {
			// read the files from a directory
			var match = filename.match(/^([^\*]*)\/\*(\.[^\/\*]*)$/);
			if (match == null) {
				errors.push(new CompileError(filenameToken, "invalid use of wildcard"));
				return null;
			}
			return new WildcardImport(filenameToken, aliasToken, classNames, match[1], match[2]);
		}
		return new Import(filenameToken, aliasToken, classNames);
	}

}

class WildcardImport extends Import {

	var _directory : string;
	var _suffix : string;

	function constructor (filenameToken : Token, aliasToken : Token, classNames : Token[], directory : string, suffix : string) {
		super(filenameToken, aliasToken, classNames);
		this._directory = directory;
		this._suffix = suffix;
	}

	function getDirectory () : string {
		return this._directory;
	}

	function getSuffix () : string {
		return this._suffix;
	}

}

class QualifiedName {

	var _token : Token;
	// _import and _enclosingType are exclusive
	var _import : Import;
	var _enclosingType : ParsedObjectType;

	function constructor (token : Token) {
		this._token = token;
		this._import = null;
		this._enclosingType = null;
	}

	function constructor (token : Token, imprt : Import) {
		this._token = token;
		this._import = imprt;
		this._enclosingType = null;
	}

	function constructor (token : Token, enclosingType : ParsedObjectType) {
		this._token = token;
		this._import = null;
		this._enclosingType = enclosingType;
	}

	function getToken () : Token {
		return this._token;
	}

	function getImport () : Import {
		return this._import;
	}

	function getEnclosingType () : ParsedObjectType {
		return this._enclosingType;
	}

	function serialize () : variant {
		return [
			"QualifiedName",
			this._token.serialize(),
			Util.serializeNullable(this._import),
			Util.serializeNullable(this._enclosingType)
		] : variant[];
	}

	function equals (x : QualifiedName) : boolean {
		if (x == null)
			return false;
		if (this._token.getValue() != x._token.getValue())
			return false;
		if (this._import != x._import)
			return false;
		if (this._enclosingType == null) {
			if (x._enclosingType != null)
				return false;
		} else {
			if (! this._enclosingType.equals(x._enclosingType))
				return false;
		}
		return true;
	}

	function getClass (context : AnalysisContext, typeArguments : Type[]) : ClassDefinition {
		var classDef = null : ClassDefinition;

		if (this._import != null) { // && this._enclosingType == null
			if (typeArguments.length == 0) {
				var classDefs = this._import.getClasses(this._token.getValue());
				switch (classDefs.length) {
				case 1:
					classDef = classDefs[0];
					break;
				case 0:
					context.errors.push(new CompileError(this._token, "no definition for class '" + this.toString() + "' in file '" + this._import.getFilenameToken().getValue() + "'"));
					return null;
				default:
					context.errors.push(new CompileError(this._token, "multiple candidates"));
					return null;
				}
			} else {
				var callbacks = this._import.createGetTemplateClassCallbacks(context.errors, new TemplateInstantiationRequest(this._token, this._token.getValue(), typeArguments), function (parser : Parser, classDef : ClassDefinition) : ClassDefinition { return null; });
				switch (callbacks.length) {
				case 1:
					return callbacks[0](null, null, null);
				case 0:
					context.errors.push(new CompileError(this._token, "no definition for template class '" + this.toString() + "' in file '" + this._import.getFilenameToken().getValue() + "'"));
					return null;
				default:
					context.errors.push(new CompileError(this._token, "multiple canditates"));
					return null;
				}
			}
		} else if (this._enclosingType != null) {
			this._enclosingType.resolveType(context);

			var enclosingClassDef;
			if ((enclosingClassDef = this._enclosingType.getClassDef()) == null)
				return null;
			if (typeArguments.length == 0) {
				if ((classDef = enclosingClassDef.lookupInnerClass(this._token.getValue())) == null) {
					context.errors.push(new CompileError(this._token, "no class definition or variable for '" + this.toString() + "'"));
					return null;
				}
			} else {
				if ((classDef = enclosingClassDef.lookupTemplateInnerClass(context.errors, new TemplateInstantiationRequest(this._token, this._token.getValue(), typeArguments), (parser, classDef) -> { return null; })) == null) {
					context.errors.push(new CompileError(this._token, "failed to instantiate class"));
					return null;
				}
			}
		} else {
			if (typeArguments.length == 0) {
				if ((classDef = context.parser.lookup(context.errors, this._token, this._token.getValue())) == null) {
					if ((classDef = context.parser.lookupTemplate(context.errors, new TemplateInstantiationRequest(this._token, this._token.getValue(), typeArguments), function (parser : Parser, classDef : ClassDefinition) : ClassDefinition { return null; })) == null) {
						context.errors.push(new CompileError(this._token, "no class definition or variable for '" + this.toString() + "'"));
						return null;
					}
				}
			} else {
				if ((classDef = context.parser.lookupTemplate(context.errors, new TemplateInstantiationRequest(this._token, this._token.getValue(), typeArguments), function (parser : Parser, classDef : ClassDefinition) : ClassDefinition { return null; })) == null) {
					context.errors.push(new CompileError(this._token, "failed to instantiate class"));
					return null;
				}
			}
		}
		return classDef;
	}

	function getTemplateClass (parser : Parser) : TemplateClassDefinition {
		var foundClassDefs = new TemplateClassDefinition[];
		var checkClassDef = function (classDef : TemplateClassDefinition) : void {
			if (classDef.className() == this._token.getValue()) {
				foundClassDefs.push(classDef);
			}
		};
		if (this._import != null) {
			this._import.getSources().forEach(function (parser) {
				parser.getTemplateClassDefs().forEach(checkClassDef);
			});
		} else {
			parser.getTemplateClassDefs().forEach(checkClassDef);
			if (foundClassDefs.length == 0) {
				parser.getImports().forEach(function (imprt) {
					imprt.getSources().forEach(function (parser) {
						parser.getTemplateClassDefs().forEach(checkClassDef);
					});
				});
			}
		}
		return foundClassDefs.length == 1 ? foundClassDefs[0] : null;
	}

	override function toString () : string {
		return this._enclosingType != null ? this._enclosingType.toString() + "." + this._token.getValue() : this._token.getValue();
	}

}

class ParserState {

	var lineNumber : number;
	var columnOffset : number;
	var docComment : DocComment;
	var tokenLength : number;
	var isGenerator : boolean;
	var numErrors : number;
	var numClosures : number;
	var numObjectTypesUsed : number;
	var numTemplateInstantiationRequests : number;

	function constructor (lineNumber : number, columnNumber : number, docComment : DocComment, tokenLength : number, isGenerator : boolean, numErrors : number, numClosures : number, numObjectTypesUsed : number, numTemplateInstantiationRequests : number) {
		this.lineNumber = lineNumber;
		this.columnOffset = columnNumber;
		this.docComment = docComment;
		this.tokenLength = tokenLength;
		this.isGenerator = isGenerator;
		this.numErrors = numErrors;
		this.numClosures = numClosures;
		this.numObjectTypesUsed = numObjectTypesUsed;
		this.numTemplateInstantiationRequests = numTemplateInstantiationRequests;
	}

}

class ClassState {

	var outer : ClassState;
	var classType : ParsedObjectType;
	var typeArgs : Token[];
	var extendType : ParsedObjectType;
	var implementTypes : ParsedObjectType[];
	var objectTypesUsed : ParsedObjectType[];
	var classFlags : number;
	var inners : ClassDefinition[];
	var templateInners : TemplateClassDefinition[];

	function constructor (outer : ClassState, classType : ParsedObjectType, typeArgs : Token[], extendType : ParsedObjectType, implementTypes : ParsedObjectType[], objectTypesUsed : ParsedObjectType[], classFlags : number, inners : ClassDefinition[], templateInners : TemplateClassDefinition[]) {
		this.outer = outer;
		this.classType = classType;
		this.typeArgs = typeArgs;
		this.extendType = extendType;
		this.implementTypes = implementTypes;
		this.objectTypesUsed = objectTypesUsed;
		this.classFlags = classFlags;
		this.inners = inners;
		this.templateInners = templateInners;
	}
}

class Scope {

	var prev : Scope;
	var locals : LocalVariable[];
	var funcLocal : LocalVariable; // the name of current closure, can be null
	var arguments : ArgumentDeclaration[];
	var statements : Statement[];
	var closures : MemberFunctionDefinition[];
	var isGenerator : boolean;

	function constructor (prev : Scope, locals : LocalVariable[], funcLocal : LocalVariable, args : ArgumentDeclaration[], statements : Statement[], closures : MemberFunctionDefinition[], isGenerator : boolean) {
		this.prev = prev;
		this.locals = locals;
		this.funcLocal = funcLocal;
		this.arguments = args;
		this.statements = statements;
		this.closures = closures;
		this.isGenerator = isGenerator;
	}

}

class Parser {

	var _sourceToken : Token;
	var _filename : string;
	var _completionRequest : CompletionRequest;

	var _content : Nullable.<string>;
	var _lines : string[];
	var _tokenLength : number;
	var _lineNumber : number; // one origin
	var _columnOffset : number; // zero origin
	var _fileLevelDocComment : DocComment;
	var _docComment : DocComment;
	var _errors : CompileError[];
	var _templateClassDefs : TemplateClassDefinition[];
	var _classDefs : ClassDefinition[];
	var _imports : Import[];
	var _isGenerator : boolean;
	var _locals : LocalVariable[];
	var _statements : Statement[];
	var _closures : MemberFunctionDefinition[];

	var _outerClass : ClassState;
	var _classType : ParsedObjectType;
	var _extendType : ParsedObjectType;
	var _implementTypes : ParsedObjectType[];
	var _objectTypesUsed : ParsedObjectType[];
	var _inners : ClassDefinition[];
	var _templateInners : TemplateClassDefinition[];
	var _templateInstantiationRequests : TemplateInstantiationRequest[];

	var _prevScope : Scope = null;
	var _funcLocal : LocalVariable = null;
	var _arguments : ArgumentDeclaration[] = null;
	var _classFlags : number;
	var _typeArgs : Token[];

	function constructor (sourceToken : Token, filename : string, completionRequest : CompletionRequest) {
		this._sourceToken = sourceToken;
		this._filename = filename;
		this._completionRequest = completionRequest;
	}

	function parse (content : string, errors : CompileError[]) : boolean {
		// lexer properties
		this._content = content;
		this._lines = this._content.split(_Lexer.rxNewline);
		this._tokenLength = 0;
		this._lineNumber = 1; // one origin
		this._columnOffset = 0; // zero origin
		this._fileLevelDocComment = null;
		this._docComment = null;
		// insert a marker so that at the completion location we would always get _expectIdentifierOpt called, whenever possible
		if (this._completionRequest != null) {
			var compLineNumber = Math.min(this._completionRequest.getLineNumber(), this._lines.length + 1);
			var line = this._lines[compLineNumber - 1] ?: '';
			this._lines[compLineNumber - 1] =
				line.substring(0, this._completionRequest.getColumnOffset())
				+ "Q," + // use a character that is permitted within an identifier, but never appears in keywords
				line.substring(this._completionRequest.getColumnOffset());
		}
		// output
		this._errors = errors;
		this._templateClassDefs = new TemplateClassDefinition[];
		this._classDefs = new ClassDefinition[];
		this._imports = new Import[];
		// use for function parsing
		this._isGenerator = false;
		this._locals = null;
		this._statements = null;
		this._closures = null;
		this._classType = null;
		this._extendType = null;
		this._implementTypes = null;
		this._objectTypesUsed = new ParsedObjectType[];
		this._inners = new ClassDefinition[];
		this._templateInners = new TemplateClassDefinition[];
		this._templateInstantiationRequests = new TemplateInstantiationRequest[];

		// doit
		while (! this._isEOF()) {
			var importToken = this._expectOpt("import");
			if (importToken == null)
				break;
			this._importStatement(importToken);
		}
		while (! this._isEOF()) {
			if (this._classDefinition() == null)
				return false;
		}

		if (this._errors.length != 0)
			return false;

		return true;
	}

	function getContent() : string {
		return this._content;
	}

	function _getInput () : string {
		return this._lines[this._lineNumber - 1].substring(this._columnOffset);
	}

	function _getInputByLength (length : number) : string {
		return this._lines[this._lineNumber - 1].substring(this._columnOffset, this._columnOffset + length);
	}

	function _forwardPos (len : number) : void {
		this._columnOffset += len;
	}

	function getSourceToken () : Token {
		return this._sourceToken;
	}

	function getPath () : string {
		return this._filename;
	}

	function getDocComment () : DocComment {
		return this._fileLevelDocComment;
	}

	function getClassDefs () : ClassDefinition[] {
		return this._classDefs;
	}

	function getTemplateClassDefs () : TemplateClassDefinition[] {
		return this._templateClassDefs;
	}

	function getTemplateInstantiationRequests () : TemplateInstantiationRequest[] {
		return this._templateInstantiationRequests;
	}

	function getImports () : Import[] {
		return this._imports;
	}

	function registerBuiltinImports (parsers : Parser[]) : void {
		for (var i = parsers.length - 1; i >= 0; --i)
			this._imports.unshift(new Import(parsers[i]));
	}

	function lookupImportAlias (name : string) : Import {
		for (var i = 0; i < this._imports.length; ++i) {
			var alias = this._imports[i].getAlias();
			if (alias != null && alias == name)
				return this._imports[i];
		}
		return null;
	}

	function lookup (errors : CompileError[], contextToken : Token, className : string) : ClassDefinition {
		// class within the file is preferred
		for (var i = 0; i < this._classDefs.length; ++i) {
			var classDef = this._classDefs[i];
			if (classDef.className() == className)
				return classDef;
		}
		// classnames within the imported files may conflict
		var found = new ClassDefinition[];
		for (var i = 0; i < this._imports.length; ++i) {
			if (this._imports[i].getAlias() == null)
				found = found.concat(this._imports[i].getClasses(className));
		}
		if (found.length == 1)
			return found[0];
		if (found.length >= 2)
			errors.push(new CompileError(contextToken, "multiple candidates exist for class name '" + className + "'"));
		return null;
	}

	function lookupTemplate (errors : CompileError[], request : TemplateInstantiationRequest, postInstantiationCallback : function(:Parser,:ClassDefinition):ClassDefinition) : ClassDefinition {
		// lookup within the source file
		var instantiateCallback = this.createGetTemplateClassCallback(errors, request, postInstantiationCallback);
		if (instantiateCallback != null) {
			return instantiateCallback(errors, request, postInstantiationCallback);
		}
		// lookup within the imported files
		var candidateCallbacks = new Array.<function(:CompileError[],:TemplateInstantiationRequest,:function(:Parser,:ClassDefinition):ClassDefinition):ClassDefinition>;
		for (var i = 0; i < this._imports.length; ++i) {
			candidateCallbacks = candidateCallbacks.concat(this._imports[i].createGetTemplateClassCallbacks(errors, request, postInstantiationCallback));
		}
		if (candidateCallbacks.length == 0) {
			errors.push(new CompileError(request.getToken(), "could not find definition for template class: '" + request.getClassName() + "'"));
			return null;
		} else if (candidateCallbacks.length >= 2) {
			errors.push(new CompileError(request.getToken(), "multiple candidates exist for template class name '" + request.getClassName() + "'"));
			return null;
		}
		return candidateCallbacks[0](null,null,null);
	}

	function createGetTemplateClassCallback (errors : CompileError[], request : TemplateInstantiationRequest, postInstantiationCallback : function(:Parser,:ClassDefinition):ClassDefinition) : function(:CompileError[],:TemplateInstantiationRequest,:function(:Parser,:ClassDefinition):ClassDefinition):ClassDefinition {
		// lookup the already-instantiated class
		for (var i = 0; i < this._classDefs.length; ++i) {
			var classDef = this._classDefs[i];
			if (classDef instanceof InstantiatedClassDefinition
				&& (classDef as InstantiatedClassDefinition).getTemplateClassName() == request.getClassName()
				&& Util.typesAreEqual((classDef as InstantiatedClassDefinition).getTypeArguments(), request.getTypeArguments())) {
				return function (_ : CompileError[], __ : TemplateInstantiationRequest, ___ : function(:Parser,:ClassDefinition):ClassDefinition) : ClassDefinition {
					return classDef;
				};
			}
		}
		// create instantiation callback
		for (var i = 0; i < this._templateClassDefs.length; ++i) {
			var templateDef = this._templateClassDefs[i];
			if (templateDef.className() == request.getClassName()) {
				return function (_ : CompileError[], __ : TemplateInstantiationRequest, ___ : function(:Parser,:ClassDefinition):ClassDefinition) : ClassDefinition {
					var classDef = templateDef.instantiateTemplateClass(errors, request);
					if (classDef == null) {
						return null;
					}
					this._classDefs.push(classDef);
					classDef.setParser(this);
					classDef.resolveTypes(new AnalysisContext(errors, this, null));
					postInstantiationCallback(this, classDef);
					return classDef;
				};
			}
		}
		return null;
	}

	function _pushClassState () : void {
		this._outerClass = new ClassState (
			this._outerClass,
			this._classType,
			this._typeArgs,
			this._extendType,
			this._implementTypes,
			this._objectTypesUsed,
			this._classFlags,
			this._inners,
			this._templateInners
		);
	}

	function _popClassState () : void {
		this._classType = this._outerClass.classType;
		this._typeArgs = this._outerClass.typeArgs;
		this._extendType = this._outerClass.extendType;
		this._implementTypes = this._outerClass.implementTypes;
		this._objectTypesUsed = this._outerClass.objectTypesUsed;
		this._classFlags = this._outerClass.classFlags;
		this._inners = this._outerClass.inners;
		this._templateInners = this._outerClass.templateInners;
		this._outerClass = this._outerClass.outer;
	}

	function _pushScope (funcLocal : LocalVariable, args : ArgumentDeclaration[]) : void {
		this._prevScope = new Scope (
			this._prevScope,
			this._locals,
			this._funcLocal,
			this._arguments,
			this._statements,
			this._closures,
			this._isGenerator
		);
		this._locals = new LocalVariable[];
		this._funcLocal = funcLocal;
		this._arguments = args;
		this._statements = new Statement[];
		this._closures = new MemberFunctionDefinition[];
		this._isGenerator = false;
	}

	function _popScope () : void {
		this._locals = this._prevScope.locals;
		this._funcLocal = this._prevScope.funcLocal;
		this._arguments = this._prevScope.arguments;
		this._statements = this._prevScope.statements;
		this._closures = this._prevScope.closures;
		this._isGenerator = this._prevScope.isGenerator;
		this._prevScope = this._prevScope.prev;
	}

	function _registerLocal (identifierToken : Token, type : Type, isConst : boolean, isFunctionStmt : boolean = false) : LocalVariable {
		function isEqualTo (local : LocalVariable) : boolean {
			if (local.getName().getValue() == identifierToken.getValue()) {
				if ((type != null && local.getType() != null && ! local.getType().equals(type)) || isFunctionStmt)
					this._newError("conflicting types for variable " + identifierToken.getValue(), identifierToken);
				if (local.isConstant() != isConst)
					this._newError("const attribute conflict for variable " + identifierToken.getValue(), identifierToken);
				return true;
			}
			return false;
		}

		if (this._arguments == null) {
			this._newError(Util.format("cannot declare variable %1 outside of a function", [identifierToken.getValue()])); // FIXME should we allow this?
			return null;
		}

		if (this._funcLocal != null) {
			if (isEqualTo(this._funcLocal)) {
				return this._funcLocal;
			}
		}
		for (var i = 0; i < this._arguments.length; ++i) {
			if (isEqualTo(this._arguments[i])) {
				return this._arguments[i];
			}
		}
		for (var i = 0; i < this._locals.length; i++) {
			if (isEqualTo(this._locals[i])) {
				return this._locals[i];
			}
		}
		var newLocal = new LocalVariable(identifierToken, type, isConst);
		this._locals.push(newLocal);
		return newLocal;
	}

	function _preserveState () : ParserState {
		return new ParserState(
			// lexer properties
			this._lineNumber,
			this._columnOffset,
			this._docComment,
			this._tokenLength,
			this._isGenerator,
			// errors
			this._errors.length,
			// closures
			this._closures != null ? this._closures.length : 0,
			// objectTypesUsed
			this._objectTypesUsed.length,
			// templateInstantiationrequests
			this._templateInstantiationRequests.length
		);
	}

	function _restoreState (state : ParserState) : void {
		this._lineNumber = state.lineNumber;
		this._columnOffset = state.columnOffset;
		this._docComment = state.docComment;
		this._tokenLength = state.tokenLength;
		this._isGenerator = state.isGenerator;
		this._errors.length = state.numErrors;
		if (this._closures != null)
			this._closures.splice(state.numClosures, this._closures.length - state.numClosures);
		this._objectTypesUsed.splice(state.numObjectTypesUsed, this._objectTypesUsed.length - state.numObjectTypesUsed);
		this._templateInstantiationRequests.splice(state.numTemplateInstantiationRequests, this._templateInstantiationRequests.length - state.numTemplateInstantiationRequests);
	}

	// this is column offset, and is thus zero-origin
	function _getColumn () : number {
		return this._columnOffset;
	}

	function _newError (message : string) : void {
		this._errors.push(new CompileError(this._filename, this._lineNumber, this._getColumn(), message));
	}

	function _newError (message : string, lineNumber : number, columnOffset : number) : void {
		this._errors.push(new CompileError(this._filename, lineNumber, columnOffset, message));
	}

	function _newError (message : string, token : Token) : void {
		this._errors.push(new CompileError(token, message));
	}

	function _newDeprecatedWarning (message : string) : void {
		this._errors.push(new DeprecatedWarning(this._filename, this._lineNumber, this._getColumn(), message));
	}

	function _newExperimentalWarning(feature : Token) : void {
		this._errors.push(new ExperimentalWarning(feature, feature.getValue()));
	}

	function _advanceToken () : void {
		if (this._tokenLength != 0) {
			this._forwardPos(this._tokenLength);
			this._tokenLength = 0;
			this._docComment = null;
		}

		while (true) {
			// skip espaces and comments in-line
			while (true) {
				var matched = this._getInput().match(/^[ \t]+/);
				if (matched != null)
					this._forwardPos(matched[0].length);
				if (this._columnOffset != this._lines[this._lineNumber - 1].length)
					break;
				if (this._lineNumber == this._lines.length)
					break;
				this._lineNumber++;
				this._columnOffset = 0;
			}
			switch (this._getInputByLength(2)) {
			case "/*":
				if (this._getInputByLength(4) == "/***") {
					this._forwardPos(3); // skip to the last *, since the input might be: /***/
					var fileLevelDocComment = this._parseDocComment();
					if (fileLevelDocComment == null) {
						return;
					}
					// the first "/***" comment is the file-level doc comment
					if (this._fileLevelDocComment == null) {
						this._fileLevelDocComment = fileLevelDocComment;
					}
				} else if (this._getInputByLength(3) == "/**") {
					this._forwardPos(2); // skip to the last *, the input might be: /**/
					if ((this._docComment = this._parseDocComment()) == null) {
						return;
					}
				} else {
					this._forwardPos(2); // skip "/*"
					this._docComment = null;
					if (! this._skipMultilineComment()) {
						return;
					}
				}
				break;
			case "//":
				this._docComment = null;
				if (this._lineNumber == this._lines.length) {
					this._columnOffset = this._lines[this._lineNumber - 1].length;
				} else {
					this._lineNumber++;
					this._columnOffset = 0;
				}
				break;
			default:
				return;
			}
		}
	}

	function _skipMultilineComment () : boolean {
		var startLineNumber = this._lineNumber;
		var startColumnOffset = this._columnOffset;
		while (true) {
			var endAt = this._getInput().indexOf("*/");
			if (endAt != -1) {
				this._forwardPos(endAt + 2);
				return true;
			}
			if (this._lineNumber == this._lines.length) {
				this._columnOffset = this._lines[this._lineNumber - 1].length;
				this._errors.push(new CompileError(this._filename, startLineNumber, startColumnOffset, "could not find the end of the comment"));
				return false;
			}
			++this._lineNumber;
			this._columnOffset = 0;
		}
		return false;	// dummy
	}

	// parse jsxdoc comments
	function _parseDocComment () : DocComment {

		var docComment = new DocComment();
		var node : DocCommentNode = docComment;

		while (true) {
			// skip " * ", or return if "*/"
			var count = this._parseDocCommentAdvanceWhiteSpace();
			if (this._getInputByLength(2) == "*/") {
				this._forwardPos(2);
				break;
			} else if (this._getInputByLength(1) == "*") {
				this._forwardPos(1);
				this._parseDocCommentAdvanceWhiteSpace();
			}
			else {
				this._forwardPos(-count); // to keep indent
			}

			// fetch tag (and paramName), and setup the target node to push content into
			var tagMatch = this._getInput().match(/^\@([0-9A-Za-z_]+)[ \t]*/);
			if (tagMatch != null) {
				this._forwardPos(tagMatch[0].length);
				var tag = tagMatch[1];
				switch (tag) {
				case "param":
					var nameMatch = this._getInput().match(/[0-9A-Za-z_]+/);
					if (nameMatch != null) {
					     var token = new Token(nameMatch[0], false, this._filename, this._lineNumber, this._getColumn());
						this._forwardPos(nameMatch[0].length);
						node = new DocCommentParameter(token);
						docComment.getParams().push(node as DocCommentParameter);
					} else {
						this._newError("name of the parameter not found after @param");
						node = null;
					}
					break;
				default:
					node = new DocCommentTag(tag);
					docComment.getTags().push(node as DocCommentTag);
					break;
				}
			}
			var endAt = this._getInput().indexOf("*/");
			if (endAt != -1) {
				if (node != null) {
					node.appendDescription(this._getInput().substring(0, endAt) + "\n");
				}
				this._forwardPos(endAt + 2);
				break;
			}
			if (node != null) {
				node.appendDescription(this._getInput() + "\n");
			}
			if (this._lineNumber == this._lines.length) {
				this._columnOffset = this._lines[this._lineNumber - 1].length;
				this._newError("could not find the end of the doccomment");
				return null;
			}
			++this._lineNumber;
			this._columnOffset = 0;
		}
		return docComment;
	}

	function _parseDocCommentAdvanceWhiteSpace () : number {
		var count = 0;
		while (true) {
			var ch = this._getInputByLength(1);
			if (ch == " " || ch == "\t") {
				this._forwardPos(1);
				count++;
			} else {
				break;
			}
		}
		return count;
	}

	function _isEOF () : boolean {
		this._advanceToken();
		return this._lineNumber == this._lines.length && this._columnOffset == this._lines[this._lines.length - 1].length;
	}

	function _expectIsNotEOF () : boolean {
		if (this._isEOF()) {
			this._newError("unexpected EOF");
			return false;
		}
		return true;
	}

	function _expectOpt (expected : string, excludePattern : RegExp = null) : Token {
		return this._expectOpt([ expected ], excludePattern);
	}

	function _expectOpt (expected : string[], excludePattern : RegExp = null) : Token {
		this._advanceToken();
		for (var i = 0; i < expected.length; ++i) {
			if (this._completionRequest != null) {
				var offset = this._completionRequest.isInRange(this._lineNumber, this._columnOffset, expected[i].length);
				if (offset != -1) { //  && expected[i].match(/[A-Za-z]/) != null) {
					this._completionRequest.pushCandidates(new KeywordCompletionCandidate(expected[i]).setPrefix(this._getInputByLength(offset)));
				}
			}
			if (this._getInputByLength(expected[i].length) == expected[i]) {
				if (expected[i].match(_Lexer.rxIdent) != null
					&& this._getInput().match(_Lexer.rxIdent)[0].length != expected[i].length) {
					// part of a longer token
				} else if (excludePattern != null && this._getInput().match(excludePattern) != null) {
					// skip if the token matches the exclude pattern
				} else {
					// found
					this._tokenLength = expected[i].length;
					return new Token(expected[i], false, this._filename, this._lineNumber, this._getColumn());
				}
			}
		}
		return null;
	}

	function _expect (expected : string, excludePattern : RegExp = null) : Token {
		return this._expect([ expected ], excludePattern);
	}

	function _expect (expected : string[], excludePattern : RegExp = null) : Token {
		var token = this._expectOpt(expected, excludePattern);
		if (token == null) {
			// move to the point where expect
			// see t/compile_error/178
			var lineOffset = this._lineNumber - 1;
			var columnOffset = this._columnOffset - 1;
			while (lineOffset >= 0 && columnOffset >= 0) {
				if (! /[ \t\r\n]/.test(this._lines[lineOffset].charAt(columnOffset) ?: " ")) {
					break;
				}

				if (columnOffset != 0) {
					columnOffset--;
				}
				else {
					do {
						columnOffset = this._lines[--lineOffset].length - 1;
					} while (this._lines[lineOffset].length == 0 && lineOffset >= 0);
				}
			}

			this._newError("expected keyword: " + expected.join(" "), lineOffset + 1, columnOffset + 1);
			return null;
		}
		return token;
	}

	function _expectIdentifierOpt (completionCb : function(:Parser):CompletionCandidates = null) : Token {
		this._advanceToken();
		var matched = this._getInput().match(_Lexer.rxIdent);
		if (completionCb != null && this._completionRequest != null) {
			var offset = this._completionRequest.isInRange(this._lineNumber, this._columnOffset, matched != null ? matched[0].length : 0);
			if (offset != -1) {
				this._completionRequest.pushCandidates(completionCb(this).setPrefix(matched[0].substring(0, offset)));
			}
		}
		if (matched == null)
			return null;
		this._tokenLength = matched[0].length;
		var token = new Token(matched[0], true, this._filename, this._lineNumber, this._getColumn());
		if (_Lexer.keywords.hasOwnProperty(matched[0])) {
			this._newError("expected an identifier but found a keyword", token);
			return null;
		}
		if (_Lexer.reserved.hasOwnProperty(matched[0])) {
			this._newError("expected an identifier but found a reserved word", token);
			return null;
		}
		return token;
	}

	function _expectIdentifier (completionCb : function(:Parser):CompletionCandidates = null) : Token {
		var token = this._expectIdentifierOpt(completionCb);
		if (token != null)
			return token;
		this._newError("expected an identifier");
		return null;
	}

	function _expectStringLiteralOpt () : Token {
		this._advanceToken();
		var heredocStartMatch = this._getInput().match(_Lexer.rxHeredocStart);
		if (heredocStartMatch) {
			var preservedState = this._preserveState();
			var value = heredocStartMatch[0];
			this._forwardPos(value.length);
			var endRe = value.charAt(0) == '"' ? _Lexer.rxHeredocEndDoubleQuoted : _Lexer.rxHeredocEndSingleQuoted;
			while (true) {
				var input = this._getInput();
				var endMatch = input.match(endRe);
				if (endMatch) {
					value += endMatch[0];
					this._forwardPos(endMatch[0].length);
					break;
				}
				value += input + "\n";
				this._lineNumber++;
				this._columnOffset = 0;
				if (this._lineNumber > this._lines.length) {
					// EOF
					this._restoreState(preservedState);
					this._newError("unterminated multi-line string literal");
					break;
				}
			}
			return new Token(value, false, this._filename, preservedState.lineNumber, preservedState.columnOffset);
		}
		var matched = this._getInput().match(_Lexer.rxStringLiteral);
		if (matched == null)
			return null;
		this._tokenLength = matched[0].length;
		return new Token(matched[0], false, this._filename, this._lineNumber, this._getColumn());
	}

	function _expectStringLiteral () : Token {
		var token = this._expectStringLiteralOpt();
		if (token != null)
			return token;
		this._newError("expected a string literal");
		return null;
	}

	function _expectNumberLiteralOpt () : Token {
		this._advanceToken();
		var matched = this._getInput().match(_Lexer.rxIntegerLiteral);
		if (matched == null)
			matched = this._getInput().match(_Lexer.rxNumberLiteral);
		if (matched == null)
			return null;
		this._tokenLength = matched[0].length;
		return new Token(matched[0], false, this._filename, this._lineNumber, this._getColumn());
	}

	function _expectRegExpLiteralOpt () : Token {
		this._advanceToken();
		var matched = this._getInput().match(_Lexer.rxRegExpLiteral);
		if (matched == null)
			return null;
		this._tokenLength = matched[0].length;
		return new Token(matched[0], false, this._filename, this._lineNumber, this._getColumn());
	}

	function _skipStatement () : void {
		var advanced = false;
		while (! this._isEOF()) {
			switch (this._getInputByLength(1)) {
			case ";":
				// return after the semicolon
				this._tokenLength = 1;
				this._advanceToken();
				return;
			case "{":
				if (! advanced) {
					this._tokenLength = 1;
					this._advanceToken();
				}
				return;
			case "}":
				// return before the block token
				return;
			}
			this._tokenLength = 1;
			this._advanceToken();
			advanced = true;
		}
	}

	function _importStatement (importToken : Token) : boolean {
		// parse
		var classes = null : Token[];
		var token = this._expectIdentifierOpt();
		if (token != null) {
			classes = [ token ];
			while (true) {
				if ((token = this._expect([ ",", "from" ])) == null)
					return false;
				if (token.getValue() == "from")
					break;
				if ((token = this._expectIdentifier()) == null)
					return false;
				classes.push(token);
			}
		}
		var filenameToken = this._expectStringLiteral();
		if (filenameToken == null)
			return false;
		var alias = null : Token;
		if (this._expectOpt("into") != null) {
			if ((alias = this._expectIdentifier()) == null)
				return false;
		}
		if (this._expect(";") == null)
			return false;
		// check conflict
		if (alias != null && Util.isBuiltInClass(alias.getValue())) {
			this._errors.push(new CompileError(alias, "cannot use name of a built-in class as an alias"));
			return false;
		}
		if (classes != null) {
			var success = true;
			for (var i = 0; i < this._imports.length; ++i)
				for (var j = 0; j < classes.length; ++j)
					if (! this._imports[i].checkNameConflict(this._errors, classes[j]))
						success = false;
			if (! success)
				return false;
		} else {
			for (var i = 0; i < this._imports.length; ++i) {
				if (alias == null) {
					if (this._imports[i].getAlias() == null && this._imports[i].getFilenameToken().getValue() == filenameToken.getValue()) {
						this._errors.push(new CompileError(filenameToken, "cannot import the same file more than once (unless using an alias)"));
						return false;
					}
				} else {
					if (! this._imports[i].checkNameConflict(this._errors, alias))
						return false;
				}
			}
		}
		// push
		var imprt = Import.create(this._errors, filenameToken, alias, classes);
		if (imprt == null)
			return false;
		this._imports.push(imprt);
		return true;
	}

	function _expectClassDefOpt () : boolean {
		var state = this._preserveState();
		try {
			while (true) {
				var token = this._expectOpt([ "class", "interface", "mixin", "abstract", "final" ]);
				if (token == null)
					return false;
				if (token.getValue() == "class" || token.getValue() == "interface" || token.getValue() == "mixin")
					return true;
			}
		} finally {
			this._restoreState(state);
		}
		return true;	// dummy
	}

	function _classDefinition () : ClassDefinition {
		this._classType = null;
		this._extendType = null;
		this._implementTypes = new ParsedObjectType[];
		this._objectTypesUsed = new ParsedObjectType[];
		this._inners = new ClassDefinition[];
		this._templateInners = new TemplateClassDefinition[];
		// attributes* class
		this._classFlags = 0;
		if (this._outerClass) {
			// inherits flags from the outer classe
			this._classFlags |= this._outerClass.classFlags & (ClassDefinition.IS_NATIVE);
		}
		var nativeSource = null : Token;
		var docComment = null : DocComment;
		while (true) {
			var token = this._expect([ "class", "interface", "mixin", "abstract", "final", "native", "__fake__", "__export__" ]);
			if (token == null)
				return null;
			if (this._classFlags == 0)
				docComment = this._docComment;
			// "class", "interface", or "mixin"
			if (token.getValue() == "class") {
				break;
			}
			else if (token.getValue() == "interface") {
				if ((this._classFlags & (ClassDefinition.IS_FINAL | ClassDefinition.IS_NATIVE)) != 0) {
					this._newError("interface cannot have final or native attribute set");
					return null;
				}
				this._classFlags |= ClassDefinition.IS_INTERFACE;
				break;
			}
			else if (token.getValue() == "mixin") {
				if ((this._classFlags & (ClassDefinition.IS_FINAL | ClassDefinition.IS_NATIVE | ClassDefinition.IS_EXPORT)) != 0) {
					this._newError("mixin cannot have final, native, or __export__ attribute set");
					return null;
				}
				this._classFlags |= ClassDefinition.IS_MIXIN;
				break;
			}
			// class attributes
			var newFlag = 0;
			switch (token.getValue()) {
			case "abstract":
				newFlag = ClassDefinition.IS_ABSTRACT;
				break;
			case "final":
				newFlag = ClassDefinition.IS_FINAL;
				break;
			case "native":
				if (this._expectOpt("(") != null) { // native("...")
					this._newDeprecatedWarning("use of native(\"...\") is deprecated, use class N { ... } = \"...\"; instead");
					nativeSource = this._expectStringLiteral();
					this._expect(")");
				}
				newFlag = ClassDefinition.IS_NATIVE;
				break;
			case "__fake__":
				newFlag = ClassDefinition.IS_FAKE;
				break;
			case "__export__":
				newFlag = ClassDefinition.IS_EXPORT;
				break;
			default:
				throw new Error("logic flaw");
			}
			if ((this._classFlags & newFlag) != 0) {
				this._newError("same attribute cannot be specified more than once");
				return null;
			}
			this._classFlags |= newFlag;
		}
		var className = this._expectIdentifier();
		if (className == null)
			return null;
		// template
		if ((this._typeArgs = this._formalTypeArguments()) == null) {
			return null;
		}
		this._classType = new ParsedObjectType(
			new QualifiedName(className, (this._outerClass != null) ? this._outerClass.classType : null),
			this._typeArgs.map.<Type>(function (token : Token) : Type {
				// convert formal typearg (Token) to actual typearg (Type)
				return new ParsedObjectType(new QualifiedName(token), new Type[]);
			}));
		this._objectTypesUsed.push(this._classType);
		// extends
		if ((this._classFlags & (ClassDefinition.IS_INTERFACE | ClassDefinition.IS_MIXIN)) == 0) {
			if (this._expectOpt("extends") != null) {
				this._extendType = this._objectTypeDeclaration(
					null,
					true,
					function (classDef) {
						return (classDef.flags() & (ClassDefinition.IS_MIXIN | ClassDefinition.IS_INTERFACE | ClassDefinition.IS_FINAL)) == 0;
					});
			}
			if (this._extendType == null && className.getValue() != "Object") {
				this._extendType = new ParsedObjectType(new QualifiedName(new Token("Object", true)), new Type[]);
				this._objectTypesUsed.push(this._extendType);
			}
		} else {
			if ((this._classFlags & (ClassDefinition.IS_ABSTRACT | ClassDefinition.IS_FINAL | ClassDefinition.IS_NATIVE)) != 0) {
				this._newError("interface or mixin cannot have attributes: 'abstract', 'final', 'native");
				this._classFlags &= ~ (ClassDefinition.IS_ABSTRACT | ClassDefinition.IS_FINAL | ClassDefinition.IS_NATIVE); // erase the flags and continue
			}
		}
		// implements
		if (this._expectOpt("implements") != null) {
			do {
				var implementType = this._objectTypeDeclaration(
					null,
					true,
					function (classDef) {
						return (classDef.flags() & (ClassDefinition.IS_MIXIN | ClassDefinition.IS_INTERFACE)) != 0;
					});
				if (implementType != null) {
					this._implementTypes.push(implementType);
				}
			} while (this._expectOpt(",") != null);
		}
		// body
		if (this._expect("{") == null)
			return null;
		var members = new MemberDefinition[];

		var success = true;
		while (this._expectOpt("}") == null) {
			if (! this._expectIsNotEOF())
				break;
			if (this._expectClassDefOpt()) {
				this._pushClassState();

				// parse inner class
				if (this._classDefinition() == null)
					this._skipStatement();

				this._popClassState();
				continue;
			}
			var member = this._memberDefinition();
			if (member != null) {
				members.push(member);
			} else {
				this._skipStatement();
			}
		}

		// in-line native definition
		var assignToken = this._expectOpt("=");
		if (assignToken  != null) {
			nativeSource = this._expectStringLiteral();
			if (this._expect(";") == null) {
				return null;
			}
			if ((this._classFlags & ClassDefinition.IS_NATIVE) == 0) {
				this._errors.push(new CompileError(assignToken, "in-line native definition requires native attribute"));
				return null;
			}
		}

		// check name conflicts
		if ((this._classFlags & ClassDefinition.IS_NATIVE) == 0 && Util.isBuiltInClass(className.getValue())) {
			// any better way to check that we are parsing a built-in file?
			this._errors.push(new CompileError(className, "cannot re-define a built-in class"));
			success = false;
		} else if (this._outerClass != null) {
			for (var i = 0; i < this._outerClass.inners.length; ++i) {
				if (this._outerClass.inners[i].className() == className.getValue()) {
					this._errors.push(new CompileError(className, "a non-template inner class with the same name has been already declared"));
					success = false;
					break;
				}
			}
			for (var i = 0; i < this._outerClass.templateInners.length; ++i) {
				if (this._outerClass.templateInners[i].className() == className.getValue()) {
					this._errors.push(new CompileError(className, "a template inner class with the same name has been already declared"));
					success = false;
					break;
				}
			}
		} else {
			for (var i = 0; i < this._imports.length; ++i)
				if (! this._imports[i].checkNameConflict(this._errors, className))
					success = false;
			for (var i = 0; i < this._classDefs.length; ++i) {
				if (this._classDefs[i].className() == className.getValue()) {
					this._errors.push(new CompileError(className, "a non-template class with the same name has been already declared"));
					success = false;
					break;
				}
			}
			for (var i = 0; i < this._templateClassDefs.length; ++i) {
				if (this._templateClassDefs[i].className() == className.getValue()) {
					this._errors.push(new CompileError(className, "a template class with the name same has been already declared"));
					success = false;
					break;
				}
			}
		}

		if (! success)
			return null;

		// done
		var classDef : ClassDefinition;
		if (this._typeArgs.length != 0) {
			var templateClassDef = new TemplateClassDefinition(className, className.getValue(), this._classFlags, this._typeArgs, this._extendType, this._implementTypes, members, this._inners, this._templateInners, this._objectTypesUsed, docComment);
			if (this._outerClass != null) {
				this._outerClass.templateInners.push(templateClassDef);
			} else {
				this._templateClassDefs.push(templateClassDef);
			}
			classDef = templateClassDef;
		} else {
			classDef = new ClassDefinition(className, className.getValue(), this._classFlags, this._extendType, this._implementTypes, members, this._inners, this._templateInners, this._objectTypesUsed, docComment);
			if (this._outerClass != null) {
				this._outerClass.inners.push(classDef);
			} else {
				this._classDefs.push(classDef);
			}
		}
		if (nativeSource != null) {
			classDef.setNativeSource(nativeSource);
		}
		classDef.setParser(this);
		return classDef;
	}

	function _memberDefinition () : MemberDefinition {
		var flags = 0;
		var isNoExport = false;
		var docComment = null : DocComment;
		while (true) {
			var token = this._expect([ "function", "var", "static", "abstract", "override", "final", "const", "native", "__readonly__", "inline", "__pure__", "delete", "__export__", "__noexport__" ]);
			if (token == null)
				return null;
			if (flags == 0)
				docComment = this._docComment;
			if (token.getValue() == "const") {
				if ((flags & ClassDefinition.IS_STATIC) == 0) {
					this._newError("constants must be static");
					return null;
				}
				flags |= ClassDefinition.IS_CONST;
				break;
			} else if (token.getValue() == "function" || token.getValue() == "var") {
				break;
			} else if (token.getValue() == "__noexport__") {
				if (isNoExport) {
					this._newError("same attribute cannot be specified more than once");
					return null;
				} else if ((flags & ClassDefinition.IS_EXPORT) != 0) {
					this._newError("cannot set the attribute, already declared as __export__");
					return null;
				}
				isNoExport = true;
			} else {
				var newFlag = 0;
				switch (token.getValue()) {
				case "static":
					if ((this._classFlags & (ClassDefinition.IS_INTERFACE | ClassDefinition.IS_MIXIN)) != 0) {
						this._newError("interfaces and mixins cannot have static members");
						return null;
					}
					newFlag = ClassDefinition.IS_STATIC;
					break;
				case "abstract":
					newFlag = ClassDefinition.IS_ABSTRACT;
					break;
				case "override":
					if ((this._classFlags & ClassDefinition.IS_INTERFACE) != 0) {
						this._newError("functions of an interface cannot have 'override' attribute set");
						return null;
					}
					newFlag = ClassDefinition.IS_OVERRIDE;
					break;
				case "final":
					if ((this._classFlags & ClassDefinition.IS_INTERFACE) != 0) {
						this._newError("functions of an interface cannot have 'final' attribute set");
						return null;
					}
					newFlag = ClassDefinition.IS_FINAL;
					break;
				case "native":
					newFlag = ClassDefinition.IS_NATIVE;
					break;
				case "__readonly__":
					newFlag = ClassDefinition.IS_READONLY;
					break;
				case "inline":
					newFlag = ClassDefinition.IS_INLINE;
					break;
				case "__pure__":
					newFlag = ClassDefinition.IS_PURE;
					break;
				case "delete":
					newFlag = ClassDefinition.IS_DELETE;
					break;
				case "__export__":
					if (isNoExport) {
						this._newError("cannot set the attribute, already declared as __noexport__");
						return null;
					}
					newFlag = ClassDefinition.IS_EXPORT;
					break;
				default:
					throw new Error("logic flaw");
				}
				if ((flags & newFlag) != 0) {
					this._newError("same attribute cannot be specified more than once");
					return null;
				}
				flags |= newFlag;
			}
		}
		function shouldExport(name : string) : boolean {
			if (isNoExport)
				return false;
			if ((this._classFlags & ClassDefinition.IS_EXPORT) == 0)
				return false;
			if (name.charAt(0) == "_")
				return false;
			return true;
		}
		if ((this._classFlags & ClassDefinition.IS_INTERFACE) != 0)
			flags |= ClassDefinition.IS_ABSTRACT;
		if (token.getValue() == "function") {
			return this._functionDefinition(token, flags, docComment, shouldExport);
		}
		// member variable decl.
		if ((flags & ~(ClassDefinition.IS_STATIC | ClassDefinition.IS_ABSTRACT | ClassDefinition.IS_CONST | ClassDefinition.IS_READONLY | ClassDefinition.IS_EXPORT)) != 0) {
			this._newError("variables may only have attributes: static, abstract, const");
			return null;
		}
		if ((flags & ClassDefinition.IS_READONLY) != 0 && (this._classFlags & ClassDefinition.IS_NATIVE) == 0) {
			this._newError("only native classes may use the __readonly__ attribute");
			return null;
		}
		var name = this._expectIdentifier();
		if (name == null)
			return null;
		if (shouldExport(name.getValue()))
			flags |= ClassDefinition.IS_EXPORT;
		var type = null : Type;
		if (this._expectOpt(":") != null)
			if ((type = this._typeDeclaration(false)) == null)
				return null;
		var initialValue = null : Expression;
		var closures = new MemberFunctionDefinition[];
		if (this._expectOpt("=") != null) {
			if ((flags & ClassDefinition.IS_ABSTRACT) != 0) {
				this._newError("abstract variable cannot have default value");
				return null;
			}
			this._closures = closures;
			initialValue = this._assignExpr(false);
			this._closures = null;
			if (initialValue == null)
				return null;
		}
		if (type == null && initialValue == null) {
			this._newError("variable declaration should either have type declaration or initial value");
			return null;
		}
		if (! this._expect(";"))
			return null;
		// all non-native, non-template values have initial value
		if (this._typeArgs.length == 0 && initialValue == null && (this._classFlags & ClassDefinition.IS_NATIVE) == 0)
			initialValue = Expression.getDefaultValueExpressionOf(type);
		return new MemberVariableDefinition(token, name, flags, type, initialValue, closures, docComment);
	}

	function _functionDefinition (token : Token, flags : number, docComment : DocComment, shouldExport : function (name : string) : boolean) : MemberFunctionDefinition {
		// name
		var name = this._expectIdentifier();
		if (name == null)
			return null;
		if (shouldExport(name.getValue()))
			flags |= ClassDefinition.IS_EXPORT;
		if (name.getValue() == "constructor") {
			if ((this._classFlags & ClassDefinition.IS_INTERFACE) != 0) {
				this._newError("interface cannot have a constructor");
				return null;
			}
			if ((flags & (ClassDefinition.IS_ABSTRACT | ClassDefinition.IS_FINAL)) != 0) {
				this._newError("constructor cannot be declared as 'abstract' or 'final'");
				return null;
			}
			flags |= ClassDefinition.IS_FINAL;
		}
		flags |= this._classFlags & (ClassDefinition.IS_NATIVE | ClassDefinition.IS_FINAL);

		// parse type args and add to the current typearg list
		var typeArgs = this._formalTypeArguments();
		if (typeArgs == null) {
			return null;
		}
		this._typeArgs = this._typeArgs.concat(typeArgs);
		var numObjectTypesUsed = this._objectTypesUsed.length;

		this._pushScope(null, null);
		try {
			if (this._expect("(") == null)
				return null;
			// arguments
			var args = this._functionArgumentsExpr((this._classFlags & ClassDefinition.IS_NATIVE) != 0, true, true);
			if (args == null)
				return null;
			// return type
			var returnType = null : Type;
			if (name.getValue() == "constructor") {
				// no return type
				returnType = Type.voidType;
			} else {
				if (this._expect(":") == null)
					return null;
				returnType = this._typeDeclaration(true);
				if (returnType == null)
					return null;
			}
			// take care of: "delete function constructor();"
			if ((flags & ClassDefinition.IS_DELETE) != 0) {
				if (name.getValue() != "constructor" || (flags & ClassDefinition.IS_STATIC) != 0) {
					this._newError("only constructors may have the \"delete\" attribute set");
					return null;
				}
				if (args.length != 0) {
					this._newError("cannot \"delete\" a constructor with one or more arguments");
					return null;
				}
			}
			function createDefinition(locals : LocalVariable[], statements : Statement[], closures : MemberFunctionDefinition[], lastToken : Token) : MemberFunctionDefinition {
				return typeArgs.length != 0
					? new TemplateFunctionDefinition(token, name, flags, typeArgs, returnType, args, locals, statements, closures, lastToken, docComment) as MemberFunctionDefinition
					: new MemberFunctionDefinition(token, name, flags, returnType, args, locals, statements, closures, lastToken, docComment);
			}
			// take care of abstract function
			if ((this._classFlags & ClassDefinition.IS_INTERFACE) != 0) {
				if (this._expect(";") == null)
					return null;
				return createDefinition(null, null, new MemberFunctionDefinition[], null);
			} else if ((flags & (ClassDefinition.IS_ABSTRACT | ClassDefinition.IS_NATIVE | ClassDefinition.IS_DELETE)) != 0) {
				// "delete function constructor() {} is permitted for backwards compatibility
				var endDeclToken = this._expect([ ";", "{" ]);
				if (endDeclToken == null)
					return null;
				if (endDeclToken.getValue() == ";")
					return createDefinition(null, null, new MemberFunctionDefinition[], null);
			} else {
				if (this._expect("{") == null)
					return null;
			}
			// body
			this._arguments = args;
			if (name.getValue() == "constructor")
				var lastToken = this._initializeBlock();
			else
				lastToken = this._block();
			var funcDef = createDefinition(this._locals, this._statements, this._closures, lastToken);
			return funcDef;
		} finally {
			this._popScope();

			this._typeArgs.splice(this._typeArgs.length - typeArgs.length, this._typeArgs.length);
			if (typeArgs.length != 0) {
				this._objectTypesUsed.splice(numObjectTypesUsed, this._objectTypesUsed.length - numObjectTypesUsed);
			}
		}
	}

	function _formalTypeArguments () : Token[] {
		if (this._expectOpt(".") == null) {
			return new Token[];
		}
		if (this._expect("<") == null) {
			return null;
		}
		var typeArgs = new Token[];
		do {
			var typeArg = this._expectIdentifier();
			if (typeArg == null)
				return null;
			typeArgs.push(typeArg);
			var token = this._expectOpt([ ",", ">" ]);
			if (token == null)
				return null;
		} while (token.getValue() == ",");
		return typeArgs;
	}

	function _actualTypeArguments () : Type[] {
		var types = new Type[];
		var state = this._preserveState();
		if (this._expectOpt(".") == null) {
			return types;
		}
		if (this._expect("<") == null) {
			this._restoreState(state);
			return types;
		}
		// in type argument
		do {
			var type = this._typeDeclaration(true);
			if (type == null)
				return null;
			types.push(type);
			var token = this._expect([ ">", "," ]);
			if (token == null)
				return null;
		} while (token.getValue() == ",");
		return types;
	}

	function _typeDeclaration (allowVoid : boolean) : Type {
		var token;
		var typeDecl : Type;
		if ((token = this._expectOpt("void")) != null) {
			typeDecl = Type.voidType;
		} else {
			typeDecl = this._typeDeclarationNoVoidNoYield();
			if (typeDecl == null)
				return null;
		}
		// yield
		while (this._expectOpt("yield") != null) {
			var genType = this._typeDeclaration(true);
			if (genType == null) {
				return null;
			}
			typeDecl = this._registerGeneratorTypeOf(typeDecl, genType);
		}
		if (! allowVoid && typeDecl.equals(Type.voidType)) {
			this._newError("'void' cannot be used here", token);
			return null;
		}
		return typeDecl;
	}

	function _typeDeclarationNoVoidNoYield () : Type {
		var typeDecl = this._typeDeclarationNoArrayNoVoidNoYield();
		if (typeDecl == null)
			return null;
		// []
		while (this._expectOpt("[") != null) {
			var token;
			if ((token = this._expect("]")) == null)
				return null;
			if (typeDecl instanceof NullableType) {
				this._newError("Nullable.<T> cannot be an array, should be: T[]");
				return null;
			}
			typeDecl = this._registerArrayTypeOf(token, typeDecl);
		}
		return typeDecl;
	}

	function _typeDeclarationNoArrayNoVoidNoYield () : Type {
		var token = this._expectOpt([ "MayBeUndefined", "Nullable", "variant" ]);
		if (token == null) {
			return this._primaryTypeDeclaration();
		}
		switch (token.getValue()) {
		case "MayBeUndefined":
			this._newDeprecatedWarning("use of 'MayBeUndefined' is deprecated, use 'Nullable' instead");
			// falls through
		case "Nullable":
			return this._nullableTypeDeclaration();
		case "variant":
			return Type.variantType;
		default:
			throw new Error("logic flaw");
		}
	}

	function _nullableTypeDeclaration () : Type {
		if (this._expect(".") == null || this._expect("<") == null)
			return null;
		var baseType = this._typeDeclaration(true);
		if (baseType == null)
			return null;
		if (this._expect(">") == null)
			return null;
		if (baseType.equals(Type.variantType)) {
			this._newError("variant cannot be declared as nullable (since it is always nullable)");
			return null;
		}
		if (baseType instanceof NullableType) {
			this._newError("nested Nullable.<T> is forbidden");
			return null;
		}
		if (this._typeArgs != null) {
			for (var i = 0; i < this._typeArgs.length; ++i) {
				if (baseType.equals(new ParsedObjectType(new QualifiedName(this._typeArgs[i]), new Type[]))) {
					return baseType.toNullableType(true);
				}
			}
		}
		return baseType.toNullableType();
	}

	function _primaryTypeDeclaration () : Type {
		var token = this._expectOpt([ "(", "function", "boolean", "int", "number", "string" ]);
		if (token != null) {
			switch (token.getValue()) {
			case "(":
				return this._lightFunctionTypeDeclaration(null);
			case "function":
				return this._functionTypeDeclaration(null);
			case "boolean":
				return Type.booleanType;
			case "int":
				return Type.integerType;
			case "number":
				return Type.numberType;
			case "string":
				return Type.stringType;
			default:
				throw new Error("logic flaw");
			}
		} else {
			return this._objectTypeDeclaration(null, true, null);
		}
	}

	function _objectTypeDeclaration (firstToken : Token, allowInner : boolean, autoCompleteMatchCb : function(:ClassDefinition):boolean) : ParsedObjectType {
		var token;
		if (firstToken == null) {
			if (this._classType != null && (token = this._expectOpt("__CLASS__")) != null) {
				// ok
			} else if ((token = this._expectIdentifier(function (self) { return self._getCompletionCandidatesOfTopLevel(autoCompleteMatchCb); })) == null)
				return null;
		} else {
			token = firstToken;
		}
		if (token.getValue() == "variant") {
			this._errors.push(new CompileError(token, "cannot use 'variant' as a class name"));
			return null;
		} else if (token.getValue() == "Nullable" || token.getValue() == "MayBeUndefined") {
			this._errors.push(new CompileError(token, "cannot use 'Nullable' (or MayBeUndefined) as a class name"));
			return null;
		} else if (token.getValue() == "__CLASS__") {
			return this._classType;
		}
		// import part
		var imprt = this.lookupImportAlias(token.getValue());
		if (imprt != null) {
			if (this._expect(".") == null)
				return null;
			token = this._expectIdentifier(function (self) { return self._getCompletionCandidatesOfNamespace(imprt, autoCompleteMatchCb); });
			if (token == null)
				return null;
		}
		if (! allowInner) {
			var qualifiedName = new QualifiedName(token, imprt);

			var typeArgs = this._actualTypeArguments();
			if (typeArgs == null) {
				return null;
			} else if (typeArgs.length != 0) {
				return this._templateTypeDeclaration(qualifiedName, typeArgs);
			} else {
				// object
				var objectType = new ParsedObjectType(qualifiedName, new Type[]);
				this._objectTypesUsed.push(objectType);
				return objectType;
			}
		} else {
			var enclosingType : ParsedObjectType = null;
			while (true) {
				qualifiedName = enclosingType != null ? new QualifiedName(token, enclosingType) : new QualifiedName(token, imprt);

				var typeArgs = this._actualTypeArguments();
				if (typeArgs == null) {
					return null;
				} else if (typeArgs.length != 0) {
					enclosingType = this._templateTypeDeclaration(qualifiedName, typeArgs);
				} else {
					var objectType = new ParsedObjectType(qualifiedName, new Type[]);
					this._objectTypesUsed.push(objectType);
					enclosingType = objectType;
				}

				if (this._expectOpt(".") == null)
					break;
				token = this._expectIdentifier();
				if (token == null)
					return null;
			}
			return enclosingType;
		}
	}

	function _templateTypeDeclaration (qualifiedName : QualifiedName, typeArgs : Type[]) : ParsedObjectType {
		var className = qualifiedName.getToken().getValue();
		if (className == "Array" || className == "Map") {
			if (typeArgs[0] instanceof NullableType) {
				this._newError("cannot declare " + className + ".<Nullable.<T>>, should be " + className + ".<T>");
				return null;
			}
			if (typeArgs[0].equals(Type.voidType)) {
				this._newError("cannot declare " + className + ".<T> with T=void");
				return null;
			}
		}
		// return object type
		var objectType = new ParsedObjectType(qualifiedName, typeArgs);
		this._objectTypesUsed.push(objectType);
		return objectType;
	}

	function _lightFunctionTypeDeclaration (objectType : Type) : Type {
		// parse args
		var argTypes = new Type[];
		if (this._expectOpt(")") == null) {
			do {
				var isVarArg = this._expectOpt("...") != null;
				var argType = this._typeDeclaration(false);
				if (argType == null)
					return null;
				if (isVarArg) {
					argTypes.push(new VariableLengthArgumentType(argType));
					if (this._expect(")") == null)
						return null;
					break;
				}
				argTypes.push(argType);
				var token = this._expect([ ")", "," ]);
				if (token == null)
					return null;
			} while (token.getValue() == ",");
		}
		// parse return type
		if (this._expect(["->", "=>"]) == null)
			return null;
		var returnType = this._typeDeclaration(true);
		if (returnType == null)
			return null;
		if (objectType != null)
			return new MemberFunctionType(null, objectType, returnType, argTypes, true);
		else
			return new StaticFunctionType(null, returnType, argTypes, true);
	}

	function _functionTypeDeclaration (objectType : Type) : Type {
		// optional function name
		this._expectIdentifierOpt();
		// parse args
		if(this._expect("(") == null)
			return null;
		var argTypes = new Type[];
		if (this._expectOpt(")") == null) {
			do {
				var isVarArg = this._expectOpt("...") != null;
				this._expectIdentifierOpt(); // may have identifiers
				if (this._expect(":") == null)
					return null;
				var argType = this._typeDeclaration(false);
				if (argType == null)
					return null;
				if (isVarArg) {
					argTypes.push(new VariableLengthArgumentType(argType));
					if (this._expect(")") == null)
						return null;
					break;
				}
				argTypes.push(argType);
				var token = this._expect([ ")", "," ]);
				if (token == null)
					return null;
			} while (token.getValue() == ",");
		}
		// parse return type
		if (this._expect(":") == null)
			return null;
		var returnType = this._typeDeclaration(true);
		if (returnType == null)
			return null;
		if (objectType != null)
			return new MemberFunctionType(null, objectType, returnType, argTypes, true);
		else
			return new StaticFunctionType(null, returnType, argTypes, true);
	}

	function _registerArrayTypeOf (token : Token, elementType : Type) : ParsedObjectType {
		// var arrayType = new ParsedObjectType(new QualifiedName(new Token("Array", true), null), [ elementType ], token);
		var arrayType = new ParsedObjectType(new QualifiedName(new Token("Array", true)), [ elementType ]);
		this._objectTypesUsed.push(arrayType);
		return arrayType;
	}

	function _registerGeneratorTypeOf (seedType : Type, genType : Type) : ParsedObjectType {
		var generatorType = new ParsedObjectType(new QualifiedName(new Token("Generator", true)), [ seedType, genType ]);
		this._objectTypesUsed.push(generatorType);
		return generatorType;
	}

	function _initializeBlock () : Token {
		var token;
		while ((token = this._expectOpt("}")) == null) {
			var state = this._preserveState();
			if (! this._constructorInvocationStatement()) {
				this._restoreState(state);
				return this._block();
			}
		}
		return token;
	}

	function _block () : Token {
		var token;
		while ((token = this._expectOpt("}")) == null) {
			if (! this._expectIsNotEOF())
				return null;
			if (! this._statement())
				this._skipStatement();
		}
		return token;
	}

	function _statement () : boolean {
		// has a label?
		var state = this._preserveState();
		var label = this._expectIdentifierOpt();
		if (label != null && this._expectOpt(":") != null) {
			// within a label
		} else {
			this._restoreState(state);
			label = null;
		}
		// parse the statement
		var token = this._expectOpt([
			"{", "var", ";", "if", "do", "while", "for", "continue", "break", "return", "switch", "throw", "try", "assert", "log", "delete", "debugger", "function", "void", "const"
		]);
		if (label != null) {
			if (! (token != null && token.getValue().match(/^(?:do|while|for|switch)$/) != null)) {
				this._newError("only blocks, iteration statements, and switch statements are allowed after a label");
				return false;
			}
		}
		if (token != null) {
			switch (token.getValue()) {
			case "{":
				return this._block() != null;
			case "var":
				return this._variableStatement(false);
			case "const":
				return this._variableStatement(true);
			case ";":
				return true;
			case "if":
				return this._ifStatement(token);
			case "do":
				return this._doWhileStatement(token, label);
			case "while":
				return this._whileStatement(token, label);
			case "for":
				return this._forStatement(token, label);
			case "continue":
				return this._continueStatement(token);
			case "break":
				return this._breakStatement(token);
			case "return":
				return this._returnStatement(token);
			case "switch":
				return this._switchStatement(token, label);
			case "throw":
				return this._throwStatement(token);
			case "try":
				return this._tryStatement(token);
			case "assert":
				return this._assertStatement(token);
			case "log":
				return this._logStatement(token);
			case "delete":
				return this._deleteStatement(token);
			case "debugger":
				return this._debuggerStatement(token);
			case "function":
				return this._functionStatement(token);
			case "void":
				// void is simply skipped
				break;
			default:
				throw new Error("logic flaw, got " + token.getValue());
			}
		}
		// expression statement
		var expr = this._expr(false);
		if (expr == null)
			return false;
		this._statements.push(new ExpressionStatement(expr));
		if (this._expect(";") == null)
			return false;
		return true;
	}

	function _constructorInvocationStatement () : boolean {
		// get class
		var token : Token;
		if ((token = this._expectOpt("super")) != null) {
			var classType = this._extendType;
		} else if ((token = this._expectOpt("this")) != null) {
			classType = this._classType;
		} else {
			if ((classType = this._objectTypeDeclaration(null, true, null)) == null)
				return false;
			token = classType.getToken();
			if (this._classType.equals(classType)) {
				// ok is calling the alternate constructor
			} else if (this._extendType != null && this._extendType.equals(classType)) {
				// ok is calling base class
			} else {
				for (var i = 0; i < this._implementTypes.length; ++i) {
					if (this._implementTypes[i].equals(classType)) {
						break;
					}
				}
				if (i == this._implementTypes.length) {
					// not found (and thus is not treated as a constructor invocation statement)
					return false;
				}
			}
		}
		// get args
		if (this._expect("(") == null)
			return false;
		var args = this._argsExpr();
		if (args == null)
			return false;
		if (this._expect(";") == null)
			return false;
		// success
		this._statements.push(new ConstructorInvocationStatement(token, classType, args));
		return true;
	}

	function _variableStatement (isConst : boolean) : boolean {
		var succeeded = [ false ];
		var expr = this._variableDeclarations(false, isConst, succeeded);
		if (! succeeded[0])
			return false;
		if (this._expect(";") == null)
			return false;
		if (expr != null)
			this._statements.push(new ExpressionStatement(expr));
		return true;
	}

	function _functionStatement (token : Token) : boolean {
		var isGenerator = false;
		if (this._expectOpt("*") != null)
			isGenerator = true;
		var name = this._expectIdentifier();
		if (name == null)
			return false;
		if (this._expect("(") == null)
			return false;
		var args = this._functionArgumentsExpr(false, true, false);
		if (args == null)
			return false;
		if (this._expect(":") == null)
			return false;
		var returnType = this._typeDeclaration(true);
		if (returnType == null) {
			return false;
		}
		if (this._expect("{") == null)
			return false;

		var funcLocal = this._registerLocal(name, new StaticFunctionType(token, returnType, args.map.<Type>((arg) -> arg.getType()), false), false, true);

		var funcDef = this._functionBody(token, name, funcLocal, args, returnType, true, isGenerator);
		if (funcDef == null) {
			return false;
		}
		this._closures.push(funcDef);
		funcDef.setFuncLocal(funcLocal);
		this._statements.push(new FunctionStatement(token, funcDef));
		return true;
	}

	function _ifStatement (token : Token) : boolean {
		if (this._expect("(") == null)
			return false;
		var expr = this._expr(false);
		if (expr == null)
			return false;
		if (this._expect(")") == null)
			return false;
		var onTrueStatements = this._subStatements();
		var onFalseStatements = new Statement[];
		if (this._expectOpt("else") != null) {
			onFalseStatements = this._subStatements();
		}
		this._statements.push(new IfStatement(token, expr, onTrueStatements, onFalseStatements));
		return true;
	}

	function _doWhileStatement (token : Token, label : Token) : boolean {
		var statements = this._subStatements();
		if (this._expect("while") == null)
			return false;
		if (this._expect("(") == null)
			return false;
		var expr = this._expr(false);
		if (expr == null)
			return false;
		if (this._expect(")") == null)
			return false;
		this._statements.push(new DoWhileStatement(token, label, expr, statements));
		return true;
	}

	function _whileStatement (token : Token, label : Token) : boolean {
		if (this._expect("(") == null)
			return false;
		var expr = this._expr(false);
		if (expr == null)
			return false;
		if (this._expect(")") == null)
			return false;
		var statements = this._subStatements();
		this._statements.push(new WhileStatement(token, label, expr, statements));
		return true;
	}

	function _forStatement (token : Token, label : Token) : boolean {
		var state = this._preserveState();
		// first try to parse as for .. in, and fallback to the other
		switch (this._forInStatement(token, label)) {
		case -1: // try for (;;)
			break;
		case 0: // error
			return false;
		case 1:
			return true;
		}
		this._restoreState(state);
		if (this._expect("(") == null)
			return false;
		// parse initialization expression
		var initExpr = null : Expression;
		if (this._expectOpt(";") != null) {
			// empty expression
		} else if (this._expectOpt("var") != null) {
			var succeeded = [ false ];
			initExpr = this._variableDeclarations(true, false, succeeded);
			if (! succeeded[0])
				return false;
			if (this._expect(";") == null)
				return false;
		} else {
			if ((initExpr = this._expr(true)) == null)
				return false;
			if (this._expect(";") == null)
				return false;
		}
		// parse conditional expression
		var condExpr = null : Expression;
		if (this._expectOpt(";") != null) {
			// empty expression
		} else {
			if ((condExpr = this._expr(false)) == null)
				return false;
			if (this._expect(";") == null)
				return false;
		}
		// parse post expression
		var postExpr = null : Expression;
		if (this._expectOpt(")") != null) {
			// empty expression
		} else {
			if ((postExpr = this._expr(false)) == null)
				return false;
			if (this._expect(")") == null)
				return false;
		}
		// statements
		var statements = this._subStatements();
		this._statements.push(new ForStatement(token, label, initExpr, condExpr, postExpr, statements));
		return true;
	}

	function _forInStatement (token : Token, label : Token) : number {
		if (this._expect("(") == null)
			return 0; // failure
		var lhsExpr;
		if (this._expectOpt("var") != null) {
			if ((lhsExpr = this._variableDeclaration(true, false)) == null)
				return -1; // retry the other
		} else {
			if ((lhsExpr = this._lhsExpr()) == null)
				return -1; // retry the other
		}
		if (this._expect("in") == null)
			return -1; // retry the other
		var listExpr = this._expr(false);
		if (listExpr == null)
			return 0;
		if (this._expect(")") == null)
			return 0;
		var statements = this._subStatements();
		this._statements.push(new ForInStatement(token, label, lhsExpr, listExpr, statements));
		return 1;
	}

	function _continueStatement (token : Token) : boolean {
		var label = this._expectIdentifierOpt();
		if (this._expect(";") == null)
			return false;
		this._statements.push(new ContinueStatement(token, label));
		return true;
	}

	function _breakStatement (token : Token) : boolean {
		var label = this._expectIdentifierOpt();
		if (this._expect(";") == null)
			return false;
		this._statements.push(new BreakStatement(token, label));
		return true;
	}

	function _returnStatement (token : Token) : boolean {
		if (this._expectOpt(";") != null) {
			this._statements.push(new ReturnStatement(token, null));
			return true;
		}
		var expr = this._expr(false);
		if (expr == null)
			return false;
		this._statements.push(new ReturnStatement(token, expr));
		if (this._expect(";") == null)
			return false;
		return true;
	}

	function _switchStatement (token : Token, label : Token) : Nullable.<boolean> {
		if (this._expect("(") == null)
			return false;
		var expr = this._expr(false);
		if (expr == null)
			return false;
		if (this._expect(")") == null
			|| this._expect("{") == null)
			return null;
		var foundCaseLabel = false;
		var foundDefaultLabel = false;
		// caseblock
		var startStatementIndex = this._statements.length;
		while (this._expectOpt("}") == null) {
			if (! this._expectIsNotEOF())
				return false;
			var caseOrDefaultToken;
			if (! foundCaseLabel && ! foundDefaultLabel) {
				// first statement within the block should start with a label
				if ((caseOrDefaultToken = this._expect([ "case", "default" ])) == null) {
					this._skipStatement();
					continue;
				}
			} else {
				caseOrDefaultToken = this._expectOpt([ "case", "default" ]);
			}
			if (caseOrDefaultToken != null) {
				if (caseOrDefaultToken.getValue() == "case") {
					var labelExpr = this._expr();
					if (labelExpr == null) {
						this._skipStatement();
						continue;
					}
					if (this._expect(":") == null) {
						this._skipStatement();
						continue;
					}
					this._statements.push(new CaseStatement(caseOrDefaultToken, labelExpr));
					foundCaseLabel = true;
				} else { // "default"
					if (this._expect(":") == null) {
						this._skipStatement();
						continue;
					}
					if (foundDefaultLabel) {
						this._newError("cannot have more than one default statement within one switch block");
						this._skipStatement();
						continue;
					}
					this._statements.push(new DefaultStatement(caseOrDefaultToken));
					foundDefaultLabel = true;
				}
			} else {
				if (! this._statement())
					this._skipStatement();
			}
		}
		// done
		this._statements.push(new SwitchStatement(token, label, expr, (this._statements.splice(startStatementIndex, this._statements.length - startStatementIndex))));
		return true;
	}

	function _throwStatement (token : Token) : boolean {
		var expr = this._expr();
		if (expr == null)
			return false;
		if (this._expect(";") == null)
			return false;
		this._statements.push(new ThrowStatement(token, expr));
		return true;
	}

	function _tryStatement (tryToken : Token) : boolean {
		if (this._expect("{") == null)
			return false;
		var startIndex = this._statements.length;
		if (this._block() == null)
			return false;
		var tryStatements = this._statements.splice(startIndex, this._statements.length - startIndex);
		var catchStatements = new CatchStatement[];
		var catchOrFinallyToken = this._expect([ "catch", "finally" ]);
		if (catchOrFinallyToken == null)
			return false;
		for (;
			catchOrFinallyToken != null && catchOrFinallyToken.getValue() == "catch";
			catchOrFinallyToken = this._expectOpt([ "catch", "finally" ])) {
			var catchIdentifier;
			var catchType;
			if (this._expect("(") == null
				|| (catchIdentifier = this._expectIdentifier()) == null
				|| this._expect(":") == null
				|| (catchType = this._typeDeclaration(false)) == null
				|| this._expect(")") == null
				|| this._expect("{") == null)
				return false;
			var caughtVariable = new CaughtVariable(catchIdentifier, catchType);
			this._locals.push(caughtVariable);
			try {
				if (this._block() == null) {
					return false;
				}
			} finally {
				this._locals.splice(this._locals.indexOf(caughtVariable), 1);
			}
			catchStatements.push(new CatchStatement(catchOrFinallyToken, caughtVariable, this._statements.splice(startIndex, this._statements.length - startIndex)));
		}
		if (catchOrFinallyToken != null) {
			// finally
			if (this._expect("{") == null)
				return false;
			if (this._block() == null)
				return false;
			var finallyStatements = this._statements.splice(startIndex, this._statements.length - startIndex);
		} else {
			finallyStatements = new Statement[];
		}
		this._statements.push(new TryStatement(tryToken, tryStatements, catchStatements, finallyStatements));
		return true;
	}

	function _assertStatement (token : Token) : boolean {
		var expr = this._assignExpr(false);
		if (expr == null)
			return false;
		var msgExpr : Expression = null;
		if (this._expectOpt(",") != null) {
			msgExpr = this._assignExpr(false);
			if (msgExpr == null)
				return false;
		}
		if (this._expect(";") == null)
			return false;
		this._statements.push(new AssertStatement(token, expr, msgExpr));
		return true;
	}

	function _logStatement (token : Token) : boolean {
		var exprs = new Expression[];
		do {
			var expr = this._assignExpr(false);
			if (expr == null)
				return false;
			exprs.push(expr);
		} while (this._expectOpt(",") != null);
		if (this._expect(";") == null)
			return false;
		if (exprs.length == 0) {
			this._newError("no arguments");
			return false;
		}
		this._statements.push(new LogStatement(token, exprs));
		return true;
	}

	function _deleteStatement (token : Token) : boolean {
		var expr = this._expr();
		if (expr == null)
			return false;
		if (this._expect(";") == null)
			return false;
		this._statements.push(new DeleteStatement(token, expr));
		return true;
	}

	function _debuggerStatement (token : Token) : boolean {
		this._statements.push(new DebuggerStatement(token));
		return true;
	}

	function _subStatements () : Statement[] {
		var statementIndex = this._statements.length;
		if (! this._statement())
			this._skipStatement();
		return this._statements.splice(statementIndex, this._statements.length - statementIndex);
	}

	function _variableDeclarations (noIn : boolean, isConst : boolean, isSuccess : boolean[]) : Expression {
		isSuccess[0] = false;
		var expr = null : Expression;
		var commaToken = null : Token;
		do {
			var declExpr = this._variableDeclaration(noIn, isConst);
			if (declExpr == null)
				return null;
			// do not push variable declarations wo. assignment
			if (! (declExpr instanceof LocalExpression))
				expr = expr != null ? (new CommaExpression(commaToken, expr, declExpr) as Expression) : declExpr;
		} while ((commaToken = this._expectOpt(",")) != null);
		isSuccess[0] = true;
		return expr;
	}

	function _variableDeclaration (noIn : boolean, isConst : boolean) : Expression {
		var identifier = this._expectIdentifier();
		if (identifier == null)
			return null;
		var type = null : Type;
		if (this._expectOpt(":"))
			if ((type = this._typeDeclaration(false)) == null)
				return null;
		// FIXME value should be registered after parsing the initialization expression, but that prevents: var f = function () : void { f(); };
		var local = this._registerLocal(identifier, type, isConst);
		// parse initial value (optional)
		var initialValue = null : Expression;
		var assignToken;
		if ((assignToken = this._expectOpt("=")) == null) {
			if (isConst) {
				this._newError("initializer expression is mandatory for constant declaration");
				return null;
			}
		} else {
			if ((initialValue = this._assignExpr(noIn)) == null)
				return null;
		}
		var expr : Expression = new LocalExpression(identifier, local);
		if (initialValue != null)
			expr = new AssignmentExpression(assignToken, expr, initialValue);
		return expr;
	}

	function _expr () : Expression {
		return this._expr(false);
	}

	function _expr (noIn : boolean) : Expression {
		var expr = this._assignExpr(noIn);
		if (expr == null)
			return null;
		var commaToken;
		while ((commaToken = this._expectOpt(",")) != null) {
			var assignExpr = this._assignExpr(noIn);
			if (assignExpr == null)
				break;
			expr = new CommaExpression(commaToken, expr, assignExpr);
		}
		return expr;
	}

	function _assignExpr () : Expression {
		return this._assignExpr(false);
	}

	function _assignExpr (noIn : boolean) : Expression {
		var state = this._preserveState();
		// FIXME contrary to ECMA 262, we first try lhs op assignExpr, and then condExpr; does this have any problem?
		// lhs
		var lhsExpr = this._lhsExpr();
		if (lhsExpr != null) {
			var op = this._expect([ "=", "*=", "/=", "%=", "+=", "-=", "<<=", ">>=", ">>>=", "&=", "^=", "|=" ], /^==/);
			if (op != null) {
				var assignExpr = this._assignExpr(noIn);
				if (assignExpr == null)
					return null;
				if (op.getValue() == "=") {
					return new AssignmentExpression(op, lhsExpr, assignExpr);
				}
				else {
					return new FusedAssignmentExpression(op, lhsExpr, assignExpr);
				}
			}
		}
		// failed to parse as lhs op assignExpr, try condExpr
		this._restoreState(state);
		return this._yieldExpr(noIn);
	}

	function _yieldExpr (noIn : boolean) : Expression {
		var operatorToken;
		if ((operatorToken = this._expectOpt("yield")) != null) {
			this._newExperimentalWarning(operatorToken);
			if (! this._isGenerator) {
				this._newError("invalid use of 'yield' keyword in non-generator function");
				return null;
			}
			var condExpr = this._condExpr(noIn);
			if (condExpr == null)
				return null;
			return new YieldExpression(operatorToken, condExpr);
		}
		return this._condExpr(noIn);
	}

	function _condExpr (noIn : boolean) : Expression {
		var lorExpr = this._lorExpr(noIn);
		if (lorExpr == null)
			return null;
		var operatorToken;
		if ((operatorToken = this._expectOpt("?")) == null)
			return lorExpr;
		var ifTrueExpr = null : Expression;
		var ifFalseExpr = null : Expression;
		if (this._expectOpt(":") == null) {
			ifTrueExpr = this._assignExpr(noIn);
			if (ifTrueExpr == null)
				return null;
			if (this._expect(":") == null)
				return null;
		}
		ifFalseExpr = this._assignExpr(noIn);
		if (ifFalseExpr == null)
			return null;
		return new ConditionalExpression(operatorToken, lorExpr, ifTrueExpr, ifFalseExpr);
	}

	function _binaryOpExpr (ops : string[], excludePattern : RegExp, parseFunc : function(:boolean):Expression, noIn : boolean, builderFunc : function(:Token,:Expression,:Expression):Expression) : Expression {
		var expr = parseFunc(noIn);
		if (expr == null)
			return null;
		while (true) {
			var op = this._expectOpt(ops, excludePattern);
			if (op == null)
				break;
			var rightExpr = parseFunc(false);
			if (rightExpr == null)
				return null;
			expr = builderFunc(op, expr, rightExpr);
		}
		return expr;
	}

	function _lorExpr (noIn : boolean) : Expression {
		return this._binaryOpExpr([ "||" ], null, function (noIn) {
			return this._landExpr(noIn);
		}, noIn, function (op, e1, e2) {
			return new LogicalExpression(op, e1, e2);
		});
	}

	function _landExpr (noIn : boolean) : Expression {
		return this._binaryOpExpr([ "&&" ], null, function (noIn) {
			return this._borExpr(noIn);
		}, noIn, function (op, e1, e2) {
			return new LogicalExpression(op, e1, e2);
		});
	}

	function _borExpr (noIn : boolean) : Expression {
		return this._binaryOpExpr([ "|" ], /^\|\|/, function (noIn) {
			return this._bxorExpr(noIn);
		}, noIn, function (op, e1, e2) {
			return new BinaryNumberExpression(op, e1, e2);
		});
	}

	function _bxorExpr (noIn : boolean) : Expression {
		return this._binaryOpExpr([ "^" ], null, function (noIn) {
			return this._bandExpr(noIn);
		}, noIn, function (op, e1, e2) {
			return new BinaryNumberExpression(op, e1, e2);
		});
	}

	function _bandExpr (noIn : boolean) : Expression {
		return this._binaryOpExpr([ "&" ], /^&&/, function (noIn) {
			return this._eqExpr(noIn);
		}, noIn, function (op, e1, e2) {
			return new BinaryNumberExpression(op, e1, e2);
		});
	}

	function _eqExpr (noIn : boolean) : Expression {
		return this._binaryOpExpr([ "==", "!=" ], null, function (noIn) {
			return this._relExpr(noIn);
		}, noIn, function (op, e1, e2) {
			return new EqualityExpression(op, e1, e2);
		});
	}

	function _relExpr (noIn : boolean) : Expression {
		var ops = [ "<=", ">=", "<", ">" ];
		if (! noIn)
			ops.push("in");
		return this._binaryOpExpr(ops, null, function (noIn) {
			return this._shiftExpr();
		}, noIn, function (op, e1, e2) {
			if (op.getValue() == "in")
				return new InExpression(op, e1, e2);
			else
				return new BinaryNumberExpression(op, e1, e2);
		});
	}

	function _shiftExpr () : Expression {
		var expr = this._binaryOpExpr([ ">>>", "<<", ">>" ], null, function (noIn) {
			return this._addExpr();
		}, false, function (op, e1, e2) {
			return new ShiftExpression(op, e1, e2);
		});
		return expr;
	}

	function _addExpr () : Expression {
		return this._binaryOpExpr([ "+", "-" ], /^[+-]{2}/, function (noIn) {
			return this._mulExpr();
		}, false, function (op, e1, e2) {
			if (op.getValue() == "+")
				return new AdditiveExpression(op, e1, e2);
			else
				return new BinaryNumberExpression(op, e1, e2);
		});
	}

	function _mulExpr () : Expression {
		return this._binaryOpExpr([ "*", "/", "%" ], null, function (noIn) {
			return this._unaryExpr();
		}, false, function (op, e1, e2) {
			return new BinaryNumberExpression(op, e1, e2);
		});
	}

	function _unaryExpr () : Expression {
		// read other unary operators
		var op = this._expectOpt([ "++", "--", "+", "-", "~", "!", "typeof" ]);
		if (op == null)
			return this._asExpr();
		var expr = this._unaryExpr();
		if (expr == null)
			return null;
		switch (op.getValue()) {
		case "++":
		case "--":
			return new PreIncrementExpression(op, expr);
		case "+":
		case "-":
			return new SignExpression(op, expr);
		case "~":
			return new BitwiseNotExpression(op, expr);
		case "!":
			return new LogicalNotExpression(op, expr);
		case "typeof":
			return new TypeofExpression(op, expr);
		default:
			throw new Error("logic flaw");
		}
	}

	function _asExpr () : Expression {
		var expr = this._postfixExpr();
		if (expr == null)
			return null;
		var token;
		while ((token = this._expectOpt("as")) != null) {
			var noConvert = this._expectOpt("__noconvert__");
			var type = this._typeDeclaration(false);
			if (type == null)
				return null;
			expr = noConvert ? (new AsNoConvertExpression(token, expr, type) as Expression) : (new AsExpression(token, expr, type) as Expression);
		}
		return expr;
	}

	function _postfixExpr () : Expression {
		var expr = this._lhsExpr();
		var op = this._expectOpt([ "++", "--", "instanceof" ]);
		if (op == null)
			return expr;
		switch (op.getValue()) {
		case "instanceof":
			var type = this._typeDeclaration(false);
			if (type == null)
				return null;
			return new InstanceofExpression(op, expr, type);
		default:
			return new PostIncrementExpression(op, expr);
		}
	}

	function _lhsExpr () : Expression {
		var expr;
		var token = this._expectOpt([ "new", "super", "function" ]);
		if (token != null) {
			switch (token.getValue()) {
			case "super":
				return this._superExpr();
			case "function":
				expr = this._functionExpr(token);
				break;
			case "new":
				expr = this._newExpr(token);
				break;
			default:
				throw new Error("logic flaw");
			}
		} else {
			expr = this._arrowFunctionOpt();
			if (expr == null)
				expr = this._primaryExpr();
		}
		if (expr == null)
			return null;
		while ((token = this._expectOpt([ "(", "[", "." ])) != null) {
			switch (token.getValue()) {
			case "(":
				var args;
				if ((args = this._argsExpr()) == null)
					return null;
				expr = new CallExpression(token, expr, args);
				break;
			case "[":
				var index = this._expr(false);
				if (index == null)
					return null;
				if (this._expect("]") == null)
					return null;
				expr = new ArrayExpression(token, expr, index);
				break;
			case ".":
				var identifier = this._expectIdentifier(function (self) { return self._getCompletionCandidatesOfProperty(expr); });
				if (identifier == null)
					return null;
				var typeArgs = this._actualTypeArguments();
				if (typeArgs == null)
					return null;
				expr = new PropertyExpression(token, expr, identifier, typeArgs);
				break;
			}
		}
		return expr;
	}

	function _newExpr (newToken : Token) : Expression {
		var type = this._typeDeclarationNoArrayNoVoidNoYield();
		if (type == null)
			return null;
		// handle [] (if it has an length parameter, that's the last)
		while (this._expectOpt("[") != null) {
			if (type instanceof NullableType) {
				this._newError("cannot instantiate an array of an Nullable type");
				return null;
			}
			type = this._registerArrayTypeOf(newToken, type);
			if (this._expectOpt("]") == null) {
				var lengthExpr = this._assignExpr(false);
				if (lengthExpr == null)
					return null;
				if (this._expect("]") == null)
					return null;
				return new NewExpression(newToken, type, [ lengthExpr ]);
			}
		}
		if (! (type instanceof ParsedObjectType)) {
			this._newError("cannot instantiate a primitive type '" + type.toString() + "' using 'new'");
			return null;
		}
		if (this._expectOpt("(") != null) {
			var args = this._argsExpr();
			if (args == null)
				return null;
		} else {
			args = new Expression[];
		}
		return new NewExpression(newToken, type, args);
	}

	function _superExpr () : Expression {
		if (this._expect(".") == null)
			return null;
		var identifier = this._expectIdentifier(null /* FIXME */);
		if (identifier == null)
			return null;
		// token of the super expression is set to "(" to mimize the differences bet.compile error messages generated by CallExpression
		var token = this._expect("(");
		if (token == null)
			return null;
		var args = this._argsExpr();
		if (args == null)
			return null;
		return new SuperExpression(token, identifier, args);
	}

	function _arrowFunctionOpt () : FunctionExpression {
		var state = this._preserveState();
		var expr;
		if ((expr = this._arrowFunction()) == null) {
			this._restoreState(state);
			return null;
		}
		return expr;
	}

	function _arrowFunction () : FunctionExpression {
		if (this._expectOpt("(") != null) {
			var args = this._functionArgumentsExpr(false, false, false);
			if (args == null)
				return null;
		}
		else {
			var argName = this._expectIdentifier();
			if (argName == null)
				return null;
			var argType : Type = null;
			if (this._expectOpt(":") != null) {
				if ((argType = this._typeDeclaration(false)) == null)
					return null;
			}
			args = [ new ArgumentDeclaration(argName, argType, null) ];
		}
		var returnType = null : Type;
		if (this._expectOpt(":") != null) {
			if ((returnType = this._typeDeclaration(true)) == null)
				return null;
		}
		var token = this._expect(["->", "=>"]);
		if (token == null)
			return null;
		var funcDef = this._functionBody(token, null, null, args, returnType, this._expectOpt("{") != null, false);
		if (funcDef == null)
			return null;
		this._closures.push(funcDef);
		return new FunctionExpression(token, funcDef);
	}

	function _functionBody(token : Token, name : Token, funcLocal : LocalVariable, args : ArgumentDeclaration[], returnType : Type, withBlock : boolean, isGenerator : boolean) : MemberFunctionDefinition {
		this._pushScope(funcLocal, args);
		try {
			// parse lambda body
			var flags = ClassDefinition.IS_STATIC;
			if (isGenerator) {
				this._isGenerator = isGenerator;
				flags |= ClassDefinition.IS_GENERATOR;
			}
			var lastToken : Token;
			if (! withBlock) {
				lastToken = null;
				var expr = this._assignExpr();
				this._statements.push(new ReturnStatement(token, expr));
			} else {
				var lastToken = this._block();
				if (lastToken == null)
					return null;
			}
			var funcDef = new MemberFunctionDefinition(
				token, name , flags, returnType, args, this._locals, this._statements, this._closures, lastToken, null);
			if (funcLocal != null) {
				funcDef.setFuncLocal(funcLocal);
			}
			return funcDef;
		} finally {
			this._popScope();
		}
	}

	function _functionExpr (token : Token) : Expression {
		var isGenerator = false;
		if (this._expectOpt("*") != null)
			isGenerator = true;
		var name = this._expectIdentifierOpt();
		if (this._expect("(") == null)
			return null;
		var args = this._functionArgumentsExpr(false, false, false);
		if (args == null)
			return null;
		if (this._expectOpt(":") != null) {
			var returnType = this._typeDeclaration(true);
			if (returnType == null) {
				return null;
			}
		} else {
			returnType = null;
		}
		if (this._expect("{") == null)
			return null;

		var type : Type = null;
		if (returnType != null) {
			var argTypes = args.map.<Type>((arg) -> arg.getType());
			type = new StaticFunctionType(token, returnType, argTypes, false);
		}
		var funcLocal : LocalVariable = null;
		if (name != null) {
			funcLocal = new LocalVariable(name, type, true);
		}

		var funcDef = this._functionBody(token, name, funcLocal, args, returnType, true, isGenerator);
		if (funcDef == null) {
			return null;
		}
		this._closures.push(funcDef);
		return new FunctionExpression(token, funcDef);
	}

	function _forEachScope (cb : function(:LocalVariable,:LocalVariable[],:ArgumentDeclaration[]):boolean) : boolean {
		if (this._locals != null) {
			if (! cb(this._funcLocal, this._locals, this._arguments)) {
				return false;
			}
			for (var scope = this._prevScope; scope != null; scope = scope.prev) {
				if (scope.locals && ! cb(scope.funcLocal, scope.locals, scope.arguments)) {
					return false;
				}
			}
		}
		return true;
	}

	function _findLocal (name : string) : LocalVariable {
		var found = null : LocalVariable;
		this._forEachScope(function (funcLocal, locals, args) {
			if (funcLocal != null && funcLocal.getName().getValue() == name) {
				found = funcLocal;
				return false;
			}
			for (var i = 0; i < locals.length; ++i) {
				if (locals[i].getName().getValue() == name) {
					found = locals[i];
					return false;
				}
			}
			if (args != null) {
				for (var i = 0; i < args.length; ++i) {
					if (args[i].getName().getValue() == name) {
						found = args[i];
						return false;
					}
				}
			}
			return true;
		});
		return found;
	}

	function _primaryExpr () : Expression {
		var token;
		if ((token = this._expectOpt([ "this", "undefined", "null", "false", "true", "[", "{", "(", "__FILE__", "__LINE__", "__CLASS__" ])) != null) {
			switch (token.getValue()) {
			case "this":
				return new ThisExpression(token, null);
			case "undefined":
				this._newDeprecatedWarning("use of 'undefined' is deprerated, use 'null' instead");
				// falls through
			case "null":
				return this._nullLiteral(token);
			case "false":
				return new BooleanLiteralExpression(token);
			case "true":
				return new BooleanLiteralExpression(token);
			case "[":
				return this._arrayLiteral(token);
			case "{":
				return this._mapLiteral(token);
			case "(":
				var expr = this._expr(false);
				if (this._expect(")") == null)
					return null;
				return expr;
			case "__FILE__":
				return new FileMacroExpression(token);
			case "__LINE__":
				return new LineMacroExpression(token);
			case "__CLASS__":
				return new ClassExpression(token, this._classType);
			default:
				throw new Error("logic flaw");
			}
		} else if ((token = this._expectNumberLiteralOpt()) != null) {
			return new NumberLiteralExpression(token);
		} else if ((token = this._expectIdentifierOpt(function (self) { return self._getCompletionCandidatesWithLocal(); })) != null) {
			var local = this._findLocal(token.getValue());
			if (local != null) {
				return new LocalExpression(token, local);
			} else {
				var parsedType = this._objectTypeDeclaration(token, false, null);
				if (parsedType == null)
					return null;
				return new ClassExpression(parsedType.getToken(), parsedType);
			}
		} else if ((token = this._expectStringLiteralOpt()) != null) {
			return new StringLiteralExpression(token);
		} else if ((token = this._expectRegExpLiteralOpt()) != null) {
			return new RegExpLiteralExpression(token);
		} else {
			this._newError("expected primary expression");
			return null;
		}
	}

	function _nullLiteral (token : Token) : NullExpression {
		var type = Type.nullType as Type;
		if (this._expectOpt(":") != null) {
			if ((type = this._typeDeclaration(false)) == null)
				return null;
			if (type instanceof PrimitiveType) {
				this._newError("type '" + type.toString() + "' is not nullable");
				return null;
			}
		}
		return new NullExpression(token, type);
	}

	function _arrayLiteral (token : Token) : ArrayLiteralExpression {
		var exprs = new Expression[];
		while (this._expectOpt("]") == null) {
			var expr = this._assignExpr();
			if (expr == null)
				return null;
			exprs.push(expr);
			// separator
			var separator = this._expect([",", "]"]);
			if (separator == null) {
				return null;
			}
			else if (separator.getValue() == "]") {
				break;
			}
		}
		var type = null : Type;
		if (this._expectOpt(":") != null)
			if ((type = this._typeDeclaration(false)) == null)
				return null;
		return new ArrayLiteralExpression(token, exprs, type);
	}

	function _mapLiteral (token : Token) : MapLiteralExpression {
		var elements = new MapLiteralElement[];
		while (this._expectOpt("}") == null) {
			// obtain key
			var keyToken;
			if ((keyToken = this._expectIdentifierOpt()) != null
				|| (keyToken = this._expectNumberLiteralOpt()) != null
				|| (keyToken = this._expectStringLiteralOpt()) != null) {
				// ok
			} else {
				this._newError("expected identifier, number or string");
				return null;
			}
			// separator
			if (this._expect(":") == null)
				return null;
			// obtain value
			var expr = this._assignExpr();
			if (expr == null)
				return null;
			elements.push(new MapLiteralElement(keyToken, expr));

			// separator
			var separator = this._expect([",", "}"]);
			if (separator == null) {
				return null;
			}
			else if (separator.getValue() == "}") {
				break;
			}
		}
		var type = null : Type;
		if (this._expectOpt(":") != null)
			if ((type = this._typeDeclaration(false)) == null)
				return null;
		return new MapLiteralExpression(token, elements, type);
	}

	function _functionArgumentsExpr (allowVarArgs : boolean, requireTypeDeclaration : boolean, allowDefaultValues : boolean) : ArgumentDeclaration[] {
		var args = new ArgumentDeclaration[];
		if (this._expectOpt(")") == null) {
			var token = null : Token;
			do {
				var isVarArg = allowVarArgs && (this._expectOpt("...") != null);
				var argName = this._expectIdentifier();
				if (argName == null)
					return null;
				var argType : Type = null;
				if (requireTypeDeclaration) {
					if (this._expect(":") == null) {
						this._newError("type declarations are mandatory for non-expression function definition");
						return null;
					}
					if ((argType = this._typeDeclaration(false)) == null)
						return null;
				} else if (this._expectOpt(":") != null) {
					if ((argType = this._typeDeclaration(false)) == null)
						return null;
				}
				for (var i = 0; i < args.length; ++i) {
					if (args[i].getName().getValue() == argName.getValue()) {
						this._errors.push(new CompileError(argName, "cannot declare an argument with the same name twice"));
						return null;
					}
				}
				if (isVarArg) {
					// vararg is the last argument
					if (argType == null && isVarArg)
						throw new Error("not yet implemented!");
					args.push(new ArgumentDeclaration(argName, new VariableLengthArgumentType(argType)));
					if (this._expect(")") == null)
						return null;
					break;
				}
				var defaultValue : Expression = null;
				var assignToken = this._expectOpt("=");
				if (assignToken != null)  {
					var state = this._preserveState();
					this._pushScope(null, args);
					try {
						if ((defaultValue = this._assignExpr(true)) == null) {
							return null;
						}
					} finally {
						// do not create a between the parent method and the children funcDefs stored in defVal
						if (this._closures != null) {
							this._closures.splice(state.numClosures, this._closures.length - state.numClosures);
						}
						this._popScope();
					}
					if (! allowDefaultValues) {
						this._errors.push(new CompileError(assignToken, "default parameters are only allowed for member functions"));
						return null;
					}
				} else {
					if (args.length != 0 && args[args.length - 1].getDefaultValue() != null) {
						this._errors.push(new CompileError(argName, "required argument cannot be declared after an optional argument"));
						return null;
					}
				}
				args.push(new ArgumentDeclaration(argName, argType, defaultValue));
				token = this._expect([ ")", "," ]);
				if (token == null)
					return null;
			} while (token.getValue() == ",");
		}
		return args;
	}

	function _argsExpr () : Expression[] {
		var args = new Expression[];
		if (this._expectOpt(")") == null) {
			var token = null : Token;
			do {
				var arg = this._assignExpr(false);
				if (arg == null)
					return null;
				args.push(arg);
				token = this._expect([ ")", "," ]);
				if (token == null)
					return null;
			} while (token.getValue() == ",");
		}
		return args;
	}

	function _getCompletionCandidatesOfTopLevel (autoCompleteMatchCb : function(:ClassDefinition):boolean) : CompletionCandidatesOfTopLevel {
		return new CompletionCandidatesOfTopLevel(this, autoCompleteMatchCb);
	}

	function _getCompletionCandidatesWithLocal () : _CompletionCandidatesWithLocal {
		return new _CompletionCandidatesWithLocal(this);
	}

	function _getCompletionCandidatesOfNamespace (imprt : Import, autoCompleteMatchCb : function(:ClassDefinition):boolean) : _CompletionCandidatesOfNamespace {
		return new _CompletionCandidatesOfNamespace(imprt, autoCompleteMatchCb);
	}

	function _getCompletionCandidatesOfProperty (expr : Expression) : _CompletionCandidatesOfProperty {
		return new _CompletionCandidatesOfProperty(expr);
	}
}

