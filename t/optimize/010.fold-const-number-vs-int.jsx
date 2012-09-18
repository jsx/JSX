/*EXPECTED
3
*/
/*JSX_OPTS
--optimize fold-const
*/

class _Main {
	static const i : int = 3.3;
	static function main(args : string[]) : void {
		var n : number = _Main.i;
		log n;
	}
}
