/*EXPECTED
a 1
b 1
c 1
a 2
b 2
c 2
a 3
b 3
c 3
*/
class _Main {
	static function main (args : string[]) : void {
		function * g(prefix : string) : Generator.<void,string> {
			yield prefix + "1";
			yield prefix + "2";
			yield prefix + "3";
		}

		var f0 = g("a ");
		var f1 = g("b ");
		var f2 = g("c ");
		for (var i = 0; i < 3; ++i) {
			log f0.next().value;
			log f1.next().value;
			log f2.next().value;
		}
	}
}
