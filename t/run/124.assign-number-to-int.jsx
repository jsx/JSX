/*EXPECTED
1
1
1
1
undefined
*/

class Test {
	static function run() : void {
		var n : number = 1.3;
		var mn : MayBeUndefined.<number> = 1.3;
		var un : MayBeUndefined.<number> = undefined;
		var i : int;
		var mi : MayBeUndefined.<int>;
		log (i = n);
		log (i = mn);
		// runtime error log (i = un);
		log (mi = n);
		log (mi = mn);
		log (mn = un);
	}
}
