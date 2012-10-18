/*EXPECTED
1,2,3
*/

class _Main {
	static function main(args : string[]) : void {
		log [1, 3, 2].sort((x, y) -> x - y).join(",");
	}
}
