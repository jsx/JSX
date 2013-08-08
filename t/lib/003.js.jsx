import "test-case.jsx";
import "js.jsx";

class _Test extends TestCase {

	function testInvoke() : void {
		this.expect(
			js.invoke(
				js.global["Math"],
				"abs",
				[ -10 ] : Array.<variant>)
		).toBe(10);
		var m = "abs";
		this.expect(
			js.invoke(
				js.global["Math"],
				m,
				[ -10 ] : Array.<variant>)
		).toBe(10);
		var a = [ -10 ] : Array.<variant>;
		this.expect(
			js.invoke(
				js.global["Math"],
				"abs",
				a)
		).toBe(10);
	}

	function testExecScript() : void {
		var value = js.eval("2 + 3") as int;
		this.expect(value).toBe(2 + 3);
	}

}
