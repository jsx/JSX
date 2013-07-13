/*EXPECTED
-1
*/
/*JSX_OPTS
--optimize fold-const
*/
class _Main {
	static function main (args : string[]) : void {
		log Math.cos(Math.PI);;
	}
}
