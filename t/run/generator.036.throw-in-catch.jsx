/*JSX_OPTS
--enable-generator-emulation
*/
/*EXPECTED
in finally clause
generator faulted
*/

class _Main {
	static function main (args : string[]) : void {

		function * foo () : void yield int {
			try {
				throw "foo";
			} catch (e : variant) {
				throw "bar";
			} finally {
				log "in finally clause";
			}
		}

		try {
			foo().next();
		} catch (e : variant) {
			log "generator faulted";
		}

	}
}
