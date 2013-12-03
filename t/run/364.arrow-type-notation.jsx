/*EXPECTED
3
7
[ 2, 3, 4 ]
[ 30, 40, 50 ]
*/
class _Main {
	static function main (args : string[]) : void {
		var f : number -> number -> number = x => {
			return y => {
				return x + y;
			};
		};
		log f(1)(2);
		log f(3)(4);
		var g : number -> number[] -> number[] = x => {
			return y => {
				return y.map(z => z + x);
			};
		};
		log g(1)([1, 2, 3]);
		log g(10)([20, 30, 40]);
	}
}
