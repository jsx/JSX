/*EXPECTED
20
*/
/*JSX_OPTS
--optimize dce
*/

class _Main {
	function constructor(n : number) {}

	static function main(args : string[]) : void {
		var x = 10;
		new _Main(x = 20);
		log x;
	}
}
