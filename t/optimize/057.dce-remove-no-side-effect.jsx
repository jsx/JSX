/*EXPECTED
42
*/
/*JSX_OPTS
--optimize dce
*/
class _Main {
	static function main (args : string[]) : void {
		1 + 2;
		log 42;
	}
}
