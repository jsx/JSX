/*EXPECTED
1
2
3
4
5
10
*/
class Test {
	static function a(x : number) : number {
		log x;
		return x;
	}
	static function run() : void {
		log Test.a(1) + Test.a(2) * (Test.a(3) + Test.a(4)) - Test.a(5);
	}
}
