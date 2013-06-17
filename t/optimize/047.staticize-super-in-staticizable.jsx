/*EXPECTED
bar
*/
/*JSX_OPTS
--optimize staticize,inline
*/
class Base {
	var _p = "bar";
	final function foo () : string{
		return this._p;
	}
}
class Derived extends Base {
	final function bar () : string {
		return super.foo();
	}
}
class _Main {
	static function main (args : string[]) : void {
		log new Derived().bar();
	}
}
