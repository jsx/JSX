
// common in both browsers and nodejs
final native class console {
	// static function log(value : variant) : void;
	static function info(value : variant) : void;
	static function warn(value : variant) : void;
	static function error(value : variant) : void;
	static function dir(value : variant) : void;
	static function time(label : string) : void;
	static function timeEnd(label : string) : void;
	static function trace() : void;
}

