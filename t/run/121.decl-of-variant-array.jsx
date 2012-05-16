/*EXPECTED
0,abc
*/

class Test {
	static function say(a : Array.<variant>) : void {
		log a.join(",");
	}
	static function run() : void {
		var a = [ 0, "abc" ] : variant[]; // test type
		Test.say(a); // test variant[] === Array.<variant>
	}
}
