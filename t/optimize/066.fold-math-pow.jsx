/*EXPECTED
256
*/
/*JSX_OPTS
--optimize fold-const
*/
class _Main {
	static function main (args : string[]) : void {
		log Math.pow(2, 8);;
	}
}
