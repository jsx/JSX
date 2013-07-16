/*EXPECTED
45
*/
/*JSX_OPTS
--optimize inline
*/

// a variation of t/optimize/040
class _Main {
	var y = 3;

	final function f(x : number) : number {
		return this.y + (x >= 0 ? x : -x);
	}

	static function main(args : string[]) : void {
		var x = -40;
		log new _Main().f(x - 2);
	}
}
