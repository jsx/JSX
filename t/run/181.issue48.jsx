/*EXPECTED
*/
class Test {
	static var x : Nullable.<Array.<number>> = null;
	static var y : Nullable.<number[]> = null;
	static function run() : void {
		Test.x = [ 1, 2, 3 ];
		Test.y = [ 1, 2, 3 ];
	}
}
