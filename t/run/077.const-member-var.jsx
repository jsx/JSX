/*EXPECTED
static
*/

class Test {
	static const STATIC_VAR = "static";

	static function run() : void {
		log Test.STATIC_VAR;
	}
}

