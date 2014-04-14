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
		try {
			var a = _Main.f();
			log a["a"] == null; // in case of release mode
		} catch (e : Error) {
			log "true"; // throws an exception in case of --enable-type-check
		}
	}
}
