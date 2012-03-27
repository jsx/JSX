"use strict";

var Class = require("./class");

var Token = module.exports = Class.extend({

	initialize: function (pos) {
		this.pos = pos;
	}
});
