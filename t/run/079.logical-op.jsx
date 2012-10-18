/*EXPECTED
false
false
false
true
false
true
true
true
*/

class _Main {
	static function main(args : string[]) : void {
		log false && false;
		log false && true;
		log true && false;
		log true && true;
		log false || false;
		log false || true;
		log true || false;
		log true || true;
	}
}
