/*EXPECTED
true
false
3
*/
class Test {
	static function run() : void {
		var n = null : Nullable.<number>;
		log n == null;
		n = 3;
		log n == null;
		log n;
	}
}
