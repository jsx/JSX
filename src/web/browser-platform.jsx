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

import "../platform.jsx";
import "../util.jsx";
import "../emitter.jsx";

// hack to avoid exceptions on native("require(...)")
native ("(function (exports) { exports.require = function (module) { console.error('ignore loading module: ' + module); return {}; }; }(new Function('return this')()))") class _remove_require { }

class BrowserPlatform extends Platform {

	static var debug = (dom.window.location.hash == "#debug");

	var _root : string;
	var _errors = new string[];
	var _tree : variant; // path tree
	var _prefix : string;

	function constructor() {
		this._root = this._rootPath();

		// the prefix path of the application HTML file
		this._prefix = dom.window.location.pathname.replace(/\/[^\/]*$/, "");

		this._tree  = JSON.parse(this.load(this._root + "/tree.generated.json"));


		this.debug(Util.format("[D] prefix=%1, root=%2", [this._prefix, this._root ]));
	}

	function _rootPath() : string {
		var root = "..";
		try {
			// http://path/to/try/foo/bar
			var matched = dom.window.location.pathname.match(/^(.*\/try(?:-on-web)?)\/.*$/);
			root = matched[1];

		} catch (err : Error) {
			this.debug(err.toString());
		}
		return root;
	}

	override function getRoot () : string {
		return this._root;
	}

	function _resolvePath(path : string) : string {
		if (path.indexOf(this._root + "/") != -1) {
			return path.slice(this._root.length + 1);
		}
		return path;
	}

	/**
	 * @return string for a normal file, Object for an directory, or null.
	 */
	function _findPath (path : string) : variant {
		//var absPath = Util.resolvePath(this._prefix + "/" + path);
		var resolvedPath = this._resolvePath(path);
		this.debug(Util.format("[D] find path=%1 (resolvedPath=%2)", [path, resolvedPath]));

		var parts = resolvedPath.split('/');
		if (parts[0] == "") {
			parts.shift();
		}
		var cur = this._tree;
		while(parts.length > 0) {
			var t = cur[parts.shift()];
			if(t == null) {
				this.debug("[D] find path --> (not found)");
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

	override function load (name : string) : string {
		if(this.fileContent.hasOwnProperty(name)) {
			return this.fileContent[name];
		}
		var content = "";
		// synchronous XHR
		var err = "";
		try {
			this.debug("[D] XHR: " + name);
			var xhr = new XMLHttpRequest();
			xhr.open("GET", name, false);
			xhr.send(null : Blob);
			if(xhr.status == 200 || xhr.status == 0) {
				content = xhr.responseText;
			}
			else {
				err = xhr.status as string + " " + xhr.statusText + ": " + name;
			}
		}
		catch (e : variant) {
			err = "XMLHttpRequest failed for " + name + ": " + e as string;
		}
		if (err) {
			throw new Error(err);
		}
		return this.fileContent[name] = content;
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

	override function makeFileExecutable(file : string, runEnv : string) : void {
		throw new Error('not supported');
	}
	override function execute(sourceFileName : Nullable.<string>, jsSource : string, argv : string[]) : void {
		throw new Error('not supported');
	}
	override function mkpath (path : string) : void {
		throw new Error('not supported');
	}
	override function save(path : Nullable.<string>, content : string) : void {
		throw new Error('not supported');
	}
	override function setWorkingDir(dir : string) : void {
		throw new Error('not supported');
	}
}
