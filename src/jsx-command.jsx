/***
 * Platform-independent JSX compiler command
 */

/*
 * Copyright (c) 2012,2013 DeNA Co., Ltd. et al.
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

import "./meta.jsx";
import "./compiler.jsx";
import "./completion.jsx";
import "./doc.jsx";
import "./platform.jsx";
import "./emitter.jsx";
import "./jsemitter.jsx";
import "./optimizer.jsx";
import "./analysis.jsx";
import "./instruments.jsx";

class JSXCommand {

	static function help() : string {
		return (
			"JSX compiler version " + Meta.VERSION_STRING + "\n" +
			"\n" +
			"Usage: jsx [options] source-file\n" +
			"\n" +
			"Options:\n" +
			"  --add-search-path path     adds a path to library search paths\n" +
			"  --executable RUNENV        adds launcher to call _Main.main(:string[]):void\n" +
			"                             supported RUNENV is node, commonjs and web.\n" +
			"  --run                      runs _Main.main(:string[]):void after compiling\n" +
			"  --test                     runs _Test#test*():void after compiling\n" +
			"  --define name=var          defines compile-time constant as a property of JSX.ENV\n" +
			"  --output file              output file (default:stdout)\n" +
			"  --input-filename file      specifies the root path for searching imports (used when the source-file is \"-\" (stdin))\n" +
			"  --mode (compile|parse|doc) specifies compilation mode (default:compile)\n" +
			"  --target (javascript|c++)  specifies target language (default:javascript)\n" +
			"  --release                  disables run-time type checking and enables optimizations (" + Optimizer.getReleaseOptimizationCommands().join(",")  + ")\n" +
			"  --profile                  enables the profiler (experimental)\n" +
			"  --optimize cmd1,cmd2,...   enables optimization commands\n" +
			"  --warn type1,type2,...     enables warnings (all, unused, experimental, deprecated, none)\n" +
			"  --disable-type-check       disables run-time type checking\n" +
			"  --minify                   compresses the target JavaScript code\n" +
			"  --enable-source-map        enables source map debugging info\n" +
			"  --complete line:column     shows code completion at line:column\n" +
			"  --version                  displays the version and compiler identifier and exits\n" +
			"  --version-number           displays the version as number and exits\n" +
			"  --help                     displays this help and exits\n" +
			"\n" +
			"Env:\n" +
			"  JSX_OPTS   options of jsx(1)\n" +
			"  JSX_RUNJS  JavaScript engine used by --run and --test\n" +
			"");
	}

	static function main (platform : Platform, args : string[]) : number {
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
				platform.error("option " + args[argIndex - 1] + " requires a value");
				return null;
			}
			return args[argIndex++];
		};

		var compiler = new Compiler(platform);

		var tasks = new Array.<() -> void>;

		var optimizer : Optimizer = null;
		var completionRequest : CompletionRequest = null;
		var emitter : Emitter = null;
		var outputFile : Nullable.<string> = null;
		var inputFilename : Nullable.<string> = null;
		var executable : Nullable.<string> = null;
		var setBootstrapMode = function (sourceFile : string) : void {};
		var runImmediately = false;
		var optimizeCommands = new string[];
		var transformCommands = new string[];
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
			case "--working-dir": // working directory
				if((optarg = getoptarg()) == null) {
					return 1;
				}
				platform.setWorkingDir(optarg);
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
					platform.error("unknown mode: " + optarg);
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
			case "--define":
				if ((optarg = getoptarg()) == null) {
					return 1;
				}
				var a = optarg.split(/=/, 2);
				if (a.length != 2) {
					platform.error("invalid environment variable (not defined as name=var): " + optarg);
					return 1;
				}
				compiler.getUserEnvironment()[a[0]] = a[1];
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
					platform.error("unknown target: " + optarg);
					return 1;
				}
				break;
			case "--release":
				tasks.push(function () : void {
					emitter.setEnableRunTimeTypeCheck(false);
					optimizer.setEnableRunTimeTypeCheck(false);
				});
				optimizeCommands = Optimizer.getReleaseOptimizationCommands();
				break;
			case "--optimize":
				if ((optarg = getoptarg()) == null) {
					return 1;
				}
				optarg.split(",").forEach((command) -> {
					if (command == "release") {
						optimizeCommands = Optimizer.getReleaseOptimizationCommands();
					} else if (command.charAt(0) == "-") {
						command = command.slice(1);
						optimizeCommands = optimizeCommands.filter((item) -> {
							return command != item;
						});
					} else {
						optimizeCommands.push(command);
					}
				});
				break;
			case "--transform":
				if ((optarg = getoptarg()) == null) {
					return 1;
				}
				optarg.split(",").forEach((command) -> {
					transformCommands.push(command);
				});
				break;
			case "--disable-optimize":
				if ((optarg = getoptarg()) == null) {
					return 1;
				}
				optimizeCommands = optimizeCommands.filter((item) -> {
					return optarg.split(",").indexOf(item) == -1;
				});
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
					case "unused":
						compiler.getWarningFilters().unshift(function (warning : CompileWarning) : Nullable.<boolean> {
							if (warning instanceof UnusedWarning) {
								return true;
							}
							return null;
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
					case "experimental":
						compiler.getWarningFilters().unshift(function (warning : CompileWarning) : Nullable.<boolean> {
							if (warning instanceof ExperimentalWarning) {
								return true;
							}
							return null;
						});
						break;
					default:
						platform.error("unknown warning type: " + type);
					}
				});
				break;
			case "--warn-error":
				compiler.setWarningAsError(true);
				break;
			case "--executable":
				if ((optarg = getoptarg()) == null) {
					return 1;
				}
				switch (optarg) {
				case "web": // implies JavaScriptEmitter
					break;
				case "commonjs": // implies JavaScriptEmitter
					break;
				case "node": // implies JavaScriptEmitter
					break;
				default:
					platform.error("unknown executable type (node|web)");
					return 1;
				}
				setBootstrapMode = function (sourceFile) {
					(emitter as JavaScriptEmitter).setBootstrapMode(JavaScriptEmitter.BOOTSTRAP_EXECUTABLE, sourceFile, executable);
				};
				executable = optarg;
				break;
			case "--run":
				setBootstrapMode = function (sourceFile) {
					(emitter as JavaScriptEmitter).setBootstrapMode(JavaScriptEmitter.BOOTSTRAP_EXECUTABLE, sourceFile, executable);
				};
				executable = executable ?: "node";
				runImmediately = true;
				break;
			case "--test":
				setBootstrapMode = function (sourceFile) {
					(emitter as JavaScriptEmitter).setBootstrapMode(JavaScriptEmitter.BOOTSTRAP_TEST, sourceFile, executable);
				};
				executable = executable ?: "node";
				runImmediately = true;
				break;
			case "--profile":
				tasks.push(function () : void {
					emitter.setEnableProfiler(true);
				});
				break;
			case "--minify":
				tasks.push(function () {
					emitter.setEnableMinifier(true);
					if (optimizeCommands.length != 0 && optimizeCommands[0] != "strip")
						optimizeCommands.unshift("strip");
					if (optimizeCommands[optimizeCommands.length - 1] != "strip")
						optimizeCommands.push("strip");
				});
				break;
			case "--version":
				platform.log(Meta.IDENTIFIER);
				return 0;
			case "--version-number":
				platform.log(Meta.VERSION_NUMBER as string);
				return 0;
			case "--help":
				platform.log(JSXCommand.help());
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
					case "generator-emulation":
						if (mode) {
							transformCommands.push("generator");
						} else {
							transformCommands = transformCommands.filter((cmd) -> {
								return cmd != "generator";
							});
						}
						break NEXTOPT;
					case "cps-transform":
						if (mode) {
							transformCommands.push("cps");
						} else {
							transformCommands = transformCommands.filter((cmd) -> {
								return cmd != "cps";
							});
						}
						break NEXTOPT;
					default:
						break;
					}
				}
				platform.error("unknown option: " + opt);
				return 1;
			}
		}

		if (argIndex == args.length) {
			platform.error("no files");
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
				platform.save(outputFile, JSON.stringify(compiler.getAST()));
				return 0;
			} else {
				return 1;
			}
		}

		if (emitter == null)
			emitter = new JavaScriptEmitter(platform);
		emitter.setRunEnv(executable != null ? executable : "");
		emitter.setOutputFile(outputFile);

		setBootstrapMode(sourceFile);

		compiler.setEmitter(emitter);

		switch (compiler.getMode()) {
		case Compiler.MODE_DOC:
			if (outputFile == null) {
				platform.error("--output is mandatory for --mode doc");
				return 1;
			}
			if (compiler.compile()) {
				new DocumentGenerator(compiler, platform.getRoot() + "/etc/doc-template", outputFile)
					.setResourceFiles(["style.css"])
					.setPathFilter(function (sourcePath) {
						if (sourcePath.indexOf("system:") == 0) {
							return false;
						}
						if (sourcePath.charAt(0) == "/") {
							return false;
						}
						if (sourcePath.indexOf("../") == 0) {
							return false;
						}
						if (sourcePath.indexOf("/../") != -1) {
							return false;
						}
						return true;
					})
					.buildDoc();
				return 0;
			} else {
				return 1;
			}
		}

		optimizer = new Optimizer();

		tasks.forEach(function(proc) { proc(); });

		if (emitter.getEnableMinifier() && emitter.getEnableSourceMap()) {
			platform.error("--minify and --source-map cannot be specified at the same time");
			return 1;
		}

		var err = compiler.setTransformCommands(transformCommands);
		if (err != null) {
			platform.error(err);
			return 1;
		}

		err = optimizer.setup(optimizeCommands);
		if (err != null) {
			platform.error(err);
			return 1;
		}

		compiler.setOptimizer(optimizer);

		var result = compiler.compile();

		if (completionRequest != null) {
			platform.save(null, JSON.stringify(completionRequest.getCandidates()));
			return 0;
		}

		if (! result)
			return 65; // compile error (EX_DATAERR of FreeBSD sysexits(3))

		var output = emitter.getOutput();

		if (emitter instanceof JavaScriptEmitter) {
			if (! runImmediately || outputFile != null) { // compile and save

				platform.save(outputFile, output);
				if (outputFile != null) {
					var map = emitter.getSourceMappingFiles();
					for (var filename in map) {
						platform.save(filename, map[filename]);
					}
					if (executable != null) {
						platform.makeFileExecutable(outputFile, executable);
					}
				}

			}
			else { // compile and run immediately
				platform.execute(sourceFile, output, args.slice(argIndex));
			}
		}
		else {
			throw new Error("FIXME: C++ emitter");
		}
		return 0;
	}

}


// vim: set noexpandtab:
