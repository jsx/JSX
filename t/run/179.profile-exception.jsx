/*EXPECTED
1
1
1
*/
/*JSX_OPTS
--profile
*/

class _Main {
	static function h() : void {
		throw new Error("Hmm");
	}
	static function g() : void {
		_Main.h();
	}
	static function f() : void {
		try {
			_Main.g();
		} catch (e : Error) {
		}
	}
	static function main(args : string[]) : void {
		_Main.f();
		var m = JSX.getProfileResults();
		log m["_Main.main(:Array.<string>)"]["_Main.f()"]["$count"];
		log m["_Main.main(:Array.<string>)"]["_Main.f()"]["_Main.g()"]["$count"];
		log m["_Main.main(:Array.<string>)"]["_Main.f()"]["_Main.g()"]["_Main.h()"]["$count"];
	}
}
