var Class = require("./Class");
eval(Class.$import("./type"));
eval(Class.$import("./classdef"));
eval(Class.$import("./statement"));
eval(Class.$import("./expression"));
eval(Class.$import("./util"));

"use strict";

var Token = exports.Token = Class.extend({

	initialize: function (value, filename, pos) {
		this._value = value;
		this.filename = filename;
		this.pos = pos;
	},

	getValue: function () {
		return this._value;
	},

	serialize: function () {
		return [
			this.filename,
			this.pos,
			this._value
		];
	}

});

var _Lexer = exports._TokenTable = Class.extend({

	$makeAlt: function (patterns) {
		return "(?: \n" + patterns.join("\n | \n") + "\n)\n";
	},

	$quoteMeta: function (pattern) {
		return pattern.replace(/([^0-9A-Za-z_])/g, '\\$1');
	},

	$asHash: function (array) {
		var hash = {};
		for (var i = 0; i < array.length; ++i)
			hash[array[i]] = 1;
		return hash;
	},

	/// compile a regular expression
	$rx: function (pat, flags) {
		return RegExp(pat.replace(/[ \t\r\n]/g, ""), flags);
	},

	// static variables
	$initialize: function () {
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
		this.rxSpace          = this.rx("^" + this.makeAlt([comment, whiteSpace]));

		// blacklists of identifiers
		this.keywords = this.asHash([
			// literals shared with ECMA 262
			"null",     "true",     "false",
			"NaN",      "Infinity",
			// keywords shared with ECMA 262
			"break",    "do",       "instanceof", "typeof",
			"case",     "else",     "new",        "var",
			"catch",    "finally",  "return",     "void",
			"continue", "for",      "switch",     "while",
			"function", "this",
			"default",  "if",       "throw",
			"delete",   "in",       "try",
			// keywords of JSX
			"class",	 "extends", "super",
			"import",    "implements",
			"interface", "static",
			"assert",    "log",
			"__FILE__",  "__LINE__",
			"undefined"
		]);
		this.reserved = this.asHash([
			// literals of ECMA 262 but not used by JSX
			"debugger", "with",
			// future reserved words of ECMA 262
			"const", "export",
			// future reserved words within strict mode of ECMA 262
			"let",   "private",   "public", "yield",
			"protected",

			// JSX specific reserved words
			"extern", "native",
			"trait", "using",
			"as", "is",
			"operator", "package"
		]);
	}

});

var Parser = exports.Parser = Class.extend({

	initialize: function (filename, input, errors) {
		// lexer properties
		this._filename = filename;
		this._input = input;
		this._pos = 0;
		this._tokenLength = 0;
		// output
		this._errors = errors;
		this._templateClassDefs = [];
		this._classDefs = [];
		// use for function parsing
		this._locals = [];
		this._statements = [];
		this._closures = [];
		this._extendName = null;
		this._implementNames = [];
		this._objectTypesUsed = [];
		this._templateInstantiationRequests = [];
	},

	parse: function () {

		/* FIXME decide the syntax and implement
		while (this._importStatementOpt())
			;
		if (this._hasErrors())
			return false;
		*/

		while (! this._isEOF()) {
			if (! this._classDefinition())
				return false;
		}

		if (this._errors.length != 0)
			return false;

		return true;
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
			pos: this._pos,
			tokenLength: this._tokenLength,
			// errors
			numErrors: this._errors.length
		};
	},

	_restoreState: function (state) {
		this._pos = state.pos;
		this._tokenLength = state.tokenLength;
		this._errors.length = state.numErrors;
	},

	_newError: function (message) {
		this._errors.push(new CompileError(this._filename, this._pos, message));
	},

	_advanceToken: function () {
		this._pos += this._tokenLength;
		this._tokenLength = 0;
		var matched;
		while ((matched = this._input.substring(this._pos).match(_Lexer.rxSpace)) != null)
			this._pos += matched[0].length;
	},

	_isEOF: function () {
		this._advanceToken();
		return this._input.length == this._pos;
	},

	_expectIsNotEOF: function () {
		if (this._isEOF()) {
			this._newError("unexpected EOF");
			return false;
		}
		return true;
	},

	_expectOpt: function (expected) {
		if (! (expected instanceof Array))
			expected = [ expected ];

		this._advanceToken();
		for (var i = 0; i < expected.length; ++i) {
			if (this._input.substring(this._pos, this._pos + expected[i].length) == expected[i]) {
				if (expected[i].match(_Lexer.rxIdent) != null
					&& this._input.substring(this._pos).match(_Lexer.rxIdent)[0].length != expected[i].length) {
					// part of a longer token
				} else {
					// found
					this._tokenLength = expected[i].length;
					return new Token(expected[i], this._filename, this._pos);
				}
			}
		}
		return null;
	},

	_expect: function (expected) {
		if (! (expected instanceof Array))
			expected = [ expected ];

		var token = this._expectOpt(expected);
		if (token == null) {
			this._newError("expected keyword: " + expected.join(" "));
			return null;
		}
		return token;
	},

	_expectIdentifierOpt: function () {
		this._advanceToken();
		var matched = this._input.substring(this._pos).match(_Lexer.rxIdent);
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
		return new Token(matched[0], this._filename, this._pos);
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
		var matched = this._input.substring(this._pos).match(_Lexer.rxStringLiteral);
		if (matched == null)
			return null;
		this._tokenLength = matched[0].length;
		return new Token(matched[0], this._filename, this._pos);
	},

	_expectNumberLiteralOpt: function () {
		this._advanceToken();
		var matched = this._input.substring(this._pos).match(_Lexer.rxIntegerLiteral);
		if (matched == null)
			matched = this._input.substring(this._pos).match(_Lexer.rxNumberLiteral);
		if (matched == null)
			return null;
		this._tokenLength = matched[0].length;
		return new Token(matched[0], this._filename, this._pos);
	},

	_expectRegExpLiteralOpt: function () {
		this._advanceToken();
		var matched = this._input.substring(this._pos).match(_Lexer.rxRegExpLiteral);
		if (matched == null)
			return null;
		this._tokenLength = matched[0].length;
		return new Token(matched[0], this._filename, this._pos);
	},

	_skipLine: function () {
		var matched = this._input.substring(this._pos).match(/^.*(?:\r\n?|\n|$)/);
		this._pos += matched[0].length;
		this._tokenLength = 0;
	},

	_qualifiedName: function () {
		// returns a token that contains a qualified name
		var firstToken = this._expectIdentifier();
		if (firstToken == null)
			return null;
		var name = firstToken.getValue();
		while (this._expectOpt(".") != null) {
			var token = this._expectIdentifier();
			if (token == null)
				return null;
			name += "." + token.getValue();
		}
		return new Token(name, firstToken.filename, firstToken.pos);
	},

	_classDefinition: function () {
		this._extendName = null;
		this._implementNames = [];
		this._objectTypesUsed = [];
		// attributes* class
		var flags = 0;
		while (true) {
			var token = this._expect([ "class", "interface", "mixin", "abstract", "final", "native" ]);
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
				if ((this._extendName = this._qualifiedName()) == null)
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
				var name = this._qualifiedName();
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
						&& (member instanceof MemberVariableDefinition || members[i] instanceof MemberVariableDefinition)) {
						this._errors.push(new CompileError(member.getToken(), "a property with the same name already exists; only functions may be overloaded"));
						success = false;
					}
				}
				members.push(member);
			} else {
				this._skipLine();
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
			var token = this._expect([ "function", "var", "static", "abstract", "override", "final", "const" ]);
			if (token == null)
				return null;
			if (token.getValue() == "function" || token.getValue() == "var")
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
			case "const":
				newFlag = ClassDefinition.IS_CONST;
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
			flags |= classFlags & ClassDefinition.IS_NATIVE;
			return this._functionDefinition(token, flags, classFlags);
		}
		// member variable decl.
		if ((flags & ~(ClassDefinition.IS_STATIC | ClassDefinition.IS_ABSTRACT | ClassDefinition.IS_CONST)) != 0) {
			this._newError("class variables may only have attributes: static, abstract, const " + flags);
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
		return new MemberVariableDefinition(token, name.getValue(), flags, type, initialValue);
	},

	_functionDefinition: function (token, flags, classFlags) {
		if ((flags & ClassDefinition.IS_CONST) != 0) {
			this._newError("cannot declare a const function");
			return null;
		}
		// name
		var name = this._expectIdentifier();
		if (name == null)
			return null;
		if (name.getValue() == "initialize") {
			if ((classFlags & ClassDefinition.IS_INTERFACE) != 0) {
				this._newError("interface cannot have a constructor");
				return null;
			}
			if ((flags & (ClassDefinition.IS_ABSTRACT | ClassDefinition.IS_FINAL)) != 0) {
				this._newError("constructor cannot be declared as 'abstract' or 'final'");
				return null;
			}
		}
		if (this._expect("(") == null)
			return null;
		// arguments
		var args = this._functionArgumentsExpr();
		if (args == null)
			return null;
		// return type
		var returnType;
		if (name.getValue() == "initialize") {
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
		if ((flags & ClassDefinition.IS_NATIVE) != 0 || (classFlags & ClassDefinition.IS_INTERFACE) != 0) {
			if (this._expect(";") == null)
				return null;
			return new MemberFunctionDefinition(token, name.getValue(), flags, returnType, args, null, null, null);
		} else if ((flags & ClassDefinition.IS_ABSTRACT) != 0) {
			var token = this._expect([ ";", "{" ]);
			if (token == null)
				return null;
			if (token.getValue() == ";")
				return new MemberFunctionDefinition(token, name.getValue(), flags, returnType, args, null, null, null);
		} else {
			if (this._expect("{") == null)
				return null;
		}
		// body
		this._locals = [];
		this._statements = [];
		this._closures = [];
		if (name.getValue() == "initialize")
			this._initializeBlock();
		else
			this._block();
		// done
		return new MemberFunctionDefinition(token, name.getValue(), flags, returnType, args, this._locals, this._statements, this._closures);
	},

	_typeDeclaration: function (allowVoid) {
		if (allowVoid) {
			var token = this._expectOpt("void");
			if (token != null)
				return Type.voidType;
		}
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
				return Type.variantType;
			default:
				throw new Error("logic flaw");
			}
		} else {
			typeDecl = this._primaryTypeDeclaration();
		}
		// []
		while (this._expectOpt("[") != null) {
			if ((token = this._expect("]")) == null)
				return false;
			this._templateInstantiationRequests.push(new TemplateInstantiationRequest(token, "Array", [ typeDecl ]));
			typeDecl = new ParsedObjectType("Array", [ typeDecl ], token);
			this._objectTypesUsed.push(typeDecl);
		}
		return typeDecl;
	},
	
	_primaryTypeDeclaration: function () {
		var keywordToken;
		if ((keywordToken = this._expectOpt("static")) != null) {
			if (this._expect("function") == null)
				return null;
			return this._functionTypeDeclaration(null);
		}
		var identifierToken = this._expectIdentifier();
		if (identifierToken == null)
			return null;
		switch (identifierToken.getValue()) {
		case "boolean":
			return Type.booleanType;
		case "int":
			return Type.integerType;
		case "number":
			return Type.numberType;
		case "string":
			return Type.stringType;
		default:
			// is a object (may be a template object), or a member function
			var className = identifierToken.getValue();
			var objectType;
			if (this._expectOpt(".") != null) {
				if ((keywordToken = this._expect([ "function", "<" ])) == null)
					return null; // nested types not yet supported
				switch (keywordToken.getValue()) {
				case "function":
					// member function
					objectType = new ParsedObjectType(className, [], identifierToken);
					this._objectTypesUsed.push(objectType);
					return this._functionTypeDeclaration(objectType);
				case "<":
					// template object
					return this._templateTypeDeclaration(className, identifierToken);
				default:
					throw new Error("logic flaw");
				}
			} else {
				// object
				var objectType = new ParsedObjectType(className, [], identifierToken);
				this._objectTypesUsed.push(objectType);
				return objectType;
			}
		}
	},

	_templateTypeDeclaration: function (className, identifierToken) {
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
		// request template instantiation (deferred)
		this._templateInstantiationRequests.push(new TemplateInstantiationRequest(token, className, types));
		// return object type
		var objectType = new ParsedObjectType(className, types, identifierToken);
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

	_initializeBlock: function () {
		while (this._expectOpt("}") == null) {
			var state = this._preserveState();
			if (! this._constructorInvocationStatement()) {
				this._restoreState(state);
				return this._block();
			}
		}
	},

	_block: function () {
		while (this._expectOpt("}") == null) {
			if (! this._expectIsNotEOF())
				return false;
			if (! this._statement())
				this._skipLine();
		}
		return true;
	},

	_statement: function () {
		var token = this._expectOpt([
			"{", "var", ";", "if", "do", "while", "for", "continue", "break", "return", "switch", "throw", "try", "assert", "log", "delete"
		]);
		if (token != null) {
			switch (token.getValue()) {
			case "{":
				return this._block();
			case "var":
				return this._variableStatement();
			case ";":
				return true;
			case "if":
				return this._ifStatement();
			case "do":
				return this._doWhileStatement();
			case "while":
				return this._whileStatement();
			case "for":
				return this._forStatement();
			case "continue":
				return this._continueStatement(token);
			case "break":
				return this._breakStatement(token);
			case "return":
				return this._returnStatement(token);
			case "switch":
				return this._switchStatement(token);
			case "throw":
				return this._throwStatement();
			case "try":
				return this._tryStatement();
			case "assert":
				return this._assertStatement(token);
			case "log":
				return this._logStatement(token);
			case "delete":
				return this._deleteStatement(token);
			default:
				throw new "logic flaw, got " + token.getValue();
			}
		}
		// labelled or expression statement
		var state = this._preserveState();
		var identifier = this._expectIdentifierOpt();
		if (identifier != null && this._expectOpt(":") != null) {
			// label is treated as a separate statement (FIXME should label be an attribute of a statement?)
			this._statements.push(new LabelStatement(identifier));
			return true;
		}
		this._restoreState(state);
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
		var className = this._expectOpt("super");
		if (className == null) {
			var className = this._qualifiedName();
			if (className == null)
				return false;
			// check if the className token designates the base class or one of the mix-ins
			if ((this._extendName != null ? this._extendName.getValue() : "Object") == className.getValue()) {
				// ok, is calling base class
			} else {
				for (var i = 0; i < this._implementNames.length; ++i)
					if (this._implementNames[i].getValue() == className.getValue())
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
		var exprs = this._variableDeclarations(false);
		if (exprs == null)
			return false;
		if (this._expect(";") == null)
			return false;
		var mergedExpr = this._mergeExprs(exprs);
		if (mergedExpr == null)
			return true;
		this._statements.push(new ExpressionStatement(mergedExpr));
		return true;
	},

	_ifStatement: function () {
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
		this._statements.push(new IfStatement(expr, onTrueStatements, onFalseStatements));
		return true;
	},

	_doWhileStatement: function () {
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
		this._statements.push(new DoWhileStatement(expr, statements));
		return true;
	},

	_whileStatement: function () {
		if (this._expect("(") == null)
			return false;
		var expr = this._expr(false);
		if (expr == null)
			return false;
		if (this._expect(")") == null)
			return false;
		var statements = this._subStatements();
		this._statements.push(new WhileStatement(expr, statements));
		return true;
	},

	_forStatement: function () {
		var state = this._preserveState();
		// first try to parse as for .. in, and fallback to the other
		switch (this._forInStatement()) {
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
			var exprs = this._variableDeclarations(true);
			if (exprs == null)
				return false;
			if (this._expect(";") == null)
				return false;
			if (exprs.length != 0)
				initExpr = this._mergeExprs(exprs);
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
		this._statements.push(new ForStatement(initExpr, condExpr, postExpr, statements));
		return true;
	},

	_forInStatement: function () {
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
		var expr = this._expr(false);
		if (expr == null)
			return 0;
		if (this._expect(")") != null)
			return 0;
		var statements = this._subStatements();
		this._statements.push(new ForInStatement(identifier, expr, statements));
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
		var expr = this._expr(false);
		if (expr == null)
			return false;
		if (this._expect(";") == null)
			return null;
		this._statements.push(new ReturnStatement(token, expr));
		return true;
	},

	_switchStatement: function (token) {
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
					// FIXME check if expression is a constant known at compile time
					if (! (labelExpr instanceof NullExpression
						|| labelExpr instanceof BooleanLiteralExpression
						|| labelExpr instanceof IntegerLiteralExpression
						|| labelExpr instanceof NumberLiteralExpression
						|| labelExpr instanceof StringLiteralExpression)) {
						this._newError("case label is not a constant");
						return false;
					}
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
		this._statements.push(new SwitchStatement(token, expr, this._statements.splice(startStatementIndex)));
		return true;
	},

	_throwStatement: function () {
		var expr = this._expr();
		if (expr == null)
			return false;
		this._statements.push(new ThrowStatement(expr));
		return true;
	},

	_tryStatement: function () {
		if (this._expect("{") == null)
			return false;
		var startIndex = this._statements.length;
		if (! this._block())
			return false;
		var tryStatements = this._statements.splice(startIndex);
		var catchIdentifier = null;
		var catchStatements = null;
		if (this._expectOpt("catch") != null) {
			if (this._expect("(") == null
				|| (catchIdentifier = this._expectIdentifier()) == null
				|| this._expect(")") == null
				|| this._expect("{") == null)
				return false;
			if (! this._block())
				return false;
			catchStatements = this._statements.splice(startIndex);
		}
		var finallyStatements = null;
		if (this._expectOpt("finally") != null) {
			if (this._expect("{") == null)
				return false;
			finallyStatements = this._statements.splice(startIndex);
		}
		this._statements.push(new TryStatement(tryStatements, catchIdentifier, catchStatements, finallyStatements));
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
		var expr = this._commaSeparatedExprs(false);
		if (expr == null) {
			return false;
		}
		if (this._expect(";") == null)
			return null;
		this._statements.push(new LogStatement(token, expr));
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

	_subStatements: function () {
		var statementIndex = this._statements.length;
		if (! this._statement())
			this._skipLine();
		return this._statements.splice(statementIndex);
	},

	_variableDeclarations: function (noIn) {
		var exprs = [];
		do {
			var expr = this._variableDeclaration(noIn);
			if (expr == null)
				return null;
			// do not push variable declarations wo. assignment
			if (! (expr instanceof IdentifierExpression))
				exprs.push(expr);
		} while (this._expectOpt(",") != null);
		return exprs;
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

	_mergeExprs: function (exprs) {
		if (exprs.length == 0)
			return null;
		var expr = exprs.shift();
		while (exprs.length != 0)
			expr = new CommaExpression(expr, exprs.shift());
		return expr;
	},

	_expr: function (noIn) {
		var exprs = this._commaSeparatedExprs(noIn);
		if (exprs == null)
			return exprs;
		var expr = exprs.shift();
		while (exprs.length != 0)
			expr = new CommaExpression(expr, exprs.shift());
		return expr;
	},

	_commaSeparatedExprs: function (noIn) {
		var expr = [];
		do {
			var assignExpr = this._assignExpr(noIn);
			if (assignExpr == null)
				return null;
			expr.push(assignExpr);
		} while (this._expectOpt(",") != null);
		return expr;
	},

	_assignExpr: function (noIn) {
		var state = this._preserveState();
		// FIXME contrary to ECMA 262, we first try lhs op assignExpr, and then condExpr; does this have any problem?
		// lhs
		var lhsExpr = this._lhsExpr();
		if (lhsExpr != null) {
			var op = this._expect([ "=", "*=", "/=", "%=", "+=", "-=", "<<=", ">>=", ">>>=", "&=", "^=", "|=" ]);
			if (op != null) {
				var assignExpr = this._assignExpr(noIn);
				if (assignExpr != null)
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

	_binaryOpExpr: function (ops, parseFunc, noIn, builderFunc) {
		var expr = parseFunc.call(this, noIn);
		if (expr == null)
			return null;
		while (true) {
			var op = this._expectOpt(ops);
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
		return this._binaryOpExpr([ "||" ], this._landExpr, noIn, function (op, e1, e2) {
			return new LogicalExpression(op, e1, e2);
		});
	},

	_landExpr: function (noIn) {
		return this._binaryOpExpr([ "&&" ], this._borExpr, noIn, function (op, e1, e2) {
			return new LogicalExpression(op, e1, e2);
		});
	},

	_borExpr: function (noIn) {
		return this._binaryOpExpr([ "|" ], this._bxorExpr, noIn, function (op, e1, e2) {
			return new BinaryNumberExpression(op, e1, e2);
		});
	},

	_bxorExpr: function (noIn) {
		return this._binaryOpExpr([ "^" ], this._bandExpr, noIn, function (op, e1, e2) {
			return new BinaryNumberExpression(op, e1, e2);
		});
	},

	_bandExpr: function (noIn) {
		return this._binaryOpExpr([ "&" ], this._eqExpr, noIn, function (op, e1, e2) {
			return new BinaryNumberExpression(op, e1, e2);
		});
	},

	_eqExpr: function (noIn) {
		return this._binaryOpExpr([ "==", "!=" ], this._relExpr, noIn, function (op, e1, e2) {
			return new EqualityExpression(op, e1, e2);
		});
	},

	_relExpr: function (noIn) {
		var ops = [ "<=", ">=", "<", ">" ];
		if (! noIn)
			ops.push("in");
		return this._binaryOpExpr(ops, this._shiftExpr, noIn, function (op, e1, e2) {
			if (op.getValue() == "in")
				return new InExpression(op, e1, e2);
			else
				return new BinaryNumberExpression(op, e1, e2);
		});
	},

	_shiftExpr: function () {
		var expr = this._binaryOpExpr([ ">>>", "<<", ">>" ], this._addExpr, false, function (op, e1, e2) {
			return new ShiftExpression(op, e1, e2);
		});
		return expr;
	},

	_addExpr: function () {
		return this._binaryOpExpr([ "+", "-" ], this._mulExpr, false, function (op, e1, e2) {
			if (op.getValue() == "+")
				return new AdditiveExpression(op, e1, e2);
			else
				return new BinaryNumberExpression(op, e1, e2);
		});
	},

	_mulExpr: function () {
		return this._binaryOpExpr([ "*", "/", "%" ], this._unaryExpr, false, function (op, e1, e2) {
			return new BinaryNumberExpression(op, e1, e2);
		});
	},

	_unaryExpr: function () {
		// simply remove "void"
		this._expectOpt("void");
		// read other unary operators
		var op = this._expectOpt([ "++", "--", "+", "-", "~", "!" ]);
		if (op == null)
			return this._postfixExpr();
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
		}
	},

	_postfixExpr: function () {
		var expr = this._lhsExpr();
		var op = this._expectOpt([ "++", "--", "instanceof", "as" ]);
		if (op == null)
			return expr;
		switch (op.getValue()) {
		case "instanceof":
			var type = this._typeDeclaration(false);
			if (type == null)
				return null;
			return new InstanceofExpression(op, expr, type);
		case "as":
			var noCheck = this._expectOpt("__nocheck__");
			var type = this._typeDeclaration(false);
			if (type == null)
				return null;
			return noCheck ? new AsNoCheckExpression(op, expr, type) : new AsExpression(op, expr, type);
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
				return this._functionExpr();
			default:
				break;
			}
			// new pression
			// FIXME support namespaces and inner classes
			var name = this._qualifiedName();
			if (this._expect("(") == null)
				return null;
			var args = this._argsExpr();
			if (args == null)
				return null;
			expr = new NewExpression(token, name, args);
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
		if (! this._block()) {
			this._restoreFunctionState(state);
			return null;
		}
		var funcDef = new MemberFunctionDefinition(token, null, ClassDefinition.IS_STATIC, returnType, args, this._locals, this._statements, this._closures);
		this._restoreFunctionState(state);
		this._closures.push(funcDef);
		return new FunctionExpression(funcDef);
	},

	_primaryExpr: function () {
		var token;
		if ((token = this._expectOpt([ "this", "undefined", "null", "false", "true", "[", "{", "(" ])) != null) {
			switch (token.getValue()) {
			case "this":
				return new ThisExpression(token);
			case "undefined":
				return new UndefinedExpression(token);
			case "null":
				return new NullExpression(token);
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
				elements.push(new HashLiteralElement(keyToken, expr));
				// separator
				if ((token = this._expect([ ",", "}" ])) == null)
					return null;
			} while (token.getValue() == ",");
		}
		var type = null;
		if (this._expectOpt(":") != null)
			if ((type = this._typeDeclaration(false)) == null)
				return null;
		return new HashLiteralExpression(token, elements, type);
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
	}

});
