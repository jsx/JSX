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

class Test {
	static function run() : void {
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
