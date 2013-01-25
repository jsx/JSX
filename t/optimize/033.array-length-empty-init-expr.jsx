/*EXPECTED
10
*/
/*JSX_OPTS
--optimize array-length
*/
class _Main {
	static function main(args : string[]) : void {
		var a = [ 1, 2, 3, 4 ];
		var sum = 0;
		var i = 0;
		for (; i < a.length; ++i) {
			sum += a[i];
		}
		log sum;
	}
}
