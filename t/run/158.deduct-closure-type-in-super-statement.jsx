/*EXPECTED
hello
goodbye
*/
class Base {
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
}
class Test extends Base {
	function constructor() {
		super((s) -> { log s; });
	}
	function constructor(n : number) {
		super(() -> { log "goodbye"; });
	}
	static function run() : void {
		new Test();
		new Test(1);
	}
}
