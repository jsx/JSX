/*EXPECTED
400000000
*/
/*JSX_OPTS
--optimize inline
*/
/*BENCHMARK
2
*/

final class _Main {
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
	static function main(args : string[]) : void {
		var t = new _Main(("100" + "000") as number);
		log t.n;
	}
}
