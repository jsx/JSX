/*EXPECTED
ok
*/
// make sure the syntax of js/dom* is correct

import "js/dom.jsx";
import "js/dom/canvas2d.jsx";
import "js/dom/webgl.jsx";

class Test {
	static function run() : void {
		log "ok";
	}
}
