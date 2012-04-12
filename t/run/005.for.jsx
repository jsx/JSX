/*EXPECTED
45
*/
class Test {
	static function run() : void {
		var sum = 0;
		for (var i = 0; i < 10; ++i)
			sum += i;
		log sum;
	}
}
