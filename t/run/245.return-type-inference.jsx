/*EXPECTED
42
*/
class _Main {
	static function main(args : string[]) : void {
		function fma (a : number, b : number, c : number) {
			return a * b + c;
		}
		log fma(6, 6, 6);
	}
}