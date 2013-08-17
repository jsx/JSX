/*EXPECTED
foo
*/
/*JSX_OPTS
--optimize dce
*/

class _Main {
	var p = "foo";
	function f() : void {
		var that : _Main;
		that = this;
		var s = that.p;
		log s;
	}

	static function main(args : string[]) : void {
		new _Main().f();
	}
}
