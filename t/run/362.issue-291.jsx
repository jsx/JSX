/*EXPECTED
ok
*/

class A {}
class B extends A {}

class Foo {
	static function foo (a : Map.<variant>) : void {}
	static function bar (a : Map.<int>) : void {}
	static function baz (a : Map.<A>) : void {}
}

class Bar {
	static function foo (a : Array.<variant>) : void {}
	static function bar (a : Array.<int>) : void {}
	static function baz (a : Array.<A>) : void {}
}

class _Main {

	static function main (args : string[]) : void {
		Foo.foo({ a : true, b : false });
		Foo.bar({ a : 1, b : 2, c : null });
		Foo.baz({ a : new B, b : new B });

		Bar.foo([ 1, 2, 3 ]);
		Bar.bar([ 1, null, 2 ]);
		Bar.baz([ new B, new B ]);

		log "ok";
	}

}
