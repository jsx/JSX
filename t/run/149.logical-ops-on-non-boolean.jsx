/*EXPECTED
true
true
false
true
false
true
false
true
false
true
*/

class Test {
	static function run() : void {
		log ! 0;
		log ! NaN;
		log ! 1;
		log ! "";
		log ! "abc";
		log ! null;
		log ! new String();
		log 1 || 0;
		log 0 || "";
		log 1 && "abc";
	}
}
