/*EXPECTED
static
*/

class _Main {
	static const STATIC_VAR = "static";

	static function main(args : string[]) : void {
		log _Main.STATIC_VAR;
	}
}

