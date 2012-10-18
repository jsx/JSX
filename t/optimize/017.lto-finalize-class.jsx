/*EXPECTED
abc
*/
/*JSX_OPTS
--optimize lto,inline
*/

class _Main {
	function message() : string {
		return "abc";
	}
	static function main(args : string[]) : void {
		var t = new _Main();
		var m = t.message();
		log m;
	}
}
