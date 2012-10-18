/*EXPECTED
abc
undefined
*/
class _Main {
	static function main(args : string[]) : void {
		var a = [ new String("abc") ];
		log (a[0] as String).toString();
		log a[1] as String;
	}
}
