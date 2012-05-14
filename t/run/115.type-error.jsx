/*EXPECTED
yes!
oui!
*/

class Test {
	static function run() : void {
		var n : MayBeUndefined.<number> = undefined;
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
