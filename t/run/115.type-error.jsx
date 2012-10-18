/*EXPECTED
yes!
oui!
*/

class _Main {
	static function main(args : string[]) : void {
		var n : Nullable.<number> = null;
		try {
			n.toString();
		} catch (e : TypeError) {
			log "yes!";
		}
		// catch using a broader type
		try {
			n.toString();
		} catch (e : Error) {
			log "oui!";
		}
	}
}
