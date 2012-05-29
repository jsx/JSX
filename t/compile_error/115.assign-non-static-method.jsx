class Test {
	function f() : void {
	}
	static function g() : void {
		var f = new Test().f; // should generate compile error
	}
}
