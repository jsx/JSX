/*EXPECTED
abc
*/
/*JSX_OPTS
--optimize inline
*/

class _Main {
	var s = "ab";
	static function f(s : string) : string {
		return s + "c";
	}
	static function main(args : string[]) : void {
		var s = _Main.f(new _Main().s);
		log s;
	}
}
