/*EXPECTED
hello
*/

class Base {
	function f(msg : string, cb : (string) -> void) : void {
		cb(msg);
	}
}
class Test extends Base {
	function constructor() {
		super.f("hello", (msg) -> { log msg; });
	}
	override function f(msg : string, cb : (string) -> void) : void {
		throw new Error("should never be called");
	}
	static function run() : void {
		new Test;
	}
}
