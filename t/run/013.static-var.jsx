/*EXPECTED
3
4
*/
class _Main {
	static var n : number = 3;
	static function main(args : string[]) : void {
		log _Main.n;
		_Main.n = 4;
		log _Main.n;
	}
}
