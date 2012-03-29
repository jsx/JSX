var Class = require("./Class");
var CompileError = require("./CompileError");
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
var ExpressionStatement = require("./ExpressionStatement");
var LabelStatement = require("./LabelStatement");
var LogStatement = require("./LogStatement");
var ReturnStatement = require("./ReturnStatement");
var AdditiveExpression = require("./AdditiveExpression");
var ArrayExpression = require("./ArrayExpression");
var AssignmentExpression = require("./AssignmentExpression");
var BinaryNumberExpression = require("./BinaryNumberExpression");
var BitwiseExpression = require("./BitwiseExpression");
var BitwiseNotExpression = require("./BitwiseNotExpression");
var CallExpression = require("./CallExpression");
var CommaExpression = require("./CommaExpression");
var ComparisonExpression = require("./ComparisonExpression");
var ConditionalExpression = require("./ConditionalExpression");
var DeleteExpression = require("./DeleteExpression");
var EqualityExpression = require("./EqualityExpression");
var Expression = require("./Expression");
var IdentifierExpression = require("./IdentifierExpression");
var InExpression = require("./InExpression");
var InstanceofExpression = require("./InstanceofExpression");
var LogicalExpression = require("./LogicalExpression");
var LogicalNotExpression = require("./LogicalNotExpression");
var NewExpression = require("./NewExpression");
var NumberLiteralExpression = require("./NumberLiteralExpression");
var PostIncrementExpression = require("./PostIncrementExpression");
var PreIncrementExpression = require("./PreIncrementExpression");
var PropertyExpression = require("./PropertyExpression");
var ShiftExpression = require("./ShiftExpression");
var StrictEqualityExpression = require("./StrictEqualityExpression");
var StringLiteralExpression = require("./StringLiteralExpression");
var ThisExpression = require("./ThisExpression");
var TypeofExpression = require("./TypeofExpression");
var UnaryNumberExpression = require("./UnaryNumberExpression");

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

		if (! this._packageStatement())
			return false;

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

		return this._expectEOF();
	},

	getClassDefs: function () {
		return this._classDefs;
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
		this._errors.push(new CompileError(token.filename, token.pos, message));
	},

	_expectKeywordOpt: function (expected) {
		var token = this._nextToken();
		if (token == null)
			return null;
		if (token instanceof KeywordToken) {
			if (typeof expected == "string")
				expected = [ expected ];
			for (var i = 0; i < expected.length; i++) {
				if (token.keyword == expected[i])
					return token.keyword;
			}
		} 
		this._ungetToken();
		return null;
	},

	_expectKeyword: function (expected, messageOpt) {
		var keyword = this._expectKeywordOpt(expected);
		if (keyword != null)
			return keyword;
		var token = this._nextToken(); // revert the unget
		this._newError("expected " + expected + " but got " + token.toString() + (messageOpt ? messageOpt : ""));
		return null;
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
			var token = this._nextToken(); // revert the unget
			this._newError("expected identifier but got " + token.toString());
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

	_packageStatement: function () {
		if (this._expectKeyword("package") == null)
			return false;
		var name = this._qualifiedName();
		if (name == null)
			return false;
		if (this._expectKeyword(";") == null)
			return false;
		this._package = name;
		return true;
	},

	_qualifiedName: function () {
		var name = "";
		while (1) {
			var identifier;
			if ((identifier = this._expectIdentifier()) == null)
				return null;
			name += identifier;
			if (this._expectKeywordOpt(".") == null)
				break;
			name += ".";
		}
		return name;
	},

	_classDefinition: function () {
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
		var extendNames = [];
		if (this._expectKeywordOpt("extends") != null) {
			do {
				var name = this._qualifiedName();
				if (name == null)
					return null;
				extendNames.push(name);
			} while (this._expectKeywordOpt(",") != null);
		}
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
			if (member == null)
				return null;
			members.push(member);
		}
		// done
		return new ClassDefinition(className, flags, extendNames, implementNames, members);
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
		if (this._expectKeywordOpt("function") != null)
			return this._functionDefinition(flags);
		var name = this._expectIdentifier();
		if (name == null)
			return null;
		var type = null;
		if (this._expectKeywordOpt(":") != null)
			if ((type = this._typeDeclaration()) == null)
				return null;
		var initialValue = null;
		if (this._expectKeywordOpt("=") != null)
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
		var name = this._expectIdentifier();
		if (name == null)
			return null;
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
				if (this._expectKeyword(":") == null)
					return null;
				var argType = this._typeDeclaration();
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
		if (this._expectKeyword(":") == null)
			return null;
		var returnType = this._typeDeclaration();
		if (returnType == null)
			return null;
		// take care of abstract function
		if ((flags & ClassDefinition.IS_ABSTRACT) != 0) {
			if (this._expectkeyword(";", " for abstract function definition") == null)
				return null;
			return new MemberFunctionDefinition(name, flags, returnType, args, null);
		}
		// body
		if (this._expectKeyword("{") == null)
			return null;
		this._statements = [];
		while (this._expectKeywordOpt("}") == null) {
			if (! this._statement())
				return null;
		}
		// done
		return new MemberFunctionDefinition(name, flags, returnType, args, this._statements);
	},

	_typeDeclaration: function () {
		// FIXME support arrays and parameterized types
		var type = this._qualifiedName();
		if (type == null)
			return null;
		return new TypeDeclaration(type);
	},

	_statement: function () {
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
		else if (this._expectKeywordOpt("continue") != null)
			return this._continueStatement();
		else if (this._expectKeywordOpt("return") != null)
			return this._returnStatement();
		else if (this._expectKeywordOpt("switch") != null)
			return this._switchStatement();
		else if (this._expectKeywordOpt("throw") != null)
			return this._throwStatement();
		else if (this._expectKeywordOpt("try") != null)
			return this._tryStatement();
		else if (this._expectKeywordOpt("assert") != null)
			return this._assertStatement();
		else if (this._expectKeywordOpt("log") != null)
			return this._logStatement();
		// labelled or expression statement
		var identifier = this._expectIdentifierOpt();
		if (identifier != null && this._expectKeywordOpt(":") != null) {
			this._statements.push(new LabelStatement(identifier));
			return this._statement();
		}
		this._ungetToken();
		// expression statement
		var expr = this._expr();
		if (expr == null)
			return false;
		this._statements.push(new ExpressionStatement(expr));
		return true;
	},

	_returnStatement: function () {
		var expr = this._expr();
		if (expr == null)
			return false;
		this._statements.push(new ReturnStatement(expr));
		return true;
	},

	_logStatement: function () {
		var expr = this._commaSeparatedExprs();
		if (expr == null) {
			return false;
		}
		this._statements.push(new LogStatement(expr));
		return true;
	},

	_expr: function () {
		var exprs = this._commaSeparatedExprs();
		if (exprs == null)
			return exprs;
		var expr = exprs.shift();
		while (exprs.length != 0)
			expr = new CommaExpression(expr, expr.shift());
		return expr;
	},

	_commaSeparatedExprs: function () {
		var expr = [];
		do {
			var assignExpr = this._assignExpr();
			if (assignExpr == null)
				return null;
			expr.push(assignExpr);
		} while (this._expectKeywordOpt(",") != null);
		if (! this._expectKeyword(";"))
			return null;
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
		var op = this._expectKeyword([ "=", "*=", "/=", "%=", "+=", "-=", "<<=", ">>=", ">>>=", "&=", "^=", "|=" ]);
		if (op == null)
			return null;
		var assignExpr = this._assignExpr();
		if (assignExpr == null)
			return null;
		return new AssignmentExpression(op, lhsExpr, assignExpr);
	},

	_condExpr: function () {
		var lorExpr = this._lorExpr();
		if (lorExpr == null)
			return null;
		if (this._expectKeywordOpt("?") == null)
			return lorExpr;
		var ifTrueExpr = null;
		var ifFalseExpr = null;
		if (this._expectKeywordOpt(":") == null) {
			ifTrueExpr = this._assignExpr();
			if (ifTrueExpr == null)
				return null;
			if (this._expectKeyword(":") == null)
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

	_lorExpr: function () {
		return this._binaryOpExpr([ "||" ], this._landExpr, function (_unused, e1, e2) {
			return new LogicalExpression("||", e1, e2);
		});
	},

	_landExpr: function () {
		return this._binaryOpExpr([ "&&" ], this._borExpr, function (_unused, e1, e2) {
			return new LogicalExpression("&&", e1, e2);
		});
	},

	_borExpr: function () {
		return this._binaryOpExpr([ "|" ], this._bxorExpr, function (_unused, e1, e2) {
			return new BitwiseExpression("|", e1, e2);
		});
	},

	_bxorExpr: function () {
		return this._binaryOpExpr([ "^" ], this._bandExpr, function (_unused, e1, e2) {
			return new BitwiseExpression("^", e1, e2);
		});
	},

	_bandExpr: function () {
		return this._binaryOpExpr([ "&" ], this._eqExpr, function (_unused, e1, e2) {
			return new BitwiseExpression("&", e1, e2);
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
				return new InstanceofExpression(e1, e2);
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
			if (op == "+")
				return new AdditiveExpression(e1, e2);
			else
				return new BinaryNumberExpression(op, e1, e2);
		});
	},

	_mulExpr: function () {
		return this._binaryOpExpr([ "*", "/", "%" ], this._unaryExpr, function (op, e1, e2) {
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
		switch (op) {
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
			return new UnaryNumberExpression(op, expr);
		case "~":
			return new BitwiseNotExpression(expr);
		case "!":
			return new LogicalNotExpression(expr);
		}
	},

	_postfixExpr: function () {
		var expr = this._lhsExpr();
		var op = this._expectKeywordOpt([ "++", "--" ]);
		if (op == null)
			return expr;
		return new PostIncrementExpression(op, expr);
	},

	_lhsExpr: function () {
		var expr;
		if (this._expectKeywordOpt("new") != null) {
			var name = this._qualifiedName();
			if (this._expectKeyword("(") == null)
				return null;
			var args = this._argsExpr();
			if (this._expectKeyword(")") == null)
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
				if (this._expectKeyword(")") == null)
					return null;
				expr = new CallExpression(expr, args);
				break;
			case "[":
				var index = this._expr();
				if (index == null)
					return null;
				if (this._expectKeyword("]") == null)
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
			if (this._expectKeyword(")") == null)
				return null;
			return expr;
		default:
			var token = this._nextToken();
			if (token instanceof StringToken)
				return new StringLiteralExpression(token.string);
			else if (token instanceof NumberToken)
				return new NumberLiteralExpression(token.number);
			else if (token instanceof IdentifierToken)
				return new IdentifierExpression(token.identifier);
			else
				throw "FIXME, EOF or something bad";
		}
	}

});
