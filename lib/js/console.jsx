/**

Console API available both in browsers and nodejs

*/

// See also:
// https://developers.google.com/chrome-developer-tools/docs/console
// http://nodejs.org/api/stdio.html
// http://msdn.microsoft.com/en-us/library/ie/hh772183(v=vs.85).aspx
// http://getfirebug.com/wiki/index.php/Console_API

final native class console {
	static function log(value : variant) : void;
	static function info(value : variant) : void;
	static function warn(value : variant) : void;
	static function error(value : variant) : void;
	static function dir(value : variant) : void;
	static function time(label : string) : void;
	static function timeEnd(label : string) : void;
	static function trace() : void;
}

