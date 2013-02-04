class _Main {
	static function f(x : Array.<number>) : void {}
	static function f(x : Array.<string>) : void {}
	static function g(x : Map.<number>) : void {}
	static function g(x : Map.<string>) : void {}
	static function main(args : string[]) : void {
		_Main.f([]);
		_Main.g({});
	}
}