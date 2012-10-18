/*EXPECTED
0
1
0
3
1
3
0
default
1
default
*/

class _Main {

	static function _for() : void {
	l:	for (var i = 0; i < 2; ++i) {
			log i;
			if (true) continue l;
			log "bad";
		}
	l2:	for (var i = 0; i < 2; ++i) {
			for (var j = 3; j < 4; ++j) {
				log i;
				log j;
				if (true) continue l2;
				log "bad";
			}
		}
	}

	static function _switch() : void {
	l:	for (var i = 0; i < 2; ++i) {
			log i;
			switch (1) {
			default:
				log "default";
				if (true) continue l;
			}
		}
	}

	static function main(args : string[]) : void {
		_Main._for();
		_Main._switch();
	}
}
