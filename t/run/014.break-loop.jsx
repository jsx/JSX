/*EXPECTED
5
*/
class _Main {
	static function main(args : string[]) : void {
		for (var i = 0; i < 10; ++i)
			if (i == 5)
				break;
		log i;
	}
}
