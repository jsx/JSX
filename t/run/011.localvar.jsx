/*EXPECTED
1
1
2
3
5
8
13
*/
class _Main {
	static function fib(n : number) : number {
		if (n <= 2)
			return 1;
		var value = 1;
		var prevValue = 1;
		for (var i = 3; i <= n; i++) {
			var t = value + prevValue;
			prevValue = value;
			value = t;
		}
		return value;
	}
	static function main(args : string[]) : void {
		log _Main.fib(1);
		log _Main.fib(2);
		log _Main.fib(3);
		log _Main.fib(4);
		log _Main.fib(5);
		log _Main.fib(6);
		log _Main.fib(7);
	}
}
