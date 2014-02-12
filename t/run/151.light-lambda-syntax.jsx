/*EXPECTED
4
5
6
7
8
9
*/
class _Main {
	static function simpleLambda(x : number) : (number) -> number {
		return (y : number) : number -> x + y;
	}
	static function complexLambda(x : number) : (number) -> number {
		return (y : number) : number -> { return x + y; };
	}
	static function es6ArrowLambda(x : number) : (number) -> number {
		return (y : number) : number => { return x + y; };
	}
	static function main(args : string[]) : void {
		var f = _Main.simpleLambda(3);
		log f(1);
		log f(2);
		var g = _Main.complexLambda(3);
		log g(3);
		log g(4);
		var h = _Main.es6ArrowLambda(3);
		log h(5);
		log h(6);
	}
}
