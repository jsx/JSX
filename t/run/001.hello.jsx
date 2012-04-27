#!bin/run-jsx-test
// FIXME import "test-simple"

class Test {
	static function run() : void {
		var test = new TestSimple("hello.jsx");

		test.expect("hello world!").toBe("hello world!");

		test.done();
	}
}
