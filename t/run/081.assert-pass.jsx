/*EXPECTED
42
*/
class Test {
	static function run() : void {
		var i = 42;

		assert i == 42;

		log i;
	}
}
