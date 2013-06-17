/*EXPECTED
*/
class Foo {
	function foo (a : string) : void {
	}
	function foo (a : number) : void {
	}
}
class _Main {
	static function main (args : string[]) : void {
		(new Foo).foo;
	}
}