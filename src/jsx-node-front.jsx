/***
  The entry point module of JSX compiler on NodeJS
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

import "js.jsx";
import "js/nodejs.jsx";
import "console.jsx";
import "timer.jsx";

import "./util.jsx";
import "./emitter.jsx";
import "./jsemitter.jsx";
import "./platform.jsx";
import "./jsx-command.jsx";
import "./meta.jsx";

/**
 * Access to platform via NodeJS API
 */
class NodePlatform extends Platform {

	var _root : string;
	var _cwd = Util.resolvePath(process.cwd());

	function constructor () {
		this(node.path.dirname(node.__dirname));
	}

	function constructor (root : string) {
		this._root = Util.resolvePath(root);
	}

	override function getRoot () : string {
		return this._root;
	}

	function _absPath(path : string) : string {
		return (path.charAt(0) == "/" || path.match(/^[a-zA-Z]:[\/\\]/))
			? path // path is already absolute
			: this._cwd + "/" + path;
	}

	override function fileExists (name : string) : boolean {
		name = Util.resolvePath(name);
		if (this.fileContent.hasOwnProperty(name)) {
			return true;
		}
		return node.fs.existsSync(this._absPath(name));
	}

	override function getFilesInDirectory (path : string) : string[] {
		return node.fs.readdirSync(this._absPath(path));
	}

	override function load (name : string) : string {
		name = Util.resolvePath(name);
		if (this.fileContent.hasOwnProperty(name)) {
			return this.fileContent[name];
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
			var content = node.fs.readFileSync(this._absPath(name), "utf-8");
			// cache the content without condition because the platform object
			// is created for each compilation for now.
			this.fileContent[name] = content;
			return content;
		}
	}

	override function save (outputFile : Nullable.<string>, content : string) : void {
		if (outputFile == null) {
			process.stdout.write(content);
		}
		else {
			outputFile = this._absPath(outputFile);
			this.mkpath(Util.dirname(outputFile));
			node.fs.writeFileSync(outputFile, content);
		}
	}

	override function setWorkingDir (dir : string) : void {
		this._cwd = this._absPath(dir);
	}

	override function mkpath (path : string) : void {
		path = this._absPath(path);
		if (! node.fs.existsSync(path)) {
			var dirOfPath = Util.dirname(path);
			if (dirOfPath != path) {
				this.mkpath(dirOfPath);
			}
			node.fs.mkdirSync(path);
		}
	}

	override function makeFileExecutable(file : string, runEnv : string) : void {
		if (runEnv == "node") {
			var filePath = this._absPath(file);
			var contents = node.fs.readFileSync(filePath, "utf-8");
			contents = "#!/usr/bin/env node\n" + contents;
			node.fs.writeFileSync(filePath, contents);
			node.fs.chmodSync(this._absPath(file), "0755");
		}
	}

	override function execute(scriptFile : Nullable.<string>, jsSource : string, args : string[]) : void {
		// to refer module_modules, the temporary dirctory must be in the project directory
		var jsFile = this._absPath(Util.format(".jsx.%1.%2.%3.js", [
			node.path.basename(scriptFile ?: "-"),
			process.pid.toString(),
			Date.now().toString(16)
		]));
		node.fs.writeFileSync(jsFile, jsSource);
		process.on("exit", function(stream) {
			node.fs.unlinkSync(jsFile);
		});

		if (process.env["JSX_RUNJS"]) {
			// JSX_RUNJS may contain "cmd args", and thus we need to split it, but should we better shell-unescape it?
			var argv = process.env["JSX_RUNJS"].split(/\s+/).concat([jsFile]).concat(args);
			var child = node.child_process.spawn(argv.shift(), argv);
			child.stdin.end();
			child.stdout.on("data", function (data) {
				process.stdout.write(data as string);
			});
			child.stderr.on("data", function (data) {
				process.stderr.write(data as string);
			});
		}
		else {
			process.argv = [process.argv[0], jsFile].concat(args);
			node.require(jsFile); // evaluates it in this process
		}
	}

	static function getEnvOpts () : string[] {
		var opts = process.env["JSX_OPTS"];
		if (! opts)
			return new string[];
		return opts.split(/\s+/);
	}

	static const COLOR_BLACK  = 30;
	static const COLOR_RED    = 31;
	static const COLOR_GREEN  = 32;
	static const COLOR_YELLOW = 33;
	static const COLOR_BLUE   = 34;

	static const _isColorSupported = (() : boolean -> {
		if (process.stdout.isTTY && process.stderr.isTTY) {
			var term = (process.env["TERM"] ?: "").toLowerCase();
			return /color/.test(term) || /xterm/.test(term);
		}
		return false;
	}());

	function colorize(colorId : number, message : string) : string {
		if (NodePlatform._isColorSupported) {
			return "\x1b[" + colorId as string + "m" + message + "\x1b[0m";
		}
		else {
			return message;
		}
	}

	override function error(message : string) : void {
		console.error(this.colorize(NodePlatform.COLOR_RED, message));
	}
	override function warn(message : string) : void {
		console.warn(this.colorize(NodePlatform.COLOR_YELLOW, message));
	}
}

class _Main {

	static function main (args : string[]) : void {
		var exitCode = JSXCommand.main(new NodePlatform(), NodePlatform.getEnvOpts().concat(args));

		if (JSX.profilerIsRunning()) {
			Timer.setTimeout(() -> {
				JSX.postProfileResults("http://localhost:2012/post-profile", (err, result) -> {});
			}, 0);
		}

		// NOTE:
		// nodejs 0.8.0 on Windows doesn't flush stdout buffer before exitting.
		// use "drain" event for workaround
		// https://groups.google.com/forum/#!msg/nodejs/qXkr1C2c8vs/567P_mVZacsJ
		if (exitCode == 0) {
			return;
		}

		var stdoutIsFlushed = process.stdout.write("");
		var stderrIsFlushed = process.stderr.write("");

		var exitIfFlushed = function (data : variant) : void {
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
