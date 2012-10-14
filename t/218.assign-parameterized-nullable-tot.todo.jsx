/*EXPECTED
10
*/

class C.<T> {
	static const toT = function (a : Nullable.<T>) : T {
		return a;
	};
}

class _Main {
	static function main(args : string[]) : void {
		log C.<number>.toT(10);
	}
}
