/*EXPECTED
ok
*/

class Test {
	static var foo = 10;
	static var bar = Test.foo as int;

	static function run() : void {
		log "ok";
	}
}
