/*EXPECTED
Hi
*/
class Base.<T> {
	function f() : void {
		log "Hi";
	}
}
class Derived.<T> extends Base.<T> {
}
class Test {
	static function run() : void {
		new Derived.<number>.f();
	}
}
