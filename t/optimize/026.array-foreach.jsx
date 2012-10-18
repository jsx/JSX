/*EXPECTED
10
10
*/
/*JSX_OPTS
--disable-type-check --optimize inline
*/
class _Main {
	static function main(args : string[]) : void {
		var sum = 0;
		[ 1, 2, 3, 4 ].forEach((n) -> { sum += n; });
		log sum;

		var closures = new Array.<() -> number>;
		[ 1, 2, 3, 4 ].forEach((n) -> {
			closures.push(() : number -> n);
		});

		sum = 0;
		closures.forEach((f) -> { sum += f(); });
		log sum;
	}
}
