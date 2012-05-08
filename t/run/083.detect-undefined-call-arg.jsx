/*EXPECTED
undefined
detected assignment of 'undefined' to type 'MayBeUndefined.<number>'
*/

class Test {
	static function f(n : MayBeUndefined.<number>) : void {
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
