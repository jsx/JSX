/*EXPECTED
3
NaN
undefined
NaN
NaN
abc
abcundefined
undefined
undefinedundefined
undefinedundefined
*/
class Test {
	static function run() : void {
		var a : Nullable.<number> = 3;
		var b : Nullable.<number> = null;
		log a;
		log a + b;
		a = null;
		log a;
		log a + b;
		log b + a;

		var c : Nullable.<string> = "abc";
		var d : Nullable.<string> = null;
		log c;
		log c + d;
		c = null;
		log c;
		log c + d;
		log d + c;
	}
}
