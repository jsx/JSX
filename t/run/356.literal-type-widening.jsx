/*EXPECTED
*/
class A {
}

class B extends A {
}

class _Main {
	static function foo (v : Map.<variant>) : void {}
	static function bar (a : Array.<variant>) : void {}
	static function baz (a : Array.<A>) : void {}
	static function main (args : string[]) : void {
		_Main.foo({a : 1, b : 2}); // Map.<number> -> Map.<variant>
		_Main.bar([1, 2]);	   // Array.<number> -> Map.<variant>
		_Main.baz([ new B ]);	   // Array.<B> -> Array.<A>
	}
}
