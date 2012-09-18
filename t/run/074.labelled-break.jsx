/*EXPECTED
0
3
a
b
A
B
!
@
*/

class _Main {

	static function _for() : void {
	l:	for (var i = 0; i < 2; ++i) {
			log i;
			if (true) break l;
		}
	l2:	for (var i = 0; i < 2; ++i) {
			for (var j = 3; j < 4; ++j) {
				log j;
				if (true) break l2;
			}
		}
	}

	static function _dowhile() : void {
	l: 	do {
			log "a";
			if (true) break l;
		} while (true);
	l2:	do {
			do {
				log "b";
				if (true) break l2;
			} while (true);
		} while (true);
	}

	static function _while() : void {
	l:	while (true) {
			log "A";
			break l;
		}
	l2:	while (true) {
			while (true) {
				log "B";
				break l2;
			}
		}
	}

	static function _switch() : void {
	l:	switch (1) {
		default:
			log "!";
			break l;
		}
	l2:	while (true) {
			switch (1) {
			default:
				log "@";
				break l2;
			}
		}
	}

	static function main(args : string[]) : void {
		_Main._for();
		_Main._dowhile();
		_Main._while();
		_Main._switch();
	}
}
