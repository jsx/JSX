/*EXPECTED
1
*/
/*JSX_OPTS
--optimize fold-const
*/

class Test {
	static const i = 1;
	static function run() : void {
		log Test.i;
	}
}
