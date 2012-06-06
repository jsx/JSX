
// testing __readonly__
class Test {
	static function run() : void {
		var s = "foo";
		s.length = 0;
		log s;
	}
}
