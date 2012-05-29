/*EXPECTED
foo
*/

import "132.import-alias-in-type-decl/foo.jsx" into foo;

class Test {
	static function f() : foo.Foo {
		return new foo.Foo();
	}
	static function run() : void {
		var f = Test.f();
	}
}
