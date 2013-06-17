/*EXPECTED
10
20
30
*/

class _Main {
	static function f(i : int) : void {
		log i;
	}

	static function main(args : string[])  : void {
		_Main.f(10.5);

		var n = 20.5;
		_Main.f(n);

		var mn : Nullable.<number> = 30.5;
		_Main.f(mn);
	}
}
