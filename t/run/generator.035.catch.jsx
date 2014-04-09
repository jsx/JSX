/*JSX_OPTS
--enable-generator-emulation
*/
/*EXPECTED
in B catch clause
in finally clause
*/

class A {}
class B {}

class _Main {
	static function main (args : string[]) : void {

		function * foo () : void yield int {
			try {
				throw new B;
			} catch (e : A) {
				log "in A catch clause";
			} catch (e : B) {
				log "in B catch clause";
			} catch (e : Object) {
				log "in Object catch clause";
			} finally {
				log "in finally clause";
			}
		}

		foo().next();

	}
}
