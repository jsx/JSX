/*EXPECTED
abc
*/
/*JSX_OPTS
--optimize lto,inline
*/

class _Main {
	var s = "ab";
	function f() : string {
		return this.s + "c";
	}
	static var s : _Main;
	static function main(args : string[]) : void {
		_Main.s = new _Main();
		var s = _Main.s.f();
		log s;
	}
}
