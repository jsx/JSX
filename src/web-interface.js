
var Class = require("./Class");
eval(Class.$import("./compiler"));
eval(Class.$import("./platform"));
eval(Class.$import("./jsemitter"));

"use strict";

exports.Compiler = Compiler;
exports.Platform = Platform;
exports.JavaScriptEmitter = JavaScriptEmitter;

