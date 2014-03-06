/*JSX_OPTS
--enable-generator-emulation
*/
/*EXPECTED
ok
*/
class _Main {
	static function main (args : string[]) : void {

		function * foo () : void yield int {
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
