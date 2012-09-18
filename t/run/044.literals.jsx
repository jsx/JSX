/*EXPECTED
null
true
false
NaN
Infinity
-Infinity
*/
class _Main {
	static function main(args : string[]) : void {
		log null; // undefined by spec.
		log true;
		log false;
		log NaN;
		log +Infinity;
		log -Infinity;
	}
}
