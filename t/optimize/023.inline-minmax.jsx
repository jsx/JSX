/*EXPECTED
1
2
*/
/*JSX_OPTS
--optimize inline
*/
class _Main {
	static function min(x : number, y : number) : number {
		return Math.min(x, y);
	}
	static function main(args : string[]) : void {
		log _Main.min(1, 2);
		log Math.max(1, 2);
	}
}
