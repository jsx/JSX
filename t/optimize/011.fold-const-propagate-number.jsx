/*EXPECTED
2
2
-1
4
0.5
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
		log Test.ONE + Test.ONE;
		log Test.ONE - Test.TWO;
		log Test.TWO * Test.TWO;
		log Test.ONE / Test.TWO;
	}
}
