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
eval(Class.$import("./util"));

"use strict";

var Token = exports.Token = Class.extend({

	constructor: function (value, isIdentifier, filename, lineNumber, columnNumber) {
		this._value = value;
		this._isIdentifier = isIdentifier;
		// two args or five args
		this._filename = filename || null;
		this._lineNumber = lineNumber || NaN;
		this._columnNumber = columnNumber || NaN;
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

		var multiLineComment  = "(?: /\\* (?: [^*] | (?: \\*+ [^*\\/]) )* \\*+/)";
		var singleLineComment = "(?: // [^\\r\\n]* )";
		var comment           = this.makeAlt([multiLineComment, singleLineComment]);
		var whiteSpace        = "[\\x20\\t\\r\\n]+";

		// regular expressions
		this.rxIdent          = this.rx("^" + ident);
		this.rxStringLiteral  = this.rx("^" + stringLiteral);
		this.rxNumberLiteral  = this.rx("^" + numberLiteral);
		this.rxIntegerLiteral = this.rx("^" + integerLiteral);
		this.rxRegExpLiteral  = this.rx("^" + regexpLiteral);
		this.rxSpace          = this.rx("^" + this.makeAlt([comment, whiteSpace]) + "+");
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

	assertExistenceOfNamedClasses: function (errors) {
		if (this._classNames != null) {
			for (var i = 0; i < this._classNames.length; ++i) {
				switch (this.getClasses(this._classNames[i].getValue()).length) {
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
	},

	getClasses: function (name) {
		// filter by classNames, if set
		if (this._classNames != null) {
			for (var i = 0; i < this._classNames.length; ++i)
				if (this._classNames[i].getValue() == name)
					break;
			if (i == this._classNames.length)
				return [];
		} else {
			if (name.charAt(0) == '_')
				return [];
		}
		// lookup
		var found = [];
		for (var i = 0; i < this._sourceParsers.length; ++i) {
			var classDefs = this._sourceParsers[i].getClassDefs();
			for (var j = 0; j < classDefs.length; ++j) {
				var className = classDefs[j].className();
				if (className == name) {
					found.push(classDefs[j]);
					break;
				}
			}
		}
		return found;
	},

	getTemplateClasses: function (name) {
		var found = [];
		for (var i = 0; i < this._sourceParsers.length; ++i) {
			var classDefs = this._sourceParsers[i].getTemplateClassDefs();
			for (var j = 0; j < classDefs.length; ++j) {
				var className = classDefs[j].className();
				if (className.charAt(0) != '_' && className == name) {
					found.push(classDefs[j]);
					break;
				}
			}
		}
		return found;
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

	getClass: function (context) {
		if (this._import != null) {
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
		} else if ((classDef = context.parser.lookup(context.errors, this._token, this._token.getValue())) == null) {
			context.errors.push(new CompileError(this._token, "no class definition for '" + this._token.getValue() + "'"));
			return null;
		}
		return classDef;
	}

});

var Parser = exports.Parser = Class.extend({

	constructor: function (sourceToken, filename) {
		this._sourceToken = sourceToken;
		this._filename = filename;
	},

	parse: function (input, errors) {
		// lexer properties
		this._input = input;
		this._initInput();
		this._tokenLength = 0;
		// for source map
		this._lineNumber = 1;
		// output
		this._errors = errors;
		this._templateClassDefs = [];
		this._classDefs = [];
		this._imports = [];
		// use for function parsing
		this._locals = [];
		this._statements = [];
		this._closures = [];
		this._extendName = null;
		this._implementNames = [];
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

	_initInput: function () {
		this._remainingInput = this._input;
	},
	_getPos: function () {
		return this._input.length - this._remainingInput.length;
	},
	_getInput: function () {
		return this._remainingInput;
	},
	_getInputByLength: function (length) {
		return this._remainingInput.substring(0, length);
	},
	_forwardPos: function (len) {
		this._remainingInput = this._remainingInput.substring(len);
	},

	getSourceToken: function () {
		return this._sourceToken;
	},

	getPath: function () {
		return this._filename;
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

	lookup: function (errors, contextToken, name) {
		// class within the file is preferred
		for (var i = 0; i < this._classDefs.length; ++i) {
			if (this._classDefs[i].className() == name)
				return this._classDefs[i];
		}
		// instantiated templates never get imported
		if (name.match(/\.</) != null)
			return null;
		// classnames within the imported files may conflict
		var found = [];
		for (var i = 0; i < this._imports.length; ++i) {
			if (this._imports[i].getAlias() == null)
				found = found.concat(this._imports[i].getClasses(name));
		}
		if (found.length == 1)
			return found[0];
		if (found.length >= 2)
			errors.push(new CompileError(contextToken, "multiple candidates exist for class name '" + name + "'"));
		return null;
	},

	lookupTemplate: function (errors, contextToken, name) {
		// class within the file is preferred
		for (var i = 0; i < this._templateClassDefs.length; ++i) {
			if (this._templateClassDefs[i].className() == name)
				return this._templateClassDefs[i];
		}
		// classnames within the imported files may conflict
		var found = [];
		for (var i = 0; i < this._imports.length; ++i) {
			found = found.concat(this._imports[i].getTemplateClasses(name));
		}
		if (found.length == 1)
			return found[0];
		if (found.length >= 2)
			errors.push(new CompileError(contextToken, "multiple candidates exist for template class name '" + name + "'"));
		return null;
	},

	registerInstantiatedClass: function (classDef) {
		this._classDefs.push(classDef);
	},

	_pushFunctionState: function () {
		// FIXME use class
		var state = {
			locals: this._locals,
			statements: this._statements,
			closures: this._closures,
		};
		this._locals = [];
		this._statements = [];
		this._closures = [];
		return state;
	},

	_restoreFunctionState: function (state) {
		this._locals = state.locals;
		this._statements = state.statements;
		this._closures = state.closures;
	},

	_registerLocal: function (identifierToken, type) {
		for (var i = 0; i < this._locals.length; i++) {
			if (this._locals[i].getName().getValue() == identifierToken.getValue()) {
				if (type != null && ! this._locals[i].getType().equals(type))
					this._newError("conflicting types for variable " + identifierToken.getValue());
				return;
			}
		}
		this._locals.push(new LocalVariable(identifierToken, type));
	},

	_preserveState: function () {
		// FIXME use class
		return {
			// lexer properties
			pos: this._getPos(),
			lineNumber: this._lineNumber,
			tokenLength: this._tokenLength,
			// errors
			numErrors: this._errors.length,
			// closures
			numClosures: this._closures.length,
		};
	},

	_restoreState: function (state) {
		this._initInput();
		this._forwardPos(state.pos);
		this._lineNumber = state.lineNumber;
		this._tokenLength = state.tokenLength;
		this._errors.length = state.numErrors;
		this._closures.splice(state.numClosures);
	},

	_getColumn: function () {
		var pos = this._getPos();
		var lastNewline = this._input.lastIndexOf("\n", pos);
		return pos - lastNewline - 1;
	},

	_newError: function (message) {
		this._errors.push(new CompileError(this._filename, this._lineNumber, this._getColumn(), message));
	},

	_advanceToken: function () {
		this._forwardPos(this._tokenLength);
		this._tokenLength = 0;

		// skip whitespaces
		var matched = this._getInput().match(_Lexer.rxSpace);
		if(matched != null) {
			this._forwardPos(matched[0].length);
			this._lineNumber += matched[0].split(_Lexer.rxNewline).length - 1;
		}
	},

	_isEOF: function () {
		this._advanceToken();
		return this._remainingInput.length === 0;
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

	_expectIdentifierOpt: function () {
		this._advanceToken();
		var matched = this._getInput().match(_Lexer.rxIdent);
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

	_expectIdentifier: function () {
		var token = this._expectIdentifierOpt();
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

	_skipLine: function () {
		var matched = this._getInput().match(/^.*(?:\r\n?|\n|$)/);
		this._forwardPos(matched[0].length);
		this._tokenLength = 0;

		// count newlines
		this._lineNumber += matched[0].split(_Lexer.rxNewline).length - 1;
	},

	_qualifiedName: function (allowSuper) {
		// returns a token that contains a qualified name
		if (allowSuper) {
			var token = this._expectOpt("super");
			if (token != null)
				return new QualifiedName(token, null);
		}
		if ((token = this._expectIdentifier()) == null)
			return null;
		var imprt = this.lookupImportAlias(token.getValue());
		if (imprt != null) {
			if (this._expect(".") == null)
				return null;
			token = this._expectIdentifier();
			if (token == null)
				return null;
		}
		return new QualifiedName(token, imprt);
	},

	_importStatement: function (importToken) {
		// parse
		var classes = null;
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
		var alias = null;
		if (this._expectOpt("into") != null) {
			if ((alias = this._expectIdentifier()) == null)
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
		this._extendName = null;
		this._implementNames = [];
		this._objectTypesUsed = [];
		// attributes* class
		var flags = 0;
		while (true) {
			var token = this._expect([ "class", "interface", "mixin", "abstract", "final", "native", "__fake__" ]);
			if (token == null)
				return false;
			if (token.getValue() == "class")
				break;
			if (token.getValue() == "interface") {
				if ((flags & (ClassDefinition.IS_FINAL | ClassDefinition.IS_NATIVE)) != 0) {
					this._newError("interface cannot have final or native attribute set");
					return false;
				}
				flags |= ClassDefinition.IS_INTERFACE;
				break;
			}
			if (token.getValue() == "mixin") {
				if ((flags & (ClassDefinition.IS_FINAL | ClassDefinition.IS_NATIVE)) != 0) {
					this._newError("mixin cannot have final or native attribute set");
					return false;
				}
				flags |= ClassDefinition.IS_MIXIN;
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
			if ((flags & newFlag) != 0) {
				this._newError("same attribute cannot be specified more than once");
				return false;
			}
			flags |= newFlag;
		}
		var className = this._expectIdentifier();
		if (className == null)
			return false;
		// template
		var typeArgs = null;
		if (this._expectOpt(".") != null) {
			if (this._expect("<") == null)
				return false;
			typeArgs = [];
			do {
				var typeArg = this._expectIdentifier();
				if (typeArg == null)
					return false;
				typeArgs.push(typeArg);
				var token = this._expectOpt([ ",", ">" ]);
				if (token == null)
					return false;
			} while (token.getValue() == ",");
		}
		// extends
		if ((flags & (ClassDefinition.IS_INTERFACE | ClassDefinition.IS_MIXIN)) == 0) {
			if (this._expectOpt("extends") != null)
				if ((this._extendName = this._qualifiedName(false)) == null)
					return false;
		} else {
			if ((flags & (ClassDefinition.IS_ABSTRACT | ClassDefinition.IS_FINAL | ClassDefinition.IS_NATIVE)) != 0) {
				this._newError("interface or mixin cannot have attributes: 'abstract', 'final', 'native");
				return false;
			}
		}
		// implements
		if (this._expectOpt("implements") != null) {
			do {
				var name = this._qualifiedName(false);
				if (name == null)
					return false;
				this._implementNames.push(name);
			} while (this._expectOpt(",") != null);
		}
		// body
		if (this._expect("{") == null)
			return false;
		var members = [];

		var success = true;
		while (this._expectOpt("}") == null) {
			if (! this._expectIsNotEOF())
				return false;
			var member = this._memberDefinition(flags);
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
				this._skipLine();
			}
		}

		// check name conflicts
		if ((flags & ClassDefinition.IS_NATIVE) == 0 && Parser._isReservedClassName(className.getValue())) {
			// any better way to check that we are parsing a built-in file?
			this._errors.push(new CompileError(className, "cannot re-define a built-in class"));
			success = false;
		} else {
			for (var i = 0; i < this._imports.length; ++i)
				if (! this._imports[i].checkNameConflict(this._errors, className))
					success = false;
			if (typeArgs != null) {
				for (var i = 0; i < this._templateClassDefs.length; ++i) {
					if (this._classDefs[i].className() == className.getValue()) {
						this._errors.push(new CompileError(className, "template class with the name same has been already declared"));
						success = false;
						break;
					}
				}
			} else {
				for (var i = 0; i < this._classDefs.length; ++i) {
					if (this._classDefs[i].className() == className.getValue()) {
						this._errors.push(new CompileError(className, "class with the same name has been already declared"));
						success = false;
						break;
					}
				}
			}
		}

		if (! success)
			return false;

		// done
		if (typeArgs != null)
			this._templateClassDefs.push(new TemplateClassDefinition(className.getValue(), flags, typeArgs, this._extendName, this._implementNames, members, this._objectTypesUsed));
		else
			this._classDefs.push(new ClassDefinition(className, className.getValue(), flags, this._extendName, this._implementNames, members, this._objectTypesUsed));
		return true;
	},

	_memberDefinition: function (classFlags) {
		var flags = 0;
		while (true) {
			var token = this._expect([ "function", "var", "static", "abstract", "override", "final", "const", "native", "__readonly__" ]);
			if (token == null)
				return null;
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
				if ((classFlags & (ClassDefinition.IS_INTERFACE | ClassDefinition.IS_MIXIN)) != 0) {
					this._newError("interfaces and mixins cannot have static members");
					return null;
				}
				newFlag = ClassDefinition.IS_STATIC;
				break;
			case "abstract":
				newFlag = ClassDefinition.IS_ABSTRACT;
				break;
			case "override":
				if ((classFlags & ClassDefinition.IS_INTERFACE) != 0) {
					this._newError("functions of an interface cannot have 'override' attribute set");
					return null;
				}
				newFlag = ClassDefinition.IS_OVERRIDE;
				break;
			case "final":
				if ((classFlags & ClassDefinition.IS_INTERFACE) != 0) {
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
			default:
				throw new Error("logic flaw");
			}
			if ((flags & newFlag) != 0) {
				this._newError("same attribute cannot be specified more than once");
				return null;
			}
			flags |= newFlag;
		}
		if ((classFlags & ClassDefinition.IS_INTERFACE) != 0)
			flags |= ClassDefinition.IS_ABSTRACT;
		if (token.getValue() == "function") {
			return this._functionDefinition(token, flags, classFlags);
		}
		// member variable decl.
		if ((flags & ~(ClassDefinition.IS_STATIC | ClassDefinition.IS_ABSTRACT | ClassDefinition.IS_CONST | ClassDefinition.IS_READONLY)) != 0) {
			this._newError("variables may only have attributes: static, abstract, const");
			return null;
		}
		if ((flags & ClassDefinition.IS_READONLY) != 0 && (classFlags & ClassDefinition.IS_NATIVE) == 0) {
			this._newError("only native classes may use the __readonly__ attribute");
			return null;
		}
		var name = this._expectIdentifier();
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
		// all non-native values have initial value
		if (initialValue == null && (classFlags & ClassDefinition.IS_NATIVE) == 0)
			initialValue = Expression.getDefaultValueExpressionOf(type);
		return new MemberVariableDefinition(token, name, flags, type, initialValue);
	},

	_functionDefinition: function (token, flags, classFlags) {
		// name
		var name = this._expectIdentifier();
		if (name == null)
			return null;
		if (name.getValue() == "constructor") {
			if ((classFlags & ClassDefinition.IS_INTERFACE) != 0) {
				this._newError("interface cannot have a constructor");
				return null;
			}
			if ((flags & (ClassDefinition.IS_ABSTRACT | ClassDefinition.IS_FINAL)) != 0) {
				this._newError("constructor cannot be declared as 'abstract' or 'final'");
				return null;
			}
			flags |= ClassDefinition.IS_FINAL;
		}
		flags |= classFlags & (ClassDefinition.IS_NATIVE | ClassDefinition.IS_FINAL);
		if (this._expect("(") == null)
			return null;
		// arguments
		var args = this._functionArgumentsExpr();
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
		// take care of abstract function
		if ((classFlags & ClassDefinition.IS_INTERFACE) != 0) {
			if (this._expect(";") == null)
				return null;
			return new MemberFunctionDefinition(token, name, flags, returnType, args, null, null, null);
		} else if ((flags & (ClassDefinition.IS_ABSTRACT | ClassDefinition.IS_NATIVE)) != 0) {
			var token = this._expect([ ";", "{" ]);
			if (token == null)
				return null;
			if (token.getValue() == ";")
				return new MemberFunctionDefinition(token, name, flags, returnType, args, null, null, null);
		} else {
			if (this._expect("{") == null)
				return null;
		}
		// body
		this._locals = [];
		this._statements = [];
		this._closures = [];
		if (name.getValue() == "constructor")
			var lastToken = this._initializeBlock();
		else
			lastToken = this._block();
		// done
		return new MemberFunctionDefinition(token, name, flags, returnType, args, this._locals, this._statements, this._closures, lastToken);
	},

	_typeDeclaration: function (allowVoid) {
		if (allowVoid) {
			var token = this._expectOpt("void");
			if (token != null)
				return Type.voidType;
		}
		var typeDecl = this._typeDeclarationNoArrayNoVoid();
		if (typeDecl == null)
			return null;
		// []
		while (this._expectOpt("[") != null) {
			if ((token = this._expect("]")) == null)
				return false;
			typeDecl = this._registerArrayTypeOf(token, typeDecl);
		}
		return typeDecl;
	},

	_typeDeclarationNoArrayNoVoid: function () {
		var typeDecl;
		var token = this._expectOpt([ "MayBeUndefined", "variant" ]);
		if (token != null) {
			switch (token.getValue()) {
			case "MayBeUndefined":
				if (this._expect(".") == null
					|| this._expect("<") == null)
					return null;
				var baseType = this._primaryTypeDeclaration();
				if (baseType == null)
					return null;
				if (this._expect(">") == null)
					return null;
				typeDecl = baseType.toMayBeUndefinedType();
				break;
			case "variant":
				typeDecl = Type.variantType;
				break;
			default:
				throw new Error("logic flaw");
			}
		} else {
			typeDecl = this._primaryTypeDeclaration();
		}
		return typeDecl;
	},

	_primaryTypeDeclaration: function () {
		var token = this._expectOpt([ "function", "boolean", "int", "number", "string" ]);
		if (token != null) {
			switch (token.getValue()) {
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
			return this._objectTypeDeclaration();
		}
	},

	_objectTypeDeclaration: function () {
		var qualifiedName = this._qualifiedName(false);
		if (qualifiedName == null)
			return null;
		if (this._expectOpt(".") != null) {
			if (this._expect("<") == null)
				return null; // nested types not yet supported
			return this._templateTypeDeclaration(qualifiedName);
		} else {
			// object
			var objectType = new ParsedObjectType(qualifiedName, []);
			this._objectTypesUsed.push(objectType);
			return objectType;
		}
	},

	_templateTypeDeclaration: function (qualifiedName) {
		if (qualifiedName.getImport() != null) {
			this._newError("template class with namespace not supported");
			return null;
		}
		// parse
		var types = [];
		do {
			var type = this._typeDeclaration(false);
			if (type == null)
				return null;
			types.push(type);
			var token = this._expect([ ">", "," ]);
			if (token == null)
				return null;
		} while (token.getValue() == ",");
		// disallow MayBeUndefined in template types (for the only existing types: MayBeUndefined, Array, Map)
		if (types[0] instanceof MayBeUndefinedType) {
			this._newError("type argument for class '" + qualifiedName.getToken().getValue() + "' cannot be a MayBeUndefined type");
			return null;
		}
		// request template instantiation (deferred)
		this._templateInstantiationRequests.push(new TemplateInstantiationRequest(token, qualifiedName.getToken().getValue(), types));
		// return object type
		var objectType = new ParsedObjectType(qualifiedName, types);
		this._objectTypesUsed.push(objectType);
		return objectType;
	},

	_functionTypeDeclaration: function (objectType) {
		// optional function name
		this._expectIdentifierOpt();
		// parse args
		if(this._expect("(") == null)
			return null;
		var argTypes = [];
		if (this._expectOpt(")") == null) {
			do {
				this._expectIdentifierOpt(); // may have identifiers
				if (this._expect(":") == null)
					return null;
				var argType = this._typeDeclaration(false);
				if (argType == null)
					return null;
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
		this._templateInstantiationRequests.push(new TemplateInstantiationRequest(token, "Array", [ elementType ]));
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
				return false;
			if (! this._statement())
				this._skipLine();
		}
		return token;
	},

	_statement: function () {
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
			"{", "var", ";", "if", "do", "while", "for", "continue", "break", "return", "switch", "throw", "try", "assert", "log", "delete", "debugger"
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
			default:
				throw new "logic flaw, got " + token.getValue();
			}
		}
		// expression statement
		var expr = this._expr(false);
		if (expr == null)
			return false;
		if (this._expect(";") == null)
			return null;
		this._statements.push(new ExpressionStatement(expr));
		return true;
	},

	_constructorInvocationStatement: function () {
		// get className
		var className = this._qualifiedName(true);
		if (className == null)
			return false;
		if (! (className.getImport() == null && className.getToken().getValue() == "super")) {
			// check if the className token designates the base class or one of the mix-ins
			if (this._extendName != null ? this._extendName.equals(className) : className.getImport() == null && className.getToken().getValue() == "Object") {
				// ok, is calling base class
			} else {
				for (var i = 0; i < this._implementNames.length; ++i)
					if (this._implementNames[i].equals(className))
						break;
				if (i == this._implementNames.length) {
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
		this._statements.push(new ConstructorInvocationStatement(className, args));
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
		var label = this._expectIdentifierOpt();
		if (this._expect(";") == null)
			return false;
		this._statements.push(new ContinueStatement(token, label));
		return true;
	},

	_breakStatement: function (token) {
		var label = this._expectIdentifierOpt();
		if (this._expect(";") == null)
			return false;
		this._statements.push(new BreakStatement(token, label));
		return true;
	},

	_returnStatement: function (token) {
		var expr = null;
		if (this._expectOpt(";") == null) {
			if ((expr = this._expr(false)) == null)
				return false;
			if (this._expect(";") == null)
				return false;
		}
		this._statements.push(new ReturnStatement(token, expr));
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
				if ((caseOrDefaultToken = this._expect([ "case", "default" ])) == null)
					return false;
			} else {
				caseOrDefaultToken = this._expectOpt([ "case", "default" ]);
			}
			if (caseOrDefaultToken != null) {
				if (caseOrDefaultToken.getValue() == "case") {
					var labelExpr = this._expr();
					if (labelExpr == null)
						return false;
					if (this._expect(":") == null)
						return false;
					this._statements.push(new CaseStatement(caseOrDefaultToken, labelExpr));
					foundCaseLabel = true;
				} else { // "default"
					if (this._expect(":") == null)
						return false;
					if (foundDefaultLabel) {
						this._newError("cannot have more than one default statement within one switch block");
						return false;
					}
					this._statements.push(new DefaultStatement(caseOrDefaultToken));
					foundDefaultLabel = true;
				}
			} else {
				if (! this._statement())
					this._skipLine();
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
				|| (catchIdentifier = this._expectIdentifier()) == null
				|| this._expect(":") == null
				|| (catchType = this._typeDeclaration(false)) == null
				|| this._expect(")") == null
				|| this._expect("{") == null)
				return false;
			if (this._block() == null)
				return false;
			catchStatements.push(new CatchStatement(catchOrFinallyToken, new CaughtVariable(catchIdentifier, catchType), this._statements.splice(startIndex)));
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
			this._skipLine();
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
			if (! (declExpr instanceof IdentifierExpression))
				expr = expr != null ? new CommaExpression(commaToken, expr, declExpr) : declExpr;
		} while ((commaToken = this._expectOpt(",")) != null);
		isSuccess[0] = true;
		return expr;
	},

	_variableDeclaration: function (noIn) {
		var identifier = this._expectIdentifier();
		if (identifier == null)
			return null;
		var type = null;
		if (this._expectOpt(":"))
			if ((type = this._typeDeclaration(false)) == null)
				return null;
		var initialValue = null;
		var assignToken;
		if ((assignToken = this._expectOpt("=")) != null)
			if ((initialValue = this._assignExpr(noIn)) == null)
				return null;
		this._registerLocal(identifier, type);
		var expr = new IdentifierExpression(identifier);
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
				return null;
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
		// simply remove "void"
		this._expectOpt("void");
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
				var identifier = this._expectIdentifier();
				if (identifier == null)
					return null;
				expr = new PropertyExpression(token, expr, identifier);
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
			if (type.equals(Type.undefinedType) || type.equals(Type.nullType)) {
				this._newError("cannot instantiate an array of " + type.toString());
				return null;
			} else if (type instanceof MayBeUndefinedType) {
				this._newError("cannot instantiate an array of an MayBeUndefined type");
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
		var identifier = this._expectIdentifier();
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

	_functionExpr: function (token) {
		if (this._expect("(") == null)
			return null;
		var args = this._functionArgumentsExpr();
		if (args == null)
			return null;
		if (this._expect(":") == null)
			return null;
		var returnType = this._typeDeclaration(true);
		if (returnType == null)
			return null;
		if (this._expect("{") == null)
			return null;
		// parse function block
		var state = this._pushFunctionState();
		var lastToken = this._block();
		if (lastToken == null) {
			this._restoreFunctionState(state);
			return null;
		}
		var funcDef = new MemberFunctionDefinition(token, null, ClassDefinition.IS_STATIC, returnType, args, this._locals, this._statements, this._closures, lastToken);
		this._restoreFunctionState(state);
		this._closures.push(funcDef);
		return new FunctionExpression(token, funcDef);
	},

	_primaryExpr: function () {
		var token;
		if ((token = this._expectOpt([ "this", "undefined", "null", "false", "true", "[", "{", "(" ])) != null) {
			switch (token.getValue()) {
			case "this":
				return new ThisExpression(token, null);
			case "undefined":
				return new UndefinedExpression(token);
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
		} else if ((token = this._expectIdentifierOpt()) != null) {
			return new IdentifierExpression(token);
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
			if (type.equals(Type.variantType) || type instanceof ObjectType || type instanceof StaticFunctionType) {
				// ok
			} else {
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
				if ((keyToken = this._expectIdentifierOpt()) != null
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

	_functionArgumentsExpr: function () {
		var args = [];
		if (this._expectOpt(")") == null) {
			do {
				var argName = this._expectIdentifier();
				if (argName == null)
					return null;
				if (this._expect(":", "type declarations are mandatory for function arguments") == null)
					return null;
				var argType = this._typeDeclaration(false);
				if (argType == null)
					return null;
				for (var i = 0; i < args.length; ++i) {
					if (args[i].getName().getValue() == argName.getValue()) {
						this._errors.push(new CompileError(argName, "cannot declare an argument with the same name twice"));
						return null;
					}
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

	$_isReservedClassName: function (name) {
		return name.match(/^(Array|Boolean|Date|Function|Map|Number|Object|RegExp|String|Error|EvalError|RangeError|ReferenceError|SyntaxError|TypeError|JSX)$/) != null;
	}

});
