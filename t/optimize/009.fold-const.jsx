/*EXPECTED
1
*/
/*JSX_OPTS
--optimize fold-const
*/

class _Main {
	static const i = 1;
	static function main(args : string[]) : void {
		log _Main.i;
	}
}
