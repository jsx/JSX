/*EXPECTED
1
2
3
4
*/
class _Main {
	static function main (args : string[]) : void {
		function foo () : g_Enumerable.<number> {
			yield 1;
			function bar () : g_Enumerable.<number> {
				yield 2;
				yield 3;
			}
			var b = bar();
			yield b.next();
			yield b.next();
			yield 4;
		}
		var f = foo();
		log f.next();
		log f.next();
		log f.next();
		log f.next();
	}
}