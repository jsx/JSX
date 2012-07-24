// make sure the syntax of js/dom* is correct
import "test-case.jsx";
import "js/web.jsx";

class _Test extends TestCase {

	function compile_check() : void {
		var elem = dom.id("foo");
		elem.innerHTML = "";
		elem.addEventListener("click", function(e : Event) : void {
			e.preventDefault();
			e.stopPropagation();

			var target = e.target as HTMLElement;
			target.style.color = "red";
		});

		var window   : Window       = dom.window;
		var document : HTMLDocument = dom.document;
	}


	function test_ok() : void {
		this.expect(true).toBe(true);
	}
}
