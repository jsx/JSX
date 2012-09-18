/*EXPECTED
25
*/
class _Main {
	static function main(args : string[]) : void {
		var sum = 0;
		for (var i = 0; i < 10; ++i) {
			if (i % 2 == 0)
				continue;
			sum += i;
		}
		log sum;
	}
}
