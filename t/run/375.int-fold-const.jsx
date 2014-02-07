/*JSX_OPTS
--optimize fold-const
*/
/*EXPECTED
-2147483648
560833313
NaN
*/
class _Main {
	static const OX7FFFFFFF : int = 0x7fffffff;
	static const ZERO : int = 0;
	static const ONE : int = 1;
	static const DEADBEEF_INT : int = 0xdeadbeef;
	static function main(args : string[]) : void {
		log _Main.OX7FFFFFFF + _Main.ONE;
		log _Main.DEADBEEF_INT * _Main.DEADBEEF_INT;
		log _Main.DEADBEEF_INT % _Main.ZERO;
	}
}
