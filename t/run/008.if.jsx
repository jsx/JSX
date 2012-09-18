/*EXPECTED
1
2
Fizz
4
Buzz
Fizz
7
8
Fizz
Buzz
11
Fizz
13
14
FizzBuzz
16
17
Fizz
19
Buzz
*/
class _Main {
	static function main(args : string[]) : void {
		for (var i = 1; i <= 20; ++i)
			if (i % 15 == 0)
				log "FizzBuzz";
			else if (i % 3 == 0) {
				log "Fizz";
			} else if (i % 5 == 0)
				log "Buzz";
			else
				log i;
	}
}
