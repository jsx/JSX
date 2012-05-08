/*EXPECTED
world
detected invalid cast, value is not a Map or null
*/

class Test {
	static function ok() : variant {
		return { hello: "world" };
	}
	static function ng() : variant {
		return "good bye";
	}
	static function say(h : Map.<string>) : void {
		log h["hello"];
	}
	static function run() : void {
		Test.say(Test.ok() as __noconvert__ Map.<string>);
		Test.say(Test.ng() as __noconvert__ Map.<string>);
	}
}
