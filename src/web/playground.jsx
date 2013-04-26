/***
 * The entry point module of JSX compiler on browsers,
 * deployed http://jsx.github.io/try-on-web
 */

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
import "js.jsx";
import "js/web.jsx";

import "./browser-platform.jsx";

import "../compiler.jsx";
import "../optimizer.jsx";
import "../jsemitter.jsx";
import "../completion.jsx";

native __fake__ class Cursor {
	var line : number;
	var ch : number;
}

native __fake__ class CodeMirror {
	function getValue() : string;
	function setValue(value : string) : void;
	function getCursor() : Cursor;
	function setCursor(line : number, ch : number) : void;
	function replaceSelection(s : string) : void;
	function setSelection(c : Cursor) : void;
	function setOption(option : string, value : variant) : void;
	static function fromTextArea(textArea : Element, options : variant) : CodeMirror;

	// addons: show-hint.js
	static function showHint(cm : CodeMirror, callback : (CodeMirror) -> variant) : void;
}

class _Main {
	static function main(args : string[]) : void {

		function getOptimizationLevel() : number {
			var items = dom.document.getElementsByName("optimization-level");
			for(var i = 0; i < items.length; ++i) {
				var item = items[i] as HTMLInputElement;
				if(item.checked) {
					return item.value as number;
				}
			}
			return 0;
		}

		function jsxComplete(cm : CodeMirror) : void {
			CodeMirror.showHint(cm, function (editor) {
				var cur = editor.getCursor();

				var completionRequest = new CompletionRequest(cur.line+1, cur.ch);

				var path = "<source>";
				var platform = new BrowserPlatform();
				platform.setFileContent(path, editor.getValue());

				var c = new Compiler(platform);
				var emitter = new JavaScriptEmitter(platform);
				c.setEmitter(emitter);
				c.setMode(Compiler.MODE_COMPLETE);
				c.addSourceFile(null, path, completionRequest);
				c.compile();

				var ret = {} : variant;

				var uniq = new Map.<boolean>;
				ret['list'] = completionRequest.getCandidates().map.<string>(function (item) {
					return (item["partialWord"] ?: item["word"]) as string;
				}).filter(function (item) {
					if (! uniq.hasOwnProperty(item)) {
						uniq[item] = true;
						return true;
					}
					else {
						return false;
					}
				});
				ret['from'] = { line: cur.line, ch: cur.ch };
				ret['to']   = { line: cur.line, ch: cur.ch };
				return ret;
			});
		}

		var list   = dom.id('source-list');

		var input  = dom.id('input') as HTMLTextAreaElement;

		var editor = CodeMirror.fromTextArea(input, {
			mode: "application/jsx",
			lineNumbers: true,
			lineWrapping: true,
			autofocus: true,

			extraKeys: {
				"Ctrl-Space": jsxComplete,
				"Ctrl-P":     jsxComplete,
				"." : function (editor : CodeMirror) : void {
					editor.replaceSelection(".");
					var cursor = editor.getCursor();
					editor.setSelection(cursor);
					jsxComplete(editor);
				},
				"'\u00A5'" /* yen mark */ : function (editor: CodeMirror) : void {
					editor.replaceSelection("\u005c"); // backslash
					var cursor = editor.getCursor();
					editor.setSelection(cursor);
				}
			}
		} : Map.<variant>);

		var output = CodeMirror.fromTextArea(dom.id("output"), {
			mode: "javascript",
			lineNumbers: true,
			lineWrapping: true,
			readOnly: true
		} : Map.<variant>);

		var console_log = js.global["console"]["log"];

		function compile(options : variant) : void {
			console.info('compile with ' + JSON.stringify(options));

			output.setValue("");
			var path = input.dataset["path"];

			var platform = new BrowserPlatform();
			platform.setFileContent(path, editor.getValue());

			var c = new Compiler(platform);
			var emitter = new JavaScriptEmitter(platform);
			c.setEmitter(emitter);

			var o = new Optimizer();

			if(getOptimizationLevel() > 0) {
				var optimizeCommands = Optimizer.getReleaseOptimizationCommands().filter((command) -> { return command != "no-log"; });
				o.setup(optimizeCommands);
				o.setEnableRunTimeTypeCheck(false);
				emitter.setEnableRunTimeTypeCheck(false);
			}
			c.setOptimizer(o);

			switch(options['mode'] as string) {
			case "run":
			case "compile":
				c.setMode(Compiler.MODE_COMPILE);
				break;
			case "parse":
				c.setMode(Compiler.MODE_PARSE);
				break;
			default:
				dom.window.alert("unknown mode: " + options['mode'] as string);
				return;
			}

			if (options['mode'] == "run") {
				js.global["console"]["log"] = function (arg : string) : void {
					output.setValue(output.getValue() + arg + "\n");
				};
			}
			else {
				js.global["console"]["log"] = console_log;
			}

			c.addSourceFile(null, path);

			var success = c.compile();

			if (success) {
				if (options['mode'] == 'parse') {
					output.setOption("mode", "javascript");
					output.setValue(JSON.stringify(c.getAST(), null, 2));
					return;
				}

				var out = emitter.getOutput().replace(/\t/g, "  ");
				out += "JSX.require('"+path+"')._Main.main$AS([]);\n";

				var level = getOptimizationLevel();
				if(level > 1 && options['mode'] != 'parse') {
					out = platform.applyClosureCompiler(out, level <= 2
						? "SIMPLE_OPTIMIZATIONS"
						: "ADVANCED_OPTIMIZATIONS", false);
				}

				if(options['mode'] == 'run') {
					output.setOption("mode", "");
					js.eval(out);
				}
				else {
					output.setOption("mode", "javascript");
					output.setValue(out);
				}
			}
			else if(platform.getErrors().length != 0){
				output.setOption("mode", "");
				output.setValue("ERROR!\n" + platform.getErrors().join(""));
			}
		}

		function saveInput(input : HTMLTextAreaElement) : void {
			var session = {
				inputPath:         input.dataset["path"],
				source:            editor.getValue(),
				cursor:            editor.getCursor(),
				optimizationLevel: getOptimizationLevel()
			} : Map.<variant>;
			dom.window.sessionStorage.setItem("jsx.session", JSON.stringify(session));
		}

		function retrieveInput(input : HTMLTextAreaElement) : void {
			var serializedSession = dom.window.sessionStorage.getItem("jsx.session");
			if(serializedSession) {
				console.info("retrieve from session");
				var session = JSON.parse(serializedSession);

				input.dataset["path"] = session['inputPath'] as string;
				editor.setValue(session['source'] as string);
				editor.setCursor(session['cursor']['line'] as number, session['cursor']['ch'] as number);

				var items = dom.document.getElementsByName("optimization-level");
				for(var i = 0; i < items.length; ++i) {
					var item = items[i] as HTMLInputElement;
					if(item.value == (session['optimizationLevel'] as string)) {
						item.checked = true;
					}
					else {
						item.checked = false;
					}
				}

				compile({ mode: 'run' });
			}
		}

		function forEach(collection : HTMLCollection, block : (Object) -> void) : void {
			for(var i = 0; i < collection.length; ++i) {
				block(collection[i]);
			}
		}

		// set up example souce files
		forEach(list.getElementsByTagName("li"), function(elem) {
			var li = elem as HTMLLIElement;
			if(li.className != "source-file") return;

			var a = li.children[0] as HTMLAnchorElement;
			a.addEventListener('click', function(event) {
				console.info('changing');
				event.preventDefault();
				event.stopPropagation();

				input.dataset["path"] = a.dataset["path"];

				var url = a.href;
				var xhr = new XMLHttpRequest();
				xhr.onreadystatechange = function(e) {
					if (xhr.readyState != 4) return;

					editor.setValue(xhr.responseText.replace(/\t/g, "  "));

					forEach(list.getElementsByTagName("li"), function(el) {
						var li = el as HTMLLIElement;
						if(!li.className.match(/\bsource-file\b/)) return;

						li.className = "source-file";
					});
					li.className = "source-file active";

					compile({ mode: "run" });
				};
				xhr.open("GET", url);
				xhr.send(null : Blob);
			});
		});

		dom.window.addEventListener('keyup', function(e) {
			var event = e as KeyboardEvent;
			if(event.ctrlKey) {
				event.preventDefault();
				event.stopPropagation();
				var RUN_KEY     = "R".charCodeAt(0);
				var COMPILE_KEY = "C".charCodeAt(0);

				if(event.keyCode == RUN_KEY) {
					compile({ mode: 'run' });
				}
				else if(event.keyCode == COMPILE_KEY) {
					compile({ mode: 'compile' });
				}
			}
		});

		dom.window.addEventListener('unload', function(e) {
			saveInput(input);
		});

		dom.id('run').addEventListener('click',
			function(e) { compile({mode: 'run'}); });
		dom.id('compile').addEventListener('click',
			function(e) { compile({mode: 'compile'}); });
		dom.id('ast').addEventListener('click',
			function(e) { compile({mode: 'parse'}); });

		retrieveInput(input);
	}
}
