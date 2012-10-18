/*EXPECTED
60
*/
class _Main {
	static function hoge(f: (int) -> (int) -> (int) -> int): int {
		return f(10)(20)(30);
	}
	static function main(args : string[]) : void {
		log _Main.hoge((x) -> (y) -> (z) -> x + y + z);
	}
}
