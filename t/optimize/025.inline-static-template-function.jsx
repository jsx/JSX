/*EXPECTED
4
abcdef
*/
/*JSX_OPTS
--optimize inline,fold-const
*/
class Adder.<T> {
	static function f(x : T, y : T) : T {
		return x + y;
	}
}

class _Main {
	static function main(args : string[]) : void {
		var n = Adder.<number>.f(1, 3);
		log n;
		var s = Adder.<string>.f("abc", "def");
		log s;
	}
}
