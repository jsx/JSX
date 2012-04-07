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
	},

	toString: function () {
		return this.identifier;
	},

	$toString: function (identifiers) {
        if(identifiers instanceof Array) {
            var s = [];
            for (var i = 0; i < identifiers.length; ++i)
                s[i] = identifiers[i].identifier;
            return s.join(".");
        }
        else {
            return Class.prototype.toString.call(this);
        }
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
		this.number = typeof(number) === 'string'
            ? +(number.replace(/_/g, ''))
            : +number;
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
    $create: function(number, filename, pos) {
        var int32_max = 2147483647;
        var int32_min = (-int32_max) - 1;

        var value = this.parse(number);
        if(value < int32_max && value > int32_min) {
            return new IntegerToken(value, filename, pos);
        }
        else {
            return new NumberToken(value, filename, pos);
        }
    },

	initialize: function (number, filename, pos) {
		NumberToken.prototype.initialize.call(this, number, filename, pos);
        this.isInteger = true;
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
		this.string = string.substring(1, string.length - 1).replace(/\\(.)/g, "$1"); // FIXME add support for \x, \u, etc.
	},

	serialize: function () {
		return this._serialize("string", this.string);
	}

});
