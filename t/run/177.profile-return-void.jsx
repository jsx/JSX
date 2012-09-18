/*EXPECTED
1
*/
/*JSX_OPTS
--profile
*/
class _Main {
	static function f() : void {
		return;
	}
	static function main(args : string[]) : void {
		_Main.f();
		var m = JSX.getProfileResults();
		log m["_Main.main(:Array.<string>)"]["_Main.f()"]["$count"];
	}
}
