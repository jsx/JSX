var Class = require("./Class");

"use strict";

var fs;

if(typeof(process) !== 'undefined') { // node
	fs = require("fs");
}
else {
	fs = {};
	fs.readFileSync = function(id) {
		var element = document.getElementById(id);
		if(element == null) {
			throw new Error("Element not found: " + id);
		}
		return element.value;
	};
}

var OS = exports.OS = Class.extend({

	$readFile: function (filename) {
		return fs.readFileSync(filename).toString();
	},

	$errprint: function (str) {
		console.error(str);
	}

});
