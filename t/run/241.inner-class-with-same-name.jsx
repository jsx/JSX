/*EXPECTED
foo
bar
*/
class Foo {
	class Inner {
		static var C = "foo";
	}
}

class Bar {
	class Inner {
		static var C = "bar";
	}
}

class _Main {
	static function main(args : string[]) : void {
		log Foo.Inner.C;
		log Bar.Inner.C;
	}
}
