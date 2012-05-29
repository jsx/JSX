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

		var canvas = dom.createCanvas();
		var cx = canvas.getContext("2d");
		assert cx != null;
		log canvas.width;
		log canvas.height;

		var image = dom.createImage();
		image.src = "bar.png";
		log image.width;
		log image.height;
	}


	function test_ok() : void {
		this.expect(true).toBe(true);
	}
}
