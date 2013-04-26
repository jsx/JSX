/*EXPECTED
1
2
3
4
*/
class _Main {
	function bar () : g_Enumerable.<number> {
		yield 1;
		yield 2;
	}
	function foo () : g_Enumerable.<number> {
		var b = this.bar();
		try {
			while (true) {
				yield b.next();
			}
		} catch (e : g_StopIteration) {
			// pass
		}
		yield 3;
		yield 4;
	}

	static function main (args : string[]) : void {
		var g = (new _Main).foo();
		log g.next();
		log g.next();
		log g.next();
		log g.next();
	}
}