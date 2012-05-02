var Class = require("./Class");

// interface
var Platform = exports.Platform = Class.extend({

	// load a content by name (throws an exception on error)
	// e.g. node.js reads it from files
	//      browsers read it from DOM
	// load(name : string)

	log: function (s) {
		console.log(s);
	},

	warn: function (s) {
		console.warn(s);
	},

	error: function (s) {
		console.error(s);
	}

});
// vim: set noexpandtab
