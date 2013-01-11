/*
 * Copyright (c) 2012 DeNA Co., Ltd.
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

import "js.jsx";

native __fake__ class _SourceMapGeneratorImpl {
	function addMapping(mapping : Map.<variant>) : void;

	var _validateMapping : function () : void; // DIRTY HACK
}

class SourceMapGenerator {

	var _outputFile : string;
	var _impl : _SourceMapGeneratorImpl;

	function constructor (outputFile : string, sourceRoot : Nullable.<string>) {
		var eval = js.global['eval'] as (string) -> variant;
		var sourceMap = eval('require("source-map")'); // lazy load for web

		this._outputFile = outputFile;
		this._impl = eval("new sourceMap.SourceMapGenerator({ file: outputFile, sourceRoot: sourceRoot })") as __noconvert__ _SourceMapGeneratorImpl;

		// XXX: monkey-patch to avoid source-map (0.1.0-0.1.1)'s bug
		this._impl._validateMapping = function () : void {};
	}

	function add (generatedPos : Map.<number>, originalPos : Map.<number>) : void {
		this.add(generatedPos, originalPos,  null, null);
	}

	function add (generatedPos : Map.<number>, originalPos : Map.<number>, sourceFile : Nullable.<string>, tokenName : Nullable.<string>) : void {
		this._impl.addMapping({
			generated: generatedPos,
			original:  originalPos,
			source:    sourceFile,
			name:      tokenName
		} : Map.<variant>);
	}

	function getSourceMappingFile () : string {
		return this._outputFile + ".mapping";
	}

	function generate () : string {
		return this._impl.toString();;
	}

	function magicToken () : string {
		return "\n" + "//@ sourceMappingURL=" + this.getSourceMappingFile() + "\n";
	}
}
