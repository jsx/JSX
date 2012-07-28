/*EXPECTED
ok
ok
*/

class Test {
	static const foo = "ok";

	static const bar = (function() : string {
		return Test.foo;
	}());

	static function run() : void {
		log Test.foo;
		log Test.bar;
	}
}
