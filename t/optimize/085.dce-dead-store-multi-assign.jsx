/*EXPECTED
40
*/
/*JSX_OPTS
--optimize dce
*/

class _Main {
	static function main(args : string[]) : void {
		var x = 10;
		var y = x = 20;
		log x + y;
	}
}
