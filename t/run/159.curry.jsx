/*EXPECTED
60
*/
class Test {
	static function hoge(f: (int) -> (int) -> (int) -> int): int {
		return f(10)(20)(30);
	}
	static function run() : void {
		log Test.hoge((x) -> (y) -> (z) -> x + y + z);
	}
}
