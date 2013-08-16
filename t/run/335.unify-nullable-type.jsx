/*EXPECTED
1
2
*/
class _Main {
	static function foo.<T>(a : Nullable.<T>) : T {
		return a;
	}
	static function main(args : string[]) : void {
		var a : Nullable.<number> = 1;
		log _Main.foo(a);

		var b : Nullable.<string> = "2";
		log _Main.foo(b);
	}
}
