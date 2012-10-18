/*EXPECTED
1
2
-1
4
0.5
1
*/
/*JSX_OPTS
--optimize fold-const
*/

class _Main {
	static const ZERO : int = 0;
	static const ONE : int = _Main.ZERO + 1;
	static const TWO : int = _Main.ONE + 1;
	static function main(args : string[]) : void {
		log _Main.ONE;
		log _Main.ONE + _Main.ONE;
		log _Main.ONE - _Main.TWO;
		log _Main.TWO * _Main.TWO;
		log _Main.ONE / _Main.TWO; // / and % operations return floating point
		log _Main.ONE % _Main.TWO;
	}
}
