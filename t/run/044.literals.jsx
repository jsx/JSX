/*EXPECTED
null
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
		log undefined;
		log true;
		log false;
		log NaN;
		log +Infinity;
		log -Infinity;
	}
}
