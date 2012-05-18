/*EXPECTED
3
*/
/*JSX_OPTS
--optimize fold-const
*/

class Test {
	static const i : int = 3.3;
	static function run() : void {
		var n : number = Test.i;
		log n;
	}
}
