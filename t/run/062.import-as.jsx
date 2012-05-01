/*EXPECTED
Foo#say
*/

import "062.import-as/foo.jsx" as foo;

class Test {
	static function run() : void {
		foo.Foo.say();
	}
}
