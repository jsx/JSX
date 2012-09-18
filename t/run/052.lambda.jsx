/*EXPECTED
4
5
*/

class _Main {
	static function lambda(x : number) : function (: number) : number {
		return function (y : number) : number {
			return x + y;
		};
	}
	static function main(args : string[]) : void {
		var f = _Main.lambda(3);
		log f(1);
		log f(2);
	}
}
