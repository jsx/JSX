/*EXPECTED
1
*/

class Test {
	static const n = 0;
	static function run() : void {
		var x = Hoge.<int>.n;
		log x;
	}
}
class Hoge.<T> {
	static const n = Test.n + 1;
}
