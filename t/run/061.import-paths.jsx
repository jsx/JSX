/*EXPECTED
B
A
*/

import "061.import-paths/a/a.jsx";
import "061.import-paths/b/b.jsx";

class _Main {
	static function main(args : string[]) : void {
		A.callB();
		B.callA();
	}
}
