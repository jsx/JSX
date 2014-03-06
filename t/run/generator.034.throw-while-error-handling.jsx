/*JSX_OPTS
--enable-generator-emulation
*/
/*EXPECTED
second throw from finally
*/
class _Main {
	static function main (args : string[]) : void {

		function * foo () : void yield int {
			try {
				throw "first throw from try";
			} finally {
				throw "second throw from finally";
			}
		}

		try {
			foo().next();
		} catch (e : variant) {
			log e;
		}
	}
}
