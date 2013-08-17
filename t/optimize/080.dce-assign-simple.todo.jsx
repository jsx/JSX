/*EXPECTED
15
*/
/*JSX_OPTS
--optimize dce
*/

class _Main {
	static function main(args : string[]) : void {
		// should be converted into `log 1 + ((10 + 2) + 2`
		var y = 10 + 2;
		var z = 1 + (y + 2);
		log z;
	}
}
