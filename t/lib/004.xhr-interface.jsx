
import "test-case.jsx";
import "js/web.jsx";

class _Test extends TestCase {

	static function f() : void {
		var xhr = new XMLHttpRequest();

		xhr.addEventListener("readystatechange", function(e : Event) : void {
			if(xhr.readyState == XMLHttpRequest.DONE) {
				log xhr.responseText;
			}
		});
		xhr.open("GET", "http://example.com");
		xhr.send();
	}


	function test_xhr() : void {
		this.expect(true, "compile").toBe(true);
	}
}
