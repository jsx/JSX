/*
 * Copyright (c) 2012-2014 DeNA Co., Ltd. et al.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to
 * deal in the Software without restriction, including without limitation the
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 * sell copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 * IN THE SOFTWARE.
 */

import "./classdef.jsx";
import "./compiler.jsx";

abstract class TransformCommand {

	var _compiler : Compiler;
	var _identifier : string;

	function constructor (compiler : Compiler, identifier : string) {
		this._compiler = compiler;
		this._identifier = identifier;
	}

	abstract function performTransformation () : void;

}

abstract class FunctionTransformCommand extends TransformCommand {

	function constructor (compiler : Compiler, identifier : string) {
		super(compiler, identifier);
	}

	override function performTransformation () : void {
		this._getAllClosures().forEach((funcDef) -> {
			this.transformFunction(funcDef);
		});
	}

	abstract function transformFunction (funcDef : MemberFunctionDefinition) : void;

	function _getAllClosures () : MemberFunctionDefinition[] {
		var closures = new MemberFunctionDefinition[];
		// deeper is first
		this._compiler.forEachClassDef(function (parser, classDef) {
			return classDef.forEachMember(function onMember(member) {
				member.forEachClosure(function (funcDef) {
					return onMember(funcDef);
				});
				if (member instanceof MemberFunctionDefinition) {
					closures.push(member as MemberFunctionDefinition);
				}
				return true;
			});
		});
		return closures;
	}

}

