/*EXPECTED
42
*/
class _Main {
	static function main(args : string[]) : void {
		var f: (int) -> int = function(x : int) : int { return x + 10; };
		log f(32);
	}
}
