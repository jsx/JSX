/*EXPECTED
123
*/
/*JSX_OPTS
--optimize unbox
*/
final class K {
	var x = 123;
}
class _Main {
	static function main(args : string[]) : void {
		var k = new K;
		function f() : number {
			return k.x;
		}
		log f();
	}
}
