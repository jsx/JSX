/*EXPECTED
3
*/
/*JSX_OPTS
--optimize lto,unclassify
*/
class _Main {
	var n = 3;
	function f() : _Main {
		return this;
	}
	static function main(args : string[]) : void {
		log new _Main.f().f().n;
	}
}
