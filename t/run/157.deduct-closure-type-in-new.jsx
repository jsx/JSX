/*EXPECTED
hello
goodbye
*/
class Test {
	function constructor() {
	}
	function constructor(n : number) {
	}
	function constructor(cb : (string) -> void) {
		cb("hello");
	}
	function constructor(cb : () -> void) {
		cb();
	}
	static function run() : void {
		new Test((s) -> { log s; });
		new Test(() -> { log "goodbye"; });
	}
}
