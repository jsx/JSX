/*EXPECTED
1
1
2
3
5
8
13
*/
class Test {
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
	static function run() : void {
		log Test.fib(1);
		log Test.fib(2);
		log Test.fib(3);
		log Test.fib(4);
		log Test.fib(5);
		log Test.fib(6);
		log Test.fib(7);
	}
}
