/*EXPECTED
45
10
*/
class Test {
	static function run() : void {
		var sum = 0;
		var i = 0;
		do {
			sum += i;
		} while (++i < 10);
		log sum;
		log i;
	}
}
