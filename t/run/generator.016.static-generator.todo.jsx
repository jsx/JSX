/*EXPECTED
1
2
3
*/
class _Main {
	static function foo () : Enumerable.<number> {
		yield 1;
		yield 2;
		yield 3;
	}
	static function main (args : string[]) : void {
		var f = _Main.foo();
		log f.next();
		log f.next();
		log f.next();
	}
}
