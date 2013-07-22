/*EXPECTED
42
*/
/*JSX_OPTS
--optimize inline
*/
class _Main {
	static function abs(x : number) : number {
		return x >= 0 ? x : -x;
	}

	static function main(args : string[]) : void {
		var x = -40;
		// should be expanded into:
		// var abs$x : number;
		// log (((abs$x = x - 2), abs$x) >= 0 ? x : -x)
		log _Main.abs(x - 2);
	}
}
