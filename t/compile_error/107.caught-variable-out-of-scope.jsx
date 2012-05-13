abstract class Test {
	abstract function f() : void;
	static function run(t : Test) : void {
		try {
			t.f();
		} catch (e : Error) {
		}
		log e;
	}
}
