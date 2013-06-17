/*EXPECTED
30
4
*/
/*JSX_OPTS
--optimize dce
*/
class _Main {
	static function main (args : string[]) : void {
		var x : number;
		var y : number;
		(y = 2, y = 3, y = 4) && (x = 10, x = 20, x = 30);
		log x;
		log y;
	}
}
