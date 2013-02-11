/***
  The entry point module of JSX compiler on NodeJS
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
import "console.jsx";

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

	function constructor () {
		this(node.path.dirname(node.__dirname));
	}

	function constructor (root : string) {
		this._root = Util.resolvePath(root);
	}

	override function getRoot () : string {
		return this._root;
	}

	override function fileExists (name : string) : boolean {
		name = node.path.normalize(name);
		if (this.fileContent.hasOwnProperty(name)) {
			return true;
		}
		try {
			node.fs.statSync(name);
		} catch (e : Error) {
			return false;
		}
		return true;
	}

	override function getFilesInDirectory (path : string) : string[] {
		return node.fs.readdirSync(path);
	}

	override function load (name : string) : string {
		name = node.path.normalize(name);
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
			var content = node.fs.readFileSync(name, "utf-8");
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
			node.fs.mkdirSync(path);
		}
	}

	// called from JavaScriptEmitter
	override function addLauncher (emitter : Emitter, sourceFile : variant, targetCode : string, entryPoint : string, executableFor : string) : string {
		if(emitter instanceof JavaScriptEmitter) {
			targetCode += this.load(this.getRoot() + "/src/js/launcher.js");

			var args;
			switch (executableFor) {
				case "node":
					args = "process.argv.slice(2)";
					break;
				case "commonjs":
					args = "require('system').args.slice(1)";
					break;
				default:
					args = "[]";
					break;
			}
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
			throw new Error("FIXME: unknown emitter");
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

	override function runCompilationServer(arg : variant) : number {
		var port = arg as int;
		return CompilationServer.start(this, port);
	}
}

/**
 * NodePlatform variation for compiler service (daemon)
 */
class CompilationServerPlatform extends NodePlatform {
	// response contents
	var _stdout     = "";
	var _stderr     = "";
	var _file       = new Map.<string>;
	var _statusCode = 1; // failure

	var _scriptFile   = null : Nullable.<string>;   // file name on --run
	var _scriptSource = null : Nullable.<string>;   // source code on --run
	var _scriptArgs   = null : Nullable.<string[]>; // script args on --run

	// request parameters
	var _requestId = 0;
	var _request  = null : ServerRequest;
	var _response = null : ServerResponse;

	function constructor(root : string, reqId : number, req : ServerRequest, res : ServerResponse) {
		super(root);
		this._requestId = reqId;
		this._request   = req;
		this._response  = res;
	}

	override function save (outputFile : Nullable.<string>, content : string) : void {
		if (outputFile == null) {
			this._stdout += content;
		}
		else {
			this._file[outputFile] = content;
		}
	}

	override function log(message : string) : void {
		this._stdout += message + "\n";
	}
	override function warn(message : string) : void {
		this._stderr += message + "\n";
	}
	override function error(message : string) : void {
		this._stderr += message + "\n";
	}

	// does not execute it, just sets script contents instead
	override function execute(jsFile : Nullable.<string>, jsSource : string, jsArgs : string[]) : void {
		this._scriptFile   = jsFile;
		this._scriptSource = jsSource;
		this._scriptArgs   = jsArgs;
	}

	function setStatusCode(statusCode : number) : void {
		this._statusCode = statusCode;
	}

	function getContents() : variant {
		var run = null : variant;
		if (this._scriptSource != null) {
			run = {
				scriptFile   : this._scriptFile,
				scriptSource : this._scriptSource,
				scriptArgs   : this._scriptArgs
			} : variant;
		}
		return {
			stdout : this._stdout,
			stderr : this._stderr,
			file   : this._file,
			run    : run,

			statusCode : this._statusCode
		} : variant;
	}

	override function makeFileExecutable(file : string, runEnv : string) : void {
		// noop
	}
}

class CompilationServer {
	static var _requestSequence = 0;

	static function start(platform : Platform, port : int) : number {
		var httpd = node.http.createServer(function (request, response) {
			CompilationServer.handleRequest(platform, request, response);
		});
		httpd.listen(port);
		console.info("access http://localhost:" + port as string + "/");
		return 0;
	}

	static function handleRequest(platform : Platform, request : ServerRequest, response : ServerResponse) : void {
		var id = ++CompilationServer._requestSequence;
		var startTime = new Date();

		if (request.method == "GET") {
			console.info("%s #%s start %s", Util.formatDate(startTime), id, request.url);
			CompilationServer.handleGET(id, startTime, request, response);
			return;
		}

		var c = new CompilationServerPlatform(platform.getRoot(), id, request, response);

		// POST: do the same as jsx(1)

		// read POST body
		var inputData = "";
		request.on("data", function (chunk) {
			inputData += chunk as string;
		});
		request.on("end", function () {
			console.info("%s #%s start %s", Util.formatDate(startTime), id, inputData.replace(/\n/g, "\\n"));

			try {
				var args = JSON.parse(inputData) as string[];
				c.setStatusCode(JSXCommand.main(c, args));
			}
			catch (e : Error) {
				console.error("%s #%s %s", Util.formatDate(startTime), id, e);
				c.error((e as variant)["stack"] as string); // Error#stack
			}

			CompilationServer.finishRequest(id, startTime, response, 200, c.getContents());

		});
		request.on("close", function () {
			c.error("the connecion is unexpectedly closed.\n");
			CompilationServer.finishRequest(id, startTime, response, 500, c.getContents());
		});
	}

	static function handleGET(id : number, startTime : Date, request : ServerRequest, response : ServerResponse) : void {
		// show compiler information
		CompilationServer.finishRequest(id, startTime, response, 200, {
			version_string   : Meta.VERSION_STRING,
			version_number   : Meta.VERSION_NUMBER,
			last_commit_hash : Meta.LAST_COMMIT_HASH,
			last_commit_date : Meta.LAST_COMMIT_DATE,
			status : true
		} : variant);
	}

	static function finishRequest (id : number, startTime : Date, response : ServerResponse, statusCode : number, data : variant) : void {
		var content = JSON.stringify(data);

		var headers = {
			"Content-Type"   : "application/json",
			"Content-Length" : Buffer.byteLength(content, "utf-8") as string,
			"Cache-Control"  : "no-cache"
		};

		response.writeHead(statusCode, headers);
		response.end(content, "utf-8");

		var now     = new Date();
		var elapsed = now.getTime() - startTime.getTime();
		console.info("%s #%s finish, elapsed %s [ms]", Util.formatDate(now), id, elapsed);
	}
}


class _Main {

	static function main (args : string[]) : void {
		var exitCode = JSXCommand.main(new NodePlatform(), NodePlatform.getEnvOpts().concat(args));

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
