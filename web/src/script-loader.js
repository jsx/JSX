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

var jsx = require("./interface");

var seen = {};

function load(root) {
	var scripts = document.getElementsByTagName("script");

	for (var i = 0, l = scripts.length; i < l; ++i) {
		var script = scripts[i];
		if(script.type === "application/jsx") {
			var id = script.src ? script.src : script.innerHTML;
			if (seen.hasOwnProperty(id)) {
				continue;
			}
			seen[id] = true;

			var t0 = Date.now();
			
			var platform = new jsx.BrowserPlatform(root);
			var c = new jsx.Compiler(platform);
			var o = new jsx.Optimizer();
			var emitter = new jsx.JavaScriptEmitter(platform);
			c.setEmitter(emitter);

			var sourceFile;
			if(script.src) {
				sourceFile = script.src.replace(/^.*\//, "");
			}
			else {
				sourceFile = "<script>";
				platform.setContent(sourceFile, script.innerHTML);
			}
			c.addSourceFile(null, sourceFile);

			if(jsx.optimizationLevel > 0) {
				var optimizeCommands = [ "lto", "no-assert", "fold-const", "return-if", "inline", "dce", "unbox", "fold-const", "lcse", "dce", "fold-const", "array-length", "unclassify" ];
				o.setup(optimizeCommands);
				o.setEnableRunTimeTypeCheck(false);
				emitter.setEnableRunTimeTypeCheck(false);
			}

			c.setOptimizer(o);

			if(! c.compile()) {
				throw new Error("Failed to compile!");
			}

			var output = emitter.getOutput(sourceFile);

			if(jsx.optimizationLevel > 1) {
				output = platform.applyClosureCompiler(output, "SIMPLE_OPTIMIZATIONS");
			}

			var compiledScript = document.createElement("script");
			var scriptSection  = document.createTextNode(output);
			compiledScript.appendChild(scriptSection);
			script.parentNode.appendChild(compiledScript);

			console.log("jsx-script-loader: load " + sourceFile + " in " + (Date.now() - t0) + " ms.");

			var applicationArguments = script.getAttribute("data-arguments");
			if (applicationArguments) {
				var args = JSON.parse(applicationArguments);
				if (args instanceof Array) {
					for (var i = 0; i < args.length; ++i) {
						if (typeof args[i]  !== "string") {
							throw new TypeError("Not an array of string: arguments[i] is " + JSON.stringify(args[i]));
						}
					}
				}
				else {
					throw new TypeError("Not an array of string: " + applicationArguments);
				}
				platform.debug("run _Main.main()@%s with %s", sourceFile, applicationArguments);
				JSX.require(sourceFile)._Main.main$AS(args);
			}
		}
	}
};

exports.ScriptLoader = {
	load: load
};

window.addEventListener("load", function(e) {
	var root = "..";
	try {
		var matched = location.pathname.match(/\/try(?:-on-web)?\/(.*)\/[^\/]*$/);
		root = matched[1].replace(/[^\/]+/g, "..");

	} catch (err) { }

	load(root);
});

