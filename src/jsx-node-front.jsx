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
		return (path.charAt(0) == "/" || path.match(/^[a-zA-Z]:\//))
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
 * NodePlatform variation for compiler server
 */
class CompilationServerPlatform extends NodePlatform {
	// response contents
	var _stdout         = "";
	var _stderr         = "";
	var _file           = new Map.<string>;
	var _executableFile = new Map.<string>;
	var _statusCode     = 1; // 0=success, other=failure

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

	function getContents() : Map.<variant> {
		var content = {
			stdout         : this._stdout,
			stderr         : this._stderr,
			file           : this._file,
			executableFile : this._executableFile,

			statusCode : this._statusCode
		} : Map.<variant>;

		if (this._scriptSource != null) {
			content["run"] = {
				scriptFile   : this._scriptFile,
				scriptSource : this._scriptSource,
				scriptArgs   : this._scriptArgs
			} : variant;
		}
		return content;
	}

	override function makeFileExecutable(file : string, runEnv : string) : void {
		this._executableFile[file] = runEnv;
	}

	override function runCompilationServer(arg : variant) : number {
		this.error('--compilation-server is not supported');
		return 1;
	}
}

class CompilationServer {

	var _requestSequence = 0;

	// do not shutdown automatically
	static const AUTO_SHUTDOWN = ! process.env["JSX_NO_AUTO_SHUTDOWN"];
	// how long the server lives after the last requst
	static const LIFE = 10 * 60 * 1000;

	// for server status
	var _home : string;
	var _pidFile : string;
	var _portFile : string;

	var _platform = null : Platform;
	var _httpd = null : HTTPServer;
	var _timer = null : TimerHandle;

	function constructor(parentPlatform : Platform) {
		this._platform = parentPlatform;

		this._home = process.env["JSX_HOME"] ?: (process.env["HOME"] ?: process.env["USERPROFILE"]) + "/.jsx";
		if (! parentPlatform.fileExists(this._home)) {
			parentPlatform.mkpath(this._home);
		}
		this._pidFile  = this._home + "/pid";
		this._portFile = this._home + "/port";
	}

	static function start(platform : Platform, port : int) : number {
		var server = new CompilationServer(platform);

		server._httpd = node.http.createServer((request, response) -> {
			server.handleRequest(request, response);
		});
		server._httpd.listen(port);

		platform.save(server._pidFile,  process.pid as string);
		platform.save(server._portFile, port as string);

		console.info("%s [%s] listen http://localhost:%s/", (new Date).toISOString(), process.pid, port);
		server._timer = Timer.setTimeout(() -> { server.shutdown("timeout"); }, CompilationServer.LIFE);
		process.on("SIGTERM", () -> { server.shutdown("SIGTERM"); });
		process.on("SIGINT",  () -> { server.shutdown("SIGINT"); });

		// shutdown if the compiler has been updated
		if (CompilationServer.AUTO_SHUTDOWN) {
			node.fs.watch(node.__filename, { persistent: false } : Map.<variant>, (event, filename) -> {
				server.shutdown(event);
			});
		}

		return 0;
	}

	function shutdown(reason : string) : void {
		try {
			node.fs.unlinkSync(this._portFile);
		} catch (e : Error) { }
		try {
			node.fs.unlinkSync(this._pidFile);
		} catch (e : Error) { }

		Timer.clearTimeout(this._timer);
		this._httpd.close();
		console.info("%s [%s] shutdown by %s, handled %s requests", (new Date).toISOString(), process.pid, reason, this._requestSequence);
	}

	function handleRequest(request : ServerRequest, response : ServerResponse) : void {
		var startTime = new Date();
		var id = ++this._requestSequence;

		Timer.clearTimeout(this._timer); // reset
		this._timer = Timer.setTimeout(() -> { this.shutdown("timeout"); }, CompilationServer.LIFE);

		if (request.method == "GET") {
			console.info("%s #%s start %s", startTime.toISOString(), id, request.url);
			this.handleGET(id, startTime, request, response);
			return;
		}

		// POST: handle compilation request

		var c = new CompilationServerPlatform(this._platform.getRoot(), id, request, response);

		var matched = request.url.match(/\?(.*)/);
		if (!(matched && matched[1])) {
			c.error("invalid request to compilation server");
			this.finishRequest(id, startTime, response, 400, c.getContents());
			return;
		}

		var query = String.decodeURIComponent(matched[1]);
		console.info("%s #%s start %s", startTime.toISOString(), id, query.replace(/\n/g, "\\n"));

		var inputData = "";
		request.on("data", function (chunk) {
			inputData += chunk as string;
		});
		request.on("end", function () {
			if (inputData) {
				c.setFileContent("-", inputData); // as stdin
			}

			try {
				var args = JSON.parse(query) as string[];
				c.setStatusCode(JSXCommand.main(c, args));
			}
			catch (e : Error) {
				console.error("%s #%s %s", startTime.toISOString(), id, e.stack);
				c.error(e.stack);
			}

			this.finishRequest(id, startTime, response, 200, c.getContents());

		});
		request.on("close", function () {
			c.error("the connecion is unexpectedly closed.\n");
			this.finishRequest(id, startTime, response, 500, c.getContents());
		});
	}

	function handleGET(id : number, startTime : Date, request : ServerRequest, response : ServerResponse) : void {
		// show compiler information
		this.finishRequest(id, startTime, response, 200, {
			version_string   : Meta.VERSION_STRING,
			version_number   : Meta.VERSION_NUMBER,
			last_commit_hash : Meta.LAST_COMMIT_HASH,
			last_commit_date : Meta.LAST_COMMIT_DATE,
			status : true
		} : variant);
	}

	function finishRequest (id : number, startTime : Date, response : ServerResponse, statusCode : number, data : variant) : void {
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
		console.info("%s #%s finish, elapsed %s [ms]", now.toISOString(), id, elapsed);
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
