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

import "console.jsx";
import "js/web.jsx";
import "../../src/platform.jsx";
import "../../src/util.jsx";
import "../../src/emitter.jsx";

class BrowserPlatform extends Platform {

	static var debug = (dom.window.location.hash == "#debug");

	var _root : string;
	var _errors : string[];
	var _content : Map.<string>;
	var _map : variant;
	var _prefix : string;
	
	function constructor(root : string) {
		this._root = root;
		this._errors = new string[];
		this._content = new Map.<string>;

		this._map = JSON.parse(this.load(root + "/tree.generated.json"));

		this._prefix = dom.window.location.pathname.replace(/\/[^\/]*$/, "");
		this.debug({ prefix: this._prefix, root: this._root });
	}

	override function getRoot () : string {
		return this._root;
	}

	function _findPath (path : string) : variant {
		var absPath = Util.resolvePath(this._prefix + "/" + path);

		this.debug(Util.format("[D] find path=%1 (absPath=%2)", [path, absPath]));

		var parts = absPath.split('/');
		var cur = this._map;
		while(parts.length > 0) {
			var t = cur[parts.shift()];
			if(t == null) {
				return null;
			}
			cur = t;
		}

		this.debug(Util.format("[D] find path --> %1", [JSON.stringify(cur)]));

		return cur;
	}

	override function fileExists (path : string) : boolean {
		return this._findPath(path) != null;
	}

	override function getFilesInDirectory (path : string) : string[] {
		var d = this._findPath(path);
		if(typeof(d) == 'object') {
			var a = new string[];
			for(var k in d as Map.<variant>) {
				if(typeof(d[k]) == "string") { // leaf node
					a.push(k as string);
				}
			}
			return a;
		}
		else {
			if(d == null) {
				throw new Error("no such file or directory");
			}
			else {
				throw new Error("not a directory");
			}
		}
	}

	function setContent (name : string, content : string) : void {
		this._content[name] = content;
	}

	override function load (name : string) : string {
		if(name in this._content) {
			return this._content[name];
		}
		// synchronous XHR
		var xhr = new XMLHttpRequest();
		xhr.open("GET", name, false);
		xhr.send(null : Nullable.<string>);
		if(xhr.status == 200) {
			return xhr.responseText;
		}
		else {
			throw new Error(xhr.status as string + " " + xhr.statusText + ": " + name);
		}
	}

	override function error (s : string) : void {
		console.error(s);
		this._errors.push(s);
	}

	function debug (content : variant) : void {
		if (BrowserPlatform.debug) {
			console.log(content);
		}
	}

	function getErrors () : string[] {
		return this._errors;
	}

	function applyClosureCompiler (sourceText : string, level : string, minify : boolean) : string {
		var URL = 'http://closure-compiler.appspot.com/compile';
		var xhr = new XMLHttpRequest();
		xhr.open("POST", URL, false);
		xhr.setRequestHeader("Content-Type",
							 "application/x-www-form-urlencoded");

		var param = {
			js_code: sourceText,
			compilation_level: level,
			output_format: "text",
			output_info: "compiled_code"
		};
		if(!minify) {
			param['formatting'] = "pretty_print";
		}
		if(level == "ADVANCED_OPTIMIZATIONS") {
			param['js_externs'] = "";
		}
		var params = new string[];
		for(var key in param) {
			params.push(String.encodeURIComponent(key) +
						"=" +
						String.encodeURIComponent(param[key]));
		}
		xhr.send(params.join("&"));
		return xhr.responseText;
	}

	override function addLauncher(emitter : Emitter, sourceFile : variant, output : string, entryPoint : string, executableFor : string) : string {
		throw new Error('logic flaw');
	}
	override function makeFileExecutable(file : string, runEnv : string) : void {
		throw new Error('logic flaw');
	}
	override function execute(sourceFileName : Nullable.<string>, jsSource : string, argv : string[]) : void {
		throw new Error('logic flaw');
	}
	override function mkpath (path : string) : void {
		throw new Error('logic flaw');
	}
	override function save(path : Nullable.<string>, content : string) : void {
		throw new Error('logic flaw');
	}

}
