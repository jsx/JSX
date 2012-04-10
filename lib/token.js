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

	initialize: function (source, filename, pos) {
		Token.prototype.initialize.call(this, filename, pos);
		this._value = +source;
		this._source = source;
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
		return this._serialize("number", this._value);
	}

});

// int32_t representation
var IntegerToken = exports.IntegerToken = Token.extend({

	$MIN_VALUE: -0x80000000,

	$MAX_VALUE: 0x7fffffff,

	initialize: function (source, filename, pos) {
		Token.prototype.initialize.call(this, filename, pos);
		this._value = source | 0;
		this._source = source;
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
		return this._serialize("integer", this._value);
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
