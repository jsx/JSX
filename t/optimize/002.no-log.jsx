/*EXPECTED
*/
/*JSX_OPTS
--optimize no-log
*/

// the test just checks that the generated code becomes different if optimized

class Test {
	function constructor() {
		log "hello";
	}
	static function run() : void {
	}
}
