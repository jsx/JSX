/*EXPECTED
60
*/
/*JSX_OPTS
--optimize dce
*/

class _Main {
	static function main(args : string[]) : void {
		var x = 1;
		var y = 2;
		var z = 3;
		(x == y) && (x == z) && (z == y) ? x : y;
		x = 10;
		y = 20;
		z = 30;
		log x + y + z;
	}
}
