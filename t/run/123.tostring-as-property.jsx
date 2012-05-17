/*EXPECTED
[object Object]
*/

class Test {
	static function run() : void {
		var m = {
			toString: 1
		};
		log m.toString();
	}
}
