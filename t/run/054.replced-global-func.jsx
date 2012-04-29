/*EXPECTED
16
10
100
false
true
true
false
*/

class Test {
	static function run() : void {
		log Number.parseInt("0x10");
		log Number.parseInt("010", 10);
		log Number.parseFloat("1e2");
		log Number.isNaN(42);
		log Number.isNaN(NaN);
		log Number.isFinite(42);
		log Number.isFinite(Infinity);
	}
}
