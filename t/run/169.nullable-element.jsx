/*EXPECTED
true
*/

class Test {
	static function run() : void {
		var a = [ 0 ][-1];
		log a == null;
	}
}
