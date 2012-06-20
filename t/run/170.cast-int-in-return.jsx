/*EXPECTED
0
0
*/
class Test {
	static function asInt(n : number) : int {
		return n;
	}
	static function run() : void {
		var i : int;
		i = 1 / 3;
		log i;
		i = Test.asInt(1 / 3);
		log i;
	}
}
