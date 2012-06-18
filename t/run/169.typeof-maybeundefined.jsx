/*EXPECTED
undefined
*/

class Test {
	static function run() : void {
		var a = [ 0 ][-1];
		log typeof a;
	}
}
