/*EXPECTED
1
2
2
*/
class _Main {
	static function a(x : number) : number {
		log x;
		return x;
	}
	static function main(args : string[]) : void {
		log ("abc", _Main.a(1), _Main.a(2));
	}
}
