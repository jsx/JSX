"use strict";

var Class = require("./Class");

var Token = module.exports = Class.extend({

	initialize: function (pos) {
		this.pos = pos;
	}
});
