/*EXPECTED
3
4
*/
class Test {
	static var n : number = 3;
	static function run() : void {
		log Test.n;
		Test.n = 4;
		log Test.n;
	}
}
