/*EXPECTED
0
0
*/
class _Main {
	static function asInt(n : number) : int {
		return n;
	}
	static function main(args : string[]) : void {
		var i : int;
		i = 1 / 3;
		log i;
		i = _Main.asInt(1 / 3);
		log i;
	}
}
