/*EXPECTED
1
2
One
Two
*/

import "119.import-all-into/*.jsx" into N;

class _Main {
	static function main(args : string[]) : void {
		new N.One();
		new N.Two();
		N.One.say();
		N.Two.say();
	}
}
