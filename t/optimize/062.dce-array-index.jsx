/*EXPECTED
foo
*/
/*JSX_OPTS
--optimize dce
*/
class _Main {
	static function main (args : string[]) : void {
		var a = new number[];
		a[0];
		log "foo";
	}
}
