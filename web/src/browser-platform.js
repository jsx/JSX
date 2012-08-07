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

"use strict";

var Platform = require("./platform").Platform;
var Util = require("./util").Util;

// Function#bind is used only in the compiler,
// so it is not required in bootstrap.js
//
// copied from MDN's implementation.
// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Function/bind
if (!Function.prototype.bind) {
	Function.prototype.bind = function (oThis) {
		if (typeof this !== "function") {
			// closest thing possible to the ECMAScript 5 internal IsCallable function
			throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
		}

		var aArgs = Array.prototype.slice.call(arguments, 1),
				fToBind = this,
				fNOP = function () {},
				fBound = function () {
					return fToBind.apply(this instanceof fNOP
															 ? this
															 : oThis || window,
															 aArgs.concat(Array.prototype.slice.call(arguments)));
				};

		fNOP.prototype = this.prototype;
		fBound.prototype = new fNOP();

		return fBound;
	};
}

var debug = (location.hash === "#debug");

var BrowserPlatform = exports.BrowserPlatform = Platform.extend({
	constructor: function(root) {
		this._root = root;
		this._errors = [];
		this._content = {};

		this._map = JSON.parse(this.load(root + "/tree.generated.json"));

		this._prefix = location.pathname.replace(/\/[^\/]*$/, "");
		this.debug({ prefix: this._prefix, root: this._root });
	},

	getRoot: function () {
		return this._root;
	},

	_findPath: function (path) {
		var absPath = Util.resolvePath(this._prefix + "/" + path);

		this.debug("[D] find path=%s (absPath=%s)",
				path, absPath);

		var parts = absPath.split('/');
		var cur = this._map;
		while(parts.length > 0) {
			var t = cur[parts.shift()];
			if(t === undefined) {
				return undefined;
			}
			cur = t;
		}

		this.debug("[D] find path --> %s", JSON.stringify(cur));

		return cur;
	},

	fileExists: function (path) {
		return this._findPath(path) !== undefined;
	},

	getFilesInDirectory: function (path) {
		var d = this._findPath(path);
		if(d instanceof Object) {
			var a = [];
			for(var k in d) {
				if(typeof(d[k]) === "string") { // leaf node
					a.push(k);
				}
			}
			return a;
		}
		else {
			if(d === undefined) {
				throw new Error("no such file or directory");
			}
			else {
				throw new Error("not a directory");
			}
		}
	},

	setContent: function (name, content) {
		this._content[name] = content;
	},

	load: function (name) {
		if(name in this._content) {
			return this._content[name];
		}
		// synchronous XHR
		var xhr = new XMLHttpRequest();
		xhr.open("GET", name, false);
		xhr.send(null);
		if(xhr.status === 200) {
			return xhr.responseText;
		}
		else {
			throw new Error(xhr.status + " " + xhr.statusText + ": " + name);
		}
	},

	error: function (s) {
		console.error(s);
		this._errors.push(s);
	},

	debug: function (__va_args__) {
		if (debug) {
			console.log.apply(console, arguments);
		}
	},

	getErrors: function () {
		return this._errors;
	},

	applyClosureCompiler: function (sourceText, level, minify) {
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
			param.formatting = "pretty_print";
		}
		if(level === "ADVANCED_OPTIMIZATIONS") {
			param.js_externs = "";
		}
		var params = [];
		for(var key in param) {
			params.push(encodeURIComponent(key) +
						"=" +
						encodeURIComponent(param[key]));
		}
		xhr.send(params.join("&"));
		return xhr.responseText;
	}
});
