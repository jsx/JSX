// make sure the syntax of js/dom* is correct
import "test-case.jsx";
import "js/dom.jsx";
import "js/dom/canvas2d.jsx";
import "js/dom/webgl.jsx";

class _Test extends TestCase {
	function test_ok() : void {
		this.expect(true).toBe(true);
	}
}
