/*EXPECTED
foo
*/

import "132.import-alias-in-type-decl/foo.jsx" into foo;

class _Main {
	static function f() : foo.Foo {
		return new foo.Foo();
	}
	static function main(args : string[]) : void {
		var f = _Main.f();
	}
}
