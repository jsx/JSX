/*EXPECTED
5
*/
class Test {
	static function run() : void {
		for (var i = 0; i < 10; ++i)
			if (i == 5)
				break;
		log i;
	}
}
