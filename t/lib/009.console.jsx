import "console.jsx";
import "test-case.jsx";

class _Test extends TestCase {
	function compile(o : Object) : void {
		console.log("foo");
		console.log(o);

		console.info("foo");
		console.info(o);

		console.warn("foo");
		console.warn(o);

		console.error("foo");
		console.error(o);
	}

	function test() : void {
		this.expect(0, "compilation ok").toBe(0);
	}
}
