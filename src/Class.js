"use strict";

var Class = module.exports = function () {
};

Class.extend = function (properties) {
	var ctor = properties.initialize;
	if (typeof ctor === "undefined") {
		var superCtor = this.prototype.initialize;
		ctor = properties.initialize = function () {
			superCtor.call(this);
		};
	}
	function tmp() {};
	tmp.prototype = this.prototype;
	ctor.prototype = new tmp();
	ctor.extend = Class.extend;
	// assign properties
	for (var k in properties) {
		if (k.charAt(0) == '$') {
			ctor[k.substring(1)] = properties[k];
		} else {
			ctor.prototype[k] = properties[k];
		}
	}
	if (typeof ctor.initialize === "function") {
		ctor.initialize();
	}
	return ctor;
};

Class.prototype.initialize = function () {
};

Class.$import = function (name) {
	return "var __module = require(\"" + name + "\");\n"
		+ "for (var n in __module)\n"
		+ "	eval(\"var \" + n + \" = __module[n];\");\n";
};

