// JSX front-end for browsers

import "js.jsx";
import "console.jsx";
import "js/web.jsx";
import "./browser-platform.jsx";
import "../../src/compiler.jsx";
import "../../src/optimizer.jsx";
import "../../src/jsemitter.jsx";
import "../../src/completion.jsx";

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
	static function simpleHint(cm : CodeMirror, callback : (CodeMirror) -> variant) : void;
	static function fromTextArea(textArea : Element, options : variant) : CodeMirror;
}

native __fake__ class sessionStorage {
	static function setItem(key : string, value : string) : void;
	static function getItem(key : string) : string;
	static function removeItem(key : string) : void;
	static function clear() : void;
}

class JsxWebFront {
	static function begin() : void {
		dom.window.addEventListener('load', function(e) {

			function element(id : string) : Element {
				return dom.document.getElementById(id);
			}

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
				CodeMirror.simpleHint(cm, function (editor) {
					var cur = editor.getCursor();

					var completionRequest = new CompletionRequest(cur.line+1, cur.ch);

					var path = "<source>";
					var platform = new BrowserPlatform(".");
					platform.setContent(path, editor.getValue());

					var c = new Compiler(platform);
					var emitter = new JavaScriptEmitter(platform);
					c.setEmitter(emitter);
					c.setMode(Compiler.MODE_COMPLETE);
					c.addSourceFile(null, path, completionRequest);
					c.compile();

					var ret = {} : variant;

					var uniq = new Map.<boolean>;
					ret['list'] = completionRequest.getCandidates().map.<Nullable.<string>>(function (item) {
						return item.partialWord?: item.word?: null;
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

			var list   = element('source-list');

			var input  = element('input') as HTMLTextAreaElement;

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

			var output = CodeMirror.fromTextArea(element("output"), {
				mode: "javascript",
				lineNumbers: true,
				lineWrapping: true,
				readOnly: true
			} : Map.<variant>);

			function compile(options : variant) : void {
				console.log('compile with ' + JSON.stringify(options));

				output.setValue("");
				var path = input.dataset["path"];

				var platform = new BrowserPlatform(".");
				platform.setContent(path, editor.getValue());

				var c = new Compiler(platform);
				var emitter = new JavaScriptEmitter(platform);
				c.setEmitter(emitter);

				var o = new Optimizer();

				if(getOptimizationLevel() > 0) {
					o.setup([ "lto", "no-assert", "fold-const", "return-if", "inline", "fold-const", "array-length" ]);
					emitter.setEnableRunTimeTypeCheck(false);
					o.setEnableRunTimeTypeCheck(false);
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

				c.addSourceFile(null, path);

				var success = c.compile();
				console.log(c);

				if (success) {
					output.setOption("mode", "javascript");

					if (options['mode'] == 'parse') {
						output.setValue(c.getAST() as string);
						return;
					}

					var out = emitter.getOutput("",null,null).replace(/\t/g, "  ");
					out += "JSX.require('"+path+"')._Main.main$AS([]);\n";

					var level = getOptimizationLevel();
					if(level > 0 && options['mode'] != 'parse') {
						out = platform.applyClosureCompiler(out, level == 1
							? "SIMPLE_OPTIMIZATIONS"
							: "ADVANCED_OPTIMIZATIONS", false);
					}

					output.setValue(out);

					if(options['mode'] == 'run') {
						console.log('run:');
						// the name must be eval
						var eval = js.global['eval'] as (string) -> variant;
						eval(output.getValue());
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
				sessionStorage.setItem("jsx.session", JSON.stringify(session));
			}

			function retrieveInput(input : HTMLTextAreaElement) : void {
				var serializedSession = sessionStorage.getItem("jsx.session");
				if(serializedSession) {
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

					compile({ mode: 'compile' });
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
					console.log('changing');
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
					xhr.send(null : Nullable.<string>);
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

			element('run').addEventListener('click',
				function(e) { compile({mode: 'run'}); });
			element('compile').addEventListener('click',
				function(e) { compile({mode: 'compile'}); });
			element('ast').addEventListener('click',
				function(e) { compile({mode: 'parse'}); });

			retrieveInput(input);

		});
	}
}
