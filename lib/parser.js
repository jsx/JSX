var Class = require("./Class");
eval(Class.$import("./token"));
eval(Class.$import("./type"));
eval(Class.$import("./classdef"));
eval(Class.$import("./statement"));
eval(Class.$import("./expression"));
eval(Class.$import("./util"));

"use strict";

var Parser = exports.Parser = Class.extend({

	initialize: function (tokens, errors) {
		this._tokens = tokens;
		this._curToken = 0;
		this._errors = errors;
		this._classDefs = [];
		// use for function parsing
		this._locals = [];
		this._statements = [];
		this._objectTypesUsed = [];
	},

	parse: function () {

		/* FIXME decide the syntax and implement
		while (this._importStatementOpt())
			;
		if (this._hasErrors())
			return false;
		*/

		var classDef = this._classDefinition();
		if (classDef == null || this._errors.length != 0)
			return false;
		this._classDefs.push(classDef);

		if (! this._isEOF()) {
			this._newError("expected EOF");
			return false;
		}
		return true;
	},

	getClassDefs: function () {
		return this._classDefs;
	},

	_registerLocal: function (identifierToken, type) {
		for (var i = 0; i < this._locals.length; i++) {
			if (this._locals[i].getName() == identifierToken.getValue()) {
				if (type != null && ! this._locals[i].getType().equals(type))
					this._newError("conflicting types for variable " + identifierToken.getValue());
				return;
			}
		}
		this._locals.push(new LocalVariable(identifierToken, type));
	},

	_preserveState: function () {
		return {
			curToken: this._curToken,
			numErrors: this._errors.length
		};
	},

	_restoreState: function (state) {
		this._curToken = state.curToken;
		this._errors.length = state.numErrors;
	},

	_isEOF: function () {
		return this._curToken >= this._tokens.length;
	},

	_nextToken: function () {
		if (this._curToken < this._tokens.length)
			return this._tokens[this._curToken++];
		return null;
	},

	_ungetToken: function () {
		--this._curToken;
	},

	_newError: function (message) {
		this._ungetToken();
		var token = this._nextToken();
		this._errors.push(new CompileError(token, message));
	},

	_expectKeywordOpt: function (expected) {
		var token = this._nextToken();
		if (token == null)
			return null;
		if (token instanceof KeywordToken) {
			if (typeof expected == "string")
				expected = [ expected ];
			for (var i = 0; i < expected.length; i++) {
				if (token.getValue() == expected[i])
					return token;
			}
		} 
		this._ungetToken();
		return null;
	},

	_expectKeyword: function (expected, messageOpt) {
		var token = this._expectKeywordOpt(expected);
		if (token != null)
			return token;
		token = this._nextToken(); // revert the unget
		this._newError("expected '" + expected + "' but got '" + token.toString() + "'" + (messageOpt ? " (" + messageOpt + ")" : ""));
		return null;
	},

	_expectIdentifierOpt: function () {
		var token = this._nextToken();
		if (token != null && token instanceof IdentifierToken)
			return token;
		this._ungetToken();
		return null;
	},

	_expectIdentifier: function () {
		var token = this._expectIdentifierOpt();
		if (token != null)
			return token;
		token = this._nextToken(); // revert the unget
		this._newError("expected identifier but got " + token.toString());
		return null;
	},

	_expectIsNotEOF: function () {
		if (this._isEOF()) {
			this._newError("unexpected EOF");
			return false;
		}
		return true;
	},

	_skipStatement: function () {
		var token;
		while ((token = this._nextToken()) != null) {
			if (token instanceof KeywordToken && token.getValue() == ";")
					break;
		}
	},

	_qualifiedName: function () {
		var name = [];
		while (1) {
			var identifierToken;
			if ((identifierToken = this._expectIdentifier()) == null)
				return null;
			name.push(identifierToken);
			if (this._expectKeywordOpt(".") == null)
				break;
		}
		return name;
	},

	_classDefinition: function () {
		this._objectTypesUsed = [];
		// attributes
		var flags = 0;
		if (this._expectKeywordOpt("final") != null) {
			flags |= ClassDefinition.IS_FINAL;
		}
		// class
		if (this._expectKeyword("class") == null) {
			return null;
		}
		var className = this._expectIdentifier();
		if (className == null)
			return null;
		// extends
		var extendName = null;
		if (this._expectKeywordOpt("extends") != null)
			if ((extendName = this._qualifiedName()) == null)
				return null;
		// implements
		var implementNames = [];
		if (this._expectKeywordOpt("implements") != null) {
			do {
				var name = this._qualifiedName();
				if (name == null)
					return null;
				implementNames.push(name);
			} while (this._expectKeywordOpt(",") != null);
		}
		// body
		if (this._expectKeyword("{") == null)
			return null;
		var members = [];
		while (this._expectKeywordOpt("}") == null) {
			var member = this._memberDefinition();
			if (member != null) {
				members.push(member);
			} else {
				this._skipStatement();
			}
		}
		// done
		return new ClassDefinition(className, flags, extendName, implementNames, members, this._objectTypesUsed);
	},

	_memberDefinition: function () {
		var flags = 0;
		while (true) {
			var newFlag = 0;
			if (this._expectKeywordOpt("static") != null)
				newFlag = ClassDefinition.IS_STATIC;
			else if (this._expectKeywordOpt("abstract") != null)
				newFlag = ClassDefinition.IS_ABSTRACT;
			else if (this._expectKeywordOpt("final") != null)
				newFlag = ClassDefinition.IS_FINAL;
			else if (this._expectKeywordOpt("const") != null)
				newFlag = ClassDefinition.IS_CONST;
			else
				break;
			if ((flags & newFlag) != 0) {
				this._newError("cannot declare same attribute more than once");
				return null;
			}
			flags |= newFlag;
		}
		var functionOrVar = this._expectKeyword([ "function", "var" ]);
		if (functionOrVar == null)
			return null;
		if (functionOrVar.getValue() == "function")
			return this._functionDefinition(flags);
		var name = this._expectIdentifier();
		if (name == null)
			return null;
		var type = null;
		if (this._expectKeywordOpt(":") != null)
			if ((type = this._typeDeclaration(false)) == null)
				return null;
		var initialValue = null;
		if (this._expectKeywordOpt("=") != null)
			if ((initialValue = this._assignExpr(false)) == null)
				return null;
		if (type == null && initialValue == null) {
			this._newError("variable declaration should either have type declaration or initial value");
			return null;
		}
		if (! this._expectKeyword(";"))
			return null;
		return new MemberVariableDefinition(name, flags, type, initialValue);
	},

	_functionDefinition: function (flags) {
		if ((flags & ClassDefinition.IS_CONST) != 0) {
			this._newError("cannot declare a const function");
			return null;
		}
		// name
		var name = this._expectIdentifier();
		if (name == null)
			return null;
		if (name == "initialize") {
			if ((flags & (ClassDefinition.IS_ABSTRACT | ClassDefinition.IS_FINAL)) != 0) {
				this._newError("constructor (the 'initialize' member function) cannot be declared as 'abstract' or 'final'");
				return null;
			}
		}
		if (this._expectKeyword("(") == null)
			return null;
		// arguments
		var args = [];
		if (this._expectKeywordOpt(")") != null) {
		} else {
			while (true) {
				var argName = this._expectIdentifier();
				if (argName == null)
					return null;
				if (this._expectKeyword(":", "type declarations are mandatory for function arguments") == null)
					return null;
				var argType = this._typeDeclaration(false);
				if (argType == null)
					return null;
				// FIXME KAZUHO support default arguments
				args.push(new ArgumentDeclaration(argName, argType));
				if (this._expectKeywordOpt(")") != null)
					break;
				if (this._expectKeyword(",") == null)
					return null;
			}
		}
		// return type
		var returnType;
		if (name == "initialize") {
			// no return type
			returnType = Type.voidType;
		} else {
			if (this._expectKeyword(":", "return type declaration is mandatory") == null)
				return null;
			returnType = this._typeDeclaration(true);
			if (returnType == null)
				return null;
		}
		// take care of abstract function
		if ((flags & ClassDefinition.IS_ABSTRACT) != 0) {
			if (this._expectKeyword(";", "function body should not exist for an abstract function") == null)
				return null;
			return new MemberFunctionDefinition(name, flags, returnType, args, null);
		}
		// body
		if (this._expectKeyword("{") == null)
			return null;
		this._locals = [];
		this._statements = [];
		this._block();
		// done
		return new MemberFunctionDefinition(name, flags, returnType, args, this._locals, this._statements);
	},

	_typeDeclaration: function (allowVoid) {
		// FIXME support arrays and parameterized types
		if (allowVoid) {
			var keywordToken = this._expectKeywordOpt("void");
			if (keywordToken != null)
				return Type.voidType;
		}
		var typeDecl = this._primaryTypeDeclaration();
		// []
		while (this._expectKeywordOpt("[") != null) {
			if (this._expectKeyword("]") == null)
				return false;
			typeDecl = new ArrayType(typeDecl);
		}
		return typeDecl;
	},
	
	_primaryTypeDeclaration: function (allowVoid) {
		var keywordToken;
		if ((keywordToken = this._expectKeywordOpt("function")) != null)
			return _functionTypeDeclaration(null);
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
		case "String":
			return Type.stringType;
		default:
			// is object (or member function)
			var className = identifierToken.getValue();
			while (this._expectKeywordOpt(".") != null) {
				if ((keywordToken = this._expectKeywordOpt("function")) != null)
					break;
				var t = this._expectIdentifier();
				if (t == null)
					return null;
				className += "." + t.getValue();
			}
			var objectType = new ObjectType(className, identifierToken);
			this._objectTypesUsed.push(objectType);
			if (keywordToken != null)
				return this._functionTypeDeclaration(objectType); // function type
			return objectType;
		}
	},

	_functionTypeDeclaration: function (objectType) {
		// parse args
		if(this._expectKeyword("(") == null)
			return null;
		var argTypes = [];
		if (this._expectKeywordOpt(")") == null) {
			// no args
		} else {
			while (true) {
				this._expectIdentifierOpt(); // may have identifiers
				if (this._expectKeyword(":") == null)
					return null;
				var argType = this._typeDeclaration(false);
				if (argType == null)
					return null;
				argTypes.push(argType);
				var keywordToken = this_expectKeyword([ ")", "," ]);
				if (keywordToken == null)
					return null;
				if (keywordToken.getValue() == ")")
					break;
			}
		}
		// parse return type
		if (this._expectKeyword(":") == null)
			return false;
		var returnType = this._typeDeclaration(true);
		if (returnType == null)
			return null;
		if (className != null)
			return new MemberFunctionType(objectType, returnType, argTypes, true);
		else
			return new StaticFunctionType(returnType, argTypes, true);
	},

	_block: function () {
		while (this._expectKeywordOpt("}") == null) {
			if (! this._expectIsNotEOF())
				break;
			if (! this._statement())
				this._skipStatement();
		}
		return true;
	},

	_statement: function () {
		var token;
		if (this._expectKeywordOpt("{") != null)
			return this._block();
		else if (this._expectKeywordOpt("var") != null)
			return this._variableStatement();
		else if (this._expectKeywordOpt(";") != null)
			return true;
		else if (this._expectKeywordOpt("if") != null)
			return this._ifStatement();
		else if (this._expectKeywordOpt("do") != null)
			return this._doWhileStatement();
		else if (this._expectKeywordOpt("while") != null)
			return this._whileStatement();
		else if (this._expectKeywordOpt("for") != null)
			return this._forStatement();
		else if ((token = this._expectKeywordOpt("continue")) != null)
			return this._continueStatement(token);
		else if ((token = this._expectKeywordOpt("break")) != null)
			return this._breakStatement(token);
		else if ((token = this._expectKeywordOpt("return")) != null)
			return this._returnStatement(token);
		else if ((token = this._expectKeywordOpt("switch")) != null)
			return this._switchStatement(token);
		else if (this._expectKeywordOpt("throw") != null)
			return this._throwStatement();
		else if (this._expectKeywordOpt("try") != null)
			return this._tryStatement();
		else if ((token = this._expectKeywordOpt("assert")) != null)
			return this._assertStatement(token);
		else if ((token = this._expectKeywordOpt("log")) != null)
			return this._logStatement(token);
		// labelled or expression statement
		var identifier = this._expectIdentifierOpt();
		if (identifier != null) {
			var nextToken = this._expectKeywordOpt(":");
			if (nextToken != null) {
				if (nextToken.getValue() == ":") {
					// label is treated as a separate statement (FIXME should label be an attribute of a statement?)
					this._statements.push(new LabelStatement(identifier));
					return true;
				}
				this._ungetToken();
			}
			this._ungetToken();
		}
		// expression statement
		var expr = this._expr(false);
		if (expr == null)
			return false;
		if (this._expectKeyword(";") == null)
			return null;
		this._statements.push(new ExpressionStatement(expr));
		return true;
	},

	_variableStatement: function () {
		var exprs = this._variableDeclarations(false);
		if (exprs == null)
			return false;
		if (this._expectKeyword(";") == null)
			return false;
		var mergedExpr = this._mergeExprs(exprs);
		if (mergedExpr == null)
			return true;
		this._statements.push(new ExpressionStatement(mergedExpr));
		return true;
	},

	_ifStatement: function () {
		if (this._expectKeyword("(") == null)
			return false;
		var expr = this._expr(false);
		if (expr == null)
			return false;
		if (this._expectKeyword(")") == null)
			return false;
		var onTrueStatements = this._subStatements();
		var onFalseStatements = [];
		if (this._expectKeywordOpt("else") != null) {
			onFalseStatements = this._subStatements();
		}
		this._statements.push(new IfStatement(expr, onTrueStatements, onFalseStatements));
		return true;
	},

	_doWhileStatement: function () {
		var statements = this._subStatements();
		if (this._expectKeyword("while") == null)
			return false;
		if (this._expectKeyword("(") == null)
			return false;
		var expr = this._expr(false);
		if (expr == null)
			return false;
		if (this._expectKeyword(")") == null)
			return false;
		this._statements.push(new DoWhileStatement(expr, statements));
		return true;
	},

	_whileStatement: function () {
		if (this._expectKeyword("(") == null)
			return false;
		var expr = this._expr(false);
		if (expr == null)
			return false;
		if (this._expectKeyword(")") == null)
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
		if (! this._expectKeyword("(") == null)
			return false;
		// parse initialization expression
		var initExpr = null;
		if (this._expectKeywordOpt(";") != null) {
			// empty expression
		} else if (this._expectKeywordOpt("var") != null) {
			var exprs = this._variableDeclarations(true);
			if (exprs == null)
				return false;
			if (this._expectKeyword(";") == null)
				return false;
			if (exprs.length != 0)
				initExpr = this._mergeExprs(exprs);
		} else {
			if ((initExpr = this._expr(true)) == null)
				return false;
			if (this._expectKeyword(";") == null)
				return false;
		}
		// parse conditional expression
		var condExpr = null;
		if (this._expectKeywordOpt(";") != null) {
			// empty expression
		} else {
			if ((condExpr = this._expr(false)) == null)
				return false;
			if (this._expectKeyword(";") == null)
				return false;
		}
		// parse post expression
		var postExpr = null;
		if (this._expectKeywordOpt(")") != null) {
			// empty expression
		} else {
			if ((postExpr = this._expr(false)) == null)
				return false;
			if (this._expectKeyword(")") == null)
				return false;
		}
		// statements
		var statements = this._subStatements();
		this._statements.push(new ForStatement(initExpr, condExpr, postExpr, statements));
		return true;
	},

	_forInStatement: function () {
		if (! this._expectKeyword("(") == null)
			return 0; // failure
		var lhsExpr;
		if (this._expectKeywordOpt("var") != null) {
			if ((lhsExpr = this._variableDeclaration(true)) == null)
				return -1; // retry the other
		} else {
			if ((lhsExpr = this._lhsExpr()) == null)
				return -1; // retry the other
		}
		if (this._expectKeyword("in") == null)
			return -1; // retry the other
		var expr = this._expr(false);
		if (expr == null)
			return 0;
		if (this._expectKeyword(")") != null)
			return 0;
		var statements = this._subStatements();
		this._statements.push(new ForInStatement(identifier, expr, statements));
		return 1;
	},

	_continueStatement: function (token) {
		var label = this._expectIdentifierOpt();
		if (this._expectKeyword(";") == null)
			return false;
		this._statements.push(new ContinueStatement(token, label));
		return true;
	},

	_breakStatement: function (token) {
		var label = this._expectIdentifierOpt();
		if (this._expectKeyword(";") == null)
			return false;
		this._statements.push(new BreakStatement(token, label));
		return true;
	},

	_returnStatement: function (token) {
		var expr = this._expr(false);
		if (expr == null)
			return false;
		if (this._expectKeyword(";") == null)
			return null;
		this._statements.push(new ReturnStatement(token, expr));
		return true;
	},

	_switchStatement: function (token) {
		if (this._expectKeyword("(") == null)
			return false;
		var expr = this._expr(false);
		if (expr == null)
			return false;
		if (this._expectKeyword(")") == null
			|| this._expectKeyword("{") == null)
			return null;
		var foundCaseLabel = false;
		var foundDefaultLabel = false;
		// caseblock
		var startStatementIndex = this._statements.length;
		while (this._expectKeywordOpt("}") == null) {
			if (! this._expectIsNotEOF())
				return false;
			var caseOrDefaultToken;
			if (! foundCaseLabel && ! foundDefaultLabel) {
				// first statement within the block should start with a label
				if ((caseOrDefaultToken = this._expectKeyword([ "case", "default" ])) == null)
					return false;
			} else {
				caseOrDefaultToken = this._expectKeywordOpt([ "case", "default" ]);
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
						|| labelExpr instanceof NumberLiteralExpression)) {
						this._newError("case label is not a constant");
						return false;
					}
					if (this._expectKeyword(":") == null)
						return false;
					this._statements.push(new CaseStatement(caseOrDefaultToken, labelExpr));
					foundCaseLabel = true;
				} else { // "default"
					if (this._expectKeyword(":") == null)
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
					this._skipStatement();
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
		if (this._expectKeyword("{") == null)
			return false;
		var startIndex = this._statements.length;
		if (! this._block())
			return false;
		var tryStatements = this._statements.splice(startIndex);
		var catchIdentifier = null;
		var catchStatements = null;
		if (this._expectKeywordOpt("catch") != null) {
			if (this._expectKeyword("(") == null
				|| (catchIdentifier = this._expectIdentifier()) == null
				|| this._expectKeyword(")") == null
				|| this._expectKeyword("{") == null)
				return false;
			if (! this._block())
				return false;
			catchStatements = this._statements.splice(startIndex);
		}
		var finallyStatements = null;
		if (this._expectKeywordOpt("finally") != null) {
			if (this._expectKeyword("{") == null)
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
		if (this._expectKeyword(";") == null)
			return false;
		this._statements.push(new AssertStatement(token, expr));
	},

	_logStatement: function (token) {
		var expr = this._commaSeparatedExprs(false);
		if (expr == null) {
			return false;
		}
		if (this._expectKeyword(";") == null)
			return null;
		this._statements.push(new LogStatement(token, expr));
		return true;
	},

	_subStatements: function () {
		var statementIndex = this._statements.length;
		if (! this._statement())
			this._skipStatement();
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
		} while (this._expectKeywordOpt(",") != null);
		return exprs;
	},

	_variableDeclaration: function (noIn) {
		var identifier = this._expectIdentifier();
		if (identifier == null)
			return null;
		var type = null;
		if (this._expectKeywordOpt(":"))
			if ((type = _typeDeclaration(false)) == null)
				return null;
		var initialValue = null;
		var assignToken;
		if ((assignToken = this._expectKeywordOpt("=")) != null)
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
		} while (this._expectKeywordOpt(",") != null);
		return expr;
	},

	_assignExpr: function (noIn) {
		var state = this._preserveState();
		// FIXME contrary to ECMA 262, we first try lhs op assignExpr, and then condExpr; does this have any problem?
		// lhs
		var lhsExpr = this._lhsExpr();
		if (lhsExpr != null) {
			var op = this._expectKeyword([ "=", "*=", "/=", "%=", "+=", "-=", "<<=", ">>=", ">>>=", "&=", "^=", "|=" ]);
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
		if ((operatorToken = this._expectKeywordOpt("?")) == null)
			return lorExpr;
		var ifTrueExpr = null;
		var ifFalseExpr = null;
		if (this._expectKeywordOpt(":") == null) {
			ifTrueExpr = this._assignExpr(noIn);
			if (ifTrueExpr == null)
				return null;
			if (this._expectKeyword(":") == null)
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
			var op = this._expectKeywordOpt(ops);
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
		var ops = [ "<", ">", "<=", ">=" ];
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
		var expr = this._binaryOpExpr([ "<<", ">>", ">>>" ], this._addExpr, false, function (op, e1, e2) {
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
		this._expectKeywordOpt("void");
		// read other unary operators
		var op = this._expectKeywordOpt([ "delete", "typeof", "++", "--", "+", "-", "~", "!" ]);
		if (op == null)
			return this._postfixExpr();
		var expr = this._unaryExpr();
		if (expr == null)
			return null;
		switch (op.getValue()) {
		case "delete":
			return new DeleteExpression(expr);
			break;
		case "typeof":
			return new TypeofExpression(expr);
		case "++":
		case "--":
			return new PreIncrementExpression(op, expr);
		case "+":
		case "-":
			return new SignExpression(op, expr);
		case "~":
			return new BitwiseNotExpression(expr);
		case "!":
			return new LogicalNotExpression(expr);
		}
	},

	_postfixExpr: function () {
		var expr = this._lhsExpr();
		var op = this._expectKeywordOpt([ "++", "--", "instanceof" ]);
		if (op == null)
			return expr;
		if (op.getValue() == "instanceof") {
			var type = this._typeDeclaration(false);
			if (type == null)
				return null;
			return new InstanceofExpression(op, expr, type);
		}
		return new PostIncrementExpression(op, expr);
	},

	_lhsExpr: function () {
		var expr;
		var newToken;
		if ((newToken = this._expectKeywordOpt("new")) != null) {
			// FIXME support namespaces and inner classes
			var name = this._qualifiedName();
			if (this._expectKeyword("(") == null)
				return null;
			var args = this._argsExpr();
			if (this._expectKeyword(")") == null)
				return null;
			if (args == null)
				return null;
			expr = new NewExpression(newToken, name, args);
		} else {
			expr = this._primaryExpr();
		}
		if (expr == null)
			return null;
		var op;
		while ((op = this._expectKeywordOpt([ "(", "[", "." ])) != null) {
			switch (op.getValue()) {
			case "(":
				if ((args = this._argsExpr()) == null)
					return null;
				if (this._expectKeyword(")") == null)
					return null;
				expr = new CallExpression(op, expr, args);
				break;
			case "[":
				var index = this._expr(false);
				if (index == null)
					return null;
				if (this._expectKeyword("]") == null)
					return null;
				expr = new ArrayExpression(op, expr, index);
				break;
			case ".":
				var identifier = this._expectIdentifier();
				if (identifier == null)
					return null;
				expr = new PropertyExpression(op, expr, identifier);
				break;
			}
		}
		return expr;
	},

	_primaryExpr: function () {
		var opToken = this._expectKeywordOpt([ "this", "null", "false", "true", "[", "{", "(" ]);
		if (opToken != null) {
			switch (opToken.getValue()) {
			case "this":
				return new ThisExpression(opToken);
			case "null":
				return new NullExpression(opToken);
			case "false":
				return new BooleanLiteralExpression(opToken);
			case "true":
				return new BooleanLiteralExpression(opToken);
			case "[":
				return this._arrayLiteral();
			case "{":
				return this._objectLiteral();
			case "(":
				var expr = this._expr(false);
				if (this._expectKeyword(")") == null)
					return null;
				return expr;
			}
		} else {
			var token = this._nextToken();
			if (token instanceof StringToken)
				return new StringLiteralExpression(token);
			else if (token instanceof IntegerToken)
				return new IntegerLiteralExpression(token);
			else if (token instanceof NumberToken)
				return new NumberLiteralExpression(token);
			else if (token instanceof IdentifierToken)
				return new IdentifierExpression(token);
			else {
				this._newError("expected primary expression, but got " + token.toString());
				return null;
			}
		}
	},

	_argsExpr: function () {
		var args = [];
		if (this._expectKeywordOpt(")") != null) {
			this._ungetToken();
		} else {
			do {
				var arg = this._assignExpr(false);
				if (arg == null)
					return null;
				args.push(arg);
			} while (this._expectKeywordOpt(",") != null);
		}
		return args;
	}

});
