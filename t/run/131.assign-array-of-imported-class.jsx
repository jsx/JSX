/*EXPECTED
foo,bar
*/

import "./131.assign-array-of-imported-class/module.jsx";

class _Main {

	static function main(args : string[]) : void {
        var a : string[] = C.foo;
		log a.join(",");
	}
}
