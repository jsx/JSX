/*EXPECTED
ok
ok
*/

class Test {
	static function run() : void {
		switch ([2][0]) {
		case 2:
			log "ok";
			break;
		}
		switch (1) {
		case [ 1 ].pop():
			log "ok";
			break;
		}
	}
}
