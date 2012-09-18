/*EXPECTED
2
2
-1
4
0.5
*/
/*JSX_OPTS
--optimize fold-const
*/

class _Main {
	static const ZERO = 0;
	static const ONE = _Main.ZERO + 1;
	static const TWO = _Main.ONE + 1;
	static function main(args : string[]) : void {
		log _Main.TWO;
		log _Main.ONE + _Main.ONE;
		log _Main.ONE - _Main.TWO;
		log _Main.TWO * _Main.TWO;
		log _Main.ONE / _Main.TWO;
	}
}
