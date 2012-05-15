/*EXPECTED
_Private1
_Private2
_Private3
*/

import "063.import-by-name/foo.jsx";
import _Private1, _Private2 from "063.import-by-name/foo.jsx";
import _Private3 from "063.import-by-name/foo.jsx" into foo;

class Test {
	static function run() : void {
		_Private1.say();
		_Private2.say();
		foo._Private3.say();
	}
}
