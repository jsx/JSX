/*EXPECTED
foo
*/
interface I.<T> {
	function f() : T;
}

class C implements I.<string> {
	override function f() : string {
		return "foo";
	}
}

class _Main {
	static function main(args : string[]) : void {
		var i : I.<string> = new C();
		log i.f();
	}
}
