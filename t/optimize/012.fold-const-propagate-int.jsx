/*EXPECTED
1
2
-1
4
0.5
1
*/
/*JSX_OPTS
--optimize fold-const
*/

class Test {
	static const ZERO : int = 0;
	static const ONE : int = Test.ZERO + 1;
	static const TWO : int = Test.ONE + 1;
	static function run() : void {
		log Test.ONE;
		log Test.ONE + Test.ONE;
		log Test.ONE - Test.TWO;
		log Test.TWO * Test.TWO;
		log Test.ONE / Test.TWO; // / and % operations return floating point
		log Test.ONE % Test.TWO;
	}
}
