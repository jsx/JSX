/*EXPECTED
FooClass#initialize
FooClass#initialize
FooClass#say
*/

import "062.import-as/foo.jsx" as foo;

class Test extends foo.FooClass implements foo.FooInterface {
	function initialize() {
		foo.FooClass();
	}
	static function run() : void {
		new foo.FooClass();
		new Test();
		foo.FooClass.say();
	}
}
