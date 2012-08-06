/*EXPECTED
hello
*/

class Test {
	static function f() : void {
		log "hello";
	}
	static function run() : void {
		var m = { a: Test.f };
		m["a"]();
	}
}
