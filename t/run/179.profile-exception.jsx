/*EXPECTED
1
1
1
*/
/*JSX_OPTS
--profile
*/

class Test {
	static function h() : void {
		throw new Error("Hmm");
	}
	static function g() : void {
		Test.h();
	}
	static function f() : void {
		try {
			Test.g();
		} catch (e : Error) {
		}
	}
	static function run() : void {
		Test.f();
		var m = JSX.getProfileResults();
		log m["Test.run()"]["Test.f()"]["$count"];
		log m["Test.run()"]["Test.f()"]["Test.g()"]["$count"];
		log m["Test.run()"]["Test.f()"]["Test.g()"]["Test.h()"]["$count"];
	}
}
