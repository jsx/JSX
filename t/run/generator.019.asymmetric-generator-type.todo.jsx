/*JSX_OPTS
--enable-generator-emulation
*/
/*EXPECTED
0
1
2
*/
class _Main {
	static function main (args : string[]) : void {

		// Instead of `Generator.<void,T>`, you can write `Generator.<T>`.
		function * foo () : Generator.<int> {
			var c = 0;
			while (true)
				yield c++; // type of yield expression is void
		}

		var gen : Generator.<int> = foo();

		log gen.next().value; // you are not allowed to pass arguments into generator
		log gen.next().value;
		log gen.next().value;
	}
}
