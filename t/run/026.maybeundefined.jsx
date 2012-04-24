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
		var a : MayBeUndefined.<number> = 3;
		var b : MayBeUndefined.<number> = undefined;
		log a;
		log a + b;
		a = undefined;
		log a;
		log a + b;
		log b + a;

		var c : MayBeUndefined.<string> = "abc";
		var d : MayBeUndefined.<string> = undefined;
		log c;
		log c + d;
		c = undefined;
		log c;
		log c + d;
		log d + c;
	}
}
