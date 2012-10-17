/*EXPECTED
10
*/

class C.<T> {
	static const f = function (a : T) : T {
		return a;
	};
}

class _Main {
	static function main(args : string[]) : void {
		log C.<number>.f(10);
	}
}
