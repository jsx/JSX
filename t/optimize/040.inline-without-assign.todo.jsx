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
		log _Main.abs(x - 2);
	}
}
