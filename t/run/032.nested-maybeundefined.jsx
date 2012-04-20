/*EXPECTED
7,6,5,4,3,2,1,
*/
class Test {
	static function revcmp(x:MayBeUndefined.<number>, y:MayBeUndefined.<number>):number {
		return y - x;
	}
	static function run() : void {
		var a = [ undefined, 1, 2, 3, 7, 6, 5, 4 ] : MayBeUndefined.<number>[];
		log a.sort(Test.revcmp).join();
	}
}
