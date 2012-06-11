/*EXPECTED
4
5
6
7
*/
class Test {
	static function simpleLambda(x : number) : (number) -> number {
		return (y : number) : number -> x + y;
	}
	static function complexLambda(x : number) : (number) -> number {
		return (y : number) : number -> { return x + y; };
	}
	static function run() : void {
		var f = Test.simpleLambda(3);
		log f(1);
		log f(2);
		var g = Test.complexLambda(3);
		log g(3);
		log g(4);
	}
}
