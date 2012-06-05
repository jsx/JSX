/*EXPECTED
1,2,3,1
*/
class Test {
	static function f() : void {
		var a : Array.<MayBeUndefined.<number>>;
	}
}
