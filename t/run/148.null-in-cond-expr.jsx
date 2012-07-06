/*EXPECTED
abc
true
*/
class Test {
	static var b = true;
	static function run() : void {
		var a = Test.b ? new String("abc") : null;
		log a.toString();
		a = Test.b ? (null) : a;
		log a == null;
	}
}
