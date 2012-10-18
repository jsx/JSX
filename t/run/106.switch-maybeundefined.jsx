/*EXPECTED
ok
ok
*/

class _Main {
	static function main(args : string[]) : void {
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
