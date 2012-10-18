/*EXPECTED
zero
undefined
zero
one
undefined
undefined
two
*/

class _Main {
	static function main(args : string[]) : void {
		var a = [ "zero" ];
		log a[0];
		log a[1];
		a[1] = "one";
		log a[0];
		log a[1];
		(a = [] : string[])[2] = "two";
		log a[0];
		log a[1];
		log a[2];
	}
}
