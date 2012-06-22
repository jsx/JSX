/*EXPECTED
abc
undefined
*/
class Test {
	static function run() : void {
		var a = [ new String("abc") ];
		log (a[0] as String).toString();
		log a[1] as String;
	}
}
