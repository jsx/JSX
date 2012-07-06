/*EXPECTED
1
1
1
1
true
*/

class Test {
	static function run() : void {
		var n : number = 1.3;
		var mn : Nullable.<number> = 1.3;
		var un : Nullable.<number> = null;
		var i : int;
		var mi : Nullable.<int>;
		log (i = n);
		log (i = mn);
		// runtime error log (i = un);
		log (mi = n);
		log (mi = mn);
		log (mn = un) == null;
	}
}
