/*EXPECTED
object
1
*/
/*JSX_OPTS
--profile
*/
class Test {
	static function f() : void {
		return;
	}
	static function run() : void {
		Test.f();
		var m = JSX.getProfileResults();
		log typeof m["functions"]["Test.f$"];
		log m["functions"]["Test.f$"]["count"];
	}
}
