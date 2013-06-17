/*EXPECTED
42
*/
/*JSX_OPTS
--optimize fold-const,dce
*/
class _Main {
	static const V : int = 42;

	static function main (args : string[]) : void {
		if (_Main.V as string) {
			log _Main.V as string;
		}
	}
}
