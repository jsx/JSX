/*EXPECTED
world
detected invalid cast, value is not a Hash or null
*/

class Test {
	static function ok() : variant {
		return { hello: "world" };
	}
	static function ng() : variant {
		return "good bye";
	}
	static function say(h : Hash.<string>) : void {
		log h["hello"];
	}
	static function run() : void {
		Test.say(Test.ok() as __nocheck__ Hash.<string>);
		Test.say(Test.ng() as __nocheck__ Hash.<string>);
	}
}
