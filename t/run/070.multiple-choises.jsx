/*EXPECTED
-42
*/

class Test {
	static function f(x : number) : number {
		log x;
		return x;
	}
	static function f(x : string) : string {
		log x;
		return x;
	}

	static function run() : void {
		Test.f(-42);
	}
}
