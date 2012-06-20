/*
 * https://github.com/gfx/require-simple.js
 *
 * AUTHOR: Fuji, Goro (gfx) <gfuji@cpan.org>
 * LICENSE: The MIT License
 *
 * Usage:
 *     <script src="require-simple.js"></script>
 *     <script>
 *         require.paths.unshift("assets/js");
 *         var Foo = require("foo");
 *     </script>
 */

if(typeof(window) === "undefined") {
	throw new Error("require-simple.js works only on browsers!");
}

function require(name) {
	"use strict";
	if(!require.modules) {
		require.modules = {};
	}
	if(require.modules[name]) {
		if(require.debug) {
			console.log("require: \"" + name + "\" is already loaded");
		}
		return require.modules[name].exports;
	}

	function findModule(paths, name) {
		for(var i = 0; i < paths.length; ++i) {
			var url = paths[i]+ "/" + name + ".js";

			var xhr = new XMLHttpRequest();
			xhr.open("GET", url, false);
			xhr.send(null);
			
			if(require.debug) {
				console.log("require: " + xhr.status + " " + url);
			}

			if(xhr.status === 200) {
				return xhr.responseText;
			}

			if(xhr.status !== 404 || (i+1) === paths.length) {
				throw new Error("Cannot load module \"" + name + "\": " +
								xhr.status);
			}
		}
	}
	var module = require.modules[name] = {
		id: name,
		exports: {}
	};

	var src = findModule(require.paths, name);

	var m = "require.modules['" + name.replace(/'/g, "\\'") + "']";
	var srcSection = document.createTextNode(
		"(function (module, exports) { // "+name+".js\n" +
		src +
		"}("+m+", "+m+".exports));\n"
	);

	var script = document.createElement("script");
	script.appendChild(srcSection);

	document.head.appendChild(script);

	return module.exports;
}

require.debug = false;
require.paths = ["."];

