/*EXPECTED
true
false
*/
class Test {
	static function run() : void {
		var h = { 1: "a" };
		log h.hasOwnProperty("1");
		log h.hasOwnProperty("2");
	}
}
