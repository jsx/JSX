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
eval(Class.$import("./type"));
eval(Class.$import("./classdef"));
eval(Class.$import("./statement"));
eval(Class.$import("./expression"));
eval(Class.$import("./doc"));
eval(Class.$import("./util"));
eval(Class.$import("./completion"));

"use strict";

var Token = exports.Token = Class.extend({

	constructor: function (value, isIdentifier, filename, lineNumber, columnNumber) {
		this._value = value;
		this._isIdentifier = isIdentifier;
		// two args or five args
		this._filename = filename || null;
		this._lineNumber = lineNumber;     // Nullable.<int>
		this._columnNumber = columnNumber; // Nullable.<int>
	},

	getValue: function () {
		return this._value;
	},

	isIdentifier: function () {
		return this._isIdentifier;
	},

	getFilename: function () {
		return this._filename;
	},

	getLineNumber: function () {
		return this._lineNumber;
	},

	getColumnNumber: function () {
		return this._columnNumber;
	},

	serialize: function () {
		return [
			this._value,
			this._isIdentifier,
			this._filename,
			this._lineNumber,
			this._columnNumber
		];
	}

});
Token.prototype.__defineGetter__("filename", function () { throw new Error("Token#filename is removed. Use Token#getFilename() instead") });

var _Lexer = exports._TokenTable = Class.extend({

	$makeAlt: function (patterns) {
		return "(?: \n" + patterns.join("\n | \n") + "\n)\n";
	},

	$quoteMeta: function (pattern) {
		return pattern.replace(/([^0-9A-Za-z_])/g, '\\$1');
	},

	$asMap: function (array) {
		var hash = {};
		for (var i = 0; i < array.length; ++i)
			hash[array[i]] = true;
		return hash;
	},

	/// compile a regular expression
	$rx: function (pat, flags) {
		return RegExp(pat.replace(/[ \t\r\n]/g, ""), flags);
	},

	// static variables
	$constructor: function () {
		var ident         = " [a-zA-Z_] [a-zA-Z0-9_]* ";
		var doubleQuoted  = ' "  [^"\\\\]* (?: \\\\. [^"\\\\]* )* " ';
		var singleQuoted  = " '  [^'\\\\]* (?: \\\\. [^'\\\\]* )* ' ";
		var stringLiteral = this.makeAlt([singleQuoted, doubleQuoted]);
		var regexpLiteral = doubleQuoted.replace(/"/g, "/") + "[mgi]*";

		// ECMA 262 compatible,
		// see also ECMA 262 5th (7.8.3) Numeric Literals
		var decimalIntegerLiteral = "(?: 0 | [1-9][0-9]* )";
		var exponentPart = "(?: [eE] [+-]? [0-9]+ )";
		var numberLiteral = this.makeAlt([
				"(?: " + decimalIntegerLiteral + " \\. " +
				        "[0-9]* " + exponentPart + "? )",
				"(?: \\. [0-9]+ " + exponentPart + "? )",
				"(?: " + decimalIntegerLiteral + exponentPart + " )",
				"NaN",
				"Infinity"
			]) + "\\b";
		var integerLiteral = this.makeAlt([
				"(?: 0 [xX] [0-9a-fA-F]+ )", // hex
				decimalIntegerLiteral
			]) + "(?![\\.0-9eE])\\b";

		// regular expressions
		this.rxIdent          = this.rx("^" + ident);
		this.rxStringLiteral  = this.rx("^" + stringLiteral);
		this.rxNumberLiteral  = this.rx("^" + numberLiteral);
		this.rxIntegerLiteral = this.rx("^" + integerLiteral);
		this.rxRegExpLiteral  = this.rx("^" + regexpLiteral);
		this.rxNewline        = /(?:\r\n?|\n)/;

		// blacklists of identifiers
		this.keywords = this.asMap([
			// literals shared with ECMA 262
			"null",     "true",     "false",
			"NaN",      "Infinity",
			// keywords shared with ECMA 262
			"break",    "do",       "instanceof", "typeof",
			"case",     "else",     "new",        "var",
			"catch",    "finally",  "return",     "void",
			"continue", "for",      "switch",     "while",
			"function", "this",
			/* "default", */ // contextual keywords
			"if",       "throw",
			/* "assert",    "log", // contextual keywords */
			"delete",   "in",       "try",
			// keywords of JSX
			"class",	 "extends", "super",
			"import",    "implements",
			"interface", "static",
			"__FILE__",  "__LINE__",
			"undefined"
		]);
		this.reserved = this.asMap([
			// literals of ECMA 262 but not used by JSX
			"debugger", "with",
			// future reserved words of ECMA 262
			"const", "export",
			// future reserved words within strict mode of ECMA 262
			"let",   "private",   "public", "yield",
			"protected",

			// JSX specific reserved words
			"extern", "native", "as", "operator"
		]);
	}

});

var Import = exports.Import = Class.extend({

	constructor: function () {
		switch (arguments.length) {
		case 1:
			// for built-in classes
			this._filenameToken = null;
			this._aliasToken = null;
			this._classNames = null;
			this._sourceParsers = [ arguments[0] ];
			break;
		case 3:
			this._filenameToken = arguments[0];
			this._aliasToken = arguments[1];
			this._classNames = arguments[2];
			this._sourceParsers = [];
			break;
		default:
			throw new Error("logic flaw");
		}
	},

	getFilenameToken: function () {
		return this._filenameToken;
	},

	getAlias: function () {
		return this._aliasToken != null ? this._aliasToken.getValue() : null;
	},

	getClassNames: function () {
		if (this._classNames == null)
			return null;
		var names = [];
		for (var i = 0; i < this._classNames.length; ++i)
			names[i] = this._classNames[i].getValue();
		return names;
	},

	serialize: function () {
		return [
			"Import",
			Util.serializeNullable(this._filenameToken),
			Util.serializeNullable(this._aliasToken),
			Util.serializeArray(this._classNames)
		];
	},

	checkNameConflict: function (errors, nameToken) {
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
	},

	addSource: function (parser) {
		this._sourceParsers.push(parser);
	},

	getSources: function () {
		return this._sourceParsers;
	},

	assertExistenceOfNamedClasses: function (errors) {
		if (this._classNames == null) {
			// no named classes
			return;
		}

		// list all classses
		var allClassNames = [];
		for (var i = 0; i < this._sourceParsers.length; ++i) {
			allClassNames = allClassNames.concat(this._sourceParsers[i].getClassDefs().map(function (classDef) { return classDef.className(); }));
			allClassNames = allClassNames.concat(this._sourceParsers[i].getTemplateClassDefs().map(function (classDef) { return classDef.className(); }));
		}
		function countNumberOfClassesByName(className) {
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
	},

	getClasses: function (name) {
		if (! this._classIsImportable(name)) {
			return [];
		}
		var found = [];
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
	},

	createGetTemplateClassCallbacks: function (errors, request, postInstantiationCallback) {
		if (! this._classIsImportable(request.getClassName())) {
			return [];
		}
		var callbacks = [];
		for (var i = 0; i < this._sourceParsers.length; ++i) {
			var callback = this._sourceParsers[i].createGetTemplateClassCallback(errors, request, postInstantiationCallback);
			if (callback != null) {
				callbacks.push(callback);
			}
		}
		return callbacks;
	},

	_classIsImportable: function (name) {
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
	},

	$create: function (errors, filenameToken, aliasToken, classNames) {
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

});

var WildcardImport = exports.WildcardImport = Import.extend({

	constructor: function (filenameToken, aliasToken, classNames, directory, suffix) {
		Import.prototype.constructor.call(this, filenameToken, aliasToken, classNames);
		this._directory = directory;
		this._suffix = suffix;
	},

	getDirectory: function () {
		return this._directory;
	},

	getSuffix: function () {
		return this._suffix;
	}

});

var QualifiedName = exports.QualifiedName = Class.extend({

	constructor: function (token, imprt) {
		this._token = token;
		this._import = imprt;
	},

	getToken: function () {
		return this._token;
	},

	getImport: function () {
		return this._import;
	},

	serialize: function () {
		return [
			"QualifiedName",
			this._token.serialize(),
			Util.serializeNullable(this._import)
		];
	},

	equals: function (x) {
		if (x == null)
			return false;
		if (this._token.getValue() != x._token.getValue())
			return false;
		if (this._import != x._import)
			return false;
		return true;
	},

	getClass: function (context, typeArguments) {
		if (this._import != null) {
			if (typeArguments.length == 0) {
				var classDefs = this._import.getClasses(this._token.getValue());
				switch (classDefs.length) {
				case 1:
					var classDef = classDefs[0];
					break;
				case 0:
					context.errors.push(new CompileError(this._token, "no definition for class '" + this._token.getValue() + "' in file '" + this._import.getFilenameToken().getValue() + "'"));
					return null;
				default:
					context.errors.push(new CompileError(this._token, "multiple candidates"));
					return null;
				}
			} else {
				var callbacks = this._import.createGetTemplateClassCallbacks(context.errors, new TemplateInstantiationRequest(this._token, this._token.getValue(), typeArguments), function () {});
				switch (callbacks.length) {
				case 1:
					return callbacks[0]();
				case 0:
					context.errors.push(new CompileError(this._token, "not definition for template class '" + tihs._token.getValue() + "' in file '" + tihs._import.getFilenameToken().getValue() + "'"));
					return null;
				default:
					context.errors.push(new CompileError(this._token, "multiple canditates"));
					return null;
				}
			}
		} else {
			if (typeArguments.length == 0) {
				if ((classDef = context.parser.lookup(context.errors, this._token, this._token.getValue())) == null) {
					context.errors.push(new CompileError(this._token, "no class definition for '" + this._token.getValue() + "'"));
					return null;
				}
			} else {
				if ((classDef = context.parser.lookupTemplate(context.errors, new TemplateInstantiationRequest(this._token, this._token.getValue(), typeArguments), function () {})) == null) {
					context.errors.push(new CompileError(this._token, "failed to instantiate class"));
					return null;
				}
			}
		}
		return classDef;
	},

	getTemplateClass: function (parser) {
		var foundClassDefs = [];
		var checkClassDef = function (classDef) {
			if (classDef.className() == this._token.getValue()) {
				foundClassDefs.push(classDef);
			}
		}.bind(this);
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

});

var Parser = exports.Parser = Class.extend({

	constructor: function (sourceToken, filename, completionRequest) {
		this._sourceToken = sourceToken;
		this._filename = filename;
		this._completionRequest = completionRequest;
	},

	parse: function (input, errors) {
		// lexer properties
		this._input = input;
		this._lines = this._input.split(_Lexer.rxNewline);
		this._tokenLength = 0;
		this._lineNumber = 1; // one origin
		this._columnOffset = 0; // zero origin
		this._fileLevelDocComment = null;
		this._docComment = null;
		// insert a marker so that at the completion location we would always get _expectIdentifierOpt called, whenever possible
		if (this._completionRequest != null) {
			var compLineNumber = Math.min(this._completionRequest.getLineNumber(), this._lines.length + 1);
			var line = this._lines[compLineNumber - 1] || '';
			this._lines[compLineNumber - 1] =
				line.substring(0, this._completionRequest.getColumnOffset())
				+ "Q," + // use a character that is permitted within an identifier, but never appears in keywords
				line.substring(this._completionRequest.getColumnOffset());
		}
		// output
		this._errors = errors;
		this._templateClassDefs = [];
		this._classDefs = [];
		this._imports = [];
		// use for function parsing
		this._locals = null;
		this._statements = null;
		this._closures = [];
		this._classType = null;
		this._extendType = null;
		this._implementTypes = null;
		this._objectTypesUsed = [];
		this._templateInstantiationRequests = [];

		// doit
		while (! this._isEOF()) {
			var importToken = this._expectOpt("import");
			if (importToken == null)
				break;
			this._importStatement(importToken);
		}
		while (! this._isEOF()) {
			if (! this._classDefinition())
				return false;
		}

		if (this._errors.length != 0)
			return false;

		return true;
	},

	_getInput: function () {
		return this._lines[this._lineNumber - 1].substring(this._columnOffset);
	},

	_getInputByLength: function (length) {
		return this._lines[this._lineNumber - 1].substring(this._columnOffset, this._columnOffset + length);
	},

	_forwardPos: function (len) {
		this._columnOffset += len;
	},

	getSourceToken: function () {
		return this._sourceToken;
	},

	getPath: function () {
		return this._filename;
	},

	getDocComment: function () {
		return this._fileLevelDocComment;
	},

	getClassDefs: function () {
		return this._classDefs;
	},

	getTemplateClassDefs: function () {
		return this._templateClassDefs;
	},

	getTemplateInstantiationRequests: function () {
		return this._templateInstantiationRequests;
	},

	getImports: function () {
		return this._imports;
	},

	registerBuiltinImports: function (parsers) {
		for (var i = parsers.length - 1; i >= 0; --i)
			this._imports.unshift(new Import(parsers[i]));
	},

	lookupImportAlias: function (name) {
		for (var i = 0; i < this._imports.length; ++i) {
			var alias = this._imports[i].getAlias();
			if (alias != null && alias == name)
				return this._imports[i];
		}
		return null;
	},

	lookup: function (errors, contextToken, className) {
		// class within the file is preferred
		for (var i = 0; i < this._classDefs.length; ++i) {
			var classDef = this._classDefs[i];
			if (classDef.className() == className)
				return classDef;
		}
		// classnames within the imported files may conflict
		var found = [];
		for (var i = 0; i < this._imports.length; ++i) {
			if (this._imports[i].getAlias() == null)
				found = found.concat(this._imports[i].getClasses(className));
		}
		if (found.length == 1)
			return found[0];
		if (found.length >= 2)
			errors.push(new CompileError(contextToken, "multiple candidates exist for class name '" + className + "'"));
		return null;
	},

	lookupTemplate: function (errors, request, postInstantiationCallback) {
		// lookup within the source file
		var instantiateCallback = this.createGetTemplateClassCallback(errors, request, postInstantiationCallback);
		if (instantiateCallback != null) {
			return instantiateCallback(errors, request, postInstantiationCallback);
		}
		// lookup within the imported files
		var candidateCallbacks = [];
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
		return candidateCallbacks[0]();
	},

	createGetTemplateClassCallback: function (errors, request, postInstantiationCallback) {
		// lookup the already-instantiated class
		for (var i = 0; i < this._classDefs.length; ++i) {
			var classDef = this._classDefs[i];
			if (classDef instanceof InstantiatedClassDefinition
				&& classDef.getTemplateClassName() == request.getClassName()
				&& Util.typesAreEqual(classDef.getTypeArguments(), request.getTypeArguments())) {
				return function () {
					return classDef;
				};
			}
		}
		// create instantiation callback
		for (var i = 0; i < this._templateClassDefs.length; ++i) {
			var templateDef = this._templateClassDefs[i];
			if (templateDef.className() == request.getClassName()) {
				return function () {
					var classDef = templateDef.instantiate(errors, request);
					if (classDef == null) {
						return null;
					}
					this._classDefs.push(classDef);
					classDef.setParser(this);
					classDef.resolveTypes(new AnalysisContext(errors, this, null));
					postInstantiationCallback(this, classDef);
					return classDef;
				}.bind(this);
			}
		}
		return null;
	},

	_pushScope: function (args) {
		this._prevScope = {
			prev: this._prevScope,
			locals: this._locals,
			arguments: this._arguments,
			statements: this._statements,
			closures: this._closures
		};
		this._locals = [];
		this._arguments = args;
		this._statements = [];
		this._closures = [];
	},

	_popScope: function () {
		this._locals = this._prevScope.locals;
		this._arguments = this._prevScope.arguments;
		this._statements = this._prevScope.statements;
		this._closures = this._prevScope.closures;
		this._prevScope = this._prevScope.prev;
	},

	_registerLocal: function (identifierToken, type) {
		for (var i = 0; i < this._locals.length; i++) {
			if (this._locals[i].getName().getValue() == identifierToken.getValue()) {
				if (type != null && ! this._locals[i].getType().equals(type))
					this._newError("conflicting types for variable " + identifierToken.getValue());
				return this._locals[i];
			}
		}
		var newLocal = new LocalVariable(identifierToken, type);
		this._locals.push(newLocal);
		return newLocal;
	},

	_preserveState: function () {
		// FIXME use class
		return {
			// lexer properties
			lineNumber: this._lineNumber,
			columnOffset: this._columnOffset,
			docComment: this._docComment,
			tokenLength: this._tokenLength,
			// errors
			numErrors: this._errors.length,
			// closures
			numClosures: this._closures.length,
			// objectTypesUsed
			numObjectTypesUsed: this._objectTypesUsed.length,
			// templateInstantiationrequests
			numTemplateInstantiationRequests: this._templateInstantiationRequests.length
		};
	},

	_restoreState: function (state) {
		this._lineNumber = state.lineNumber;
		this._columnOffset = state.columnOffset;
		this._docComment = state.docComment;
		this._tokenLength = state.tokenLength;
		this._errors.length = state.numErrors;
		this._closures.splice(state.numClosures);
		this._objectTypesUsed.splice(state.numObjectTypesUsed);
		this._templateInstantiationRequests.splice(state.numTemplateInstantiationRequests);
	},

	// this is column offset, and is thus zero-origin
	_getColumn: function () {
		return this._columnOffset;
	},

	_newError: function (message) {
		this._errors.push(new CompileError(this._filename, this._lineNumber, this._getColumn(), message));
	},

	_newDeprecatedWarning: function (message) {
		this._errors.push(new DeprecatedWarning(this._filename, this._lineNumber, this._getColumn(), message));
	},

	_advanceToken: function () {
		if (this._tokenLength != 0) {
			this._forwardPos(this._tokenLength);
			this._tokenLength = 0;
			this._docComment = null;
		}

		while (true) {
			// skip whitespaces and comments in-line
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
	},

	_skipMultilineComment: function () {
		var startLineNumber = this._lineNumber;
		var startColumnOffset = this._columnOffset;
		while (true) {
			var endAt = this._getInput(this._columnOffset).indexOf("*/");
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
	},

	_parseDocComment: function () {

		var docComment = new DocComment();
		var node = docComment;

		while (true) {
			// skip " * ", or return if "*/"
			this._parseDocCommentAdvanceWhiteSpace();
			if (this._getInputByLength(2) == "*/") {
				this._forwardPos(2);
				return docComment;
			} else if (this._getInputByLength(1) == "*") {
				this._forwardPos(1);
				this._parseDocCommentAdvanceWhiteSpace();
			}
			// fetch tag (and paramName), and setup the target node to push content into
			var tagMatch = this._getInput(this._columnOffset).match(/^\@([0-9A-Za-z_]+)[ \t]*/);
			if (tagMatch != null) {
				this._forwardPos(tagMatch[0].length);
				var tag = tagMatch[1];
				switch (tag) {
				case "param":
					var nameMatch = this._getInput(this._columnOffset).match(/[0-9A-Za-z_]+/);
					if (nameMatch != null) {
						this._forwardPos(nameMatch[0].length);
						node = new DocCommentParameter(nameMatch[0]);
						docComment.getParams().push(node);
					} else {
						this._newError("name of the parameter not found after @param");
						node = null;
					}
					break;
				default:
					node = new DocCommentTag(tag);
					docComment.getTags().push(node);
					break;
				}
			}
			var endAt = this._getInput(this._columnOffset).indexOf("*/");
			if (endAt != -1) {
				if (node != null) {
					node.appendDescription(this._getInput(this._columnOffset).substring(0, endAt));
				}
				this._forwardPos(endAt + 2);
				return docComment;
			}
			if (node != null) {
				node.appendDescription(this._getInput(this._columnOffset));
			}
			if (this._lineNumber == this._lines.length) {
				this._columnOffset = this._lines[this._lineNumber - 1].length;
				this._newError("could not find the end of the doccomment");
				return null;
			}
			++this._lineNumber;
			this._columnOffset = 0;
		}
	},

	_parseDocCommentAdvanceWhiteSpace: function () {
		while (true) {
			var ch = this._getInputByLength(1);
			if (ch == " " || ch == "\t") {
				this._forwardPos(1);
			} else {
				break;
			}
		}
	},

	_isEOF: function () {
		this._advanceToken();
		return this._lineNumber == this._lines.length && this._columnOffset == this._lines[this._lines.length - 1].length;
	},

	_expectIsNotEOF: function () {
		if (this._isEOF()) {
			this._newError("unexpected EOF");
			return false;
		}
		return true;
	},

	_expectOpt: function (expected, excludePattern) {
		if (! (expected instanceof Array))
			expected = [ expected ];

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
	},

	_expect: function (expected, excludePattern) {
		if (! (expected instanceof Array))
			expected = [ expected ];

		var token = this._expectOpt(expected, excludePattern);
		if (token == null) {
			this._newError("expected keyword: " + expected.join(" "));
			return null;
		}
		return token;
	},

	_expectIdentifierOpt: function (completionCb) {
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
		if (_Lexer.keywords.hasOwnProperty(matched[0])) {
			this._newError("expected an identifier but found a keyword");
			return null;
		}
		if (_Lexer.reserved.hasOwnProperty(matched[0])) {
			this._newError("expected an identifier but found a reserved word");
			return null;
		}
		this._tokenLength = matched[0].length;
		return new Token(matched[0], true, this._filename, this._lineNumber, this._getColumn());
	},

	_expectIdentifier: function (completionCb) {
		var token = this._expectIdentifierOpt(completionCb);
		if (token != null)
			return token;
		this._newError("expected an identifier");
		return null;
	},

	_expectStringLiteralOpt: function () {
		this._advanceToken();
		var matched = this._getInput().match(_Lexer.rxStringLiteral);
		if (matched == null)
			return null;
		this._tokenLength = matched[0].length;
		return new Token(matched[0], false, this._filename, this._lineNumber, this._getColumn());
	},

	_expectStringLiteral: function () {
		var token = this._expectStringLiteralOpt();
		if (token != null)
			return token;
		this._newError("expected a string literal");
		return null;
	},

	_expectNumberLiteralOpt: function () {
		this._advanceToken();
		var matched = this._getInput().match(_Lexer.rxIntegerLiteral);
		if (matched == null)
			matched = this._getInput().match(_Lexer.rxNumberLiteral);
		if (matched == null)
			return null;
		this._tokenLength = matched[0].length;
		return new Token(matched[0], false, this._filename, this._lineNumber, this._getColumn());
	},

	_expectRegExpLiteralOpt: function () {
		this._advanceToken();
		var matched = this._getInput().match(_Lexer.rxRegExpLiteral);
		if (matched == null)
			return null;
		this._tokenLength = matched[0].length;
		return new Token(matched[0], false, this._filename, this._lineNumber, this._getColumn());
	},

	_skipStatement: function () {
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
	},

	_qualifiedName: function (allowSuper, autoCompleteMatchCb) {
		// returns a token that contains a qualified name
		if (allowSuper) {
			var token = this._expectOpt("super");
			if (token != null)
				return new QualifiedName(token, null);
		}
		if ((token = this._expectIdentifier(function (self) { return self._getCompletionCandidatesOfTopLevel(autoCompleteMatchCb); })) == null)
			return null;
		return this._qualifiedNameStartingWith(token, autoCompleteMatchCb);
	},

	_qualifiedNameStartingWith: function (token, autoCompleteMatchCb) {
		if (token.getValue() == "variant") {
			this._errors.push(new CompileError(token, "cannot use 'variant' as a class name"));
			return null;
		} else if (token.getValue() == "Nullable" || token.getValue() == "MayBeUndefined") {
			this._errors.push(new CompileError(token, "cannot use 'Nullable' (or MayBeUndefined) as a class name"));
			return null;
		}
		var imprt = this.lookupImportAlias(token.getValue());
		if (imprt != null) {
			if (this._expect(".") == null)
				return null;
			token = this._expectIdentifier(function (self) { return self._getCompletionCandidatesOfNamespace(imprt, autoCompleteMatchCb); });
			if (token == null)
				return null;
		}
		return new QualifiedName(token, imprt);
	},

	_importStatement: function (importToken) {
		// parse
		var classes = null;
		var token = this._expectIdentifierOpt(null);
		if (token != null) {
			classes = [ token ];
			while (true) {
				if ((token = this._expect([ ",", "from" ])) == null)
					return false;
				if (token.getValue() == "from")
					break;
				if ((token = this._expectIdentifier(null)) == null)
					return false;
				classes.push(token);
			}
		}
		var filenameToken = this._expectStringLiteral();
		if (filenameToken == null)
			return false;
		var alias = null;
		if (this._expectOpt("into") != null) {
			if ((alias = this._expectIdentifier(null)) == null)
				return false;
		}
		if (this._expect(";") == null)
			return false;
		// check conflict
		if (alias != null && Parser._isReservedClassName(alias.getValue())) {
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
	},

	_classDefinition: function () {
		this._classType = null;
		this._extendType = null;
		this._implementTypes = [];
		this._objectTypesUsed = [];
		// attributes* class
		this._classFlags = 0;
		var docComment = null;
		while (true) {
			var token = this._expect([ "class", "interface", "mixin", "abstract", "final", "native", "__fake__" ]);
			if (token == null)
				return false;
			if (this._classFlags == 0)
				docComment = this._docComment;
			if (token.getValue() == "class")
				break;
			if (token.getValue() == "interface") {
				if ((this._classFlags & (ClassDefinition.IS_FINAL | ClassDefinition.IS_NATIVE)) != 0) {
					this._newError("interface cannot have final or native attribute set");
					return false;
				}
				this._classFlags |= ClassDefinition.IS_INTERFACE;
				break;
			}
			if (token.getValue() == "mixin") {
				if ((this._classFlags & (ClassDefinition.IS_FINAL | ClassDefinition.IS_NATIVE)) != 0) {
					this._newError("mixin cannot have final or native attribute set");
					return false;
				}
				this._classFlags |= ClassDefinition.IS_MIXIN;
				break;
			}
			var newFlag = 0;
			switch (token.getValue()) {
			case "abstract":
				newFlag = ClassDefinition.IS_ABSTRACT;
				break;
			case "final":
				newFlag = ClassDefinition.IS_FINAL;
				break;
			case "native":
				newFlag = ClassDefinition.IS_NATIVE;
				break;
			case "__fake__":
				newFlag = ClassDefinition.IS_FAKE;
				break;
			default:
				throw new Error("logic flaw");
			}
			if ((this._classFlags & newFlag) != 0) {
				this._newError("same attribute cannot be specified more than once");
				return false;
			}
			this._classFlags |= newFlag;
		}
		var className = this._expectIdentifier(null);
		if (className == null)
			return false;
		// template
		if ((this._typeArgs = this._formalTypeArguments()) == null) {
			return false;
		}
		this._classType = new ParsedObjectType(
			new QualifiedName(className, null),
			this._typeArgs.map(function (token) {
				// convert formal typearg (Token) to actual typearg (Type)
				return new ParsedObjectType(new QualifiedName(token, null), []);
			}));
		this._objectTypesUsed.push(this._classType);
		// extends
		if ((this._classFlags & (ClassDefinition.IS_INTERFACE | ClassDefinition.IS_MIXIN)) == 0) {
			if (this._expectOpt("extends") != null) {
				this._extendType = this._objectTypeDeclaration(
					null,
					function (classDef) {
						return (classDef.flags() & (ClassDefinition.IS_MIXIN | ClassDefinition.IS_INTERFACE | ClassDefinition.IS_FINAL)) == 0;
					});
			}
			if (this._extendType == null && className.getValue() != "Object") {
				this._extendType = new ParsedObjectType(new QualifiedName(new Token("Object", true), null), []);
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
			return false;
		var members = [];

		var success = true;
		while (this._expectOpt("}") == null) {
			if (! this._expectIsNotEOF())
				break;
			var member = this._memberDefinition();
			if (member != null) {
				for (var i = 0; i < members.length; ++i) {
					if (member.name() == members[i].name()
						&& (member.flags() & ClassDefinition.IS_STATIC) == (members[i].flags() & ClassDefinition.IS_STATIC)) {
						if (member instanceof MemberFunctionDefinition && members[i] instanceof MemberFunctionDefinition) {
							if (Util.typesAreEqual(member.getArgumentTypes(), members[i].getArgumentTypes())) {
								this._errors.push(new CompileError(
									member.getToken(),
									"a " + ((member.flags() & ClassDefinition.IS_STATIC) != 0 ? "static" : "member")
									+ " function with same name and arguments is already defined"));
								success = false;
								break;
							}
						} else {
							this._errors.push(new CompileError(member.getToken(), "a property with same name already exists; only functions may be overloaded"));
							success = false;
							break;
						}
					}
				}
				members.push(member);
			} else {
				this._skipStatement();
			}
		}

		// check name conflicts
		if ((this._classFlags & ClassDefinition.IS_NATIVE) == 0 && Parser._isReservedClassName(className.getValue())) {
			// any better way to check that we are parsing a built-in file?
			this._errors.push(new CompileError(className, "cannot re-define a built-in class"));
			success = false;
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
			return false;

		// done
		if (this._typeArgs.length != 0) {
			this._templateClassDefs.push(new TemplateClassDefinition(className, className.getValue(), this._classFlags, this._typeArgs, this._extendType, this._implementTypes, members, this._objectTypesUsed, docComment));
		} else {
			var classDef = new ClassDefinition(className, className.getValue(), this._classFlags, this._extendType, this._implementTypes, members, this._objectTypesUsed, docComment);
			this._classDefs.push(classDef);
			classDef.setParser(this);
		}
		return true;
	},

	_memberDefinition: function () {
		var flags = 0;
		var docComment = null;
		while (true) {
			var token = this._expect([ "function", "var", "static", "abstract", "override", "final", "const", "native", "__readonly__", "inline", "__pure__", "delete" ]);
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
			}
			else if (token.getValue() == "function" || token.getValue() == "var")
				break;
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
			default:
				throw new Error("logic flaw");
			}
			if ((flags & newFlag) != 0) {
				this._newError("same attribute cannot be specified more than once");
				return null;
			}
			flags |= newFlag;
		}
		if ((this._classFlags & ClassDefinition.IS_INTERFACE) != 0)
			flags |= ClassDefinition.IS_ABSTRACT;
		if (token.getValue() == "function") {
			return this._functionDefinition(token, flags, docComment);
		}
		// member variable decl.
		if ((flags & ~(ClassDefinition.IS_STATIC | ClassDefinition.IS_ABSTRACT | ClassDefinition.IS_CONST | ClassDefinition.IS_READONLY | ClassDefinition.IS_INLINE)) != 0) {
			this._newError("variables may only have attributes: static, abstract, const");
			return null;
		}
		if ((flags & ClassDefinition.IS_READONLY) != 0 && (this._classFlags & ClassDefinition.IS_NATIVE) == 0) {
			this._newError("only native classes may use the __readonly__ attribute");
			return null;
		}
		var name = this._expectIdentifier(null);
		if (name == null)
			return null;
		var type = null;
		if (this._expectOpt(":") != null)
			if ((type = this._typeDeclaration(false)) == null)
				return null;
		var initialValue = null;
		if (this._expectOpt("=") != null) {
			if ((flags & ClassDefinition.IS_ABSTRACT) != 0) {
				this._newError("abstract variable cannot have default value");
				return null;
			}
			if ((initialValue = this._assignExpr(false)) == null)
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
		return new MemberVariableDefinition(token, name, flags, type, initialValue, docComment);
	},

	_functionDefinition: function (token, flags, docComment) {
		// name
		var name = this._expectIdentifier(null);
		if (name == null)
			return null;
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
		if (typeArgs.length != 0 && (this._classFlags & ClassDefinition.IS_NATIVE) == 0) {
			this._newError("only native classes may have template functions (for the time being)");
			return null;
		}
		this._typeArgs = this._typeArgs.concat(typeArgs);
		var numObjectTypesUsed = this._objectTypesUsed.length;

		try {
			if (this._expect("(") == null)
				return null;
			// arguments
			var args = this._functionArgumentsExpr((this._classFlags & ClassDefinition.IS_NATIVE) != 0, true);
			if (args == null)
				return null;
			// return type
			var returnType;
			if (name.getValue() == "constructor") {
				// no return type
				returnType = Type.voidType;
			} else {
				if (this._expect(":", "return type declaration is mandatory") == null)
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
			function createDefinition(locals, statements, closures, lastToken) {
				return typeArgs.length != 0
					? new TemplateFunctionDefinition(token, name, flags, typeArgs, returnType, args, locals, statements, closures, lastToken, docComment)
					: new MemberFunctionDefinition(token, name, flags, returnType, args, locals, statements, closures, lastToken, docComment);
			}
			// take care of abstract function
			if ((this._classFlags & (ClassDefinition.IS_INTERFACE | ClassDefinition.IS_DELETE)) != 0) {
				if (this._expect(";") == null)
					return null;
				return createDefinition(null, null, null, null);
			} else if ((flags & (ClassDefinition.IS_ABSTRACT | ClassDefinition.IS_NATIVE)) != 0) {
				var token = this._expect([ ";", "{" ]);
				if (token == null)
					return null;
				if (token.getValue() == ";")
					return createDefinition(null, null, null, null);
			} else {
				if (this._expect("{") == null)
					return null;
			}
			// body
			this._arguments = args;
			this._locals = [];
			this._statements = [];
			this._closures = [];
			if (name.getValue() == "constructor")
				var lastToken = this._initializeBlock();
			else
				lastToken = this._block();
			// done
			var funcDef = createDefinition(this._locals, this._statements, this._closures, lastToken);
			this._locals = null;
			this._statements = null;
			return funcDef;
		} finally {
			this._typeArgs.splice(this._typeArgs.length - typeArgs.length, this._typeArgs.length);
			if (typeArgs.length != 0) {
				this._objectTypesUsed.splice(numObjectTypesUsed);
			}
		}
	},

	_formalTypeArguments: function () {
		if (this._expectOpt(".") == null) {
			return [];
		}
		if (this._expect("<") == null) {
			return null;
		}
		var typeArgs = [];
		do {
			var typeArg = this._expectIdentifier(null);
			if (typeArg == null)
				return null;
			typeArgs.push(typeArg);
			var token = this._expectOpt([ ",", ">" ]);
			if (token == null)
				return null;
		} while (token.getValue() == ",");
		return typeArgs;
	},

	_actualTypeArguments: function () {
		var types = [];
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
			var type = this._typeDeclaration(false);
			if (type == null)
				return null;
			types.push(type);
			var token = this._expect([ ">", "," ]);
			if (token == null)
				return null;
		} while (token.getValue() == ",");
		return types;
	},

	_typeDeclaration: function (allowVoid) {
		if (this._expectOpt("void") != null) {
			if (! allowVoid) {
				this._newError("'void' cannot be used here");
				return null;
			}
			return Type.voidType;
		}
		var typeDecl = this._typeDeclarationNoArrayNoVoid();
		if (typeDecl == null)
			return null;
		// []
		while (this._expectOpt("[") != null) {
			if ((token = this._expect("]")) == null)
				return false;
			if (typeDecl instanceof NullableType) {
				this._newError("Nullable.<T> cannot be an array, should be: T[]");
				return null;
			}
			typeDecl = this._registerArrayTypeOf(token, typeDecl);
		}
		return typeDecl;
	},

	_typeDeclarationNoArrayNoVoid: function () {
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
	},

	_nullableTypeDeclaration: function () {
		if (this._expect(".") == null || this._expect("<") == null)
			return null;
		var baseType = this._typeDeclaration(false);
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
				if (baseType.equals(new ParsedObjectType(new QualifiedName(this._typeArgs[i], null), []))) {
					return baseType.toNullableType(true);
				}
			}
		}
		return baseType.toNullableType();
	},

	_primaryTypeDeclaration: function () {
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
			return this._objectTypeDeclaration(null, null);
		}
	},

	_objectTypeDeclaration: function (firstToken, autoCompleteMatchCb) {
		var qualifiedName = firstToken !== null ? this._qualifiedNameStartingWith(firstToken, autoCompleteMatchCb) : this._qualifiedName(false, autoCompleteMatchCb);
		if (qualifiedName == null)
			return null;
		var typeArgs = this._actualTypeArguments();
		if (typeArgs == null) {
			return null;
		} else if (typeArgs.length != 0) {
			return this._templateTypeDeclaration(qualifiedName, typeArgs);
		} else {
			// object
			var objectType = new ParsedObjectType(qualifiedName, []);
			this._objectTypesUsed.push(objectType);
			return objectType;
		}
	},

	_templateTypeDeclaration: function (qualifiedName, typeArgs) {
		var className = qualifiedName.getToken().getValue();
		if ((className == "Array" || className == "Map") && typeArgs[0] instanceof NullableType) {
			this._newError("cannot declare " + className + ".<Nullable.<T>>, should be " + className + ".<T>");
			return null;
		}
		// return object type
		var objectType = new ParsedObjectType(qualifiedName, typeArgs);
		this._objectTypesUsed.push(objectType);
		return objectType;
	},

	_lightFunctionTypeDeclaration: function (objectType) {
		// parse args
		var argTypes = [];
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
		if (this._expect("->") == null)
			return false;
		var returnType = this._typeDeclaration(true);
		if (returnType == null)
			return null;
		if (objectType != null)
			return new MemberFunctionType(objectType, returnType, argTypes, true);
		else
			return new StaticFunctionType(returnType, argTypes, true);
	},

	_functionTypeDeclaration: function (objectType) {
		// optional function name
		this._expectIdentifierOpt(null);
		// parse args
		if(this._expect("(") == null)
			return null;
		var argTypes = [];
		if (this._expectOpt(")") == null) {
			do {
				var isVarArg = this._expectOpt("...") != null;
				this._expectIdentifierOpt(null); // may have identifiers
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
			return false;
		var returnType = this._typeDeclaration(true);
		if (returnType == null)
			return null;
		if (objectType != null)
			return new MemberFunctionType(objectType, returnType, argTypes, true);
		else
			return new StaticFunctionType(returnType, argTypes, true);
	},

	_registerArrayTypeOf: function (token, elementType) {
		var arrayType = new ParsedObjectType(new QualifiedName(new Token("Array", true), null), [ elementType ], token);
		this._objectTypesUsed.push(arrayType);
		return arrayType;
	},

	_initializeBlock: function () {
		var token;
		while ((token = this._expectOpt("}")) == null) {
			var state = this._preserveState();
			if (! this._constructorInvocationStatement()) {
				this._restoreState(state);
				return this._block();
			}
		}
		return token;
	},

	_block: function () {
		var token;
		while ((token = this._expectOpt("}")) == null) {
			if (! this._expectIsNotEOF())
				return null;
			if (! this._statement())
				this._skipStatement();
		}
		return token;
	},

	_statement: function () {
		// has a label?
		var state = this._preserveState();
		var label = this._expectIdentifierOpt(null);
		if (label != null && this._expectOpt(":") != null) {
			// within a label
		} else {
			this._restoreState(state);
			label = null;
		}
		// parse the statement
		var token = this._expectOpt([
			"{", "var", ";", "if", "do", "while", "for", "continue", "break", "return", "switch", "throw", "try", "assert", "log", "delete", "debugger", "function", "void"
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
				return this._variableStatement();
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
				throw new "logic flaw, got " + token.getValue();
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
	},

	_constructorInvocationStatement: function () {
		// get class
		var token;
		if ((token = this._expectOpt("super")) != null) {
			var classType = this._extendType;
		} else if ((token = this._expectOpt("this")) != null) {
			classType = this._classType;
		} else {
			if ((classType = this._objectTypeDeclaration(null)) == null)
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
	},

	_variableStatement: function () {
		var succeeded = [ false ];
		var expr = this._variableDeclarations(false, succeeded);
		if (! succeeded[0])
			return false;
		if (this._expect(";") == null)
			return false;
		if (expr != null)
			this._statements.push(new ExpressionStatement(expr));
		return true;
	},

	_functionStatement: function (token) {
		var name = this._expectIdentifier();
		if (name == null)
			return false;

		var funcExpr = this._functionExpr(token, name);
		if (funcExpr == null)
			return false;
		var local = this._registerLocal(name, funcExpr.getFuncDef().getType());
		var expr = new LocalExpression(name, local);
		var t= new Token("=", true, token._filename, token._lineNumber, token._columnNumber);
		expr = new AssignmentExpression(t, expr, funcExpr);
		this._statements.push(new ExpressionStatement(expr));
		return true;
	},

	_ifStatement: function (token) {
		if (this._expect("(") == null)
			return false;
		var expr = this._expr(false);
		if (expr == null)
			return false;
		if (this._expect(")") == null)
			return false;
		var onTrueStatements = this._subStatements();
		var onFalseStatements = [];
		if (this._expectOpt("else") != null) {
			onFalseStatements = this._subStatements();
		}
		this._statements.push(new IfStatement(token, expr, onTrueStatements, onFalseStatements));
		return true;
	},

	_doWhileStatement: function (token, label) {
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
	},

	_whileStatement: function (token, label) {
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
	},

	_forStatement: function (token, label) {
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
		if (! this._expect("(") == null)
			return false;
		// parse initialization expression
		var initExpr = null;
		if (this._expectOpt(";") != null) {
			// empty expression
		} else if (this._expectOpt("var") != null) {
			var succeeded = [ false ];
			initExpr = this._variableDeclarations(true, succeeded);
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
		var condExpr = null;
		if (this._expectOpt(";") != null) {
			// empty expression
		} else {
			if ((condExpr = this._expr(false)) == null)
				return false;
			if (this._expect(";") == null)
				return false;
		}
		// parse post expression
		var postExpr = null;
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
	},

	_forInStatement: function (token, label) {
		if (! this._expect("(") == null)
			return 0; // failure
		var lhsExpr;
		if (this._expectOpt("var") != null) {
			if ((lhsExpr = this._variableDeclaration(true)) == null)
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
	},

	_continueStatement: function (token) {
		var label = this._expectIdentifierOpt(null);
		if (this._expect(";") == null)
			return false;
		this._statements.push(new ContinueStatement(token, label));
		return true;
	},

	_breakStatement: function (token) {
		var label = this._expectIdentifierOpt(null);
		if (this._expect(";") == null)
			return false;
		this._statements.push(new BreakStatement(token, label));
		return true;
	},

	_returnStatement: function (token) {
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
	},

	_switchStatement: function (token, label) {
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
		this._statements.push(new SwitchStatement(token, label, expr, this._statements.splice(startStatementIndex)));
		return true;
	},

	_throwStatement: function (token) {
		var expr = this._expr();
		if (expr == null)
			return false;
		this._statements.push(new ThrowStatement(token, expr));
		return true;
	},

	_tryStatement: function (tryToken) {
		if (this._expect("{") == null)
			return false;
		var startIndex = this._statements.length;
		if (this._block() == null)
			return false;
		var tryStatements = this._statements.splice(startIndex);
		var catchStatements = [];
		var catchOrFinallyToken = this._expect([ "catch", "finally" ]);
		if (catchOrFinallyToken == null)
			return false;
		for (;
			catchOrFinallyToken != null && catchOrFinallyToken.getValue() == "catch";
			catchOrFinallyToken = this._expectOpt([ "catch", "finally" ])) {
			var catchIdentifier;
			var catchType;
			if (this._expect("(") == null
				|| (catchIdentifier = this._expectIdentifier(null)) == null
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
			catchStatements.push(new CatchStatement(catchOrFinallyToken, caughtVariable, this._statements.splice(startIndex)));
		}
		if (catchOrFinallyToken != null) {
			// finally
			if (this._expect("{") == null)
				return false;
			if (this._block() == null)
				return false;
			var finallyStatements = this._statements.splice(startIndex);
		} else {
			finallyStatements = [];
		}
		this._statements.push(new TryStatement(tryToken, tryStatements, catchStatements, finallyStatements));
		return true;
	},

	_assertStatement: function (token) {
		var expr = this._expr();
		if (expr == null)
			return false;
		if (this._expect(";") == null)
			return false;
		this._statements.push(new AssertStatement(token, expr));
		return true;
	},

	_logStatement: function (token) {
		var exprs = [];
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
	},

	_deleteStatement: function (token) {
		var expr = this._expr();
		if (expr == null)
			return false;
		if (this._expect(";") == null)
			return false;
		this._statements.push(new DeleteStatement(token, expr));
		return true;
	},

	_debuggerStatement: function (token) {
		this._statements.push(new DebuggerStatement(token));
		return true;
	},

	_subStatements: function () {
		var statementIndex = this._statements.length;
		if (! this._statement())
			this._skipStatement();
		return this._statements.splice(statementIndex);
	},

	_variableDeclarations: function (noIn, isSuccess) {
		isSuccess[0] = false;
		var expr = null;
		var commaToken = null;
		do {
			var declExpr = this._variableDeclaration(noIn);
			if (declExpr == null)
				return null;
			// do not push variable declarations wo. assignment
			if (! (declExpr instanceof LocalExpression))
				expr = expr != null ? new CommaExpression(commaToken, expr, declExpr) : declExpr;
		} while ((commaToken = this._expectOpt(",")) != null);
		isSuccess[0] = true;
		return expr;
	},

	_variableDeclaration: function (noIn) {
		var identifier = this._expectIdentifier(null);
		if (identifier == null)
			return null;
		var type = null;
		if (this._expectOpt(":"))
			if ((type = this._typeDeclaration(false)) == null)
				return null;
		// FIXME value should be registered after parsing the initialization expression, but that prevents: var f = function () : void { f(); };
		var local = this._registerLocal(identifier, type);
		// parse initial value (optional)
		var initialValue = null;
		var assignToken;
		if ((assignToken = this._expectOpt("=")) != null)
			if ((initialValue = this._assignExpr(noIn)) == null)
				return null;
		var expr = new LocalExpression(identifier, local);
		if (initialValue != null)
			expr = new AssignmentExpression(assignToken, expr, initialValue);
		return expr;
	},

	_expr: function (noIn) {
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
	},

	_assignExpr: function (noIn) {
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
				return new AssignmentExpression(op, lhsExpr, assignExpr);
			}
		}
		// failed to parse as lhs op assignExpr, try condExpr
		this._restoreState(state);
		return this._condExpr(noIn);
	},

	_condExpr: function (noIn) {
		var lorExpr = this._lorExpr(noIn);
		if (lorExpr == null)
			return null;
		var operatorToken;
		if ((operatorToken = this._expectOpt("?")) == null)
			return lorExpr;
		var ifTrueExpr = null;
		var ifFalseExpr = null;
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
	},

	_binaryOpExpr: function (ops, excludePattern, parseFunc, noIn, builderFunc) {
		var expr = parseFunc.call(this, noIn);
		if (expr == null)
			return null;
		while (true) {
			var op = this._expectOpt(ops, excludePattern);
			if (op == null)
				break;
			var rightExpr = parseFunc.call(this);
			if (rightExpr == null)
				return null;
			expr = builderFunc(op, expr, rightExpr);
		}
		return expr;
	},

	_lorExpr: function (noIn) {
		return this._binaryOpExpr([ "||" ], null, this._landExpr, noIn, function (op, e1, e2) {
			return new LogicalExpression(op, e1, e2);
		});
	},

	_landExpr: function (noIn) {
		return this._binaryOpExpr([ "&&" ], null, this._borExpr, noIn, function (op, e1, e2) {
			return new LogicalExpression(op, e1, e2);
		});
	},

	_borExpr: function (noIn) {
		return this._binaryOpExpr([ "|" ], /^\|\|/, this._bxorExpr, noIn, function (op, e1, e2) {
			return new BinaryNumberExpression(op, e1, e2);
		});
	},

	_bxorExpr: function (noIn) {
		return this._binaryOpExpr([ "^" ], null, this._bandExpr, noIn, function (op, e1, e2) {
			return new BinaryNumberExpression(op, e1, e2);
		});
	},

	_bandExpr: function (noIn) {
		return this._binaryOpExpr([ "&" ], /^&&/, this._eqExpr, noIn, function (op, e1, e2) {
			return new BinaryNumberExpression(op, e1, e2);
		});
	},

	_eqExpr: function (noIn) {
		return this._binaryOpExpr([ "==", "!=" ], null, this._relExpr, noIn, function (op, e1, e2) {
			return new EqualityExpression(op, e1, e2);
		});
	},

	_relExpr: function (noIn) {
		var ops = [ "<=", ">=", "<", ">" ];
		if (! noIn)
			ops.push("in");
		return this._binaryOpExpr(ops, null, this._shiftExpr, noIn, function (op, e1, e2) {
			if (op.getValue() == "in")
				return new InExpression(op, e1, e2);
			else
				return new BinaryNumberExpression(op, e1, e2);
		});
	},

	_shiftExpr: function () {
		var expr = this._binaryOpExpr([ ">>>", "<<", ">>" ], null, this._addExpr, false, function (op, e1, e2) {
			return new ShiftExpression(op, e1, e2);
		});
		return expr;
	},

	_addExpr: function () {
		return this._binaryOpExpr([ "+", "-" ], /^[+-]{2}/, this._mulExpr, false, function (op, e1, e2) {
			if (op.getValue() == "+")
				return new AdditiveExpression(op, e1, e2);
			else
				return new BinaryNumberExpression(op, e1, e2);
		});
	},

	_mulExpr: function () {
		return this._binaryOpExpr([ "*", "/", "%" ], null, this._unaryExpr, false, function (op, e1, e2) {
			return new BinaryNumberExpression(op, e1, e2);
		});
	},

	_unaryExpr: function () {
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
		}
	},

	_asExpr: function () {
		var expr = this._postfixExpr();
		if (expr == null)
			return null;
		var token;
		while ((token = this._expectOpt("as")) != null) {
			var noConvert = this._expectOpt("__noconvert__");
			var type = this._typeDeclaration(false);
			if (type == null)
				return null;
			expr = noConvert ? new AsNoConvertExpression(token, expr, type) : new AsExpression(token, expr, type);
		}
		return expr;
	},

	_postfixExpr: function () {
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
	},

	_lhsExpr: function () {
		var state = this._preserveState();
		var expr;
		var token = this._expectOpt([ "new", "super", "(", "function" ]);
		if (token != null) {
			switch (token.getValue()) {
			case "super":
				return this._superExpr();
			case "(":
				expr = this._lambdaExpr(token);
				if (expr == null) {
					this._restoreState(state);
					expr = this._primaryExpr();
					if (expr == null)
						return null;
				}
				break;
			case "function":
				expr = this._functionExpr(token, null);
				break;
			case "new":
				expr = this._newExpr(token);
				break;
			default:
				throw new Error("logic flaw");
			}
		} else {
			expr = this._primaryExpr();
		}
		if (expr == null)
			return null;
		while ((token = this._expectOpt([ "(", "[", "." ])) != null) {
			switch (token.getValue()) {
			case "(":
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
	},

	_newExpr: function (newToken) {
		var type = this._typeDeclarationNoArrayNoVoid();
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
			args = [];
		}
		return new NewExpression(newToken, type, args);
	},

	_superExpr: function () {
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
	},

	_lambdaExpr: function (token) {
		var args = this._functionArgumentsExpr(false, false);
		if (args == null)
			return null;
		var returnType = null;
		if (this._expectOpt(":") != null) {
			if ((returnType = this._typeDeclaration(true)) == null)
				return null;
		}
		if (this._expect("->") == null)
			return null;
		var funcDef = this._lambdaBody(token, args, returnType);
		if (funcDef == null)
			return null;
		this._closures.push(funcDef);
		return new FunctionExpression(token, funcDef);
	},

	_lambdaBody: function (token, args, returnType) {
		var openBlock = this._expectOpt("{");
		var state = this._pushScope(args);
		try {
			// parse lambda body
			if (openBlock == null) {
				var expr = this._expr();
				this._statements.push(new ReturnStatement(token, expr));
				return new MemberFunctionDefinition(
						token, null, ClassDefinition.IS_STATIC, returnType, args, this._locals, this._statements, this._closures, null, null);
			} else {
				var lastToken = this._block();
				if (lastToken == null)
					return null;
				return new MemberFunctionDefinition(
						token, null, ClassDefinition.IS_STATIC, returnType, args, this._locals, this._statements, this._closures, lastToken, null);
			}
		} finally {
			this._popScope();
		}
	},

	_functionExpr: function (token, nameOfFunctionStatement) {
		var requireTypeDeclaration = nameOfFunctionStatement != null;
		if (this._expect("(") == null)
			return null;
		var args = this._functionArgumentsExpr(false, requireTypeDeclaration);
		if (args == null)
			return null;
		var parseReturnType = false;
		if (requireTypeDeclaration) {
			if (this._expect(":") == null)
				return null;
			parseReturnType = true;
		} else {
			if (this._expectOpt(":") != null) {
				parseReturnType = true;
			}
		}
		if (parseReturnType) {
			var returnType = this._typeDeclaration(true);
			if (returnType == null) {
				return null;
			}
		} else {
			returnType = null;
		}
		if (this._expect("{") == null)
			return null;

		if (nameOfFunctionStatement != null) {
			// add name to current scope for local function declaration
			var argTypes = args.map(function(arg) { return arg.getType(); });
			var type = new StaticFunctionType(returnType, argTypes, false);
			this._registerLocal(nameOfFunctionStatement, type);
		}
		// parse function block
		var state = this._pushScope(args);
		var lastToken = this._block();
		if (lastToken == null) {
			this._popScope();
			return null;
		}
		var funcDef = new MemberFunctionDefinition(token, null, ClassDefinition.IS_STATIC, returnType, args, this._locals, this._statements, this._closures, lastToken, null);
		this._popScope();
		this._closures.push(funcDef);
		return new FunctionExpression(token, funcDef);
	},

	_forEachScope: function (cb) {
		if (this._locals != null) {
			if (! cb(this._locals, this._arguments)) {
				return false;
			}
			for (var scope = this._prevScope; scope != null; scope = scope.prev) {
				if (scope.locals && ! cb(scope.locals, scope.arguments)) {
					return false;
				}
			}
		}
		return true;
	},

	_findLocal: function (name) {
		var found = null;
		this._forEachScope(function (locals, args) {
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
	},

	_primaryExpr: function () {
		var token;
		if ((token = this._expectOpt([ "this", "undefined", "null", "false", "true", "[", "{", "(" ])) != null) {
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
				return this._hashLiteral(token);
			case "(":
				var expr = this._expr(false);
				if (this._expect(")") == null)
					return null;
				return expr;
			}
		} else if ((token = this._expectNumberLiteralOpt()) != null) {
			return new NumberLiteralExpression(token);
		} else if ((token = this._expectIdentifierOpt(function (self) { return self._getCompletionCandidatesWithLocal(); })) != null) {
			var local = this._findLocal(token.getValue());
			if (local != null) {
				return new LocalExpression(token, local);
			} else {
				var parsedType = this._objectTypeDeclaration(token);
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
		}
	},

	_nullLiteral: function (token) {
		var type = Type.nullType;
		if (this._expectOpt(":") != null) {
			if ((type = this._typeDeclaration(false)) == null)
				return null;
			if (type instanceof PrimitiveType) {
				this._newError("type '" + type.toString() + "' is not nullable");
				return null;
			}
		}
		return new NullExpression(token, type);
	},

	_arrayLiteral: function (token) {
		var exprs = [];
		if (this._expectOpt("]") == null) {
			do {
				var expr = this._assignExpr();
				if (expr == null)
					return null;
				exprs.push(expr);
				var token = this._expect([ ",", "]" ]);
				if (token == null)
					return null;
			} while (token.getValue() == ",");
		}
		var type = null;
		if (this._expectOpt(":") != null)
			if ((type = this._typeDeclaration(false)) == null)
				return null;
		return new ArrayLiteralExpression(token, exprs, type);
	},

	_hashLiteral: function (token) {
		var elements = [];
		if (this._expectOpt("}") == null) {
			do {
				// obtain key
				var keyToken;
				if ((keyToken = this._expectIdentifierOpt(null)) != null
					|| (keyToken = this._expectNumberLiteralOpt()) != null
					|| (keyToken = this._expectStringLiteralOpt()) != null) {
					// ok
				} else {
					this._newError("expected identifier, number or string but got '" + token.toString() + "'");
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
				if ((token = this._expect([ ",", "}" ])) == null)
					return null;
			} while (token.getValue() == ",");
		}
		var type = null;
		if (this._expectOpt(":") != null)
			if ((type = this._typeDeclaration(false)) == null)
				return null;
		return new MapLiteralExpression(token, elements, type);
	},

	_functionArgumentsExpr: function (allowVarArgs, requireTypeDeclaration) {
		var args = [];
		if (this._expectOpt(")") == null) {
			do {
				var isVarArg = allowVarArgs && (this._expectOpt("...") != null);
				var argName = this._expectIdentifier(null);
				if (argName == null)
					return null;
				var argType = null;
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
				// FIXME KAZUHO support default arguments
				args.push(new ArgumentDeclaration(argName, argType));
				var token = this._expect([ ")", "," ]);
				if (token == null)
					return null;
			} while (token.getValue() == ",");
		}
		return args;
	},

	_argsExpr: function () {
		var args = [];
		if (this._expectOpt(")") == null) {
			do {
				var arg = this._assignExpr(false);
				if (arg == null)
					return null;
				args.push(arg);
				var token = this._expect([ ")", "," ]);
				if (token == null)
					return null;
			} while (token.getValue() == ",");
		}
		return args;
	},

	_getCompletionCandidatesOfTopLevel: function (autoCompleteMatchCb) {
		return new CompletionCandidatesOfTopLevel(this, autoCompleteMatchCb);
	},

	_getCompletionCandidatesWithLocal: function () {
		return new _CompletionCandidatesWithLocal(this);
	},

	_getCompletionCandidatesOfNamespace: function (imprt, autoCompleteMatchCb) {
		return new _CompletionCandidatesOfNamespace(imprt, autoCompleteMatchCb);
	},

	_getCompletionCandidatesOfProperty: function (expr) {
		return new _CompletionCandidatesOfProperty(expr);
	},

	$_isReservedClassName: function (name) {
		return name.match(/^(Array|Boolean|Date|Function|Map|Number|Object|RegExp|String|Error|EvalError|RangeError|ReferenceError|SyntaxError|TypeError|JSX)$/) != null;
	}

});

