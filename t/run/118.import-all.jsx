/*EXPECTED
1
2
One
Two
*/

import "118.import-all/*.jsx";

class _Main {
	static function main(args : string[]) : void {
		new One();
		new Two();
		One.say();
		Two.say();
	}
}
