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
});

var IdentifierToken = exports.IdentifierToken = Token.extend({

	initialize: function (identifier, filename, pos) {
		Token.prototype.initialize.call(this, filename, pos);
		this.identifier = identifier;
	},

	serialize: function () {
		return this._serialize("identifier", this.identifier);
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

	initialize: function (number, filename, pos) {
		Token.prototype.initialize.call(this, filename, pos);
		this.number = +number;
	},

	serialize: function () {
		return this._serialize("number", this.number);
	}
});

var RegExpToken = exports.RegExpToken = Token.extend({

	initialize: function (expr, filename, pos) {
		Token.prototype.initialize.call(this, filename, pos);
		this.expr = expr;
	},

	serialize: function () {
		return this._serialize("RegExp", this.expr);
	}
});

var StringToken = exports.StringToken = Token.extend({

	initialize: function (string, filename, pos) {
		Token.prototype.initialize.call(this, filename, pos);
		this.string = string.substring(1, string.length - 2).replace(/\\(.)/g, "$1"); // FIXME add support for \x, \u, etc.
	},

	serialize: function () {
		return this._serialize("string", this.string);
	},

	toString: function () {
		return "string literal";
	}
});
