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

import "../src/compiler.jsx";
import "../src/completion.jsx";
import "../src/doc.jsx";
import "../src/platform.jsx";
import "../src/jsemitter.jsx";
import "../src/optimizer.jsx";
import "../src/util.jsx";
import "../src/emitter.jsx";

import "console.jsx";
import "js.jsx";
import "js/nodejs.jsx";

class NodePlatform extends Platform {

	var _root : string;
	var _virtualFile : variant;

	function constructor () {
		var eval = js.global['eval'] as (string) -> variant;
		node.fs = eval('require("fs")') as __noconvert__ FS;
		node.path = eval('require("path")') as __noconvert__ Path;
		node.child_process = eval('require("child_process")') as __noconvert__ child_process;
		node.__dirname = eval("__dirname") as string;

		var root = node.path.dirname(node.__dirname);
		this._root = root.replace(/\\/g, "/");
		this._virtualFile = new Object;
	}

	override function getRoot () : string {
		return this._root;
	}

	override function fileExists (name : string) : boolean {
		name = node.path.normalize(name);
		if (this._virtualFile[name] != null) {
			return true;
		}
		try {
			node.fs.statSync(name);
			return true;
		} catch (e : Error) {
			return false;
		}
		return false;	// dummy
	}

	override function getFilesInDirectory (path : string) : string[] {
		return node.fs.readdirSync(path);
	}

	function setFileContent (name : string, content : string) : void {
		this._virtualFile[name] = content;
	}

	override function load (name : string) : string {
		name = node.path.normalize(name);
		if (this._virtualFile[name] != null) {
			return this._virtualFile[name] as string;
		}
		else if (name == "-") {
			var fd = process.stdin.fd;

			var content = "";
			var BUFFER_SIZE = 4096;
			var buffer = new Buffer(BUFFER_SIZE);
			var n;

			while( (n = node.fs.readSync(fd, buffer, 0, BUFFER_SIZE)) > 0) {
				content += buffer.slice(0, n).toString();
			}
			return content;
		}
		else {
			return node.fs.readFileSync(name).toString();
		}
	}

	override function save (outputFile : Nullable.<string>, content : string) : void {
		if (outputFile == null) {
			process.stdout.write(content);
		}
		else {
			node.fs.writeFileSync(outputFile, content);
		}
	}

	override function mkpath (path : string) : void {
		try {
			node.fs.statSync(path);
		} catch (e : Error) {
			var dirOfPath = path.replace(new RegExp("/[^/]*$"), "");
			if (dirOfPath != path) {
				this.mkpath(dirOfPath);
			}
			node.fs.mkdir(path);
		}
	}

	// called from JavaScriptEmitter
	override function addLauncher (emitter : Emitter, sourceFile : variant, targetCode : string, entryPoint : string, executableFor : string) : string {
		if(emitter instanceof JavaScriptEmitter) {
			targetCode += this.load(this.getRoot() + "/src/js/launcher.js");

			var args = (executableFor == "node" ? "process.argv.slice(2)" : "[]");
			switch(entryPoint) {
			case "_Main":
				var launcher = "runMain";
				break;
			case "_Test":
				launcher = "runTests";
				break;
			default:
				throw new Error("Unknown entry point type: " +
								entryPoint);
			}
			var callEntryPoint = Util.format("JSX.%1(%2, %3)",
					[launcher, JSON.stringify(sourceFile), args]);

			if (executableFor == "web") {
				callEntryPoint = this.wrapOnLoad(callEntryPoint);
			}

			return targetCode + callEntryPoint + "\n";
		}
		else {
			throw new Error("FIXME");
		}
	}

	function wrapOnLoad (code : string) : string {
		var wrapper = this.load(this.getRoot() + "/src/js/web-launcher.js");
		return wrapper.replace(/\/\/--CODE--\/\//, code);
	}

}

class _JSX {

	static var _meta = null : variant;

	static function meta (name : string) : variant {
		if (_JSX._meta == null) {
			var j = node.fs.readFileSync( node.__dirname + "/../package.json" );
			_JSX._meta = JSON.parse(j);
		}
		return _JSX._meta[name];
	}

	static function execNodeJS (scriptFile : string, script : string, args : string[]) : void {
		var tmpdir = (process.env["TMPDIR"] ?: process.env["TMP"]) ?: "/tmp";
		var jsFile = Util.format("%1/%2.%3.%4.js", [
			tmpdir,
			node.path.basename(scriptFile ?: "-"),
			process.pid.toString(),
			Date.now().toString(16)
		]);
		node.fs.writeFileSync(jsFile, script);
		process.on("exit", function(stream) {
			node.fs.unlinkSync(jsFile);
		});

		if (process.env["JSX_RUNJS"]) {
			var child = node.child_process.spawn(process.env["JSX_RUNJS"], [jsFile].concat(args));
			child.stdin.end();
			child.stdout.on("data", function (data) {
				process.stdout.write(data);
			});
			child.stderr.on("data", function (data) {
				process.stderr.write(data);
			});
		}
		else {
			process.argv = [process.argv[0], jsFile].concat(args);
			var eval = js.global['eval'] as (string) -> variant;
			eval('require("'+jsFile+'")'); // evaluate it in this process
		}
	}

	static function printHelp () : void {
		console.log(
			"JSX compiler version " + _JSX.meta("version") as string + "\n" +
			"\n" +
			"Usage: jsx [options] source-files\n" +
			"\n" +
			"Options:\n" +
			"  --add-search-path path     add a path to library search paths\n" +
			"  --executable (node|web)    add launcher to call _Main.main(:string[]):void\n" +
			"  --run                      runs _Main.main(:string[]):void after compiling\n" +
			"  --test                     runs _Test#test*():void after compiling\n" +
			"  --output file              output file (default:stdout)\n" +
			"  --input-filename file      names input filename\n" +
			"  --mode (compile|parse|doc) compilation mode (default:compile)\n" +
			"  --target (javascript|c++)  target language (default:javascript)\n" +
			"  --release                  omits the debugging features from the generated code (run-time type checking, logging, assertion)\n" +
			"  --profile                  enables the profiler (experimental)\n" +
			"  --optimize cmd1,cmd2,...   list of optimize commands (no-assert, no-log, inline, return-if)\n" +
			"  --warn type1,type2,...     list types of warnings (all, deprecated, none)\n" +
			"  --enable-type-check        enables run-time type checking\n" +
			"  --enable-source-map        enables source map debugging info\n" +
			"  --version                  displays the version and exits\n" +
			"  --help                     displays this help and exits\n" +
			"");
	}

	static function main (args : string[]) : number {

		var platform = new NodePlatform();

		var argIndex = 0;
		var getopt = function () : Nullable.<string> {
			if (args.length <= argIndex)
				return null;
			var arg = args[argIndex++];
			if (arg == "--")
				return null;
			if (arg.match(/^-/))
				return arg;
			else {
				--argIndex;
				return null;
			}
		};
		var getoptarg = function () : Nullable.<string> {
			if (args.length <= argIndex) {
				console.error("option " + args[argIndex - 1] + " requires a value");
				return null;
			}
			return args[argIndex++];
		};

		var compiler = new Compiler(platform);

		var tasks = new Array.<() -> void>;

		var optimizer = null : Optimizer;
		var completionRequest = null : CompletionRequest;
		var emitter = null : Emitter;
		var outputFile = null : Nullable.<string>;
		var inputFilename = null : Nullable.<string>;
		var executable = null : Nullable.<string>;
		var run = null : Nullable.<string>;
		var runImmediately = false;
		var optimizeCommands = new string[];
		var opt, optarg;
		while ((opt = getopt()) != null) {
		NEXTOPT:
			switch (opt) {
			case "--add-search-path":
				if((optarg= getoptarg()) == null) {
					return 1;
				}
				compiler.addSearchPath(optarg);
				break;
			case "--output":
				if((outputFile = getoptarg()) == null) {
					return 1;
				}
				break;
			case "--input-filename":
				if((inputFilename = getoptarg()) == null) {
					return 1;
				}
				break;
			case "--mode":
				if ((optarg = getoptarg()) == null) {
					return 1;
				}
				switch (optarg) {
				case "compile":
					compiler.setMode(Compiler.MODE_COMPILE);
					break;
				case "parse":
					compiler.setMode(Compiler.MODE_PARSE);
					break;
				case "doc":
					compiler.setMode(Compiler.MODE_DOC);
					break;
				default:
					console.error("unknown mode: " + optarg);
					return 1;
				}
				break;
			case "--complete":
				if ((optarg = getoptarg()) == null) {
					return 1;
				}
				completionRequest = function () : CompletionRequest {
					var a = optarg.split(/:/);
					return new CompletionRequest((a[0] as number), (a[1] as number) - 1);
				}();
				compiler.setMode(Compiler.MODE_COMPLETE);
				break;
			case "--target":
				if ((optarg = getoptarg()) == null) {
					return 1;
				}
				switch (optarg) {
				case "javascript":
					emitter = new JavaScriptEmitter(platform);
					break;
				case "c++":
					throw new Error("FIXME");
				default:
					console.error("unknown target: " + optarg);
					return 1;
				}
				break;
			case "--release":
				tasks.push(function () : void {
					emitter.setEnableRunTimeTypeCheck(false);
					optimizer.setEnableRunTimeTypeCheck(false);
				});
				optimizeCommands = [ "lto", "no-assert", "no-log", "fold-const", "return-if", "inline", "dce", "unbox", "fold-const", "lcse", "dce", "fold-const", "array-length", "unclassify" ];
				break;
			case "--optimize":
				if ((optarg = getoptarg()) == null) {
					return 1;
				}
				optimizeCommands = optarg.split(",");
				break;
			case "--warn":
				if ((optarg = getoptarg()) == null) {
					return 1;
				}
				optarg.split(",").forEach(function (type) {
					switch (type) {
					case "none":
						compiler.getWarningFilters().unshift(function (warning : CompileWarning) : Nullable.<boolean> {
							return false;
						});
						break;
					case "all":
						compiler.getWarningFilters().unshift(function (warning : CompileWarning) : Nullable.<boolean> {
							return true;
						});
						break;
					case "deprecated":
						compiler.getWarningFilters().unshift(function (warning : CompileWarning) : Nullable.<boolean> {
							if (warning instanceof DeprecatedWarning) {
								return true;
							}
							return null;
						});
						break;
					default:
						console.error("unknown warning type: " + type);
					}
				});
				break;
			case "--executable":
				if ((optarg = getoptarg()) == null) {
					return 1;
				}
				switch (optarg) {
				case "web": // JavaScriptEmitter
					break;
				case "node": // implies JavaScriptEmitter
					tasks.push(function () : void {
						var shebang =  "#!" + process.execPath + "\n";
						emitter.addHeader(shebang);
					});
					break;
				default:
					console.error("unknown executable type (node|web)");
					return 1;
				}
				executable = optarg;
				run = "_Main";
				break;
			case "--run":
				run = "_Main";
				executable = "node";
				runImmediately = true;
				break;
			case "--test":
				run = "_Test";
				executable = "node";
				runImmediately = true;
				break;
			case "--profile":
				tasks.push(function () : void {
					emitter.setEnableProfiler(true);
				});
				break;
			case "--version":
				console.log(_JSX.meta("version"));
				return 0;
			case "--help":
				_JSX.printHelp();
				return 0;
			default:
				var switchOpt = opt.match(new RegExp("^--(enable|disable)-(.*)$"));
				if (switchOpt != null) {
					var mode = switchOpt[1] == "enable";
					switch (switchOpt[2]) {
					case "type-check":
						tasks.push(function (mode : boolean) : () -> void {
							return function () {
								emitter.setEnableRunTimeTypeCheck(mode);
								optimizer.setEnableRunTimeTypeCheck(mode);
							};
						}(mode));
						break NEXTOPT;
					case "source-map":
						tasks.push(function (mode : boolean) : () -> void {
							return function () {
								emitter.setEnableSourceMap(mode);
							};
						}(mode));
						break NEXTOPT;
					default:
						break;
					}
				}
				console.error("unknown option: " + opt);
				return 1;
			}
		}

		if (argIndex == args.length) {
			console.error("no files");
			return 1;
		}

		var sourceFile = args[argIndex++];
		if (inputFilename != null) {
			platform.setFileContent(inputFilename, platform.load(sourceFile));
			sourceFile = inputFilename;
		}
		compiler.addSourceFile(null, sourceFile, completionRequest);

		switch (compiler.getMode()) {
		case Compiler.MODE_PARSE:
			if (compiler.compile()) {
				platform.save(outputFile, compiler.getAST() as string);
				return 0;
			} else {
				return 1;
			}
		}

		if (emitter == null)
			emitter = new JavaScriptEmitter(platform);
		compiler.setEmitter(emitter);

		switch (compiler.getMode()) {
		case Compiler.MODE_DOC:
			if (outputFile == null) {
				console.error("--output is mandatory for --mode doc");
				return 1;
			}
			if (compiler.compile()) {
				new DocumentGenerator(compiler)
					.setOutputPath(outputFile)
					.setPathFilter(function (sourcePath) {
						return ! (sourcePath.match(/^(?:system:|\/)/) || sourcePath.match(/\/..\//));
					})
					.setTemplatePath(platform.getRoot() + "/src/doc/template.html")
					.buildDoc();
				return 0;
			} else {
				return 1;
			}
		}

		optimizer = new Optimizer();
		var err = optimizer.setup(optimizeCommands);
		if (err != null) {
			console.error(err);
			return 0;
		}

		tasks.forEach(function(proc) { proc(); });

		emitter.setOutputFile(outputFile);

		compiler.setOptimizer(optimizer);

		var result = compiler.compile();

		if (completionRequest != null) {
			console.log(JSON.stringify(completionRequest.getCandidates()));
			return 0;
		}

		if (! result)
			return 1;

		var output = emitter.getOutput(sourceFile, run, executable);

		if (emitter instanceof JavaScriptEmitter) {
			if (! runImmediately) { // compile and save

				platform.save(outputFile, output);
				if (outputFile != null) {
					emitter.saveSourceMappingFile(platform);

					if (executable == "node") {
						node.fs.chmodSync(outputFile, "0755");
					}
				}

			}
			else { // compile and run immediately
				_JSX.execNodeJS(sourceFile, output, args.slice(argIndex));
			}
		}
		else {
			throw new Error("FIXME: C++ emitter");
		}
		return 0;
	}

}

class _Main {

	static function getEnvOpts () : string[] {
		var opts = process.env["JSX_OPTS"];
		if (! opts)
			return new string[];
		return opts.split(/\s+/);
	}

	static function main (args : string[]) : void {
		var exitCode = _JSX.main(_Main.getEnvOpts().concat(process.argv.slice(2)));

		// NOTE:
		// nodejs 0.8.0 on Windows doesn't flush stdout buffer before exitting.
		// use "drain" event for workaround
		// https://groups.google.com/forum/#!msg/nodejs/qXkr1C2c8vs/567P_mVZacsJ
		if (exitCode == 0) {
			return;
		}

		var stdoutIsFlushed = process.stdout.write("");
		var stderrIsFlushed = process.stderr.write("");

		var exitIfFlushed = function (data : Buffer) : void {
			if (stdoutIsFlushed && stderrIsFlushed) {
				process.exit(exitCode);
			}
		};

		if (! stdoutIsFlushed) {
			process.stdout.on('drain', exitIfFlushed);
		}
		if (! stderrIsFlushed) {
			process.stderr.on('drain', exitIfFlushed);
		}

		exitIfFlushed(null);
	}

}

// vim: set noexpandtab:
