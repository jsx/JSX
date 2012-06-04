/*EXPECTED
3
*/
/*JSX_OPTS
--optimize inline
*/
class Test {
	var n = 3;
	function f() : number {
		return function () : number {
			return this.n;
		}();
	}
	static function run() : void {
		var n = (new Test).f();
		log n;
	}
}
