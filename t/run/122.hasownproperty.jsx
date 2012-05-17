/*EXPECTED
true
false
*/

class Test {
	static function run() : void {
		var m = {
			hasOwnProperty: 1
		};
		log m.hasOwnProperty("hasOwnProperty");
		log m.hasOwnProperty("n");
	}
}
