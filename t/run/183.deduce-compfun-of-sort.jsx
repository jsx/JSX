/*EXPECTED
1,2,3
*/

class Test {
	static function run() : void {
		log [1, 3, 2].sort((x, y) -> x - y).join(",");
	}
}
