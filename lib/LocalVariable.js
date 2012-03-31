"use strict";

var Class = require("./Class");

var LocalVariable = module.exports = Class.extend({

	initialize: function (name, type) {
		this.name = name;
		this.type = type;
	}

});
