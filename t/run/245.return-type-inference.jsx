/*EXPECTED
42
*/
class _Main {
	static function main(args : string[]) : void {
		log (function fma (a : number, b : number, c : number) {
			return a * b + c;
		})(6, 6, 6);
	}
}