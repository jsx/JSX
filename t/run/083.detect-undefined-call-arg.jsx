/*EXPECTED
undefined
null access
*/

class Test {
	static function f(n : Nullable.<number>) : void {
		log n;
	}
	static function g(n : number) : void {
		log n;
	}
	static function run() : void {
		var a = [ 3 ];
		a.pop();
		Test.f(a.pop());
		Test.g(a.pop());
	}
}
