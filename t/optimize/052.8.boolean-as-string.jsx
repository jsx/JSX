/*EXPECTED
true
*/
/*JSX_OPTS
--optimize fold-const,dce
*/
class _Main {
	static function main (args : string[]) : void {
		if (true as string) {
			log true as string;
		}
	}
}
