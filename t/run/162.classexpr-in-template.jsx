/*EXPECTED
1
*/

class _Main {
	static const n = 0;
	static function main(args : string[]) : void {
		var x = Hoge.<int>.n;
		log x;
	}
}
class Hoge.<T> {
	static const n = _Main.n + 1;
}
