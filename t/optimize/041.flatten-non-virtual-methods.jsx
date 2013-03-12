/*EXPECTED
foo
*/
/*JSX_OPTS
--optimize staticize
*/
class _Main {
	final function foo () : void {
		log 'foo';
	}
	static function main(args : string[]) : void {
		var m = new _Main;
		m.foo();
	}
}
