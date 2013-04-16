/*EXPECTED
hello
*/
/*JSX_OPTS
--optimize inline
*/
class _Main {

	static function foo (f : () -> void) : void {
		log 'hello';
	}

	static function main (args : string[]) : void {
		(function bar () : void {
			_Main.foo(bar);
		})();
	}

}