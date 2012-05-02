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

	function applyClosureCompiler(sourceText, level) {
		var URL = 'http://closure-compiler.appspot.com/compile';
		var xhr = new XMLHttpRequest();
		xhr.open("POST", URL, false);
		xhr.setRequestHeader("Content-Type",
							 "application/x-www-form-urlencoded");

		var param = {
			js_code: sourceText,
			formatting: "pretty_print",
			compilation_level: level,
			output_format: "text",
			output_info: "compiled_code"
		};
		var params = [];
		for(var key in param) {
			params.push(encodeURIComponent(key) +
						"=" +
						encodeURIComponent(param[key]));
		}
		xhr.send(params.join("&"));
		return xhr.responseText;
	}

	var errors = [];
	var BrowserPlatform = jsx.Platform.extend({
		load: function (name) {
			var src = element(name);
			if(src != null) {
				return src.value;
			}

			// synchronous XHR
			var xhr = new XMLHttpRequest();
			xhr.open("GET", name, false);
			xhr.send(null);
			return xhr.responseText;
		},

		getRoot: function () {
			return "";
		},

		error: function (s) {
			console.error(s);
			errors.push(s);
		}
	});
	var platform = new BrowserPlatform();

	var list   = element('source-list');

	var input  = element('input');
	var output = element('output');

	function saveInput(input) {
			var s = input.selectionStart;
		var session = {
			source:         input.value,
			selectionStart: input.selectionStart,
			selectionEnd:   input.selectionEnd,
			optimizationLevel: getOptimizationLevel()
		};
		sessionStorage.setItem("jsx.session", JSON.stringify(session));
	}

	function retrieveInput(input) {
		var serializedSession = sessionStorage.getItem("jsx.session");
		if(serializedSession) {
			var session = JSON.parse(serializedSession);

			input.value = session.source;
			input.setSelectionRange(session.selectionStart,
									session.selectionEnd);

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

		output.value = '';

		var c = new jsx.Compiler(platform);
		var emitter = new jsx.JavaScriptEmitter(platform);
		c.setEmitter(emitter);

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

		c.addSourceFile(null, 'input');

		var success = c.compile();
		console.log(c);

		if (success) {
			output.style.color = "black";

			if (options.mode === 'parse') {
				output.value = c.getAST();
				return;
			}

			var out = emitter.getOutput().replace(/\t/g, "  ");
			out += "Test.run$();\n";

			var level = getOptimizationLevel();
			if(level > 0 && options.mode !== 'parse') {
				out = applyClosureCompiler(out, level === 1
										 ? "SIMPLE_OPTIMIZATIONS"
										 : "ADVANCED_OPTIMIZATIONS");
			}

			output.value = out;

			if(options.mode === 'run') {
				console.log('run:');
				var f = new Function(output.value);
				f();
			}
		}
		else if(errors.length !== 0){
			output.style.color = "red";
			output.value = "ERROR!\n" + errors.join("");
			errors.length = 0;
		}
	}

	function forEach(collection, block) {
		for(var i = 0; i < collection.length; ++i) {
			block(collection[i]);
		}
	}

	// set up example souce files
	forEach(list.children, function(li) {
		if(li.className !== "source-file") return;

		var a = li.children[0];
		a.addEventListener('click', function(event) {
			event.preventDefault();

			var url = a.href;
			var xhr = new XMLHttpRequest();
			xhr.addEventListener("load", function(e) {
				input.value = xhr.responseText.replace(/\t/g, "  ");

				forEach(list.children, function(li) {
					li.className = "";
				});
				li.className = "active";

				setTimeout(function() {
					compile({ mode: "compile" });
				}, 0);
			});
			xhr.open("GET", url);
			xhr.send(null);
		});
	});

	function inputStr(event, input, str) {
		event.stopPropagation();
		event.preventDefault();

		var s = input.selectionStart;
		var c = input.value;

		input.value = c.substring(0, s) +
					  str +
					  c.substring(s, c.length);
		s += str.length;
		input.setSelectionRange(s, s);
	}

	// hack to input 2 spaces by the tab key
	input.addEventListener('keydown', function(event) {
		if(event.keyCode === "\t".charCodeAt(0)) {
			inputStr(event, input, "  ");
		}
		else if(event.keyCode === "\r".charCodeAt(0)) {
			// auto indent
			var s = input.value.substring(0, input.selectionStart);
			var lastLine = s.split(/^/m).pop();
			var indent = lastLine.match(/^[ \t]*/)[0];
			inputStr(event, input, "\n" + indent);
		}
		else if(event.keyIdentifier === "U+00A5" /* yen mark */) {
			inputStr(event, input, "\u005C" /* backslash */);
		}
	});

	window.addEventListener('keyup', function(event) {
		if(event.ctrlKey) {
			var RUN_KEY     = "R".charCodeAt(0);
			var COMPILE_KEY = "C".charCodeAt(0);
			var PARSE_KEY   = "P".charCodeAt(0);;

			if(event.keyCode === RUN_KEY) {
				compile({ mode: 'run' });
			}
			else if(event.keyCode === COMPILE_KEY) {
				compile({ mode: 'compile' });
			}
			else if(event.keyCode === PARSE_KEY) {
				compile({ mode: 'parse' });
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
	element('parse').addEventListener('click',
			function(e) { compile({mode: 'parse'}) });

	retrieveInput(input);

	input.focus();
});
