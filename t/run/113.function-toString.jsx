/*EXPECTED
string
*/

class _Main {
	static function main(args : string[]) : void {
		var a : variant = _Main.main.toString();
		log typeof a;
	}
}
