/*EXPECTED
1
2
3
*/
class _Main {
	static function main (args : string[]) : void {
		function foo () : g_Enumerable.<number> {
			yield 1;
			yield 2;
			yield 3;
		}

		var g = foo();
		log g.next();
		log g.next();
		log g.next();
	}
}

