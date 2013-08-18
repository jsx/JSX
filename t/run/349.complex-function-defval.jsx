/*EXPECTED
2
*/
class Foo.<T> {
	static function foo (cb : (T) -> T = function a (x) { return (function b (y : T) : T { return y + 1; })(x); }) : void {
		log cb(1);
	}
}

class _Main {
	static function main (args : string[]) : void {
		Foo.<number>.foo();
	}
}
