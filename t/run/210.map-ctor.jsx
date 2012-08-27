/*EXPECTED
undefined
*/

class Test {
	static function run() : void {
		var a = new Map.<number>();
		log a["a"];
		for (var k in a) {
			log "never reached";
		}
	}
}
