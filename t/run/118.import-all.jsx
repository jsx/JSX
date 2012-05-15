/*EXPECTED
1
2
One
Two
*/

import "118.import-all/*.jsx";

class Test {
	static function run() : void {
		new One();
		new Two();
		One.say();
		Two.say();
	}
}
