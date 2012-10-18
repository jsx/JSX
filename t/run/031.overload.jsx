/*EXPECTED
1
1 2
1 2 3
*/
class _Main {
	static function f(x:int):void {
		log x;
	}
	static function f(x:int, y:int):void {
		log x, y;
	}
	static function f(x:int, y:int, z:int):void {
		log x, y, z;
	}
	static function main(args : string[]) : void {
		_Main.f(1);
		_Main.f(1, 2);
		_Main.f(1, 2, 3);
	}
}
