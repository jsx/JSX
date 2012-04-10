"use strict";

var Class = require("./Class");

var Token = exports.Token = Class.extend({

	initialize: function (filename, pos) {
		this.filename = filename;
		this.pos = pos;
	},

	// abstract function serialize()

	_serialize: function (name, properties) {
		return [name, this.filename, this.pos, properties];
	},

	$serialize: function (tokens) {
		var s = [];
		for (var i = 0; i < tokens.length; ++i)
			s[i] = JSON.stringify(tokens[i].serialize());
		return "[\n" + s.join(",\n") + "\n]\n";
	}

});

var IdentifierToken = exports.IdentifierToken = Token.extend({

	initialize: function (identifier, filename, pos) {
		Token.prototype.initialize.call(this, filename, pos);
		this.identifier = identifier;
	},

	serialize: function () {
		return this._serialize("identifier", this.identifier);
	},

	toString: function () {
		return this.identifier;
	},

	arrayToString: function (identifiers) {
		var s = [];
		for (var i = 0; i < identifiers.length; ++i)
			s[i] = identifiers[i].identifier;
		return s.join(".");
	}

});

var KeywordToken = exports.KeywordToken = Token.extend({

	initialize: function (keyword, filename, pos) {
		Token.prototype.initialize.call(this, filename, pos);
		this.keyword = keyword;
	},

	serialize: function () {
		return this._serialize("keyword", this.keyword);
	},

	toString: function () {
		return this.keyword;
	}

});

var NumberToken = exports.NumberToken = Token.extend({

	initialize: function (source, number, filename, pos) {
		Token.prototype.initialize.call(this, filename, pos);
		this._source = source;
		this._value = number === null
			? +(source.replace(/_/g, ''))
			: number;
	},

	getValue: function() {
		return this._value;
	},
	getSource: function() {
		return this._source;
	},
	toString: function() {
		return this._source;
	},

	serialize: function () {
		return this._serialize("number", this.number);
	}
});

// int32_t representation
var IntegerToken = exports.IntegerToken = NumberToken.extend({
	$parse: function(token) {
		var s = token.replace(/_/g, '');

		// XXX: should support binary?
		if(s.match(/[bB]/)) {
			return parseInt(s.replace(/^0[bB]/, ''), 2);
		}
		return parseInt(s);
	},

	// factory method returning either NumberToken or IntegerToken
	$create: function(source, filename, pos) {
		var int32_max = 2147483647;
		var int32_min = (-int32_max) - 1;

		var value = this.parse(source);
		if(value < int32_max && value > int32_min) {
			return new IntegerToken(source, value, filename, pos);
		}
		else {
			return new NumberToken(source, value, filename, pos);
		}
	},

	initialize: function (source, value, filename, pos) {
		NumberToken.prototype.initialize.call(this, source, value, filename, pos);
		this.isInt32 = true;
	}
});

var RegExpToken = exports.RegExpToken = Token.extend({

	initialize: function (expr, filename, pos) {
		Token.prototype.initialize.call(this, filename, pos);
		this.expr = expr;
	},

	toString: function() {
		return this.expr;
	},

	serialize: function () {
		return this._serialize("RegExp", this.expr);
	}
});

var StringToken = exports.StringToken = Token.extend({

	initialize: function (source, filename, pos) {
		Token.prototype.initialize.call(this, filename, pos);
		// FIXME add support for \x, \u, etc.
		this.string = source.substring(1, source.length - 1).replace(/\\(.)/g, "$1");
	},

	toString: function() {
		return this._source;
	},

	serialize: function () {
		return this._serialize("string", this.string);
	}
});
// vim: set noexpandtab:
