/*EXPECTED
FooClass#constructor
FooClass#constructor
FooClass#say
*/

import "062.import-as/foo.jsx" into foo;

class _Main extends foo.FooClass implements foo.FooInterface {
	function constructor() {
		foo.FooClass();
	}
	static function main(args : string[]) : void {
		new foo.FooClass();
		new _Main();
		foo.FooClass.say();
	}
}
