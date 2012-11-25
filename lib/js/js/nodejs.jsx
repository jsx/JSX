import "js.jsx";

final class node {
	delete function constructor () { }

	static function _eval(source : string) : variant {
		var eval = js.global['eval'] as (string) -> variant; // the name must be "eval"
		return eval(source);
	}


	static var fs            = node._eval('require("fs")') as __noconvert__ _fs;
	static var path          = node._eval('require("path")') as __noconvert__ _path;
	static var child_process = node._eval('require("child_process")') as __noconvert__ _child_process;
	static var __dirname     = node._eval("__dirname") as string;
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

	// on() cannot be type safe. any idea?
	static function on(event : string, listener : (Stream) -> void) : void;

	// for "exit", and signals
	//static function on(type : string, callback : function():void) : void;
	// for "uncaughtException"
	//static function on(type : string, callback : function(:Error):void) : void;

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

native class Stream {
	__readonly__ var fd : int;
	__readonly__ var isTTY : boolean;

	function write(str : string) : boolean;
	function write(buffer : Buffer) : boolean;

	function end() : void;

	// Actually this should be declared in EventEmitter class
	function on(event : string, listener : (Buffer) -> void) : void;
}

native class Buffer {
	__readonly__ var length : int;

	function constructor(size : int);

	function slice(start : int , end : int) : Buffer;
}

native __fake__ class Stats {
}

native __fake__ class _fs {
	function statSync(path : string) : Stats;

	function mkdir(path : string) : void;

	function readdirSync(path : string) : string[];

	function unlinkSync(path : string) : void;

	function chmodSync(path : string, mode : string) : void;

	function readSync(fd : int, buffer : Buffer, offset : int, length : int) : int;
	function readSync(fd : int, buffer : Buffer, offset : int, length : int, position : int) : int;
	function readFileSync(filename : string) : string;

	function writeSync(fd : int, buffer : Buffer, offset : int, length : int, position : int) : int;
	function writeFileSync(filename : string, data : string) : void;
}

native __fake__ class _path {
	function normalize(p : string) : string;
	function dirname(p : string) : string;
	function basename(p : string) : string;
}

native class ChildProcess {
	__readonly__ var stdin : Stream;
	__readonly__ var stdout : Stream;
	__readonly__ var stderr : Stream;
}

native __fake__ class _child_process {
	function spawn(command : string, args : string[]) : ChildProcess;
	function execFile(file : string, args : string[], options : variant, callback : (Error, Buffer, Buffer) -> void) : ChildProcess;
}

