/*EXPECTED
42
42
43
43
44
44
*/

class C.<T> {
	static function f() : number {
		for (;;) {
			return 42;
		}
	}
	static function g() : number {
		var i = 0;
		while (i == 0) {
			break;
		}
		return 43;
	}
	static function h() : void {
		log 44;
		return;
	}
}

class _Main {
	static function main(args : string[]) : void {
		log C.<number>.f();
		log C.<string>.f();
		log C.<number>.g();
		log C.<string>.g();
		C.<number>.h();
		C.<string>.h();
	}
}

