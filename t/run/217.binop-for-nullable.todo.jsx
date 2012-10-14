/*EXPECTED
true
*/

class C.<T> {
	static const lt = function (a : Nullable.<T>, b : Nullable.<T>) : boolean {
		return a < b;
	};
}

class _Main {
	static function main(args : string[]) : void {
		log C.<number>.lt(10, 20);
	}
}
