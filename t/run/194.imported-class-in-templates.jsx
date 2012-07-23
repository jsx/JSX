/*EXPECTED
ok
*/

import "./194.imported-class-in-templates/b.jsx";

class Test {
	static function run() : void {
		log B.<string>.f();
	}
}
