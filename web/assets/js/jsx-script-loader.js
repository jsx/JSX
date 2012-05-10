window.addEventListener("DOMContentLoaded", function(e) {
	"use strict";

	var scripts = document.getElementsByTagName("script");
	for (var i = 0; i < scripts.length; ++i) {
		var script = scripts[i];
		if(script.type === "application/jsx") {
			var platform = new BrowserPlatform("../..");
			var c = new jsx.Compiler(platform);
			var emitter = new jsx.JavaScriptEmitter(platform);
			c.setEmitter(emitter);

			if(script.src) {
				c.addSourceFile(null, script.src.replace(/^.*\//, ""));
			}
			else {
				platform.setContent("in-line-script", script.innerHTML);
				c.addSourceFile(null, "in-line-script");
			}

			if(jsx.enableOptimizations) {
				emitter.setEnableAssertion(false);
				//emitter.setEnableLogging(false);
				emitter.setEnableRunTimeTypeCheck(false);
			}

			if(! c.compile()) {
				throw new Error("Failed to compile!");
			}

			var output = emitter.getOutput();

			if(jsx.enableOptimizations) {
				output = platform.applyClosureCompiler(output, "SIMPLE_OPTIMIZATIONS");
			}

			var compiledScript = document.createElement("script");
			var scriptSection  = document.createTextNode(output);
			compiledScript.appendChild(scriptSection);
			script.parentNode.appendChild(compiledScript);
		}
	}
});

