/*EXPECTED
123
*/
class _Main {
	static var m = { k: 123 };
	static function main(args : string[]) : void {
		var n = _Main.m["k"];
		log n;
	}
}
