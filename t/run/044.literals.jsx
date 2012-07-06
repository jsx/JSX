/*EXPECTED
null
true
false
NaN
Infinity
-Infinity
*/
class Test {
	static function run() : void {
		log null; // undefined by spec.
		log true;
		log false;
		log NaN;
		log +Infinity;
		log -Infinity;
	}
}
