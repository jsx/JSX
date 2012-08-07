/*EXPECTED
1,2,3
*/
class Test {
	static function run() : void {
		log [ 1, 2, 3 ].map.<string>((n : Nullable.<number>) : Nullable.<string> -> n as string).join(",");
	}
}
