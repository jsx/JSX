/*EXPECTED
1
1
2
3
5
*/
class _Main {
	static function main (args : string[]) : void {
		function * fib () : Generator.<void,number> {
			var a = 0, b = 1;
			while (true) {
				var t = a;
				a = b;
				b = t + b;
				yield a;
			}
		}

		var g = fib();
		for (var i = 0; i < 5; ++i) {
			log g.next().value;
		}
	}
}
