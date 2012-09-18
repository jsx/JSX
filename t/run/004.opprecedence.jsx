/*EXPECTED
1
2
3
4
5
10
*/
class _Main {
	static function a(x : number) : number {
		log x;
		return x;
	}
	static function main(args : string[]) : void {
		log _Main.a(1) + _Main.a(2) * (_Main.a(3) + _Main.a(4)) - _Main.a(5);
	}
}
