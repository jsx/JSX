/*EXPECTED
0

*/
class Outer.<T> {
	var m1 : T;
	class Inner.<U> {
		var m2 : T;
		var m3 : U;
	}
}

class _Main {
	static function main(args : string[]) : void {
		var outer = new Outer.<number>;
		var inner = new Outer.<number>.Inner.<string>; // Outer.<number> has already been instantiated
		log inner.m2;
		log inner.m3;
	}
}