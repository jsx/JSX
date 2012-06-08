/*EXPECTED
123
*/
class Test {
	static var m = { k: 123 };
	static function run() : void {
		var n = Test.m["k"];
		log n;
	}
}
