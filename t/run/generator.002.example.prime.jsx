/*EXPECTED
2
3
5
7
11
*/
class _Main {
	static function main (args : string[]) : void {
		function * prime () : Generator.<void,number> {
			NEXT:
			for (var n = 2; true; ++n) {
				for (var m = 2; m * m <= n; ++m) {
					if (n % m == 0)
						continue NEXT;
				}
				yield n;
			}
		}

		var g = prime();
		for (var i = 0; i < 5; ++i) {
			log g.next().value;
		}
	}
}
