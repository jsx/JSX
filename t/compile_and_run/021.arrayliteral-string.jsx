/*EXPECTED
a
b
true
*/
class Test {
	static function run() : void {
		var a = [ "a", "b", null ];
		log a[0];
		log a[1];
		log a[2] == null;
	}
}
