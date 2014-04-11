/*EXPECTED
1
2
3
4
*/
class _Main {
	static function main (args : string[]) : void {
		function * foo () : Generator.<void,number> {
			yield 1;
			function * bar () : Generator.<void,number> {
				yield 2;
				yield 3;
			}
			var b = bar();
			yield b.next().value;
			yield b.next().value;
			yield 4;
		}
		var f = foo();
		log f.next().value;
		log f.next().value;
		log f.next().value;
		log f.next().value;
	}
}
