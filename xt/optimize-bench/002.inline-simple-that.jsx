/*EXPECTED
0
400000000
*/
/*JSX_OPTS
--optimize inline
*/
/*BENCHMARK
*/

final class Test {
	var n = 0;
	function incr() : void {
		++this.n;
	}
	static function loop(cnt : number) : void {
		var that = new Test;
		log that.n;
		for (var i = 0; i < 2000; ++i) {
			for (var j = 0; j < cnt; ++j) {
				that.incr();
				that.incr();
			}
		}
		log that.n;
	}
	static function run() : void {
		Test.loop(("100" + "000") as number);
	}
}
