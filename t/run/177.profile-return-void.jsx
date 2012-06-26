/*EXPECTED
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
		log m["Test.run()"]["Test.f()"]["$count"];
	}
}
