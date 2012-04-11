/*EXPECTED
1
2
2
*/
class Test {
	static function a(x : number) : number {
		log x;
		return x;
	}
	static function run() : void {
		log ("abc", Test.a(1), Test.a(2));
	}
}
