/* BrowserPlatform and workaround old browsers */

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

var BrowserPlatform = jsx.Platform.extend({
	constructor: function(root) {
		this._root = root;
		this._errors = [];
		this._content = {};

		this._map = JSON.parse(this.load("/web/tree.generated.json"));
	},

	getRoot: function () {
		return this._root;
	},

	_findPath: function (path) {
		var parts = path.split('/');
		var cur = this._map;
		while(parts.length > 0) {
			var t = cur[parts.shift()];
			if(t === undefined) {
				return undefined;
			}
			cur = t;
		}
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
