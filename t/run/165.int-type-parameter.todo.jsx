/*EXPECTED
10
20
30
*/

class Test {
	static function f(i : int) : void {
		log i;
	}

	static function run()  : void {
		Test.f(10.5);

		var n = 20.5;
		Test.f(n);

		var mn : Nullable.<number> = 30.5;
		Test.f(mn);
	}
}
