/*EXPECTED
2
3
2
*/
/*JSX_OPTS
--optimize inline
*/

class _Main {
	static function incr(n : number) : number {
		return n + 1;
	}
	static function main(args : string[]) : void {
		var ret = _Main.incr(1);
		log ret;
		var n = 2;
		ret = _Main.incr(n);
		log ret;
		log n;
		
	}
}
