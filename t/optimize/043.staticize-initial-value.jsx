/*EXPECTED
foo
*/
/*JSX_OPTS
--optimize staticize
*/
class Base {
	final function foo () : string {
		return 'foo';
	}
}
class _Main {
	static var x = new Base().foo();
	static function main(args : string[]) : void {
		log _Main.x;
	}
}
