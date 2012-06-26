/*EXPECTED
true
true
true
true
*/
/*JSX_OPTS
--profile
*/

class Test {
	static var n = 1000000;
	static function f() : void {
		(function () : void {
			for (var i = 0; i < Test.n; ++i)
				;
		})();
	}
	static function run() : void {
		Test.f();
		var m = JSX.getProfileResults();
		log m["Test.run()"]["Test.f()"]["$exclusive"] as number >= 0; // should be 0 or 1 ms
		log m["Test.run()"]["Test.f()"]["$inclusive"] as number != 0; // should take at least 1ms
		log m["Test.run()"]["Test.f()"]["$count"] as number == 1;
		log m["Test.run()"]["$count"] as number == 0; // should be zero, since it has not exitted
	}
}
