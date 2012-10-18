/*EXPECTED
abc
true
*/
class _Main {
	static var b = true;
	static function main(args : string[]) : void {
		var a = _Main.b ? new String("abc") : null;
		log a.toString();
		a = _Main.b ? (null) : a;
		log a == null;
	}
}
