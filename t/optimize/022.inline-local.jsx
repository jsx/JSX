/*EXPECTED
2
2
*/
/*JSX_OPTS
--optimize lto,inline
*/

class Test {
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
	static function run() : void {
		var n = Test.f(1);
		log n;
		n = new Test().f(1);
		log n;
	}
}
