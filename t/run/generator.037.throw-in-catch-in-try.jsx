/*JSX_OPTS
--enable-generator-emulation
*/
/*EXPECTED
in outer finally clause
bar
in inner finally clause
*/

class _Main {
	static function main (args : string[]) : void {

		function * foo () : void yield int {
			try {
				try {
					throw "foo";
				} catch (e : variant) {
					throw "bar";
				} finally {
					log "in outer finally clause";
				}
			} catch (e : variant) {
				log e;
			} finally {
				log "in inner finally clause";
			}
		}

		foo().next();

	}
}
