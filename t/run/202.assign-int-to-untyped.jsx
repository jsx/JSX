/*EXPECTED
3
3.5
*/
class Test {
	static function run() : void {
		var i : int;
		i = 2;
		i += 1.5; // rounded to 3
		log i;
		var n = i; // n should become a number
		n += 0.5; // 3.5
		log n;
	}
}
