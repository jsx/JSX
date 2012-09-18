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
		return n <= 2 ? 1 : _Main.fib(n - 1) + _Main.fib(n - 2);
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
