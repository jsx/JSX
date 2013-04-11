/*EXPECTED
2
4
8
*/
class _Main {
	static function main (args : string[]) : void {
		function double (seed : number) : Enumerable.<number> {
			var t = seed;
			while (true) {
				yield t;
				t = t * 2;
			}
		}

		var a = double(2);
		log a.next();
		log a.next();
		log a.next();
	}
}