/*JSX_OPTS
--enable-generator-emulation
*/
/*EXPECTED
1
2
42
2
4
84
*/
class _Main {

	static function main (args : string[]) : void {

		function * multiplier (scale : int) : Generator.<int,int> {
			var n = 0;
			do {
				n = yield n * scale;
			} while (true);
		}

		function * makeMultiplier () : Generator.<int,Generator.<int,int>> {
			var n = NaN;
			do {
				n = yield multiplier(n);
			} while (true);
		}

		// `int yield int yield int` should be parsed like `(int) yield (int yield int)`

		var factory : int yield int yield int = makeMultiplier();
		factory.next();
		var x1 = factory.next(1).value;
		x1.next();
		log x1.next(1).value;
		log x1.next(2).value;
		log x1.next(42).value;
		var x2 = factory.next(2).value;
		x2.next();
		log x2.next(1).value;
		log x2.next(2).value;
		log x2.next(42).value;
	}
}
