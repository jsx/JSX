/*EXPECTED
hello
*/

class Base {
	function f(msg : string, cb : (string) -> void) : void {
		cb(msg);
	}
}
class _Main extends Base {
	function constructor() {
		super.f("hello", (msg) -> { log msg; });
	}
	override function f(msg : string, cb : (string) -> void) : void {
		throw new Error("should never be called");
	}
	static function main(args : string[]) : void {
		new _Main;
	}
}
