/*EXPECTED
1
2
Buzz
4
5
Buzz
7
8
Buzz
10
*/
class Test {
	static function run() : void {
		for (var i = 1; i <= 10; ++i)
			if (i % 3 == 0)
				log "Buzz";
			else
				log i;
	}
}
