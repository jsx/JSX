/*EXPECTED
12
12
12
*/
class _Main {
	static function foo.<T>(f : (T) -> string, a : T) : void {
		log f(a);
	}
	static function bar.<T,U>(f : (T, U) -> string, a : T, b : U) : void {
		log f(a,b);
	}
	static function baz.<T,U>(f : (T) -> (U) -> string, a : T, b : U) : void {
		log f(a)(b);
	}
	static function main(args : string[]) : void {
		_Main.foo(function (a : number) : string { return a as string; }, 12);
		_Main.bar(function (a : number, b : string) : string { return a + b; }, 1, "2");
		_Main.baz(function (a : number) : (string) -> string { return function (b : string) : string { return a + b; }; }, 1, "2");
	}
}
