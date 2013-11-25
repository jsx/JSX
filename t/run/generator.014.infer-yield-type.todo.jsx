/*EXPECTED
42
*/
class _Main {
	static function main (args : string[]) : void {
		log (function g() {
			yield 42;
		})().next();
	}
}