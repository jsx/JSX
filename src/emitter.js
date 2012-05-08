var Class = require("./Class");

"use strict";

var Emitter = exports.Emitter = Class.extend({

	getSearchPaths: null, // abstract function getSearchPaths():string[]

	setOutputFile: null, // abstract function setOutputFile(:string) :void

	setEnableAssertion: null, // abstract function setEnableAssertion(: boolean) : void

	setEnableLogging: null, // abstract function setEnableLogging(: boolean) : void

	setEnableRunTimeTypeCheck: null, // abstract function setEnableRunTimeTypeCheck(: boolean) : void

	emit: null, // abstract function emitClassDefinition(:ClassDefinition[]):void

	getOutput: null // abstract function getOutput() : String
});
