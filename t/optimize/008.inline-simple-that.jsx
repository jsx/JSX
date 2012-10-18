/*EXPECTED
0
1
*/
/*JSX_OPTS
--optimize inline
*/

final class _Main {
	var n = 0;
	function incr() : void {
		++this.n;
	}
	static function main(args : string[]) : void {
		var that = new _Main;
		log that.n;
		that.incr();
		log that.n;
	}
}
