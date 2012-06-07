/*EXPECTED
42
*/
class Test {
	static function run() : void {
		var f: (int) -> int = function(x : int) : int { return x + 10; };
		log f(32);
	}
}
