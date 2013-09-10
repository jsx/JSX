/*JSX_OPTS
--optimize inline
*/
/*EXPECTED
*/
class _Main {
	static function foo (n : number) : void {
		n = 1;
	}
	static function main (args : string[]) : void {
		_Main.foo(1);
	}
}
