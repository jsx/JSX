// JSX front-end for browsers

window.addEventListener('load', function(e) {
	"use strict";

	function element(id) {
		return document.getElementById(id);
	}

	function getOptimizationLevel() {
		var items = document.getElementsByName("optimization-level");
		for(var i = 0; i < items.length; ++i) {
			if(items[i].checked) {
				return items[i].value | 0;
			}
		}
		return 0;
	}

	var list   = element('source-list');

	var input  = element('input');

	var editor = CodeMirror.fromTextArea(input, {
		mode: "application/jsx",
		lineNumbers: true,
		lineWrapping: true,
		autofocus: true,

		extraKeys: {
			"'\u00A5'" /* yen mark */ : function (editor) {
				editor.replaceSelection("\u005c"); // backslash
				var cursor = editor.getCursor();
				editor.setSelection(cursor);
			}
		},
	});

	var output = CodeMirror.fromTextArea(element("output"), {
		mode: "javascript",
		lineNumbers: true,
		lineWrapping: true,
		readOnly: true
	});

	function saveInput(input) {
		var session = {
			inputPath:         input.dataset["path"],
			source:            editor.getValue(),
			cursor:            editor.getCursor(),
			optimizationLevel: getOptimizationLevel()
		};
		sessionStorage.setItem("jsx.session", JSON.stringify(session));
	}

	function retrieveInput(input) {
		var serializedSession = sessionStorage.getItem("jsx.session");
		if(serializedSession) {
			var session = JSON.parse(serializedSession);

			input.dataset["path"] = session.inputPath;
			editor.setValue(session.source);
			editor.setCursor(session.cursor.line, session.cursor.ch);

			var items = document.getElementsByName("optimization-level");
			for(var i = 0; i < items.length; ++i) {
				if(items[i].value === String(session.optimizationLevel)) {
					items[i].checked = true;
				}
				else {
					items[i].checked = false;
				}
			}

			compile({ mode: 'compile' });
		}
	}

	function compile(options) {
		console.log('compile with ' + JSON.stringify(options));

		output.setValue("");
		var path = input.dataset["path"];

		var platform = new jsx.BrowserPlatform(".");
		platform.setContent(path, editor.getValue());

		var c = new jsx.Compiler(platform);
		var emitter = new jsx.JavaScriptEmitter(platform);
		c.setEmitter(emitter);

		var o = new jsx.Optimizer();

		if(getOptimizationLevel() > 0) {
			o.setup([ "lto", "no-assert", "fold-const", "return-if", "inline", "fold-const", "array-length" ]);
			emitter.setEnableRunTimeTypeCheck(false);
			o.setEnableRunTimeTypeCheck(false);
		}
		c.setOptimizer(o);

		switch(options.mode) {
		case "run":
		case "compile":
			c.setMode(jsx.Compiler.MODE_COMPILE);
			break;
		case "parse":
			c.setMode(jsx.Compiler.MODE_PARSE);
			  break;
		 default:
			alert("unknown mode: " + options.mode);
			return;
		}

		c.addSourceFile(null, path);

		var success = c.compile();
		console.log(c);

		if (success) {
			output.setOption("mode", "javascript");
			
			if (options.mode === 'parse') {
				output.setValue(c.getAST());
				return;
			}

			var out = emitter.getOutput().replace(/\t/g, "  ");
			out += "JSX.require('"+path+"').Test.run$();\n";

			var level = getOptimizationLevel();
			if(level > 0 && options.mode !== 'parse') {
				out = platform.applyClosureCompiler(out, level === 1
										 ? "SIMPLE_OPTIMIZATIONS"
										 : "ADVANCED_OPTIMIZATIONS");
			}

			output.setValue(out);

			if(options.mode === 'run') {
				console.log('run:');
				eval(output.getValue());
			}
		}
		else if(platform.getErrors().length !== 0){
			output.setOption("mode", "");
			output.setValue("ERROR!\n" + platform.getErrors().join(""));
		}
	}

	function forEach(collection, block) {
		for(var i = 0; i < collection.length; ++i) {
			block(collection[i]);
		}
	}

	// set up example souce files
	forEach(list.getElementsByTagName("li"), function(li) {
		if(li.className !== "source-file") return;

		var a = li.children[0];
		a.addEventListener('click', function(event) {
			event.preventDefault();
			event.stopPropagation();

			input.dataset["path"] = a.dataset["path"];

			var url = a.href;
			var xhr = new XMLHttpRequest();
			xhr.onreadystatechange = function(e) {
				if (xhr.readyState !== 4) return;

				editor.setValue(xhr.responseText.replace(/\t/g, "  "));

				forEach(list.getElementsByTagName("li"), function(li) {
					if(!li.className.match(/\bsource-file\b/)) return;

					li.className = "source-file";
				});
				li.className = "source-file active";

				compile({ mode: "run" });
			};
			xhr.open("GET", url);
			xhr.send(null);
		});
	});

	window.addEventListener('keyup', function(event) {
		if(event.ctrlKey) {
			event.preventDefault();
			event.stopPropagation();
			var RUN_KEY     = "R".charCodeAt(0);
			var COMPILE_KEY = "C".charCodeAt(0);

			if(event.keyCode === RUN_KEY) {
				compile({ mode: 'run' });
			}
			else if(event.keyCode === COMPILE_KEY) {
				compile({ mode: 'compile' });
			}
		}
	});

	window.addEventListener('unload', function(e) {
		saveInput(input);
	});

	element('run').addEventListener('click',
			function(e) { compile({mode: 'run'}) });
	element('compile').addEventListener('click',
			function(e) { compile({mode: 'compile'}) });
	element('ast').addEventListener('click',
			function(e) { compile({mode: 'parse'}) });

	retrieveInput(input);

});
