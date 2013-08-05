/*EXPECTED
0
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
	function add(value : number) : void {
		this.n += value;
	}
	static function loop(cnt : number) : void {
		var that = new _Main;
		log that.n;
		for (var i = 0; i < 2000; ++i) {
			for (var j = 0; j < cnt; ++j) {
				that.add(j);
				that.add(-i);
			}
		}
		log that.n;
	}
	static function main(args : string[]) : void {
		_Main.loop(("100" + "000") as number);
	}
}
