/*EXPECTED
true
*/
class Test {
	static function run() : void {
		var a = [ "abc".match(/de/) ]; // produce null by not using the literal
		log a[1] == a[0];
	}
}
