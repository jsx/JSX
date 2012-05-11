/*EXPECTED
ok
*/

class Test {
	static function run() : void {
		switch ([2][0]) {
		case 2:
			log "ok";
			break;
		}
	}
}
