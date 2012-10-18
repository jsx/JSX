/*EXPECTED
ok
*/
class _Main {
	static function main(args : string[]) : void {
		try {
			log "ok";
		}
		catch (e : Error) {
			var foo = "";
		}
	}
}
