/*EXPECTED
foo
*/
class Base {
	var foo : string;
}
class Derived extends Base {
	function foo () : void {
		log "foo";
	}
}
class _Main {
	static function main (args : string[]) : void {
		(new Derived).foo();
	}
}