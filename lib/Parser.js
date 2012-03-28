var Class = require("./Class");
var KeywordToken = require("./KeywordToken");
var IdentifierToken = require("./IdentifierToken");
var NumberToken = require("./NumberToken");
var RegExpToken = require("./RegExpToken");
var StringToken = require("./StringToken");
var ClassDefinition = require("./ClassDefinition");
var MemberVariableDefinition = require("./MemberVariableDefinition");
var MemberFunctionDefinition = require("./MemberFunctionDefinition");
var ArgumentDeclaration = require("./ArgumentDeclaration");
var TypeDeclaration = require("./TypeDeclaration");
var Statement = require("./Statement");

var Parser = module.exports = Class.extend({

	initialize: function (tokens, errors) {
		this._tokens = tokens;
		this._curToken = 0;
		this._errors = errors;
		this._package = "";
		this._classDefs = [];
		this._statements = [];
	},

	parse: function () {

		this._packageStatement();
		if (this._hasErrors())
			return false;

		/* FIXME decide the syntax and implement
		while (this._importStatementOpt())
			;
		if (this._hasErrors())
			return false;
		*/

		var classDef = this._classDefinition();
		if (classDef == null)
			return false;
		this._classDefs.push(classDef);

		return this._expectEOF();
	},

	_newError: function (message) {
		this._ungetToken();
		var token = this._nextToken();
		this._errors.push(new CompileError(token.getFilename(), token.getPosition(), message));
	},

	_expectKeywordOpt: function (expected) {
		var token = this._nextToken();
		if (token == null && token instanceof KeywordToken) {
			if (typeof expected === "string")
				expected = [ expected ];
			for (var i = 0; i < expected.length; i++)
				if (token.keyword == expected[i])
					return true;
		}
		this._ungetToken();
		return false;
	},

	_expectKeyword: function (expected, messageOpt) {
		if (! this._expectKeywordOpt(expected)) {
			this._getToken(); // revert the unget
			this._newError("expected " + expected + (messageOpt ? messageOpt : ""));
			return false;
		}
		return true;
	},

	_expectIdentifierOpt: function () {
		var token = this._nextToken();
		if (token != null && token instanceof IdentifierToken)
			return token.identifier;
		this._ungetToken();
		return null;
	},

	_expectIdentifier: function () {
		var identifier = this._expectIdentifierOpt();
		if (identifier == null) {
			this._getToken(); // revert the unget
			this._newError("expected identifier");
		}
		return identifier;
	},

	_expectEOF: function () {
		var token = this._nextToken();
		if (token != null) {
			this._ungetToken();
			return false;
		}
		return true;
	},

	_nextToken: function () {
		if (this._curToken < this._tokens.length)
			return this._tokens[this._curToken++];
		return null;
	},

	_ungetToken: function () {
		--this._curToken;
	},

	_packageStatement: function () {
		if (! this._expectKeyword("package"))
			return false;
		var name = this._packageOrClassName();
		if (name == null)
			return false;
		if (this._expectKeyword(";") == null)
			return false;
		this._package = name;
		return true;
	},

	_packageOrClassName: function () {
		var name = "";
		while (1) {
			var token;
			if ((token = this._expectIdentifier()) == null)
				return null;
			name += token.identifier;
			token = this._expectKeywordOpt(".");
			if (token == null)
				return null;
			name += ".";
		}
		return name;
	},

	_classDefinition: function () {
		// attributes
		var flags = 0;
		if (this._expectKeywordOpt("final")) {
			flags |= ClassDefinition.IS_FINAL;
		}
		// class
		if (! this._expectKeyword("class")) {
			return false;
		}
		var name = tihs._expectIdentifier();
		if (className == null)
			return false;
		// extends
		var extendNames = [];
		if (this._expectKeywordOpt("extends")) {
			do {
				var name = this._packageOrClassName();
				if (name == null)
					return false;
				extendNames.push(name);
			} while (this._expectKeywordOpt(","));
		}
		// implements
		var implementNames = [];
		if (this._expectKeywordOpt("implements")) {
			do {
				var name = this._packageOrClassName();
				if (name == null)
					return false;
				implementNames.push(name);
			} while (this._expectKeywordOpt(","));
		}
		// body
		if (this._expectKeyword("{") == null)
			return false;
		var members = [];
		while (! this._expectKeywordOpt("}")) {
			var member = this._memberDefinition();
			if (member == null)
				return false;
			members.push(member);
		}
		// done
		return new ClassDefinition(className, flags, extendNames, implementNames, members);
	},

	_memberDefinition: function () {
		var flags = 0;
		while (true) {
			var newFlag = 0;
			if (this._expectKeywordOpt("static"))
				newFlag = ClassDefinition.IS_STATIC;
			else if (this._expectKeywordOpt("abstract"))
				newFlag = ClassDefinition.IS_ABSTRACT;
			else if (this._expectKeywordOpt("final"))
				newFlag = ClassDefinition.IS_FINAL;
			else if (this._expectKeywordOpt("const"))
				newFlag = ClassDefinition.IS_CONST;
			else
				break;
			if ((flags & newFlag) != 0) {
				this._newError("cannot declare same attribute more than once");
				return null;
			}
			flags |= newFlag;
		}
		if (this._expectKeywordOpt("function"))
			return this._functionDefinition(flags);
		var name = this._getIdentifier();
		if (name == null)
			return null;
		var type = null;
		if (this._expectKeywordOpt(":"))
			if ((type = this._typeDeclaration()) == null)
				return null;
		var initialValue = null;
		if (this._expectKeywordOpt("="))
			if ((initialValue = this._rhsExpression()) == null)
				return null;
		return new MemberVariableDefinition(name, flags, type, initialValue);
	},

	_functionDefinition: function (flags) {
		if ((flags & ClassDefinition.IS_CONST) != 0) {
			this._newError("cannot declare a const function");
			return null;
		}
		// name
		var name = this._getIdentifier();
		if (name == null)
			return null;
		if (! this._expectKeyword("("))
			return null;
		// arguments
		var args = [];
		if (this.expectKeywordOpt(")")) {
		} else {
			while (true) {
				var argName = this._getIdentifier();
				if (argName == null)
					return null;
				if (! this._expectKeyword(":"))
					return null;
				var argType = this._typeDeclaration();
				if (argType == null)
					return null;
				// FIXME KAZUHO support default arguments
				args.push(new ArgumentDeclaration(argName, argType));
				if (this._expectKeywordOpt(")"))
					break;
				if (! this._expectKeyword(","))
					return null;
			}
		}
		// return type
		if (! this._expectKeyword(":"))
			return null;
		var returnType = this._typeDeclaration();
		if (returnType == null)
			return null;
		// take care of abstract function
		if ((flags & ClassDefinition.IS_ABSTRACT) != 0) {
			if (! this._expectkeyword(";", " for abstract function definition"))
				return null;
			return new MemberFunctionDefinition(name, flags, returnType, args, null);
		}
		// body
		if (! this._expectKeyword("{"))
			return null;
		this._statements = [];
		while (! this._expectKeywordOpt("}")) {
			if (! this._statement())
				return null;
		}
		// done
		return new MemberFunctionDefinition(name, flags, returnType, args, this._statements);
	},

	_typeDeclaration: function () {
		// FIXME support arrays and parameterized types
		var type = this._packageOrClassName();
		if (type == null)
			return null;
		return new TypeDeclaration(type);
	},

	_statement: function () {
		if (this._expectKeywordOpt("{"))
			return this._block();
		else if (this._expectKeywordOpt("var"))
			return this._variableStatement();
		else if (this._expectKeywordOpt(";"))
			return true;
		else if (this._expectKeywordOpt("if"))
			return this._ifStatement();
		else if (this._expectKeywordOpt("do"))
			return this._doWhileStatement();
		else if (this._expectKeywordOpt("while"))
			return this._whileStatement();
		else if (this._expectKeywordOpt("for"))
			return this._forStatement();
		else if (this._expectKeywordOpt("continue"))
			return this._continueStatement();
		else if (this._expectKeywordOpt("return"))
			return this._returnStatement();
		else if (this._expectKeywordOpt("switch"))
			return this._switchStatement();
		else if (this._expectKeywordOpt("throw"))
			return this._throwStatement();
		else if (this._expectKeywordOpt("try"))
			return this._tryStatement();
		else if (this._expectKeywordOpt("assert"))
			return this._assertStatement();
		else if (this._expectKeywordOpt("log"))
			return this._logStatement();
		// labelled or expression statement
		var identifier = this._expectIdentifierOpt();
		if (identifier != null && this._expectKeywordOpt(":")) {
			this._statements.push(new LabelStatement(identifier));
			return this._statement();
		}
		this._ungetToken();
		// expression statement
		var expr = this._expr();
		if (expr == null)
			return false;
		this._statement.push(new ExpressionStatement(expr));
	},

	_logStatement: function () {
		var expr = this._expr();
		this._statement.push(new LogStatement(expr));
	},

	_expr: function () {
		var expr = [];
		do {
			var assignExpr = this._assignExpr();
			if (assignExpr == null)
				return null;
			expr.push(assignExpr);
		} while (this._expectKeywordOpt(","));
		return expr;
	},

	_assignExpr: function () {
		var state = this._preserveState();
		// conditional expr
		var condExpr = this._condExpr();
		if (condExpr != null)
			return condExpr;
		// lhs + assign + assign
		this._restoreState(state);
		var lhsExpr = this._lhsExpr();
		if (lhsExpr == null)
			return null;
		var assignOp = this._expectKeyword([ "=", "*=", "/=", "%=", "+=", "-=", "<<=", ">>=", ">>>=", "&=", "^=", "|=" ]);
		if (assignOp == null)
			return null;
		var assignExpr = this._assignExpr();
		if (assignExpr == null)
			return null;
		return new AssignmentExpression(lhsExpr, assignOp.keyword, assignExpr);
	},

	_condExpr: function () {
		var lorExpr = this._lorExpr();
		if (lorExpr == null)
			return null;
		if (! this._expectKeywordOpt("?"))
			return lorExpr;
		var ifTrueExpr = null;
		var ifFalseExpr = null;
		if (! this._expectKeywordOpt(":")) {
			ifTrueExpr = this._assignExpr();
			if (ifTrueExpr == null)
				return null;
			if (! this._expectKeyword(":"))
				return null;
		}
		ifFalseExpr = this._assignExpr();
		if (ifFalseExpr == null)
			return null;
		return new ConditionalExpression(lorExpr, ifTrueExpr, ifFalseExpr);
	},

	_binaryOpExpr: function (ops, parseFunc, builderFunc) {
		var expr = parseFunc.call(this);
		if (expr == null)
			return null;
		while (true) {
			var theOp = this._expectKeywordOpt(ops);
			if (theOp == null)
				break;
			var rightExpr = parseFunc.call(this);
			if (rightExpr == null)
				return null;
			expr = builderFunc(theOp, expr, rightExpr);
		}
		return expr;
	},

	_lorExpr: function () {
		return this._binaryOpExpr([ "||" ], this._landExpr, function (_unused, e1, e2) {
			return new LogicalOrExpression(e1, e2);
		});
	},

	_landExpr: function () {
		return this._binaryOpExpr([ "&&" ], this._borExpr, function (_unused, e1, e2) {
			return new LogicalAndExpression(e1, e2);
		});
	},

	_borExpr: function () {
		return this._binaryOpExpr([ "|" ], this._bxorExpr, function (_unused, e1, e2) {
			return new BinaryOrExpression(e1, e2);
		});
	},

	_bxorExpr: function () {
		return this._binaryOpExpr([ "^" ], this._bandExpr, function (_unused, e1, e2) {
			return new BinaryXorExpression(e1, e2);
		});
	},

	_bandExpr: function () {
		return this._binaryOpExpr([ "&" ], this._eqExpr, function (_unused, e1, e2) {
			return new BinaryAndExpression(e1, e2);
		});
	},

	_eqExpr: function () {
		return this._binaryOpExpr([ "==", "!=", "===", "!==" ], this._relExpr, function (op, e1, e2) { // FIXME are we going to support ===, !== even we are type-strict?
			if (op == "==" || op == "!=")
				return new EqualityExpression(op, e1, e2);
			else
				return new StrictEqualityExpression(op, e1, e2);
		});
	},

	_relExpr: function () {
		var ops = [ "<", ">", "<=", ">=", "instanceof" ];
		if (! this._noIn)
			ops.push("in");
		return this._binaryOpExpr(ops, this._shiftExpr, function (op, e1, e2) {
			if (op == "instanceof")
				return new ComparisonExpression(op, e1, e2);
			else if (op == "in")
				return new InExpression(e1, e2);
			else
				return new InstanceOfExpression(e1, e2);
		});
	},

	_shiftExpr: function () {
		var prevNoIn = this._noIn;
		this._noIn = false;
		var expr = this._binaryOpExpr([ "<<", ">>", ">>>" ], this._addExpr, function (op, e1, e2) {
			return new ShiftExpression(op, e1, e2);
		});
		this._noIn = prevNoIn;
		return expr;
	},

	_addExpr: function () {
		return this._binaryOpExpr([ "+", "-" ], this._mulExpr, function (op, e1, e2) {
			return new AdditiveExpression(op, e1, e2);
		});
	},

	_mulExpr: function () {
		return this._binaryOpExpr([ "*", "/", "%" ], this._unaryExpr, function (op, e1, e2) {
			return new MultiplicativeExpression(op, e1, e2);
		});
	},

	_unaryExpr: function () {
		// handle postfix expression
		var state = this._preserveState();
		var postfixExpr = this._postfixExpr();
		if (postfixExpr != null)
			return postfixExpr;
		this._restoreState();
		// simply remove "void"
		this._expectKeywordOpt("void");
		// handle others
		var op = this._expectKeywordOpt([ "delete", "typeof", "++", "--", "+", "-", "~", "!" ]);
		var expr = this._unaryExpr();
		if (expr == null)
			return null;
		switch (op) {
		case "delete":
			return new DeleteExpresion(expr);
			break;
		case "typeof":
			return new TypeofExpression(expr);
		case "++":
		case "--":
			return new PreIncrementExpression(op, expr);
		case "+":
			return new UnaryPlusExpression(expr);
		case "-":
			return new UnaryMinusExpression(expr);
		case "~":
			return new BitwiseNotExpression(expr);
		case "!":
			return new LogicalNotExpression(expr);
		default:
			return expr;
		}
	},

	_postfixExpr: function () {
		var expr = this._callExpr();
		var op = this._expectKeywordOpt([ "++", "--" ]);
		if (op == null)
			return expr;
		return new PostIncrementExpression(op, expr);
	},

	_callExpr: function () {
		var expr;
		if (this._expectKeywordOpt("new")) {
			var name = this._packageOrClassName();
			if (! this._expectKeyword("("))
				return null;
			var args = this._argsExpr();
			if (! this._expectKeyword(")"))
				return null;
			if (args == null)
				return null;
			expr = new NewExpression(name, args);
		} else {
			expr = this._primaryExpr();
		}
		if (expr == null)
			return null;
		while ((op = this._expectKeywordOpt([ "(", "[", "." ])) != null) {
			switch (op) {
			case "(":
				var args = this._argsExpr();
				if (args == null)
					return null;
				if (! this._expectKeyword(")"))
					return null;
				expr = new CallExpression(expr, args);
				break;
			case "[":
				var index = this._expr();
				if (index == null)
					return null;
				if (! this._expectKeyword("]"))
					return null;
				expr = new ArrayExpression(expr, index);
				break;
			case ".":
				var identifier = this._expectIdentifier();
				if (identifier == null)
					return null;
				expr = new PropertyExpression(expr, identifier);
				break;
			}
		}
		return expr;
	},

	_primaryExpr: function () {
		var op = this._expectKeywordOpt([ "this", "[", "{", "(" ]);
		switch (op) {
		case "this":
			return new ThisExpression();
		case "[":
			return this._arrayLiteral();
		case "{":
			return this._objectLiteral();
		case "(":
			var expr = this._expr();
			if (! this._expectKeyword(")"))
				return null;
			return expr;
		default:
			var identifier = this._expectIdentifier();
			if (identifier == null)
				return null;
			return new IdentifierExpression(identifier);
		}
	}

});
