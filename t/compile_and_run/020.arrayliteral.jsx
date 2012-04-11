/*EXPECTED
3
1
4
a
b
true
*/
class Test {
	static function run() : void {
		var a = [ 3, 1, 4 ];
		log a[0];
		log a[1];
		log a[2];
		var b = [ "a", "b", null ];
		log b[0];
		log b[1];
		log b[2] == null;
	}
}
