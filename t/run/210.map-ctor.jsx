/*EXPECTED
undefined
*/

class _Main {
	static function main(args : string[]) : void {
		var a = new Map.<number>();
		log a["a"];
		for (var k in a) {
			log "never reached";
		}
	}
}
