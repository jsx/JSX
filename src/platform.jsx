/*
 * Copyright (c) 2012,2013 DeNA Co., Ltd. et al.
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

import "console.jsx";
import "./emitter.jsx";

abstract class Platform {
	var fileContent = new Map.<string>();

	// returns root directory of JSX
	abstract function getRoot() : string;

	function setFileContent (name : string, content : string) : void {
		this.fileContent[name] = content;
	}

	abstract function fileExists(path : string) : boolean;

	abstract function getFilesInDirectory(path: string) : string[]; // (throws an exception on error)

	// load a content by name (throws an exception on error)
	// e.g. node.js reads it from files
	//      browsers read it from DOM or servers
	abstract function load (name : string) : string;

	abstract function makeFileExecutable(file : string, runEnv : string) : void;

	abstract function execute(sourceFileName : Nullable.<string>, jsSource : string, argv : string[]) : void;

	function log (s : string) : void {
		console.log(s);
	}

	function warn (s : string) : void {
		console.warn(s);
	}

	function error (s : string) : void {
		console.error(s);
	}

	abstract function setWorkingDir(arg : string) : void;
	abstract function mkpath (path : string) : void;
	abstract function save (path : Nullable.<string>, content : string) : void;

	function encodeFilename(filename : string) : string {
		var rootDir = this.getRoot() + "/";
		if (filename.indexOf(rootDir) == 0) {
			filename = "system:" + filename.substring(rootDir.length);
		}
		return filename;
	}

}
// vim: set noexpandtab
