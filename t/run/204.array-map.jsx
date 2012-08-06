/*EXPECTED
1,2,3
*/
class Test {
	static function run() : void {
		log [ 1, 2, 3 ].map.<string>((n) -> n as string).join(",");
	}
}
