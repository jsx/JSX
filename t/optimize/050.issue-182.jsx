/*EXPECTED
5
*/
/*JSX_OPTS
--optimize fold-const,dce
*/
class _Main {
	static function foo () : number {
		var a = true ? 1 : 2;
		if (! false) {
			a = 3;
		}
		if (true && false) {
			a = 4;
		}
		if (true || false) {
			a = 5;
		}
		return a;
	}
	static function main (args : string[]) : void {
		log _Main.foo();
	}
}