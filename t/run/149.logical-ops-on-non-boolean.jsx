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

class _Main {
	static function main(args : string[]) : void {
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
