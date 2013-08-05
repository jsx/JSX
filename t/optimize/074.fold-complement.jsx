/*EXPECTED
0
-43
*/
/*JSX_OPTS
--optimize fold-const
*/
class _Main {
	static function main (args : string[]) : void {
		log ~ -1;
		log ~  42;
	}
}
