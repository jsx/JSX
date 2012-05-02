var Class = require("./Class");

"use strict";

var Emitter = exports.Emitter = Class.extend({

	getSearchPaths: null, // abstract function getSearchPaths():string[]

	emitClassDefinition: null, // abstract function emitClassDefinition(:ClassDefinition):void

	emitStaticInitializationCode: null, // abstract function emitStaticInitializationCode(:ClassDefinition):void

	getOutput: null // abstract function getOutput() : String

});
