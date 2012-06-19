class Base {
	function f() : number {
		return 1;
	}
}

class Derived extends Base {
	override function f() : string {
		return "abc";
	}
}
