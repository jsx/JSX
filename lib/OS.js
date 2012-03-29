"use strict";

var Class = require("./Class");

var fs = require("fs");

var OS = module.exports = Class.extend({

	$readFile: function (filename) {
		return fs.readFileSync(filename).toString();
	},

	$errprint: function (str) {
		console.log(str);
	}

});
