/*EXPECTED
1
*/
/*JSX_OPTS
--optimize fold-const
*/

class Test {
	static const ZERO : int = 0;
	static const ONE : int = Test.ZERO + 1;
	static function run() : void {
		log Test.ONE;
	}
}
