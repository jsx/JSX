/*EXPECTED
0
1
2
3
*/
/*JSX_OPTS
--optimize return-if
*/

class Test {
	static function f(n : number) : number {
		if (n < 2) {
			if (n < 1) {
				return 0;
			} else {
				return 1;
			}
		} else if (n < 3) {
			return 2;
		}
		return 3;
	}
	static function run() : void {
		log Test.f(0);
		log Test.f(1);
		log Test.f(2);
		log Test.f(3);
	}
}
