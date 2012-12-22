/***
 * NodeJS binding for JSX (EXPERIMENTAL)
 *
 * This module is experimental. Any API is subject to change.
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

final class node {
	delete function constructor () { }

	static function _eval(source : string) : variant {
		var eval = js.global['eval'] as (string) -> variant; // the name must be "eval"
		return eval(source);
	}

	static function require(source : string) : variant {
		var src = 'require(' + JSON.stringify(source) + ')';
		return node._eval(src);
	}

	static const __dirname     = node._eval("__dirname") as string;

	static const fs            = node.require('fs') as __noconvert__ _fs;
	static const path          = node.require('path') as __noconvert__ _path;
	static const child_process = node.require('child_process') as __noconvert__ _child_process;
	static const url           = node.require('url') as __noconvert__ _url;
	static const http          = node.require('http') as __noconvert__ _http;
	static const https         = node.require('https') as __noconvert__ _https;
	static const net           = node.require('net') as __noconvert__ _net;
}

native __fake__ class EventEmitter {
	function on(event : string, listener : function():void) : void;
	function on(event : string, listener : function(:variant):void) : void;
	function on(event : string, listener : function(:variant,:variant):void) : void;
}

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
	 *  exit:             (exitStatus:number)
	 *  uncaughtExceptio: (error:Error)
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

	static function memoryUsage() : Map.<int>;

	static function nextTick(callback : function():void) : void;

	static function umask(mask : int) : int;
	static function uptime() : int;
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

native class Stream extends EventEmitter {
	__readonly__ var fd : int;
	__readonly__ var isTTY : boolean;

	function write(str : string) : boolean;
	function write(buffer : Buffer) : boolean;

	function end() : void;
}

native class Buffer {
	static function byteLength(str : string, encoding : string) : int;

	__readonly__ var length : int;

	function constructor(size : int);
	function constructor(array : int[]);
	function constructor(str : string, encoding : string);

	function write(str : string, offset : int, length : int, encoding : string) : int;

	function slice(start : int , end : int) : Buffer;

	function toString(encoding : string) : string;
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
	function isSymbolickLink() : boolean;
	function isFIFO() : boolean;
	function isSocket() : boolean;
}

native __fake__ class _fs {
	function statSync(path : string) : Stats;

	function existsSync(path : string) : boolean;

	function mkdirSync(path : string) : void;
	function mkdirSync(path : string, mode : string) : void;

	function readdirSync(path : string) : string[];

	function unlinkSync(path : string) : void;

	function chmodSync(path : string, mode : string) : void;

	function readSync(fd : int, buffer : Buffer, offset : int, length : int) : int;
	function readSync(fd : int, buffer : Buffer, offset : int, length : int, position : int) : int;
	function readFileSync(filename : string) : string;

	function writeSync(fd : int, buffer : Buffer, offset : int, length : int, position : int) : int;
	function writeFileSync(filename : string, data : string) : void;

	function watch(filename : string, listener : function(event:string,filename:Nullable.<string>):void) : FSWatcher;
	function watch(filename : string, options : Map.<variant>, listener : function(event:string,filename:Nullable.<string>):void) : FSWatcher;
}

native __fake__ class FSWatcher extends EventEmitter {
	function close() : void;
}

native __fake__ class _path {
	function normalize(p : string) : string;
	function dirname(p : string) : string;
	function basename(p : string) : string;
}

native class ChildProcess extends EventEmitter {
	__readonly__ var stdin : Stream;
	__readonly__ var stdout : Stream;
	__readonly__ var stderr : Stream;
}

native __fake__ class _child_process {
	function spawn(command : string, args : string[]) : ChildProcess;
	function execFile(file : string, args : string[], options : variant, callback : (Error, Buffer, Buffer) -> void) : ChildProcess;
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
	) : Server;

	function get(url : string, callback : function(:ClientResponse):void) : ClientRequest;
}

native __fake__ class Server {
	function listen(port : int) : void;

	function close() : void;
}

native __fake__ class ServerRequest {
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
