/*EXPECTED
9800000000000
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
				this.add(j);
				this.add(-i);
			}
		}
	}
	function add(value : number) : void {
		this.n += value;
	}
	static function main(args : string[]) : void {
		var t = new _Main(("100" + "000") as number);
		log t.n;
	}
}
