/*EXPECTED
1
1
3
2
3
*/
class _Main {
	static function main (args : string[]) : void {
		function * foo (n : number) : Generator.<void,number> {
			while (true) {
				switch (n) {
				case 1:
					yield n;
					// fallthrough
				case 2:
					yield n;
					n = 3;
					break;
				default:
					yield n;
					n = 2;
					break;
				}
			}
		}

		var f = foo(1);
		log f.next().value;
		log f.next().value;
		log f.next().value;
		log f.next().value;
		log f.next().value;
	}
}
