/*EXPECTED
true
*/
class Test {
	static function f() : Map.<number> {
		return {
			"a": [1][-1]
		};
	}
	static function run() : void {
		var a = Test.f();
		log a["a"] == null;
	}
}
