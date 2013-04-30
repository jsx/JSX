/*EXPECTED
3
*/
/*JSX_OPTS
--optimize lto,unclassify
*/

class Foo {
	var n = 3;
	function f() : Foo {
		return this;
	}
	static function main(args : string[]) : void {
		log (new Foo).f().f().n;
	}
}

class _Main {
	static function main(args : string[]) : void {
		log (new Foo).f().f().n;
	}
}
