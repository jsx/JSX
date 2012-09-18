/*EXPECTED
1,2,3
*/
class K.<T> {
	static function f() : T[] {
		return [ 1, 2, 3 ];
	}
}
class _Main {
	static function main(args : string[]) : void {
		var a : Array.<number> = K.<Nullable.<number>>.f();
		log a.join(",");
	}
}
