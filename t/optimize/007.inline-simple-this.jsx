/*EXPECTED
0
1
*/
/*JSX_OPTS
--optimize inline
*/

final class _Main {
	var n = 0;
	function constructor() {
		log this.n;
		this.incr();
		log this.n;
	}
	function incr() : void {
		++this.n;
	}
	static function main(args : string[]) : void {
		new _Main;
	}
}
