import "./emitter.jsx";
import "./platform.jsx";
import "./classdef.jsx";
import "./expression.jsx";

class CplusplusEmitter implements Emitter {

	var _platform : Platform;

	var _outputFile : Nullable.<string>;
	var _output : string;

	var _runenv : string;
	var _enableRunTimeTypeCheck : boolean;

	function constructor (platform : Platform) {
		this._platform = platform;
	}

	override function setRunEnv (runenv : string) : void {
		this._runenv = runenv;
	}

	override function getSearchPaths () : string[] {
		return new string[];
	}

	override function setOutputFile (filename : Nullable.<string>) : void {
		this._outputFile = filename;
	}

	override function getSourceMappingFiles() : Map.<string> {
		return new Map.<string>;
	}

	override function setEnableRunTimeTypeCheck (flag : boolean) : void {
		this._enableRunTimeTypeCheck = flag;
	}

	override function getOutput () : string {
		return this._output;
	}

	override function getEnableSourceMap () : boolean {
		return false;
	}

	override function setEnableSourceMap (enable : boolean) : void {
		throw new Error("C++ emitter does not support source map");
	}

	override function setEnableProfiler (enable : boolean) : void {
		throw new Error("profiler is not provided");
	}

	override function getEnableMinifier () : boolean {
		return false;
	}

	override function setEnableMinifier (enable : boolean) : void {
		throw new Error("C++ emitter does not support minify");
	}

	override function isSpecialCall (callExpr : CallExpression) : boolean {
		return false;
	}

	override function emit (classDefs : ClassDefinition[]) : void {
	}

}
