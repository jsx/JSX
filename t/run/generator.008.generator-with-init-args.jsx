/*EXPECTED
1
2
4
8
*/
class _Main {
	static function main (args : string[]) : void {
		function * makeDouble (seed : number) : Generator.<void,number> {
			var t = seed;
			while (true) {
				yield t;
				t = t * 2;
			}
		}

		var a = makeDouble(1);
		log a.next().value;
		log a.next().value;
		log a.next().value;
		log a.next().value;
	}
}
