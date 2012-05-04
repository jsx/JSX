import "test-case.jsx";

class _Test extends TestCase {

	function test1() :void {
		this.expect("hello").toBe("hello");
		this.expect("world").toBe("world");

		this.done();
	}

	function test2() :void {
		this.expect(42).toBe(42);

		this.done();
	}
}
