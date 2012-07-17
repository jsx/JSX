/*EXPECTED
2
*/
class Test {
	static function f(n : number) : number {
		return (n ? true : false) ? 2 : 1;
	}
	static function run() : void {
		log Test.f(3);
	}
}
