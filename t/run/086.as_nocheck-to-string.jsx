/*EXPECTED
abc
detected invalid cast, value is not a string
*/

class Test {
	static function ok() : variant {
		return "abc";
	}
	static function ng() : variant {
		return [1];
	}
	static function say(s : string) : void {
		log s;
	}
	static function run() : void {
		Test.say(Test.ok() as __noconvert__ string);
		Test.say(Test.ng() as __noconvert__ string);
	}
}
