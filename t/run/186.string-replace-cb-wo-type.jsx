/*EXPECTED
A0B0C
*/
class Test {
	static function run() : void {
		var s = "a0b0c".replace(/[a-z]/g, (m) -> m.toUpperCase());
		log s;
	}
}
