/*EXPECTED
hello
*/
class Test {
	static var f = function() : string {
		return "hello";
	};
	static function run() : void {
		log Test.f();
	}
}
