/*JSX_OPTS
--enable-generator-emulation
*/
/*EXPECTED
finally1
finally2
ok
*/
class _Main {
	static function main (args : string[]) : void {

		function * foo() : void yield int {
			try {
				try {
					throw "ok";
				} finally {
					log "finally1";
				}
				log "after finally1";
			} finally {
				log "finally2";
			}
			log "after finally2";
		}

		try {
			foo().next();
		} catch (e : variant) {
			log e;
		}
	}
}
