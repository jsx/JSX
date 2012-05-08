/*EXPECTED
3
detected invalid cast, value is not a number
*/

class Test {
	static function ok() : variant {
		return 3;
	}
	static function ng() : variant {
		return false;
	}
	static function say(b : number) : void {
		log b;
	}
	static function run() : void {
		Test.say(Test.ok() as __noconvert__ number);
		Test.say(Test.ng() as __noconvert__ number);
	}
}
