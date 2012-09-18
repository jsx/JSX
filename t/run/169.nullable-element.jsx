/*EXPECTED
true
*/

class _Main {
	static function main(args : string[]) : void {
		var a = [ 0 ][-1];
		log a == null;
	}
}
