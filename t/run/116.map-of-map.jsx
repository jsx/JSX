/*EXPECTED
1
*/

class Test {
	static function run() : void {
		var a = { a: { a: 1 } };
		log a["a"]["a"];
	}
}
