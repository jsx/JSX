/*EXPECTED
2
*/
/*JSX_OPTS
--optimize fold-const
*/

class Test {
	static const ZERO = 0;
	static const ONE = Test.ZERO + 1;
	static const TWO = Test.ONE + 1;
	static function run() : void {
		log Test.TWO;
	}
}
