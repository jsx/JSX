/*EXPECTED
0
*/

// static vars must be initialized only once

class Test {
	static const value = Math.random();

	static function run() : void {
		var v0 = Test.value;
		var v1 = Test.value;
		log v0 - v1;
	}
}
