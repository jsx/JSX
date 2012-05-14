/*EXPECTED
0
*/

// static vars must be initialized only once

import "timer.jsx";

class Test {
	static const time = Date.now();

	static function run() : void {
		var t0 = Test.time;

		Timer.setTimeout(function() : void {
			var t1 = Test.time;

			log t1 - t0;
		}, 10);
	}
}
