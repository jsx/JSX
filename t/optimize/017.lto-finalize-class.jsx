/*EXPECTED
abc
*/
/*JSX_OPTS
--optimize lto,inline
*/

class Test {
	function message() : string {
		return "abc";
	}
	static function run() : void {
		var t = new Test();
		var m = t.message();
		log m;
	}
}
