/*EXPECTED
0
1
*/
/*JSX_OPTS
--optimize inline
*/

final class Test {
	var n = 0;
	function incr() : void {
		++this.n;
	}
	static function run() : void {
		var that = new Test;
		log that.n;
		that.incr();
		log that.n;
	}
}
