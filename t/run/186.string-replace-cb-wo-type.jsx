/*EXPECTED
A0B0C
*/
class _Main {
	static function main(args : string[]) : void {
		var s = "a0b0c".replace(/[a-z]/g, (m) -> m.toUpperCase());
		log s;
	}
}
