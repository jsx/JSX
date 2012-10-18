/*EXPECTED
45
*/
class _Main {
	static function main(args : string[]) : void {
		var sum = 0;
		for (var i = 0; i < 10; ++i)
			sum += i;
		log sum;
	}
}
