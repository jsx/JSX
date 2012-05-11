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
		var ret;
		switch (n) {
		case 1:
		case 1 + 1:
			ret = 1;
			break;
		default:
			ret = Test.fib(n - 1) + Test.fib(n - 2);
			break;
		}
		return ret;
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
