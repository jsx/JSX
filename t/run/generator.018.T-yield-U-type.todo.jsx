/*JSX_OPTS
--enable-generator-emulation
*/
/*EXPECTED
0
1
2
*/
class _Main {

	// you can use T yield U syntax anywhere type declaration may appear
	static function foo (init : int) : int yield string {

		function * foo (n : int) : int yield string {
			while (true) {
				n = yield (n as string);
			}
		}

		return foo(init);

	}

	static function main (args : string[]) : void {

		// `T yield U` type declaration is a sugar for Generator.<U,T>
		var gen1 : int yield string;
		var gen2 : Generator.<int,string>;

		gen1 = _Main.foo(0);
		gen2 = gen1;
		log gen2.next(1).value;
		log gen2.next(2).value;
		log gen2.next(3).value;

	}
}
