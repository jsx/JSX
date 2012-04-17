/*EXPECTED
[object Object]
true
false
*/
class Test {
	static function run() : void {
		var h = { 1: "a" };
		log h.toString();
		log h.hasOwnProperty("1");
		log h.hasOwnProperty("2");
	}
}
