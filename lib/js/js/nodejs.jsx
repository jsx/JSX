import "js.jsx";

native class console {
	// static function log(value : variant) : void;
	static function info(value : variant) : void;
	static function warn(value : variant) : void;
	static function error(value : variant) : void;
	static function dir(value : variant) : void;
	static function time(label : string) : void;
	static function timeEnd(label : string) : void;
	static function trace() : void;
	//static function assert(value : variant) : void;
}

native class process {
	static __readonly__ var stdin : variant; // FIXME
	static __readonly__ var stdout  : variant; // FIXME
	static __readonly__ var stderr : variant; // FIXME

	static __readonly__ var argv : string[];
	static __readonly__ var execPath : string;
	static __readonly__ var env : Map.<string>;
	static __readonly__ var pid : int;
	static __readonly__ var arch : string;
	static __readonly__ var platform : string;
	static __readonly__ var version : string;
	static __readonly__ var versions : Map.<string>;
	static __readonly__ var title : string; // process name

	// for "exit", and signals
	static function on(type : string, callback : function():void) : void;
	// for "uncaughtException"
	static function on(type : string, callback : function(:Error):void) : void;

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
