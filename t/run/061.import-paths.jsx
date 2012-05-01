/*EXPECTED
B
A
*/

import "061.import-paths/a/a.jsx";
import "061.import-paths/b/b.jsx";

class Test {
	static function run() : void {
		A.callB();
		B.callA();
	}
}
