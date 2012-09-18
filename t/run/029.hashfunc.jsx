/*EXPECTED
true
false
*/
class _Main {
	static function main(args : string[]) : void {
		var h = { 1: "a" };
		log h.hasOwnProperty("1");
		log h.hasOwnProperty("2");
	}
}
