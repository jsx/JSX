/*EXPECTED
10
10
*/

class Test {
	static var foo = 10;
	static var bar = foo as int;

	static function run() : void {
		log Test.foo;
		log Test.bar;
	}
}
