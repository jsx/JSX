/*EXPECTED
10
*/
/*JSX_OPTS
--disable-type-check --optimize inline
*/
class Test {
	static function run() : void {
		var sum = 0;
		[ 1, 2, 3, 4 ].forEach((n) -> { sum += n; });
		log sum;
	}
}
