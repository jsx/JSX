/*EXPECTED
-10
*/
/*JSX_OPTS
--optimize fold-const
*/
class _Main {
	static function main (args : string[]) : void {
		var a = 10;
		log 0 - a;
	}
}
