/*EXPECTED
object
true
true
object
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
		log typeof m["functions"]["Test.f$"];
		log m["functions"]["Test.f$"]["only"] as number >= 0; // should be 0 or 1 ms
		log m["functions"]["Test.f$"]["accumulated"] as number != 0; // should take at least 1ms
		log typeof m["functions"]["Test.<<unnamed>>$"]; // closure should exist
	}
}
