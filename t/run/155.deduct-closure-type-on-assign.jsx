/*EXPECTED
4
*/

class Test {
	static function run() : void {
		var f : (number) -> number;
		f = (n) -> n + 1;
		var n = f(3);
		log n;
	}
}
