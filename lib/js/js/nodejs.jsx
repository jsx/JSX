/***
 * NodeJS binding for JSX (EXPERIMENTAL)
 *
 * This module is experimental. Any API is subject to change.
 *
 * @see http://nodejs.org/api/
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

final class node {
	delete function constructor ();

	static function require(source : string) : variant {
		var src = 'require(' + JSON.stringify(source) + ')';
		return js.eval(src);
	}

	static const __dirname     = js.eval("__dirname") as string;
	static const __filename    = js.eval("__filename") as string;

	static const fs            = node.require('fs') as __noconvert__ _fs;
	static const path          = node.require('path') as __noconvert__ _path;
	static const child_process = node.require('child_process') as __noconvert__ _child_process;
	static const url           = node.require('url') as __noconvert__ _url;
	static const http          = node.require('http') as __noconvert__ _http;
	static const https         = node.require('https') as __noconvert__ _https;
	static const net           = node.require('net') as __noconvert__ _net;
	static const util          = node.require('util') as __noconvert__ _util;
}

native __fake__ class EventEmitter {
	function on(event : string, listener : function():void) : void;
	function on(event : string, listener : function(:variant):void) : void;
	function on(event : string, listener : function(:variant,:variant):void) : void;
}

/**
 * @see http://nodejs.org/api/process.html
 */
native class process {
	static var argv : string[];

	static __readonly__ var stdin  : Stream;
	static __readonly__ var stdout : Stream;
	static __readonly__ var stderr : Stream;

	static __readonly__ var execPath : string;
	static __readonly__ var env : Map.<string>;
	static __readonly__ var pid : int;
	static __readonly__ var arch : string;
	static __readonly__ var platform : string;
	static __readonly__ var version : string;
	static __readonly__ var versions : Map.<string>;
	static __readonly__ var title : string; // process name

	/*
	 * events:
	 *  drain:             (data:Buffer)
	 *  exit:              (exitStatus:number)
	 *  uncaughtException: (error:Error)
	 */
	static function on(event : string, listener : () -> void) : void;
	static function on(event : string, listener : (variant) -> void) : void;

	static function chdir(directory : string) : void;
	static function cwd() : string;
	static function exit() : void;
	static function exit(status : int) : void;

	static function getgid() : int;
	static function setgid(id : int) : void;
	static function getuid() : int;
	static function setuid(id : int) : void;

	static function kill(pid : int) : void;
	static function kill(pid : int, signal : string) : void;

	static function memoryUsage() : _MemoryUsage;

	static function nextTick(callback : function():void) : void;

	static function umask(mask : int) : int;
	static function uptime() : int;

	/**
	 * Returns the current high-resolution real time.
	 * @return [seconds, nanoseconds]
	 */
	static function hrtime() : number[];
	/**
	 * Returns the difference from previousTime in high-resolution real time.
	 *
	 * @param previousTime a result of a previous call to <code>process.hrtime()</code>.
	 * @return [seconds, nanoseconds]
	 */
	static function hrtime(previousTime : number[]) : number[];
}

native class os {
	static function tmpDir() : string;
	static function hostname() : string;
	static function type() : string;
	static function platform() : string;
	static function arch() : string;
	static function release() : string;
	static function uptime() : number;
	static function loadavg() : number[];
	static function totalmem() : number;
	static function freemem() : number;
	static function cpus() : _CPUInfo[];
	static function networkInterfaces() : Map.<_IFInfo[]>;
	static __readonly__ var EOL : string;
}

native __fake__ class _CPUInfo {
	__readonly__ var model : string;
	__readonly__ var speed : number;
	__readonly__ var times : _TimesInfo[];
}

native __fake__ class _MemoryUsage {
	__readonly__ var rss : number;
	__readonly__ var heapTotal : number;
	__readonly__ var heapUsed : number;
}

native __fake__ class _TimesInfo {
	__readonly__ var user : number;
	__readonly__ var nice : number;
	__readonly__ var sys  : number;
	__readonly__ var idle : number;
	__readonly__ var irq  : number;
}

native class _IFInfo {
	__readonly__ var address  : string;
	__readonly__ var family   : string;
	__readonly__ var internal : boolean;
}

native class module {
	static __readonly__ var id : string;
	static __readonly__ var paths : string[];
}

native class Stream extends EventEmitter {
	__readonly__ var fd : int;
	__readonly__ var isTTY : boolean;

	function write(str : string) : boolean;
	function write(buffer : Buffer) : boolean;

	function end() : void;
}

/**
 * Fixed-sized binary buffer, built in NodeJS.
 */
native class Buffer {
	static function byteLength(str : string, encoding : string) : number;
	static function concat(list : Buffer[]) : Buffer;
	static function concat(list : Buffer[], totalLength : number) : Buffer;

	__readonly__ var length : number;

	function constructor(size : number);
	function constructor(array : int[]);
	function constructor(array : number[]);
	function constructor(array : Uint8Array);
	function constructor(str : string, encoding : string);

	function write(str : string, offset : number, length : number, encoding : string) : number;

	function toString(encoding : string) : string;
	function toString(encoding : string, start : number) : string;
	function toString(encoding : string, start : number, end : number) : string;

	function copy(targetBuffer : Buffer) : void;
	function copy(targetBuffer : Buffer, targetStart : number) : void;
	function copy(targetBuffer : Buffer, targetStart : number, sourceStart : number) : void;
	function copy(targetBuffer : Buffer, targetStart : number, sourceStart : number, sourceEnd : number) : void;

	function slice(start : number) : Buffer;
	function slice(start : number , end : number) : Buffer;

	function readUInt8(offset : number) : number;
	function readUInt16LE(offset : number) : number;
	function readUInt16BE(offset : number) : number;
	function readUInt32LE(offset : number) : number;
	function readUInt32BE(offset : number) : number;
	function readInt8(offset : number) : number;
	function readInt16LE(offset : number) : number;
	function readInt16BE(offset : number) : number;
	function readInt32LE(offset : number) : number;
	function readInt32BE(offset : number) : number;
	function readFloatLE(offset : number) : number;
	function readFloatBE(offset : number) : number;
	function readDoubleLE(offset : number) : number;
	function readDoubleBE(offset : number) : number;

	function writeUInt8(value : number, offset : number) : void;
	function writeUInt16LE(value : number, offset : number) : void;
	function writeUInt16BE(value : number, offset : number) : void;
	function writeUInt32LE(value : number, offset : number) : void;
	function writeUInt32BE(value : number, offset : number) : void;
	function writeInt8(value : number, offset : number) : void;
	function writeInt16LE(value : number, offset : number) : void;
	function writeInt16BE(value : number, offset : number) : void;
	function writeInt32LE(value : number, offset : number) : void;
	function writeInt32BE(value : number, offset : number) : void;
	function writeFloatLE(value : number, offset : number) : void;
	function writeFloatBE(value : number, offset : number) : void;
	function writeDoubleLE(value : number, offset : number) : void;
	function writeDoubleBE(value : number, offset : number) : void;

	function fill(value : number) : void;
	function fill(value : number, offset : number) : void;
	function fill(value : number, offset : number, end : number) : void;
}

native class querystring {
	static function stringify(params : Map.<variant>) : string;
	static function stringify(params : Map.<variant>, sep : string) : string;
	static function stringify(params : Map.<variant>, sep : string, eq : string) : string;

	static function parse(query : string) : Map.<variant>;
	static function parse(query : string, sep : string) : Map.<variant>;
	static function parse(query : string, sep : string, eq : string) : Map.<variant>;
	static function parse(query : string, sep : string, eq : string, options : Map.<variant> /* maxKeys = 1000 */) : Map.<variant>;
}

native __fake__ class Stats {
	function isFile() : boolean;
	function isDirectory() : boolean;
	function isBlockDevice() : boolean;
	function isCharacterDevice() : boolean;
	function isSymbolicLink() : boolean;
	function isFIFO() : boolean;
	function isSocket() : boolean;
}

/**
 * @see http://nodejs.org/api/fs.html
 */
native __fake__ class _fs {
	function statSync(path : string) : Stats;

	function existsSync(path : string) : boolean;

	function mkdirSync(path : string) : void;
	function mkdirSync(path : string, mode : string) : void;

	function readdirSync(path : string) : string[];

	function unlinkSync(path : string) : void;

	function chmodSync(path : string, mode : string) : void;

	function openSync(path : string, flags : string) : int;
	function openSync(path : string, flags : string, mode : int) : int;
	function closeSync(fd : int) : void;

	function readSync(fd : int, buffer : Buffer, offset : int, length : int) : int;
	function readSync(fd : int, buffer : Buffer, offset : int, length : int, position : int) : int;
	function readFileSync(filename : string) : Buffer;
	function readFileSync(filename : string, encoding : string) : string;

	function writeSync(fd : int, buffer : Buffer, offset : int, length : int) : int;
	function writeSync(fd : int, buffer : Buffer, offset : int, length : int, position : int) : int;
	function writeFileSync(filename : string, data : Buffer) : void;
	function writeFileSync(filename : string, data : string) : void;
	function writeFileSync(filename : string, data : string, encoding : string) : void;

	function appendFileSync(filename : string, data : Buffer) : void;
	function appendFileSync(filename : string, data : string) : void;
	function appendFileSync(filename : string, data : string, encoding : string) : void;

	function watch(filename : string, listener : function(event:string,filename:Nullable.<string>):void) : FSWatcher;
	function watch(filename : string, options : Map.<variant>, listener : function(event:string,filename:Nullable.<string>):void) : FSWatcher;
}

native __fake__ class FSWatcher extends EventEmitter {
	function close() : void;
}

native __fake__ class _path {
	function normalize(p : string) : string;
	function join(...path : string) : string;
	function resolve(...path : string) : string;
	function relative(from : string, to : string) : string;
	function dirname(p : string) : string;
	function basename(p : string) : string;
	function basename(p : string, ext : string) : string;
	function extname(p : string) : string;
	var sep : string;
}

/*
 * @see http://nodejs.org/api/child_process.html
 */
native class ChildProcess extends EventEmitter {
	__readonly__ var stdin : Stream;
	__readonly__ var stdout : Stream;
	__readonly__ var stderr : Stream;

	__readonly__ var pid : int;

	delete function constructor();

	function kill() : boolean;
	function kill(signal : string) : boolean;
}

/*
 * @see http://nodejs.org/api/child_process.html
 */
native __fake__ class _child_process {
	/**
	 * <p>Launches a new process with the given <code>command</code>,
	 * with command line arguments in <code>args</code>.</p>
	 *
	 * <p>options:</p>
	 * <ul>
	 *   <li>cwd : string</li>
	 *   <li>stdio : variant[] where each index corresponds to a fd in the child with values "pipe", "ic", "ignore", Stream object, positive int, null</li>
	 *   <li>env : Map.<string></li>
	 *   <li>detached : boolean</li>
	 *   <li>uid : int</li>
	 *   <li>gid : int</li>
	 * </ul>
	 */
	function spawn(command : string, args : string[], options : Map.<variant>) : ChildProcess;
	function spawn(command : string, args : string[]) : ChildProcess;

	/**
	 * <p>Runs a command in a shell and bufferes the output.</p>
	 *
	 * <p>options:</p>
	 * <ul>
	 *   <li>cwd : string</li>
	 *   <li>stdio : variant[] where each index corresponds to a fd in the child with values "pipe", "ic", "ignore", Stream object, positive int, null</li>
	 *   <li>env : Map.<string></li>
	 *   <li>encoding : string (default: "utf8")</li>
	 *   <li>timeout : int (default: 0 [ms])</li>
	 *   <li>maxBuffer : int (default: 200*1024)</li>
	 *   <li>killSignal : string (default: "SIGTERM")</li>
	 * </ul>
	 */
	function exec(command : string, options : Map.<variant>, callback : (Error, Buffer, Buffer) -> void) : ChildProcess;
	function exec(command : string, callback : (Error, Buffer, Buffer) -> void) : ChildProcess;

	/**
	 * <p>Similar to <code>exec()</code> exept it does not execute a subshell
	 * but rather the specified file directly. It has the same options as <code>exec().</code></p>
	 *
	 * <p>options:</p>
	 * <ul>
	 *   <li>cwd : string</li>
	 *   <li>stdio : variant[] where each index corresponds to a fd in the child with values "pipe", "ic", "ignore", Stream object, positive int, null</li>
	 *   <li>env : Map.<string></li>
	 *   <li>encoding : string (default: "utf8")</li>
	 *   <li>timeout : int (default: 0 [ms])</li>
	 *   <li>maxBuffer : int (default: 200*1024)</li>
	 *   <li>killSignal : string (default: "SIGTERM")</li>
	 * </ul>
	 */
	function execFile(file : string, args : string[], options : Map.<variant>, callback : (Error, Buffer, Buffer) -> void) : ChildProcess;
	function execFile(file : string, args : string[], callback : (Error, Buffer, Buffer) -> void) : ChildProcess;

	//function fork(modulePath : string, args : string[], options : Map.<variant>) : ChildProcess; // NodeJS specific
}

native __fake__ class _url {
	function parse(urlStr : string) : Url;
	function format(url : Url) : string;
	function format(urlStr : string) : string;

	function resolve(source : Url,    relative : Url)    : string;
	function resolve(source : Url,    relative : string) : string;
	function resolve(source : string, relative : Url)    : string;
	function resolve(source : string, relative : string) : string;
}

native __fake__ class Url {
	var protocol : Nullable.<string>;
	var slashes  : Nullable.<boolean>;
	var auth     : Nullable.<string>;
	var host     : Nullable.<string>;
	var port     : Nullable.<string>;
	var hostname : Nullable.<string>;
	var hash     : Nullable.<string>;
	var search   : Nullable.<string>;
	var query    : Nullable.<string>;
	var pathname : Nullable.<string>;
	var path     : Nullable.<string>;

	//function format() : string;
	//function resolve(relative : string) : Url;
	//function resolve(relative : Url) : Url;
}

native __fake__ class _http {
	function createServer(
		requestListener : function(:ServerRequest,:ServerResponse):void
	) : HTTPServer;

	function get(url : string, callback : function(:ClientResponse):void) : ClientRequest;
}

native __fake__ class HTTPServer {
	function listen(port : int) : void;

	function close() : void;
}

native __fake__ class ServerRequest extends EventEmitter {
	__readonly__ var method          : string;
	__readonly__ var url             : string;
	__readonly__ var headers         : Map.<string>;
	__readonly__ var trailers        : Map.<string>;
	__readonly__ var httpVersin      : string;
	__readonly__ var httpVersinMajor : int;
	__readonly__ var httpVersinMinor : int;

	function setEncoding(encoding : string) : void;
}

native __fake__ class ServerResponse {
	function writeHead(status : int, headers : Map.<string>) : void;
	function writeHead(status : int, responsePhrase : string, headers : Map.<string>) : void;
	function write(content : string, encoding : string) : boolean;
	function write(content : Buffer) : boolean;
	function end() : boolean;
	function end(data : string, encoding : string) : boolean;
	function end(data : Buffer) : boolean;
}

native __fake__ class ClientRequest extends EventEmitter {
}
native __fake__ class ClientResponse extends EventEmitter {
	__readonly__ var statusCode      : int;
	__readonly__ var headers         : Map.<string>;
	__readonly__ var trailers        : Map.<string>;
	__readonly__ var httpVersin      : string;
	__readonly__ var httpVersinMajor : int;
	__readonly__ var httpVersinMinor : int;
}

native __fake__ class _https {
	// TODO
}

native __fake__ class _net {
	// TODO
}

native __fake__ class _util {
	function debug(str : string) : void;
	function puts(...args : variant) : void;
	function print(...args : variant) : void;
	function log(str : string) : void;
	function inspect(object : variant) : string;
	function inspect(object : variant, options : variant) : string;
}
