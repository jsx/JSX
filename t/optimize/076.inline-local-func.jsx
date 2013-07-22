/*EXPECTED
42
*/
/*JSX_OPTS
--optimize inline
*/

// a variation of t/optimize/040
class _Main {
	static function main(args : string[]) : void {
		var x = -40;
		log (function (x : number) : number {
			return (x >= 0 ? x : -x);
		}(x - 2));
	}
}
