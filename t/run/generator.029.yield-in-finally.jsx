/*JSX_OPTS
--enable-generator-emulation
*/
/*EXPECTED
42
*/
class _Main {
	static function main (args : string[]) : void {

		function * foo () : void yield int {
			try {
				// nothing
			} finally {
				yield 42;
			}
		}

		log foo().next().value;
	}
}
