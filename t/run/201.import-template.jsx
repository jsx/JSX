/*EXPECTED
hidden
named
*/
import _Hidden from "201.import-template/hidden.jsx";
import "201.import-template/named.jsx" into ns;

class Test {
	static function run() : void {
		_Hidden.<Test>.say();
		ns.Named.<Test>.say();
	}
}
