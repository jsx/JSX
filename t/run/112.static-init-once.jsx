/*EXPECTED
0
*/

// static vars must be initialized only once

class _Main {
	static const value = Math.random();

	static function main(args : string[]) : void {
		var v0 = _Main.value;
		var v1 = _Main.value;
		log v0 - v1;
	}
}
