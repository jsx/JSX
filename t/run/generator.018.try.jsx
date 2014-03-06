/*JSX_OPTS
--enable-generator-emulation
*/
/*EXPECTED
try begin
42
try end
finally
true
*/
class _Main {
	static function main (args : string[]) : void {

		function * foo () : int {
			try {
				log "try begin";
				yield 42;
				log "try end";
			} finally {
				log "finally";
			}
		}

		var g = foo();
		log g.next().value;
		log g.next().done;

	}
}
