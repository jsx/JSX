/*EXPECTED
false
true
false
true
false
true
*/
class Test {
	static function run() : void {
		log false;
		log !false;
		log !!false;
		log true;
		log !true;
		log !!true;
	}
}
