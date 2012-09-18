/*EXPECTED
16
10
100
false
true
true
false
*/

class _Main {
	static function main(args : string[]) : void {
		// local variable named parseInt() etc. are allowed
		var parseInt = 0;
		var parseFloat = 0;
		var isNaN = 0;
		var isFinite = 0;

		log Number.parseInt("0x10");
		log Number.parseInt("010", 10);
		log Number.parseFloat("1e2");
		log Number.isNaN(42);
		log Number.isNaN(NaN);
		log Number.isFinite(42);
		log Number.isFinite(Infinity);
	}
}
