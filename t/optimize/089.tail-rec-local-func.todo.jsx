/*EXPECTED
1
1
2
3
5
8
13
21
34
55
*/
/*JSX_OPTS
--optimize tail-rec
*/


class _Main {
	static function main(args : string[]) : void {
		function fib(n : number, a : number, b : number) : number {
			if (!(n == 0 || n == 1)) {
				return fib(n - 1, a + b, a);
			}
			else {
				return a;
			}
		}

		for (var n = 1; n < 11; ++n) {
			log fib(n, 1, 0);
		}
	}
}

