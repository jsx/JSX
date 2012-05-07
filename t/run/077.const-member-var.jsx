/*EXPECTED
static
instance
*/

class Test {
	static const STATIC_VAR = "static";
	const INSTANCE_VAR = "instance";

	static function run() : void {
		log Test.STATIC_VAR;
		log (new Test()).INSTANCE_VAR;
	}
}

