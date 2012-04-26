/*EXPECTED
4
5
*/

class Test {
	static function lambda(x : number) : function (: number) : number {
		return function (y : number) : number {
			return x + y;
		};
	}
	static function run() : void {
		var f = Test.lambda(3);
		log f(1);
		log f(2);
	}
}
