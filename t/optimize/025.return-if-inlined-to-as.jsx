/*EXPECTED
0
*/
/*JSX_OPTS
--optimize return-if,inline
*/
class Test {
	static function f(n : number) : number {
		if (n < 1)
			return 0;
		return n;
	}
	static function run() : void {
		var s = Test.f(0) as string;
		log s;
	}
}
