/*EXPECTED
0,abc
*/

class _Main {
	static function say(a : Array.<variant>) : void {
		log a.join(",");
	}
	static function main(args : string[]) : void {
		var a = [ 0, "abc" ] : variant[]; // test type
		_Main.say(a); // test variant[] === Array.<variant>
	}
}
