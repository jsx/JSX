/*EXPECTED
foo
*/
/*JSX_OPTS
--optimize staticize
*/
abstract class Base {
	final function foo () : void {
		log 'foo';
	}
}
class _Main extends Base {
	static function main(args : string[]) : void {
		var m = new _Main;
		m.foo();
	}
}
