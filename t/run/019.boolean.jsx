/*EXPECTED
false
true
false
true
false
true
*/
class _Main {
	static function main(args : string[]) : void {
		log false;
		log !false;
		log !!false;
		log true;
		log !true;
		log !!true;
	}
}
