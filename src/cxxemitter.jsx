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

	var _indent = 0;

	function _emit (str : string) : void {
		for (var i = 0; i < this._indent; ++i) {
			this._output += "  ";
		}
		this._output += str + "\n";
	}

	function _advanceIndent () : void {
		this._indent++;
	}

	function _reduceIndent () : void {
		this._indent--;
	}

	var _emittingClass : ClassDefinition = null;

	override function emit (classDefs : ClassDefinition[]) : void {
		this._output += "#include <gc_cpp.h>\n";

		for (var i = 0; i < classDefs.length; ++i) {
			if ((classDefs[i].flags() & ClassDefinition.IS_NATIVE) != 0) {
				continue;
			}
			if (classDefs[i] instanceof TemplateClassDefinition || classDefs[i] instanceof InstantiatedClassDefinition) {
				continue;
			}
			this._output += "class " + classDefs[i].className() + " : public " + classDefs[i].extendType().toString() + " {\n";
			this._emittingClass = classDefs[i];
			try {
				this._output += "public:\n";
				this._advanceIndent();
				classDefs[i].forEachMemberFunction(function (funcDef) {
					this._emitMemberFunction(funcDef);
					return true;
				});
				this._reduceIndent();

				this._output += "private:\n";
				this._advanceIndent();
				classDefs[i].forEachMemberVariable(function (varDef) {
					this._emitMemberVariable(varDef);
					return true;
				});
				this._reduceIndent();
			} finally {
				this._output += "};\n\n";
				this._emittingClass = null;
			}
		}
	}

	function _emitMemberFunction (funcDef : MemberFunctionDefinition) : void {
		var output = "";
		if (funcDef instanceof TemplateFunctionDefinition) {
			return;
		}
		if (funcDef.name() == "constructor") {
			output += funcDef.getClassDef().className() + " (";
		}
		else {
			output += funcDef.getReturnType().toString() + " " + funcDef.name() + " (";
		}
		for (var i = 0; i < funcDef.getArguments().length; ++i) {
			var arg = funcDef.getArguments()[i];
			output += arg.getType().toString();
			output += " ";
			output += arg.getName().getValue();
			if (i + 1 < funcDef.getArguments().length) {
				output += ", ";
			}
		}
		output += ");";
		this._emit(output);
	}

	function _emitMemberVariable (varDef : MemberVariableDefinition) : void {
		// TODO
	}

}
