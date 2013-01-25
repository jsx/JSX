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
import "console.jsx";
import "js/web.jsx";
import "./browser-platform.jsx";
import "../compiler.jsx";
import "../optimizer.jsx";
import "../jsemitter.jsx";
import "../util.jsx";

class ScriptLoader {

	static var seen = new Map.<boolean>;

	static var optimizationLevel = 0;

	static function load() : void {
		var scripts = dom.document.getElementsByTagName("script");

		for (var i = 0, l = scripts.length; i < l; ++i) {
			var script = scripts[i] as HTMLScriptElement;
			if(script.type == "application/jsx") {
				var id = script.src ? script.src : script.innerHTML;
				if (ScriptLoader.seen.hasOwnProperty(id)) {
					continue;
				}
				ScriptLoader.seen[id] = true;

				var t0 = Date.now();

				var platform = new BrowserPlatform();
				var c = new Compiler(platform);
				var o = new Optimizer();
				var emitter = new JavaScriptEmitter(platform);
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

				if(ScriptLoader.optimizationLevel > 0) {
					var optimizeCommands = [ "lto", "no-assert", "fold-const", "return-if", "inline", "dce", "unbox", "fold-const", "lcse", "dce", "fold-const", "array-length", "unclassify" ];
					o.setup(optimizeCommands);
					o.setEnableRunTimeTypeCheck(false);
					emitter.setEnableRunTimeTypeCheck(false);
				}

				c.setOptimizer(o);

				if(! c.compile()) {
					throw new Error("Failed to compile!");
				}

				var output = emitter.getOutput(sourceFile, null, null);

				if(ScriptLoader.optimizationLevel > 1) {
					output = platform.applyClosureCompiler(output, "SIMPLE_OPTIMIZATIONS", false);
				}

				var compiledScript = dom.document.createElement("script");
				var scriptSection  = dom.document.createTextNode(output);
				compiledScript.appendChild(scriptSection);
				script.parentNode.appendChild(compiledScript);

				console.log("jsx-script-loader: load " + sourceFile + " in " + (Date.now() - t0) as string + " ms.");

				var applicationArguments = script.getAttribute("data-arguments");
				if (applicationArguments) {
					var args = JSON.parse(applicationArguments);
					if (typeof(args) == 'object' && (args as Object) instanceof Array.<variant>) {
						var array = args as Array.<variant>;
						for (var i = 0; i < array.length; ++i) {
							if (typeof array[i]  != "string") {
								throw new TypeError("Not an array of string: arguments[i] is " + JSON.stringify(array[i]));
							}
						}
					}
					else {
						throw new TypeError("Not an array of string: " + applicationArguments);
					}
					platform.debug(Util.format("run _Main.main()@%1 with %2", [sourceFile, applicationArguments]));
					// the name must be eval
					var eval = js.global['eval'] as (string) -> variant;
					var jsxRequire = eval('JSX.require') as (string) -> variant;
					// JSX.require(sourceFile)._Main.main$AS(args)
					var jsxRuntime = jsxRequire(sourceFile);
					assert jsxRuntime != null;
					var jsxMain    = jsxRuntime["_Main"];
					assert jsxMain != null;
					js.invoke(jsxMain, "main$AS", [ args ]);
				}
			}
		}
	}

}

