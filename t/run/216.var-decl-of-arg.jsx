/*EXPECTED
0
999
*/
class _Main {
	static function main(args : string[]) : void {
		function f(n : number) : void {
			if (n != 0) {
				var n = 999;
			}
			log n;
		}
		f(0);
		f(1);
	}
}
