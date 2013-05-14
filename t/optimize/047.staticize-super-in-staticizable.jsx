/*EXPECTED
*/
/*JSX_OPTS
--optimize staticize,inline
*/
class Base {
	final function foo () : void {
		this;
	}
}
class Derived extends Base {
	final function bar () : void {
		super.foo();
	}
}
class _Main {
	static function main (args : string[]) : void {
		(new Derived).bar();
	}
}
