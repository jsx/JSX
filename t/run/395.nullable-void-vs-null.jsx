/*EXPECTED
ok
*/

class _Main {
	static function main (args : string[]) : void {
		var a : Nullable.<void>;

		a = null;

		log "ok";
	}
}
