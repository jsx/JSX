/*EXPECTED
2
*/
/*JSX_OPTS
--optimize fold-const,dce
*/
class _Main {
	static function main (args : string[]) : void {
		var a = 1;
		if (42 as number) {
			a = 2;
		}
		log a;
	}
}