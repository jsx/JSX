import "js/web.jsx";

class _Main {
	static function main(args : string[]) : void {
		log "application start";

		dom.id("run").addEventListener("click", function (e) {
			e.preventDefault();
			e.stopPropagation();

			dom.window.alert("Hello, JSX!");
		});
	}
}
