/*EXPECTED
2
2
*/
class _Main {
	static function applyNum.<T>(x : number, f : (number) -> T) : T {
		return f(x);
	}
	static function applyNum.<T>(x : string, f : (number) -> T) : T {
		return f(x as number);
	}
	static function main (args : string[]) : void {
		log _Main.applyNum(1, function (n) { return n * 2; });
		log _Main.applyNum("1", function (n) { return n * 2; });
	}
}
