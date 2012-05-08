/*EXPECTED
hello
detected invalid cast, value is not a function or null
*/

class Test {
	static function ok() : variant {
		return function () : void {
			log "hello";
		};
	}
	static function ng() : variant {
		return {} : Hash.<string>;
	}
	static function say(f : function () : void) : void {
		f();
	}
	static function run() : void {
		Test.say(Test.ok() as __nocheck__ function () : void);
		Test.say(Test.ng() as __nocheck__ function () : void);
	}
}
