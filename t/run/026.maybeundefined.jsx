/*EXPECTED
3
undefined
*/
class Test {
	static function run() : void {
		var a : MayBeUndefined<number> = 3;
		log a;
		a = undefined;
		log a;
	}
}
