/*EXPECTED
400000000
*/
/*JSX_OPTS
--optimize inline
*/
/*BENCHMARK
*/

final class Test {
	var n = 0;
	function constructor(cnt : number) {
		for (var i = 0; i < 2000; ++i) {
			for (var j = 0; j < cnt; ++j) {
				this.incr();
				this.incr();
			}
		}
	}
	function incr() : void {
		++this.n;
	}
	static function run() : void {
		var t = new Test(("100" + "000") as number);
		log t.n;
	}
}
