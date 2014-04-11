/*EXPECTED
1
3
6
10
15
*/
class _Main {
	static function main (args : string[]) : void {

		function * sum () : Generator.<number,number> {
			var a = 0;
			while (true) {
				a += yield a;
			}
		}

		var g = sum();
		g.next();// initial run
		log g.next(1).value;
		log g.next(2).value;
		log g.next(3).value;
		log g.next(4).value;
		log g.next(5).value;
	}
}
