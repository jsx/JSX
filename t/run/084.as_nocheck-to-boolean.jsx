/*EXPECTED
true
detected invalid cast, value is not a boolean
*/

class Test {
	static function ok() : variant {
		return true;
	}
	static function ng() : variant {
		return null;
	}
	static function say(b : boolean) : void {
		log b;
	}
	static function run() : void {
		Test.say(Test.ok() as __noconvert__ boolean);
		Test.say(Test.ng() as __noconvert__ boolean);
	}
}
