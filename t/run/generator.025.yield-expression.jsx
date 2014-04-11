/*EXPECTED
1
4
9
16
25
*/
class _Main {
	static function main (args : string[]) : void {

		function * echo () : Generator.<number,number> {
			var a = 0;
			while (true) {
				a = yield a;
			}
		}

		var g = echo();
		g.next();	// initial run
		log g.next(1).value;
		log g.next(4).value;
		log g.next(9).value;
		log g.next(16).value;
		log g.next(25).value;
	}
}
