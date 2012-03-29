"use strict";

var Class = require("./Class");

var fs;

if(typeof(process) !== 'undefined') { // node
    fs = require("fs");
}
else {
    fs = {};
    fs.readFileSync = function(id) {
        var element = document.getElementById(id);
        return element.textContent;
    };
}

var OS = module.exports = Class.extend({

	$readFile: function (filename) {
		return fs.readFileSync(filename).toString();
	},

	$errprint: function (str) {
		console.error(str);
	}

});
