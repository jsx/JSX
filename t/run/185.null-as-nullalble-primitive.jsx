/*EXPECTED
undefined
3
*/
class Test {
	static function run() : void {
		var n = null : Nullable.<number>;
		log n;
		n = 3;
		log n;
	}
}
