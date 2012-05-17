
var Class = require("./Class");
eval(Class.$import("./compiler"));
eval(Class.$import("./platform"));
eval(Class.$import("./jsemitter"));
eval(Class.$import("./optimizer"));

"use strict";

exports.Compiler = Compiler;
exports.Platform = Platform;
exports.JavaScriptEmitter = JavaScriptEmitter;
exports.Optimizer = Optimizer;

