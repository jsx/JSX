/*JSX_OPTS
--enable-generator-emulation
*/
/*EXPECTED
[ '1', '2', '3' ]
*/
class _Main {

	static function main (args : string[]) : void {

		function * foo (n : int) : Generator.<int,string[]> {
			while (true) {
				n = yield (n as string).split("");
			}
		}

		// `int yield string[]` should be parsed like `(int) yield (string[])`

		var a : int yield string[] = foo(123);

		log a.next().value;

	}
}
