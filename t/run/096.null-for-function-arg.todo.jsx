/*EXPECTED
null
*/

class Test {
	static function f(funcArg : function():void) : void {
		log funcArg;
	}

	static function run() : void {
		Test.f(null);
	}
}
