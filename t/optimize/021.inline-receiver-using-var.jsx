/*EXPECTED
abc
*/
/*JSX_OPTS
--optimize lto,inline
*/

class Test {
	var s = "ab";
	function f() : string {
		return this.s + "c";
	}
	static var s : Test;
	static function run() : void {
		Test.s = new Test();
		var s = Test.s.f();
		log s;
	}
}
