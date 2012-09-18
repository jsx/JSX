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

class _Main extends Base {
	static function main(args : string[]) : void {
		var t = new _Main;
		var m = t.message();
		log m;
	}
}
