/*EXPECTED
1
undefined
*/
class _Main {
	static function main(args : string[]) : void {
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
