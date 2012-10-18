/*EXPECTED
2
2
*/
/*JSX_OPTS
--optimize lto,inline
*/

class _Main {
	static function f(n : number) : number {
		var t = 1;
		t += n;
		return t;
	}
	function f(n : number) : number {
		var t = 1;
		t += n;
		return t;
	}
	static function main(args : string[]) : void {
		var n = _Main.f(1);
		log n;
		n = new _Main().f(1);
		log n;
	}
}
