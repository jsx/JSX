/*EXPECTED
1
2
*/
class _Main {
	static function foo.<T>(a : T) : T {
		return a;
	}
	static function main(args : string[]) : void {
		log _Main.foo(1);
		log _Main.foo("2");
	}
}
