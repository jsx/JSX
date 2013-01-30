/*EXPECTED
true
*/
/*JSX_OPTS
--optimize fold-const
*/

class _Main {
	static function main(args : string[]) : void {
		log JSX.DEBUG;
	}
}
