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

class Test {
	static function run() : void {
		var i : I.<string> = new C();
		log i.f();
	}
}
