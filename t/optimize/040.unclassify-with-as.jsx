/*EXPECTED
100
*/
/*JSX_OPTS
--optimize lto,unclassify
*/

class MyObject {
	var x : int;

	function constructor (x : int) {
		this.x = x;
	}
}

class _Main {
	static function f() : Object {
		return new MyObject(100);
	}
	static function main(args : string[]) : void {
		log (_Main.f() as MyObject).x;
	}
}
