/*EXPECTED
abc
*/
/*JSX_OPTS
--optimize lto,inline
*/

class Base {
	function message() : string {
		return "abc";
	}
}

class Test extends Base {
	static function run() : void {
		var t = new Test;
		var m = t.message();
		log m;
	}
}
