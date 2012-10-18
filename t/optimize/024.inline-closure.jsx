/*EXPECTED
3
*/
/*JSX_OPTS
--optimize inline
*/
class _Main {
	var n = 3;
	function f() : number {
		return function () : number {
			return this.n;
		}();
	}
	static function main(args : string[]) : void {
		var n = (new _Main).f();
		log n;
	}
}
