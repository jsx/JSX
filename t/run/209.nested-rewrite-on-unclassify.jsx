/*EXPECTED
3
*/
/*JSX_OPTS
--optimize lto,unclassify
*/
class Test {
	var n = 3;
	function f() : Test {
		return this;
	}
	static function run() : void {
		log new Test.f().f().n;
	}
}
