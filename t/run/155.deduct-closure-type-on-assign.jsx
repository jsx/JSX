/*EXPECTED
4
*/

class _Main {
	static function main(args : string[]) : void {
		var f : (number) -> number;
		f = (n) -> n + 1;
		var n = f(3);
		log n;
	}
}
