/*EXPECTED
hello
goodbye
*/
class _Main {
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
	static function main(args : string[]) : void {
		new _Main((s) -> { log s; });
		new _Main(() -> { log "goodbye"; });
	}
}
