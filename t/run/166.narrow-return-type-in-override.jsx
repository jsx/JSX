/*EXPECTED
hello
*/

abstract class Base {
	function self() : Base {
		return this;
	}
	abstract function hello() : void;
}

class Test extends Base {
	override function self() : Test {
		return this;
	}
	override function hello() : void {
		log "hello";
	}
	static function f(b : Base) : void {
		b.self().hello();
	}
	static function run() : void {
		Test.f(new Test);
	}
}
