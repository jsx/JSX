/*EXPECTED
42
*/
class _Main {
	static function main(args : string[]) : void {

		// function statement
		function square (a : number) {
			return a * a;
		}

		// function expression
		var fma = function (a : number, b : number, c : number) {
		};

		log fma(square(2), 10, 2);
	}
}