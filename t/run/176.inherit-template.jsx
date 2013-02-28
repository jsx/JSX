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
class _Main {
	static function main(args : string[]) : void {
		(new Derived.<number>).f();
	}
}
