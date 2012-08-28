#!/usr/bin/env node
"use strict";

global.window = global;

global.location = {}; // dummy
global.addEventListener = function() { }; // dummy

var a = require("./../try/build/jsx-compiler");

if(a.Compiler) {
	console.log("Syntax OK");
}
else {
	process.exit(1);
}
