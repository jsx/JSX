/*EXPECTED
foo
*/
/*JSX_OPTS
--optimize dce
*/
class _Main {
	static function main (args : string[]) : void {
		(function () {
			log "xxx";
		});
		log "foo";
	}
}
