/*EXPECTED
0
1
0
3
1
3
0
1
*/

class Test {

	static function _for() : void {
	l:	for (var i = 0; i < 2; ++i) {
			log i;
			continue l;
			log "bad";
		}
	l2:	for (var i = 0; i < 2; ++i) {
			for (var j = 3; j < 4; ++j) {
				log i;
				log j;
				continue l2;
				log "bad";
			}
		}
	}

	static function _switch() : void {
	l:	for (var i = 0; i < 2; ++i) {
			switch (1) {
			default:
				log i;
				continue l;
			}
			log "bad";
		}
	}

	static function run() : void {
		Test._for();
		Test._switch();
	}
}
