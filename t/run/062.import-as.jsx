/*EXPECTED
FooClass#constructor
FooClass#constructor
FooClass#say
*/

import "062.import-as/foo.jsx" into foo;

class Test extends foo.FooClass implements foo.FooInterface {
	function constructor() {
		foo.FooClass();
	}
	static function run() : void {
		new foo.FooClass();
		new Test();
		foo.FooClass.say();
	}
}
