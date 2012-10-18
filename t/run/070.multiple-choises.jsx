/*EXPECTED
-42
*/

class _Main {
	static function f(x : number) : number {
		log x;
		return x;
	}
	static function f(x : string) : string {
		log x;
		return x;
	}

	static function main(args : string[]) : void {
		_Main.f(-42);
	}
}
