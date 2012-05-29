/*EXPECTED
3
undefined
*/

class Test {
	static function run() : void {
		var m = new Map.<number>;
		m["a"] = 3;
		log m["a"];
		log m["b"];
	}
}
