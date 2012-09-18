/*EXPECTED
true
*/
class _Main {
	static function f() : Map.<number> {
		return {
			"a": [1][-1]
		};
	}
	static function main(args : string[]) : void {
		var a = _Main.f();
		log a["a"] == null;
	}
}
