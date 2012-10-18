/*EXPECTED
55
11
*/
class _Main {
	static function main(args : string[]) : void {
		var sum = 0;
		var i = 0;
		while (i++ < 10)
			sum += i;
		log sum;
		log i;
	}
}
