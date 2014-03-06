/*JSX_OPTS
--enable-generator-emulation
*/
/*EXPECTED
throw from finally
ok
*/
class _Main {
	static function main (args : string[]) : void {

		function * foo () : int {
			try {
				// nothing
			} finally {
				throw new Error("throw from finally");
			}
			log "don't show me";
		}

		try {
			foo().next();
		} catch (e : Error) {
			log "ok";
		}
	}
}
