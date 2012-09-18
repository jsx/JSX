/*EXPECTED
*/
/*JSX_OPTS
--optimize no-log
*/

// the test just checks that the generated code becomes different if optimized

class _Main {
	function constructor() {
		log "hello";
	}
	static function main(args : string[]) : void {
	}
}
