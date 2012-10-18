/*EXPECTED
hello
*/

abstract class Base {
	function self() : Base {
		return this;
	}
	abstract function hello() : void;
}

class _Main extends Base {
	override function self() : _Main {
		return this;
	}
	override function hello() : void {
		log "hello";
	}
	static function f(b : Base) : void {
		b.self().hello();
	}
	static function main(args : string[]) : void {
		_Main.f(new _Main);
	}
}
