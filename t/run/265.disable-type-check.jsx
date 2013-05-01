/*EXPECTED
A
*/
/*JSX_OPTS
--disable-type-check
*/

class A {
  override function toString() : string {
		return "A";
	}
}
class B {
	override function toString() : string {
		return "B";
	}
}

class _Main {
	static function main(args : string[]) : void {
		var o : Object = new A;
		log (o as B).toString();
	}
}
