/*EXPECTED
55
11
*/
class Test {
	static function run() : void {
		var sum = 0;
		var i = 0;
		while (i++ < 10)
			sum += i;
		log sum;
		log i;
	}
}
