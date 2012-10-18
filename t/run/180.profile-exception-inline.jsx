/*EXPECTED
1
*/
/*JSX_OPTS
--profile
*/

class _Main {
	static function f() : void {
		try {
			throw new Error("Hmm");
		} catch (e : Error) {
		}
	}
	static function main(args : string[]) : void {
		_Main.f();
		var m = JSX.getProfileResults();
		log m["_Main.main(:Array.<string>)"]["_Main.f()"]["$count"];
	}
}
