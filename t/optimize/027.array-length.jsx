/*EXPECTED
10
*/
/*JSX_OPTS
--optimize array-length
*/
class Test {
	static function run() : void {
		var a = [ 1, 2, 3, 4 ];
		var sum = 0;
		for (var i = 0; i < 1*a.length; ++i) {
			sum += a[i];
		}
		log sum;
	}
}
