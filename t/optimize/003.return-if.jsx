/*EXPECTED
0
1
*/
/*JSX_OPTS
--optimize return-if
*/

class Test {
	static function f(b : boolean) : number {
		if (b)
			return 1;
		return 0;
	}
	static function run() : void {
		log Test.f(false);
		log Test.f(true);
	}
}
