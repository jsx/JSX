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

import "./analysis.jsx";
import "./classdef.jsx";
import "./platform.jsx";

interface Emitter implements Stashable {

	function setRunEnv(runenv : string) : void;

	function getSearchPaths():string[];

	function setOutputFile(filename :Nullable.<string>) :void;

	function getSourceMappingFiles() : Map.<string>;

	function setEnableRunTimeTypeCheck(flag : boolean) : void;

	function emit(classDefs : ClassDefinition[]) : void;

	function getOutput() : string;

	function getEnableSourceMap() : boolean;

	function setEnableSourceMap(enable : boolean) : void;

	function setEnableProfiler(enable : boolean) : void;

	function getEnableMinifier() : boolean;

	function setEnableMinifier(enable : boolean) : void;

}
