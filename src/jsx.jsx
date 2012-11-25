/***
  The Front-End of bin/jsx
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

import "js.jsx";
import "js/nodejs.jsx";

import "./util.jsx";
import "./emitter.jsx";
import "./jsemitter.jsx";
import "./platform.jsx";
import "./jsx-command.jsx";

class NodePlatform extends Platform {

	var _root : string;

	function constructor () {
		var root = node.path.dirname(node.__dirname);
		this._root = root.replace(/\\/g, "/");
	}

	override function getRoot () : string {
		return this._root;
	}

	override function fileExists (name : string) : boolean {
		name = node.path.normalize(name);
		if (this.virtualFile.hasOwnProperty(name)) {
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

	override function load (name : string) : string {
		name = node.path.normalize(name);
		if (this.virtualFile.hasOwnProperty(name)) {
			return this.virtualFile[name];
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

	override function makeFileExecutable(file : string, runEnv : string) : void {
		if (runEnv == "node") {
			node.fs.chmodSync(file, "0755");
		}
	}

	override function execute(scriptFile : Nullable.<string>, jsSource : string, args : string[]) : void {
		var tmpdir = (process.env["TMPDIR"] ?: process.env["TMP"]) ?: "/tmp";
		var jsFile = Util.format("%1/%2.%3.%4.js", [
			tmpdir,
			node.path.basename(scriptFile ?: "-"),
			process.pid.toString(),
			Date.now().toString(16)
		]);
		node.fs.writeFileSync(jsFile, jsSource);
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
}
class _Main {

	static function getEnvOpts () : string[] {
		var opts = process.env["JSX_OPTS"];
		if (! opts)
			return new string[];
		return opts.split(/\s+/);
	}

	static function main (args : string[]) : void {
		var exitCode = JSXCommand.main(new NodePlatform(), _Main.getEnvOpts().concat(args));

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
