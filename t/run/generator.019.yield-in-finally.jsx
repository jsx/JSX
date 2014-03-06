/*JSX_OPTS
--enable-generator-emulation
*/
/*EXPECTED
42
*/
class _Main {
	static function main (args : string[]) : void {

		function * foo () : int {
			try {
				// nothing
			} finally {
				yield 42;
			}
		}

		log foo().next().value;
	}
}
