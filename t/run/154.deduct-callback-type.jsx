/*EXPECTED
10
24
*/
class Test {
	static function run() : void {
		var a = [ 1, 2, 3, 4 ];
		var sum = 0;
		a.forEach(function (e) {
			sum += e;
		});
		log sum;
		var prod = 1;
		a.forEach((e, i) -> { prod *= e; });
		log prod;
	}
}
