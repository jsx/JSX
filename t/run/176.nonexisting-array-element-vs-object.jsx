/*EXPECTED
true
*/
class _Main {
	static function main(args : string[]) : void {
		var a = [ "abc".match(/de/) ]; // produce null by not using the literal
		log a[1] == a[0];
	}
}
