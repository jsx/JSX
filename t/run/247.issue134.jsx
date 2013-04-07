/*EXPECTED
10
*/
class Foo {

	var a : number = 0;

	function bar () : void {
		this.a = 10;

		function constructor () : void {
		}

		constructor();

		log this.a;
	}
}

class _Main {
	static function main (args : string[]) : void {
		new Foo().bar();
	}
}