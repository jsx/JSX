class Test {
	static function f(v : int) : void {
	}
	static function f(v : Array.<int>) : void {
	}
	static function run() :void {
		Test.f("abc");
	}
}
