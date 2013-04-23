/*EXPECTED
2
4
8
*/
class _Main {
	static function main (args : string[]) : void {
		function makeDouble (seed : number) : g_Enumerable.<number> {
			var t = seed;
			while (true) {
				yield t;
				t = t * 2;
			}
		}

		var a = makeDouble(2);
		log a.next();
		log a.next();
		log a.next();
	}
}
