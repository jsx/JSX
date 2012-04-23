/*EXPECTED
1
undefined
*/
class Test {
	static function run() : void {
		var a = {
			x: 3,
			y: 1,
			z: 4
		};
		log a["y"];
		delete a["y"];
		log a["y"];
	}
}
