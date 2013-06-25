/*EXPECTED
ok
*/
class _Main {
	static function main(args : string[]) : void {
		try {
			assert false, "foo";
		} catch (e : Error) {
			log "ok";
		}
	}
}