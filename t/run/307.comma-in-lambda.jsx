/*EXPECTED
10
20
30
*/
class _Main {
	static function main (args : string[]) : void {
		var lambdas = {
			"foo" : () -> 10,
			"bar" : () -> (0, 20),
			"baz" : () -> 30
		};
		log lambdas["foo"]();
		log lambdas["bar"]();
		log lambdas["baz"]();
	}
}
