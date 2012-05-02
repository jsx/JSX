var Class = require("./Class");

"use strict";

var Emitter = exports.Emitter = Class.extend({

	getSearchPaths: null, // abstract function getSearchPaths():string[]

	emit: null, // abstract function emitClassDefinition(:ClassDefinition[]):void

	getOutput: null // abstract function getOutput() : String

});
