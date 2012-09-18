/*EXPECTED
0
1
2
3
*/
/*JSX_OPTS
--optimize return-if
*/

class _Main {
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
	static function main(args : string[]) : void {
		log _Main.f(0);
		log _Main.f(1);
		log _Main.f(2);
		log _Main.f(3);
	}
}
