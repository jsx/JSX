/*EXPECTED
1
1 2
1 2 3
*/
class Test {
	static function f(x:int):void {
		log x;
	}
	static function f(x:int, y:int):void {
		log x, y;
	}
	static function f(x:int, y:int, z:int):void {
		log x, y, z;
	}
	static function run() : void {
		Test.f(1);
		Test.f(1, 2);
		Test.f(1, 2, 3);
	}
}
