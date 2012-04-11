/*EXPECTED
25
*/
class Test {
	static function run() : void {
		var sum = 0;
		for (var i = 0; i < 10; ++i) {
			if (i % 2 == 0)
				continue;
			sum += i;
		}
		log sum;
	}
}
