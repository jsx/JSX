/*EXPECTED
-42
*/

class Test {
	static function f(x : number) : number {
		log x;
	}
	static function f(x : string) : string {
		log x;
	}

	static function run() : void {
		Test.f(-42);
	}
}
