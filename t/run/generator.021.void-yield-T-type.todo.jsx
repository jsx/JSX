/*JSX_OPTS
--enable-generator-emulation
*/
/*EXPECTED
ok
*/
class _Main {
	static function main (args : string[]) : void {

		// `void yield int` shouldn't be parsed like `Generator.<void,int>, but `Generator.<int> instead`
		function * foo () : void yield int {
			var c = 0;
			while (true)
				yield c++;
		}

		var gen : Generator.<int> = foo();

		log gen.next().value;
		log gen.next().value;
		log gen.next().value;
	}
}
