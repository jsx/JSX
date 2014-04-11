/*EXPECTED
1
false
2
false
3
true
*/
class _Main {
	static function main(args : string[]) : void {
		function * foo () : Generator.<void,int> {
			yield 1;
			yield 2;
			return 3;
		}
		var g = foo();
		for (var i = 0; i < 3; ++i) {
			var k = g.next();
			log k.value;
			log k.done;
		}
	}
}
