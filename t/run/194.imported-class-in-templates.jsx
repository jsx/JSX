/*EXPECTED
ok
*/

import "./194.imported-class-in-templates/b.jsx";

class _Main {
	static function main(args : string[]) : void {
		log B.<string>.f();
	}
}
