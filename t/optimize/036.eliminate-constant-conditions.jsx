/*EXPECTED
5
*/
/*JSX_OPTS
--optimize dce
*/

class _Main {
	static function main(args : string[]) : void {
		var x = 0;
		
		// boolean
		if (true) {
			++x;
		}
		if (false) {
			x = NaN;
		}
		// number
		if (1) {
			++x;
		}
		if (0) {
			x = NaN;
		}
		// string
		if ('a') {
			++x;
		}
		if ('') {
			x = NaN;
		}
		// array
		if ([] : number[]) {
			++x;
		}
		// map
		if ({} : Map.<number>) {
			++x;
		}

		log x;
	}
}
