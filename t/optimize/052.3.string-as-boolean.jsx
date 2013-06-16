/*EXPECTED
hello
*/
/*JSX_OPTS
--optimize fold-const,dce
*/
class _Main {
	static function main (args : string[]) : void {
		if ("42" as boolean) {
			log "hello";
		}
	}
}
