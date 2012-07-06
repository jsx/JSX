/*EXPECTED
3
null
null access
*/
class Test {
	static function run() : void {
		var a : Nullable.<number> = 3;
		var b : Nullable.<number> = null;
		log a;
		log b; // check that something indicatinng "null" is being printed
		log a + b;
	}
}
