/*EXPECTED
2
*/
class _Main {
	static function f(n : number) : number {
		return (n ? true : false) ? 2 : 1;
	}
	static function main(args : string[]) : void {
		log _Main.f(3);
	}
}
