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
		if (token != null && token instanceof KeywordToken && token.keyword == expected)
			return true;
		this._ungetToken();
		return false;
	},

	_expectKeyword: function (expected, messageOpt) {
		if (! this._expectKeywordOpt(expected)) {
			this._getToken(); // revert the unget
			this._newError("expected " + candidates.join(" or ") + (messageOpt ? messageOpt : ""));
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

	_expectIdentifier: function (messageOpt) {
		var identifier = this._expectIdentifierOpt();
		if (identifier == null) {
			this._getToken(); // revert the unget
			this._newError("expected " + candidates.join(" or ") + (messageOpt ? messageOpt : ""));
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
		var statements = [];
		while (! this._expectKeywordOpt("}")) {
			var statement = this._statement();
			if (statement == null)
				return null;
			statements.push(statement);
		}
		// done
		return new MemberFunctionDefinition(name, flags, returnType, args, statements);
	},

	_typeDeclaration: function () {
		// FIXME support arrays and parameterized types
		var type = this._packageOrClassName();
		if (type == null)
			return null;
		return new TypeDeclaration(type);
	}
});
