/*EXPECTED
foo,bar
*/

import "./131.assign-array-of-imported-class/module.jsx";

class Test {

	static function run() : void {
        var a : string[] = C.foo;
		log a.join(",");
	}
}
