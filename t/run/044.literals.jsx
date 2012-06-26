/*EXPECTED
undefined
true
false
NaN
Infinity
-Infinity
*/
class Test {
	static function run() : void {
		log null;
		log true;
		log false;
		log NaN;
		log +Infinity;
		log -Infinity;
	}
}
