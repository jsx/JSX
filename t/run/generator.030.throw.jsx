/*JSX_OPTS
--enable-generator-emulation
*/
/*EXPECTED
raised
*/
class _Main {
	static function main (args : string[]) : void {
		function * foo () : void yield int {
			throw 42;
		}
		try {
			foo().next();
		} catch (e : variant) {
			log "raised";
		}
	}
}
