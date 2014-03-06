/*JSX_OPTS
--enable-generator-emulation
*/
/*EXPECTED
finally
error from try
*/
class _Main {
	static function main (args : string[]) : void {

		function * foo () : void yield int {
			try {
				throw new Error("error from try");
			} finally {
				log "finally";
			}
			log "don't show me";
		}

		var g = foo();
		try {
			log g.next();
		} catch (e : Error) {
			log e.message;
		}

	}
}
