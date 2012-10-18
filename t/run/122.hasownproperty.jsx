/*EXPECTED
true
false
*/

class _Main {
	static function main(args : string[]) : void {
		var m = {
			hasOwnProperty: 1
		};
		log m.hasOwnProperty("hasOwnProperty");
		log m.hasOwnProperty("n");
	}
}
