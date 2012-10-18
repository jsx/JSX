/*EXPECTED
true
false
3
*/
class _Main {
	static function main(args : string[]) : void {
		var n = null : Nullable.<number>;
		log n == null;
		n = 3;
		log n == null;
		log n;
	}
}
