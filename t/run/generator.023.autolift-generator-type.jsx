/*EXPECTED
0
1
2
*/
class _Main {
	static function main (args : string[]) : void {

		// Instead of `Generator.<void,int>`, just writing `int` at the place of return type.
		function * foo () : int {
			var c = 0;
			while (true)
				yield c++;
		}

		var gen : Generator.<void,int> = foo();

		log gen.next().value;
		log gen.next().value;
		log gen.next().value;
	}
}
