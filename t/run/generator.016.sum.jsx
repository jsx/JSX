/*JSX_OPTS
--enable-generator-emulation
*/
/*EXPECTED
1
3
6
10
*/
class _Main {
	static function main (args : string[]) : void {
		function * sum () : number {
			var a = 0;
			while (true) {
				a += yield a;
			}
		}

		var g = sum();
		g.next();	// initial run
		for (var i = 1; i < 5; ++i) {
			log g.next(i).value;
		}
	}
}
