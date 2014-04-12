/*EXPECTED
*/


// you can use `T yield U` syntax wherever type declaration may appear

class _Main {

	var m1 : int yield string;

	function m2 (a : int yield string) : void {
		return;
	}

	function m3 () : int yield string {
		return this.m1;
	}

	static function main (args : string[]) : void {

		var m4 : int yield string = null;

		var m5 : Generator.<int, string> = null;

		// m4 and m5 are compatible
		m5 = m4;
		m4 = m5;

	}
}
