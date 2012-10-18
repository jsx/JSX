/*EXPECTED
undefined
null access
*/

class _Main {
	static function f(n : Nullable.<number>) : void {
		log n;
	}
	static function g(n : number) : void {
		log n;
	}
	static function main(args : string[]) : void {
		var a = [ 3 ];
		a.pop();
		_Main.f(a.pop());
		_Main.g(a.pop());
	}
}
