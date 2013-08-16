/*EXPECTED
A
*/
class A.<T> {
	override function toString() : string {
		return "A";
	}
}
class _Main {
	static function foo.<T>(a : A.<T>) : void {
		log a.toString();
	}
	static function main(args : string[]) : void {
		_Main.foo(new A.<variant>);
	}
}
