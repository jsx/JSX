/*EXPECTED
1
A
hello
*/
class A {
	override function toString() : string {
		return "A";
	}
}
class _Main {
	static function foo.<T>(x : T, a : number) : void {
		log a;
	}
	static function bar.<T>(x : T, a : A) : void {
		log a.toString();
	}
	static function baz.<T>(x : T, a : () -> string) : void {
		log a();
	}
	static function main(args : string[]) : void {
		var v = 0;	// dummy, but any kind of type should be ok
		_Main.foo(v, 1);
		_Main.bar(v, new A);
		_Main.baz(v, function () { return "hello"; });
	}
}
